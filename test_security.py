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

if __name__ == '__main__':
    unittest.main()
