import sqlite3
import json
import os
from werkzeug.security import generate_password_hash
from config import DB_PATH, BASE_DIR
from database import get_db, init_db

PRODUCTS_FILE = os.path.join(BASE_DIR, 'products.json')

CATEGORIES = [
    {"id": 1, "name": "Women", "slug": "women", "description": "Bespoke bridal couture, luxury velvet ensembles, and festive stitched pret.", "image_url": "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&auto=format&fit=crop&q=80", "display_order": 1},
    {"id": 2, "name": "Men", "slug": "men", "description": "Tailored Korean raw silk kurtas, designer jamawar waistcoats, and regal heritage attire.", "image_url": "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=800&auto=format&fit=crop&q=80", "display_order": 2},
    {"id": 3, "name": "Kids", "slug": "kids", "description": "Comfortable organic cotton festive attire for boys, girls, and infants.", "image_url": "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=800&auto=format&fit=crop&q=80", "display_order": 3},
    {"id": 4, "name": "Shoes", "slug": "shoes", "description": "Pure leather hand-stitched bridal khussas and artisanal Peshawari chappals.", "image_url": "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&auto=format&fit=crop&q=80", "display_order": 4},
    {"id": 5, "name": "Watches", "slug": "watches", "description": "Swiss & Japanese chronograph timepieces with scratch-resistant sapphire glass.", "image_url": "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&auto=format&fit=crop&q=80", "display_order": 5},
    {"id": 6, "name": "Perfumes", "slug": "perfumes", "description": "Rare oriental agarwood extracts, pure French absolutes, and 24-hour long-lasting ouds.", "image_url": "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&auto=format&fit=crop&q=80", "display_order": 6},
    {"id": 7, "name": "Bags", "slug": "bags", "description": "Structured artisan quilted totes, bridal clutches, and genuine leather carryalls.", "image_url": "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&auto=format&fit=crop&q=80", "display_order": 7},
    {"id": 8, "name": "Beauty", "slug": "beauty", "description": "Organic 24K gold radiance serums, illuminating elixirs, and luxury skincare.", "image_url": "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80", "display_order": 8}
]

def seed():
    conn = get_db()
    cursor = conn.cursor()

    if not os.path.exists(PRODUCTS_FILE):
        print(f"Products file not found at {PRODUCTS_FILE}")
        conn.close()
        return

    with open(PRODUCTS_FILE, 'r', encoding='utf-8') as pf:
        products = json.load(pf)

    print(f"Seeding {len(products)} products into database...")

    cursor.execute("DELETE FROM products")
    cursor.execute("DELETE FROM categories")

    # Categories
    for c in CATEGORIES:
        cursor.execute('''
            INSERT INTO categories (id, name, slug, description, image_url, is_featured, display_order)
            VALUES (?, ?, ?, ?, ?, 1, ?)
        ''', (c['id'], c['name'], c['slug'], c['description'], c['image_url'], c['display_order']))

    # Products
    for p in products:
        cat_id = next((c['id'] for c in CATEGORIES if c['slug'] == p['category']), 1)
        cursor.execute('''
            INSERT INTO products (
                id, name, slug, category_id, brand, sku,
                price, sale_price, stock, low_stock_threshold,
                sizes, colors, thumbnail, images,
                description, is_featured, is_new, is_bestseller, is_flash_sale,
                status, rating, reviews_count
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            p['id'], p['name'], p['slug'], cat_id, p.get('brand', 'Khushi Collection'), p['sku'],
            p['price'], p['sale_price'], p['stock'], 3,
            json.dumps(p.get('sizes', [])), json.dumps(p.get('colors', [])), p['thumbnail'], json.dumps(p['images']),
            p['description'], 1 if p.get('is_featured') else 0, 1 if p.get('is_new') else 0, 1 if p.get('is_bestseller') else 0, 1 if p.get('is_flash_sale') else 0,
            'active', p.get('rating', 4.9), p.get('reviews_count', 24)
        ))

    # Owner Admin User
    cursor.execute("SELECT id FROM users WHERE email = 'admin@khushicollection.com'")
    if not cursor.fetchone():
        cursor.execute('''
            INSERT INTO users (name, email, password_hash, role, status)
            VALUES (?, ?, ?, ?, ?)
        ''', ('Khushi Store Owner', 'admin@khushicollection.com', generate_password_hash('Admin@12345'), 'OWNER', 'active'))

    conn.commit()
    conn.close()
    print("Database seeding complete with 96 luxury products!")

if __name__ == '__main__':
    init_db()
    seed()
