import unittest
import json
from app import create_app
from database import query_db, get_db

class KhushiCollectionTestSuite(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.app = create_app()
        cls.app.config['TESTING'] = True
        cls.app.config['WTF_CSRF_ENABLED'] = False
        cls.client = cls.app.test_client()

    def test_01_homepage_renders(self):
        res = self.client.get('/')
        self.assertEqual(res.status_code, 200)
        self.assertIn(b'Khushi Collection', res.data)
        self.assertIn(b'Explore By Category', res.data)
        self.assertIn(b'New Arrivals', res.data)
        self.assertIn(b'Best Sellers', res.data)

    def test_02_shop_catalog_and_filter(self):
        # Catalog main page
        res = self.client.get('/shop')
        self.assertEqual(res.status_code, 200)
        
        # Category filter
        res_women = self.client.get('/shop?category=women')
        self.assertEqual(res_women.status_code, 200)
        self.assertIn(b'Velvet', res_women.data)

        # Search query
        res_search = self.client.get('/shop?q=oud')
        self.assertEqual(res_search.status_code, 200)
        self.assertIn(b'Imperial Oud', res_search.data)

    def test_03_product_detail_page(self):
        res = self.client.get('/product/khushi-royal-embroidered-velvet-shawl-suit')
        self.assertEqual(res.status_code, 200)
        self.assertIn(b'KC-WMN-001', res.data)
        self.assertIn(b'Velvet', res.data)
        self.assertIn(b'Add to Bag', res.data)

    def test_04_live_search_api(self):
        res = self.client.get('/api/search?q=velvet')
        self.assertEqual(res.status_code, 200)
        data = json.loads(res.data)
        self.assertTrue(len(data['products']) > 0)
        self.assertTrue(any('Velvet' in p['name'] for p in data['products']))

    def test_05_cart_api_operations(self):
        # Add item
        add_res = self.client.post('/api/cart/add', json={
            'product_id': 1,
            'quantity': 2,
            'size': 'M',
            'color': 'Emerald Green'
        })
        self.assertEqual(add_res.status_code, 200)
        add_data = json.loads(add_res.data)
        self.assertTrue(add_data['success'])
        self.assertEqual(add_data['cart_count'], 2)

        # Get cart
        cart_res = self.client.get('/api/cart')
        self.assertEqual(cart_res.status_code, 200)
        cart_data = json.loads(cart_res.data)
        self.assertEqual(len(cart_data['items']), 1)
        self.assertTrue(cart_data['subtotal'] > 0)

    def test_06_coupon_validation(self):
        res = self.client.post('/api/coupon/validate', json={
            'code': 'WELCOME10',
            'subtotal': 10000.0
        })
        self.assertEqual(res.status_code, 200)
        data = json.loads(res.data)
        self.assertTrue(data['valid'])
        self.assertEqual(data['discount_amount'], 1000.0)

    def test_07_delivery_calculation(self):
        # City calculation
        res = self.client.get('/api/delivery-fee?city=Islamabad&subtotal=3000')
        self.assertEqual(res.status_code, 200)
        data = json.loads(res.data)
        self.assertEqual(data['delivery_fee'], 150)
        self.assertFalse(data['free'])

        # Free shipping threshold >= 5000
        res_free = self.client.get('/api/delivery-fee?city=Islamabad&subtotal=6000')
        self.assertEqual(res_free.status_code, 200)
        data_free = json.loads(res_free.data)
        self.assertEqual(data_free['delivery_fee'], 0)
        self.assertTrue(data_free['free'])

    def test_08_order_tracking_lookup(self):
        res = self.client.get('/track-order?order_id=KC-10025&phone=03219876543')
        self.assertEqual(res.status_code, 200)
        self.assertIn(b'KC-10025', res.data)
        self.assertIn(b'Khushi Fatima', res.data)
        self.assertIn(b'On The Way', res.data)
        self.assertIn(b'TRX-99882211', res.data)

    def test_09_admin_security_and_dashboard(self):
        # Unauthorized access should redirect
        unauth = self.client.get('/admin/dashboard')
        self.assertEqual(unauth.status_code, 302)

        # Login as super admin
        login_res = self.client.post('/admin/login', data={
            'email': 'admin@khushicollection.com',
            'password': 'admin123'
        }, follow_redirects=True)
        self.assertEqual(login_res.status_code, 200)
        self.assertIn(b'Store Analytics & Overview', login_res.data)
        self.assertIn(b'Total Sales', login_res.data)

    def test_10_printable_invoice(self):
        res = self.client.get('/admin/invoice/KC-10025')
        self.assertEqual(res.status_code, 200)
        self.assertIn(b'KHUSHI COLLECTION', res.data)
        self.assertIn(b'KC-10025', res.data)
        self.assertIn(b'Khushi Fatima', res.data)

    def test_11_order_placement_pipeline(self):
        # 1. Add item to cart
        self.client.post('/api/cart/add', json={
            'product_id': 2,
            'quantity': 1,
            'size': 'M',
            'color': 'Imperial Emerald'
        })

        # 2. Place order
        place_res = self.client.post('/place-order', data={
            'customer_name': 'Zainab Qureshi',
            'customer_phone': '03009988776',
            'customer_email': 'zainab@example.com',
            'address': 'House 12, Street 4, Sector G-11/3',
            'city': 'Islamabad',
            'area': 'G-11',
            'postal_code': '44000',
            'delivery_instructions': 'Call on arrival',
            'payment_method': 'cod',
            'coupon_code': 'WELCOME10'
        }, follow_redirects=True)

        self.assertEqual(place_res.status_code, 200)
        self.assertIn(b'Order Successfully Placed', place_res.data)
        self.assertIn(b'Zainab Qureshi', place_res.data)
        self.assertIn(b'Send to WhatsApp', place_res.data)

    def test_12_status_update_and_sms_trigger(self):
        # Login admin first
        self.client.post('/admin/login', data={
            'email': 'admin@khushicollection.com',
            'password': 'admin123'
        })

        # Update order KC-10025 to "delivered" as authenticated owner
        with self.client.session_transaction() as sess:
            sess['user_id'] = 1
            sess['user_role'] = 'OWNER'
            sess['user_name'] = 'Store Owner'
            sess['user_email'] = 'owner@khushicollection.com'

        res = self.client.post('/admin/orders/1/status', data={
            'order_status': 'delivered',
            'courier_name': 'Trax Logistics',
            'tracking_number': 'TRX-99882211',
            'admin_notes': 'Delivered in good condition'
        }, follow_redirects=True)

        self.assertEqual(res.status_code, 200)
        self.assertIn(b'status updated to', res.data)

        # Verify SMS log was recorded
        notif = query_db("SELECT * FROM notifications WHERE channel = 'sms' ORDER BY id DESC LIMIT 1", one=True)
        self.assertIsNotNone(notif)
        self.assertIn('Khushi Collection', notif['message'])

    def test_13_whatsapp_order_message_builder(self):
        from services.notifications import build_whatsapp_order_message
        mock_order = {
            'order_number': 'KC-10025',
            'customer_name': 'Khushi Fatima',
            'customer_phone': '+923219876543',
            'payment_method': 'cod',
            'address': 'House #14, Street 9',
            'city': 'Islamabad',
            'area': 'F-7',
            'total_amount': 21090.0
        }
        mock_items = [{
            'product_name': 'Royal Velvet Suit',
            'size': 'M',
            'color': 'Emerald Green',
            'quantity': 1,
            'total': 14950.0
        }]
        msg = build_whatsapp_order_message(mock_order, mock_items, {})
        self.assertIn('NEW ORDER — KHUSHI COLLECTION', msg)
        self.assertIn('Order ID: #KC-10025', msg)
        self.assertIn('Khushi Fatima', msg)
        self.assertIn('Please process this order.', msg)

    def test_14_inventory_quick_adjust(self):
        with self.client.session_transaction() as sess:
            sess['user_id'] = 1
            sess['user_role'] = 'OWNER'
            sess['user_name'] = 'Store Owner'
            sess['user_email'] = 'owner@khushicollection.com'

        res = self.client.post('/admin/inventory/quick-update', json={
            'product_id': 1,
            'change': 5
        })
        self.assertEqual(res.status_code, 200)
        data = json.loads(res.data)
        self.assertTrue(data['success'])
        self.assertTrue(data['new_stock'] >= 5)

if __name__ == '__main__':
    unittest.main()
