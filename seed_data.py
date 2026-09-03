import json
from datetime import datetime, timedelta
from werkzeug.security import generate_password_hash
from database import init_db, get_db, execute_db

def seed():
    init_db()
    conn = get_db()
    cur = conn.cursor()

    # Check if already seeded
    cur.execute("SELECT COUNT(*) FROM users")
    if cur.fetchone()[0] > 0:
        print("Database already seeded. Skipping initial seed.")
        conn.close()
        return

    print("Seeding Khushi Collection database...")

    # 1. Users & Admins
    password_admin = generate_password_hash("admin123")
    password_manager = generate_password_hash("manager123")
    password_staff = generate_password_hash("staff123")
    password_customer = generate_password_hash("customer123")

    users = [
        ('Super Admin', 'admin@khushicollection.com', '+923001234567', password_admin, 'super_admin', 'active'),
        ('Store Manager', 'manager@khushicollection.com', '+923002345678', password_manager, 'manager', 'active'),
        ('Fulfillment Staff', 'staff@khushicollection.com', '+923003456789', password_staff, 'staff', 'active'),
        ('Khushi Fatima', 'khushi@example.com', '+923219876543', password_customer, 'customer', 'active'),
        ('Ayesha Khan', 'ayesha@example.com', '+923334567890', password_customer, 'customer', 'active'),
        ('Hamza Tariq', 'hamza@example.com', '+923125556677', password_customer, 'customer', 'active')
    ]
    cur.executemany(
        "INSERT INTO users (name, email, phone, password_hash, role, status) VALUES (?, ?, ?, ?, ?, ?)",
        users
    )

    # 2. Categories
    categories = [
        ('Women', 'women', 'Luxury Eastern & Western Pret, Lawn & Formal Couture', 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600&auto=format&fit=crop&q=80', None, 1, 1),
        ('Men', 'men', 'Royal Kurtas, Shalwar Kameez, Waistcoats & Modern Fits', 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=600&auto=format&fit=crop&q=80', None, 1, 2),
        ('Kids', 'kids', 'Festive Mini Traditional Wear & Smart Casuals', 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=600&auto=format&fit=crop&q=80', None, 1, 3),
        ('New Arrivals', 'new-arrivals', 'Fresh Seasonal Drops & Limited Editions', 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&auto=format&fit=crop&q=80', None, 1, 4),
        ('Trending', 'trending', 'Most Loved Styles This Week', 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=600&auto=format&fit=crop&q=80', None, 1, 5),
        ('Best Sellers', 'best-sellers', 'All-time Customer Favorites', 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&auto=format&fit=crop&q=80', None, 1, 6),
        ('Clothes', 'clothes', 'Unstitched, Stitched & Luxury Embroidered Fabrics', 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=600&auto=format&fit=crop&q=80', None, 0, 7),
        ('Shoes', 'shoes', 'Traditional Khussa, Peshawari Chappal & Designer Heels', 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&auto=format&fit=crop&q=80', None, 1, 8),
        ('Watches', 'watches', 'Timeless Luxury Chronographs & Classic Dials', 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=600&auto=format&fit=crop&q=80', None, 1, 9),
        ('Perfumes', 'perfumes', 'Sensational Arabic Ouds, Floral Elixirs & Attars', 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=600&auto=format&fit=crop&q=80', None, 1, 10),
        ('Bags', 'bags', 'Handcrafted Clutches, Totes & Crossbody Bags', 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&auto=format&fit=crop&q=80', None, 1, 11),
        ('Accessories', 'accessories', 'Designer Shawls, Scarves, Belts & Sunglasses', 'https://images.unsplash.com/photo-1576053139778-7e32f2ae3cfd?w=600&auto=format&fit=crop&q=80', None, 0, 12),
        ('Beauty', 'beauty', 'Premium Organic Glow Serums & Makeup Essentials', 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&auto=format&fit=crop&q=80', None, 0, 13),
        ('Sale', 'sale', 'Clearance and Seasonal Steals', 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600&auto=format&fit=crop&q=80', None, 1, 14),
        ('Special Offers', 'special-offers', 'Exclusive Bundles and Festive Sets', 'https://images.unsplash.com/photo-1513094735237-8f2714d57c13?w=600&auto=format&fit=crop&q=80', None, 0, 15)
    ]
    cur.executemany(
        "INSERT INTO categories (name, slug, description, image_url, parent_id, is_featured, display_order) VALUES (?, ?, ?, ?, ?, ?, ?)",
        categories
    )

    # 3. Products
    products = [
        (
            'Khushi Royal Embroidered Velvet Shawl Suit',
            'khushi-royal-embroidered-velvet-shawl-suit',
            1, None, 'Khushi Signature', 'KC-WMN-001',
            18500.0, 14950.0, 12, 3,
            json.dumps(['XS', 'S', 'M', 'L', 'XL']),
            json.dumps([{'name': 'Emerald Green', 'hex': '#064e3b'}, {'name': 'Royal Maroon', 'hex': '#881337'}, {'name': 'Deep Navy', 'hex': '#0f172a'}]),
            'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&auto=format&fit=crop&q=80',
            json.dumps([
                'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&auto=format&fit=crop&q=80',
                'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&auto=format&fit=crop&q=80',
                'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800&auto=format&fit=crop&q=80'
            ]),
            'https://www.youtube.com/embed/dQw4w9WgXcQ',
            'Indulge in absolute luxury with our signature handcrafted velvet ensemble. Featuring intricate tilla and zardozi needlework along the neckline, hemlines, and paired with a plush micro-velvet printed border shawl.',
            json.dumps({'Fabric': 'Micro Velvet 9000', 'Dupatta/Shawl': 'Heavy Embroidered Micro Velvet', 'Trouser': 'Raw Silk', 'Work': 'Tilla, Sequence & Hand Zardozi', 'Occasion': 'Festive / Wedding Formal'}),
            'velvet, wedding, formal, luxury, festive, women',
            1, 1, 1, 0, 'active', 4.9, 28
        ),
        (
            'Zari Chiffon Festive 3-Piece Stitched Set',
            'zari-chiffon-festive-3-piece-stitched-set',
            1, None, 'Khushi Pret', 'KC-WMN-002',
            12500.0, 9850.0, 8, 2,
            json.dumps(['S', 'M', 'L', 'XL']),
            json.dumps([{'name': 'Dusty Rose', 'hex': '#be185d'}, {'name': 'Ivory Gold', 'hex': '#fef08a'}, {'name': 'Lilac', 'hex': '#a855f7'}]),
            'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&auto=format&fit=crop&q=80',
            json.dumps([
                'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&auto=format&fit=crop&q=80',
                'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&auto=format&fit=crop&q=80'
            ]),
            '',
            'An ethereal 3-piece chiffon silhouette detailed with subtle metallic gold zari booti work, finished with refined organza embroidery scallops and matching grip silk pants.',
            json.dumps({'Fabric': 'Pure Bamberg Chiffon', 'Lining': 'Cotton Silk Attached', 'Dupatta': 'Chiffon with 4-side lace finish', 'Work': 'Zari Booti & Thread Embroidery'}),
            'chiffon, eid, festive, stitched, party wear',
            1, 1, 0, 1, 'active', 4.8, 19
        ),
        (
            'Emperor Cut Raw Silk Men Shalwar Kameez',
            'emperor-cut-raw-silk-men-shalwar-kameez',
            2, None, 'Khushi Men Couture', 'KC-MEN-001',
            11000.0, 8450.0, 15, 3,
            json.dumps(['S', 'M', 'L', 'XL', 'XXL']),
            json.dumps([{'name': 'Charcoal Black', 'hex': '#171717'}, {'name': 'Slate Grey', 'hex': '#475569'}, {'name': 'Pearl Off-White', 'hex': '#f8fafc'}]),
            'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=800&auto=format&fit=crop&q=80',
            json.dumps([
                'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=800&auto=format&fit=crop&q=80',
                'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&auto=format&fit=crop&q=80'
            ]),
            '',
            'Engineered for the discerning modern gentleman. Tailored in heavy premium Korean blended raw silk with structured band collar, branded matte buttons, and comfortable tailored shalwar.',
            json.dumps({'Fabric': 'Korean Raw Silk Blend', 'Collar': 'Structured Mandarin / Band', 'Fit': 'Classic Tailored Fit', 'Care': 'Dry Clean Recommended'}),
            'men, kurta, shalwar kameez, silk, luxury men',
            1, 1, 1, 0, 'active', 5.0, 34
        ),
        (
            'Handcrafted Jamawar Embroidered Men Waistcoat',
            'handcrafted-jamawar-embroidered-men-waistcoat',
            2, None, 'Khushi Men Couture', 'KC-MEN-002',
            8500.0, 6200.0, 6, 2,
            json.dumps(['M', 'L', 'XL']),
            json.dumps([{'name': 'Midnight Gold', 'hex': '#854d0e'}, {'name': 'Jet Black', 'hex': '#0a0a0a'}, {'name': 'Maroon Zari', 'hex': '#7f1d1d'}]),
            'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&auto=format&fit=crop&q=80',
            json.dumps([
                'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&auto=format&fit=crop&q=80'
            ]),
            '',
            'Elevate your formal appearance with our antique Jamawar woven waistcoat, adorned with gold crest buttons and satin welt pockets. Ideal for nikkah, mehndi, and wedding receptions.',
            json.dumps({'Fabric': 'Pure Jamawar Jacquard', 'Lining': 'Premium Viscose Satin', 'Buttons': 'Metal Crest Gold Buttons'}),
            'waistcoat, wedding, mehndi, men formal',
            0, 0, 1, 1, 'active', 4.7, 14
        ),
        (
            'Khushi Imperial Oud De Parfum (100ml)',
            'khushi-imperial-oud-de-parfum',
            10, None, 'Khushi Haute Parfumerie', 'KC-PRF-001',
            9500.0, 6990.0, 25, 5,
            json.dumps(['100ml']),
            json.dumps([{'name': 'Amber Noir', 'hex': '#78350f'}]),
            'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&auto=format&fit=crop&q=80',
            json.dumps([
                'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&auto=format&fit=crop&q=80',
                'https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=800&auto=format&fit=crop&q=80'
            ]),
            '',
            'An opulent, long-lasting scent opening with sparkling saffron and damascus rose, melting into aged Cambodian agarwood, ambergris, and sweet Madagascan vanilla. Lasts over 24 hours on fabric.',
            json.dumps({'Concentration': 'Eau De Parfum (28% Oil)', 'Longevity': '18-24 Hours', 'Top Notes': 'Saffron, Bergamot', 'Heart Notes': 'Rose, Smoke, Leather', 'Base Notes': 'Oud, Amber, Musk'}),
            'perfume, fragrance, oud, luxury, scents',
            1, 1, 1, 1, 'active', 4.95, 62
        ),
        (
            'Royal Chronograph Sapphire Glass Watch',
            'royal-chronograph-sapphire-glass-watch',
            9, None, 'Khushi Timepieces', 'KC-WTC-001',
            16500.0, 12900.0, 9, 2,
            json.dumps(['One Size']),
            json.dumps([{'name': 'Emerald Gold', 'hex': '#047857'}, {'name': 'Obsidian Silver', 'hex': '#0f172a'}, {'name': 'Rose Gold', 'hex': '#fb7185'}]),
            'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&auto=format&fit=crop&q=80',
            json.dumps([
                'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&auto=format&fit=crop&q=80',
                'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&auto=format&fit=crop&q=80'
            ]),
            '',
            'Precision Japanese quartz movement housed in 316L medical-grade stainless steel with anti-scratch sapphire crystal and 50M water resistance. Comes in a luxury wooden gift presentation box.',
            json.dumps({'Movement': 'Japanese Chronograph Quartz', 'Glass': 'Scratch-Proof Sapphire Glass', 'Case': '316L Stainless Steel', 'Water Resistance': '5 ATM / 50M', 'Warranty': '1 Year International'}),
            'watch, luxury watch, chronograph, men accessories',
            1, 0, 1, 0, 'active', 4.85, 41
        ),
        (
            'Handcrafted Tilla Khussa Shoes',
            'handcrafted-tilla-khussa-shoes',
            8, None, 'Khushi Footwear', 'KC-SHS-001',
            4500.0, 3250.0, 18, 4,
            json.dumps(['36', '37', '38', '39', '40', '41']),
            json.dumps([{'name': 'Champagne Gold', 'hex': '#fde047'}, {'name': 'Ruby Red', 'hex': '#dc2626'}, {'name': 'Pure Black', 'hex': '#000000'}]),
            'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&auto=format&fit=crop&q=80',
            json.dumps([
                'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&auto=format&fit=crop&q=80'
            ]),
            '',
            'Masterfully stitched pure leather khussa shoes padded with double-cushioned memory foam soles to ensure all-day comfort for weddings and celebratory festivities without shoe-bites.',
            json.dumps({'Sole': 'Genuine Cow Leather Sole', 'Upper': 'Embroidered Velvet with Tilla', 'Insole': 'Orthopedic Double Cushioned'}),
            'shoes, khussa, footwear, bridal, traditional',
            0, 1, 1, 1, 'active', 4.75, 23
        ),
        (
            'Artisan Structured Quilted Leather Tote Bag',
            'artisan-structured-quilted-leather-tote-bag',
            11, None, 'Khushi Leathercraft', 'KC-BAG-001',
            8900.0, 6800.0, 7, 2,
            json.dumps(['Medium', 'Large']),
            json.dumps([{'name': 'Caramel Tan', 'hex': '#b45309'}, {'name': 'Onyx Black', 'hex': '#18181b'}, {'name': 'Soft Beige', 'hex': '#f5f5f4'}]),
            'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&auto=format&fit=crop&q=80',
            json.dumps([
                'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&auto=format&fit=crop&q=80'
            ]),
            '',
            'Handcrafted from supple micro-grain vegan leather with 24k gold-plated accents, dedicated compartments for tablet/laptop, and protective metal feet.',
            json.dumps({'Material': 'Premium Vegan Micro-grain Leather', 'Hardware': '24K Gold PVD Coating', 'Dimensions': '34cm x 26cm x 13cm'}),
            'bag, handbag, tote, luxury bag, leather',
            1, 1, 0, 0, 'active', 4.9, 31
        ),
        (
            'Festive Kids Embroidered Kurta Trouser Set',
            'festive-kids-embroidered-kurta-trouser-set',
            3, None, 'Khushi Junior', 'KC-KDS-001',
            5500.0, 3950.0, 14, 3,
            json.dumps(['2-3 Yrs', '4-5 Yrs', '6-7 Yrs', '8-9 Yrs', '10-11 Yrs']),
            json.dumps([{'name': 'Mustard Yellow', 'hex': '#ca8a04'}, {'name': 'Teal Blue', 'hex': '#0e7490'}, {'name': 'Royal White', 'hex': '#ffffff'}]),
            'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=800&auto=format&fit=crop&q=80',
            json.dumps([
                'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=800&auto=format&fit=crop&q=80'
            ]),
            '',
            'Soft, breathable 100% fine cotton fabric gentle on delicate skin, decorated with subtle thread embroidery on collar and cuffs for festive celebration days.',
            json.dumps({'Material': '100% Pure Wash & Wear Cotton', 'Inclusions': 'Kurta + Elasticated Trouser', 'Feel': 'Super Soft & Skin Safe'}),
            'kids, festive, boys kurta, eid, children',
            0, 1, 1, 0, 'active', 4.8, 17
        ),
        (
            'Floral Digital Printed Silk Dupatta Suit',
            'floral-digital-printed-silk-dupatta-suit',
            1, None, 'Khushi Everyday Pret', 'KC-WMN-003',
            7950.0, 5450.0, 20, 5,
            json.dumps(['XS', 'S', 'M', 'L', 'XL']),
            json.dumps([{'name': 'Sage Green', 'hex': '#84cc16'}, {'name': 'Peach Blush', 'hex': '#fb923c'}, {'name': 'Sky Azure', 'hex': '#38bdf8'}]),
            'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&auto=format&fit=crop&q=80',
            json.dumps([
                'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&auto=format&fit=crop&q=80'
            ]),
            '',
            'Summer luxury unstitched lawn ensemble accompanied by high-definition digital printed pure medium silk dupatta and schiffli embroidered neckline patch.',
            json.dumps({'Shirt': 'Air Jet Premium Lawn (3.0M)', 'Dupatta': 'Digital Silk (2.5M)', 'Trouser': 'Dyed Cotton Cambric (2.5M)'}),
            'lawn, summer, suit, printed, unstitched, women',
            1, 0, 1, 1, 'active', 4.9, 45
        ),
        (
            'Executive Heritage Peshawari Leather Chappal',
            'executive-heritage-peshawari-leather-chappal',
            8, None, 'Khushi Men Footwear', 'KC-SHS-002',
            6500.0, 4800.0, 10, 2,
            json.dumps(['40', '41', '42', '43', '44']),
            json.dumps([{'name': 'Mustard Tan', 'hex': '#a16207'}, {'name': 'Deep Oxblood', 'hex': '#7f1d1d'}, {'name': 'Classic Black', 'hex': '#1c1917'}]),
            'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&auto=format&fit=crop&q=80',
            json.dumps([
                'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&auto=format&fit=crop&q=80'
            ]),
            '',
            'Handmade by generational master cobblers in Charsadda. Crafted from full grain steerhide leather with durable tyre rubber sole and traditional adjustable buckle strap.',
            json.dumps({'Upper': 'Full Grain Cowhide Leather', 'Sole': 'Reclaimed Flexible Tyre Rubber', 'Stitching': 'Heavy Gauge Nylon'}),
            'peshawari chappal, men shoes, traditional footwear',
            0, 0, 1, 0, 'active', 4.9, 29
        ),
        (
            'Khushi 24K Radiant Youth Glow Serum (30ml)',
            'khushi-24k-radiant-youth-glow-serum',
            13, None, 'Khushi Botanicals', 'KC-BTY-001',
            3800.0, 2650.0, 30, 5,
            json.dumps(['30ml']),
            json.dumps([{'name': 'Gold Radiance', 'hex': '#facc15'}]),
            'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80',
            json.dumps([
                'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80'
            ]),
            '',
            'Infused with real 24k gold flakes, pure hyaluronic acid, niacinamide, and organic rosehip oil. Provides an instant glass-skin luminous glow while locking in hydration.',
            json.dumps({'Skin Type': 'All Skin Types', 'Ingredients': '24K Gold Foil, Hyaluronic Acid, Vitamin C', 'Volume': '30ml / 1.01 fl. oz'}),
            'beauty, serum, skincare, glowing, organic',
            1, 1, 0, 1, 'active', 4.8, 38
        )
    ]

    for p in products:
        cur.execute('''
        INSERT INTO products (
            name, slug, category_id, subcategory_id, brand, sku, price, sale_price, stock, low_stock_threshold,
            sizes, colors, thumbnail, images, video_url, description, specifications, tags,
            is_featured, is_new, is_bestseller, is_flash_sale, status, rating, reviews_count
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', p)

    # 4. Flash Sale
    end_date = datetime.now() + timedelta(days=2, hours=14, minutes=36)
    cur.execute('''
    INSERT INTO flash_sales (title, subtitle, discount_percentage, start_time, end_time, is_active, banner_image)
    VALUES (?, ?, ?, ?, ?, 1, ?)
    ''', (
        '🔥 KHUSHI GRAND FLASH SALE',
        'Up to 40% OFF on Luxury Pret, Formal Shawls & Timepieces. Limited Time Only!',
        40,
        datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
        end_date.strftime('%Y-%m-%d %H:%M:%S'),
        'https://images.unsplash.com/photo-1445205170230-053b83016050?w=1600&auto=format&fit=crop&q=80'
    ))

    # 5. Coupons
    coupons = [
        ('WELCOME10', 'percentage', 10.0, 2000.0, 2000.0, (datetime.now() + timedelta(days=90)).strftime('%Y-%m-%d'), 500, 12, 1),
        ('KHUSHI500', 'fixed', 500.0, 4000.0, None, (datetime.now() + timedelta(days=60)).strftime('%Y-%m-%d'), 200, 24, 1),
        ('SUMMER20', 'percentage', 20.0, 6000.0, 3000.0, (datetime.now() + timedelta(days=30)).strftime('%Y-%m-%d'), 100, 8, 1),
        ('VIPFREE', 'fixed', 250.0, 3000.0, None, (datetime.now() + timedelta(days=120)).strftime('%Y-%m-%d'), 1000, 45, 1)
    ]
    cur.executemany('''
    INSERT INTO coupons (code, discount_type, discount_value, min_order_amount, max_discount, expiry_date, usage_limit, times_used, is_active)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', coupons)

    # 6. Banners
    banners = [
        (
            'Royal Festive Collection 2026',
            'Exquisite craftsmanship, rich textures, and timeless Eastern elegance.',
            'NEW FESTIVE LAUNCH',
            'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=1600&auto=format&fit=crop&q=80',
            'Explore Collection',
            '/shop?category=women',
            'hero',
            1, 1
        ),
        (
            'Modern Gentleman Luxe Edition',
            'Handcrafted waistcoats, executive raw silk fits, and bespoke accessories.',
            'THE MEN EDIT',
            'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=1600&auto=format&fit=crop&q=80',
            'Shop Men Pret',
            '/shop?category=men',
            'hero',
            1, 2
        ),
        (
            'Sensational Fragrances & Timepieces',
            'Pure aged Oud de Parfum and Swiss sapphire dial chronographs.',
            'SIGNATURE SCENTS & WATCHES',
            'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=1600&auto=format&fit=crop&q=80',
            'Discover Scents',
            '/shop?category=perfumes',
            'hero',
            1, 3
        )
    ]
    cur.executemany('''
    INSERT INTO banners (title, subtitle, badge_text, image_url, button_text, button_link, banner_type, is_active, display_order)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', banners)

    # 7. Reviews
    reviews = [
        (1, 4, 'Khushi Fatima', 'khushi@example.com', 5, 'The embroidery on this velvet suit is breathtaking! Fabric quality is superb, feels like high-end couture. Arrived in just 2 days in Lahore. Highly recommended!', 1, 1),
        (1, 5, 'Ayesha Khan', 'ayesha@example.com', 5, 'Wore this to my cousin\'s wedding and received non-stop compliments. The shawl is so warm and regal.', 1, 1),
        (3, 6, 'Hamza Tariq', 'hamza@example.com', 5, 'Flawless stitching. The Korean raw silk has a deep, subtle sheen that looks very expensive. Fits true to size.', 1, 1),
        (5, 4, 'Khushi Fatima', 'khushi@example.com', 5, 'Imperial Oud is pure luxury in a bottle! Projects for hours and leaves an unforgettable scent trail.', 1, 1),
        (7, 5, 'Zainab Bilal', 'zainab@example.com', 5, 'Double cushioning makes these khussas the most comfortable I have ever worn. Zero shoe bites even after dancing!', 1, 1)
    ]
    cur.executemany('''
    INSERT INTO reviews (product_id, user_id, customer_name, customer_email, rating, comment, is_verified, is_approved)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ''', reviews)

    # 8. Seed Orders (including the requested #KC-10025)
    orders = [
        (
            'KC-10025', 4, 'Khushi Fatima', '+923219876543', 'khushi@example.com',
            'House #14, Street 9, Sector F-7/2', 'Islamabad', 'F-7', '44000',
            'Please ring bell twice. Deliver before 5 PM.',
            21940.0, 150.0, 1000.0, 'WELCOME10', 21090.0,
            'cod', 'unpaid', 'on_the_way', 'TRX-99882211', 'Trax Logistics', 'VIP Customer order'
        ),
        (
            'KC-10024', 5, 'Ayesha Khan', '+923334567890', 'ayesha@example.com',
            'Flat 402, Al-Razi Heights, Gulberg III', 'Lahore', 'Gulberg', '54000',
            'Leave with apartment guard if not answering.',
            12900.0, 180.0, 500.0, 'KHUSHI500', 12580.0,
            'easypaisa', 'paid', 'processing', 'LCS-44332211', 'Leopard Courier', 'Payment verified via EasyPaisa TRX# 889922'
        ),
        (
            'KC-10023', 6, 'Hamza Tariq', '+923125556677', 'hamza@example.com',
            'Bungalow 28-B, DHA Phase 6', 'Karachi', 'DHA', '75500',
            'Call 10 minutes before arrival.',
            14650.0, 250.0, 0.0, None, 14900.0,
            'bank', 'paid', 'delivered', 'TCS-11223344', 'TCS Express', 'Delivered and signed by customer'
        )
    ]

    for o in orders:
        cur.execute('''
        INSERT INTO orders (
            order_number, user_id, customer_name, customer_phone, customer_email,
            address, city, area, postal_code, delivery_instructions,
            subtotal, delivery_fee, discount_amount, coupon_code, total_amount,
            payment_method, payment_status, order_status, tracking_number, courier_name, admin_notes
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', o)
        order_id = cur.lastrowid

        if o[0] == 'KC-10025':
            # Add order items for KC-10025
            cur.execute('''
            INSERT INTO order_items (order_id, product_id, product_name, price, quantity, size, color, thumbnail, total)
            VALUES (?, 1, 'Khushi Royal Embroidered Velvet Shawl Suit', 14950.0, 1, 'M', 'Emerald Green', 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&auto=format&fit=crop&q=80', 14950.0)
            ''', (order_id,))
            cur.execute('''
            INSERT INTO order_items (order_id, product_id, product_name, price, quantity, size, color, thumbnail, total)
            VALUES (?, 5, 'Khushi Imperial Oud De Parfum (100ml)', 6990.0, 1, '100ml', 'Amber Noir', 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&auto=format&fit=crop&q=80', 6990.0)
            ''', (order_id,))
            
            # Timeline steps for KC-10025
            cur.execute('''
            INSERT INTO order_timeline (order_id, status, title, description, created_by)
            VALUES (?, 'pending', 'Order Placed', 'Customer placed order online successfully', 'System')
            ''', (order_id,))
            cur.execute('''
            INSERT INTO order_timeline (order_id, status, title, description, created_by)
            VALUES (?, 'confirmed', 'Order Confirmed', 'Order verified and approved by store team', 'Store Manager')
            ''', (order_id,))
            cur.execute('''
            INSERT INTO order_timeline (order_id, status, title, description, created_by)
            VALUES (?, 'processing', 'Preparing Order', 'Items quality checked, packed in luxury box', 'Fulfillment Staff')
            ''', (order_id,))
            cur.execute('''
            INSERT INTO order_timeline (order_id, status, title, description, created_by)
            VALUES (?, 'ready', 'Ready for Dispatch', 'Parcel sealed and assigned to Trax Courier', 'Fulfillment Staff')
            ''', (order_id,))
            cur.execute('''
            INSERT INTO order_timeline (order_id, status, title, description, created_by)
            VALUES (?, 'on_the_way', 'On The Way', 'Rider is out for delivery with parcel #TRX-99882211', 'Trax Courier')
            ''', (order_id,))

        elif o[0] == 'KC-10024':
            cur.execute('''
            INSERT INTO order_items (order_id, product_id, product_name, price, quantity, size, color, thumbnail, total)
            VALUES (?, 6, 'Royal Chronograph Sapphire Glass Watch', 12900.0, 1, 'One Size', 'Emerald Gold', 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&auto=format&fit=crop&q=80', 12900.0)
            ''', (order_id,))
            cur.execute('''
            INSERT INTO order_timeline (order_id, status, title, description, created_by)
            VALUES (?, 'pending', 'Order Placed', 'Customer placed order online', 'System')
            ''', (order_id,))
            cur.execute('''
            INSERT INTO order_timeline (order_id, status, title, description, created_by)
            VALUES (?, 'confirmed', 'Payment Verified', 'EasyPaisa payment confirmed', 'Store Manager')
            ''', (order_id,))
            cur.execute('''
            INSERT INTO order_timeline (order_id, status, title, description, created_by)
            VALUES (?, 'processing', 'Packing & Quality Check', 'Preparing timepiece in wooden display box', 'Fulfillment Staff')
            ''', (order_id,))

        elif o[0] == 'KC-10023':
            cur.execute('''
            INSERT INTO order_items (order_id, product_id, product_name, price, quantity, size, color, thumbnail, total)
            VALUES (?, 3, 'Emperor Cut Raw Silk Men Shalwar Kameez', 8450.0, 1, 'L', 'Charcoal Black', 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=800&auto=format&fit=crop&q=80', 8450.0)
            ''', (order_id,))
            cur.execute('''
            INSERT INTO order_items (order_id, product_id, product_name, price, quantity, size, color, thumbnail, total)
            VALUES (?, 4, 'Handcrafted Jamawar Embroidered Men Waistcoat', 6200.0, 1, 'L', 'Midnight Gold', 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&auto=format&fit=crop&q=80', 6200.0)
            ''', (order_id,))
            cur.execute('''
            INSERT INTO order_timeline (order_id, status, title, description, created_by)
            VALUES (?, 'delivered', 'Delivered', 'Parcel safely handed over to customer', 'TCS Express')
            ''', (order_id,))

    # 9. Store Settings
    settings = [
        ('store_name', 'Khushi Collection', 'general', 'Store Brand Name'),
        ('store_tagline', 'The Crown of Eastern & Modern Luxury', 'general', 'Brand Tagline'),
        ('store_phone', '+92 300 1234567', 'general', 'Customer Support Helpline'),
        ('store_whatsapp', '923001234567', 'general', 'Store Owner Official WhatsApp'),
        ('store_email', 'support@khushicollection.com', 'general', 'Store Email Address'),
        ('store_address', 'Suite 104, Gulberg Galleria, Main Boulevard, Lahore, Pakistan', 'general', 'Physical Store Address'),
        ('currency_symbol', 'Rs.', 'general', 'Currency Display Symbol'),
        ('announcement_text', '✨ FREE NATIONWIDE EXPRESS DELIVERY ON ORDERS OVER RS. 5,000 | WHATSAPP: +92 300 1234567 ✨', 'general', 'Announcement Bar Message'),
        ('announcement_enabled', '1', 'general', 'Show Announcement Bar'),
        
        # Delivery Settings
        ('base_delivery_fee', '200', 'delivery', 'Base Standard Delivery Charge'),
        ('free_delivery_threshold', '5000', 'delivery', 'Free Delivery Minimum Cart Amount'),
        ('city_rates', json.dumps({
            'Islamabad': 150,
            'Rawalpindi': 150,
            'Lahore': 180,
            'Karachi': 250,
            'Peshawar': 220,
            'Quetta': 280,
            'Faisalabad': 200,
            'Multan': 200,
            'Sialkot': 200,
            'Gujranwala': 200,
            'Other Cities': 250
        }), 'delivery', 'City-wise Shipping Rates in PKR'),
        ('estimated_delivery_days', '2 - 4 Business Days', 'delivery', 'Nationwide Delivery Time'),

        # Payment Methods
        ('cod_enabled', '1', 'payment', 'Enable Cash on Delivery'),
        ('bank_enabled', '1', 'payment', 'Enable Bank Transfer'),
        ('bank_name', 'Meezan Bank Limited', 'payment', 'Bank Name'),
        ('bank_account_title', 'Khushi Collection Luxury Pvt Ltd', 'payment', 'Account Title'),
        ('bank_account_number', '0201010887654321', 'payment', 'Account Number'),
        ('bank_iban', 'PK36MEZN000201010887654321', 'payment', 'IBAN'),
        ('easypaisa_enabled', '1', 'payment', 'Enable EasyPaisa'),
        ('easypaisa_title', 'Khushi Fatima (Khushi Collection)', 'payment', 'EasyPaisa Account Title'),
        ('easypaisa_number', '03001234567', 'payment', 'EasyPaisa Mobile Number'),
        ('jazzcash_enabled', '1', 'payment', 'Enable JazzCash'),
        ('jazzcash_title', 'Khushi Fatima (Khushi Collection)', 'payment', 'JazzCash Account Title'),
        ('jazzcash_number', '03001234567', 'payment', 'JazzCash Mobile Number'),

        # Integrations
        ('whatsapp_notify_owner', '1', 'integration', 'Send notification to store owner on new order'),
        ('whatsapp_notify_customer', '1', 'integration', 'Allow one-click order confirmation to customer'),
        ('sms_provider', 'simulator', 'integration', 'SMS Gateway Provider (simulator, twilio, pk_sms)'),
        ('sms_api_key', 'KC_SECURE_API_SMS_KEY_8829', 'integration', 'SMS Provider API Key'),
        ('sms_sender_id', 'KHUSHI-COL', 'integration', 'SMS Sender Masking'),
        ('whatsapp_api_token', 'KC_SECURE_WA_TOKEN_9921', 'integration', 'WhatsApp Cloud API Token')
    ]
    cur.executemany('''
    INSERT OR REPLACE INTO settings (setting_key, setting_value, setting_group, description)
    VALUES (?, ?, ?, ?)
    ''', settings)

    conn.commit()
    conn.close()
    print("Khushi Collection database successfully populated with rich luxury catalog, orders, banners, and settings!")

if __name__ == '__main__':
    seed()
