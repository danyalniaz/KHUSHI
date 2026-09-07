import sqlite3
import os
import json
from datetime import datetime
from config import DB_PATH

DATABASE_PATH = DB_PATH

def get_db():
    try:
        conn = sqlite3.connect(DATABASE_PATH, timeout=30.0)
        conn.row_factory = sqlite3.Row
        conn.execute("PRAGMA foreign_keys = ON")
        try:
            conn.execute("PRAGMA journal_mode = WAL")
        except Exception:
            try:
                conn.execute("PRAGMA journal_mode = DELETE")
            except Exception:
                pass
        return conn
    except Exception:
        conn = sqlite3.connect(":memory:", timeout=30.0)
        conn.row_factory = sqlite3.Row
        return conn

def query_db(query, args=(), one=False):
    conn = get_db()
    try:
        cur = conn.cursor()
        cur.execute(query, args)
        rv = cur.fetchall()
        return (rv[0] if rv else None) if one else rv
    finally:
        conn.close()

def execute_db(query, args=(), commit=True):
    conn = get_db()
    try:
        cur = conn.cursor()
        cur.execute(query, args)
        last_id = cur.lastrowid
        rowcount = cur.rowcount
        if commit:
            conn.commit()
        return last_id if last_id else rowcount
    finally:
        conn.close()

DEFAULT_PERMISSIONS = [
    # Products
    ('products.view', 'View Products', 'Products', 'View product catalog, pricing, and stock levels'),
    ('products.create', 'Create Products', 'Products', 'Add new products to the catalog'),
    ('products.edit', 'Edit Products', 'Products', 'Modify product details, prices, and media'),
    ('products.delete', 'Delete Products', 'Products', 'Remove products from the catalog'),
    ('products.inventory', 'Manage Inventory', 'Products', 'Update inventory stock quantities and SKU alerts'),
    # Orders
    ('orders.view', 'View Orders', 'Orders', 'View customer orders and order timelines'),
    ('orders.edit', 'Edit Orders', 'Orders', 'Update order statuses, couriers, and tracking info'),
    ('orders.cancel', 'Cancel Orders', 'Orders', 'Cancel pending or processing orders'),
    ('orders.refund', 'Refund Orders', 'Orders', 'Process payment refunds for orders'),
    # Customers
    ('customers.view', 'View Customers', 'Customers', 'View customer list and contact information'),
    ('customers.edit', 'Edit Customers', 'Customers', 'Update customer accounts and notes'),
    # Content
    ('content.view', 'View Content', 'Content', 'View website banners, announcements, and pages'),
    ('content.edit', 'Edit Content', 'Content', 'Update hero banners, announcements, and policy content'),
    # Marketing
    ('marketing.view', 'View Marketing', 'Marketing', 'View promotional campaigns and coupon codes'),
    ('marketing.edit', 'Edit Marketing', 'Marketing', 'Create and manage discount codes and flash sales'),
    # Reports
    ('reports.view', 'View Financial Reports', 'Reports', 'Access business revenue, sales analytics, and profit margins'),
    # Settings
    ('settings.view', 'View Settings', 'Settings', 'View store configurations, shipping, and delivery fees'),
    ('settings.edit', 'Edit Settings', 'Settings', 'Modify store profile, delivery rates, and business hours'),
    # Users
    ('users.view', 'View Staff', 'Users', 'View administrative staff member accounts'),
    ('users.create', 'Invite Staff', 'Users', 'Invite new staff members to the administration system'),
    ('users.edit', 'Edit Staff Permissions', 'Users', 'Modify assigned permissions for staff accounts'),
    ('users.disable', 'Disable Staff', 'Users', 'Activate or deactivate staff accounts'),
    # Security
    ('security.view', 'View Security', 'Security', 'Inspect immutable audit logs and active user sessions'),
    ('security.manage', 'Manage Security', 'Security', 'Revoke active sessions and enforce security policies')
]

def log_audit_action(action, details="", user_id=None, user_email=None, role=None, ip_address="", user_agent=""):
    try:
        execute_db('''
            INSERT INTO audit_logs (user_id, user_email, role, action, details, ip_address, user_agent)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        ''', (user_id, user_email, role, action, details, ip_address, user_agent))
    except Exception:
        try:
            execute_db(
                "INSERT INTO audit_logs (user_id, user_email, action, details, ip_address) VALUES (?, ?, ?, ?, ?)",
                (user_id, user_email, action, details, ip_address)
            )
        except Exception:
            pass

def get_user_permissions(user_id):
    user = query_db("SELECT role FROM users WHERE id = ?", (user_id,), one=True)
    if not user:
        return set()
    role = str(user['role']).upper()
    if role in ('OWNER', 'SUPER_ADMIN'):
        rows = query_db("SELECT code FROM permissions")
        if not rows:
            return set(p[0] for p in DEFAULT_PERMISSIONS)
        return set(r['code'] for r in rows)
    rows = query_db("SELECT permission_code FROM user_permissions WHERE user_id = ?", (user_id,))
    return set(r['permission_code'] for r in rows)

def has_permission(user_id, permission_code):
    user = query_db("SELECT role, status FROM users WHERE id = ?", (user_id,), one=True)
    if not user or user['status'] != 'active':
        return False
    role = str(user['role']).upper()
    if role in ('OWNER', 'SUPER_ADMIN'):
        return True
    row = query_db("SELECT 1 FROM user_permissions WHERE user_id = ? AND permission_code = ?", (user_id, permission_code), one=True)
    return row is not None

def set_user_permissions(user_id, permission_codes, granted_by=None):
    execute_db("DELETE FROM user_permissions WHERE user_id = ?", (user_id,))
    for code in permission_codes:
        execute_db(
            "INSERT INTO user_permissions (user_id, permission_code, granted_by) VALUES (?, ?, ?)",
            (user_id, code, granted_by)
        )

def init_db():
    conn = get_db()
    cursor = conn.cursor()

    # Users
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        phone TEXT,
        password_hash TEXT NOT NULL,
        role TEXT DEFAULT 'CUSTOMER',
        status TEXT DEFAULT 'active',
        failed_login_attempts INTEGER DEFAULT 0,
        locked_until TIMESTAMP,
        session_token TEXT,
        last_login_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    ''')

    # Roles
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS roles (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT UNIQUE NOT NULL,
        description TEXT
    )
    ''')
    for role_name, desc in [('OWNER', 'Store Owner with absolute administrative control'),
                            ('MANAGER', 'Operations Manager with elevated store permissions'),
                            ('STAFF', 'Staff Associate with restricted operational permissions'),
                            ('CUSTOMER', 'Storefront retail customer')]:
        cursor.execute("INSERT OR IGNORE INTO roles (name, description) VALUES (?, ?)", (role_name, desc))

    # Permissions
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS permissions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        code TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        category TEXT NOT NULL,
        description TEXT
    )
    ''')
    for code, name, category, desc in DEFAULT_PERMISSIONS:
        cursor.execute("INSERT OR IGNORE INTO permissions (code, name, category, description) VALUES (?, ?, ?, ?)",
                       (code, name, category, desc))

    # User Permissions (Granular Staff Permissions)
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS user_permissions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        permission_code TEXT NOT NULL,
        granted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        granted_by INTEGER,
        UNIQUE(user_id, permission_code),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
    ''')

    # User Active Sessions (Multi-device tracking)
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS user_sessions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        session_token TEXT UNIQUE NOT NULL,
        ip_address TEXT,
        user_agent TEXT,
        device_name TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_activity_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        is_active BOOLEAN DEFAULT 1,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
    ''')

    # Staff Invitations
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS staff_invitations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        role TEXT DEFAULT 'STAFF',
        permissions_json TEXT NOT NULL,
        token_hash TEXT UNIQUE NOT NULL,
        expires_at TIMESTAMP NOT NULL,
        accepted_at TIMESTAMP,
        created_by INTEGER,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    ''')

    # Password Resets
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS password_resets (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        token_hash TEXT UNIQUE NOT NULL,
        expires_at TIMESTAMP NOT NULL,
        used_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
    ''')

    # Audit Logs
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS audit_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        user_email TEXT,
        role TEXT,
        action TEXT NOT NULL,
        details TEXT,
        ip_address TEXT,
        user_agent TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    ''')

    # Migrate existing audit_logs columns safely if needed
    try:
        cursor.execute("ALTER TABLE audit_logs ADD COLUMN role TEXT")
    except Exception:
        pass
    try:
        cursor.execute("ALTER TABLE audit_logs ADD COLUMN user_agent TEXT")
    except Exception:
        pass

    # Categories
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        description TEXT,
        image_url TEXT,
        banner_url TEXT,
        icon TEXT,
        display_order INTEGER DEFAULT 0,
        is_active BOOLEAN DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    ''')

    # Products
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        sku TEXT UNIQUE NOT NULL,
        category_id INTEGER,
        category_slug TEXT,
        category_name TEXT,
        description TEXT,
        short_description TEXT,
        price REAL NOT NULL,
        sale_price REAL,
        stock INTEGER DEFAULT 10,
        is_active BOOLEAN DEFAULT 1,
        is_featured BOOLEAN DEFAULT 0,
        is_flash_sale BOOLEAN DEFAULT 0,
        is_new BOOLEAN DEFAULT 0,
        is_bestseller BOOLEAN DEFAULT 0,
        rating REAL DEFAULT 5.0,
        review_count INTEGER DEFAULT 1,
        thumbnail TEXT,
        secondary_image TEXT,
        images TEXT,
        sizes TEXT,
        colors TEXT,
        fabric TEXT,
        occasion TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (category_id) REFERENCES categories(id)
    )
    ''')

    # Orders
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        order_number TEXT UNIQUE NOT NULL,
        customer_id INTEGER,
        customer_name TEXT NOT NULL,
        customer_phone TEXT NOT NULL,
        customer_email TEXT,
        address TEXT NOT NULL,
        city TEXT NOT NULL,
        area TEXT,
        delivery_instructions TEXT,
        subtotal REAL NOT NULL,
        delivery_fee REAL DEFAULT 0,
        discount_amount REAL DEFAULT 0,
        total_amount REAL NOT NULL,
        payment_method TEXT NOT NULL,
        payment_status TEXT DEFAULT 'pending',
        order_status TEXT DEFAULT 'pending',
        tracking_number TEXT,
        courier_name TEXT DEFAULT 'Trax Logistics',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (customer_id) REFERENCES users(id)
    )
    ''')

    # Order Items
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS order_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        order_id INTEGER NOT NULL,
        product_id INTEGER,
        product_name TEXT NOT NULL,
        product_sku TEXT,
        price REAL NOT NULL,
        quantity INTEGER NOT NULL,
        size TEXT,
        color TEXT,
        thumbnail TEXT,
        subtotal REAL NOT NULL,
        FOREIGN KEY (order_id) REFERENCES orders(id),
        FOREIGN KEY (product_id) REFERENCES products(id)
    )
    ''')

    # Order Timeline
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS order_timeline (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        order_id INTEGER NOT NULL,
        status TEXT NOT NULL,
        title TEXT NOT NULL,
        description TEXT,
        time TEXT NOT NULL,
        by_user TEXT DEFAULT 'System',
        FOREIGN KEY (order_id) REFERENCES orders(id)
    )
    ''')

    # Coupons
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS coupons (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        code TEXT UNIQUE NOT NULL,
        discount_type TEXT NOT NULL,
        discount_value REAL NOT NULL,
        min_order_amount REAL DEFAULT 0,
        max_discount REAL,
        expiry_date TIMESTAMP,
        is_active BOOLEAN DEFAULT 1,
        usage_count INTEGER DEFAULT 0
    )
    ''')

    # Delivery Zones
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS delivery_zones (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        city TEXT NOT NULL UNIQUE,
        fee REAL NOT NULL,
        estimated_days TEXT DEFAULT '2-3 Business Days',
        is_active BOOLEAN DEFAULT 1
    )
    ''')

    # Store Settings & Owner Profile
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS store_settings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        setting_key TEXT UNIQUE NOT NULL,
        setting_value TEXT NOT NULL,
        category TEXT DEFAULT 'general',
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    ''')

    # Payment Gateway Transactions
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS payment_records (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        payment_id TEXT UNIQUE NOT NULL,
        order_id INTEGER,
        order_number TEXT NOT NULL,
        customer_name TEXT NOT NULL,
        customer_email TEXT,
        gateway TEXT NOT NULL,
        amount REAL NOT NULL,
        currency TEXT DEFAULT 'PKR',
        transaction_reference TEXT,
        payment_status TEXT DEFAULT 'PENDING_VERIFICATION',
        gateway_mode TEXT DEFAULT 'TEST',
        proof_image TEXT,
        admin_notes TEXT,
        verified_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    ''')

    # Product Payment Rules
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS product_payment_rules (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        product_id INTEGER UNIQUE NOT NULL,
        cod_allowed BOOLEAN DEFAULT 1,
        allowed_methods TEXT DEFAULT '["cod", "card", "bank", "easypaisa", "jazzcash"]',
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (product_id) REFERENCES products(id)
    )
    ''')

    # Category Payment Rules
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS category_payment_rules (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        category_slug TEXT UNIQUE NOT NULL,
        cod_allowed BOOLEAN DEFAULT 1,
        allowed_methods TEXT DEFAULT '["cod", "card", "bank", "easypaisa", "jazzcash"]',
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    ''')

    conn.commit()
    conn.close()
