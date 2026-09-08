import pytest
import json
import sqlite3
import hmac
import hashlib
from app import create_app
from services.notifications import normalize_pk_phone, send_sms
from services.payments import get_payment_provider, PaymentStatus, OrderStatus

@pytest.fixture
def client():
    app = create_app()
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

def test_scenario_g_pakistani_phone_normalization():
    """Scenario G: Pakistani phone number normalizer converts all formats to E.164 +923001234567"""
    assert normalize_pk_phone("03001234567") == "+923001234567"
    assert normalize_pk_phone("0300-1234567") == "+923001234567"
    assert normalize_pk_phone("0300 1234567") == "+923001234567"
    assert normalize_pk_phone("923001234567") == "+923001234567"
    assert normalize_pk_phone("+923001234567") == "+923001234567"
    assert normalize_pk_phone("0312-9876543") == "+923129876543"

def test_scenario_a_cod_checkout(client):
    """Scenario A: COD order checkout creates pending order, payment_status COD, and notification logs"""
    conn = sqlite3.connect('khushi.db')
    cursor = conn.cursor()
    cursor.execute("SELECT id, name, price, stock FROM products WHERE status = 'active' AND stock > 0 LIMIT 1")
    prod = cursor.fetchone()
    conn.close()

    assert prod is not None, "At least one active product must exist in test database"
    prod_id, prod_name, prod_price, initial_stock = prod

    payload = {
        "customer": {
            "name": "Ayesha Khan",
            "phone": "03001112233",
            "email": "ayesha@example.com"
        },
        "delivery": {
            "address": "House 12, Street 4, F-7/2",
            "city": "Islamabad",
            "postal_code": "44000",
            "instructions": "Call before arriving"
        },
        "payment_method": "cod",
        "items": [
            {
                "product_id": prod_id,
                "quantity": 1,
                "size": "M",
                "color": "Gold"
            }
        ]
    }

    res = client.post('/api/checkout', json=payload)
    assert res.status_code in (200, 201), f"Checkout failed: {res.get_json()}"
    data = res.get_json()
    assert data['success'] is True
    assert 'order_number' in data
    order_number = data['order_number']
    assert data['payment_status'] == PaymentStatus.COD
    assert data['order_status'] == OrderStatus.PENDING

    # Verify in database
    conn = sqlite3.connect('khushi.db')
    cursor = conn.cursor()
    cursor.execute("SELECT order_status, payment_status, total_amount, customer_phone FROM orders WHERE order_number = ?", (order_number,))
    ord_row = cursor.fetchone()
    assert ord_row is not None
    assert ord_row[0] == OrderStatus.PENDING
    assert ord_row[1] == PaymentStatus.COD
    assert ord_row[3] == "+923001112233"

    # Verify SMS notifications logged
    cursor.execute("SELECT recipient, status FROM notification_logs WHERE order_number = ?", (order_number,))
    logs = cursor.fetchall()
    assert len(logs) >= 1, "Expected notification logs for customer and admin"
    conn.close()

def test_scenario_b_card_payment_webhook(client):
    """Scenario B: Card payment webhook with cryptographically verified HMAC signature marks payment PAID and order confirmed"""
    conn = sqlite3.connect('khushi.db')
    cursor = conn.cursor()
    cursor.execute("SELECT id, name, price FROM products WHERE status = 'active' LIMIT 1")
    prod = cursor.fetchone()
    conn.close()

    payload = {
        "customer": {
            "name": "Zainab Bibi",
            "phone": "03215554433",
            "email": "zainab@example.com"
        },
        "delivery": {
            "address": "Flat 302, Clifton Block 5",
            "city": "Karachi"
        },
        "payment_method": "online_card",
        "items": [
            {
                "product_id": prod[0],
                "quantity": 1
            }
        ]
    }

    res = client.post('/api/checkout', json=payload)
    assert res.status_code in (200, 201)
    data = res.get_json()
    order_number = data['order_number']
    assert data['payment_status'] in (PaymentStatus.PENDING, PaymentStatus.PROCESSING)

    # Send Card Webhook with HMAC signature
    secret = "khushi_live_webhook_secret_key_2026"
    webhook_body = json.dumps({
        "event": "payment.succeeded",
        "order_number": order_number,
        "transaction_id": "TXN-CRD-998811",
        "amount": data['total_amount'],
        "currency": "PKR",
        "status": "PAID"
    })
    signature = hmac.new(secret.encode('utf-8'), webhook_body.encode('utf-8'), hashlib.sha256).hexdigest()

    hook_res = client.post(
        '/api/payments/webhook/card',
        data=webhook_body,
        content_type='application/json',
        headers={'X-Signature': signature}
    )
    assert hook_res.status_code == 200, f"Webhook rejected: {hook_res.get_json()}"
    hook_data = hook_res.get_json()
    assert hook_data['success'] is True

    # Verify DB updated
    conn = sqlite3.connect('khushi.db')
    cursor = conn.cursor()
    cursor.execute("SELECT order_status, payment_status FROM orders WHERE order_number = ?", (order_number,))
    ord_row = cursor.fetchone()
    assert ord_row[0] == OrderStatus.CONFIRMED
    assert ord_row[1] == PaymentStatus.PAID
    conn.close()

def test_scenario_c_forged_webhook_rejected(client):
    """Scenario C: Webhook with forged/invalid HMAC signature must be rejected with 400 Bad Request"""
    fake_body = json.dumps({
        "event": "payment.succeeded",
        "order_number": "KC-FAKE-999",
        "transaction_id": "TXN-HACK",
        "amount": 5000,
        "currency": "PKR",
        "status": "PAID"
    })
    forged_sig = "0000000000000000000000000000000000000000000000000000000000000000"

    hook_res = client.post(
        '/api/payments/webhook/card',
        data=fake_body,
        content_type='application/json',
        headers={'X-Signature': forged_sig}
    )
    assert hook_res.status_code == 400
    err = hook_res.get_json().get('error', '').lower()
    assert 'invalid' in err or 'signature' in err or 'mismatch' in err

def test_scenario_d_bank_transfer_admin_verification(client):
    """Scenario D: Bank transfer creates VERIFICATION_REQUIRED status; Admin verifies payment via /admin/api/orders/<id>/verify-payment"""
    conn = sqlite3.connect('khushi.db')
    cursor = conn.cursor()
    cursor.execute("SELECT id FROM products WHERE status = 'active' LIMIT 1")
    prod = cursor.fetchone()
    conn.close()

    payload = {
        "customer": {
            "name": "Hamza Tariq",
            "phone": "03337778899",
            "email": "hamza@example.com"
        },
        "delivery": {
            "address": "House 50, Phase 6, DHA",
            "city": "Lahore"
        },
        "payment_method": "bank_transfer",
        "payment_reference": "MBL-PK-77889900",
        "items": [
            {
                "product_id": prod[0],
                "quantity": 1
            }
        ]
    }

    res = client.post('/api/checkout', json=payload)
    assert res.status_code in (200, 201)
    data = res.get_json()
    order_number = data['order_number']
    assert data['payment_status'] == PaymentStatus.VERIFICATION_REQUIRED

    # Admin verifies bank transfer
    with client.session_transaction() as sess:
        sess['user_id'] = 1
        sess['user_role'] = 'OWNER'
        sess['user_name'] = 'Store Owner'

    v_res = client.post(
        f'/admin/api/orders/{order_number}/verify-payment',
        json={"admin_notes": "Bank transfer credited in Meezan Bank account"}
    )
    assert v_res.status_code == 200
    v_data = v_res.get_json()
    assert v_data['success'] is True
    assert v_data['payment_status'] == PaymentStatus.PAID
    assert v_data['order_status'] == OrderStatus.CONFIRMED

    # Verify DB order status
    conn = sqlite3.connect('khushi.db')
    cursor = conn.cursor()
    cursor.execute("SELECT payment_status, order_status FROM orders WHERE order_number = ?", (order_number,))
    row = cursor.fetchone()
    assert row[0] == PaymentStatus.PAID
    assert row[1] == OrderStatus.CONFIRMED
    conn.close()

def test_scenario_e_order_status_lifecycle_updates(client):
    """Scenario E: Admin updating order status transitions the order and logs automated SMS"""
    conn = sqlite3.connect('khushi.db')
    cursor = conn.cursor()
    cursor.execute("SELECT id FROM products WHERE status = 'active' LIMIT 1")
    prod = cursor.fetchone()
    conn.close()

    res = client.post('/api/checkout', json={
        "customer": {"name": "Sadia Bilal", "phone": "03451122334"},
        "delivery": {"address": "Sector G-10/4", "city": "Islamabad"},
        "payment_method": "cod",
        "items": [{"product_id": prod[0], "quantity": 1}]
    })
    order_number = res.get_json()['order_number']

    with client.session_transaction() as sess:
        sess['user_id'] = 1
        sess['user_role'] = 'OWNER'

    # Update to on_the_way
    status_res = client.post(
        f'/api/orders/{order_number}/status',
        json={
            "status": "on_the_way",
            "courier_name": "Trax Logistics",
            "tracking_number": "TRX-TEST-5544"
        }
    )
    assert status_res.status_code == 200
    assert status_res.get_json()['success'] is True

    # Check notification logs for on_the_way SMS
    conn = sqlite3.connect('khushi.db')
    cursor = conn.cursor()
    cursor.execute(
        "SELECT message FROM notification_logs WHERE order_number = ? AND idempotency_key LIKE '%on_the_way%'",
        (order_number,)
    )
    sms_log = cursor.fetchone()
    sms_text = sms_log[0].lower()
    assert "on the way" in sms_text or "out for delivery" in sms_text or "delivery" in sms_text
    conn.close()

def test_scenario_f_idempotency_prevents_duplicate_sms():
    """Scenario F: Idempotent sending prevents duplicate SMS dispatch with identical idempotency_key"""
    key = "test_unique_idempotency_998811"
    phone = "+923009998877"
    msg = "Test idempotency message"

    # First send
    res1 = send_sms(phone, msg, idempotency_key=key, order_number="KC-TEST-IDEM")
    assert res1 is True

    # Immediate second send with same key
    res2 = send_sms(phone, msg, idempotency_key=key, order_number="KC-TEST-IDEM")
    assert res2 is True

    # Assert exactly 1 record was written to DB, duplicate was suppressed
    conn = sqlite3.connect('khushi.db')
    cursor = conn.cursor()
    cursor.execute("SELECT COUNT(*) FROM notification_logs WHERE idempotency_key = ?", (key,))
    count = cursor.fetchone()[0]
    conn.close()
    assert count == 1, f"Expected 1 notification log, found {count}"

def test_scenario_h_secure_order_tracking(client):
    """Scenario H: Order tracking with matching phone returns 200; mismatched phone returns 403 Forbidden"""
    conn = sqlite3.connect('khushi.db')
    cursor = conn.cursor()
    cursor.execute("SELECT id FROM products WHERE status = 'active' LIMIT 1")
    prod = cursor.fetchone()
    conn.close()

    res = client.post('/api/checkout', json={
        "customer": {"name": "Farhan Ali", "phone": "03001239988"},
        "delivery": {"address": "Gulshan Iqbal", "city": "Karachi"},
        "payment_method": "cod",
        "items": [{"product_id": prod[0], "quantity": 1}]
    })
    order_number = res.get_json()['order_number']

    # Tracking with exact matching phone
    track_ok = client.get(f'/api/orders/track?order_number={order_number}&phone=03001239988')
    assert track_ok.status_code == 200
    t_data = track_ok.get_json()
    assert t_data['success'] is True
    assert t_data['order']['order_number'] == order_number
    assert 'payment_status' in t_data['order']
    assert 'order_status' in t_data['order']

    # Tracking with wrong phone -> 403 Forbidden
    track_fail = client.get(f'/api/orders/track?order_number={order_number}&phone=03219990000')
    assert track_fail.status_code == 403
    assert track_fail.get_json()['success'] is False
