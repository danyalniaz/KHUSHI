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
    cur = conn.cursor()
    cur.execute(query, args)
    rv = cur.fetchall()
    conn.close()
    return (rv[0] if rv else None) if one else rv

def execute_db(query, args=(), commit=True):
    conn = get_db()
    cur = conn.cursor()
    cur.execute(query, args)
    last_id = cur.lastrowid
    rowcount = cur.rowcount
    if commit:
        conn.commit()
    conn.close()
    return last_id if last_id else rowcount

def log_audit_action(action, details="", user_id=None, user_email=None, ip_address=""):
    try:
        execute_db(
            "INSERT INTO audit_logs (user_id, user_email, action, details, ip_address) VALUES (?, ?, ?, ?, ?)",
            (user_id, user_email, action, details, ip_address)
        )
    except Exception:
        pass

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

    # Audit Logs
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS audit_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        user_email TEXT,
        action TEXT NOT NULL,
        details TEXT,
        ip_address TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    ''')

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
