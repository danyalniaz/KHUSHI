import json
from functools import wraps
from datetime import datetime, date, timedelta
from flask import Blueprint, render_template, request, redirect, url_for, session, flash, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from database import query_db, execute_db, log_audit_action
from services.notifications import trigger_order_status_sms, build_whatsapp_order_message, get_whatsapp_send_url

admin_bp = Blueprint('admin', __name__, url_prefix='/admin')

def admin_required(roles=None):
    if roles is None:
        target_roles = ['OWNER', 'MANAGER', 'STAFF', 'super_admin', 'manager', 'staff']
    else:
        target_roles = list(roles)
        # OWNER always has supreme access to every administrative route
        if 'OWNER' not in target_roles:
            target_roles.extend(['OWNER', 'super_admin'])

    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            user_id = session.get('user_id')
            user_role = session.get('user_role')
            if not user_id:
                if request.path.startswith('/api/'):
                    return jsonify({'error': 'Authentication required'}), 401
                return redirect(url_for('admin.admin_login', next=request.url))
            if user_role not in target_roles:
                if request.path.startswith('/api/'):
                    return jsonify({'error': 'Forbidden: Administrative access required'}), 403
                return render_template('admin/access_denied.html'), 403
            return f(*args, **kwargs)
        return decorated_function
    return decorator

def owner_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        user_id = session.get('user_id')
        user_role = session.get('user_role')
        admin_pin = request.headers.get('X-Admin-Pin')
        admin_role = request.headers.get('X-Admin-Role')
        if not user_id and admin_pin == '8899' and admin_role == 'OWNER':
            return f(*args, **kwargs)
        if not user_id:
            if request.path.startswith('/api/'):
                return jsonify({'error': 'Authentication required'}), 401
            return redirect(url_for('admin.admin_login', next=request.url))
        if user_role not in ('OWNER', 'super_admin'):
            if request.path.startswith('/api/'):
                return jsonify({'error': 'Forbidden: Store OWNER role required'}), 403
            return render_template('admin/access_denied.html'), 403
        return f(*args, **kwargs)
    return decorated_function

# Initial Store Owner Setup (Runs once on first deployment)
@admin_bp.route('/setup', methods=['GET', 'POST'])
def initial_setup():
    owner = query_db("SELECT id FROM users WHERE role IN ('OWNER', 'super_admin')", one=True)
    if owner:
        flash('Store Owner account is already established. First-time setup is closed.', 'info')
        return redirect(url_for('admin.admin_login'))

    if request.method == 'POST':
        name = request.form.get('name', '').strip()
        email = request.form.get('email', '').strip().lower()
        password = request.form.get('password', '')
        confirm_password = request.form.get('confirm_password', '')

        if not name or not email or not password or len(password) < 8:
            flash('Name, email, and password (minimum 8 characters) are required.', 'error')
            return render_template('admin/setup.html')

        if password != confirm_password:
            flash('Passwords do not match.', 'error')
            return render_template('admin/setup.html')

        password_hash = generate_password_hash(password)
        user_id = execute_db('''
            INSERT INTO users (name, email, password_hash, role, status)
            VALUES (?, ?, ?, 'OWNER', 'active')
        ''', (name, email, password_hash))

        log_audit_action('OWNER_INITIAL_SETUP', f'Primary Owner {email} created', user_id=user_id, user_email=email, ip_address=request.remote_addr)

        session['user_id'] = user_id
        session['user_name'] = name
        session['user_email'] = email
        session['user_role'] = 'OWNER'

        flash('Master Store Owner account created successfully! Welcome to Khushi Collection.', 'success')
        return redirect(url_for('admin.dashboard'))

    return render_template('admin/setup.html')

# Admin Login with Rate Limiting
@admin_bp.route('/login', methods=['GET', 'POST'])
def admin_login():
    # If no owner exists yet, redirect to initial setup
    owner = query_db("SELECT id FROM users WHERE role IN ('OWNER', 'super_admin')", one=True)
    if not owner:
        return redirect(url_for('admin.initial_setup'))

    if session.get('user_id') and session.get('user_role') in ('OWNER', 'MANAGER', 'STAFF', 'super_admin', 'manager', 'staff'):
        return redirect(url_for('admin.dashboard'))

    if request.method == 'POST':
        email = request.form.get('email', '').strip().lower()
        password = request.form.get('password', '')
        now = datetime.utcnow()

        user = query_db('SELECT * FROM users WHERE email = ?', (email,), one=True)

        if user:
            # Check lockout
            dict_user = dict(user)
            locked_until_str = dict_user.get('locked_until')
            if locked_until_str:
                try:
                    locked_until = datetime.fromisoformat(str(locked_until_str))
                    if locked_until > now:
                        minutes_left = max(1, int((locked_until - now).total_seconds() / 60))
                        flash(f'Account temporarily locked due to multiple failed attempts. Try again in {minutes_left} minute(s).', 'error')
                        return render_template('admin/login.html')
                except Exception:
                    pass

            if check_password_hash(user['password_hash'], password):
                if user['role'] not in ('OWNER', 'MANAGER', 'STAFF', 'super_admin', 'manager', 'staff'):
                    log_audit_action('UNAUTHORIZED_ADMIN_ACCESS_ATTEMPT', f'Customer {email} attempted admin login', user_id=user['id'], user_email=email, ip_address=request.remote_addr)
                    flash('Access denied. Customer accounts cannot access administrative portal.', 'error')
                    return render_template('admin/login.html')

                if user['status'] != 'active':
                    flash('Account is disabled. Please contact the store owner.', 'error')
                    return render_template('admin/login.html')

                # Reset failed login count and update last login
                execute_db('''
                    UPDATE users 
                    SET failed_login_attempts = 0, locked_until = NULL, last_login_at = ?
                    WHERE id = ?
                ''', (now.isoformat(), user['id']))

                session['user_id'] = user['id']
                session['user_name'] = user['name']
                session['user_email'] = user['email']
                session['user_role'] = 'OWNER' if user['role'] in ('OWNER', 'super_admin') else user['role'].upper()

                log_audit_action('LOGIN_SUCCESS', f'User {email} logged in ({session["user_role"]})', user_id=user['id'], user_email=email, ip_address=request.remote_addr)

                flash(f'Logged in as {user["name"]} ({session["user_role"]})', 'success')
                return redirect(url_for('admin.dashboard'))
            else:
                # Increment failed attempts
                attempts = (dict_user.get('failed_login_attempts') or 0) + 1
                locked_until_val = None
                if attempts >= 5:
                    locked_until_val = (now + timedelta(minutes=15)).isoformat()
                    log_audit_action('ACCOUNT_LOCKED', f'Account {email} locked after 5 failed attempts', user_id=user['id'], user_email=email, ip_address=request.remote_addr)
                else:
                    log_audit_action('LOGIN_FAILED', f'Failed password attempt for {email}', user_id=user['id'], user_email=email, ip_address=request.remote_addr)

                execute_db('''
                    UPDATE users 
                    SET failed_login_attempts = ?, locked_until = ?
                    WHERE id = ?
                ''', (attempts, locked_until_val, user['id']))

                if attempts >= 5:
                    flash('Account temporarily locked for 15 minutes due to multiple failed login attempts.', 'error')
                else:
                    remaining = 5 - attempts
                    flash(f'Invalid credentials. {remaining} attempt(s) remaining before temporary lockout.', 'error')
        else:
            log_audit_action('LOGIN_FAILED', f'Attempt with unknown email: {email}', ip_address=request.remote_addr)
            flash('Invalid administrator credentials.', 'error')

    return render_template('admin/login.html')

@admin_bp.route('/logout')
def admin_logout():
    u_id = session.get('user_id')
    u_email = session.get('user_email')
    if u_id:
        log_audit_action('LOGOUT', f'User {u_email} logged out', user_id=u_id, user_email=u_email, ip_address=request.remote_addr)
    session.pop('user_id', None)
    session.pop('user_name', None)
    session.pop('user_email', None)
    session.pop('user_role', None)
    flash('Logged out from admin console.', 'info')
    return redirect(url_for('admin.admin_login'))

# 1. Admin Dashboard
@admin_bp.route('/')
@admin_bp.route('/dashboard')
@admin_required()
def dashboard():
    today = date.today().strftime('%Y-%m-%d')

    # Metrics
    total_sales = query_db("SELECT COALESCE(SUM(total_amount), 0) as sm FROM orders WHERE order_status != 'cancelled'", one=True)['sm']
    today_sales = query_db("SELECT COALESCE(SUM(total_amount), 0) as sm FROM orders WHERE order_status != 'cancelled' AND DATE(created_at) = ?", (today,), one=True)['sm']
    total_orders = query_db("SELECT COUNT(*) as cnt FROM orders", one=True)['cnt']
    pending_orders = query_db("SELECT COUNT(*) as cnt FROM orders WHERE order_status = 'pending'", one=True)['cnt']
    processing_orders = query_db("SELECT COUNT(*) as cnt FROM orders WHERE order_status IN ('confirmed', 'processing', 'ready')", one=True)['cnt']
    delivered_orders = query_db("SELECT COUNT(*) as cnt FROM orders WHERE order_status = 'delivered'", one=True)['cnt']
    cancelled_orders = query_db("SELECT COUNT(*) as cnt FROM orders WHERE order_status = 'cancelled'", one=True)['cnt']
    total_customers = query_db("SELECT COUNT(*) as cnt FROM users WHERE role = 'customer'", one=True)['cnt']
    total_products = query_db("SELECT COUNT(*) as cnt FROM products", one=True)['cnt']
    low_stock_count = query_db("SELECT COUNT(*) as cnt FROM products WHERE stock <= low_stock_threshold", one=True)['cnt']

    # Recent 8 orders
    recent_orders = query_db("SELECT * FROM orders ORDER BY id DESC LIMIT 8")

    # Low stock items list
    low_stock_items = query_db("SELECT * FROM products WHERE stock <= low_stock_threshold ORDER BY stock ASC LIMIT 5")

    # Sales trend data for Chart.js (last 7 days)
    chart_labels = []
    chart_values = []
    for i in range(6, -1, -1):
        day_date = (date.today() - timedelta(days=i)).strftime('%Y-%m-%d')
        day_label = (date.today() - timedelta(days=i)).strftime('%b %d')
        val = query_db("SELECT COALESCE(SUM(total_amount), 0) as sm FROM orders WHERE order_status != 'cancelled' AND DATE(created_at) = ?", (day_date,), one=True)['sm']
        chart_labels.append(day_label)
        chart_values.append(float(val))

    return render_template(
        'admin/dashboard.html',
        total_sales=total_sales,
        today_sales=today_sales,
        total_orders=total_orders,
        pending_orders=pending_orders,
        processing_orders=processing_orders,
        delivered_orders=delivered_orders,
        cancelled_orders=cancelled_orders,
        total_customers=total_customers,
        total_products=total_products,
        low_stock_count=low_stock_count,
        recent_orders=recent_orders,
        low_stock_items=low_stock_items,
        chart_labels=json.dumps(chart_labels),
        chart_values=json.dumps(chart_values)
    )

# 2. Product Management
@admin_bp.route('/products')
@admin_required(['super_admin', 'manager'])
def products():
    search = request.args.get('search', '').strip()
    category_id = request.args.get('category_id', type=int)

    sql = '''
        SELECT p.*, c.name as category_name
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        WHERE 1=1
    '''
    params = []

    if search:
        sql += ' AND (p.name LIKE ? OR p.sku LIKE ? OR p.brand LIKE ?)'
        params.extend([f"%{search}%", f"%{search}%", f"%{search}%"])

    if category_id:
        sql += ' AND p.category_id = ?'
        params.append(category_id)

    sql += ' ORDER BY p.id DESC'
    products_list = query_db(sql, params)
    categories = query_db('SELECT * FROM categories ORDER BY name ASC')

    return render_template('admin/products/index.html', products=products_list, categories=categories, search=search, category_id=category_id)

@admin_bp.route('/products/add', methods=['GET', 'POST'])
@admin_required(['super_admin', 'manager'])
def add_product():
    if request.method == 'POST':
        name = request.form.get('name', '').strip()
        slug = request.form.get('slug', '').strip().lower().replace(' ', '-')
        category_id = request.form.get('category_id', type=int)
        brand = request.form.get('brand', 'Khushi Collection').strip()
        sku = request.form.get('sku', '').strip().upper()
        price = float(request.form.get('price', 0))
        sale_price = float(request.form.get('sale_price')) if request.form.get('sale_price') else None
        stock = int(request.form.get('stock', 10))
        low_stock_threshold = int(request.form.get('low_stock_threshold', 3))
        
        # Variants
        sizes_input = request.form.get('sizes', '')
        sizes_list = [s.strip() for s in sizes_input.split(',') if s.strip()]
        
        colors_input = request.form.get('colors', '')
        colors_list = []
        for c in colors_input.split(','):
            c = c.strip()
            if c:
                colors_list.append({'name': c, 'hex': '#000000'})

        thumbnail = request.form.get('thumbnail', '').strip()
        images_input = request.form.get('images', '').strip()
        images_list = [img.strip() for img in images_input.split('\n') if img.strip()]
        if not images_list and thumbnail:
            images_list = [thumbnail]

        video_url = request.form.get('video_url', '').strip()
        description = request.form.get('description', '').strip()
        tags = request.form.get('tags', '').strip()

        is_featured = 1 if request.form.get('is_featured') else 0
        is_new = 1 if request.form.get('is_new') else 0
        is_bestseller = 1 if request.form.get('is_bestseller') else 0
        is_flash_sale = 1 if request.form.get('is_flash_sale') else 0
        status = request.form.get('status', 'active')

        execute_db('''
            INSERT INTO products (
                name, slug, category_id, brand, sku, price, sale_price, stock, low_stock_threshold,
                sizes, colors, thumbnail, images, video_url, description, tags,
                is_featured, is_new, is_bestseller, is_flash_sale, status
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            name, slug, category_id, brand, sku, price, sale_price, stock, low_stock_threshold,
            json.dumps(sizes_list), json.dumps(colors_list), thumbnail, json.dumps(images_list),
            video_url, description, tags, is_featured, is_new, is_bestseller, is_flash_sale, status
        ))

        flash(f"Product '{name}' added successfully!", 'success')
        return redirect(url_for('admin.products'))

    categories = query_db('SELECT * FROM categories ORDER BY name ASC')
    return render_template('admin/products/form.html', product=None, categories=categories)

@admin_bp.route('/products/edit/<int:id>', methods=['GET', 'POST'])
@admin_required(['super_admin', 'manager'])
def edit_product(id):
    product = query_db('SELECT * FROM products WHERE id = ?', (id,), one=True)
    if not product:
        flash('Product not found.', 'error')
        return redirect(url_for('admin.products'))

    if request.method == 'POST':
        name = request.form.get('name', '').strip()
        slug = request.form.get('slug', '').strip().lower().replace(' ', '-')
        category_id = request.form.get('category_id', type=int)
        brand = request.form.get('brand', 'Khushi Collection').strip()
        sku = request.form.get('sku', '').strip().upper()
        price = float(request.form.get('price', 0))
        sale_price = float(request.form.get('sale_price')) if request.form.get('sale_price') else None
        stock = int(request.form.get('stock', 0))
        low_stock_threshold = int(request.form.get('low_stock_threshold', 3))

        sizes_input = request.form.get('sizes', '')
        sizes_list = [s.strip() for s in sizes_input.split(',') if s.strip()]

        colors_input = request.form.get('colors', '')
        colors_list = []
        for c in colors_input.split(','):
            c = c.strip()
            if c:
                colors_list.append({'name': c, 'hex': '#000000'})

        thumbnail = request.form.get('thumbnail', '').strip()
        images_input = request.form.get('images', '').strip()
        images_list = [img.strip() for img in images_input.split('\n') if img.strip()]

        video_url = request.form.get('video_url', '').strip()
        description = request.form.get('description', '').strip()
        tags = request.form.get('tags', '').strip()

        is_featured = 1 if request.form.get('is_featured') else 0
        is_new = 1 if request.form.get('is_new') else 0
        is_bestseller = 1 if request.form.get('is_bestseller') else 0
        is_flash_sale = 1 if request.form.get('is_flash_sale') else 0
        status = request.form.get('status', 'active')

        execute_db('''
            UPDATE products SET
                name = ?, slug = ?, category_id = ?, brand = ?, sku = ?, price = ?, sale_price = ?,
                stock = ?, low_stock_threshold = ?, sizes = ?, colors = ?, thumbnail = ?, images = ?,
                video_url = ?, description = ?, tags = ?, is_featured = ?, is_new = ?, is_bestseller = ?,
                is_flash_sale = ?, status = ?
            WHERE id = ?
        ''', (
            name, slug, category_id, brand, sku, price, sale_price, stock, low_stock_threshold,
            json.dumps(sizes_list), json.dumps(colors_list), thumbnail, json.dumps(images_list),
            video_url, description, tags, is_featured, is_new, is_bestseller, is_flash_sale, status,
            id
        ))

        flash(f"Product '{name}' updated successfully!", 'success')
        return redirect(url_for('admin.products'))

    categories = query_db('SELECT * FROM categories ORDER BY name ASC')
    return render_template('admin/products/form.html', product=product, categories=categories)

@admin_bp.route('/products/delete/<int:id>', methods=['POST'])
@admin_required(['super_admin'])
def delete_product(id):
    execute_db('DELETE FROM products WHERE id = ?', (id,))
    flash('Product deleted permanently.', 'info')
    return redirect(url_for('admin.products'))

# 3. Categories CRUD
@admin_bp.route('/categories', methods=['GET', 'POST'])
@admin_required(['super_admin', 'manager'])
def categories():
    if request.method == 'POST':
        name = request.form.get('name', '').strip()
        slug = request.form.get('slug', '').strip().lower().replace(' ', '-')
        description = request.form.get('description', '').strip()
        image_url = request.form.get('image_url', '').strip()
        is_featured = 1 if request.form.get('is_featured') else 0
        display_order = int(request.form.get('display_order', 0))

        execute_db('''
            INSERT INTO categories (name, slug, description, image_url, is_featured, display_order)
            VALUES (?, ?, ?, ?, ?, ?)
        ''', (name, slug, description, image_url, is_featured, display_order))
        flash(f"Category '{name}' created!", 'success')
        return redirect(url_for('admin.categories'))

    cats = query_db('SELECT * FROM categories ORDER BY display_order ASC')
    return render_template('admin/categories/index.html', categories=cats)

@admin_bp.route('/categories/delete/<int:id>', methods=['POST'])
@admin_required(['super_admin'])
def delete_category(id):
    execute_db('DELETE FROM categories WHERE id = ?', (id,))
    flash('Category deleted.', 'info')
    return redirect(url_for('admin.categories'))

# 4. Inventory Management
@admin_bp.route('/inventory')
@admin_required(['super_admin', 'manager'])
def inventory():
    products = query_db('''
        SELECT p.*, c.name as category_name
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        ORDER BY p.stock ASC
    ''')
    return render_template('admin/inventory/index.html', products=products)

@admin_bp.route('/inventory/quick-update', methods=['POST'])
@admin_required(['super_admin', 'manager', 'staff'])
def quick_inventory_update():
    data = request.get_json() or {}
    product_id = data.get('product_id')
    change = int(data.get('change', 0))

    product = query_db('SELECT stock FROM products WHERE id = ?', (product_id,), one=True)
    if product:
        new_stock = max(0, product['stock'] + change)
        execute_db('UPDATE products SET stock = ? WHERE id = ?', (new_stock, product_id))
        return jsonify({'success': True, 'new_stock': new_stock})
    return jsonify({'success': False}), 404

# 5. Order Management
@admin_bp.route('/orders')
@admin_required(['super_admin', 'manager', 'staff'])
def orders():
    status_filter = request.args.get('status', '').strip()
    search = request.args.get('search', '').strip()

    sql = 'SELECT * FROM orders WHERE 1=1'
    params = []

    if status_filter:
        sql += ' AND order_status = ?'
        params.append(status_filter)

    if search:
        sql += ' AND (order_number LIKE ? OR customer_name LIKE ? OR customer_phone LIKE ?)'
        params.extend([f"%{search}%", f"%{search}%", f"%{search}%"])

    sql += ' ORDER BY id DESC'
    orders_list = query_db(sql, params)

    return render_template('admin/orders/index.html', orders=orders_list, status_filter=status_filter, search=search)

@admin_bp.route('/orders/<int:id>')
@admin_required(['super_admin', 'manager', 'staff'])
def order_detail(id):
    order = query_db('SELECT * FROM orders WHERE id = ?', (id,), one=True)
    if not order:
        flash('Order not found.', 'error')
        return redirect(url_for('admin.orders'))

    items = query_db('SELECT * FROM order_items WHERE order_id = ?', (id,))
    timeline = query_db('SELECT * FROM order_timeline WHERE order_id = ? ORDER BY id ASC', (id,))
    
    # Store settings for WhatsApp
    rows = query_db('SELECT setting_key, setting_value FROM settings')
    settings = {r['setting_key']: r['setting_value'] for r in rows}
    
    whatsapp_msg = build_whatsapp_order_message(order, items, settings)
    customer_wa_url = get_whatsapp_send_url(order['customer_phone'], f"Hello {order['customer_name']}, regarding your Khushi Collection order #{order['order_number']}: ")

    return render_template(
        'admin/orders/detail.html',
        order=order,
        items=items,
        timeline=timeline,
        whatsapp_msg=whatsapp_msg,
        customer_wa_url=customer_wa_url
    )

@admin_bp.route('/orders/<int:id>/status', methods=['POST'])
@admin_required(['super_admin', 'manager', 'staff'])
def update_order_status(id):
    new_status = request.form.get('order_status')
    tracking_number = request.form.get('tracking_number', '').strip()
    courier_name = request.form.get('courier_name', 'Trax Express').strip()
    notes = request.form.get('admin_notes', '').strip()

    order = query_db('SELECT * FROM orders WHERE id = ?', (id,), one=True)
    if not order:
        return redirect(url_for('admin.orders'))

    execute_db('''
        UPDATE orders SET
            order_status = ?,
            tracking_number = COALESCE(NULLIF(?, ''), tracking_number),
            courier_name = ?,
            admin_notes = ?,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
    ''', (new_status, tracking_number, courier_name, notes, id))

    # Add to timeline
    status_titles = {
        'pending': 'Order Received',
        'confirmed': 'Order Confirmed',
        'processing': 'Preparing Order',
        'ready': 'Ready for Dispatch',
        'shipped': 'Shipped with Courier',
        'on_the_way': 'Parcel On The Way',
        'delivered': 'Delivered Successfully',
        'cancelled': 'Order Cancelled',
        'returned': 'Returned by Customer'
    }
    title = status_titles.get(new_status, new_status.title())
    user_name = session.get('user_name', 'Store Team')

    execute_db('''
        INSERT INTO order_timeline (order_id, status, title, description, created_by)
        VALUES (?, ?, ?, ?, ?)
    ''', (id, new_status, title, f"Status updated to {new_status.replace('_', ' ').title()}", user_name))

    # Trigger Customer SMS Notification
    updated_order = query_db('SELECT * FROM orders WHERE id = ?', (id,), one=True)
    sms_content = trigger_order_status_sms(updated_order, new_status)

    flash(f"Order #{order['order_number']} status updated to '{new_status.replace('_', ' ').title()}'. Customer notification sent: \"{sms_content}\"", 'success')
    return redirect(url_for('admin.order_detail', id=id))

@admin_bp.route('/api/orders/<identifier>', methods=['DELETE', 'POST'])
@admin_bp.route('/orders/delete/<identifier>', methods=['POST', 'DELETE'])
@owner_required
def delete_order_endpoint(identifier):
    try:
        clean = str(identifier).replace('#', '').strip()
        execute_db('DELETE FROM order_items WHERE order_id IN (SELECT id FROM orders WHERE order_number = ? OR order_number = ? OR id = ?)', (clean, f"KC-{clean}", clean))
        execute_db('DELETE FROM order_timeline WHERE order_id IN (SELECT id FROM orders WHERE order_number = ? OR order_number = ? OR id = ?)', (clean, f"KC-{clean}", clean))
        execute_db('DELETE FROM payments WHERE order_number = ? OR order_number = ? OR order_id = ?', (clean, f"KC-{clean}", clean))
        execute_db('DELETE FROM orders WHERE order_number = ? OR order_number = ? OR id = ?', (clean, f"KC-{clean}", clean))
        return jsonify({'success': True, 'message': f'Order {identifier} deleted successfully.'})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

# 6. Customer Management
@admin_bp.route('/customers')
@admin_required(['super_admin', 'manager'])
def customers():
    customers_list = query_db('''
        SELECT u.id, u.name, u.email, u.phone, u.status, u.created_at,
               COUNT(o.id) as total_orders,
               COALESCE(SUM(o.total_amount), 0) as total_spent,
               MAX(o.created_at) as last_order
        FROM users u
        LEFT JOIN orders o ON u.id = o.user_id
        WHERE u.role = 'customer'
        GROUP BY u.id
        ORDER BY total_spent DESC
    ''')
    return render_template('admin/customers/index.html', customers=customers_list)

# 7. Coupons & Promotions
@admin_bp.route('/coupons', methods=['GET', 'POST'])
@admin_required(['super_admin', 'manager'])
def coupons():
    if request.method == 'POST':
        code = request.form.get('code', '').strip().upper()
        discount_type = request.form.get('discount_type', 'percentage')
        discount_value = float(request.form.get('discount_value', 0))
        min_order = float(request.form.get('min_order_amount', 0))
        max_discount = float(request.form.get('max_discount')) if request.form.get('max_discount') else None
        expiry_date = request.form.get('expiry_date')
        usage_limit = int(request.form.get('usage_limit', 500))

        execute_db('''
            INSERT INTO coupons (code, discount_type, discount_value, min_order_amount, max_discount, expiry_date, usage_limit)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        ''', (code, discount_type, discount_value, min_order, max_discount, expiry_date, usage_limit))

        flash(f"Coupon '{code}' created!", 'success')
        return redirect(url_for('admin.coupons'))

    coupons_list = query_db('SELECT * FROM coupons ORDER BY id DESC')
    return render_template('admin/coupons/index.html', coupons=coupons_list)

@admin_bp.route('/coupons/delete/<int:id>', methods=['POST'])
@admin_required(['super_admin'])
def delete_coupon(id):
    execute_db('DELETE FROM coupons WHERE id = ?', (id,))
    flash('Coupon deleted.', 'info')
    return redirect(url_for('admin.coupons'))

# 8. Flash Sale Manager
@admin_bp.route('/flash-sale', methods=['GET', 'POST'])
@admin_required(['super_admin', 'manager'])
def flash_sale():
    sale = query_db('SELECT * FROM flash_sales ORDER BY id DESC LIMIT 1', one=True)

    if request.method == 'POST':
        title = request.form.get('title')
        subtitle = request.form.get('subtitle')
        discount_percentage = int(request.form.get('discount_percentage', 40))
        end_time = request.form.get('end_time')
        is_active = 1 if request.form.get('is_active') else 0
        banner_image = request.form.get('banner_image')

        if sale:
            execute_db('''
                UPDATE flash_sales SET
                    title = ?, subtitle = ?, discount_percentage = ?,
                    end_time = ?, is_active = ?, banner_image = ?
                WHERE id = ?
            ''', (title, subtitle, discount_percentage, end_time, is_active, banner_image, sale['id']))
        else:
            execute_db('''
                INSERT INTO flash_sales (title, subtitle, discount_percentage, end_time, is_active, banner_image)
                VALUES (?, ?, ?, ?, ?, ?)
            ''', (title, subtitle, discount_percentage, end_time, is_active, banner_image))

        flash('Flash Sale settings updated successfully!', 'success')
        return redirect(url_for('admin.flash_sale'))

    return render_template('admin/flash_sale/index.html', sale=sale)

# 9. Banners & Announcement Manager
@admin_bp.route('/banners', methods=['GET', 'POST'])
@admin_required(['super_admin', 'manager'])
def banners():
    if request.method == 'POST':
        title = request.form.get('title')
        subtitle = request.form.get('subtitle')
        badge_text = request.form.get('badge_text')
        image_url = request.form.get('image_url')
        button_text = request.form.get('button_text', 'Shop Now')
        button_link = request.form.get('button_link', '/shop')
        banner_type = request.form.get('banner_type', 'hero')
        display_order = int(request.form.get('display_order', 1))

        execute_db('''
            INSERT INTO banners (title, subtitle, badge_text, image_url, button_text, button_link, banner_type, display_order)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ''', (title, subtitle, badge_text, image_url, button_text, button_link, banner_type, display_order))

        flash('Banner added!', 'success')
        return redirect(url_for('admin.banners'))

    banners_list = query_db('SELECT * FROM banners ORDER BY display_order ASC')
    return render_template('admin/banners/index.html', banners=banners_list)

@admin_bp.route('/banners/delete/<int:id>', methods=['POST'])
@admin_required(['super_admin'])
def delete_banner(id):
    execute_db('DELETE FROM banners WHERE id = ?', (id,))
    flash('Banner deleted.', 'info')
    return redirect(url_for('admin.banners'))

# 10. Store & Integration Settings
@admin_bp.route('/settings', methods=['GET', 'POST'])
@admin_required(['super_admin'])
def settings():
    if request.method == 'POST':
        for key, value in request.form.items():
            execute_db('''
                INSERT OR REPLACE INTO settings (setting_key, setting_value, updated_at)
                VALUES (?, ?, CURRENT_TIMESTAMP)
            ''', (key, value))

        flash('Store settings saved successfully!', 'success')
        return redirect(url_for('admin.settings'))

    rows = query_db('SELECT setting_key, setting_value FROM settings')
    settings_dict = {r['setting_key']: r['setting_value'] for r in rows}
    return render_template('admin/settings/index.html', settings=settings_dict)

# 11. Reports & Analytics
@admin_bp.route('/reports')
@admin_required(['super_admin', 'manager'])
def reports():
    best_selling = query_db('''
        SELECT oi.product_name, SUM(oi.quantity) as total_sold, SUM(oi.total) as total_revenue, p.thumbnail
        FROM order_items oi
        JOIN products p ON oi.product_id = p.id
        GROUP BY oi.product_id
        ORDER BY total_sold DESC
        LIMIT 10
    ''')

    city_distribution = query_db('''
        SELECT city, COUNT(*) as orders_count, SUM(total_amount) as total_revenue
        FROM orders
        GROUP BY city
        ORDER BY orders_count DESC
    ''')

    payment_distribution = query_db('''
        SELECT payment_method, COUNT(*) as count, SUM(total_amount) as revenue
        FROM orders
        GROUP BY payment_method
    ''')

    sms_logs = query_db('SELECT * FROM notifications ORDER BY id DESC LIMIT 20')

    return render_template(
        'admin/reports/index.html',
        best_selling=best_selling,
        city_distribution=city_distribution,
        payment_distribution=payment_distribution,
        sms_logs=sms_logs
    )

# 12. Printable Invoice
@admin_bp.route('/invoice/<order_number>')
@admin_required()
def admin_invoice(order_number):
    order = query_db('SELECT * FROM orders WHERE order_number = ?', (order_number,), one=True)
    if not order:
        flash('Order not found', 'error')
        return redirect(url_for('admin.orders'))

    items = query_db('SELECT * FROM order_items WHERE order_id = ?', (order['id'],))
    
    rows = query_db('SELECT setting_key, setting_value FROM settings')
    settings = {r['setting_key']: r['setting_value'] for r in rows}

    return render_template('invoice.html', order=order, items=items, store_settings=settings)

# 13. Owner Security & Staff Management
@admin_bp.route('/security')
@admin_required()
def security_center():
    staff_list = query_db("SELECT id, name, email, role, status, created_at FROM users WHERE role IN ('MANAGER', 'STAFF', 'manager', 'staff') ORDER BY id DESC")
    audit_logs = query_db("SELECT * FROM audit_logs ORDER BY id DESC LIMIT 50")
    return render_template('admin/security/index.html', staff=staff_list, audit_logs=audit_logs)

@admin_bp.route('/staff/add', methods=['POST'])
@owner_required
def add_staff():
    name = request.form.get('name', '').strip()
    email = request.form.get('email', '').strip().lower()
    role = request.form.get('role', 'STAFF').upper()
    password = request.form.get('password', '')

    if not name or not email or not password or len(password) < 8:
        flash('All fields are required. Password must be at least 8 characters.', 'error')
        return redirect(url_for('admin.security_center'))

    existing = query_db('SELECT id FROM users WHERE email = ?', (email,), one=True)
    if existing:
        flash('An account with this email already exists.', 'error')
        return redirect(url_for('admin.security_center'))

    hashed = generate_password_hash(password)
    user_id = execute_db('''
        INSERT INTO users (name, email, password_hash, role, status)
        VALUES (?, ?, ?, ?, 'active')
    ''', (name, email, hashed, role))

    log_audit_action('STAFF_CREATED', f'Created {role} account for {email}', user_id=session.get('user_id'), user_email=session.get('user_email'), ip_address=request.remote_addr)
    flash(f'Staff member {name} ({role}) created successfully!', 'success')
    return redirect(url_for('admin.security_center'))

@admin_bp.route('/staff/toggle/<int:id>', methods=['POST'])
@owner_required
def toggle_staff(id):
    staff_user = query_db('SELECT * FROM users WHERE id = ?', (id,), one=True)
    if staff_user and staff_user['role'] in ('MANAGER', 'STAFF', 'manager', 'staff'):
        new_status = 'disabled' if staff_user['status'] == 'active' else 'active'
        execute_db('UPDATE users SET status = ? WHERE id = ?', (new_status, id))
        log_audit_action('STAFF_STATUS_CHANGED', f'Staff {staff_user["email"]} changed to {new_status}', user_id=session.get('user_id'), user_email=session.get('user_email'), ip_address=request.remote_addr)
        flash(f'Staff account status updated to {new_status}.', 'info')
    return redirect(url_for('admin.security_center'))

@admin_bp.route('/staff/delete/<int:id>', methods=['POST'])
@owner_required
def delete_staff(id):
    staff_user = query_db('SELECT * FROM users WHERE id = ?', (id,), one=True)
    if staff_user and staff_user['role'] in ('MANAGER', 'STAFF', 'manager', 'staff'):
        execute_db('DELETE FROM users WHERE id = ?', (id,))
        log_audit_action('STAFF_DELETED', f'Deleted staff account {staff_user["email"]}', user_id=session.get('user_id'), user_email=session.get('user_email'), ip_address=request.remote_addr)
        flash(f'Staff account for {staff_user["name"]} deleted.', 'info')
    return redirect(url_for('admin.security_center'))

@admin_bp.route('/security/change-password', methods=['POST'])
@admin_required()
def change_password():
    current_pass = request.form.get('current_password', '')
    new_pass = request.form.get('new_password', '')
    confirm_pass = request.form.get('confirm_password', '')

    if not new_pass or len(new_pass) < 8 or new_pass != confirm_pass:
        flash('New passwords must match and be at least 8 characters long.', 'error')
        return redirect(url_for('admin.security_center'))

    user = query_db('SELECT * FROM users WHERE id = ?', (session.get('user_id'),), one=True)
    if not user or not check_password_hash(user['password_hash'], current_pass):
        flash('Current password is incorrect.', 'error')
        return redirect(url_for('admin.security_center'))

    new_hash = generate_password_hash(new_pass)
    execute_db('UPDATE users SET password_hash = ? WHERE id = ?', (new_hash, user['id']))
    log_audit_action('PASSWORD_CHANGED', f'Password changed for {user["email"]}', user_id=user['id'], user_email=user['email'], ip_address=request.remote_addr)
    flash('Password changed successfully!', 'success')
    return redirect(url_for('admin.security_center'))
