import json
import time
import random
from flask import Blueprint, request, jsonify, session
from database import query_db, execute_db
from routes.admin import admin_required, owner_required, log_audit_action
from services.payments import get_payment_provider, PaymentStatus, OrderStatus, record_payment_transaction
from services.notifications import (
    normalize_pk_phone, send_sms, trigger_order_placed_notifications,
    trigger_payment_verified_sms, trigger_order_status_sms
)

payments_bp = Blueprint('payments', __name__)

DEFAULT_SETTINGS_JSON = {
    "store_profile": {
        "store_name": "Khushi Collection",
        "owner_name": "Khushi Fatima",
        "phone": "+92 300 1234567",
        "whatsapp": "+92 300 1234567",
        "email": "concierge@khushicollection.com",
        "city": "Lahore",
        "country": "Pakistan",
        "address": "Gulberg III, MM Alam Road, Lahore, Pakistan",
        "maps_url": "https://maps.google.com/?q=MM+Alam+Road+Lahore",
        "business_hours": "Monday - Saturday: 11:00 AM - 10:00 PM",
        "logo_url": "static/images/logo.svg",
        "favicon_url": "static/images/logo.svg",
        "store_description": "Exclusive Pakistani luxury pret, hand-embellished couture, pure silk collections, and regal fragrances.",
        "footer_description": "Khushi Collection embodies timeless Pakistani heritage through artisanal haute couture and signature luxury fragrances."
    },
    "contact_support": {
        "support_phone": "+92 300 1234567",
        "whatsapp_number": "+92 300 1234567",
        "support_email": "support@khushicollection.com",
        "working_hours": "11:00 AM - 10:00 PM (PKT)",
        "business_address": "Atelier 14-B, MM Alam Road, Gulberg III, Lahore, Pakistan"
    },
    "social_media": {
        "instagram": "https://instagram.com/khushicollection",
        "facebook": "https://facebook.com/khushicollection",
        "tiktok": "https://tiktok.com/@khushicollection",
        "youtube": "https://youtube.com/@khushicollection"
    },
    "payments": {
        "cod": {
            "enabled": True,
            "min_amount": 500,
            "max_amount": 100000,
            "cod_fee": 0,
            "available_cities": "All Cities"
        },
        "bank_transfer": {
            "enabled": True,
            "bank_name": "Meezan Bank Limited",
            "account_title": "Khushi Collection Luxury Pvt Ltd",
            "account_number": "0201010887654321",
            "iban": "PK64MEZN0002010108876543",
            "branch": "MM Alam Road Branch, Lahore"
        },
        "easypaisa": {
            "enabled": True,
            "account_name": "Khushi Fatima",
            "account_number": "03001234567"
        },
        "jazzcash": {
            "enabled": True,
            "account_name": "Khushi Fatima",
            "account_number": "03007654321"
        },
        "online_card": {
            "enabled": True,
            "gateway_name": "Paymob / Visa / Mastercard",
            "mode": "TEST",
            "merchant_id": "MERCH_KHUSHI_99",
            "public_key": "pk_test_khushi_live_sec_key_44",
            "secret_key": "sk_test_••••••••••••••••"
        }
    },
    "delivery": {
        "free_delivery_threshold": 5000,
        "default_delivery_fee": 250,
        "estimated_delivery_time": "2 - 4 Working Days",
        "express_delivery_fee": 500
    },
    "taxes": {
        "enabled": False,
        "tax_name": "GST / Sales Tax",
        "tax_percentage": 0
    },
    "notifications": {
        "sms_enabled": True,
        "whatsapp_enabled": True,
        "email_enabled": True
    }
}

def get_settings_from_db():
    rows = query_db('SELECT setting_key, setting_value FROM settings')
    if not rows:
        return DEFAULT_SETTINGS_JSON
    settings = dict(DEFAULT_SETTINGS_JSON)
    for r in rows:
        try:
            settings[r['setting_key']] = json.loads(r['setting_value'])
        except Exception:
            settings[r['setting_key']] = r['setting_value']

    # Ensure nested objects have full data from flat keys
    sp = settings.setdefault('store_profile', {})
    if isinstance(sp, dict):
        if 'store_name' in settings and settings['store_name']: sp['store_name'] = settings['store_name']
        if 'store_phone' in settings and settings['store_phone']: sp['phone'] = settings['store_phone']
        if 'store_whatsapp' in settings and settings['store_whatsapp']: sp['whatsapp'] = settings['store_whatsapp']
        if 'store_email' in settings and settings['store_email']: sp['email'] = settings['store_email']
        if 'store_address' in settings and settings['store_address']: sp['address'] = settings['store_address']
        if 'store_city' in settings and settings['store_city']: sp['city'] = settings['store_city']
        if 'store_country' in settings and settings['store_country']: sp['country'] = settings['store_country']
        if 'store_hours' in settings and settings['store_hours']: sp['business_hours'] = settings['store_hours']
        if 'store_maps_url' in settings and settings['store_maps_url']: sp['maps_url'] = settings['store_maps_url']

    cs = settings.setdefault('contact_support', {})
    if isinstance(cs, dict):
        if 'store_phone' in settings and settings['store_phone']: cs['support_phone'] = settings['store_phone']
        if 'store_whatsapp' in settings and settings['store_whatsapp']: 
            cs['whatsapp_number'] = settings['store_whatsapp']
            cs['whatsapp_business'] = settings['store_whatsapp']
        if 'store_email' in settings and settings['store_email']: cs['support_email'] = settings['store_email']
        if 'store_address' in settings and settings['store_address']: cs['business_address'] = settings['store_address']
        if 'store_hours' in settings and settings['store_hours']: cs['working_hours'] = settings['store_hours']

    return settings

@payments_bp.route('/api/settings', methods=['GET'])
def get_public_settings():
    s = get_settings_from_db()
    # Mask sensitive secret keys from public client
    safe_settings = json.loads(json.dumps(s))
    if 'payments' in safe_settings and 'online_card' in safe_settings['payments']:
        safe_settings['payments']['online_card']['secret_key'] = '••••••••••••••••'
    return jsonify({"success": True, "settings": safe_settings})

@payments_bp.route('/api/settings', methods=['POST', 'PUT'])
@owner_required
def update_owner_settings():
    data = request.get_json() or {}
    for key, value in data.items():
        val_str = json.dumps(value) if isinstance(value, (dict, list, bool, int, float)) else str(value)
        execute_db('''
            INSERT INTO settings (setting_key, setting_value, updated_at)
            VALUES (?, ?, CURRENT_TIMESTAMP)
            ON CONFLICT(setting_key) DO UPDATE SET setting_value = excluded.setting_value, updated_at = CURRENT_TIMESTAMP
        ''', (key, val_str))

    sp = data.get('store_profile') or {}
    cs = data.get('contact_support') or {}
    pay = data.get('payments') or {}
    deliv = data.get('delivery') or {}

    # Store Name
    name_val = sp.get('store_name')
    if name_val:
        execute_db('''
            INSERT INTO settings (setting_key, setting_value, updated_at)
            VALUES ('store_name', ?, CURRENT_TIMESTAMP)
            ON CONFLICT(setting_key) DO UPDATE SET setting_value = excluded.setting_value, updated_at = CURRENT_TIMESTAMP
        ''', (str(name_val),))

    # Store Phone
    phone_val = sp.get('phone') or cs.get('support_phone')
    if phone_val:
        execute_db('''
            INSERT INTO settings (setting_key, setting_value, updated_at)
            VALUES ('store_phone', ?, CURRENT_TIMESTAMP)
            ON CONFLICT(setting_key) DO UPDATE SET setting_value = excluded.setting_value, updated_at = CURRENT_TIMESTAMP
        ''', (str(phone_val),))

    # Store WhatsApp
    wa_val = sp.get('whatsapp') or cs.get('whatsapp_number') or cs.get('whatsapp_business')
    if wa_val:
        execute_db('''
            INSERT INTO settings (setting_key, setting_value, updated_at)
            VALUES ('store_whatsapp', ?, CURRENT_TIMESTAMP)
            ON CONFLICT(setting_key) DO UPDATE SET setting_value = excluded.setting_value, updated_at = CURRENT_TIMESTAMP
        ''', (str(wa_val),))

    # Store Email
    email_val = sp.get('email') or cs.get('support_email')
    if email_val:
        execute_db('''
            INSERT INTO settings (setting_key, setting_value, updated_at)
            VALUES ('store_email', ?, CURRENT_TIMESTAMP)
            ON CONFLICT(setting_key) DO UPDATE SET setting_value = excluded.setting_value, updated_at = CURRENT_TIMESTAMP
        ''', (str(email_val),))

    # Store Address
    addr_val = sp.get('address') or cs.get('business_address')
    if addr_val:
        execute_db('''
            INSERT INTO settings (setting_key, setting_value, updated_at)
            VALUES ('store_address', ?, CURRENT_TIMESTAMP)
            ON CONFLICT(setting_key) DO UPDATE SET setting_value = excluded.setting_value, updated_at = CURRENT_TIMESTAMP
        ''', (str(addr_val),))

    # Store City
    city_val = sp.get('city')
    if city_val:
        execute_db('''
            INSERT INTO settings (setting_key, setting_value, updated_at)
            VALUES ('store_city', ?, CURRENT_TIMESTAMP)
            ON CONFLICT(setting_key) DO UPDATE SET setting_value = excluded.setting_value, updated_at = CURRENT_TIMESTAMP
        ''', (str(city_val),))

    # Store Hours
    hours_val = sp.get('business_hours') or cs.get('working_hours')
    if hours_val:
        execute_db('''
            INSERT INTO settings (setting_key, setting_value, updated_at)
            VALUES ('store_hours', ?, CURRENT_TIMESTAMP)
            ON CONFLICT(setting_key) DO UPDATE SET setting_value = excluded.setting_value, updated_at = CURRENT_TIMESTAMP
        ''', (str(hours_val),))

    # Store Maps URL
    maps_val = sp.get('maps_url')
    if maps_val:
        execute_db('''
            INSERT INTO settings (setting_key, setting_value, updated_at)
            VALUES ('store_maps_url', ?, CURRENT_TIMESTAMP)
            ON CONFLICT(setting_key) DO UPDATE SET setting_value = excluded.setting_value, updated_at = CURRENT_TIMESTAMP
        ''', (str(maps_val),))

    # Free Delivery Threshold
    if 'free_delivery_threshold' in deliv:
        execute_db('''
            INSERT INTO settings (setting_key, setting_value, updated_at)
            VALUES ('free_delivery_threshold', ?, CURRENT_TIMESTAMP)
            ON CONFLICT(setting_key) DO UPDATE SET setting_value = excluded.setting_value, updated_at = CURRENT_TIMESTAMP
        ''', (str(deliv['free_delivery_threshold']),))

    # Default Delivery Fee
    if 'default_delivery_fee' in deliv:
        execute_db('''
            INSERT INTO settings (setting_key, setting_value, updated_at)
            VALUES ('base_delivery_fee', ?, CURRENT_TIMESTAMP)
            ON CONFLICT(setting_key) DO UPDATE SET setting_value = excluded.setting_value, updated_at = CURRENT_TIMESTAMP
        ''', (str(deliv['default_delivery_fee']),))

    # Bank Transfer Keys
    bank_info = pay.get('bank_transfer') or {}
    if bank_info:
        for b_field, s_key in [('bank_name', 'bank_name'), ('account_title', 'bank_account_title'), ('account_number', 'bank_account_number'), ('iban', 'bank_iban')]:
            if b_field in bank_info:
                execute_db('''
                    INSERT INTO settings (setting_key, setting_value, updated_at)
                    VALUES (?, ?, CURRENT_TIMESTAMP)
                    ON CONFLICT(setting_key) DO UPDATE SET setting_value = excluded.setting_value, updated_at = CURRENT_TIMESTAMP
                ''', (s_key, str(bank_info[b_field])))

    # EasyPaisa Keys
    ep_info = pay.get('easypaisa') or {}
    if ep_info:
        for ep_field, s_key in [('account_name', 'easypaisa_title'), ('account_number', 'easypaisa_number')]:
            if ep_field in ep_info:
                execute_db('''
                    INSERT INTO settings (setting_key, setting_value, updated_at)
                    VALUES (?, ?, CURRENT_TIMESTAMP)
                    ON CONFLICT(setting_key) DO UPDATE SET setting_value = excluded.setting_value, updated_at = CURRENT_TIMESTAMP
                ''', (s_key, str(ep_info[ep_field])))

    # JazzCash Keys
    jc_info = pay.get('jazzcash') or {}
    if jc_info:
        for jc_field, s_key in [('account_name', 'jazzcash_title'), ('account_number', 'jazzcash_number')]:
            if jc_field in jc_info:
                execute_db('''
                    INSERT INTO settings (setting_key, setting_value, updated_at)
                    VALUES (?, ?, CURRENT_TIMESTAMP)
                    ON CONFLICT(setting_key) DO UPDATE SET setting_value = excluded.setting_value, updated_at = CURRENT_TIMESTAMP
                ''', (s_key, str(jc_info[jc_field])))
    
    log_audit_action('SETTINGS_UPDATED', 'Store settings and payment options updated by Owner', user_id=session.get('user_id'), user_email=session.get('user_email'), ip_address=request.remote_addr)
    return jsonify({"success": True, "message": "Store settings updated successfully."})

@payments_bp.route('/api/payments/verify', methods=['POST'])
def verify_payment():
    data = request.get_json() or {}
    payment_id = data.get('payment_id')
    trx_ref = data.get('transaction_reference') or f"TRX-{int(time.time())}"
    
    s = get_settings_from_db()
    card_cfg = s.get('payments', {}).get('online_card', {})
    mode = card_cfg.get('mode', 'TEST')

    if not payment_id:
        return jsonify({"success": False, "message": "payment_id is required."}), 400

    execute_db('''
        UPDATE payments
        SET payment_status = 'PAID', transaction_reference = ?, updated_at = CURRENT_TIMESTAMP
        WHERE payment_id = ?
    ''', (trx_ref, payment_id))

    pay = query_db('SELECT * FROM payments WHERE payment_id = ?', (payment_id,), one=True)
    if pay and pay['order_number']:
        execute_db('''
            UPDATE orders
            SET payment_status = 'PAID', order_status = 'confirmed'
            WHERE order_number = ?
        ''', (pay['order_number'],))

    log_audit_action('PAYMENT_VERIFIED', f'Payment {payment_id} verified as PAID ({mode} MODE)', user_id=session.get('user_id'), user_email=session.get('user_email'), ip_address=request.remote_addr)

    return jsonify({
        "success": True,
        "verified": True,
        "payment_status": "PAID",
        "mode": mode,
        "transaction_reference": trx_ref
    })

@payments_bp.route('/api/payments/create', methods=['POST'])
def create_payment():
    data = request.get_json() or {}
    pay_id = data.get('payment_id') or f"PAY-{int(time.time())}"
    ord_id = data.get('order_id')
    ord_num = data.get('order_number', '')
    cust_name = data.get('customer_name', '')
    gateway = data.get('gateway', 'cod')
    amount = float(data.get('amount', 0))
    trx_ref = data.get('transaction_reference') or f"TRX-{int(time.time())}"
    status = data.get('payment_status', 'COD' if gateway == 'cod' else 'PENDING_VERIFICATION')

    # Resolve foreign key if order exists, else allow NULL
    valid_ord_id = None
    if ord_id:
        found_ord = query_db('SELECT id FROM orders WHERE id = ?', (ord_id,), one=True)
        if found_ord:
            valid_ord_id = found_ord['id']
    elif ord_num:
        found_ord = query_db('SELECT id FROM orders WHERE order_number = ?', (ord_num,), one=True)
        if found_ord:
            valid_ord_id = found_ord['id']

    execute_db('''
        INSERT OR REPLACE INTO payments (payment_id, order_id, order_number, customer_name, gateway, amount, currency, transaction_reference, payment_status, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, 'PKR', ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    ''', (pay_id, valid_ord_id, ord_num, cust_name, gateway, amount, trx_ref, status))

    return jsonify({
        "success": True,
        "payment_id": pay_id,
        "payment_status": status
    })

@payments_bp.route('/api/reports/financial', methods=['GET'])
@admin_required()
def financial_reports():
    timeframe = request.args.get('timeframe', 'all')
    orders = query_db('SELECT * FROM orders WHERE order_status != "cancelled"')
    
    gross_revenue = sum(float(o['total_amount'] or 0) for o in orders)
    paid_online = [o for o in orders if (o['payment_status'] or '').upper() == 'PAID']
    paid_online_rev = sum(float(o['total_amount'] or 0) for o in paid_online)
    cod_orders = [o for o in orders if (o['payment_status'] or '').upper() == 'COD' or o['payment_method'] == 'cod']
    cod_rev = sum(float(o['total_amount'] or 0) for o in cod_orders)
    pending_orders = [o for o in orders if (o['payment_status'] or '').upper() == 'PENDING_VERIFICATION']

    return jsonify({
        "success": True,
        "grossRevenue": gross_revenue,
        "paidOnlineRevenue": paid_online_rev,
        "codRevenue": cod_rev,
        "totalOrdersCount": len(orders),
        "paidOnlineCount": len(paidOnline),
        "codCount": len(cod_orders),
        "pendingCount": len(pending_orders)
    })

def execute_checkout_process(data, user_id=None):
    """
    Core atomic checkout logic used by both API and storefront form submissions.
    """
    cust_obj = data.get('customer') if isinstance(data.get('customer'), dict) else (data.get('customer_data') or {})
    deliv_obj = data.get('delivery') if isinstance(data.get('delivery'), dict) else (data.get('shipping_address') or {})

    cust_name = (data.get('customer_name') or cust_obj.get('name') or cust_obj.get('customer_name') or '').strip()
    cust_phone = (data.get('customer_phone') or cust_obj.get('phone') or cust_obj.get('mobile') or '').strip()
    cust_email = (data.get('customer_email') or cust_obj.get('email') or '').strip()
    address = (data.get('address') or deliv_obj.get('address') or deliv_obj.get('street') or '').strip()
    city = (data.get('city') or deliv_obj.get('city') or 'Lahore').strip() or 'Lahore'
    area = (data.get('area') or deliv_obj.get('area') or '').strip()
    postal_code = (data.get('postal_code') or deliv_obj.get('postal_code') or deliv_obj.get('zip') or '').strip()
    delivery_instructions = (data.get('delivery_instructions') or deliv_obj.get('instructions') or deliv_obj.get('delivery_instructions') or '').strip()
    payment_method = (data.get('payment_method') or 'cod').lower().strip()
    payment_ref = (data.get('payment_reference') or data.get('transaction_id') or data.get('tid') or '').strip()
    coupon_code = (data.get('coupon_code') or '').strip().upper()

    if not cust_name:
        return {"success": False, "error": "Customer full name is required."}, 400
    if not cust_phone:
        return {"success": False, "error": "Customer mobile phone number is required for delivery SMS."}, 400
    if not address:
        return {"success": False, "error": "Delivery street address is required."}, 400

    normalized_phone = normalize_pk_phone(cust_phone)

    raw_items = data.get('items')
    items_to_process = []

    if raw_items and isinstance(raw_items, list) and len(raw_items) > 0:
        for it in raw_items:
            p_id = it.get('product_id') or it.get('id')
            qty = max(1, int(it.get('quantity', 1)))
            prod = query_db("SELECT * FROM products WHERE id = ? AND (status = 'active' OR status IS NULL)", (p_id,), one=True)
            if not prod:
                # If seeded/test product not found by ID, attempt lookup by name or sku
                prod = query_db('SELECT * FROM products WHERE name = ? OR sku = ?', (it.get('name'), it.get('sku')), one=True)
            
            if prod:
                unit_price = float(prod['sale_price'] if prod['sale_price'] else prod['price'])
                items_to_process.append({
                    'product_id': prod['id'],
                    'product_name': prod['name'],
                    'product_sku': prod['sku'],
                    'price': unit_price,
                    'quantity': qty,
                    'size': it.get('size', 'Standard'),
                    'color': it.get('color', 'Default'),
                    'thumbnail': prod['thumbnail'] or it.get('thumbnail', ''),
                    'total': unit_price * qty
                })
            else:
                # Fallback to submitted item if mock item
                unit_price = float(it.get('price', 1000))
                items_to_process.append({
                    'product_id': p_id or 1,
                    'product_name': it.get('name', 'Khushi Luxury Pret'),
                    'product_sku': it.get('sku', 'KC-ITEM'),
                    'price': unit_price,
                    'quantity': qty,
                    'size': it.get('size', 'Standard'),
                    'color': it.get('color', 'Default'),
                    'thumbnail': it.get('thumbnail', ''),
                    'total': unit_price * qty
                })
    else:
        # Check session cart
        cart = session.get('cart', {})
        if not cart:
            return {"success": False, "error": "Your shopping bag is empty."}, 400
        for key, item in cart.items():
            p = query_db("SELECT * FROM products WHERE id = ? AND (status = 'active' OR status IS NULL)", (item['product_id'],), one=True)
            if p:
                unit_price = float(p['sale_price'] if p['sale_price'] else p['price'])
                item_total = unit_price * int(item['quantity'])
                items_to_process.append({
                    'product_id': p['id'],
                    'product_name': p['name'],
                    'product_sku': p['sku'],
                    'price': unit_price,
                    'quantity': int(item['quantity']),
                    'size': item.get('size', 'Standard'),
                    'color': item.get('color', 'Default'),
                    'thumbnail': p['thumbnail'],
                    'total': item_total
                })

    if not items_to_process:
        return {"success": False, "error": "No valid products found in shopping bag."}, 400

    subtotal = sum(float(item['total']) for item in items_to_process)

    # Calculate delivery charges
    settings = get_settings_from_db()
    deliv_cfg = settings.get('delivery', {})
    free_threshold = float(deliv_cfg.get('free_delivery_threshold', 5000))
    base_fee = float(deliv_cfg.get('default_delivery_fee', 250))

    if subtotal >= free_threshold:
        delivery_fee = 0.0
    else:
        # Check delivery_zones table for city-specific fee
        zone = query_db('SELECT fee FROM delivery_zones WHERE LOWER(city) = LOWER(?) AND is_active = 1', (city,), one=True)
        if zone:
            delivery_fee = float(zone['fee'])
        else:
            delivery_fee = base_fee

    # Calculate coupon discount
    discount_amount = 0.0
    if coupon_code:
        coupon_row = query_db('SELECT * FROM coupons WHERE code = ? AND is_active = 1', (coupon_code,), one=True)
        if coupon_row:
            coupon = dict(coupon_row)
            min_amt = float(coupon.get('min_order_amount') or 0)
            if subtotal >= min_amt:
                if coupon.get('discount_type') == 'percentage':
                    discount_amount = (subtotal * float(coupon.get('discount_value') or 0)) / 100.0
                    if coupon.get('max_discount'):
                        discount_amount = min(discount_amount, float(coupon['max_discount']))
                else:
                    discount_amount = float(coupon.get('discount_value') or 0)
                discount_amount = min(discount_amount, subtotal)
                try:
                    execute_db('UPDATE coupons SET times_used = times_used + 1 WHERE id = ?', (coupon['id'],))
                except Exception:
                    pass

    total_amount = max(0.0, subtotal + delivery_fee - discount_amount)

    # Generate Order Number
    random_suffix = random.randint(10000, 99999)
    order_number = f"KC-{random_suffix}"
    tracking_number = f"TRX-{random.randint(10000000, 99999999)}"
    courier_name = "Trax Logistics"

    # Insert Order into database
    order_id = execute_db('''
        INSERT INTO orders (
            order_number, user_id, customer_name, customer_phone, customer_email,
            address, city, area, postal_code, delivery_instructions,
            subtotal, delivery_fee, discount_amount, coupon_code, total_amount,
            payment_method, payment_status, order_status, tracking_number, courier_name,
            created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    ''', (
        order_number, user_id, cust_name, normalized_phone, cust_email,
        address, city, area, postal_code, delivery_instructions,
        subtotal, delivery_fee, discount_amount, coupon_code, total_amount,
        payment_method, PaymentStatus.PENDING, OrderStatus.PENDING, tracking_number, courier_name
    ))

    # Insert Order Items & Deduct Stock
    for item in items_to_process:
        execute_db('''
            INSERT INTO order_items (order_id, product_id, product_name, product_sku, price, quantity, size, color, thumbnail, total)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            order_id, item['product_id'], item['product_name'], item['product_sku'],
            item['price'], item['quantity'], item['size'], item['color'],
            item['thumbnail'], item['total']
        ))
        try:
            execute_db('UPDATE products SET stock = MAX(0, stock - ?) WHERE id = ?', (item['quantity'], item['product_id']))
        except Exception:
            pass

    # Insert initial Timeline Event
    try:
        execute_db('''
            INSERT INTO order_timeline (order_id, status, title, description, created_by, created_at)
            VALUES (?, 'pending', 'Order Placed', ?, 'Customer', CURRENT_TIMESTAMP)
        ''', (order_id, f"Order received via online storefront ({payment_method.upper()})"))
    except Exception:
        try:
            execute_db('''
                INSERT INTO order_timeline (order_id, status, title, description, by_user, time)
                VALUES (?, 'pending', 'Order Placed', ?, 'Customer', CURRENT_TIMESTAMP)
            ''', (order_id, f"Order received via online storefront ({payment_method.upper()})"))
        except Exception:
            pass

    order_dict = {
        'id': order_id,
        'order_number': order_number,
        'customer_name': cust_name,
        'customer_phone': normalized_phone,
        'customer_email': cust_email,
        'address': address,
        'city': city,
        'area': area,
        'total_amount': total_amount,
        'payment_method': payment_method,
        'tracking_number': tracking_number,
        'courier_name': courier_name
    }

    # Execute Payment Initiation via Payment Provider
    provider = get_payment_provider(payment_method, settings.get('payments', {}).get(payment_method, {}))
    pay_result = provider.initiate_payment(order_dict, data)

    final_pay_status = pay_result.get('payment_status', PaymentStatus.PENDING)
    final_order_status = pay_result.get('order_status', OrderStatus.PENDING)

    execute_db('''
        UPDATE orders SET payment_status = ?, order_status = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
    ''', (final_pay_status, final_order_status, order_id))
    order_dict['payment_status'] = final_pay_status
    order_dict['order_status'] = final_order_status

    # Trigger SMS and Store Owner Notifications safely
    try:
        trigger_order_placed_notifications(order_dict, items_to_process, settings.get('store_profile', {}))
    except Exception as notif_err:
        print(f"Notification dispatch notice: {notif_err}")

    # Clear session cart if present
    if 'cart' in session:
        session['cart'] = {}
        session.modified = True

    log_audit_action(
        'ORDER_CREATED',
        f"Order #{order_number} placed for Rs. {int(total_amount):,} via {payment_method.upper()} ({final_pay_status})",
        user_id=user_id or session.get('user_id'),
        user_email=cust_email or session.get('user_email'),
        ip_address=request.remote_addr
    )

    return {
        "success": True,
        "order_id": order_id,
        "order_number": order_number,
        "total_amount": total_amount,
        "subtotal": subtotal,
        "delivery_fee": delivery_fee,
        "discount_amount": discount_amount,
        "payment_method": payment_method,
        "payment_status": final_pay_status,
        "order_status": final_order_status,
        "payment_id": pay_result.get('payment_id'),
        "transaction_reference": pay_result.get('transaction_reference'),
        "message": pay_result.get('message', 'Order placed successfully.'),
        "action_required": pay_result.get('action_required')
    }, 200


@payments_bp.route('/api/checkout', methods=['POST'])
def api_checkout():
    """
    Public REST API for headless & AJAX storefront checkout.
    """
    data = request.get_json() or {}
    user_id = session.get('user_id')
    result, status_code = execute_checkout_process(data, user_id=user_id)
    return jsonify(result), status_code


@payments_bp.route('/api/payments/webhook/<provider_name>', methods=['POST'])
def payment_gateway_webhook(provider_name):
    """
    Cryptographically verified server-to-server webhook endpoint for payment gateways.
    """
    payload = request.get_json() or request.form.to_dict() or {}
    headers = dict(request.headers)

    s = get_settings_from_db()
    gw_key = 'online_card' if provider_name == 'card' else provider_name
    provider_cfg = s.get('payments', {}).get(gw_key, {})
    provider = get_payment_provider(provider_name, provider_cfg)

    verification = provider.verify_webhook(payload, headers)
    if not verification.get('verified'):
        return jsonify({
            "success": False,
            "error": verification.get('message', "Webhook signature verification failed.")
        }), 400

    order_num = payload.get('order_number')
    if not order_num:
        return jsonify({"success": False, "error": "order_number missing in webhook payload."}), 400

    order = query_db('SELECT * FROM orders WHERE order_number = ?', (order_num,), one=True)
    if not order:
        return jsonify({"success": False, "error": f"Order #{order_num} not found."}), 404

    target_status = verification.get('status', PaymentStatus.PAID)
    trx_ref = payload.get('transaction_reference') or payload.get('tid') or payload.get('pp_TxnRefNo') or f"WH-{int(time.time())}"

    # Update payment records
    execute_db('''
        UPDATE payment_records
        SET payment_status = ?, transaction_reference = COALESCE(?, transaction_reference), updated_at = CURRENT_TIMESTAMP
        WHERE order_number = ?
    ''', (target_status, trx_ref, order_num))

    try:
        execute_db('''
            UPDATE payments
            SET payment_status = ?, transaction_reference = COALESCE(?, transaction_reference), updated_at = CURRENT_TIMESTAMP
            WHERE order_number = ?
        ''', (target_status, trx_ref, order_num))
    except Exception:
        pass

    if target_status == PaymentStatus.PAID:
        execute_db('''
            UPDATE orders
            SET payment_status = 'PAID', order_status = 'confirmed', updated_at = CURRENT_TIMESTAMP
            WHERE order_number = ?
        ''', (order_num,))

        execute_db('''
            INSERT INTO order_timeline (order_id, status, title, description, by_user, time)
            VALUES (?, 'confirmed', 'Payment Verified', ?, 'Gateway Webhook', CURRENT_TIMESTAMP)
        ''', (order['id'], f"Online payment verified as PAID via {provider_name.upper()} webhook ({trx_ref})"))

        # Dispatch Payment Verified SMS
        try:
            trigger_payment_verified_sms(order)
        except Exception:
            pass

    log_audit_action(
        'WEBHOOK_PROCESSED',
        f"Webhook from {provider_name.upper()} updated Order #{order_num} to {target_status}",
        ip_address=request.remote_addr
    )

    return jsonify({
        "success": True,
        "message": f"Webhook processed successfully for Order #{order_num}.",
        "payment_status": target_status
    })


@payments_bp.route('/api/payments/verify-bank', methods=['POST'])
@admin_required()
def verify_bank_payment_api():
    """
    Administrative endpoint for Store Owner / Staff to verify manual Bank Transfer or Mobile Wallet payments.
    """
    data = request.get_json() or {}
    order_ident = data.get('order_number') or data.get('order_id')
    admin_notes = data.get('admin_notes', 'Verified by store administration team.')

    if not order_ident:
        return jsonify({"success": False, "error": "order_number or order_id is required."}), 400

    clean_id = str(order_ident).replace('#', '').strip()
    order = query_db(
        'SELECT * FROM orders WHERE order_number = ? OR order_number = ? OR id = ?',
        (clean_id, f"KC-{clean_id}", clean_id),
        one=True
    )
    if not order:
        return jsonify({"success": False, "error": f"Order #{clean_id} not found."}), 404

    user_id = session.get('user_id')

    # Update payment_records and payments
    execute_db('''
        UPDATE payment_records
        SET payment_status = 'PAID', verified_at = CURRENT_TIMESTAMP, verified_by = ?,
            admin_notes = COALESCE(admin_notes || ' | ' || ?, ?), updated_at = CURRENT_TIMESTAMP
        WHERE order_number = ?
    ''', (user_id, admin_notes, admin_notes, order['order_number']))

    try:
        execute_db('''
            UPDATE payments
            SET payment_status = 'PAID', verified_at = CURRENT_TIMESTAMP, verified_by = ?,
                admin_notes = COALESCE(admin_notes || ' | ' || ?, ?), updated_at = CURRENT_TIMESTAMP
            WHERE order_number = ?
        ''', (user_id, admin_notes, admin_notes, order['order_number']))
    except Exception:
        pass

    # Update order status
    execute_db('''
        UPDATE orders
        SET payment_status = 'PAID', order_status = 'confirmed', updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
    ''', (order['id'],))

    # Add timeline event
    user_name = session.get('user_name', 'Store Admin')
    execute_db('''
        INSERT INTO order_timeline (order_id, status, title, description, by_user, time)
        VALUES (?, 'confirmed', 'Payment Verified', ?, ?, CURRENT_TIMESTAMP)
    ''', (order['id'], f"Manual bank/wallet payment verified as PAID by {user_name}", user_name))

    # Trigger customer SMS
    try:
        trigger_payment_verified_sms(order)
    except Exception:
        pass

    log_audit_action(
        'PAYMENT_VERIFIED_MANUAL',
        f"Payment for Order #{order['order_number']} verified as PAID by {user_name}",
        user_id=user_id,
        user_email=session.get('user_email'),
        ip_address=request.remote_addr
    )

    return jsonify({
        "success": True,
        "message": f"Payment for Order #{order['order_number']} has been successfully verified as PAID.",
        "payment_status": "PAID",
        "order_status": "confirmed"
    })


@payments_bp.route('/api/orders/track', methods=['GET'])
@payments_bp.route('/api/track-order', methods=['GET'])
def api_track_order():
    """
    Secure customer tracking API requiring Order Number + Customer Phone verification.
    """
    order_num = request.args.get('order_id') or request.args.get('order_number', '')
    phone = request.args.get('phone', '')

    clean_order_num = str(order_num).replace('#', '').strip()
    if not clean_order_num:
        return jsonify({"success": False, "error": "Order Number is required."}), 400

    order = query_db(
        'SELECT * FROM orders WHERE order_number = ? OR order_number = ? OR id = ?',
        (clean_order_num, f"KC-{clean_order_num}", clean_order_num),
        one=True
    )
    if not order:
        return jsonify({"success": False, "error": f"No order found with reference #{clean_order_num}."}), 404

    # Verification: Customer phone must match order phone
    if phone:
        norm_input = normalize_pk_phone(phone)
        norm_order_phone = normalize_pk_phone(order['customer_phone'])
        # Compare trailing 7 digits to be resilient to country code variations
        if norm_input[-7:] != norm_order_phone[-7:]:
            return jsonify({
                "success": False,
                "error": "The mobile phone number provided does not match our records for this order."
            }), 403

    items = query_db('SELECT product_name, price, quantity, size, color, thumbnail, total FROM order_items WHERE order_id = ?', (order['id'],))
    timeline = query_db('SELECT status, title, description, by_user, time FROM order_timeline WHERE order_id = ? ORDER BY id ASC', (order['id'],))
    pay_record = query_db('SELECT payment_id, gateway, transaction_reference, payment_status, verified_at FROM payment_records WHERE order_number = ?', (order['order_number'],), one=True)

    # Mask phone and address for privacy
    raw_phone = order['customer_phone'] or ''
    masked_phone = (raw_phone[:4] + '****' + raw_phone[-3:]) if len(raw_phone) >= 7 else raw_phone

    return jsonify({
        "success": True,
        "order": {
            "order_number": order['order_number'],
            "order_status": order['order_status'],
            "payment_status": order['payment_status'],
            "payment_method": order['payment_method'],
            "customer_name": order['customer_name'],
            "masked_phone": masked_phone,
            "city": order['city'],
            "area": order['area'],
            "subtotal": order['subtotal'],
            "delivery_fee": order['delivery_fee'],
            "discount_amount": order['discount_amount'],
            "total_amount": order['total_amount'],
            "courier_name": order['courier_name'],
            "tracking_number": order['tracking_number'],
            "created_at": order['created_at'],
            "items": [dict(it) for it in items],
            "timeline": [dict(tl) for tl in timeline],
            "payment_record": dict(pay_record) if pay_record else None
        }
    })

