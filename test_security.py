import unittest
import sqlite3
import os
from werkzeug.security import generate_password_hash
from app import app
from database import get_db, init_db, execute_db, query_db

class SecurityTestSuite(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        app.config['TESTING'] = True
        app.config['SECRET_KEY'] = 'test-security-secret'
        cls.client = app.test_client()

        # Setup test users
        init_db()
        # Clean users for test isolation
        execute_db("DELETE FROM users WHERE email IN ('test_owner@khushi.com', 'test_customer@khushi.com', 'test_staff@khushi.com', 'brute_force@khushi.com')")

        # Create Owner
        execute_db('''
            INSERT INTO users (name, email, password_hash, role, status)
            VALUES (?, ?, ?, 'OWNER', 'active')
        ''', ('Test Owner', 'test_owner@khushi.com', generate_password_hash('OwnerSecurePass123!')))

        # Create Customer
        execute_db('''
            INSERT INTO users (name, email, password_hash, role, status)
            VALUES (?, ?, ?, 'CUSTOMER', 'active')
        ''', ('Test Customer', 'test_customer@khushi.com', generate_password_hash('CustomerPass123!')))

        # Create Staff
        execute_db('''
            INSERT INTO users (name, email, password_hash, role, status)
            VALUES (?, ?, ?, 'STAFF', 'active')
        ''', ('Test Staff', 'test_staff@khushi.com', generate_password_hash('StaffPass123!')))

    def setUp(self):
        # Ensure test owner exists and has default password
        owner = query_db("SELECT id FROM users WHERE email = 'test_owner@khushi.com'", one=True)
        if not owner:
            execute_db('''
                INSERT INTO users (name, email, password_hash, role, status)
                VALUES ('Test Owner', 'test_owner@khushi.com', ?, 'OWNER', 'active')
            ''', (generate_password_hash('OwnerSecurePass123!'),))
        else:
            execute_db("UPDATE users SET status = 'active', password_hash = ? WHERE email = 'test_owner@khushi.com'", (generate_password_hash('OwnerSecurePass123!'),))
        execute_db("UPDATE users SET status = 'active' WHERE email = 'test_staff@khushi.com'")
        execute_db("UPDATE users SET status = 'active' WHERE email = 'admin@khushicollection.com'")

    def test_01_unauthenticated_admin_access_redirects(self):
        """Unauthenticated user accessing /admin/dashboard must be redirected to /admin/login"""
        with self.client.session_transaction() as sess:
            sess.clear()
        res = self.client.get('/admin/dashboard', follow_redirects=False)
        self.assertEqual(res.status_code, 302)
        self.assertIn('/admin/login', res.headers.get('Location', ''))

    def test_02_customer_access_to_admin_is_denied(self):
        """Authenticated CUSTOMER attempting to access /admin/dashboard must be denied with 403"""
        with self.client.session_transaction() as sess:
            sess['user_id'] = 999
            sess['user_name'] = 'Test Customer'
            sess['user_email'] = 'test_customer@khushi.com'
            sess['user_role'] = 'CUSTOMER'

        res = self.client.get('/admin/dashboard')
        self.assertEqual(res.status_code, 403)
        self.assertIn(b'ACCESS DENIED', res.data)

    def test_03_owner_access_to_admin_is_granted(self):
        """Authenticated OWNER accessing /admin/dashboard must receive 200 OK"""
        with self.client.session_transaction() as sess:
            sess['user_id'] = 1
            sess['user_name'] = 'Test Owner'
            sess['user_email'] = 'test_owner@khushi.com'
            sess['user_role'] = 'OWNER'

        res = self.client.get('/admin/dashboard')
        self.assertEqual(res.status_code, 200)

    def test_04_owner_login_pipeline(self):
        """Testing real login POST with owner credentials"""
        with self.client.session_transaction() as sess:
            sess.clear()

        res = self.client.post('/admin/login', data={
            'email': 'test_owner@khushi.com',
            'password': 'OwnerSecurePass123!'
        }, follow_redirects=True)

        self.assertEqual(res.status_code, 200)
        with self.client.session_transaction() as sess:
            self.assertEqual(sess.get('user_role'), 'OWNER')
            self.assertEqual(sess.get('user_email'), 'test_owner@khushi.com')

    def test_05_rate_limiting_on_failed_attempts(self):
        """5 failed login attempts should lock account and block further attempts"""
        with self.client.session_transaction() as sess:
            sess.clear()

        # Create user to test brute force
        execute_db('''
            INSERT INTO users (name, email, password_hash, role, status)
            VALUES (?, ?, ?, 'OWNER', 'active')
        ''', ('Brute Target', 'brute_force@khushi.com', generate_password_hash('RightPass123!')))

        # Attempt 5 wrong passwords
        for i in range(5):
            res = self.client.post('/admin/login', data={
                'email': 'brute_force@khushi.com',
                'password': 'WrongPassword!'
            })

        # 6th attempt should be blocked by rate limit
        res6 = self.client.post('/admin/login', data={
            'email': 'brute_force@khushi.com',
            'password': 'WrongPassword!'
        })
        self.assertIn(b'temporarily locked', res6.data)

    def test_06_logout_invalidates_session(self):
        """Logging out must clear session and redirect to login"""
        with self.client.session_transaction() as sess:
            sess['user_id'] = 1
            sess['user_role'] = 'OWNER'

        res = self.client.get('/admin/logout', follow_redirects=False)
        self.assertEqual(res.status_code, 302)

        with self.client.session_transaction() as sess:
            self.assertIsNone(sess.get('user_id'))
            self.assertIsNone(sess.get('user_role'))

    def test_07_staff_restricted_without_permission(self):
        """Staff without 'reports.view' permission must be rejected with 403 on financial reports"""
        staff = query_db("SELECT id FROM users WHERE email = 'test_staff@khushi.com'", one=True)
        # Ensure no reports.view permission
        execute_db("DELETE FROM user_permissions WHERE user_id = ?", (staff['id'],))

        with self.client.session_transaction() as sess:
            sess['user_id'] = staff['id']
            sess['user_name'] = 'Test Staff'
            sess['user_email'] = 'test_staff@khushi.com'
            sess['user_role'] = 'STAFF'

        res = self.client.get('/admin/reports')
        self.assertEqual(res.status_code, 403)

    def test_08_staff_granted_permission_access(self):
        """Staff granted 'reports.view' permission should successfully access /admin/reports"""
        from database import set_user_permissions
        staff = query_db("SELECT id FROM users WHERE email = 'test_staff@khushi.com'", one=True)
        set_user_permissions(staff['id'], ['reports.view', 'products.view'])

        with self.client.session_transaction() as sess:
            sess['user_id'] = staff['id']
            sess['user_name'] = 'Test Staff'
            sess['user_email'] = 'test_staff@khushi.com'
            sess['user_role'] = 'STAFF'

        res = self.client.get('/admin/reports')
        self.assertEqual(res.status_code, 200)

    def test_09_api_staff_invite_and_permissions(self):
        """Owner can invite new staff member via /admin/api/staff and set permissions"""
        owner = query_db("SELECT id FROM users WHERE email = 'test_owner@khushi.com'", one=True)
        execute_db("DELETE FROM users WHERE email = 'new_hire@khushi.com'")

        with self.client.session_transaction() as sess:
            sess['user_id'] = owner['id']
            sess['user_email'] = 'test_owner@khushi.com'
            sess['user_role'] = 'OWNER'

        res = self.client.post('/admin/api/staff', json={
            'name': 'New Hire',
            'email': 'new_hire@khushi.com',
            'role': 'STAFF',
            'permissions': ['orders.view', 'orders.status']
        })
        self.assertEqual(res.status_code, 201)
        data = res.get_json()
        self.assertTrue(data.get('success'))
        self.assertIn('invite_token', data)

        # Verify invitation was recorded in staff_invitations
        inv = query_db("SELECT * FROM staff_invitations WHERE email = 'new_hire@khushi.com'", one=True)
        self.assertIsNotNone(inv)
        self.assertEqual(inv['name'], 'New Hire')

        # Accept invitation and activate account
        res_accept = self.client.post('/admin/api/invitations/accept', json={
            'token': data['invite_token'],
            'password': 'HirePassword123!'
        })
        self.assertEqual(res_accept.status_code, 200)

        # Verify user was created with active status
        user = query_db("SELECT * FROM users WHERE email = 'new_hire@khushi.com'", one=True)
        self.assertIsNotNone(user)
        self.assertEqual(user['status'], 'active')

    def test_10_sole_owner_cannot_be_disabled_or_deleted(self):
        """The sole active Owner account cannot be disabled or deleted"""
        # Ensure only 1 active owner
        execute_db("UPDATE users SET status = 'disabled' WHERE UPPER(role) IN ('OWNER', 'SUPER_ADMIN') AND email != 'test_owner@khushi.com'")
        owner = query_db("SELECT id FROM users WHERE email = 'test_owner@khushi.com'", one=True)

        with self.client.session_transaction() as sess:
            sess['user_id'] = owner['id']
            sess['user_email'] = 'test_owner@khushi.com'
            sess['user_role'] = 'OWNER'

        # Attempt to toggle status of sole owner
        res_toggle = self.client.post(f'/admin/api/staff/{owner["id"]}/toggle-status')
        self.assertEqual(res_toggle.status_code, 400)
        self.assertIn('sole active Owner account cannot be disabled', res_toggle.get_json().get('error', ''))

        # Attempt to delete sole owner
        res_del = self.client.delete(f'/admin/api/staff/{owner["id"]}', json={'owner_password': 'OwnerSecurePass123!'})
        self.assertEqual(res_del.status_code, 400)
        self.assertIn('Cannot delete the sole remaining Store Owner', res_del.get_json().get('error', ''))

        # Restore status
        execute_db("UPDATE users SET status = 'active' WHERE email IN ('test_owner@khushi.com', 'admin@khushicollection.com')")

    def test_11_active_sessions_and_revocation(self):
        """Active sessions are listed and can be revoked"""
        owner = query_db("SELECT id FROM users WHERE email = 'test_owner@khushi.com'", one=True)
        # Insert a test session
        execute_db('''
            INSERT INTO user_sessions (user_id, session_token, ip_address, user_agent, is_active)
            VALUES (?, 'test_session_token_123', '127.0.0.1', 'Mozilla/5.0 TestBrowser', 1)
        ''', (owner['id'],))
        sess_row = query_db("SELECT id FROM user_sessions WHERE session_token = 'test_session_token_123'", one=True)

        with self.client.session_transaction() as sess:
            sess['user_id'] = owner['id']
            sess['user_email'] = 'test_owner@khushi.com'
            sess['user_role'] = 'OWNER'

        res_list = self.client.get('/admin/api/sessions')
        self.assertEqual(res_list.status_code, 200)
        sessions_data = res_list.get_json().get('sessions', [])
        self.assertTrue(any(s['id'] == sess_row['id'] for s in sessions_data))

        # Revoke session
        res_revoke = self.client.post(f'/admin/api/sessions/{sess_row["id"]}/revoke')
        self.assertEqual(res_revoke.status_code, 200)
        updated = query_db("SELECT is_active FROM user_sessions WHERE id = ?", (sess_row['id'],), one=True)
        self.assertEqual(updated['is_active'], 0)

    def test_12_password_change_api(self):
        """Changing password via /admin/api/password/change requires valid current password"""
        owner = query_db("SELECT id FROM users WHERE email = 'test_owner@khushi.com'", one=True)

        with self.client.session_transaction() as sess:
            sess['user_id'] = owner['id']
            sess['user_email'] = 'test_owner@khushi.com'
            sess['user_role'] = 'OWNER'

        # Wrong current password fails with 403 Forbidden
        res_fail = self.client.post('/admin/api/password/change', json={
            'current_password': 'WrongPassword!',
            'new_password': 'BrandNewPassword123!',
            'confirm_password': 'BrandNewPassword123!'
        })
        self.assertEqual(res_fail.status_code, 403)

        # Right current password succeeds
        res_ok = self.client.post('/admin/api/password/change', json={
            'current_password': 'OwnerSecurePass123!',
            'new_password': 'BrandNewPassword123!',
            'confirm_password': 'BrandNewPassword123!'
        })
        self.assertEqual(res_ok.status_code, 200)

    def test_13_audit_log_api_captures_events(self):
        """Audit log endpoint returns recorded actions"""
        owner = query_db("SELECT id FROM users WHERE email = 'test_owner@khushi.com'", one=True)

        with self.client.session_transaction() as sess:
            sess['user_id'] = owner['id']
            sess['user_email'] = 'test_owner@khushi.com'
            sess['user_role'] = 'OWNER'

        res = self.client.get('/admin/api/audit-logs')
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertTrue(data.get('success'))
        self.assertGreater(len(data.get('logs', [])), 0)

if __name__ == '__main__':
    unittest.main()
