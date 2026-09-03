import json
import random
from datetime import datetime
from flask import Blueprint, render_template, request, redirect, url_for, session, flash, jsonify
from database import query_db, execute_db
from services.notifications import build_whatsapp_order_message, get_whatsapp_send_url

storefront_bp = Blueprint('storefront', __name__)

def get_store_settings():
    rows = query_db('SELECT setting_key, setting_value FROM settings')
    settings = {r['setting_key']: r['setting_value'] for r in rows}
    return settings

@storefront_bp.context_processor
def inject_global_data():
    categories = query_db('SELECT * FROM categories ORDER BY display_order ASC')
    settings = get_store_settings()
    return {
        'all_categories': categories,
        'store_settings': settings,
        'current_year': datetime.now().year
    }

# 1. Homepage
@storefront_bp.route('/')
def home():
    banners = query_db('SELECT * FROM banners WHERE is_active = 1 AND banner_type = "hero" ORDER BY display_order ASC')
    flash_sale = query_db('SELECT * FROM flash_sales WHERE is_active = 1 ORDER BY id DESC', one=True)
    
    # Featured categories
    featured_categories = query_db('SELECT * FROM categories WHERE is_featured = 1 ORDER BY display_order ASC LIMIT 8')
    
    # New Arrivals
    new_arrivals = query_db('SELECT * FROM products WHERE status = "active" AND is_new = 1 ORDER BY id DESC LIMIT 8')
    
    # Trending
    trending_products = query_db('SELECT * FROM products WHERE status = "active" AND is_featured = 1 ORDER BY reviews_count DESC LIMIT 8')
    
    # Best Sellers
    bestsellers = query_db('SELECT * FROM products WHERE status = "active" AND is_bestseller = 1 ORDER BY rating DESC LIMIT 8')
    
    # Flash Sale Products
    flash_products = query_db('SELECT * FROM products WHERE status = "active" AND is_flash_sale = 1 LIMIT 4')
    
    # Customer Reviews
    reviews = query_db('''
        SELECT r.*, p.name as product_name, p.thumbnail as product_thumb
        FROM reviews r
        JOIN products p ON r.product_id = p.id
        WHERE r.is_approved = 1
        ORDER BY r.rating DESC, r.id DESC
        LIMIT 6
    ''')

    return render_template(
        'index.html',
        banners=banners,
        flash_sale=flash_sale,
        featured_categories=featured_categories,
        new_arrivals=new_arrivals,
        trending_products=trending_products,
        bestsellers=bestsellers,
        flash_products=flash_products,
        reviews=reviews
    )

# 2. Shop Page (Daraz-style filtered product catalog)
@storefront_bp.route('/shop')
def shop():
    category_slug = request.args.get('category', '').strip()
    search_query = request.args.get('q', '').strip()
    brand = request.args.get('brand', '').strip()
    min_price = request.args.get('min_price', type=float)
    max_price = request.args.get('max_price', type=float)
    selected_size = request.args.get('size', '').strip()
    selected_color = request.args.get('color', '').strip()
    availability = request.args.get('availability', '').strip()
    sort_by = request.args.get('sort', 'newest').strip()
    page = max(1, request.args.get('page', 1, type=int))
    per_page = 12

    # Query builder
    sql = '''
        SELECT p.*, c.name as category_name, c.slug as category_slug
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        WHERE p.status IN ('active', 'published')
    '''
    params = []

    active_category = None
    if category_slug:
        sql += ' AND (c.slug = ? OR c.parent_id IN (SELECT id FROM categories WHERE slug = ?))'
        params.extend([category_slug, category_slug])
        active_category = query_db('SELECT * FROM categories WHERE slug = ?', (category_slug,), one=True)

    if search_query:
        sql += ' AND (p.name LIKE ? OR p.brand LIKE ? OR p.sku LIKE ? OR p.tags LIKE ? OR p.description LIKE ?)'
        wildcard = f"%{search_query}%"
        params.extend([wildcard, wildcard, wildcard, wildcard, wildcard])

    if brand:
        sql += ' AND p.brand = ?'
        params.append(brand)

    if min_price is not None:
        sql += ' AND COALESCE(p.sale_price, p.price) >= ?'
        params.append(min_price)

    if max_price is not None:
        sql += ' AND COALESCE(p.sale_price, p.price) <= ?'
        params.append(max_price)

    if selected_size:
        sql += ' AND p.sizes LIKE ?'
        params.append(f'%"{selected_size}"%')

    if selected_color:
        sql += ' AND p.colors LIKE ?'
        params.append(f'%"{selected_color}"%')

    if availability == 'in_stock':
        sql += ' AND p.stock > 0'

    # Sorting
    if sort_by == 'price_low':
        sql += ' ORDER BY COALESCE(p.sale_price, p.price) ASC'
    elif sort_by == 'price_high':
        sql += ' ORDER BY COALESCE(p.sale_price, p.price) DESC'
    elif sort_by == 'popular':
        sql += ' ORDER BY p.reviews_count DESC'
    elif sort_by == 'rating':
        sql += ' ORDER BY p.rating DESC'
    elif sort_by == 'discount':
        sql += ' ORDER BY CASE WHEN p.sale_price IS NOT NULL THEN (p.price - p.sale_price) / p.price ELSE 0 END DESC'
    else: # newest
        sql += ' ORDER BY p.id DESC'

    # Get total count
    all_filtered = query_db(sql, params)
    total_products = len(all_filtered)
    total_pages = max(1, (total_products + per_page - 1) // per_page)

    # Apply pagination
    offset = (page - 1) * per_page
    paginated_sql = sql + f' LIMIT {per_page} OFFSET {offset}'
    products = query_db(paginated_sql, params)

    # Brands for filter
    brands = query_db('SELECT DISTINCT brand FROM products WHERE brand IS NOT NULL AND status = "active"')
    
    # Available sizes list
    available_sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL']

    return render_template(
        'shop.html',
        products=products,
        total_products=total_products,
        page=page,
        total_pages=total_pages,
        category_slug=category_slug,
        active_category=active_category,
        search_query=search_query,
        brand=brand,
        brands=[b['brand'] for b in brands],
        min_price=min_price,
        max_price=max_price,
        selected_size=selected_size,
        selected_color=selected_color,
        availability=availability,
        sort_by=sort_by,
        available_sizes=available_sizes
    )

# 3. Product Details Page
@storefront_bp.route('/product/<slug>')
def product_detail(slug):
    product = query_db('''
        SELECT p.*, c.name as category_name, c.slug as category_slug
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        WHERE p.slug = ? AND p.status IN ('active', 'published')
    ''', (slug,), one=True)

    if not product:
        return render_template('404.html', message='Product not found'), 404

    # Parse images, sizes, colors, specifications
    images = json.loads(product['images'] or '[]')
    if not images and product['thumbnail']:
        images = [product['thumbnail']]

    sizes = json.loads(product['sizes'] or '[]')
    colors = json.loads(product['colors'] or '[]')
    
    try:
        specifications = json.loads(product['specifications'] or '{}')
    except Exception:
        specifications = {}

    # Reviews
    reviews = query_db('''
        SELECT * FROM reviews 
        WHERE product_id = ? AND is_approved = 1 
        ORDER BY id DESC
    ''', (product['id'],))

    # Related products
    related_products = query_db('''
        SELECT * FROM products
        WHERE category_id = ? AND id != ? AND status = 'active'
        LIMIT 4
    ''', (product['category_id'], product['id']))

    # Track recently viewed in session
    recent = session.get('recently_viewed', [])
    if product['id'] in recent:
        recent.remove(product['id'])
    recent.insert(0, product['id'])
    session['recently_viewed'] = recent[:6]
    session.modified = True

    # Fetch recently viewed products
    recently_viewed_items = []
    if len(recent) > 1:
        placeholders = ','.join('?' for _ in recent[1:])
        recently_viewed_items = query_db(f'''
            SELECT * FROM products WHERE id IN ({placeholders}) AND status = 'active'
        ''', recent[1:])

    return render_template(
        'product_detail.html',
        product=product,
        images=images,
        sizes=sizes,
        colors=colors,
        specifications=specifications,
        reviews=reviews,
        related_products=related_products,
        recently_viewed_items=recently_viewed_items
    )

# 4. Shopping Cart Page
@storefront_bp.route('/cart')
def cart_page():
    return render_template('cart.html')

# 5. Checkout Page
@storefront_bp.route('/checkout')
def checkout():
    cart = session.get('cart', {})
    if not cart:
        flash('Your shopping bag is empty.', 'info')
        return redirect(url_for('storefront.shop'))

    items = []
    subtotal = 0.0
    for key, item in cart.items():
        p = query_db('SELECT id, name, price, sale_price, thumbnail FROM products WHERE id = ?', (item['product_id'],), one=True)
        if p:
            price = float(p['sale_price'] if p['sale_price'] else p['price'])
            item_total = price * int(item['quantity'])
            subtotal += item_total
            items.append({
                'name': p['name'],
                'thumbnail': p['thumbnail'],
                'price': price,
                'quantity': item['quantity'],
                'size': item.get('size'),
                'color': item.get('color'),
                'total': item_total
            })

    # Cities for Pakistan selector
    cities = ['Islamabad', 'Rawalpindi', 'Lahore', 'Karachi', 'Peshawar', 'Quetta', 'Multan', 'Faisalabad', 'Sialkot', 'Gujranwala', 'Other Cities']
    
    # Pre-fill user details if logged in
    user = None
    if session.get('user_id'):
        user = query_db('SELECT * FROM users WHERE id = ?', (session['user_id'],), one=True)

    return render_template(
        'checkout.html',
        items=items,
        subtotal=subtotal,
        cities=cities,
        user=user
    )

# 6. Place Order Action
@storefront_bp.route('/place-order', methods=['POST'])
def place_order():
    cart = session.get('cart', {})
    if not cart:
        flash('Your bag is empty.', 'error')
        return redirect(url_for('storefront.shop'))

    customer_name = request.form.get('customer_name', '').strip()
    customer_phone = request.form.get('customer_phone', '').strip()
    customer_email = request.form.get('customer_email', '').strip()
    address = request.form.get('address', '').strip()
    city = request.form.get('city', '').strip()
    area = request.form.get('area', '').strip()
    postal_code = request.form.get('postal_code', '').strip()
    delivery_instructions = request.form.get('delivery_instructions', '').strip()
    payment_method = request.form.get('payment_method', 'cod').strip()
    coupon_code = request.form.get('coupon_code', '').strip().upper()

    if not customer_name or not customer_phone or not address or not city:
        flash('Please fill in all required delivery details.', 'error')
        return redirect(url_for('storefront.checkout'))

    # Calculate subtotal & prepare items
    items_to_save = []
    subtotal = 0.0
    for key, item in cart.items():
        p = query_db('SELECT id, name, price, sale_price, thumbnail, stock FROM products WHERE id = ?', (item['product_id'],), one=True)
        if p:
            unit_price = float(p['sale_price'] if p['sale_price'] else p['price'])
            item_total = unit_price * int(item['quantity'])
            subtotal += item_total
            items_to_save.append({
                'product_id': p['id'],
                'product_name': p['name'],
                'price': unit_price,
                'quantity': item['quantity'],
                'size': item.get('size'),
                'color': item.get('color'),
                'thumbnail': p['thumbnail'],
                'total': item_total
            })

    # Calculate delivery fee
    settings = get_store_settings()
    threshold = float(settings.get('free_delivery_threshold', 5000))
    rates = json.loads(settings.get('city_rates', '{}'))
    if subtotal >= threshold:
        delivery_fee = 0.0
    else:
        delivery_fee = float(rates.get(city, rates.get('Other Cities', 250)))

    # Calculate coupon discount
    discount_amount = 0.0
    if coupon_code:
        coupon = query_db('SELECT * FROM coupons WHERE code = ? AND is_active = 1', (coupon_code,), one=True)
        if coupon and subtotal >= coupon['min_order_amount']:
            if coupon['discount_type'] == 'percentage':
                discount_amount = (subtotal * coupon['discount_value']) / 100.0
                if coupon['max_discount']:
                    discount_amount = min(discount_amount, coupon['max_discount'])
            else:
                discount_amount = coupon['discount_value']
            discount_amount = min(discount_amount, subtotal)
            execute_db('UPDATE coupons SET times_used = times_used + 1 WHERE id = ?', (coupon['id'],))

    total_amount = subtotal + delivery_fee - discount_amount

    # Generate Order Number
    random_suffix = random.randint(10000, 99999)
    order_number = f"KC-{random_suffix}"

    user_id = session.get('user_id')

    # Insert Order
    order_id = execute_db('''
        INSERT INTO orders (
            order_number, user_id, customer_name, customer_phone, customer_email,
            address, city, area, postal_code, delivery_instructions,
            subtotal, delivery_fee, discount_amount, coupon_code, total_amount,
            payment_method, payment_status, order_status, courier_name
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (
        order_number, user_id, customer_name, customer_phone, customer_email,
        address, city, area, postal_code, delivery_instructions,
        subtotal, delivery_fee, discount_amount, coupon_code, total_amount,
        payment_method, 'unpaid', 'pending', 'Trax Logistics'
    ))

    # Insert Order Items & Deduct Stock
    for item in items_to_save:
        execute_db('''
            INSERT INTO order_items (order_id, product_id, product_name, price, quantity, size, color, thumbnail, total)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            order_id, item['product_id'], item['product_name'], item['price'],
            item['quantity'], item['size'], item['color'], item['thumbnail'], item['total']
        ))
        execute_db('UPDATE products SET stock = MAX(0, stock - ?) WHERE id = ?', (item['quantity'], item['product_id']))

    # Insert Timeline Step
    execute_db('''
        INSERT INTO order_timeline (order_id, status, title, description, created_by)
        VALUES (?, 'pending', 'Order Placed', 'Your order was successfully received by Khushi Collection', 'Customer')
    ''', (order_id,))

    # Clear Cart
    session['cart'] = {}
    session.modified = True

    return redirect(url_for('storefront.order_confirmation', order_number=order_number))

# 7. Order Confirmation Page
@storefront_bp.route('/order-confirmation/<order_number>')
def order_confirmation(order_number):
    order = query_db('SELECT * FROM orders WHERE order_number = ?', (order_number,), one=True)
    if not order:
        return redirect(url_for('storefront.home'))

    items = query_db('SELECT * FROM order_items WHERE order_id = ?', (order['id'],))
    settings = get_store_settings()

    # Build WhatsApp message and link
    whatsapp_msg = build_whatsapp_order_message(order, items, settings)
    store_owner_phone = settings.get('store_whatsapp', '923001234567')
    whatsapp_url = get_whatsapp_send_url(store_owner_phone, whatsapp_msg)

    return render_template(
        'order_confirmation.html',
        order=order,
        items=items,
        whatsapp_msg=whatsapp_msg,
        whatsapp_url=whatsapp_url,
        store_settings=settings
    )

# 8. Order Tracking Page
@storefront_bp.route('/track-order', methods=['GET', 'POST'])
def track_order():
    order = None
    items = []
    timeline = []
    searched = False

    order_query = request.args.get('order_id', '').strip()
    phone_query = request.args.get('phone', '').strip()

    if request.method == 'POST':
        order_query = request.form.get('order_id', '').strip()
        phone_query = request.form.get('phone', '').strip()

    if order_query or phone_query:
        searched = True
        # Normalize order query (support KC-10025 or 10025)
        clean_order_num = order_query.upper().replace('#', '')
        if clean_order_num and not clean_order_num.startswith('KC-') and clean_order_num.isdigit():
            clean_order_num = f"KC-{clean_order_num}"

        sql = 'SELECT * FROM orders WHERE 1=1'
        params = []

        if clean_order_num:
            sql += ' AND order_number = ?'
            params.append(clean_order_num)

        if phone_query:
            digits = "".join(filter(str.isdigit, phone_query))
            phone_suffix = digits[-7:] if len(digits) >= 7 else digits
            sql += ' AND (customer_phone LIKE ? OR customer_phone LIKE ?)'
            params.extend([f"%{phone_suffix}%", f"%{digits}%"])

        order = query_db(sql, params, one=True)
        if order:
            items = query_db('SELECT * FROM order_items WHERE order_id = ?', (order['id'],))
            timeline = query_db('SELECT * FROM order_timeline WHERE order_id = ? ORDER BY id ASC', (order['id'],))

    return render_template(
        'track_order.html',
        order=order,
        items=items,
        timeline=timeline,
        searched=searched,
        order_query=order_query,
        phone_query=phone_query
    )

# 9. Wishlist Page
@storefront_bp.route('/wishlist')
def wishlist():
    user_id = session.get('user_id')
    session_id = session.sid if hasattr(session, 'sid') else session.get('_id', 'guest_sess')
    
    products = query_db('''
        SELECT p.*, w.created_at as added_at
        FROM wishlist w
        JOIN products p ON w.product_id = p.id
        WHERE (w.user_id = ? OR w.session_id = ?) AND p.status = 'active'
        ORDER BY w.id DESC
    ''', (user_id, session_id))

    return render_template('account/wishlist.html', products=products)

# 10. Brand Pages
@storefront_bp.route('/about')
def about():
    return render_template('about.html')

@storefront_bp.route('/contact', methods=['GET', 'POST'])
def contact():
    if request.method == 'POST':
        name = request.form.get('name')
        email = request.form.get('email')
        phone = request.form.get('phone')
        subject = request.form.get('subject')
        message = request.form.get('message')
        
        execute_db('''
            INSERT INTO notifications (recipient_type, recipient, title, message, channel, status)
            VALUES ('admin', ?, ?, ?, 'web', 'received')
        ''', (email, f"Contact: {subject} ({name} - {phone})", message))
        
        flash('Thank you for contacting Khushi Collection! Our concierge team will reach out within 2 hours.', 'success')
        return redirect(url_for('storefront.contact'))

    return render_template('contact.html')

@storefront_bp.route('/faq')
def faq():
    return render_template('faq.html')

@storefront_bp.route('/size-guide')
def size_guide():
    return render_template('size_guide.html')

@storefront_bp.route('/terms')
def terms():
    return render_template('policies/terms.html')

@storefront_bp.route('/privacy')
def privacy():
    return render_template('policies/privacy.html')

@storefront_bp.route('/shipping-policy')
def shipping_policy():
    return render_template('policies/shipping.html')

@storefront_bp.route('/return-policy')
def return_policy():
    return render_template('policies/returns.html')
