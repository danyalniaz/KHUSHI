"""Quick test: owner persistence, bulk delete, clear all orders."""
from app import create_app
from database import init_db, query_db, execute_db
import seed_data

app = create_app()

with app.app_context():
    init_db()
    seed_data.seed()

    # Test 1: Verify owner is seeded and not overwritten
    owner = query_db("SELECT * FROM users WHERE role IN ('OWNER', 'SUPER_ADMIN')", one=True)
    assert owner is not None, "Owner user must exist in DB"
    print(f"[OK] Owner exists: {owner['email']} ({owner['role']})")

    # Test 2: Simulate changing email -> re-run seed -> owner should not be overwritten
    execute_db("UPDATE users SET email='newemail@test.com' WHERE id=?", (owner['id'],))
    seed_data.seed()
    owner_after = query_db("SELECT * FROM users WHERE id=?", (owner['id'],), one=True)
    assert owner_after['email'] == 'newemail@test.com', f"Owner email should NOT be overwritten! Got: {owner_after['email']}"
    print(f"[OK] Owner email preserved after re-seed: {owner_after['email']}")

    # Restore original email (delete old admin row if any, then update)
    existing = query_db("SELECT id FROM users WHERE email='owner@khushicollection.com'", one=True)
    if existing and existing['id'] != owner['id']:
        execute_db("DELETE FROM users WHERE id=?", (existing['id'],))
    execute_db("UPDATE users SET email='owner@khushicollection.com' WHERE id=?", (owner['id'],))

    # Test 3: Test bulk delete API
    execute_db("INSERT OR REPLACE INTO orders (id, order_number, customer_name, customer_email, customer_phone, address, total_amount, order_status, payment_status, payment_method, city) VALUES (9001, 'KC-TESTA', 'Test A', 'a@t.com', '03001111111', 'Test St', 5000, 'pending', 'COD', 'cod', 'Lahore')")
    execute_db("INSERT OR REPLACE INTO orders (id, order_number, customer_name, customer_email, customer_phone, address, total_amount, order_status, payment_status, payment_method, city) VALUES (9002, 'KC-TESTB', 'Test B', 'b@t.com', '03002222222', 'Test St', 8000, 'pending', 'COD', 'cod', 'Lahore')")
    
    with app.test_client() as c:
        with c.session_transaction() as sess:
            owner2 = query_db("SELECT * FROM users WHERE role IN ('OWNER', 'SUPER_ADMIN')", one=True)
            sess['user_id'] = owner2['id']
            sess['user_email'] = owner2['email']
            sess['user_role'] = owner2['role']
        
        # Bulk delete KC-TESTA
        r = c.post('/admin/api/orders/bulk-delete', 
                   json={'order_numbers': ['KC-TESTA']},
                   content_type='application/json')
        data = r.get_json()
        assert data['success'], f"Bulk delete failed: {data}"
        assert data['deleted_count'] == 1, f"Expected 1 deleted, got {data['deleted_count']}"
        print(f"[OK] Bulk delete worked: {data['message']}")

        # Clear all
        r2 = c.post('/admin/api/orders/clear-all', content_type='application/json')
        data2 = r2.get_json()
        assert data2['success'], f"Clear all failed: {data2}"
        print(f"[OK] Clear all worked: {data2['message']}")

        remaining = query_db('SELECT count(*) as cnt FROM orders', one=True)
        assert remaining['cnt'] == 0, f"Should be 0 orders, got {remaining['cnt']}"
        print(f"[OK] All orders cleared, count=0")

print("\n=== ALL TESTS PASSED ===")
