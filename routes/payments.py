import json
import time
from flask import Blueprint, request, jsonify, session
from database import query_db, execute_db
from routes.admin import admin_required, owner_required, log_audit_action

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
