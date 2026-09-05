import json
import random
from datetime import datetime
from flask import Blueprint, request, jsonify, session
from database import query_db, execute_db

api_bp = Blueprint('api', __name__, url_prefix='/api')

def get_cart():
    if 'cart' not in session:
        session['cart'] = {}
    return session['cart']

# 1. Global Instant Search
@api_bp.route('/search')
def live_search():
    q = request.args.get('q', '').strip()
    if len(q) < 2:
        return jsonify({'products': []})

    term = f"%{q}%"
    sql = '''
        SELECT p.id, p.name, p.slug, p.brand, p.sku, p.price, p.sale_price, p.thumbnail, p.stock, c.name as category_name
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        WHERE p.status = 'active' AND (
            p.name LIKE ? OR
            p.brand LIKE ? OR
            p.sku LIKE ? OR
            p.tags LIKE ? OR
            p.description LIKE ? OR
            c.name LIKE ?
        )
        ORDER BY p.is_bestseller DESC, p.id DESC
        LIMIT 10
    '''
    rows = query_db(sql, (term, term, term, term, term, term))
    products = [dict(r) for r in rows]
    return jsonify({'products': products})

# 2. Product Detail API (for Quick View)
@api_bp.route('/products/<int:product_id>')
def get_product(product_id):
    product = query_db('SELECT * FROM products WHERE id = ?', (product_id,), one=True)
    if not product:
        return jsonify({'error': 'Product not found'}), 404
    return jsonify(dict(product))

# 3. Cart API
@api_bp.route('/cart')
def get_cart_data():
    cart = get_cart()
    items = []
    subtotal = 0.0
    total_count = 0

    for key, item in cart.items():
        product = query_db('SELECT id, name, slug, price, sale_price, thumbnail, stock FROM products WHERE id = ?', (item['product_id'],), one=True)
        if product:
            unit_price = float(product['sale_price'] if product['sale_price'] else product['price'])
            item_total = unit_price * int(item['quantity'])
            subtotal += item_total
            total_count += int(item['quantity'])
            items.append({
                'key': key,
                'product_id': product['id'],
                'name': product['name'],
                'slug': product['slug'],
                'thumbnail': product['thumbnail'],
                'price': unit_price,
                'regular_price': float(product['price']),
                'quantity': int(item['quantity']),
                'size': item.get('size', ''),
                'color': item.get('color', ''),
                'stock': product['stock'],
                'total': item_total
            })

    return jsonify({
        'items': items,
        'subtotal': subtotal,
        'total_count': total_count
    })

@api_bp.route('/cart/add', methods=['POST'])
def add_to_cart():
    data = request.get_json() or {}
    product_id = data.get('product_id')
    qty = max(1, int(data.get('quantity', 1)))
    size = data.get('size', '')
    color = data.get('color', '')

    product = query_db('SELECT id, name, stock FROM products WHERE id = ? AND status = "active"', (product_id,), one=True)
    if not product:
        return jsonify({'success': False, 'message': 'Product unavailable'}), 404

    cart = get_cart()
    key = f"{product_id}_{size}_{color}"
    if key in cart:
        cart[key]['quantity'] += qty
    else:
        cart[key] = {
            'product_id': product_id,
            'quantity': qty,
            'size': size,
            'color': color
        }
    session['cart'] = cart
    session.modified = True

    total_count = sum(item['quantity'] for item in cart.values())
    return jsonify({'success': True, 'message': f"Added '{product['name']}' to your shopping bag!", 'cart_count': total_count})

@api_bp.route('/cart/update', methods=['POST'])
def update_cart_item():
    data = request.get_json() or {}
    key = data.get('key')
    qty = int(data.get('quantity', 1))

    cart = get_cart()
    if key in cart:
        if qty <= 0:
            del cart[key]
        else:
            cart[key]['quantity'] = qty
        session['cart'] = cart
        session.modified = True

    total_count = sum(item['quantity'] for item in cart.values())
    return jsonify({'success': True, 'cart_count': total_count})

@api_bp.route('/cart/remove', methods=['POST'])
def remove_cart_item():
    data = request.get_json() or {}
    key = data.get('key')

    cart = get_cart()
    if key in cart:
        del cart[key]
        session['cart'] = cart
        session.modified = True

    total_count = sum(item['quantity'] for item in cart.values())
    return jsonify({'success': True, 'cart_count': total_count})

@api_bp.route('/cart/count')
def cart_count():
    cart = get_cart()
    total_count = sum(item['quantity'] for item in cart.values())
    return jsonify({'count': total_count})

# 4. Wishlist API
@api_bp.route('/wishlist/toggle', methods=['POST'])
def toggle_wishlist():
    data = request.get_json() or {}
    product_id = data.get('product_id')
    user_id = session.get('user_id')
    session_id = session.sid if hasattr(session, 'sid') else session.get('_id', 'guest_sess')

    if not product_id:
        return jsonify({'success': False, 'message': 'Missing product ID'}), 400

    existing = query_db(
        'SELECT id FROM wishlist WHERE (user_id = ? OR session_id = ?) AND product_id = ?',
        (user_id, session_id, product_id),
        one=True
    )

    if existing:
        execute_db('DELETE FROM wishlist WHERE id = ?', (existing['id'],))
        in_wishlist = False
        msg = 'Removed from your wishlist'
    else:
        execute_db(
            'INSERT INTO wishlist (user_id, session_id, product_id) VALUES (?, ?, ?)',
            (user_id, session_id, product_id)
        )
        in_wishlist = True
        msg = 'Added to your wishlist ❤️'

    count = query_db(
        'SELECT COUNT(*) as cnt FROM wishlist WHERE user_id = ? OR session_id = ?',
        (user_id, session_id),
        one=True
    )['cnt']

    return jsonify({'success': True, 'in_wishlist': in_wishlist, 'message': msg, 'wishlist_count': count})

@api_bp.route('/wishlist/count')
def wishlist_count():
    user_id = session.get('user_id')
    session_id = session.sid if hasattr(session, 'sid') else session.get('_id', 'guest_sess')
    count = query_db(
        'SELECT COUNT(*) as cnt FROM wishlist WHERE user_id = ? OR session_id = ?',
        (user_id, session_id),
        one=True
    )['cnt']
    return jsonify({'count': count})

# 5. Coupon Validation
@api_bp.route('/coupon/validate', methods=['POST'])
def validate_coupon():
    data = request.get_json() or {}
    code = data.get('code', '').strip().upper()
    subtotal = float(data.get('subtotal', 0))

    if not code:
        return jsonify({'valid': False, 'message': 'Please enter a coupon code'}), 400

    coupon = query_db('SELECT * FROM coupons WHERE code = ? AND is_active = 1', (code,), one=True)
    if not coupon:
        return jsonify({'valid': False, 'message': 'Invalid coupon code'}), 404

    # Check expiry
    if coupon['expiry_date']:
        try:
            exp = datetime.strptime(coupon['expiry_date'], '%Y-%m-%d')
            if exp < datetime.now():
                return jsonify({'valid': False, 'message': 'Coupon code has expired'}), 400
        except ValueError:
            pass

    # Check minimum order
    if subtotal < coupon['min_order_amount']:
        return jsonify({
            'valid': False,
            'message': f"Minimum order of Rs. {int(coupon['min_order_amount']):,} required for this coupon"
        }), 400

    # Calculate discount
    if coupon['discount_type'] == 'percentage':
        discount = (subtotal * coupon['discount_value']) / 100.0
        if coupon['max_discount'] and discount > coupon['max_discount']:
            discount = coupon['max_discount']
    else:
        discount = coupon['discount_value']

    discount = min(discount, subtotal)

    return jsonify({
        'valid': True,
        'code': coupon['code'],
        'discount_type': coupon['discount_type'],
        'discount_value': coupon['discount_value'],
        'discount_amount': discount,
        'message': f"Coupon applied: Saved Rs. {int(discount):,}!"
    })

# 6. Delivery Fee Calculation
@api_bp.route('/delivery-fee')
def get_delivery_fee():
    city = request.args.get('city', '').strip()
    subtotal = float(request.args.get('subtotal', 0))

    # Free delivery check
    threshold_row = query_db("SELECT setting_value FROM settings WHERE setting_key = 'free_delivery_threshold'", one=True)
    threshold = float(threshold_row['setting_value']) if threshold_row else 5000.0

    if subtotal >= threshold:
        return jsonify({'delivery_fee': 0, 'free': True, 'threshold': threshold})

    rates_row = query_db("SELECT setting_value FROM settings WHERE setting_key = 'city_rates'", one=True)
    rates = json.loads(rates_row['setting_value']) if rates_row else {}

    fee = rates.get(city, rates.get('Other Cities', 250))
    return jsonify({'delivery_fee': fee, 'free': False, 'threshold': threshold})

# 7. Place Order API Endpoint (Syncs JavaScript frontend orders with SQLite DB)
@api_bp.route('/orders/place', methods=['POST'])
def api_place_order():
    data = request.get_json() or {}
    order_number = data.get('order_number')
    if not order_number:
        order_number = f"KC-{random.randint(10000, 99999)}"

    customer_name = data.get('customer_name', '').strip() or 'Valued Client'
    customer_phone = data.get('customer_phone', '').strip()
    customer_email = data.get('customer_email', '').strip()
    address = data.get('address', '').strip()
    city = data.get('city', '').strip() or 'Lahore'
    area = data.get('area', '').strip()
    delivery_instructions = data.get('delivery_instructions', '').strip()
    subtotal = float(data.get('subtotal', 0))
    discount_amount = float(data.get('discount_amount', 0))
    delivery_fee = float(data.get('delivery_fee', 0))
    total_amount = float(data.get('total_amount', subtotal - discount_amount + delivery_fee))
    payment_method = data.get('payment_method', 'cod')
    payment_status = data.get('payment_status', 'COD' if payment_method == 'cod' else 'pending')
    order_status = data.get('order_status', 'pending')
    tracking_number = data.get('tracking_number', f"TRX-{random.randint(10000000, 99999999)}")
    courier_name = data.get('courier_name', 'Trax Logistics')
    items = data.get('items', [])

    # Insert into orders table
    order_id = execute_db('''
        INSERT INTO orders (
            order_number, customer_name, customer_phone, customer_email,
            address, city, area, delivery_instructions, subtotal,
            discount_amount, delivery_fee, total_amount, payment_method,
            payment_status, order_status, tracking_number, courier_name,
            created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    ''', (
        order_number, customer_name, customer_phone, customer_email,
        address, city, area, delivery_instructions, subtotal,
        discount_amount, delivery_fee, total_amount, payment_method,
        payment_status, order_status, tracking_number, courier_name
    ))

    # Insert items
    for item in items:
        execute_db('''
            INSERT INTO order_items (
                order_id, product_id, product_name, price, quantity, size, color, thumbnail, total
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            order_id,
            item.get('product_id') or item.get('id'),
            item.get('name', 'Luxury Item'),
            float(item.get('price', 0)),
            int(item.get('quantity', 1)),
            item.get('size', ''),
            item.get('color', ''),
            item.get('thumbnail', ''),
            float(item.get('price', 0)) * int(item.get('quantity', 1))
        ))

    # Insert initial timeline
    execute_db('''
        INSERT INTO order_timeline (order_id, status, title, description, created_by, created_at)
        VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    ''', (
        order_id,
        order_status,
        'Order Placed',
        f"Order received via online storefront ({payment_method.upper()})",
        'Customer'
    ))

    return jsonify({
        'success': True,
        'order_id': order_id,
        'order_number': order_number,
        'message': 'Order successfully recorded in database'
    })

# 8. List Orders API Endpoint (Allows Admin Portal to fetch real-time orders from SQLite)
@api_bp.route('/orders', methods=['GET'])
def api_get_orders():
    rows = query_db('SELECT * FROM orders ORDER BY id DESC')
    orders = []
    for r in rows:
        ord_dict = dict(r)
        items = query_db('SELECT * FROM order_items WHERE order_id = ?', (r['id'],))
        ord_dict['items'] = [dict(it) for it in items]
        timeline = query_db('SELECT * FROM order_timeline WHERE order_id = ? ORDER BY id ASC', (r['id'],))
        ord_dict['timeline'] = [dict(tl) for tl in timeline]
        orders.append(ord_dict)
    return jsonify({'success': True, 'orders': orders, 'count': len(orders)})


# 9. Delete Order API Endpoint (Allows Admin Portal to delete an order from SQLite)
@api_bp.route('/orders/<identifier>', methods=['DELETE', 'POST'])
@api_bp.route('/orders/delete/<identifier>', methods=['POST', 'DELETE'])
def api_delete_order(identifier):
    try:
        clean = str(identifier).replace('#', '').strip()
        execute_db('DELETE FROM order_items WHERE order_id IN (SELECT id FROM orders WHERE order_number = ? OR order_number = ? OR id = ?)', (clean, f"KC-{clean}", clean))
        execute_db('DELETE FROM order_timeline WHERE order_id IN (SELECT id FROM orders WHERE order_number = ? OR order_number = ? OR id = ?)', (clean, f"KC-{clean}", clean))
        execute_db('DELETE FROM payments WHERE order_number = ? OR order_number = ? OR order_id = ?', (clean, f"KC-{clean}", clean))
        execute_db('DELETE FROM orders WHERE order_number = ? OR order_number = ? OR id = ?', (clean, f"KC-{clean}", clean))
        return jsonify({'success': True, 'message': f'Order {identifier} deleted successfully.'})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500



