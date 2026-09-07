import json
import secrets
import hashlib
from functools import wraps
from datetime import datetime, date, timedelta
from flask import Blueprint, render_template, request, redirect, url_for, session, flash, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from database import (
    query_db, execute_db, log_audit_action,
    has_permission, get_user_permissions, set_user_permissions, DEFAULT_PERMISSIONS
)
from services.notifications import trigger_order_status_sms, build_whatsapp_order_message, get_whatsapp_send_url

admin_bp = Blueprint('admin', __name__, url_prefix='/admin')

def verify_active_session():
    """Verify session token against user_sessions table for revocation checking."""
    user_id = session.get('user_id')
    session_token = session.get('session_token')
    if user_id and session_token:
        sess_record = query_db("SELECT is_active FROM user_sessions WHERE session_token = ?", (session_token,), one=True)
        if sess_record and not sess_record['is_active']:
            session.clear()
            return False
        # Update last activity
        try:
            execute_db("UPDATE user_sessions SET last_activity_at = CURRENT_TIMESTAMP WHERE session_token = ?", (session_token,))
        except Exception:
            pass
    return True

def admin_required(roles=None):
    if roles is None:
        target_roles = ['OWNER', 'MANAGER', 'STAFF', 'SUPER_ADMIN']
    else:
        target_roles = [r.upper() for r in roles]
        if 'OWNER' not in target_roles:
            target_roles.extend(['OWNER', 'SUPER_ADMIN'])

    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            user_id = session.get('user_id')
            user_role = str(session.get('user_role', '')).upper()

            if not user_id:
                if request.is_json or request.path.startswith('/admin/api/') or request.path.startswith('/api/'):
                    return jsonify({'success': False, 'error': 'Authentication required', 'code': 'UNAUTHENTICATED'}), 401
                return redirect(url_for('admin.admin_login', next=request.url))

            if not verify_active_session():
                if request.is_json or request.path.startswith('/admin/api/') or request.path.startswith('/api/'):
                    return jsonify({'success': False, 'error': 'Session expired or revoked', 'code': 'SESSION_REVOKED'}), 401
                flash('Your session has been terminated or revoked.', 'info')
                return redirect(url_for('admin.admin_login'))

            user = query_db("SELECT status, role FROM users WHERE id = ?", (user_id,), one=True)
            if not user or user['status'] != 'active':
                session.clear()
                if request.is_json or request.path.startswith('/admin/api/') or request.path.startswith('/api/'):
                    return jsonify({'success': False, 'error': 'Account is inactive or disabled', 'code': 'ACCOUNT_DISABLED'}), 403
                return render_template('admin/access_denied.html'), 403

            current_role = str(user['role']).upper()
            if current_role not in target_roles:
                if request.is_json or request.path.startswith('/admin/api/') or request.path.startswith('/api/'):
                    return jsonify({'success': False, 'error': 'Forbidden: Administrative access required', 'code': 'FORBIDDEN'}), 403
                return render_template('admin/access_denied.html'), 403

            return f(*args, **kwargs)
        return decorated_function
    return decorator

def owner_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        user_id = session.get('user_id')
        user_role = str(session.get('user_role', '')).upper()

        if not user_id:
            if request.is_json or request.path.startswith('/admin/api/') or request.path.startswith('/api/'):
                return jsonify({'success': False, 'error': 'Authentication required', 'code': 'UNAUTHENTICATED'}), 401
            return redirect(url_for('admin.admin_login', next=request.url))

        if not verify_active_session():
            if request.is_json or request.path.startswith('/admin/api/') or request.path.startswith('/api/'):
                return jsonify({'success': False, 'error': 'Session expired or revoked', 'code': 'SESSION_REVOKED'}), 401
            flash('Your session has been terminated or revoked.', 'info')
            return redirect(url_for('admin.admin_login'))

        user = query_db("SELECT status, role FROM users WHERE id = ?", (user_id,), one=True)
        if not user or user['status'] != 'active':
            session.clear()
            if request.is_json or request.path.startswith('/admin/api/') or request.path.startswith('/api/'):
                return jsonify({'success': False, 'error': 'Account is inactive or disabled', 'code': 'ACCOUNT_DISABLED'}), 403
            return render_template('admin/access_denied.html'), 403

        current_role = str(user['role']).upper()
        if current_role not in ('OWNER', 'SUPER_ADMIN'):
            log_audit_action('UNAUTHORIZED_OWNER_ACCESS_ATTEMPT', f"User {session.get('user_email')} attempted access to Owner route {request.path}",
                             user_id=user_id, user_email=session.get('user_email'), role=current_role, ip_address=request.remote_addr)
            if request.is_json or request.path.startswith('/admin/api/') or request.path.startswith('/api/'):
                return jsonify({'success': False, 'error': 'Forbidden: Store OWNER role required', 'code': 'OWNER_REQUIRED'}), 403
            return render_template('admin/access_denied.html'), 403

        return f(*args, **kwargs)
    return decorated_function

def permission_required(perm_code):
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            user_id = session.get('user_id')
            if not user_id:
                if request.is_json or request.path.startswith('/admin/api/') or request.path.startswith('/api/'):
                    return jsonify({'success': False, 'error': 'Authentication required', 'code': 'UNAUTHENTICATED'}), 401
                return redirect(url_for('admin.admin_login', next=request.url))

            if not verify_active_session():
                if request.is_json or request.path.startswith('/admin/api/') or request.path.startswith('/api/'):
                    return jsonify({'success': False, 'error': 'Session expired or revoked', 'code': 'SESSION_REVOKED'}), 401
                flash('Your session has been terminated or revoked.', 'info')
                return redirect(url_for('admin.admin_login'))

            user = query_db("SELECT status, role FROM users WHERE id = ?", (user_id,), one=True)
            if not user or user['status'] != 'active':
                session.clear()
                if request.is_json or request.path.startswith('/admin/api/') or request.path.startswith('/api/'):
                    return jsonify({'success': False, 'error': 'Account is inactive or disabled', 'code': 'ACCOUNT_DISABLED'}), 403
                return render_template('admin/access_denied.html'), 403

            current_role = str(user['role']).upper()
            if current_role in ('OWNER', 'SUPER_ADMIN'):
                return f(*args, **kwargs)

            if not has_permission(user_id, perm_code):
                log_audit_action('PERMISSION_DENIED', f"User {session.get('user_email')} denied permission '{perm_code}' for {request.path}",
                                 user_id=user_id, user_email=session.get('user_email'), role=current_role, ip_address=request.remote_addr)
                if request.is_json or request.path.startswith('/admin/api/') or request.path.startswith('/api/'):
                    return jsonify({'success': False, 'error': f"Forbidden: Permission '{perm_code}' required", 'code': 'PERMISSION_DENIED', 'required_permission': perm_code}), 403
                return render_template('admin/access_denied.html'), 403

            return f(*args, **kwargs)
        return decorated_function
    return decorator

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

# Admin Login with Rate Limiting (Supports both HTML Form and JSON Fetch API)
@admin_bp.route('/login', methods=['GET', 'POST'])
def admin_login():
    owner = query_db("SELECT id FROM users WHERE role IN ('OWNER', 'super_admin')", one=True)
    if not owner:
        if request.is_json:
            return jsonify({'success': False, 'needs_setup': True, 'redirect_url': url_for('admin.initial_setup')}), 200
        return redirect(url_for('admin.initial_setup'))

    if session.get('user_id') and session.get('user_role') in ('OWNER', 'MANAGER', 'STAFF', 'SUPER_ADMIN', 'manager', 'staff'):
        if request.is_json:
            return jsonify({'success': True, 'redirect_url': url_for('admin.dashboard')}), 200
        return redirect(url_for('admin.dashboard'))

    if request.method == 'POST':
        data = request.get_json() if request.is_json else request.form
        email = (data.get('email') or '').strip().lower()
        password = data.get('password') or ''
        remember = data.get('remember', False)
        now = datetime.now()

        if not email or not password:
            err = 'Email and password are required.'
            if request.is_json:
                return jsonify({'success': False, 'error': err}), 400
            flash(err, 'error')
            return render_template('admin/login.html')

        user = query_db('SELECT * FROM users WHERE email = ?', (email,), one=True)

        if user:
            dict_user = dict(user)
            locked_until_str = dict_user.get('locked_until')
            if locked_until_str:
                try:
                    locked_until = datetime.fromisoformat(str(locked_until_str))
                    if locked_until > now:
                        minutes_left = max(1, int((locked_until - now).total_seconds() / 60))
                        err = f'Account temporarily locked due to multiple failed attempts. Try again in {minutes_left} minute(s).'
                        if request.is_json:
                            return jsonify({'success': False, 'locked': True, 'error': err, 'minutes_left': minutes_left}), 429
                        flash(err, 'error')
                        return render_template('admin/login.html')
                except Exception:
                    pass

            if check_password_hash(user['password_hash'], password):
                role_upper = str(user['role']).upper()
                if role_upper not in ('OWNER', 'MANAGER', 'STAFF', 'SUPER_ADMIN'):
                    log_audit_action('UNAUTHORIZED_ADMIN_ACCESS_ATTEMPT', f'Customer {email} attempted admin login',
                                     user_id=user['id'], user_email=email, ip_address=request.remote_addr, user_agent=request.user_agent.string)
                    err = 'Access denied. Customer accounts cannot access the administrative portal.'
                    if request.is_json:
                        return jsonify({'success': False, 'error': err}), 403
                    flash(err, 'error')
                    return render_template('admin/login.html')

                if user['status'] != 'active':
                    err = 'Account is disabled. Please contact the store owner.'
                    if request.is_json:
                        return jsonify({'success': False, 'error': err}), 403
                    flash(err, 'error')
                    return render_template('admin/login.html')

                # Create session token
                session_token = secrets.token_urlsafe(32)

                # Reset failed login count and update last login
                execute_db('''
                    UPDATE users 
                    SET failed_login_attempts = 0, locked_until = NULL, last_login_at = ?, session_token = ?
                    WHERE id = ?
                ''', (now.isoformat(), session_token, user['id']))

                # Track active session
                execute_db('''
                    INSERT INTO user_sessions (user_id, session_token, ip_address, user_agent, device_name, is_active, last_activity_at)
                    VALUES (?, ?, ?, ?, ?, 1, ?)
                ''', (user['id'], session_token, request.remote_addr, (request.user_agent.string or '')[:250],
                      request.user_agent.platform or 'Desktop/Browser', now.isoformat()))

                session['user_id'] = user['id']
                session['user_name'] = user['name']
                session['user_email'] = user['email']
                session['user_role'] = 'OWNER' if role_upper in ('OWNER', 'SUPER_ADMIN') else role_upper
                session['session_token'] = session_token
                session.permanent = bool(remember)

                user_perms = list(get_user_permissions(user['id']))
                log_audit_action('LOGIN_SUCCESS', f'User {email} logged in ({session["user_role"]})',
                                 user_id=user['id'], user_email=email, role=session['user_role'],
                                 ip_address=request.remote_addr, user_agent=request.user_agent.string)

                if request.is_json:
                    return jsonify({
                        'success': True,
                        'user': {
                            'id': user['id'],
                            'name': user['name'],
                            'email': user['email'],
                            'role': session['user_role'],
                            'permissions': user_perms
                        },
                        'session_token': session_token,
                        'redirect_url': url_for('admin.dashboard')
                    }), 200

                flash(f'Logged in as {user["name"]} ({session["user_role"]})', 'success')
                return redirect(url_for('admin.dashboard'))
            else:
                attempts = (dict_user.get('failed_login_attempts') or 0) + 1
                locked_until_val = None
                if attempts >= 5:
                    locked_until_val = (now + timedelta(minutes=15)).isoformat()
                    log_audit_action('ACCOUNT_LOCKED', f'Account {email} locked after 5 failed attempts',
                                     user_id=user['id'], user_email=email, ip_address=request.remote_addr)
                else:
                    log_audit_action('LOGIN_FAILED', f'Failed password attempt for {email}',
                                     user_id=user['id'], user_email=email, ip_address=request.remote_addr)

                execute_db('''
                    UPDATE users 
                    SET failed_login_attempts = ?, locked_until = ?
                    WHERE id = ?
                ''', (attempts, locked_until_val, user['id']))

                if attempts >= 5:
                    err = 'Account temporarily locked for 15 minutes due to multiple failed login attempts.'
                    if request.is_json:
                        return jsonify({'success': False, 'locked': True, 'error': err, 'minutes_left': 15}), 429
                    flash(err, 'error')
                else:
                    remaining = 5 - attempts
                    err = f'Invalid credentials. {remaining} attempt(s) remaining before temporary lockout.'
                    if request.is_json:
                        return jsonify({'success': False, 'error': err, 'attempts_remaining': remaining}), 401
                    flash(err, 'error')
        else:
            log_audit_action('LOGIN_FAILED', f'Attempt with unknown email: {email}', ip_address=request.remote_addr)
            err = 'Invalid administrator credentials.'
            if request.is_json:
                return jsonify({'success': False, 'error': err}), 401
            flash(err, 'error')

    return render_template('admin/login.html')

# JSON API alias for login
@admin_bp.route('/api/login', methods=['POST'])
def api_admin_login():
    return admin_login()

@admin_bp.route('/logout')
@admin_bp.route('/api/logout', methods=['GET', 'POST'])
def admin_logout():
    u_id = session.get('user_id')
    u_email = session.get('user_email')
    s_token = session.get('session_token')

    if s_token:
        try:
            execute_db("UPDATE user_sessions SET is_active = 0 WHERE session_token = ?", (s_token,))
        except Exception:
            pass

    if u_id:
        log_audit_action('LOGOUT', f'User {u_email} logged out', user_id=u_id, user_email=u_email, ip_address=request.remote_addr)

    session.clear()

    if request.is_json or request.path.startswith('/admin/api/'):
        return jsonify({'success': True, 'message': 'Logged out successfully'}), 200

    flash('Logged out from admin console.', 'info')
    return redirect(url_for('admin.admin_login'))

# Return Current Authenticated Admin Identity & Granted Permissions
@admin_bp.route('/api/me', methods=['GET'])
def api_admin_me():
    u_id = session.get('user_id')
    if not u_id:
        return jsonify({'success': False, 'authenticated': False, 'user': None}), 401

    if not verify_active_session():
        session.clear()
        return jsonify({'success': False, 'authenticated': False, 'error': 'Session expired or revoked'}), 401

    user = query_db("SELECT id, name, email, role, status, last_login_at FROM users WHERE id = ?", (u_id,), one=True)
    if not user or user['status'] != 'active':
        session.clear()
        return jsonify({'success': False, 'authenticated': False, 'error': 'Account inactive'}), 403

    perms = list(get_user_permissions(user['id']))
    role_formatted = 'OWNER' if str(user['role']).upper() in ('OWNER', 'SUPER_ADMIN') else str(user['role']).upper()

    return jsonify({
        'success': True,
        'authenticated': True,
        'user': {
            'id': user['id'],
            'name': user['name'],
            'email': user['email'],
            'role': role_formatted,
            'status': user['status'],
            'last_login_at': user['last_login_at'],
            'permissions': perms
        }
    })

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
@permission_required('reports.view')
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
@owner_required
def security_center():
    staff_list = query_db("SELECT id, name, email, role, status, created_at, last_login_at FROM users WHERE role IN ('OWNER', 'MANAGER', 'STAFF', 'super_admin', 'manager', 'staff') ORDER BY id ASC")
    audit_logs = query_db("SELECT * FROM audit_logs ORDER BY id DESC LIMIT 50")
    sessions_list = query_db('''
        SELECT s.*, u.name as user_name, u.email as user_email, u.role as user_role 
        FROM user_sessions s 
        JOIN users u ON s.user_id = u.id 
        WHERE s.is_active = 1 
        ORDER BY s.last_activity_at DESC LIMIT 30
    ''')
    return render_template('admin/security/index.html', staff=staff_list, audit_logs=audit_logs, sessions=sessions_list)

# ====================================================================
# RBAC & STAFF MANAGEMENT REST APIs
# ====================================================================

@admin_bp.route('/api/permissions', methods=['GET'])
@admin_required()
def api_get_permissions():
    """Return all available permissions grouped by functional module category."""
    rows = query_db("SELECT id, code, name, category, description FROM permissions ORDER BY category, id ASC")
    categories = {}
    for r in rows:
        cat = r['category']
        if cat not in categories:
            categories[cat] = []
        categories[cat].append({
            'code': r['code'],
            'name': r['name'],
            'category': r['category'],
            'description': r['description']
        })
    return jsonify({'success': True, 'permissions': [dict(r) for r in rows], 'categories': categories})

@admin_bp.route('/api/staff', methods=['GET'])
@admin_required(['OWNER', 'MANAGER', 'STAFF'])
def api_list_staff():
    """List all administrative users with active status and assigned permissions."""
    curr_user_id = session.get('user_id')
    curr_user = query_db("SELECT role FROM users WHERE id = ?", (curr_user_id,), one=True)
    is_owner_user = curr_user and str(curr_user['role']).upper() in ('OWNER', 'SUPER_ADMIN')

    # If not owner and lacks 'users.view', block
    if not is_owner_user and not has_permission(curr_user_id, 'users.view'):
        return jsonify({'success': False, 'error': 'Forbidden: Permission users.view required'}), 403

    rows = query_db('''
        SELECT id, name, email, phone, role, status, last_login_at, created_at 
        FROM users 
        WHERE role IN ('OWNER', 'MANAGER', 'STAFF', 'super_admin', 'manager', 'staff')
        ORDER BY id ASC
    ''')

    staff_members = []
    for r in rows:
        item = dict(r)
        item['role'] = 'OWNER' if str(r['role']).upper() in ('OWNER', 'SUPER_ADMIN') else str(r['role']).upper()
        item['permissions'] = list(get_user_permissions(r['id']))
        staff_members.append(item)

    invitations = query_db('''
        SELECT id, email, name, role, expires_at, created_at, accepted_at 
        FROM staff_invitations 
        WHERE accepted_at IS NULL AND expires_at > CURRENT_TIMESTAMP 
        ORDER BY id DESC
    ''')

    return jsonify({
        'success': True,
        'staff': staff_members,
        'invitations': [dict(i) for i in invitations],
        'total_active': sum(1 for s in staff_members if s['status'] == 'active'),
        'total_staff': len(staff_members)
    })

@admin_bp.route('/api/staff', methods=['POST'])
@admin_required(['OWNER', 'MANAGER'])
def api_create_or_invite_staff():
    """Create a staff account directly or generate a secure invitation link."""
    curr_user_id = session.get('user_id')
    if not has_permission(curr_user_id, 'users.create') and session.get('user_role') != 'OWNER':
        return jsonify({'success': False, 'error': 'Forbidden: Permission users.create required'}), 403

    data = request.get_json() or request.form
    name = (data.get('name') or '').strip()
    email = (data.get('email') or '').strip().lower()
    role = (data.get('role') or 'STAFF').upper()
    password = data.get('password') or ''
    permissions = data.get('permissions', [])
    is_invite = data.get('is_invite', False)

    if role not in ('MANAGER', 'STAFF', 'OWNER'):
        role = 'STAFF'

    # Only OWNER can assign OWNER role
    if role == 'OWNER' and session.get('user_role') != 'OWNER':
        return jsonify({'success': False, 'error': 'Only store owners can create owner accounts'}), 403

    if not name or not email:
        return jsonify({'success': False, 'error': 'Name and email are required'}), 400

    existing = query_db('SELECT id FROM users WHERE email = ?', (email,), one=True)
    if existing:
        return jsonify({'success': False, 'error': 'An account with this email address already exists'}), 400

    if is_invite or not password:
        # Generate invitation token
        raw_token = secrets.token_urlsafe(32)
        token_hash = hashlib.sha256(raw_token.encode()).hexdigest()
        expires_at = (datetime.now() + timedelta(hours=48)).isoformat()

        execute_db("DELETE FROM staff_invitations WHERE email = ?", (email,))
        inv_id = execute_db('''
            INSERT INTO staff_invitations (email, name, role, permissions_json, token_hash, expires_at, created_by)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        ''', (email, name, role, json.dumps(permissions), token_hash, expires_at, curr_user_id))

        log_audit_action('STAFF_INVITATION_CREATED', f"Created invitation for {email} ({role})",
                         user_id=curr_user_id, user_email=session.get('user_email'), ip_address=request.remote_addr)

        invite_url = f"/admin-login.html?invite={raw_token}"
        return jsonify({
            'success': True,
            'invited': True,
            'invitation_id': inv_id,
            'invite_token': raw_token,
            'invite_url': invite_url,
            'message': f"Invitation link generated for {name}. Valid for 48 hours."
        }), 201
    else:
        # Direct creation
        if len(password) < 8:
            return jsonify({'success': False, 'error': 'Password must be at least 8 characters long'}), 400

        hashed = generate_password_hash(password)
        new_user_id = execute_db('''
            INSERT INTO users (name, email, password_hash, role, status)
            VALUES (?, ?, ?, ?, 'active')
        ''', (name, email, hashed, role))

        # Assign permissions
        set_user_permissions(new_user_id, permissions, granted_by=curr_user_id)

        log_audit_action('STAFF_CREATED', f"Created {role} account for {email} ({name}) with {len(permissions)} permissions",
                         user_id=curr_user_id, user_email=session.get('user_email'), ip_address=request.remote_addr)

        return jsonify({
            'success': True,
            'user_id': new_user_id,
            'name': name,
            'email': email,
            'role': role,
            'permissions': permissions,
            'message': f"Staff member {name} ({role}) created successfully!"
        }), 201

@admin_bp.route('/api/staff/<int:id>/permissions', methods=['PUT', 'POST'])
@admin_required(['OWNER', 'MANAGER'])
def api_update_staff_permissions(id):
    """Update granted granular permissions for a staff member. Requires Owner password re-auth for sensitive changes."""
    curr_user_id = session.get('user_id')
    curr_user = query_db("SELECT * FROM users WHERE id = ?", (curr_user_id,), one=True)
    is_owner = curr_user and str(curr_user['role']).upper() in ('OWNER', 'SUPER_ADMIN')

    if not is_owner and not has_permission(curr_user_id, 'users.edit'):
        return jsonify({'success': False, 'error': 'Forbidden: Permission users.edit required'}), 403

    target = query_db("SELECT * FROM users WHERE id = ?", (id,), one=True)
    if not target:
        return jsonify({'success': False, 'error': 'Staff member not found'}), 404

    target_role = str(target['role']).upper()
    if target_role in ('OWNER', 'SUPER_ADMIN') and not is_owner:
        return jsonify({'success': False, 'error': 'Staff cannot modify Owner permissions'}), 403

    data = request.get_json() or request.form
    permissions = data.get('permissions', [])
    new_role = (data.get('role') or target['role']).upper()
    confirm_password = data.get('confirm_password', '')

    # Re-authentication: if Owner is modifying permissions or roles, verify password if provided
    if confirm_password:
        if not check_password_hash(curr_user['password_hash'], confirm_password):
            return jsonify({'success': False, 'error': 'Re-authentication failed: Incorrect password confirmation'}), 403

    # Update role if provided
    if new_role in ('MANAGER', 'STAFF', 'OWNER') and (is_owner or new_role != 'OWNER'):
        execute_db("UPDATE users SET role = ? WHERE id = ?", (new_role, id))

    # Update permissions
    set_user_permissions(id, permissions, granted_by=curr_user_id)

    log_audit_action('PERMISSIONS_UPDATED', f"Updated permissions for staff {target['email']} ({len(permissions)} assigned)",
                     user_id=curr_user_id, user_email=session.get('user_email'), ip_address=request.remote_addr)

    return jsonify({
        'success': True,
        'user_id': id,
        'role': new_role,
        'permissions': list(get_user_permissions(id)),
        'message': f"Permissions updated successfully for {target['name']}."
    })

@admin_bp.route('/api/staff/<int:id>/toggle-status', methods=['POST'])
@admin_required(['OWNER', 'MANAGER'])
def api_toggle_staff_status(id):
    """Toggle staff account status between active and disabled. Protects last Owner."""
    curr_user_id = session.get('user_id')
    curr_user = query_db("SELECT role FROM users WHERE id = ?", (curr_user_id,), one=True)
    is_owner = curr_user and str(curr_user['role']).upper() in ('OWNER', 'SUPER_ADMIN')

    if not is_owner and not has_permission(curr_user_id, 'users.disable'):
        return jsonify({'success': False, 'error': 'Forbidden: Permission users.disable required'}), 403

    target = query_db("SELECT * FROM users WHERE id = ?", (id,), one=True)
    if not target:
        return jsonify({'success': False, 'error': 'Staff member not found'}), 404

    target_role = str(target['role']).upper()
    current_status = target['status']
    new_status = 'disabled' if current_status == 'active' else 'active'

    # Protect last active owner
    if target_role in ('OWNER', 'SUPER_ADMIN') and new_status == 'disabled':
        active_owners = query_db("SELECT count(*) as cnt FROM users WHERE UPPER(role) IN ('OWNER', 'SUPER_ADMIN') AND status = 'active'", one=True)['cnt']
        if active_owners <= 1:
            return jsonify({'success': False, 'error': 'Owner Protection: The sole active Owner account cannot be disabled.'}), 400

    execute_db("UPDATE users SET status = ? WHERE id = ?", (new_status, id))

    # If disabled, immediately revoke all active sessions for this user
    if new_status == 'disabled':
        execute_db("UPDATE user_sessions SET is_active = 0 WHERE user_id = ?", (id,))

    log_audit_action('STAFF_STATUS_TOGGLED', f"Staff account {target['email']} changed from {current_status} to {new_status}",
                     user_id=curr_user_id, user_email=session.get('user_email'), ip_address=request.remote_addr)

    return jsonify({
        'success': True,
        'user_id': id,
        'status': new_status,
        'message': f"Account status for {target['name']} updated to {new_status}."
    })

@admin_bp.route('/api/staff/<int:id>', methods=['DELETE'])
@owner_required
def api_delete_staff(id):
    """Permanently remove a staff account. Protects last Owner from deletion."""
    curr_user_id = session.get('user_id')
    curr_user = query_db("SELECT * FROM users WHERE id = ?", (curr_user_id,), one=True)

    target = query_db("SELECT * FROM users WHERE id = ?", (id,), one=True)
    if not target:
        return jsonify({'success': False, 'error': 'Staff member not found'}), 404

    target_role = str(target['role']).upper()

    # Protect last owner
    if target_role in ('OWNER', 'SUPER_ADMIN'):
        active_owners = query_db("SELECT count(*) as cnt FROM users WHERE UPPER(role) IN ('OWNER', 'SUPER_ADMIN') AND status = 'active'", one=True)['cnt']
        if active_owners <= 1:
            return jsonify({'success': False, 'error': 'Owner Protection: Cannot delete the sole remaining Store Owner account.'}), 400

    # Optional Re-authentication password check
    data = request.get_json() or {}
    confirm_password = data.get('confirm_password') or data.get('owner_password', '')
    if confirm_password:
        if not check_password_hash(curr_user['password_hash'], confirm_password):
            return jsonify({'success': False, 'error': 'Incorrect owner password confirmation'}), 403

    # Revoke sessions, remove permissions, delete user
    execute_db("DELETE FROM user_sessions WHERE user_id = ?", (id,))
    execute_db("DELETE FROM user_permissions WHERE user_id = ?", (id,))
    execute_db("DELETE FROM users WHERE id = ?", (id,))

    log_audit_action('STAFF_DELETED', f"Deleted staff account {target['email']} ({target['name']})",
                     user_id=curr_user_id, user_email=curr_user['email'], ip_address=request.remote_addr)

    return jsonify({'success': True, 'message': f"Staff member {target['name']} deleted successfully."})

# Form-based endpoints for legacy compatibility
@admin_bp.route('/staff/add', methods=['POST'])
@owner_required
def add_staff():
    res = api_create_or_invite_staff()
    flash('Staff operation completed.', 'info')
    return redirect(url_for('admin.security_center'))

@admin_bp.route('/staff/toggle/<int:id>', methods=['POST'])
@owner_required
def toggle_staff(id):
    api_toggle_staff_status(id)
    return redirect(url_for('admin.security_center'))

@admin_bp.route('/staff/delete/<int:id>', methods=['POST'])
@owner_required
def delete_staff(id):
    api_delete_staff(id)
    return redirect(url_for('admin.security_center'))

# ====================================================================
# ACTIVE SESSIONS MANAGEMENT REST APIs
# ====================================================================

@admin_bp.route('/api/sessions', methods=['GET'])
@admin_required()
def api_get_sessions():
    """List active user sessions with device, IP, and timestamp info."""
    curr_user_id = session.get('user_id')
    curr_role = str(session.get('user_role', '')).upper()
    curr_token = session.get('session_token')

    if curr_role in ('OWNER', 'SUPER_ADMIN'):
        rows = query_db('''
            SELECT s.id, s.user_id, s.session_token, s.ip_address, s.user_agent, s.device_name,
                   s.created_at, s.last_activity_at, s.is_active,
                   u.name as user_name, u.email as user_email, u.role as user_role
            FROM user_sessions s
            JOIN users u ON s.user_id = u.id
            WHERE s.is_active = 1
            ORDER BY s.last_activity_at DESC
        ''')
    else:
        rows = query_db('''
            SELECT s.id, s.user_id, s.session_token, s.ip_address, s.user_agent, s.device_name,
                   s.created_at, s.last_activity_at, s.is_active,
                   u.name as user_name, u.email as user_email, u.role as user_role
            FROM user_sessions s
            JOIN users u ON s.user_id = u.id
            WHERE s.user_id = ? AND s.is_active = 1
            ORDER BY s.last_activity_at DESC
        ''', (curr_user_id,))

    session_list = []
    for r in rows:
        item = dict(r)
        item['is_current'] = (item['session_token'] == curr_token)
        # Obfuscate token for client exposure
        item['session_token'] = item['session_token'][:8] + '••••'
        session_list.append(item)

    return jsonify({'success': True, 'sessions': session_list})

@admin_bp.route('/api/sessions/<int:id>/revoke', methods=['POST'])
@admin_required()
def api_revoke_session(id):
    """Revoke a specific active session."""
    curr_user_id = session.get('user_id')
    curr_role = str(session.get('user_role', '')).upper()

    sess_rec = query_db("SELECT * FROM user_sessions WHERE id = ?", (id,), one=True)
    if not sess_rec:
        return jsonify({'success': False, 'error': 'Session record not found'}), 404

    if sess_rec['user_id'] != curr_user_id and curr_role not in ('OWNER', 'SUPER_ADMIN'):
        return jsonify({'success': False, 'error': 'Forbidden: You can only revoke your own sessions'}), 403

    execute_db("UPDATE user_sessions SET is_active = 0 WHERE id = ?", (id,))

    log_audit_action('SESSION_REVOKED', f"Session #{id} revoked",
                     user_id=curr_user_id, user_email=session.get('user_email'), ip_address=request.remote_addr)

    return jsonify({'success': True, 'message': 'Session revoked successfully.'})

@admin_bp.route('/api/sessions/revoke-others', methods=['POST'])
@admin_required()
def api_revoke_other_sessions():
    """Revoke all active sessions for current user except the current device."""
    curr_user_id = session.get('user_id')
    curr_token = session.get('session_token')

    execute_db("UPDATE user_sessions SET is_active = 0 WHERE user_id = ? AND session_token != ?", (curr_user_id, curr_token))

    log_audit_action('SESSIONS_REVOKE_OTHERS', f"All other sessions terminated for user {session.get('user_email')}",
                     user_id=curr_user_id, user_email=session.get('user_email'), ip_address=request.remote_addr)

    return jsonify({'success': True, 'message': 'All other active sessions have been signed out.'})

# ====================================================================
# IMMUTABLE AUDIT LOG REST API
# ====================================================================

@admin_bp.route('/api/audit-logs', methods=['GET'])
@admin_required()
def api_get_audit_logs():
    """Fetch append-only immutable audit trail with filtering and search."""
    curr_user_id = session.get('user_id')
    curr_role = str(session.get('user_role', '')).upper()

    if curr_role not in ('OWNER', 'SUPER_ADMIN') and not has_permission(curr_user_id, 'security.view'):
        return jsonify({'success': False, 'error': 'Forbidden: Permission security.view required'}), 403

    q = (request.args.get('q') or '').strip()
    action = (request.args.get('action') or '').strip()
    limit = min(200, max(10, request.args.get('limit', 50, type=int)))
    offset = max(0, request.args.get('offset', 0, type=int))

    sql = "SELECT * FROM audit_logs WHERE 1=1"
    params = []

    if action:
        sql += " AND action = ?"
        params.append(action)

    if q:
        sql += " AND (user_email LIKE ? OR action LIKE ? OR details LIKE ? OR ip_address LIKE ?)"
        wild = f"%{q}%"
        params.extend([wild, wild, wild, wild])

    sql += " ORDER BY id DESC LIMIT ? OFFSET ?"
    params.extend([limit, offset])

    logs = query_db(sql, params)
    total = query_db("SELECT count(*) as cnt FROM audit_logs", one=True)['cnt']

    return jsonify({
        'success': True,
        'logs': [dict(l) for l in logs],
        'total': total,
        'limit': limit,
        'offset': offset
    })

# ====================================================================
# PASSWORD MANAGEMENT & RESET REST APIs
# ====================================================================

@admin_bp.route('/security/change-password', methods=['POST'])
@admin_bp.route('/api/password/change', methods=['POST'])
@admin_required()
def change_password():
    """Change current user's password with strict validation and re-auth."""
    data = request.get_json() if request.is_json else request.form
    current_pass = data.get('current_password', '')
    new_pass = data.get('new_password', '')
    confirm_pass = data.get('confirm_password', '')

    if not new_pass or len(new_pass) < 8 or new_pass != confirm_pass:
        err = 'New password must be at least 8 characters and match confirmation.'
        if request.is_json:
            return jsonify({'success': False, 'error': err}), 400
        flash(err, 'error')
        return redirect(url_for('admin.security_center'))

    user = query_db('SELECT * FROM users WHERE id = ?', (session.get('user_id'),), one=True)
    if not user or not check_password_hash(user['password_hash'], current_pass):
        err = 'Current password is incorrect.'
        if request.is_json:
            return jsonify({'success': False, 'error': err}), 403
        flash(err, 'error')
        return redirect(url_for('admin.security_center'))

    new_hash = generate_password_hash(new_pass)
    execute_db('UPDATE users SET password_hash = ? WHERE id = ?', (new_hash, user['id']))

    log_audit_action('PASSWORD_CHANGED', f'Password updated for user {user["email"]}',
                     user_id=user['id'], user_email=user['email'], role=user['role'], ip_address=request.remote_addr)

    if request.is_json:
        return jsonify({'success': True, 'message': 'Password changed successfully.'})

    flash('Password changed successfully!', 'success')
    return redirect(url_for('admin.security_center'))

@admin_bp.route('/api/password/forgot', methods=['POST'])
def api_forgot_password():
    """Initiate password reset flow without user enumeration."""
    data = request.get_json() or request.form
    email = (data.get('email') or '').strip().lower()

    # Always return standard generic message to prevent account enumeration
    standard_msg = 'If your email is associated with an active administrator account, instructions to reset your password have been generated.'

    if not email:
        return jsonify({'success': False, 'error': 'Email is required'}), 400

    user = query_db("SELECT id, name, email, status FROM users WHERE email = ? AND role IN ('OWNER', 'MANAGER', 'STAFF', 'super_admin', 'manager', 'staff')", (email,), one=True)

    reset_token = None
    if user and user['status'] == 'active':
        raw_token = secrets.token_urlsafe(32)
        token_hash = hashlib.sha256(raw_token.encode()).hexdigest()
        expires_at = (datetime.now() + timedelta(hours=1)).isoformat()

        execute_db('''
            INSERT INTO password_resets (user_id, token_hash, expires_at)
            VALUES (?, ?, ?)
        ''', (user['id'], token_hash, expires_at))

        log_audit_action('PASSWORD_RESET_REQUESTED', f"Password reset requested for {email}",
                         user_id=user['id'], user_email=email, ip_address=request.remote_addr)

        reset_token = raw_token

    return jsonify({
        'success': True,
        'message': standard_msg,
        'reset_token': reset_token
    })

@admin_bp.route('/api/password/reset', methods=['POST'])
def api_reset_password():
    """Verify reset token and update user password."""
    data = request.get_json() or request.form
    token = data.get('token', '')
    new_password = data.get('new_password', '')

    if not token or not new_password or len(new_password) < 8:
        return jsonify({'success': False, 'error': 'Valid token and minimum 8-character password are required'}), 400

    token_hash = hashlib.sha256(token.encode()).hexdigest()
    now = datetime.now()

    reset_rec = query_db('''
        SELECT * FROM password_resets 
        WHERE token_hash = ? AND used_at IS NULL
    ''', (token_hash,), one=True)

    if not reset_rec:
        return jsonify({'success': False, 'error': 'Invalid or expired password reset link'}), 400

    try:
        exp = datetime.fromisoformat(str(reset_rec['expires_at']))
        if exp < now:
            return jsonify({'success': False, 'error': 'Password reset token has expired. Please request a new one.'}), 400
    except Exception:
        pass

    user = query_db("SELECT * FROM users WHERE id = ?", (reset_rec['user_id'],), one=True)
    if not user:
        return jsonify({'success': False, 'error': 'Associated user not found'}), 404

    # Update password
    new_hash = generate_password_hash(new_password)
    execute_db("UPDATE users SET password_hash = ?, failed_login_attempts = 0, locked_until = NULL WHERE id = ?", (new_hash, user['id']))
    execute_db("UPDATE password_resets SET used_at = CURRENT_TIMESTAMP WHERE id = ?", (reset_rec['id'],))

    # Revoke old sessions
    execute_db("UPDATE user_sessions SET is_active = 0 WHERE user_id = ?", (user['id'],))

    log_audit_action('PASSWORD_RESET_COMPLETED', f"Password successfully reset via token for {user['email']}",
                     user_id=user['id'], user_email=user['email'], ip_address=request.remote_addr)

    return jsonify({'success': True, 'message': 'Your password has been reset successfully! You can now log in.'})

@admin_bp.route('/api/invitations/verify', methods=['GET'])
def api_verify_invitation():
    """Verify staff invitation token validity."""
    token = request.args.get('token', '')
    if not token:
        return jsonify({'success': False, 'error': 'Token required'}), 400

    token_hash = hashlib.sha256(token.encode()).hexdigest()
    inv = query_db('''
        SELECT id, email, name, role, expires_at, accepted_at 
        FROM staff_invitations 
        WHERE token_hash = ? AND accepted_at IS NULL
    ''', (token_hash,), one=True)

    if not inv:
        return jsonify({'success': False, 'error': 'Invalid invitation link'}), 404

    try:
        exp = datetime.fromisoformat(str(inv['expires_at']))
        if exp < datetime.now():
            return jsonify({'success': False, 'error': 'Invitation has expired'}), 400
    except Exception:
        pass

    return jsonify({
        'success': True,
        'invitation': {
            'email': inv['email'],
            'name': inv['name'],
            'role': inv['role']
        }
    })

@admin_bp.route('/api/invitations/accept', methods=['POST'])
def api_accept_invitation():
    """Accept staff invitation, set initial password, and activate account."""
    data = request.get_json() or request.form
    token = data.get('token', '')
    password = data.get('password', '')

    if not token or not password or len(password) < 8:
        return jsonify({'success': False, 'error': 'Valid token and minimum 8-character password required'}), 400

    token_hash = hashlib.sha256(token.encode()).hexdigest()
    inv = query_db('''
        SELECT * FROM staff_invitations 
        WHERE token_hash = ? AND accepted_at IS NULL
    ''', (token_hash,), one=True)

    if not inv:
        return jsonify({'success': False, 'error': 'Invalid or already accepted invitation'}), 400

    try:
        exp = datetime.fromisoformat(str(inv['expires_at']))
        if exp < datetime.now():
            return jsonify({'success': False, 'error': 'Invitation expired'}), 400
    except Exception:
        pass

    hashed = generate_password_hash(password)
    user_id = execute_db('''
        INSERT INTO users (name, email, password_hash, role, status)
        VALUES (?, ?, ?, ?, 'active')
    ''', (inv['name'], inv['email'], hashed, inv['role']))

    # Assign permissions
    try:
        perms = json.loads(inv['permissions_json']) if inv['permissions_json'] else []
        set_user_permissions(user_id, perms, granted_by=inv['created_by'])
    except Exception:
        pass

    execute_db("UPDATE staff_invitations SET accepted_at = CURRENT_TIMESTAMP WHERE id = ?", (inv['id'],))

    log_audit_action('STAFF_INVITATION_ACCEPTED', f"Staff member {inv['email']} accepted invitation and set password",
                     user_id=user_id, user_email=inv['email'], role=inv['role'], ip_address=request.remote_addr)

    return jsonify({'success': True, 'message': 'Account activated successfully! You may now log in.'})
