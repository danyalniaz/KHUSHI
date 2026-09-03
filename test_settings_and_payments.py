import pytest
import json
import sqlite3
from app import create_app
from database import get_db

@pytest.fixture
def client():
    app = create_app()
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

def test_database_schema_payments():
    """Verify that payments table and cod_allowed columns exist in DB"""
    db = sqlite3.connect('khushi.db')
    cursor = db.cursor()
    
    # Check payments table
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='payments'")
    assert cursor.fetchone() is not None, "Payments table does not exist in khushi.db"
    
    # Check products cod_allowed column
    cursor.execute("PRAGMA table_info(products)")
    columns = [col[1] for col in cursor.fetchall()]
    assert 'cod_allowed' in columns, "Column cod_allowed missing from products table"
    assert 'payment_methods' in columns, "Column payment_methods missing from products table"

    # Check categories cod_allowed column
    cursor.execute("PRAGMA table_info(categories)")
    cat_columns = [col[1] for col in cursor.fetchall()]
    assert 'cod_allowed' in cat_columns, "Column cod_allowed missing from categories table"
    db.close()

def test_public_settings_api(client):
    """Verify GET /api/settings returns settings and masks secret keys"""
    res = client.get('/api/settings')
    assert res.status_code == 200
    data = res.get_json()
    assert data['success'] is True
    assert 'settings' in data
    settings = data['settings']
    assert 'store_profile' in settings
    assert settings['store_profile']['store_name'] == 'Khushi Collection'
    
    # Secret key must be masked
    secret_key = settings['payments']['online_card']['secret_key']
    assert '••••' in secret_key, "Secret key was not masked!"

def test_unauthorized_settings_update(client):
    """Verify POST /api/settings blocks unauthenticated requests"""
    res = client.post('/api/settings', json={"store_profile": {"store_name": "Hacked"}})
    assert res.status_code in (401, 403)

def test_payment_creation_and_verification(client):
    """Verify creating a payment record and verifying online card payment"""
    # 1. Create a payment record
    create_res = client.post('/api/payments/create', json={
        "payment_id": "TEST-PAY-001",
        "order_id": 999,
        "order_number": "KC-TEST-999",
        "customer_name": "Lady Zoya Khan",
        "gateway": "online_card",
        "amount": 25000,
        "payment_status": "PENDING_VERIFICATION"
    })
    assert create_res.status_code == 200
    create_data = create_res.get_json()
    assert create_data['success'] is True
    assert create_data['payment_id'] == "TEST-PAY-001"

    # 2. Verify payment
    verify_res = client.post('/api/payments/verify', json={
        "payment_id": "TEST-PAY-001",
        "transaction_reference": "TRX-VERIFIED-777"
    })
    assert verify_res.status_code == 200
    verify_data = verify_res.get_json()
    assert verify_data['success'] is True
    assert verify_data['verified'] is True
    assert verify_data['payment_status'] == "PAID"
    assert verify_data['transaction_reference'] == "TRX-VERIFIED-777"

if __name__ == '__main__':
    pytest.main(['-v', 'test_settings_and_payments.py'])
