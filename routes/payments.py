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

    # Synchronize individual legacy setting keys for other routes
    if 'delivery' in data and isinstance(data['delivery'], dict) and 'free_delivery_threshold' in data['delivery']:
        execute_db('''
            INSERT INTO settings (setting_key, setting_value, updated_at)
            VALUES ('free_delivery_threshold', ?, CURRENT_TIMESTAMP)
            ON CONFLICT(setting_key) DO UPDATE SET setting_value = excluded.setting_value, updated_at = CURRENT_TIMESTAMP
        ''', (str(data['delivery']['free_delivery_threshold']),))
    if 'contact_support' in data and isinstance(data['contact_support'], dict) and 'whatsapp_number' in data['contact_support']:
        execute_db('''
            INSERT INTO settings (setting_key, setting_value, updated_at)
            VALUES ('store_whatsapp', ?, CURRENT_TIMESTAMP)
            ON CONFLICT(setting_key) DO UPDATE SET setting_value = excluded.setting_value, updated_at = CURRENT_TIMESTAMP
        ''', (str(data['contact_support']['whatsapp_number']),))
    if 'store_profile' in data and isinstance(data['store_profile'], dict) and 'store_name' in data['store_profile']:
        execute_db('''
            INSERT INTO settings (setting_key, setting_value, updated_at)
            VALUES ('store_name', ?, CURRENT_TIMESTAMP)
            ON CONFLICT(setting_key) DO UPDATE SET setting_value = excluded.setting_value, updated_at = CURRENT_TIMESTAMP
        ''', (str(data['store_profile']['store_name']),))
    
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
