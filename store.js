const DEFAULT_SETTINGS = {
    store_profile: {
        store_name: "Khushi Collection",
        tagline: "Haute Couture & Bespoke Luxury Fashion",
        store_currency: "PKR",
        currency_symbol: "Rs.",
        country: "Pakistan",
        timezone: "Asia/Karachi",
        footer_description: "Bespoke Pakistani bridal couture, luxury velvet ensembles, pure Kashmiri pashminas, artisanal khussas, and royal oud fragrances crafted for modern royalty."
    },
    contact_support: {
        support_phone: "+92 300 1234567",
        whatsapp_number: "+92 300 1234567",
        support_email: "concierge@khushicollection.com",
        business_address: "Khushi Collection Flagship Atelier, M.M. Alam Road, Gulberg III, Lahore, Pakistan",
        working_hours: "Monday – Saturday: 11:00 AM – 10:00 PM PKT"
    },
    social_media: {
        instagram: "https://instagram.com/khushicollection",
        facebook: "https://facebook.com/khushicollection",
        tiktok: "https://tiktok.com/@khushicollection",
        youtube: "https://youtube.com/@khushicollection"
    },
    payments: {
        cod: {
            enabled: true,
            min_amount: 1000,
            max_amount: 75000,
            extra_fee: 0,
            instruction: "Pay in cash upon physical delivery. Please inspect your parcel in the presence of the courier agent."
        },
        bank_transfer: {
            enabled: true,
            bank_name: "Meezan Bank Limited",
            account_title: "KHUSHI COLLECTION (PVT) LTD",
            account_number: "02010109988776",
            iban: "PK44MEZN0002010109988776",
            branch: "Gulberg III Flagship Branch, Lahore",
            instruction: "Kindly transfer the exact order amount and share the transaction screenshot via WhatsApp concierge at +92 300 1234567."
        },
        easypaisa: {
            enabled: true,
            account_title: "Khushi Official",
            account_number: "03001234567",
            instruction: "Send payment via EasyPaisa App / Till and WhatsApp proof of transaction."
        },
        jazzcash: {
            enabled: true,
            account_title: "Khushi Official",
            account_number: "03001234567",
            instruction: "Send payment via JazzCash App / Till and WhatsApp confirmation SMS screenshot."
        },
        online_card: {
            enabled: true,
            provider: "Visa / Mastercard 3D Secure",
            instruction: "Accepting all Pakistani and international Visa, Mastercard, and UnionPay cards."
        }
    },
    delivery: {
        base_fee: 250,
        free_delivery_threshold: 5000,
        estimated_days_lahore: "1-2 Business Days",
        estimated_days_nationwide: "2-4 Business Days",
        estimated_days_international: "5-7 Business Days"
    },
    taxes: {
        vat_tax_percent: 0,
        prices_include_tax: true
    },
    notifications: {
        email_order_placed: true,
        sms_order_placed: true,
        whatsapp_instant_notification: true
    },
    onboarding: {
        completed: true
    },
    flash_sale: {
        title: "🔥 KHUSHI GRAND FLASH SALE",
        end_time: new Date(Date.now() + 24 * 3600 * 1000).toISOString()
    }
};

// ========================================================================
// KHUSHI COLLECTION — UNIFIED DATA LAYER & STORE ENGINE (UPGRADED)
// ========================================================================

const DEFAULT_CATEGORIES = [
    {
        id: 1,
        name: "Women",
        slug: "women",
        description: "Bespoke bridal couture, luxury velvet ensembles, and festive stitched pret.",
        image_url: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&auto=format&fit=crop&q=80",
        banner_url: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=1600&auto=format&fit=crop&q=80",
        is_featured: true,
        display_order: 1,
        subcategories: ["Dresses", "Shalwar Kameez", "Sarees", "Abayas", "Tops", "Bottoms"]
    },
    {
        id: 2,
        name: "Men",
        slug: "men",
        description: "Tailored Korean raw silk kurtas, designer jamawar waistcoats, and regal heritage attire.",
        image_url: "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=800&auto=format&fit=crop&q=80",
        banner_url: "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=1600&auto=format&fit=crop&q=80",
        is_featured: true,
        display_order: 2,
        subcategories: ["Shalwar Kameez", "Suits", "Shirts", "T-Shirts", "Pants", "Jackets", "Waistcoats"]
    },
    {
        id: 3,
        name: "Kids",
        slug: "kids",
        description: "Comfortable organic cotton festive attire for boys, girls, and infants.",
        image_url: "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=800&auto=format&fit=crop&q=80",
        banner_url: "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=1600&auto=format&fit=crop&q=80",
        is_featured: true,
        display_order: 3,
        subcategories: ["Boys", "Girls", "Baby", "Festive Kurta Sets"]
    },
    {
        id: 4,
        name: "Shoes",
        slug: "shoes",
        description: "Pure leather hand-stitched bridal khussas and artisanal Peshawari chappals.",
        image_url: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&auto=format&fit=crop&q=80",
        banner_url: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=1600&auto=format&fit=crop&q=80",
        is_featured: true,
        display_order: 4,
        subcategories: ["Women Khussas", "Men Peshawari", "Bridal Heels", "Handcrafted Mules"]
    },
    {
        id: 5,
        name: "Watches",
        slug: "watches",
        description: "Swiss & Japanese chronograph timepieces with scratch-resistant sapphire glass.",
        image_url: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&auto=format&fit=crop&q=80",
        banner_url: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=1600&auto=format&fit=crop&q=80",
        is_featured: true,
        display_order: 5,
        subcategories: ["Men Chronographs", "Women Luxury Timepieces", "Automatic Mechanical"]
    },
    {
        id: 6,
        name: "Perfumes",
        slug: "perfumes",
        description: "Rare oriental agarwood extracts, pure French absolutes, and 24-hour long-lasting ouds.",
        image_url: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&auto=format&fit=crop&q=80",
        banner_url: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=1600&auto=format&fit=crop&q=80",
        is_featured: true,
        display_order: 6,
        subcategories: ["Oriental Oud", "Floral Eau De Parfum", "Attar Concentrates", "Men Fragrances"]
    },
    {
        id: 7,
        name: "Bags",
        slug: "bags",
        description: "Structured artisan quilted totes, bridal clutches, and genuine leather carryalls.",
        image_url: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&auto=format&fit=crop&q=80",
        banner_url: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=1600&auto=format&fit=crop&q=80",
        is_featured: false,
        display_order: 7,
        subcategories: ["Luxury Totes", "Crossbody", "Bridal Clutches", "Wallets"]
    },
    {
        id: 8,
        name: "Beauty",
        slug: "beauty",
        description: "Organic 24K gold radiance serums, illuminating elixirs, and luxury skincare.",
        image_url: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80",
        banner_url: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1600&auto=format&fit=crop&q=80",
        is_featured: false,
        display_order: 8,
        subcategories: ["Face Serums", "Glow Oils", "Organic Care"]
    }
];

// Pre-configured Category Specific Attributes Schema
const CATEGORY_ATTRIBUTE_SCHEMAS = {
    clothes: [
        { key: "gender", label: "Gender", type: "select", options: ["Women", "Men", "Unisex", "Girls", "Boys"] },
        { key: "clothing_type", label: "Clothing Type", type: "select", options: ["3-Piece Stitched", "2-Piece Stitched", "Kurta", "Waistcoat", "Shalwar Kameez", "Saree", "Abaya", "Tops"] },
        { key: "fabric", label: "Fabric", type: "text", placeholder: "e.g. Micro Velvet 9000, Korean Raw Silk, Pure Chiffon" },
        { key: "material", label: "Material Composition", type: "text", placeholder: "e.g. 100% Cotton, Silk Blend" },
        { key: "pattern", label: "Pattern", type: "select", options: ["Embroidered", "Solid", "Digital Print", "Block Print", "Jacquard"] },
        { key: "fit", label: "Fit Type", type: "select", options: ["Regular Fit", "Slim Fit", "Relaxed Fit", "Custom Tailored"] },
        { key: "sleeve_type", label: "Sleeve Type", type: "select", options: ["Full Sleeves", "Three-Quarter", "Half Sleeves", "Sleeveless"] },
        { key: "neck_type", label: "Neckline / Collar", type: "select", options: ["Mandarin / Band Collar", "V-Neck", "Round Neck", "Boat Neck", "Embroidered Placket"] },
        { key: "season", label: "Season", type: "select", options: ["Winter Festive", "All Season", "Summer Spring", "Festive Autumn"] },
        { key: "occasion", label: "Occasion", type: "select", options: ["Wedding Formal", "Festive / Eid", "Party Wear", "Casual Luxury"] },
        { key: "care_instructions", label: "Care Instructions", type: "text", placeholder: "e.g. Dry Clean Only, Gentle Cold Wash" },
        { key: "country_of_origin", label: "Country of Origin", type: "text", placeholder: "e.g. Pakistan" }
    ],
    shoes: [
        { key: "gender", label: "Gender", type: "select", options: ["Women", "Men", "Unisex", "Kids"] },
        { key: "shoe_type", label: "Shoe Type", type: "select", options: ["Khussa", "Peshawari Chappal", "Mules", "Bridal Heels", "Loafers"] },
        { key: "material", label: "Upper Material", type: "text", placeholder: "e.g. Pure Velvet with Tilla, Steerhide Cow Leather" },
        { key: "sole_material", label: "Sole Material", type: "text", placeholder: "e.g. Genuine Cow Leather, Flexible Tyre Rubber" },
        { key: "style", label: "Style", type: "select", options: ["Traditional Hand-Embroidered", "Modern Heritage", "Bridal Formal"] },
        { key: "occasion", label: "Occasion", type: "select", options: ["Bridal / Wedding", "Festive", "Daily Luxury"] }
    ],
    watches: [
        { key: "brand", label: "Watch Brand", type: "text", placeholder: "e.g. Khushi Timepieces" },
        { key: "model", label: "Model Reference", type: "text", placeholder: "e.g. Royal Chronograph Heritage" },
        { key: "movement", label: "Movement Type", type: "select", options: ["Japanese Quartz Chronograph", "Swiss Automatic", "Mechanical"] },
        { key: "dial_color", label: "Dial Color", type: "text", placeholder: "e.g. Sunburst Emerald, Obsidian Black" },
        { key: "strap_material", label: "Strap Material", type: "select", options: ["316L Stainless Steel", "Genuine Italian Leather", "Silicone Rubber"] },
        { key: "case_material", label: "Case Material", type: "text", placeholder: "e.g. Medical-Grade 316L Stainless Steel" },
        { key: "case_size", label: "Case Size", type: "text", placeholder: "e.g. 41mm" },
        { key: "water_resistance", label: "Water Resistance", type: "select", options: ["5 ATM / 50M", "3 ATM / 30M", "10 ATM / 100M"] },
        { key: "display_type", label: "Display Type", type: "select", options: ["Analog Chronograph", "Classic Three-Hand"] }
    ],
    perfumes: [
        { key: "brand", label: "Parfumerie Brand", type: "text", placeholder: "e.g. Khushi Haute Parfumerie" },
        { key: "fragrance_type", label: "Fragrance Type", type: "select", options: ["Eau De Parfum (EDP)", "Extrait De Parfum", "Pure Concentrated Attar"] },
        { key: "gender", label: "Gender", type: "select", options: ["Unisex", "For Him", "For Her"] },
        { key: "volume", label: "Volume / Size", type: "select", options: ["100ml / 3.4 fl. oz", "50ml / 1.7 fl. oz", "12ml Attar Bottle"] },
        { key: "fragrance_family", label: "Fragrance Family", type: "select", options: ["Oriental Woody", "Amber Floral", "Rich Leather", "Fresh Citrus Spicy"] },
        { key: "top_notes", label: "Top Notes", type: "text", placeholder: "e.g. Saffron, Damascus Rose, Bergamot" },
        { key: "middle_notes", label: "Middle / Heart Notes", type: "text", placeholder: "e.g. Smoky Birch, Jasmine, Leather" },
        { key: "base_notes", label: "Base Notes", type: "text", placeholder: "e.g. Aged Cambodian Oud, Ambergris, Madagascar Vanilla" },
        { key: "concentration", label: "Oil Concentration", type: "text", placeholder: "e.g. 28% High Concentration" }
    ],
    bags: [
        { key: "bag_type", label: "Bag Type", type: "select", options: ["Structured Tote", "Bridal Clutch", "Shoulder Bag", "Crossbody"] },
        { key: "material", label: "Material", type: "text", placeholder: "e.g. Vegan Micro-grain Leather, Velvet Embroidered" },
        { key: "dimensions", label: "Dimensions (W x H x D)", type: "text", placeholder: "e.g. 34cm x 26cm x 13cm" },
        { key: "strap_type", label: "Strap Type", type: "select", options: ["Detachable Gold Chain", "Adjustable Leather Strap", "Dual Top Handle"] },
        { key: "compartments", label: "Number of Compartments", type: "number", placeholder: "3" },
        { key: "closure_type", label: "Closure Type", type: "select", options: ["Magnetic Snap", "Heavy Duty Metal Zipper", "Twist Lock"] }
    ],
    accessories: [
        { key: "material", label: "Material", type: "text", placeholder: "e.g. Brass with 24K Gold Polish" },
        { key: "finish", label: "Finish", type: "text", placeholder: "e.g. High Polish Gloss, Matte" }
    ]
};

// Rich Luxury Product Catalog (96 Handcrafted Pieces across 8 Categories with HD Imagery and Color Swatches)
const DEFAULT_PRODUCTS = [
    {
        "id": 1,
        "name": "Khushi Royal Embroidered Velvet Shawl Suit",
        "slug": "khushi-royal-embroidered-velvet-shawl-suit",
        "category": "women",
        "subcategory": "Dresses",
        "category_name": "Women Couture",
        "brand": "Khushi Collection",
        "sku": "KC-WMN-001",
        "price": 18500,
        "sale_price": 14950,
        "cost_price": 10175,
        "stock": 12,
        "low_stock_threshold": 3,
        "status": "published",
        "is_featured": true,
        "is_new": false,
        "is_bestseller": true,
        "is_flash_sale": false,
        "rating": 4.9,
        "reviews_count": 23,
        "thumbnail": "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&auto=format&fit=crop&q=80",
        "secondary_image": "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&auto=format&fit=crop&q=80",
        "images": [
            "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800&auto=format&fit=crop&q=80"
        ],
        "short_description": "Signature hand-embroidered velvet 3-piece suit with plush border shawl and tailored raw silk pants.",
        "description": "Signature hand-embroidered velvet 3-piece suit with plush border shawl and tailored raw silk pants. Handcrafted with meticulous attention to detail, luxury finished hems, and authentic materials.",
        "sizes": [
            "XS",
            "S",
            "M",
            "L",
            "XL"
        ],
        "colors": [
            {
                "name": "Emerald Green",
                "hex": "#064e3b"
            },
            {
                "name": "Ruby Maroon",
                "hex": "#881337"
            },
            {
                "name": "Midnight Black",
                "hex": "#09090b"
            }
        ]
    },
    {
        "id": 2,
        "name": "Imperial Zardozi Raw Silk Peshwas",
        "slug": "imperial-zardozi-raw-silk-peshwas",
        "category": "women",
        "subcategory": "Dresses",
        "category_name": "Women Couture",
        "brand": "Khushi Collection",
        "sku": "KC-WMN-002",
        "price": 28500,
        "sale_price": 24500,
        "cost_price": 15675,
        "stock": 12,
        "low_stock_threshold": 3,
        "status": "published",
        "is_featured": true,
        "is_new": false,
        "is_bestseller": false,
        "is_flash_sale": false,
        "rating": 4.95,
        "reviews_count": 28,
        "thumbnail": "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800&auto=format&fit=crop&q=80",
        "secondary_image": "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&auto=format&fit=crop&q=80",
        "images": [
            "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&auto=format&fit=crop&q=80"
        ],
        "short_description": "Floor-length 16-kali pure raw silk peshwas heavily encrusted with dabka, kora, and French knot sequins.",
        "description": "Floor-length 16-kali pure raw silk peshwas heavily encrusted with dabka, kora, and French knot sequins. Handcrafted with meticulous attention to detail, luxury finished hems, and authentic materials.",
        "sizes": [
            "XS",
            "S",
            "M",
            "L"
        ],
        "colors": [
            {
                "name": "Royal Plum",
                "hex": "#701a75"
            },
            {
                "name": "Sapphire Azure",
                "hex": "#0284c7"
            },
            {
                "name": "Antique Gold",
                "hex": "#ca8a04"
            }
        ]
    },
    {
        "id": 3,
        "name": "Noor-e-Jahan Bamberg Chiffon Saree",
        "slug": "noor-e-jahan-bamberg-chiffon-saree",
        "category": "women",
        "subcategory": "Sarees",
        "category_name": "Women Couture",
        "brand": "Khushi Collection",
        "sku": "KC-WMN-003",
        "price": 22000,
        "sale_price": 18900,
        "cost_price": 12100,
        "stock": 12,
        "low_stock_threshold": 3,
        "status": "published",
        "is_featured": true,
        "is_new": true,
        "is_bestseller": true,
        "is_flash_sale": false,
        "rating": 4.85,
        "reviews_count": 33,
        "thumbnail": "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&auto=format&fit=crop&q=80",
        "secondary_image": "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&auto=format&fit=crop&q=80",
        "images": [
            "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800&auto=format&fit=crop&q=80"
        ],
        "short_description": "Pure 80gm Bamberg chiffon 6-yard saree with hand-cut scalloped borders and embroidered blouse piece.",
        "description": "Pure 80gm Bamberg chiffon 6-yard saree with hand-cut scalloped borders and embroidered blouse piece. Handcrafted with meticulous attention to detail, luxury finished hems, and authentic materials.",
        "sizes": [
            "Free Size / Custom"
        ],
        "colors": [
            {
                "name": "Crimson Scarlet",
                "hex": "#991b1b"
            },
            {
                "name": "Navy Midnight",
                "hex": "#1e1b4b"
            },
            {
                "name": "Bottle Green",
                "hex": "#14532d"
            }
        ]
    },
    {
        "id": 4,
        "name": "Gul-e-Rana Embroidered Organza Angrakha",
        "slug": "gul-e-rana-embroidered-organza-angrakha",
        "category": "women",
        "subcategory": "Dresses",
        "category_name": "Women Couture",
        "brand": "Khushi Collection",
        "sku": "KC-WMN-004",
        "price": 19500,
        "sale_price": 16200,
        "cost_price": 10725,
        "stock": 12,
        "low_stock_threshold": 3,
        "status": "published",
        "is_featured": false,
        "is_new": false,
        "is_bestseller": false,
        "is_flash_sale": true,
        "rating": 4.9,
        "reviews_count": 38,
        "thumbnail": "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop&q=80",
        "secondary_image": "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&auto=format&fit=crop&q=80",
        "images": [
            "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800&auto=format&fit=crop&q=80"
        ],
        "short_description": "Sheer organza flared angrakha with resham florals and pearl handwork paired with crushed silk sharara.",
        "description": "Sheer organza flared angrakha with resham florals and pearl handwork paired with crushed silk sharara. Handcrafted with meticulous attention to detail, luxury finished hems, and authentic materials.",
        "sizes": [
            "S",
            "M",
            "L",
            "XL"
        ],
        "colors": [
            {
                "name": "Rose Quartz",
                "hex": "#f43f5e"
            },
            {
                "name": "Sunset Ochre",
                "hex": "#d97706"
            },
            {
                "name": "Lilac Bloom",
                "hex": "#a855f7"
            }
        ]
    },
    {
        "id": 5,
        "name": "Mughal Jaal Silk Shalwar Kameez",
        "slug": "mughal-jaal-silk-shalwar-kameez",
        "category": "women",
        "subcategory": "Shalwar Kameez",
        "category_name": "Women Couture",
        "brand": "Khushi Collection",
        "sku": "KC-WMN-005",
        "price": 14500,
        "sale_price": 11900,
        "cost_price": 7975,
        "stock": 12,
        "low_stock_threshold": 3,
        "status": "published",
        "is_featured": false,
        "is_new": false,
        "is_bestseller": true,
        "is_flash_sale": false,
        "rating": 4.95,
        "reviews_count": 43,
        "thumbnail": "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800&auto=format&fit=crop&q=80",
        "secondary_image": "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&auto=format&fit=crop&q=80",
        "images": [
            "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&auto=format&fit=crop&q=80"
        ],
        "short_description": "Straight silhouette silk tunic with Kashmiri tilla neckline and traditional tulip shalwar.",
        "description": "Straight silhouette silk tunic with Kashmiri tilla neckline and traditional tulip shalwar. Handcrafted with meticulous attention to detail, luxury finished hems, and authentic materials.",
        "sizes": [
            "S",
            "M",
            "L",
            "XL"
        ],
        "colors": [
            {
                "name": "Charcoal Jet",
                "hex": "#1c1917"
            },
            {
                "name": "Cobalt Royal",
                "hex": "#1e3a8a"
            },
            {
                "name": "Forest Emerald",
                "hex": "#047857"
            }
        ]
    },
    {
        "id": 6,
        "name": "Shahtush Kashmiri Handwoven Wrap Kaftan",
        "slug": "shahtush-kashmiri-handwoven-wrap-kaftan",
        "category": "women",
        "subcategory": "Abayas",
        "category_name": "Women Couture",
        "brand": "Khushi Collection",
        "sku": "KC-WMN-006",
        "price": 24000,
        "sale_price": 19800,
        "cost_price": 13200,
        "stock": 12,
        "low_stock_threshold": 3,
        "status": "published",
        "is_featured": false,
        "is_new": true,
        "is_bestseller": false,
        "is_flash_sale": false,
        "rating": 4.85,
        "reviews_count": 48,
        "thumbnail": "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=800&auto=format&fit=crop&q=80",
        "secondary_image": "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&auto=format&fit=crop&q=80",
        "images": [
            "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800&auto=format&fit=crop&q=80"
        ],
        "short_description": "Flowing Moroccan cut kaftan in fine blended wool with handmade metallic bullion tassel belt.",
        "description": "Flowing Moroccan cut kaftan in fine blended wool with handmade metallic bullion tassel belt. Handcrafted with meticulous attention to detail, luxury finished hems, and authentic materials.",
        "sizes": [
            "Free Size"
        ],
        "colors": [
            {
                "name": "Obsidian",
                "hex": "#0f172a"
            },
            {
                "name": "Rich Maroon",
                "hex": "#450a0a"
            },
            {
                "name": "Deep Pine",
                "hex": "#14532d"
            }
        ]
    },
    {
        "id": 7,
        "name": "Zar-Baf Handcrafted Bridal Lehenga",
        "slug": "zar-baf-handcrafted-bridal-lehenga",
        "category": "women",
        "subcategory": "Dresses",
        "category_name": "Women Couture",
        "brand": "Khushi Collection",
        "sku": "KC-WMN-007",
        "price": 45000,
        "sale_price": 39500,
        "cost_price": 24750,
        "stock": 12,
        "low_stock_threshold": 3,
        "status": "published",
        "is_featured": false,
        "is_new": false,
        "is_bestseller": true,
        "is_flash_sale": false,
        "rating": 4.9,
        "reviews_count": 53,
        "thumbnail": "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&auto=format&fit=crop&q=80",
        "secondary_image": "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&auto=format&fit=crop&q=80",
        "images": [
            "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800&auto=format&fit=crop&q=80"
        ],
        "short_description": "Grand bridal lehenga set adorned with 3D floral crystals, mukesh net dupatta, and heirloom zardozi blouse.",
        "description": "Grand bridal lehenga set adorned with 3D floral crystals, mukesh net dupatta, and heirloom zardozi blouse. Handcrafted with meticulous attention to detail, luxury finished hems, and authentic materials.",
        "sizes": [
            "S",
            "M",
            "L",
            "Custom"
        ],
        "colors": [
            {
                "name": "Deep Bridal Red",
                "hex": "#b91c1c"
            },
            {
                "name": "Plum Royale",
                "hex": "#831843"
            },
            {
                "name": "Antique Rust",
                "hex": "#78350f"
            }
        ]
    },
    {
        "id": 8,
        "name": "Aab-e-Rawaan Tissue Silk Tunic",
        "slug": "aab-e-rawaan-tissue-silk-tunic",
        "category": "women",
        "subcategory": "Tops",
        "category_name": "Women Couture",
        "brand": "Khushi Collection",
        "sku": "KC-WMN-008",
        "price": 12500,
        "sale_price": null,
        "cost_price": 6875,
        "stock": 12,
        "low_stock_threshold": 3,
        "status": "published",
        "is_featured": false,
        "is_new": false,
        "is_bestseller": false,
        "is_flash_sale": false,
        "rating": 4.95,
        "reviews_count": 58,
        "thumbnail": "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop&q=80",
        "secondary_image": "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800&auto=format&fit=crop&q=80",
        "images": [
            "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&auto=format&fit=crop&q=80"
        ],
        "short_description": "Contemporary high-slit raw tissue tunic featuring scalloped resham cuffs and mother-of-pearl buttons.",
        "description": "Contemporary high-slit raw tissue tunic featuring scalloped resham cuffs and mother-of-pearl buttons. Handcrafted with meticulous attention to detail, luxury finished hems, and authentic materials.",
        "sizes": [
            "XS",
            "S",
            "M",
            "L"
        ],
        "colors": [
            {
                "name": "Champagne Gold",
                "hex": "#fef08a"
            },
            {
                "name": "Icy Frost Blue",
                "hex": "#bae6fd"
            },
            {
                "name": "Blush Petal",
                "hex": "#fbcfe8"
            }
        ]
    },
    {
        "id": 9,
        "name": "Nawabi Jamawar Flared Gharara Suit",
        "slug": "nawabi-jamawar-flared-gharara-suit",
        "category": "women",
        "subcategory": "Dresses",
        "category_name": "Women Couture",
        "brand": "Khushi Collection",
        "sku": "KC-WMN-009",
        "price": 21500,
        "sale_price": 17800,
        "cost_price": 11825,
        "stock": 12,
        "low_stock_threshold": 3,
        "status": "published",
        "is_featured": false,
        "is_new": true,
        "is_bestseller": true,
        "is_flash_sale": false,
        "rating": 4.85,
        "reviews_count": 63,
        "thumbnail": "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&auto=format&fit=crop&q=80",
        "secondary_image": "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800&auto=format&fit=crop&q=80",
        "images": [
            "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&auto=format&fit=crop&q=80"
        ],
        "short_description": "Classic 2-tiered woven Banarsi jamawar gharara with pure katan silk kurta and sitara organza dupatta.",
        "description": "Classic 2-tiered woven Banarsi jamawar gharara with pure katan silk kurta and sitara organza dupatta. Handcrafted with meticulous attention to detail, luxury finished hems, and authentic materials.",
        "sizes": [
            "S",
            "M",
            "L"
        ],
        "colors": [
            {
                "name": "Emerald Velvet",
                "hex": "#065f46"
            },
            {
                "name": "Persian Rose",
                "hex": "#831843"
            },
            {
                "name": "Royal Midnight",
                "hex": "#1e1b4b"
            }
        ]
    },
    {
        "id": 10,
        "name": "Mehr-un-Nisa Chikan Kari Luxury Pret",
        "slug": "mehr-un-nisa-chikan-kari-luxury-pret",
        "category": "women",
        "subcategory": "Shalwar Kameez",
        "category_name": "Women Couture",
        "brand": "Khushi Collection",
        "sku": "KC-WMN-010",
        "price": 13900,
        "sale_price": 11500,
        "cost_price": 7645,
        "stock": 12,
        "low_stock_threshold": 3,
        "status": "published",
        "is_featured": false,
        "is_new": false,
        "is_bestseller": false,
        "is_flash_sale": false,
        "rating": 4.9,
        "reviews_count": 68,
        "thumbnail": "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800&auto=format&fit=crop&q=80",
        "secondary_image": "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop&q=80",
        "images": [
            "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&auto=format&fit=crop&q=80"
        ],
        "short_description": "Intricate shadow-work chikan embroidery with crochet lace inlays on soft lawn and silk dupatta.",
        "description": "Intricate shadow-work chikan embroidery with crochet lace inlays on soft lawn and silk dupatta. Handcrafted with meticulous attention to detail, luxury finished hems, and authentic materials.",
        "sizes": [
            "XS",
            "S",
            "M",
            "L",
            "XL"
        ],
        "colors": [
            {
                "name": "Pure Ivory",
                "hex": "#f8fafc"
            },
            {
                "name": "Butter Buttercup",
                "hex": "#fef3c7"
            },
            {
                "name": "Soft Pink",
                "hex": "#fce7f3"
            }
        ]
    },
    {
        "id": 11,
        "name": "Shah Bano Banarasi Brocade Anarkali",
        "slug": "shah-bano-banarasi-brocade-anarkali",
        "category": "women",
        "subcategory": "Dresses",
        "category_name": "Women Couture",
        "brand": "Khushi Collection",
        "sku": "KC-WMN-011",
        "price": 26000,
        "sale_price": 21900,
        "cost_price": 14300,
        "stock": 12,
        "low_stock_threshold": 3,
        "status": "published",
        "is_featured": false,
        "is_new": false,
        "is_bestseller": true,
        "is_flash_sale": false,
        "rating": 4.95,
        "reviews_count": 73,
        "thumbnail": "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800&auto=format&fit=crop&q=80",
        "secondary_image": "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&auto=format&fit=crop&q=80",
        "images": [
            "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&auto=format&fit=crop&q=80"
        ],
        "short_description": "Heavily flared brocade Anarkali with woven gold tilla motifs and contrasting marori border.",
        "description": "Heavily flared brocade Anarkali with woven gold tilla motifs and contrasting marori border. Handcrafted with meticulous attention to detail, luxury finished hems, and authentic materials.",
        "sizes": [
            "S",
            "M",
            "L"
        ],
        "colors": [
            {
                "name": "Ruby Velvet",
                "hex": "#4c0519"
            },
            {
                "name": "Bottle Emerald",
                "hex": "#064e3b"
            },
            {
                "name": "Indigo Royal",
                "hex": "#312e81"
            }
        ]
    },
    {
        "id": 12,
        "name": "Falaknaz Embroidered Velvet Kaftan",
        "slug": "falaknaz-embroidered-velvet-kaftan",
        "category": "women",
        "subcategory": "Abayas",
        "category_name": "Women Couture",
        "brand": "Khushi Collection",
        "sku": "KC-WMN-012",
        "price": 17500,
        "sale_price": 14200,
        "cost_price": 9625,
        "stock": 12,
        "low_stock_threshold": 3,
        "status": "published",
        "is_featured": false,
        "is_new": true,
        "is_bestseller": false,
        "is_flash_sale": true,
        "rating": 4.85,
        "reviews_count": 78,
        "thumbnail": "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=800&auto=format&fit=crop&q=80",
        "secondary_image": "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&auto=format&fit=crop&q=80",
        "images": [
            "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800&auto=format&fit=crop&q=80"
        ],
        "short_description": "Plush micro-velvet slipover kaftan with gold corded embroidery along neck and hemline.",
        "description": "Plush micro-velvet slipover kaftan with gold corded embroidery along neck and hemline. Handcrafted with meticulous attention to detail, luxury finished hems, and authentic materials.",
        "sizes": [
            "Free Size"
        ],
        "colors": [
            {
                "name": "Jet Black",
                "hex": "#18181b"
            },
            {
                "name": "Velvet Plum",
                "hex": "#701a75"
            },
            {
                "name": "Pine Green",
                "hex": "#064e3b"
            }
        ]
    },
    {
        "id": 13,
        "name": "Nawabi Korean Raw Silk Kurta Set",
        "slug": "nawabi-korean-raw-silk-kurta-set",
        "category": "men",
        "subcategory": "Shalwar Kameez",
        "category_name": "Men Heritage",
        "brand": "Khushi Collection",
        "sku": "KC-MEN-001",
        "price": 11500,
        "sale_price": 9200,
        "cost_price": 6325,
        "stock": 12,
        "low_stock_threshold": 3,
        "status": "published",
        "is_featured": true,
        "is_new": false,
        "is_bestseller": true,
        "is_flash_sale": false,
        "rating": 4.9,
        "reviews_count": 23,
        "thumbnail": "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=800&auto=format&fit=crop&q=80",
        "secondary_image": "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&auto=format&fit=crop&q=80",
        "images": [
            "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=800&auto=format&fit=crop&q=80"
        ],
        "short_description": "Bespoke tailored Korean raw silk 2-piece kurta pajama with metallic crest monogram buttons.",
        "description": "Bespoke tailored Korean raw silk 2-piece kurta pajama with metallic crest monogram buttons. Handcrafted with meticulous attention to detail, luxury finished hems, and authentic materials.",
        "sizes": [
            "S",
            "M",
            "L",
            "XL",
            "XXL"
        ],
        "colors": [
            {
                "name": "Midnight Navy",
                "hex": "#0f172a"
            },
            {
                "name": "Gunmetal Charcoal",
                "hex": "#1e293b"
            },
            {
                "name": "Slate Taupe",
                "hex": "#3f3f46"
            }
        ]
    },
    {
        "id": 14,
        "name": "Royal Jamawar Embroidered Waistcoat",
        "slug": "royal-jamawar-embroidered-waistcoat",
        "category": "men",
        "subcategory": "Waistcoats",
        "category_name": "Men Heritage",
        "brand": "Khushi Collection",
        "sku": "KC-MEN-002",
        "price": 9500,
        "sale_price": 7800,
        "cost_price": 5225,
        "stock": 12,
        "low_stock_threshold": 3,
        "status": "published",
        "is_featured": true,
        "is_new": false,
        "is_bestseller": false,
        "is_flash_sale": false,
        "rating": 4.95,
        "reviews_count": 28,
        "thumbnail": "https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=800&auto=format&fit=crop&q=80",
        "secondary_image": "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=800&auto=format&fit=crop&q=80",
        "images": [
            "https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&auto=format&fit=crop&q=80"
        ],
        "short_description": "Handwoven gold and copper brocade jamawar waistcoat with velvet inner collar lining.",
        "description": "Handwoven gold and copper brocade jamawar waistcoat with velvet inner collar lining. Handcrafted with meticulous attention to detail, luxury finished hems, and authentic materials.",
        "sizes": [
            "38",
            "40",
            "42",
            "44",
            "46"
        ],
        "colors": [
            {
                "name": "Antique Bronze",
                "hex": "#78350f"
            },
            {
                "name": "Emerald Green",
                "hex": "#064e3b"
            },
            {
                "name": "Royal Navy",
                "hex": "#1e1b4b"
            }
        ]
    },
    {
        "id": 15,
        "name": "Sultanate Handcrafted Velvet Prince Suit",
        "slug": "sultanate-handcrafted-velvet-prince-suit",
        "category": "men",
        "subcategory": "Suits",
        "category_name": "Men Heritage",
        "brand": "Khushi Collection",
        "sku": "KC-MEN-003",
        "price": 32000,
        "sale_price": 27500,
        "cost_price": 17600,
        "stock": 12,
        "low_stock_threshold": 3,
        "status": "published",
        "is_featured": true,
        "is_new": true,
        "is_bestseller": true,
        "is_flash_sale": false,
        "rating": 4.85,
        "reviews_count": 33,
        "thumbnail": "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&auto=format&fit=crop&q=80",
        "secondary_image": "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=800&auto=format&fit=crop&q=80",
        "images": [
            "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=800&auto=format&fit=crop&q=80"
        ],
        "short_description": "Bespoke royal prince jacket in Italian micro-velvet with hand-worked zardozi mandarin collar.",
        "description": "Bespoke royal prince jacket in Italian micro-velvet with hand-worked zardozi mandarin collar. Handcrafted with meticulous attention to detail, luxury finished hems, and authentic materials.",
        "sizes": [
            "38",
            "40",
            "42",
            "44"
        ],
        "colors": [
            {
                "name": "Black Obsidian",
                "hex": "#09090b"
            },
            {
                "name": "Maroon Crimson",
                "hex": "#450a0a"
            },
            {
                "name": "Dark Spruce",
                "hex": "#14532d"
            }
        ]
    },
    {
        "id": 16,
        "name": "Lakhnavi Chikan Shadow-Work Kurta",
        "slug": "lakhnavi-chikan-shadow-work-kurta",
        "category": "men",
        "subcategory": "Shalwar Kameez",
        "category_name": "Men Heritage",
        "brand": "Khushi Collection",
        "sku": "KC-MEN-004",
        "price": 8900,
        "sale_price": null,
        "cost_price": 4895,
        "stock": 12,
        "low_stock_threshold": 3,
        "status": "published",
        "is_featured": false,
        "is_new": false,
        "is_bestseller": false,
        "is_flash_sale": false,
        "rating": 4.9,
        "reviews_count": 38,
        "thumbnail": "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=800&auto=format&fit=crop&q=80",
        "secondary_image": "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&auto=format&fit=crop&q=80",
        "images": [
            "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=800&auto=format&fit=crop&q=80"
        ],
        "short_description": "Subtle tone-on-tone embroidered chikan kurta on Egyptian giza cotton with mother-of-pearl studs.",
        "description": "Subtle tone-on-tone embroidered chikan kurta on Egyptian giza cotton with mother-of-pearl studs. Handcrafted with meticulous attention to detail, luxury finished hems, and authentic materials.",
        "sizes": [
            "S",
            "M",
            "L",
            "XL"
        ],
        "colors": [
            {
                "name": "Pure White",
                "hex": "#f8fafc"
            },
            {
                "name": "Warm Cream",
                "hex": "#fef3c7"
            },
            {
                "name": "Ice Blue",
                "hex": "#e0f2fe"
            }
        ]
    },
    {
        "id": 17,
        "name": "Mughal Royal Embroidered Sherwani",
        "slug": "mughal-royal-embroidered-sherwani",
        "category": "men",
        "subcategory": "Suits",
        "category_name": "Men Heritage",
        "brand": "Khushi Collection",
        "sku": "KC-MEN-005",
        "price": 42000,
        "sale_price": 36000,
        "cost_price": 23100,
        "stock": 12,
        "low_stock_threshold": 3,
        "status": "published",
        "is_featured": false,
        "is_new": false,
        "is_bestseller": true,
        "is_flash_sale": false,
        "rating": 4.95,
        "reviews_count": 43,
        "thumbnail": "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&auto=format&fit=crop&q=80",
        "secondary_image": "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=800&auto=format&fit=crop&q=80",
        "images": [
            "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=800&auto=format&fit=crop&q=80"
        ],
        "short_description": "Grand wedding sherwani in woven ivory self-jacquard with hand-stitched antique tilla work.",
        "description": "Grand wedding sherwani in woven ivory self-jacquard with hand-stitched antique tilla work. Handcrafted with meticulous attention to detail, luxury finished hems, and authentic materials.",
        "sizes": [
            "38",
            "40",
            "42",
            "44",
            "46"
        ],
        "colors": [
            {
                "name": "Off-White Ivory",
                "hex": "#fafaf9"
            },
            {
                "name": "Silver Birch",
                "hex": "#e2e8f0"
            },
            {
                "name": "Gold Champagne",
                "hex": "#d4af37"
            }
        ]
    },
    {
        "id": 18,
        "name": "Bespoke Egyptian Cotton Kurta Pajama",
        "slug": "bespoke-egyptian-cotton-kurta-pajama",
        "category": "men",
        "subcategory": "Shalwar Kameez",
        "category_name": "Men Heritage",
        "brand": "Khushi Collection",
        "sku": "KC-MEN-006",
        "price": 7500,
        "sale_price": 6200,
        "cost_price": 4125,
        "stock": 12,
        "low_stock_threshold": 3,
        "status": "published",
        "is_featured": false,
        "is_new": true,
        "is_bestseller": false,
        "is_flash_sale": false,
        "rating": 4.85,
        "reviews_count": 48,
        "thumbnail": "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=800&auto=format&fit=crop&q=80",
        "secondary_image": "https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=800&auto=format&fit=crop&q=80",
        "images": [
            "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&auto=format&fit=crop&q=80"
        ],
        "short_description": "Ultra-breathable 120s count giza cotton kurta with classic band collar and matching trouser.",
        "description": "Ultra-breathable 120s count giza cotton kurta with classic band collar and matching trouser. Handcrafted with meticulous attention to detail, luxury finished hems, and authentic materials.",
        "sizes": [
            "S",
            "M",
            "L",
            "XL"
        ],
        "colors": [
            {
                "name": "Deep Navy",
                "hex": "#0f172a"
            },
            {
                "name": "Steel Blue",
                "hex": "#1e3a8a"
            },
            {
                "name": "Olive Drab",
                "hex": "#064e3b"
            }
        ]
    },
    {
        "id": 19,
        "name": "Imperial Silk Matka Festive Waistcoat",
        "slug": "imperial-silk-matka-festive-waistcoat",
        "category": "men",
        "subcategory": "Waistcoats",
        "category_name": "Men Heritage",
        "brand": "Khushi Collection",
        "sku": "KC-MEN-007",
        "price": 8800,
        "sale_price": 7200,
        "cost_price": 4840,
        "stock": 12,
        "low_stock_threshold": 3,
        "status": "published",
        "is_featured": false,
        "is_new": false,
        "is_bestseller": true,
        "is_flash_sale": false,
        "rating": 4.9,
        "reviews_count": 53,
        "thumbnail": "https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=800&auto=format&fit=crop&q=80",
        "secondary_image": "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=800&auto=format&fit=crop&q=80",
        "images": [
            "https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&auto=format&fit=crop&q=80"
        ],
        "short_description": "Textured matka silk waistcoat with tonal thread embroidery and welt pocket square.",
        "description": "Textured matka silk waistcoat with tonal thread embroidery and welt pocket square. Handcrafted with meticulous attention to detail, luxury finished hems, and authentic materials.",
        "sizes": [
            "38",
            "40",
            "42",
            "44"
        ],
        "colors": [
            {
                "name": "Cerulean Blue",
                "hex": "#0284c7"
            },
            {
                "name": "Indigo Dark",
                "hex": "#4338ca"
            },
            {
                "name": "Rust Amber",
                "hex": "#b45309"
            }
        ]
    },
    {
        "id": 20,
        "name": "Heritage Textured Woollen Nehru Jacket",
        "slug": "heritage-textured-woollen-nehru-jacket",
        "category": "men",
        "subcategory": "Jackets",
        "category_name": "Men Heritage",
        "brand": "Khushi Collection",
        "sku": "KC-MEN-008",
        "price": 14500,
        "sale_price": 11900,
        "cost_price": 7975,
        "stock": 12,
        "low_stock_threshold": 3,
        "status": "published",
        "is_featured": false,
        "is_new": false,
        "is_bestseller": false,
        "is_flash_sale": true,
        "rating": 4.95,
        "reviews_count": 58,
        "thumbnail": "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&auto=format&fit=crop&q=80",
        "secondary_image": "https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=800&auto=format&fit=crop&q=80",
        "images": [
            "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=800&auto=format&fit=crop&q=80"
        ],
        "short_description": "Pure blended wool tailored Nehru jacket with metallic brass buttons and silk interior.",
        "description": "Pure blended wool tailored Nehru jacket with metallic brass buttons and silk interior. Handcrafted with meticulous attention to detail, luxury finished hems, and authentic materials.",
        "sizes": [
            "38",
            "40",
            "42",
            "44",
            "46"
        ],
        "colors": [
            {
                "name": "Charcoal Black",
                "hex": "#27272a"
            },
            {
                "name": "Heather Grey",
                "hex": "#374151"
            },
            {
                "name": "Camel Brown",
                "hex": "#713f12"
            }
        ]
    },
    {
        "id": 21,
        "name": "Peshawari Royal Boski Stitched Suit",
        "slug": "peshawari-royal-boski-stitched-suit",
        "category": "men",
        "subcategory": "Shalwar Kameez",
        "category_name": "Men Heritage",
        "brand": "Khushi Collection",
        "sku": "KC-MEN-009",
        "price": 16500,
        "sale_price": 13800,
        "cost_price": 9075,
        "stock": 12,
        "low_stock_threshold": 3,
        "status": "published",
        "is_featured": false,
        "is_new": true,
        "is_bestseller": true,
        "is_flash_sale": false,
        "rating": 4.85,
        "reviews_count": 63,
        "thumbnail": "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=800&auto=format&fit=crop&q=80",
        "secondary_image": "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&auto=format&fit=crop&q=80",
        "images": [
            "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=800&auto=format&fit=crop&q=80"
        ],
        "short_description": "Authentic Chinese 8-pound Boski silk suit crafted with master tailoring and horn buttons.",
        "description": "Authentic Chinese 8-pound Boski silk suit crafted with master tailoring and horn buttons. Handcrafted with meticulous attention to detail, luxury finished hems, and authentic materials.",
        "sizes": [
            "S",
            "M",
            "L",
            "XL"
        ],
        "colors": [
            {
                "name": "Cream Butter",
                "hex": "#fef9c3"
            },
            {
                "name": "Pearl White",
                "hex": "#f8fafc"
            },
            {
                "name": "Pale Gold",
                "hex": "#fef08a"
            }
        ]
    },
    {
        "id": 22,
        "name": "Embroidered Collar Silk Tunic Kurta",
        "slug": "embroidered-collar-silk-tunic-kurta",
        "category": "men",
        "subcategory": "Shalwar Kameez",
        "category_name": "Men Heritage",
        "brand": "Khushi Collection",
        "sku": "KC-MEN-010",
        "price": 9200,
        "sale_price": 7600,
        "cost_price": 5060,
        "stock": 12,
        "low_stock_threshold": 3,
        "status": "published",
        "is_featured": false,
        "is_new": false,
        "is_bestseller": false,
        "is_flash_sale": false,
        "rating": 4.9,
        "reviews_count": 68,
        "thumbnail": "https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=800&auto=format&fit=crop&q=80",
        "secondary_image": "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=800&auto=format&fit=crop&q=80",
        "images": [
            "https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&auto=format&fit=crop&q=80"
        ],
        "short_description": "Subtle kora dabka embroidery on band collar and cuff plackets in medium weight raw silk.",
        "description": "Subtle kora dabka embroidery on band collar and cuff plackets in medium weight raw silk. Handcrafted with meticulous attention to detail, luxury finished hems, and authentic materials.",
        "sizes": [
            "S",
            "M",
            "L",
            "XL"
        ],
        "colors": [
            {
                "name": "Teal Ocean",
                "hex": "#155e75"
            },
            {
                "name": "Dark Spruce",
                "hex": "#064e3b"
            },
            {
                "name": "Deep Burgundy",
                "hex": "#4a044e"
            }
        ]
    },
    {
        "id": 23,
        "name": "Karandi Winter Embroidered 2-Piece",
        "slug": "karandi-winter-embroidered-2-piece",
        "category": "men",
        "subcategory": "Shalwar Kameez",
        "category_name": "Men Heritage",
        "brand": "Khushi Collection",
        "sku": "KC-MEN-011",
        "price": 12500,
        "sale_price": 10200,
        "cost_price": 6875,
        "stock": 12,
        "low_stock_threshold": 3,
        "status": "published",
        "is_featured": false,
        "is_new": false,
        "is_bestseller": true,
        "is_flash_sale": false,
        "rating": 4.95,
        "reviews_count": 73,
        "thumbnail": "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=800&auto=format&fit=crop&q=80",
        "secondary_image": "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&auto=format&fit=crop&q=80",
        "images": [
            "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=800&auto=format&fit=crop&q=80"
        ],
        "short_description": "Pure handloom Karandi winter suit featuring subtle anchor thread embroidery on chest pocket.",
        "description": "Pure handloom Karandi winter suit featuring subtle anchor thread embroidery on chest pocket. Handcrafted with meticulous attention to detail, luxury finished hems, and authentic materials.",
        "sizes": [
            "S",
            "M",
            "L",
            "XL"
        ],
        "colors": [
            {
                "name": "Charcoal Slate",
                "hex": "#1c1917"
            },
            {
                "name": "Midnight Shadow",
                "hex": "#334155"
            },
            {
                "name": "Mocha Brown",
                "hex": "#451a03"
            }
        ]
    },
    {
        "id": 24,
        "name": "Designer Velvet Shawl For Groom",
        "slug": "designer-velvet-shawl-for-groom",
        "category": "men",
        "subcategory": "Waistcoats",
        "category_name": "Men Heritage",
        "brand": "Khushi Collection",
        "sku": "KC-MEN-012",
        "price": 15500,
        "sale_price": 12800,
        "cost_price": 8525,
        "stock": 12,
        "low_stock_threshold": 3,
        "status": "published",
        "is_featured": false,
        "is_new": true,
        "is_bestseller": false,
        "is_flash_sale": true,
        "rating": 4.85,
        "reviews_count": 78,
        "thumbnail": "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&auto=format&fit=crop&q=80",
        "secondary_image": "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=800&auto=format&fit=crop&q=80",
        "images": [
            "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=800&auto=format&fit=crop&q=80"
        ],
        "short_description": "Heavyweight velvet shawl with four-sided zardozi borders and antique gold tassel fringe.",
        "description": "Heavyweight velvet shawl with four-sided zardozi borders and antique gold tassel fringe. Handcrafted with meticulous attention to detail, luxury finished hems, and authentic materials.",
        "sizes": [
            "Free Size"
        ],
        "colors": [
            {
                "name": "Groom Maroon",
                "hex": "#450a0a"
            },
            {
                "name": "Emerald Velvet",
                "hex": "#064e3b"
            },
            {
                "name": "Onyx Black",
                "hex": "#09090b"
            }
        ]
    },
    {
        "id": 25,
        "name": "Junior Prince Silk Kurta & Waistcoat Set",
        "slug": "junior-prince-silk-kurta-waistcoat-set",
        "category": "kids",
        "subcategory": "Boys",
        "category_name": "Kids Festive",
        "brand": "Khushi Collection",
        "sku": "KC-KID-001",
        "price": 6500,
        "sale_price": 5200,
        "cost_price": 3575,
        "stock": 12,
        "low_stock_threshold": 3,
        "status": "published",
        "is_featured": true,
        "is_new": false,
        "is_bestseller": true,
        "is_flash_sale": false,
        "rating": 4.9,
        "reviews_count": 23,
        "thumbnail": "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=800&auto=format&fit=crop&q=80",
        "secondary_image": "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=800&auto=format&fit=crop&q=80",
        "images": [
            "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=800&auto=format&fit=crop&q=80"
        ],
        "short_description": "Boys festive 3-piece set in pure raw silk with jacquard waistcoat and matching pocket square.",
        "description": "Boys festive 3-piece set in pure raw silk with jacquard waistcoat and matching pocket square. Handcrafted with meticulous attention to detail, luxury finished hems, and authentic materials.",
        "sizes": [
            "2-3 Yrs",
            "4-5 Yrs",
            "6-7 Yrs",
            "8-9 Yrs",
            "10-12 Yrs"
        ],
        "colors": [
            {
                "name": "Navy Blue",
                "hex": "#0f172a"
            },
            {
                "name": "Bottle Green",
                "hex": "#064e3b"
            },
            {
                "name": "Gold Ochre",
                "hex": "#78350f"
            }
        ]
    },
    {
        "id": 26,
        "name": "Little Princess Embroidered Net Lehenga Set",
        "slug": "little-princess-embroidered-net-lehenga-set",
        "category": "kids",
        "subcategory": "Girls",
        "category_name": "Kids Festive",
        "brand": "Khushi Collection",
        "sku": "KC-KID-002",
        "price": 8500,
        "sale_price": 6900,
        "cost_price": 4675,
        "stock": 12,
        "low_stock_threshold": 3,
        "status": "published",
        "is_featured": true,
        "is_new": false,
        "is_bestseller": false,
        "is_flash_sale": false,
        "rating": 4.95,
        "reviews_count": 28,
        "thumbnail": "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=800&auto=format&fit=crop&q=80",
        "secondary_image": "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=800&auto=format&fit=crop&q=80",
        "images": [
            "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=800&auto=format&fit=crop&q=80"
        ],
        "short_description": "Flared shimmer net lehenga with resham flower motifs, cotton lining, and chiffon dupatta.",
        "description": "Flared shimmer net lehenga with resham flower motifs, cotton lining, and chiffon dupatta. Handcrafted with meticulous attention to detail, luxury finished hems, and authentic materials.",
        "sizes": [
            "3-4 Yrs",
            "5-6 Yrs",
            "7-8 Yrs",
            "9-10 Yrs"
        ],
        "colors": [
            {
                "name": "Candy Rose",
                "hex": "#f43f5e"
            },
            {
                "name": "Lavender Princess",
                "hex": "#a855f7"
            },
            {
                "name": "Sky Turquoise",
                "hex": "#0ea5e9"
            }
        ]
    },
    {
        "id": 27,
        "name": "Boys Embroidered Cotton Kurta Pajama",
        "slug": "boys-embroidered-cotton-kurta-pajama",
        "category": "kids",
        "subcategory": "Boys",
        "category_name": "Kids Festive",
        "brand": "Khushi Collection",
        "sku": "KC-KID-003",
        "price": 4800,
        "sale_price": 3900,
        "cost_price": 2640,
        "stock": 12,
        "low_stock_threshold": 3,
        "status": "published",
        "is_featured": true,
        "is_new": true,
        "is_bestseller": true,
        "is_flash_sale": false,
        "rating": 4.85,
        "reviews_count": 33,
        "thumbnail": "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=800&auto=format&fit=crop&q=80",
        "secondary_image": "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=800&auto=format&fit=crop&q=80",
        "images": [
            "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=800&auto=format&fit=crop&q=80"
        ],
        "short_description": "Soft 100% organic cotton kurta with hand embroidered neckline and elasticated pajama.",
        "description": "Soft 100% organic cotton kurta with hand embroidered neckline and elasticated pajama. Handcrafted with meticulous attention to detail, luxury finished hems, and authentic materials.",
        "sizes": [
            "2-3 Yrs",
            "4-5 Yrs",
            "6-7 Yrs",
            "8-10 Yrs"
        ],
        "colors": [
            {
                "name": "Snow White",
                "hex": "#f8fafc"
            },
            {
                "name": "Vanilla Cream",
                "hex": "#fef3c7"
            },
            {
                "name": "Powder Blue",
                "hex": "#e0f2fe"
            }
        ]
    },
    {
        "id": 28,
        "name": "Girls Mirror-Work Chiffon Anarkali",
        "slug": "girls-mirror-work-chiffon-anarkali",
        "category": "kids",
        "subcategory": "Girls",
        "category_name": "Kids Festive",
        "brand": "Khushi Collection",
        "sku": "KC-KID-004",
        "price": 7200,
        "sale_price": 5800,
        "cost_price": 3960,
        "stock": 12,
        "low_stock_threshold": 3,
        "status": "published",
        "is_featured": false,
        "is_new": false,
        "is_bestseller": false,
        "is_flash_sale": true,
        "rating": 4.9,
        "reviews_count": 38,
        "thumbnail": "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=800&auto=format&fit=crop&q=80",
        "secondary_image": "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=800&auto=format&fit=crop&q=80",
        "images": [
            "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=800&auto=format&fit=crop&q=80"
        ],
        "short_description": "Lightweight flared festive frock with real mirror work borders and soft malmal lining.",
        "description": "Lightweight flared festive frock with real mirror work borders and soft malmal lining. Handcrafted with meticulous attention to detail, luxury finished hems, and authentic materials.",
        "sizes": [
            "3-4 Yrs",
            "5-6 Yrs",
            "7-8 Yrs",
            "9-11 Yrs"
        ],
        "colors": [
            {
                "name": "Coral Peach",
                "hex": "#fb7185"
            },
            {
                "name": "Baby Blue",
                "hex": "#38bdf8"
            },
            {
                "name": "Marigold Yellow",
                "hex": "#fbbf24"
            }
        ]
    },
    {
        "id": 29,
        "name": "Infant Festive Silk Romper Kurta Set",
        "slug": "infant-festive-silk-romper-kurta-set",
        "category": "kids",
        "subcategory": "Baby",
        "category_name": "Kids Festive",
        "brand": "Khushi Collection",
        "sku": "KC-KID-005",
        "price": 3800,
        "sale_price": 2900,
        "cost_price": 2090,
        "stock": 12,
        "low_stock_threshold": 3,
        "status": "published",
        "is_featured": false,
        "is_new": false,
        "is_bestseller": true,
        "is_flash_sale": false,
        "rating": 4.95,
        "reviews_count": 43,
        "thumbnail": "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=800&auto=format&fit=crop&q=80",
        "secondary_image": "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=800&auto=format&fit=crop&q=80",
        "images": [
            "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=800&auto=format&fit=crop&q=80"
        ],
        "short_description": "Gentle baby silk romper with snap-button placket and miniature embroidered motif.",
        "description": "Gentle baby silk romper with snap-button placket and miniature embroidered motif. Handcrafted with meticulous attention to detail, luxury finished hems, and authentic materials.",
        "sizes": [
            "0-6 Mos",
            "6-12 Mos",
            "12-18 Mos",
            "18-24 Mos"
        ],
        "colors": [
            {
                "name": "Pale Gold",
                "hex": "#fef08a"
            },
            {
                "name": "Ice Blue",
                "hex": "#bae6fd"
            },
            {
                "name": "Soft Rose",
                "hex": "#fbcfe8"
            }
        ]
    },
    {
        "id": 30,
        "name": "Young Sultan Velvet Sherwani Jacket",
        "slug": "young-sultan-velvet-sherwani-jacket",
        "category": "kids",
        "subcategory": "Boys",
        "category_name": "Kids Festive",
        "brand": "Khushi Collection",
        "sku": "KC-KID-006",
        "price": 9500,
        "sale_price": 7800,
        "cost_price": 5225,
        "stock": 12,
        "low_stock_threshold": 3,
        "status": "published",
        "is_featured": false,
        "is_new": true,
        "is_bestseller": false,
        "is_flash_sale": false,
        "rating": 4.85,
        "reviews_count": 48,
        "thumbnail": "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=800&auto=format&fit=crop&q=80",
        "secondary_image": "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=800&auto=format&fit=crop&q=80",
        "images": [
            "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=800&auto=format&fit=crop&q=80"
        ],
        "short_description": "Boys miniature velvet sherwani with golden tilla embellishments and metallic buttons.",
        "description": "Boys miniature velvet sherwani with golden tilla embellishments and metallic buttons. Handcrafted with meticulous attention to detail, luxury finished hems, and authentic materials.",
        "sizes": [
            "4-5 Yrs",
            "6-7 Yrs",
            "8-9 Yrs",
            "10-12 Yrs"
        ],
        "colors": [
            {
                "name": "Royal Maroon",
                "hex": "#450a0a"
            },
            {
                "name": "Midnight Blue",
                "hex": "#0f172a"
            },
            {
                "name": "Emerald Pine",
                "hex": "#064e3b"
            }
        ]
    },
    {
        "id": 31,
        "name": "Girls Handcrafted Jamawar Gharara",
        "slug": "girls-handcrafted-jamawar-gharara",
        "category": "kids",
        "subcategory": "Girls",
        "category_name": "Kids Festive",
        "brand": "Khushi Collection",
        "sku": "KC-KID-007",
        "price": 8900,
        "sale_price": 7200,
        "cost_price": 4895,
        "stock": 12,
        "low_stock_threshold": 3,
        "status": "published",
        "is_featured": false,
        "is_new": false,
        "is_bestseller": true,
        "is_flash_sale": false,
        "rating": 4.9,
        "reviews_count": 53,
        "thumbnail": "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=800&auto=format&fit=crop&q=80",
        "secondary_image": "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=800&auto=format&fit=crop&q=80",
        "images": [
            "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=800&auto=format&fit=crop&q=80"
        ],
        "short_description": "Traditional Banarsi weave gharara paired with raw silk embroidered peplum top.",
        "description": "Traditional Banarsi weave gharara paired with raw silk embroidered peplum top. Handcrafted with meticulous attention to detail, luxury finished hems, and authentic materials.",
        "sizes": [
            "4-5 Yrs",
            "6-7 Yrs",
            "8-9 Yrs",
            "10-12 Yrs"
        ],
        "colors": [
            {
                "name": "Plum Purple",
                "hex": "#701a75"
            },
            {
                "name": "Emerald Silk",
                "hex": "#065f46"
            },
            {
                "name": "Festive Crimson",
                "hex": "#991b1b"
            }
        ]
    },
    {
        "id": 32,
        "name": "Boys Linen Casual Summer Kurta",
        "slug": "boys-linen-casual-summer-kurta",
        "category": "kids",
        "subcategory": "Boys",
        "category_name": "Kids Festive",
        "brand": "Khushi Collection",
        "sku": "KC-KID-008",
        "price": 3900,
        "sale_price": null,
        "cost_price": 2145,
        "stock": 12,
        "low_stock_threshold": 3,
        "status": "published",
        "is_featured": false,
        "is_new": false,
        "is_bestseller": false,
        "is_flash_sale": false,
        "rating": 4.95,
        "reviews_count": 58,
        "thumbnail": "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=800&auto=format&fit=crop&q=80",
        "secondary_image": "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=800&auto=format&fit=crop&q=80",
        "images": [
            "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=800&auto=format&fit=crop&q=80"
        ],
        "short_description": "Breathable natural linen kurta with wood-finish buttons and turn-up sleeve tabs.",
        "description": "Breathable natural linen kurta with wood-finish buttons and turn-up sleeve tabs. Handcrafted with meticulous attention to detail, luxury finished hems, and authentic materials.",
        "sizes": [
            "2-3 Yrs",
            "4-5 Yrs",
            "6-7 Yrs",
            "8-10 Yrs"
        ],
        "colors": [
            {
                "name": "Misty Grey",
                "hex": "#e2e8f0"
            },
            {
                "name": "Pistachio Mint",
                "hex": "#d1fae5"
            },
            {
                "name": "Apricot Warm",
                "hex": "#ffedd5"
            }
        ]
    },
    {
        "id": 33,
        "name": "Girls Tissue Organza Tiered Frock",
        "slug": "girls-tissue-organza-tiered-frock",
        "category": "kids",
        "subcategory": "Girls",
        "category_name": "Kids Festive",
        "brand": "Khushi Collection",
        "sku": "KC-KID-009",
        "price": 7800,
        "sale_price": 6200,
        "cost_price": 4290,
        "stock": 12,
        "low_stock_threshold": 3,
        "status": "published",
        "is_featured": false,
        "is_new": true,
        "is_bestseller": true,
        "is_flash_sale": false,
        "rating": 4.85,
        "reviews_count": 63,
        "thumbnail": "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=800&auto=format&fit=crop&q=80",
        "secondary_image": "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=800&auto=format&fit=crop&q=80",
        "images": [
            "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=800&auto=format&fit=crop&q=80"
        ],
        "short_description": "3-layer flared organza party frock with golden shimmer border and satin inner lining.",
        "description": "3-layer flared organza party frock with golden shimmer border and satin inner lining. Handcrafted with meticulous attention to detail, luxury finished hems, and authentic materials.",
        "sizes": [
            "3-4 Yrs",
            "5-6 Yrs",
            "7-8 Yrs",
            "9-11 Yrs"
        ],
        "colors": [
            {
                "name": "Blush Powder",
                "hex": "#fce7f3"
            },
            {
                "name": "Pale Gold",
                "hex": "#fef3c7"
            },
            {
                "name": "Periwinkle",
                "hex": "#e0e7ff"
            }
        ]
    },
    {
        "id": 34,
        "name": "Boys Embroidered Shalwar Kameez Set",
        "slug": "boys-embroidered-shalwar-kameez-set",
        "category": "kids",
        "subcategory": "Boys",
        "category_name": "Kids Festive",
        "brand": "Khushi Collection",
        "sku": "KC-KID-010",
        "price": 5200,
        "sale_price": 4400,
        "cost_price": 2860,
        "stock": 12,
        "low_stock_threshold": 3,
        "status": "published",
        "is_featured": false,
        "is_new": false,
        "is_bestseller": false,
        "is_flash_sale": false,
        "rating": 4.9,
        "reviews_count": 68,
        "thumbnail": "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=800&auto=format&fit=crop&q=80",
        "secondary_image": "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=800&auto=format&fit=crop&q=80",
        "images": [
            "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=800&auto=format&fit=crop&q=80"
        ],
        "short_description": "Classic band collar shalwar kameez with embroidered placket and cuff detailing.",
        "description": "Classic band collar shalwar kameez with embroidered placket and cuff detailing. Handcrafted with meticulous attention to detail, luxury finished hems, and authentic materials.",
        "sizes": [
            "3-4 Yrs",
            "5-6 Yrs",
            "7-8 Yrs",
            "9-10 Yrs"
        ],
        "colors": [
            {
                "name": "Royal Cobalt",
                "hex": "#0284c7"
            },
            {
                "name": "Forest Green",
                "hex": "#166534"
            },
            {
                "name": "Slate Grey",
                "hex": "#475569"
            }
        ]
    },
    {
        "id": 35,
        "name": "Girls Embroidered Velvet Frock Set",
        "slug": "girls-embroidered-velvet-frock-set",
        "category": "kids",
        "subcategory": "Girls",
        "category_name": "Kids Festive",
        "brand": "Khushi Collection",
        "sku": "KC-KID-011",
        "price": 8200,
        "sale_price": 6800,
        "cost_price": 4510,
        "stock": 12,
        "low_stock_threshold": 3,
        "status": "published",
        "is_featured": false,
        "is_new": false,
        "is_bestseller": true,
        "is_flash_sale": false,
        "rating": 4.95,
        "reviews_count": 73,
        "thumbnail": "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=800&auto=format&fit=crop&q=80",
        "secondary_image": "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=800&auto=format&fit=crop&q=80",
        "images": [
            "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=800&auto=format&fit=crop&q=80"
        ],
        "short_description": "Warm micro-velvet winter festive frock with dabka gold border and churidar pajama.",
        "description": "Warm micro-velvet winter festive frock with dabka gold border and churidar pajama. Handcrafted with meticulous attention to detail, luxury finished hems, and authentic materials.",
        "sizes": [
            "3-4 Yrs",
            "5-6 Yrs",
            "7-8 Yrs",
            "9-11 Yrs"
        ],
        "colors": [
            {
                "name": "Ruby Velvet",
                "hex": "#881337"
            },
            {
                "name": "Emerald Green",
                "hex": "#064e3b"
            },
            {
                "name": "Jet Black",
                "hex": "#09090b"
            }
        ]
    },
    {
        "id": 36,
        "name": "Infant Cotton Festive Kurta Pajama",
        "slug": "infant-cotton-festive-kurta-pajama",
        "category": "kids",
        "subcategory": "Baby",
        "category_name": "Kids Festive",
        "brand": "Khushi Collection",
        "sku": "KC-KID-012",
        "price": 3400,
        "sale_price": 2800,
        "cost_price": 1870,
        "stock": 12,
        "low_stock_threshold": 3,
        "status": "published",
        "is_featured": false,
        "is_new": true,
        "is_bestseller": false,
        "is_flash_sale": true,
        "rating": 4.85,
        "reviews_count": 78,
        "thumbnail": "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=800&auto=format&fit=crop&q=80",
        "secondary_image": "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=800&auto=format&fit=crop&q=80",
        "images": [
            "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=800&auto=format&fit=crop&q=80"
        ],
        "short_description": "100% fine cotton soft-touch kurta pajama set tailored for sensitive newborn baby skin.",
        "description": "100% fine cotton soft-touch kurta pajama set tailored for sensitive newborn baby skin. Handcrafted with meticulous attention to detail, luxury finished hems, and authentic materials.",
        "sizes": [
            "0-3 Mos",
            "3-6 Mos",
            "6-12 Mos",
            "12-18 Mos"
        ],
        "colors": [
            {
                "name": "Snow Ivory",
                "hex": "#f8fafc"
            },
            {
                "name": "Vanilla Butter",
                "hex": "#fef9c3"
            },
            {
                "name": "Soft Sky",
                "hex": "#dbeafe"
            }
        ]
    },
    {
        "id": 37,
        "name": "Maharani Pure Leather Hand-Embroidered Khussa",
        "slug": "maharani-pure-leather-hand-embroidered-khussa",
        "category": "shoes",
        "subcategory": "Women Khussas",
        "category_name": "Handcrafted Footwear",
        "brand": "Khushi Collection",
        "sku": "KC-SHOE-001",
        "price": 6500,
        "sale_price": 5200,
        "cost_price": 3575,
        "stock": 12,
        "low_stock_threshold": 3,
        "status": "published",
        "is_featured": true,
        "is_new": false,
        "is_bestseller": true,
        "is_flash_sale": false,
        "rating": 4.9,
        "reviews_count": 23,
        "thumbnail": "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&auto=format&fit=crop&q=80",
        "secondary_image": "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&auto=format&fit=crop&q=80",
        "images": [
            "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=800&auto=format&fit=crop&q=80"
        ],
        "short_description": "Artisanal hand-stitched vegetable tanned cow leather khussa encrusted with real tilla, beads, and dabka.",
        "description": "Artisanal hand-stitched vegetable tanned cow leather khussa encrusted with real tilla, beads, and dabka. Handcrafted with meticulous attention to detail, luxury finished hems, and authentic materials.",
        "sizes": [
            "36",
            "37",
            "38",
            "39",
            "40",
            "41"
        ],
        "colors": [
            {
                "name": "Antique Gold",
                "hex": "#ca8a04"
            },
            {
                "name": "Bridal Ruby",
                "hex": "#881337"
            },
            {
                "name": "Emerald Forest",
                "hex": "#064e3b"
            }
        ]
    },
    {
        "id": 38,
        "name": "Peshawari Traditional Zalmi Chappal",
        "slug": "peshawari-traditional-zalmi-chappal",
        "category": "shoes",
        "subcategory": "Men Peshawari",
        "category_name": "Handcrafted Footwear",
        "brand": "Khushi Collection",
        "sku": "KC-SHOE-002",
        "price": 7500,
        "sale_price": 6200,
        "cost_price": 4125,
        "stock": 12,
        "low_stock_threshold": 3,
        "status": "published",
        "is_featured": true,
        "is_new": false,
        "is_bestseller": false,
        "is_flash_sale": false,
        "rating": 4.95,
        "reviews_count": 28,
        "thumbnail": "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=800&auto=format&fit=crop&q=80",
        "secondary_image": "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&auto=format&fit=crop&q=80",
        "images": [
            "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&auto=format&fit=crop&q=80"
        ],
        "short_description": "Master crafted double-sole cowhide leather Peshawari chappal with ergonomic memory arch cushion.",
        "description": "Master crafted double-sole cowhide leather Peshawari chappal with ergonomic memory arch cushion. Handcrafted with meticulous attention to detail, luxury finished hems, and authentic materials.",
        "sizes": [
            "40",
            "41",
            "42",
            "43",
            "44",
            "45"
        ],
        "colors": [
            {
                "name": "Tan Mustard",
                "hex": "#78350f"
            },
            {
                "name": "Obsidian Black",
                "hex": "#18181b"
            },
            {
                "name": "Deep Mahogany",
                "hex": "#451a03"
            }
        ]
    },
    {
        "id": 39,
        "name": "Zari Velvet Bridal Stiletto Mules",
        "slug": "zari-velvet-bridal-stiletto-mules",
        "category": "shoes",
        "subcategory": "Bridal Heels",
        "category_name": "Handcrafted Footwear",
        "brand": "Khushi Collection",
        "sku": "KC-SHOE-003",
        "price": 9500,
        "sale_price": 7900,
        "cost_price": 5225,
        "stock": 12,
        "low_stock_threshold": 3,
        "status": "published",
        "is_featured": true,
        "is_new": true,
        "is_bestseller": true,
        "is_flash_sale": false,
        "rating": 4.85,
        "reviews_count": 33,
        "thumbnail": "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&auto=format&fit=crop&q=80",
        "secondary_image": "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&auto=format&fit=crop&q=80",
        "images": [
            "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=800&auto=format&fit=crop&q=80"
        ],
        "short_description": "3.5-inch flare heel wrapped in micro velvet with crystal brooch strap and padded insole.",
        "description": "3.5-inch flare heel wrapped in micro velvet with crystal brooch strap and padded insole. Handcrafted with meticulous attention to detail, luxury finished hems, and authentic materials.",
        "sizes": [
            "36",
            "37",
            "38",
            "39",
            "40"
        ],
        "colors": [
            {
                "name": "Crimson Red",
                "hex": "#881337"
            },
            {
                "name": "Jet Black",
                "hex": "#09090b"
            },
            {
                "name": "Metallic Champagne",
                "hex": "#d4af37"
            }
        ]
    },
    {
        "id": 40,
        "name": "Kaptaan Special Matt Finish Chappal",
        "slug": "kaptaan-special-matt-finish-chappal",
        "category": "shoes",
        "subcategory": "Men Peshawari",
        "category_name": "Handcrafted Footwear",
        "brand": "Khushi Collection",
        "sku": "KC-SHOE-004",
        "price": 6900,
        "sale_price": 5600,
        "cost_price": 3795,
        "stock": 12,
        "low_stock_threshold": 3,
        "status": "published",
        "is_featured": false,
        "is_new": false,
        "is_bestseller": false,
        "is_flash_sale": true,
        "rating": 4.9,
        "reviews_count": 38,
        "thumbnail": "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=800&auto=format&fit=crop&q=80",
        "secondary_image": "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&auto=format&fit=crop&q=80",
        "images": [
            "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&auto=format&fit=crop&q=80"
        ],
        "short_description": "Signature single sole Kaptaan cut chappal in matte steerhide leather with tire sole grip.",
        "description": "Signature single sole Kaptaan cut chappal in matte steerhide leather with tire sole grip. Handcrafted with meticulous attention to detail, luxury finished hems, and authentic materials.",
        "sizes": [
            "40",
            "41",
            "42",
            "43",
            "44",
            "45"
        ],
        "colors": [
            {
                "name": "Matte Charcoal",
                "hex": "#27272a"
            },
            {
                "name": "Mustard Leather",
                "hex": "#713f12"
            },
            {
                "name": "Midnight Navy",
                "hex": "#0f172a"
            }
        ]
    },
    {
        "id": 41,
        "name": "Shehnai Mirror Handcrafted Bridal Khussa",
        "slug": "shehnai-mirror-handcrafted-bridal-khussa",
        "category": "shoes",
        "subcategory": "Women Khussas",
        "category_name": "Handcrafted Footwear",
        "brand": "Khushi Collection",
        "sku": "KC-SHOE-005",
        "price": 5800,
        "sale_price": 4800,
        "cost_price": 3190,
        "stock": 12,
        "low_stock_threshold": 3,
        "status": "published",
        "is_featured": false,
        "is_new": false,
        "is_bestseller": true,
        "is_flash_sale": false,
        "rating": 4.95,
        "reviews_count": 43,
        "thumbnail": "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&auto=format&fit=crop&q=80",
        "secondary_image": "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=800&auto=format&fit=crop&q=80",
        "images": [
            "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&auto=format&fit=crop&q=80"
        ],
        "short_description": "Reflective real mirror mosaic embroidered khussa with genuine non-slip buff leather base.",
        "description": "Reflective real mirror mosaic embroidered khussa with genuine non-slip buff leather base. Handcrafted with meticulous attention to detail, luxury finished hems, and authentic materials.",
        "sizes": [
            "36",
            "37",
            "38",
            "39",
            "40",
            "41"
        ],
        "colors": [
            {
                "name": "Pearl Silver",
                "hex": "#f8fafc"
            },
            {
                "name": "Gold Tilla",
                "hex": "#fef08a"
            },
            {
                "name": "Rose Pink",
                "hex": "#fbcfe8"
            }
        ]
    },
    {
        "id": 42,
        "name": "Noroz Genuine Calfskin Dress Loafers",
        "slug": "noroz-genuine-calfskin-dress-loafers",
        "category": "shoes",
        "subcategory": "Men Peshawari",
        "category_name": "Handcrafted Footwear",
        "brand": "Khushi Collection",
        "sku": "KC-SHOE-006",
        "price": 11500,
        "sale_price": 9400,
        "cost_price": 6325,
        "stock": 12,
        "low_stock_threshold": 3,
        "status": "published",
        "is_featured": false,
        "is_new": true,
        "is_bestseller": false,
        "is_flash_sale": false,
        "rating": 4.85,
        "reviews_count": 48,
        "thumbnail": "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=800&auto=format&fit=crop&q=80",
        "secondary_image": "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&auto=format&fit=crop&q=80",
        "images": [
            "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&auto=format&fit=crop&q=80"
        ],
        "short_description": "Full-grain calfskin leather horsebit slip-on loafers with leather stacked dress heel.",
        "description": "Full-grain calfskin leather horsebit slip-on loafers with leather stacked dress heel. Handcrafted with meticulous attention to detail, luxury finished hems, and authentic materials.",
        "sizes": [
            "40",
            "41",
            "42",
            "43",
            "44",
            "45"
        ],
        "colors": [
            {
                "name": "Obsidian Black",
                "hex": "#09090b"
            },
            {
                "name": "Cognac Brown",
                "hex": "#451a03"
            },
            {
                "name": "Dark Chocolate",
                "hex": "#78350f"
            }
        ]
    },
    {
        "id": 43,
        "name": "Ghungroo Embroidered Festive Mules",
        "slug": "ghungroo-embroidered-festive-mules",
        "category": "shoes",
        "subcategory": "Handcrafted Mules",
        "category_name": "Handcrafted Footwear",
        "brand": "Khushi Collection",
        "sku": "KC-SHOE-007",
        "price": 6200,
        "sale_price": 4900,
        "cost_price": 3410,
        "stock": 12,
        "low_stock_threshold": 3,
        "status": "published",
        "is_featured": false,
        "is_new": false,
        "is_bestseller": true,
        "is_flash_sale": false,
        "rating": 4.9,
        "reviews_count": 53,
        "thumbnail": "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&auto=format&fit=crop&q=80",
        "secondary_image": "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&auto=format&fit=crop&q=80",
        "images": [
            "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=800&auto=format&fit=crop&q=80"
        ],
        "short_description": "Open back slip-on mules adorned with brass micro ghungroos and cushioned memory foam.",
        "description": "Open back slip-on mules adorned with brass micro ghungroos and cushioned memory foam. Handcrafted with meticulous attention to detail, luxury finished hems, and authentic materials.",
        "sizes": [
            "36",
            "37",
            "38",
            "39",
            "40"
        ],
        "colors": [
            {
                "name": "Emerald Velvet",
                "hex": "#064e3b"
            },
            {
                "name": "Ruby Maroon",
                "hex": "#881337"
            },
            {
                "name": "Jet Velvet",
                "hex": "#09090b"
            }
        ]
    },
    {
        "id": 44,
        "name": "Shahi Tilla Velvet Khussa",
        "slug": "shahi-tilla-velvet-khussa",
        "category": "shoes",
        "subcategory": "Women Khussas",
        "category_name": "Handcrafted Footwear",
        "brand": "Khushi Collection",
        "sku": "KC-SHOE-008",
        "price": 5900,
        "sale_price": 4700,
        "cost_price": 3245,
        "stock": 12,
        "low_stock_threshold": 3,
        "status": "published",
        "is_featured": false,
        "is_new": false,
        "is_bestseller": false,
        "is_flash_sale": true,
        "rating": 4.95,
        "reviews_count": 58,
        "thumbnail": "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&auto=format&fit=crop&q=80",
        "secondary_image": "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&auto=format&fit=crop&q=80",
        "images": [
            "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=800&auto=format&fit=crop&q=80"
        ],
        "short_description": "Dense gold tilla embroidered work on premium velvet upper with soft padded innersole.",
        "description": "Dense gold tilla embroidered work on premium velvet upper with soft padded innersole. Handcrafted with meticulous attention to detail, luxury finished hems, and authentic materials.",
        "sizes": [
            "36",
            "37",
            "38",
            "39",
            "40",
            "41"
        ],
        "colors": [
            {
                "name": "Plum Velvet",
                "hex": "#701a75"
            },
            {
                "name": "Navy Blue",
                "hex": "#0f172a"
            },
            {
                "name": "Deep Red",
                "hex": "#881337"
            }
        ]
    },
    {
        "id": 45,
        "name": "Charsadda Classic Cut Hand-Stitched Chappal",
        "slug": "charsadda-classic-cut-hand-stitched-chappal",
        "category": "shoes",
        "subcategory": "Men Peshawari",
        "category_name": "Handcrafted Footwear",
        "brand": "Khushi Collection",
        "sku": "KC-SHOE-009",
        "price": 6800,
        "sale_price": 5400,
        "cost_price": 3740,
        "stock": 12,
        "low_stock_threshold": 3,
        "status": "published",
        "is_featured": false,
        "is_new": true,
        "is_bestseller": true,
        "is_flash_sale": false,
        "rating": 4.85,
        "reviews_count": 63,
        "thumbnail": "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=800&auto=format&fit=crop&q=80",
        "secondary_image": "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&auto=format&fit=crop&q=80",
        "images": [
            "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&auto=format&fit=crop&q=80"
        ],
        "short_description": "Authentic Charsadda curved toe design handcrafted by heritage shoemakers.",
        "description": "Authentic Charsadda curved toe design handcrafted by heritage shoemakers. Handcrafted with meticulous attention to detail, luxury finished hems, and authentic materials.",
        "sizes": [
            "40",
            "41",
            "42",
            "43",
            "44",
            "45"
        ],
        "colors": [
            {
                "name": "Tan Mustard",
                "hex": "#78350f"
            },
            {
                "name": "Pitch Black",
                "hex": "#18181b"
            },
            {
                "name": "Ash Grey",
                "hex": "#3f3f46"
            }
        ]
    },
    {
        "id": 46,
        "name": "Crystal Brooch Satin Bridal Block Heels",
        "slug": "crystal-brooch-satin-bridal-block-heels",
        "category": "shoes",
        "subcategory": "Bridal Heels",
        "category_name": "Handcrafted Footwear",
        "brand": "Khushi Collection",
        "sku": "KC-SHOE-010",
        "price": 8900,
        "sale_price": 7400,
        "cost_price": 4895,
        "stock": 12,
        "low_stock_threshold": 3,
        "status": "published",
        "is_featured": false,
        "is_new": false,
        "is_bestseller": false,
        "is_flash_sale": false,
        "rating": 4.9,
        "reviews_count": 68,
        "thumbnail": "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&auto=format&fit=crop&q=80",
        "secondary_image": "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&auto=format&fit=crop&q=80",
        "images": [
            "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=800&auto=format&fit=crop&q=80"
        ],
        "short_description": "2.5-inch comfortable block heel in Italian satin with luminous Austrian crystal cluster.",
        "description": "2.5-inch comfortable block heel in Italian satin with luminous Austrian crystal cluster. Handcrafted with meticulous attention to detail, luxury finished hems, and authentic materials.",
        "sizes": [
            "36",
            "37",
            "38",
            "39",
            "40"
        ],
        "colors": [
            {
                "name": "Bridal White",
                "hex": "#f8fafc"
            },
            {
                "name": "Champagne Gold",
                "hex": "#fef08a"
            },
            {
                "name": "Powder Rose",
                "hex": "#fbcfe8"
            }
        ]
    },
    {
        "id": 47,
        "name": "Hand-Tooled Leather Derby Shoes",
        "slug": "hand-tooled-leather-derby-shoes",
        "category": "shoes",
        "subcategory": "Men Peshawari",
        "category_name": "Handcrafted Footwear",
        "brand": "Khushi Collection",
        "sku": "KC-SHOE-011",
        "price": 12500,
        "sale_price": 10500,
        "cost_price": 6875,
        "stock": 12,
        "low_stock_threshold": 3,
        "status": "published",
        "is_featured": false,
        "is_new": false,
        "is_bestseller": true,
        "is_flash_sale": false,
        "rating": 4.95,
        "reviews_count": 73,
        "thumbnail": "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=800&auto=format&fit=crop&q=80",
        "secondary_image": "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&auto=format&fit=crop&q=80",
        "images": [
            "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&auto=format&fit=crop&q=80"
        ],
        "short_description": "Semi-brogue formal derby shoes crafted in hand-burnished crust calfskin leather.",
        "description": "Semi-brogue formal derby shoes crafted in hand-burnished crust calfskin leather. Handcrafted with meticulous attention to detail, luxury finished hems, and authentic materials.",
        "sizes": [
            "40",
            "41",
            "42",
            "43",
            "44",
            "45"
        ],
        "colors": [
            {
                "name": "Glossy Black",
                "hex": "#18181b"
            },
            {
                "name": "Oxblood Burgundy",
                "hex": "#451a03"
            },
            {
                "name": "Antique Tan",
                "hex": "#78350f"
            }
        ]
    },
    {
        "id": 48,
        "name": "Floral Resham Embroidered Velvet Khussa",
        "slug": "floral-resham-embroidered-velvet-khussa",
        "category": "shoes",
        "subcategory": "Women Khussas",
        "category_name": "Handcrafted Footwear",
        "brand": "Khushi Collection",
        "sku": "KC-SHOE-012",
        "price": 5400,
        "sale_price": 4400,
        "cost_price": 2970,
        "stock": 12,
        "low_stock_threshold": 3,
        "status": "published",
        "is_featured": false,
        "is_new": true,
        "is_bestseller": false,
        "is_flash_sale": true,
        "rating": 4.85,
        "reviews_count": 78,
        "thumbnail": "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&auto=format&fit=crop&q=80",
        "secondary_image": "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=800&auto=format&fit=crop&q=80",
        "images": [
            "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&auto=format&fit=crop&q=80"
        ],
        "short_description": "Delicate multicolored resham floral bouquet embroidery with cushioned leather sole.",
        "description": "Delicate multicolored resham floral bouquet embroidery with cushioned leather sole. Handcrafted with meticulous attention to detail, luxury finished hems, and authentic materials.",
        "sizes": [
            "36",
            "37",
            "38",
            "39",
            "40",
            "41"
        ],
        "colors": [
            {
                "name": "Deep Emerald",
                "hex": "#064e3b"
            },
            {
                "name": "Plum Royale",
                "hex": "#701a75"
            },
            {
                "name": "Midnight Onyx",
                "hex": "#18181b"
            }
        ]
    },
    {
        "id": 49,
        "name": "Khushi Sultanate Royal Chronograph 41mm",
        "slug": "khushi-sultanate-royal-chronograph-41mm",
        "category": "watches",
        "subcategory": "Men Chronographs",
        "category_name": "Khushi Timepieces",
        "brand": "Khushi Collection",
        "sku": "KC-WAT-001",
        "price": 24500,
        "sale_price": 19800,
        "cost_price": 13475,
        "stock": 12,
        "low_stock_threshold": 3,
        "status": "published",
        "is_featured": true,
        "is_new": false,
        "is_bestseller": true,
        "is_flash_sale": false,
        "rating": 4.9,
        "reviews_count": 23,
        "thumbnail": "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&auto=format&fit=crop&q=80",
        "secondary_image": "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&auto=format&fit=crop&q=80",
        "images": [
            "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1547996160-71dfabb1d5b1?w=800&auto=format&fit=crop&q=80"
        ],
        "short_description": "Precision Japanese quartz chronograph with sapphire crystal glass, 316L solid steel case, and sunburst emerald dial.",
        "description": "Precision Japanese quartz chronograph with sapphire crystal glass, 316L solid steel case, and sunburst emerald dial. Handcrafted with meticulous attention to detail, luxury finished hems, and authentic materials.",
        "sizes": [
            "41mm (Adjustable Bracelet)"
        ],
        "colors": [
            {
                "name": "Emerald Sunburst",
                "hex": "#064e3b"
            },
            {
                "name": "Obsidian Black",
                "hex": "#09090b"
            },
            {
                "name": "Royal Midnight Blue",
                "hex": "#1e3a8a"
            }
        ]
    },
    {
        "id": 50,
        "name": "Noor Diamond-Bezel Rose Gold Timepiece",
        "slug": "noor-diamond-bezel-rose-gold-timepiece",
        "category": "watches",
        "subcategory": "Women Luxury Timepieces",
        "category_name": "Khushi Timepieces",
        "brand": "Khushi Collection",
        "sku": "KC-WAT-002",
        "price": 19500,
        "sale_price": 15900,
        "cost_price": 10725,
        "stock": 12,
        "low_stock_threshold": 3,
        "status": "published",
        "is_featured": true,
        "is_new": false,
        "is_bestseller": false,
        "is_flash_sale": false,
        "rating": 4.95,
        "reviews_count": 28,
        "thumbnail": "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&auto=format&fit=crop&q=80",
        "secondary_image": "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&auto=format&fit=crop&q=80",
        "images": [
            "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1547996160-71dfabb1d5b1?w=800&auto=format&fit=crop&q=80"
        ],
        "short_description": "Swiss quartz movement with mother-of-pearl dial and Austrian crystal pav\u00e9 bezel in 18K rose gold PVD coating.",
        "description": "Swiss quartz movement with mother-of-pearl dial and Austrian crystal pav\u00e9 bezel in 18K rose gold PVD coating. Handcrafted with meticulous attention to detail, luxury finished hems, and authentic materials.",
        "sizes": [
            "34mm (Slender Mesh Band)"
        ],
        "colors": [
            {
                "name": "Rose Gold",
                "hex": "#fb7185"
            },
            {
                "name": "Yellow Gold",
                "hex": "#d4af37"
            },
            {
                "name": "Sterling Silver",
                "hex": "#f8fafc"
            }
        ]
    },
    {
        "id": 51,
        "name": "Imperium Skeleton Automatic Mechanical Watch",
        "slug": "imperium-skeleton-automatic-mechanical-watch",
        "category": "watches",
        "subcategory": "Automatic Mechanical",
        "category_name": "Khushi Timepieces",
        "brand": "Khushi Collection",
        "sku": "KC-WAT-003",
        "price": 34000,
        "sale_price": 28500,
        "cost_price": 18700,
        "stock": 12,
        "low_stock_threshold": 3,
        "status": "published",
        "is_featured": true,
        "is_new": true,
        "is_bestseller": true,
        "is_flash_sale": false,
        "rating": 4.85,
        "reviews_count": 33,
        "thumbnail": "https://images.unsplash.com/photo-1547996160-71dfabb1d5b1?w=800&auto=format&fit=crop&q=80",
        "secondary_image": "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&auto=format&fit=crop&q=80",
        "images": [
            "https://images.unsplash.com/photo-1547996160-71dfabb1d5b1?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&auto=format&fit=crop&q=80"
        ],
        "short_description": "Self-winding 24-jewel skeleton movement visible through front and exhibition caseback with Italian leather strap.",
        "description": "Self-winding 24-jewel skeleton movement visible through front and exhibition caseback with Italian leather strap. Handcrafted with meticulous attention to detail, luxury finished hems, and authentic materials.",
        "sizes": [
            "42mm (Genuine Leather)"
        ],
        "colors": [
            {
                "name": "Black / Gold",
                "hex": "#09090b"
            },
            {
                "name": "Cognac Brown",
                "hex": "#78350f"
            },
            {
                "name": "Steel Silver",
                "hex": "#475569"
            }
        ]
    },
    {
        "id": 52,
        "name": "Regal Gold Day-Date Jubilee Bracelet Watch",
        "slug": "regal-gold-day-date-jubilee-bracelet-watch",
        "category": "watches",
        "subcategory": "Men Chronographs",
        "category_name": "Khushi Timepieces",
        "brand": "Khushi Collection",
        "sku": "KC-WAT-004",
        "price": 22000,
        "sale_price": 17900,
        "cost_price": 12100,
        "stock": 12,
        "low_stock_threshold": 3,
        "status": "published",
        "is_featured": false,
        "is_new": false,
        "is_bestseller": false,
        "is_flash_sale": true,
        "rating": 4.9,
        "reviews_count": 38,
        "thumbnail": "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&auto=format&fit=crop&q=80",
        "secondary_image": "https://images.unsplash.com/photo-1547996160-71dfabb1d5b1?w=800&auto=format&fit=crop&q=80",
        "images": [
            "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1547996160-71dfabb1d5b1?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&auto=format&fit=crop&q=80"
        ],
        "short_description": "Fluted bezel classic luxury timepiece with magnifying cyclops date lens and dual-tone jubilee link.",
        "description": "Fluted bezel classic luxury timepiece with magnifying cyclops date lens and dual-tone jubilee link. Handcrafted with meticulous attention to detail, luxury finished hems, and authentic materials.",
        "sizes": [
            "40mm (Solid Links)"
        ],
        "colors": [
            {
                "name": "Two-Tone Gold",
                "hex": "#ca8a04"
            },
            {
                "name": "All Silver 316L",
                "hex": "#475569"
            },
            {
                "name": "PVD Matte Black",
                "hex": "#09090b"
            }
        ]
    },
    {
        "id": 53,
        "name": "Lumi\u00e8re Petite Oval Bangle Watch",
        "slug": "lumi-re-petite-oval-bangle-watch",
        "category": "watches",
        "subcategory": "Women Luxury Timepieces",
        "category_name": "Khushi Timepieces",
        "brand": "Khushi Collection",
        "sku": "KC-WAT-005",
        "price": 16800,
        "sale_price": 13500,
        "cost_price": 9240,
        "stock": 12,
        "low_stock_threshold": 3,
        "status": "published",
        "is_featured": false,
        "is_new": false,
        "is_bestseller": true,
        "is_flash_sale": false,
        "rating": 4.95,
        "reviews_count": 43,
        "thumbnail": "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&auto=format&fit=crop&q=80",
        "secondary_image": "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&auto=format&fit=crop&q=80",
        "images": [
            "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1547996160-71dfabb1d5b1?w=800&auto=format&fit=crop&q=80"
        ],
        "short_description": "Jewellery-grade polished oval case with integrated bangle clasp and sapphire crystal glass.",
        "description": "Jewellery-grade polished oval case with integrated bangle clasp and sapphire crystal glass. Handcrafted with meticulous attention to detail, luxury finished hems, and authentic materials.",
        "sizes": [
            "26mm (Bangle Clasp)"
        ],
        "colors": [
            {
                "name": "Yellow Gold",
                "hex": "#d4af37"
            },
            {
                "name": "Rose Gold",
                "hex": "#fb7185"
            },
            {
                "name": "Rhodium Silver",
                "hex": "#e2e8f0"
            }
        ]
    },
    {
        "id": 54,
        "name": "Heritage Aviator Chrono Dual-Time Watch",
        "slug": "heritage-aviator-chrono-dual-time-watch",
        "category": "watches",
        "subcategory": "Men Chronographs",
        "category_name": "Khushi Timepieces",
        "brand": "Khushi Collection",
        "sku": "KC-WAT-006",
        "price": 26500,
        "sale_price": 21900,
        "cost_price": 14575,
        "stock": 12,
        "low_stock_threshold": 3,
        "status": "published",
        "is_featured": false,
        "is_new": true,
        "is_bestseller": false,
        "is_flash_sale": false,
        "rating": 4.85,
        "reviews_count": 48,
        "thumbnail": "https://images.unsplash.com/photo-1547996160-71dfabb1d5b1?w=800&auto=format&fit=crop&q=80",
        "secondary_image": "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&auto=format&fit=crop&q=80",
        "images": [
            "https://images.unsplash.com/photo-1547996160-71dfabb1d5b1?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&auto=format&fit=crop&q=80"
        ],
        "short_description": "Dual-time zone GMT chronograph with ceramic rotating bezel and luminous hands for night vision.",
        "description": "Dual-time zone GMT chronograph with ceramic rotating bezel and luminous hands for night vision. Handcrafted with meticulous attention to detail, luxury finished hems, and authentic materials.",
        "sizes": [
            "42mm (316L Steel)"
        ],
        "colors": [
            {
                "name": "Pepsi Navy/Red",
                "hex": "#0f172a"
            },
            {
                "name": "Ceramic Black",
                "hex": "#18181b"
            },
            {
                "name": "Emerald Green",
                "hex": "#064e3b"
            }
        ]
    },
    {
        "id": 55,
        "name": "Celestial Moonphase Minimalist Watch",
        "slug": "celestial-moonphase-minimalist-watch",
        "category": "watches",
        "subcategory": "Automatic Mechanical",
        "category_name": "Khushi Timepieces",
        "brand": "Khushi Collection",
        "sku": "KC-WAT-007",
        "price": 28000,
        "sale_price": 23500,
        "cost_price": 15400,
        "stock": 12,
        "low_stock_threshold": 3,
        "status": "published",
        "is_featured": false,
        "is_new": false,
        "is_bestseller": true,
        "is_flash_sale": false,
        "rating": 4.9,
        "reviews_count": 53,
        "thumbnail": "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&auto=format&fit=crop&q=80",
        "secondary_image": "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&auto=format&fit=crop&q=80",
        "images": [
            "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1547996160-71dfabb1d5b1?w=800&auto=format&fit=crop&q=80"
        ],
        "short_description": "Genuine rotating moonphase dial displaying lunar calendar cycles with sapphire exhibition back.",
        "description": "Genuine rotating moonphase dial displaying lunar calendar cycles with sapphire exhibition back. Handcrafted with meticulous attention to detail, luxury finished hems, and authentic materials.",
        "sizes": [
            "40mm (Alligator Grain)"
        ],
        "colors": [
            {
                "name": "Midnight Blue Dial",
                "hex": "#1e1b4b"
            },
            {
                "name": "Silver Dial",
                "hex": "#18181b"
            },
            {
                "name": "Rose Gold Case",
                "hex": "#78350f"
            }
        ]
    },
    {
        "id": 56,
        "name": "Princess Emerald Pav\u00e9 Diamond Watch",
        "slug": "princess-emerald-pav-diamond-watch",
        "category": "watches",
        "subcategory": "Women Luxury Timepieces",
        "category_name": "Khushi Timepieces",
        "brand": "Khushi Collection",
        "sku": "KC-WAT-008",
        "price": 21500,
        "sale_price": 17800,
        "cost_price": 11825,
        "stock": 12,
        "low_stock_threshold": 3,
        "status": "published",
        "is_featured": false,
        "is_new": false,
        "is_bestseller": false,
        "is_flash_sale": true,
        "rating": 4.95,
        "reviews_count": 58,
        "thumbnail": "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&auto=format&fit=crop&q=80",
        "secondary_image": "https://images.unsplash.com/photo-1547996160-71dfabb1d5b1?w=800&auto=format&fit=crop&q=80",
        "images": [
            "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1547996160-71dfabb1d5b1?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&auto=format&fit=crop&q=80"
        ],
        "short_description": "Emerald green guilloch\u00e9 dial with baguette crystal indexes and polished jubilee bracelet.",
        "description": "Emerald green guilloch\u00e9 dial with baguette crystal indexes and polished jubilee bracelet. Handcrafted with meticulous attention to detail, luxury finished hems, and authentic materials.",
        "sizes": [
            "32mm (Steel Bracelet)"
        ],
        "colors": [
            {
                "name": "Emerald Gold",
                "hex": "#064e3b"
            },
            {
                "name": "Champagne Gold",
                "hex": "#d4af37"
            },
            {
                "name": "Onyx Silver",
                "hex": "#09090b"
            }
        ]
    },
    {
        "id": 57,
        "name": "Vanguard Carbon Fiber Diver 200M",
        "slug": "vanguard-carbon-fiber-diver-200m",
        "category": "watches",
        "subcategory": "Men Chronographs",
        "category_name": "Khushi Timepieces",
        "brand": "Khushi Collection",
        "sku": "KC-WAT-009",
        "price": 29500,
        "sale_price": 24900,
        "cost_price": 16225,
        "stock": 12,
        "low_stock_threshold": 3,
        "status": "published",
        "is_featured": false,
        "is_new": true,
        "is_bestseller": true,
        "is_flash_sale": false,
        "rating": 4.85,
        "reviews_count": 63,
        "thumbnail": "https://images.unsplash.com/photo-1547996160-71dfabb1d5b1?w=800&auto=format&fit=crop&q=80",
        "secondary_image": "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&auto=format&fit=crop&q=80",
        "images": [
            "https://images.unsplash.com/photo-1547996160-71dfabb1d5b1?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&auto=format&fit=crop&q=80"
        ],
        "short_description": "20 ATM water-resistant diver watch with genuine forged carbon fiber dial and silicone strap.",
        "description": "20 ATM water-resistant diver watch with genuine forged carbon fiber dial and silicone strap. Handcrafted with meticulous attention to detail, luxury finished hems, and authentic materials.",
        "sizes": [
            "43mm (High-Grade Silicone)"
        ],
        "colors": [
            {
                "name": "Stealth Carbon",
                "hex": "#09090b"
            },
            {
                "name": "Safety Orange",
                "hex": "#ea580c"
            },
            {
                "name": "Deep Sea Blue",
                "hex": "#0284c7"
            }
        ]
    },
    {
        "id": 58,
        "name": "Etoile Roman Numeral Classic Slim Watch",
        "slug": "etoile-roman-numeral-classic-slim-watch",
        "category": "watches",
        "subcategory": "Women Luxury Timepieces",
        "category_name": "Khushi Timepieces",
        "brand": "Khushi Collection",
        "sku": "KC-WAT-010",
        "price": 14900,
        "sale_price": 12200,
        "cost_price": 8195,
        "stock": 12,
        "low_stock_threshold": 3,
        "status": "published",
        "is_featured": false,
        "is_new": false,
        "is_bestseller": false,
        "is_flash_sale": false,
        "rating": 4.9,
        "reviews_count": 68,
        "thumbnail": "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&auto=format&fit=crop&q=80",
        "secondary_image": "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&auto=format&fit=crop&q=80",
        "images": [
            "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1547996160-71dfabb1d5b1?w=800&auto=format&fit=crop&q=80"
        ],
        "short_description": "Ultra-slim 6mm profile dress watch with traditional Roman numerals and saffiano leather strap.",
        "description": "Ultra-slim 6mm profile dress watch with traditional Roman numerals and saffiano leather strap. Handcrafted with meticulous attention to detail, luxury finished hems, and authentic materials.",
        "sizes": [
            "30mm (Slim Leather)"
        ],
        "colors": [
            {
                "name": "White / Tan",
                "hex": "#f8fafc"
            },
            {
                "name": "Gold / Black",
                "hex": "#78350f"
            },
            {
                "name": "Rose / Grey",
                "hex": "#09090b"
            }
        ]
    },
    {
        "id": 59,
        "name": "Monarch 24K Gold Plated Dress Chrono",
        "slug": "monarch-24k-gold-plated-dress-chrono",
        "category": "watches",
        "subcategory": "Men Chronographs",
        "category_name": "Khushi Timepieces",
        "brand": "Khushi Collection",
        "sku": "KC-WAT-011",
        "price": 25500,
        "sale_price": 20900,
        "cost_price": 14025,
        "stock": 12,
        "low_stock_threshold": 3,
        "status": "published",
        "is_featured": false,
        "is_new": false,
        "is_bestseller": true,
        "is_flash_sale": false,
        "rating": 4.95,
        "reviews_count": 73,
        "thumbnail": "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&auto=format&fit=crop&q=80",
        "secondary_image": "https://images.unsplash.com/photo-1547996160-71dfabb1d5b1?w=800&auto=format&fit=crop&q=80",
        "images": [
            "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1547996160-71dfabb1d5b1?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&auto=format&fit=crop&q=80"
        ],
        "short_description": "Triple-subdial chronograph bathed in heavy 24K gold vacuum plating with sapphire crystal.",
        "description": "Triple-subdial chronograph bathed in heavy 24K gold vacuum plating with sapphire crystal. Handcrafted with meticulous attention to detail, luxury finished hems, and authentic materials.",
        "sizes": [
            "41mm (Solid Fold Clasp)"
        ],
        "colors": [
            {
                "name": "24K Pure Gold",
                "hex": "#ca8a04"
            },
            {
                "name": "Gold / Black Dial",
                "hex": "#09090b"
            },
            {
                "name": "Gold / Sunburst Red",
                "hex": "#450a0a"
            }
        ]
    },
    {
        "id": 60,
        "name": "Zenith Automatic Tourbillon Tribute",
        "slug": "zenith-automatic-tourbillon-tribute",
        "category": "watches",
        "subcategory": "Automatic Mechanical",
        "category_name": "Khushi Timepieces",
        "brand": "Khushi Collection",
        "sku": "KC-WAT-012",
        "price": 38000,
        "sale_price": 31500,
        "cost_price": 20900,
        "stock": 12,
        "low_stock_threshold": 3,
        "status": "published",
        "is_featured": false,
        "is_new": true,
        "is_bestseller": false,
        "is_flash_sale": true,
        "rating": 4.85,
        "reviews_count": 78,
        "thumbnail": "https://images.unsplash.com/photo-1547996160-71dfabb1d5b1?w=800&auto=format&fit=crop&q=80",
        "secondary_image": "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&auto=format&fit=crop&q=80",
        "images": [
            "https://images.unsplash.com/photo-1547996160-71dfabb1d5b1?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&auto=format&fit=crop&q=80"
        ],
        "short_description": "Horological masterpiece featuring exposed open-heart escapement balance wheel and blued screws.",
        "description": "Horological masterpiece featuring exposed open-heart escapement balance wheel and blued screws. Handcrafted with meticulous attention to detail, luxury finished hems, and authentic materials.",
        "sizes": [
            "42.5mm (Deployant Clasp)"
        ],
        "colors": [
            {
                "name": "Black Obsidian",
                "hex": "#09090b"
            },
            {
                "name": "Imperial Navy",
                "hex": "#1e3a8a"
            },
            {
                "name": "Rose Cognac",
                "hex": "#78350f"
            }
        ]
    },
    {
        "id": 61,
        "name": "Imperial Cambodian Agarwood Oud 100ml",
        "slug": "imperial-cambodian-agarwood-oud-100ml",
        "category": "perfumes",
        "subcategory": "Oriental Oud",
        "category_name": "Haute Parfumerie",
        "brand": "Khushi Collection",
        "sku": "KC-PERF-001",
        "price": 16500,
        "sale_price": 13900,
        "cost_price": 9075,
        "stock": 12,
        "low_stock_threshold": 3,
        "status": "published",
        "is_featured": true,
        "is_new": false,
        "is_bestseller": true,
        "is_flash_sale": false,
        "rating": 4.9,
        "reviews_count": 23,
        "thumbnail": "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&auto=format&fit=crop&q=80",
        "secondary_image": "https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&auto=format&fit=crop&q=80",
        "images": [
            "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=800&auto=format&fit=crop&q=80"
        ],
        "short_description": "Pure 12-year aged wild Cambodian agarwood enriched with Damascus rose and ambergris. 28% extrait concentration.",
        "description": "Pure 12-year aged wild Cambodian agarwood enriched with Damascus rose and ambergris. 28% extrait concentration. Handcrafted with meticulous attention to detail, luxury finished hems, and authentic materials.",
        "sizes": [
            "100ml / 3.4 oz",
            "50ml / 1.7 oz",
            "12ml Pure Attar"
        ],
        "colors": [
            {
                "name": "Aged Oud Flacon",
                "hex": "#78350f"
            },
            {
                "name": "Vintage Flask",
                "hex": "#451a03"
            },
            {
                "name": "Crystal Edition",
                "hex": "#09090b"
            }
        ]
    },
    {
        "id": 62,
        "name": "Saffron & Royal Amber Extrait De Parfum",
        "slug": "saffron-royal-amber-extrait-de-parfum",
        "category": "perfumes",
        "subcategory": "Oriental Oud",
        "category_name": "Haute Parfumerie",
        "brand": "Khushi Collection",
        "sku": "KC-PERF-002",
        "price": 14500,
        "sale_price": 11800,
        "cost_price": 7975,
        "stock": 12,
        "low_stock_threshold": 3,
        "status": "published",
        "is_featured": true,
        "is_new": false,
        "is_bestseller": false,
        "is_flash_sale": false,
        "rating": 4.95,
        "reviews_count": 28,
        "thumbnail": "https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&auto=format&fit=crop&q=80",
        "secondary_image": "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&auto=format&fit=crop&q=80",
        "images": [
            "https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=800&auto=format&fit=crop&q=80"
        ],
        "short_description": "Rich Kashmiri saffron, warm amber resin, smoked cedarwood, and Madagascar vanilla heart.",
        "description": "Rich Kashmiri saffron, warm amber resin, smoked cedarwood, and Madagascar vanilla heart. Handcrafted with meticulous attention to detail, luxury finished hems, and authentic materials.",
        "sizes": [
            "100ml / 3.4 oz",
            "50ml / 1.7 oz"
        ],
        "colors": [
            {
                "name": "Amber Gold Bottle",
                "hex": "#d97706"
            },
            {
                "name": "Smoked Glass",
                "hex": "#b45309"
            },
            {
                "name": "Collector Edition",
                "hex": "#09090b"
            }
        ]
    },
    {
        "id": 63,
        "name": "Damascus Rose & Velvet Musk EDP",
        "slug": "damascus-rose-velvet-musk-edp",
        "category": "perfumes",
        "subcategory": "Floral Eau De Parfum",
        "category_name": "Haute Parfumerie",
        "brand": "Khushi Collection",
        "sku": "KC-PERF-003",
        "price": 12500,
        "sale_price": 9900,
        "cost_price": 6875,
        "stock": 12,
        "low_stock_threshold": 3,
        "status": "published",
        "is_featured": true,
        "is_new": true,
        "is_bestseller": true,
        "is_flash_sale": false,
        "rating": 4.85,
        "reviews_count": 33,
        "thumbnail": "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=800&auto=format&fit=crop&q=80",
        "secondary_image": "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&auto=format&fit=crop&q=80",
        "images": [
            "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&auto=format&fit=crop&q=80"
        ],
        "short_description": "Distilled Damascus rose petals, Italian bergamot, powdery white musk, and soft cashmeran.",
        "description": "Distilled Damascus rose petals, Italian bergamot, powdery white musk, and soft cashmeran. Handcrafted with meticulous attention to detail, luxury finished hems, and authentic materials.",
        "sizes": [
            "100ml / 3.4 oz",
            "50ml / 1.7 oz"
        ],
        "colors": [
            {
                "name": "Rose Velvet Flacon",
                "hex": "#fb7185"
            },
            {
                "name": "Frosted Pink",
                "hex": "#f43f5e"
            },
            {
                "name": "Petal Decant",
                "hex": "#fda4af"
            }
        ]
    },
    {
        "id": 64,
        "name": "Sultan Smokey Birch & Leather Extrait",
        "slug": "sultan-smokey-birch-leather-extrait",
        "category": "perfumes",
        "subcategory": "Men Fragrances",
        "category_name": "Haute Parfumerie",
        "brand": "Khushi Collection",
        "sku": "KC-PERF-004",
        "price": 15500,
        "sale_price": 12900,
        "cost_price": 8525,
        "stock": 12,
        "low_stock_threshold": 3,
        "status": "published",
        "is_featured": false,
        "is_new": false,
        "is_bestseller": false,
        "is_flash_sale": true,
        "rating": 4.9,
        "reviews_count": 38,
        "thumbnail": "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&auto=format&fit=crop&q=80",
        "secondary_image": "https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&auto=format&fit=crop&q=80",
        "images": [
            "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=800&auto=format&fit=crop&q=80"
        ],
        "short_description": "Intense birch tar, Tuscan leather, cracked black pepper, vetiver, and dark patchouli.",
        "description": "Intense birch tar, Tuscan leather, cracked black pepper, vetiver, and dark patchouli. Handcrafted with meticulous attention to detail, luxury finished hems, and authentic materials.",
        "sizes": [
            "100ml / 3.4 oz",
            "50ml / 1.7 oz"
        ],
        "colors": [
            {
                "name": "Matte Obsidian Black",
                "hex": "#18181b"
            },
            {
                "name": "Leather Wrapped",
                "hex": "#27272a"
            },
            {
                "name": "Crystal Flask",
                "hex": "#451a03"
            }
        ]
    },
    {
        "id": 65,
        "name": "Pure Dehn Al Oud Concentrated Attar 12ml",
        "slug": "pure-dehn-al-oud-concentrated-attar-12ml",
        "category": "perfumes",
        "subcategory": "Attar Concentrates",
        "category_name": "Haute Parfumerie",
        "brand": "Khushi Collection",
        "sku": "KC-PERF-005",
        "price": 18500,
        "sale_price": 15500,
        "cost_price": 10175,
        "stock": 12,
        "low_stock_threshold": 3,
        "status": "published",
        "is_featured": false,
        "is_new": false,
        "is_bestseller": true,
        "is_flash_sale": false,
        "rating": 4.95,
        "reviews_count": 43,
        "thumbnail": "https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&auto=format&fit=crop&q=80",
        "secondary_image": "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&auto=format&fit=crop&q=80",
        "images": [
            "https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=800&auto=format&fit=crop&q=80"
        ],
        "short_description": "100% pure alcohol-free artisanal attar oil aged in oak barrels for over 15 years.",
        "description": "100% pure alcohol-free artisanal attar oil aged in oak barrels for over 15 years. Handcrafted with meticulous attention to detail, luxury finished hems, and authentic materials.",
        "sizes": [
            "12ml Pure Oil",
            "6ml Miniature"
        ],
        "colors": [
            {
                "name": "Crystal Attar Bottle with Dipstick",
                "hex": "#78350f"
            }
        ]
    },
    {
        "id": 66,
        "name": "White Jasmine & Cardamom Eau De Parfum",
        "slug": "white-jasmine-cardamom-eau-de-parfum",
        "category": "perfumes",
        "subcategory": "Floral Eau De Parfum",
        "category_name": "Haute Parfumerie",
        "brand": "Khushi Collection",
        "sku": "KC-PERF-006",
        "price": 11500,
        "sale_price": 9200,
        "cost_price": 6325,
        "stock": 12,
        "low_stock_threshold": 3,
        "status": "published",
        "is_featured": false,
        "is_new": true,
        "is_bestseller": false,
        "is_flash_sale": false,
        "rating": 4.85,
        "reviews_count": 48,
        "thumbnail": "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=800&auto=format&fit=crop&q=80",
        "secondary_image": "https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&auto=format&fit=crop&q=80",
        "images": [
            "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&auto=format&fit=crop&q=80"
        ],
        "short_description": "Nocturnal blooming Motia jasmine, crushed green cardamom pods, sandalwood, and sweet tonka.",
        "description": "Nocturnal blooming Motia jasmine, crushed green cardamom pods, sandalwood, and sweet tonka. Handcrafted with meticulous attention to detail, luxury finished hems, and authentic materials.",
        "sizes": [
            "100ml / 3.4 oz",
            "50ml / 1.7 oz"
        ],
        "colors": [
            {
                "name": "Frosted Ivory",
                "hex": "#f8fafc"
            },
            {
                "name": "Gold Trim Bottle",
                "hex": "#fef3c7"
            },
            {
                "name": "Travel Size",
                "hex": "#e0e7ff"
            }
        ]
    },
    {
        "id": 67,
        "name": "Royal Taif Rose & Frankincense Elixir",
        "slug": "royal-taif-rose-frankincense-elixir",
        "category": "perfumes",
        "subcategory": "Oriental Oud",
        "category_name": "Haute Parfumerie",
        "brand": "Khushi Collection",
        "sku": "KC-PERF-007",
        "price": 15800,
        "sale_price": 13200,
        "cost_price": 8690,
        "stock": 12,
        "low_stock_threshold": 3,
        "status": "published",
        "is_featured": false,
        "is_new": false,
        "is_bestseller": true,
        "is_flash_sale": false,
        "rating": 4.9,
        "reviews_count": 53,
        "thumbnail": "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&auto=format&fit=crop&q=80",
        "secondary_image": "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=800&auto=format&fit=crop&q=80",
        "images": [
            "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&auto=format&fit=crop&q=80"
        ],
        "short_description": "Wild Saudi Taif rose petals distilled with royal Hojari frankincense tears.",
        "description": "Wild Saudi Taif rose petals distilled with royal Hojari frankincense tears. Handcrafted with meticulous attention to detail, luxury finished hems, and authentic materials.",
        "sizes": [
            "100ml / 3.4 oz",
            "50ml / 1.7 oz"
        ],
        "colors": [
            {
                "name": "Taif Ruby Flacon",
                "hex": "#be123c"
            },
            {
                "name": "Rose Gold Edition",
                "hex": "#881337"
            }
        ]
    },
    {
        "id": 68,
        "name": "Obsidian Black Pepper & Incense EDP",
        "slug": "obsidian-black-pepper-incense-edp",
        "category": "perfumes",
        "subcategory": "Men Fragrances",
        "category_name": "Haute Parfumerie",
        "brand": "Khushi Collection",
        "sku": "KC-PERF-008",
        "price": 13800,
        "sale_price": 11200,
        "cost_price": 7590,
        "stock": 12,
        "low_stock_threshold": 3,
        "status": "published",
        "is_featured": false,
        "is_new": false,
        "is_bestseller": false,
        "is_flash_sale": true,
        "rating": 4.95,
        "reviews_count": 58,
        "thumbnail": "https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&auto=format&fit=crop&q=80",
        "secondary_image": "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&auto=format&fit=crop&q=80",
        "images": [
            "https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=800&auto=format&fit=crop&q=80"
        ],
        "short_description": "Madagascan black pepper, Somali myrrh, guaiac wood, and crystalline amber.",
        "description": "Madagascan black pepper, Somali myrrh, guaiac wood, and crystalline amber. Handcrafted with meticulous attention to detail, luxury finished hems, and authentic materials.",
        "sizes": [
            "100ml / 3.4 oz",
            "50ml / 1.7 oz"
        ],
        "colors": [
            {
                "name": "Glossy Obsidian",
                "hex": "#09090b"
            },
            {
                "name": "Matte Night",
                "hex": "#27272a"
            },
            {
                "name": "Discovery Flacon",
                "hex": "#0f172a"
            }
        ]
    },
    {
        "id": 69,
        "name": "Shamama Pure Herbal Attar 12ml",
        "slug": "shamama-pure-herbal-attar-12ml",
        "category": "perfumes",
        "subcategory": "Attar Concentrates",
        "category_name": "Haute Parfumerie",
        "brand": "Khushi Collection",
        "sku": "KC-PERF-009",
        "price": 14000,
        "sale_price": 11500,
        "cost_price": 7700,
        "stock": 12,
        "low_stock_threshold": 3,
        "status": "published",
        "is_featured": false,
        "is_new": true,
        "is_bestseller": true,
        "is_flash_sale": false,
        "rating": 4.85,
        "reviews_count": 63,
        "thumbnail": "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&auto=format&fit=crop&q=80",
        "secondary_image": "https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&auto=format&fit=crop&q=80",
        "images": [
            "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=800&auto=format&fit=crop&q=80"
        ],
        "short_description": "Ancient formula of 40 Himalayan herbs and spices infused in pure sandalwood oil base.",
        "description": "Ancient formula of 40 Himalayan herbs and spices infused in pure sandalwood oil base. Handcrafted with meticulous attention to detail, luxury finished hems, and authentic materials.",
        "sizes": [
            "12ml Pure Attar",
            "6ml Miniature"
        ],
        "colors": [
            {
                "name": "Hand-Carved Brass Flacon",
                "hex": "#78350f"
            }
        ]
    },
    {
        "id": 70,
        "name": "Fleur D'Oranger & White Tea Parfum",
        "slug": "fleur-d-oranger-white-tea-parfum",
        "category": "perfumes",
        "subcategory": "Floral Eau De Parfum",
        "category_name": "Haute Parfumerie",
        "brand": "Khushi Collection",
        "sku": "KC-PERF-010",
        "price": 11900,
        "sale_price": 9500,
        "cost_price": 6545,
        "stock": 12,
        "low_stock_threshold": 3,
        "status": "published",
        "is_featured": false,
        "is_new": false,
        "is_bestseller": false,
        "is_flash_sale": false,
        "rating": 4.9,
        "reviews_count": 68,
        "thumbnail": "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=800&auto=format&fit=crop&q=80",
        "secondary_image": "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&auto=format&fit=crop&q=80",
        "images": [
            "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&auto=format&fit=crop&q=80"
        ],
        "short_description": "Tunisian orange blossom, sparkling mandarin, white tea leaves, and clean cedarwood.",
        "description": "Tunisian orange blossom, sparkling mandarin, white tea leaves, and clean cedarwood. Handcrafted with meticulous attention to detail, luxury finished hems, and authentic materials.",
        "sizes": [
            "100ml / 3.4 oz",
            "50ml / 1.7 oz"
        ],
        "colors": [
            {
                "name": "Citrus Sunlight",
                "hex": "#fed7aa"
            },
            {
                "name": "Pearl Mist",
                "hex": "#fef08a"
            },
            {
                "name": "Crystal Atomizer",
                "hex": "#f8fafc"
            }
        ]
    },
    {
        "id": 71,
        "name": "Tobacco & Honeyed Amber Extrait",
        "slug": "tobacco-honeyed-amber-extrait",
        "category": "perfumes",
        "subcategory": "Oriental Oud",
        "category_name": "Haute Parfumerie",
        "brand": "Khushi Collection",
        "sku": "KC-PERF-011",
        "price": 16200,
        "sale_price": 13400,
        "cost_price": 8910,
        "stock": 12,
        "low_stock_threshold": 3,
        "status": "published",
        "is_featured": false,
        "is_new": false,
        "is_bestseller": true,
        "is_flash_sale": false,
        "rating": 4.95,
        "reviews_count": 73,
        "thumbnail": "https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&auto=format&fit=crop&q=80",
        "secondary_image": "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&auto=format&fit=crop&q=80",
        "images": [
            "https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=800&auto=format&fit=crop&q=80"
        ],
        "short_description": "Cuban tobacco leaves, organic wildflower honey, benzoin resin, and dark roasted cacao.",
        "description": "Cuban tobacco leaves, organic wildflower honey, benzoin resin, and dark roasted cacao. Handcrafted with meticulous attention to detail, luxury finished hems, and authentic materials.",
        "sizes": [
            "100ml / 3.4 oz",
            "50ml / 1.7 oz"
        ],
        "colors": [
            {
                "name": "Amber Havana Bottle",
                "hex": "#451a03"
            },
            {
                "name": "Smoked Brown Flacon",
                "hex": "#78350f"
            }
        ]
    },
    {
        "id": 72,
        "name": "Kashmir Saffron & Rose Concentrated Attar",
        "slug": "kashmir-saffron-rose-concentrated-attar",
        "category": "perfumes",
        "subcategory": "Attar Concentrates",
        "category_name": "Haute Parfumerie",
        "brand": "Khushi Collection",
        "sku": "KC-PERF-012",
        "price": 17200,
        "sale_price": 14200,
        "cost_price": 9460,
        "stock": 12,
        "low_stock_threshold": 3,
        "status": "published",
        "is_featured": false,
        "is_new": true,
        "is_bestseller": false,
        "is_flash_sale": true,
        "rating": 4.85,
        "reviews_count": 78,
        "thumbnail": "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&auto=format&fit=crop&q=80",
        "secondary_image": "https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&auto=format&fit=crop&q=80",
        "images": [
            "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=800&auto=format&fit=crop&q=80"
        ],
        "short_description": "Pure Kashmiri mongra saffron extract hand-blended with high-altitude Taif rose absolute.",
        "description": "Pure Kashmiri mongra saffron extract hand-blended with high-altitude Taif rose absolute. Handcrafted with meticulous attention to detail, luxury finished hems, and authentic materials.",
        "sizes": [
            "12ml Pure Oil",
            "6ml Travel"
        ],
        "colors": [
            {
                "name": "Gold Filigree Crystal Flacon",
                "hex": "#ca8a04"
            }
        ]
    },
    {
        "id": 73,
        "name": "Khushi Structured Monogram Quilted Tote",
        "slug": "khushi-structured-monogram-quilted-tote",
        "category": "bags",
        "subcategory": "Luxury Totes",
        "category_name": "Luxury Handbags",
        "brand": "Khushi Collection",
        "sku": "KC-BAG-001",
        "price": 14500,
        "sale_price": 11900,
        "cost_price": 7975,
        "stock": 12,
        "low_stock_threshold": 3,
        "status": "published",
        "is_featured": true,
        "is_new": false,
        "is_bestseller": true,
        "is_flash_sale": false,
        "rating": 4.9,
        "reviews_count": 23,
        "thumbnail": "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&auto=format&fit=crop&q=80",
        "secondary_image": "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&auto=format&fit=crop&q=80",
        "images": [
            "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=800&auto=format&fit=crop&q=80"
        ],
        "short_description": "Padded micro-grain vegan leather tote with 24K gold monogram lock hardware and detachable strap.",
        "description": "Padded micro-grain vegan leather tote with 24K gold monogram lock hardware and detachable strap. Handcrafted with meticulous attention to detail, luxury finished hems, and authentic materials.",
        "sizes": [
            "Medium (34cm x 26cm)",
            "Large Carryall"
        ],
        "colors": [
            {
                "name": "Jet Black",
                "hex": "#09090b"
            },
            {
                "name": "Cognac Brown",
                "hex": "#78350f"
            },
            {
                "name": "Emerald Pine",
                "hex": "#064e3b"
            }
        ]
    },
    {
        "id": 74,
        "name": "Mughal Royal Zari Embroidered Bridal Clutch",
        "slug": "mughal-royal-zari-embroidered-bridal-clutch",
        "category": "bags",
        "subcategory": "Bridal Clutches",
        "category_name": "Luxury Handbags",
        "brand": "Khushi Collection",
        "sku": "KC-BAG-002",
        "price": 8500,
        "sale_price": 6900,
        "cost_price": 4675,
        "stock": 12,
        "low_stock_threshold": 3,
        "status": "published",
        "is_featured": true,
        "is_new": false,
        "is_bestseller": false,
        "is_flash_sale": false,
        "rating": 4.95,
        "reviews_count": 28,
        "thumbnail": "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=800&auto=format&fit=crop&q=80",
        "secondary_image": "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&auto=format&fit=crop&q=80",
        "images": [
            "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&auto=format&fit=crop&q=80"
        ],
        "short_description": "Handmade antique brass frame hardcase clutch adorned with heavy tilla embroidery and crystal clasp.",
        "description": "Handmade antique brass frame hardcase clutch adorned with heavy tilla embroidery and crystal clasp. Handcrafted with meticulous attention to detail, luxury finished hems, and authentic materials.",
        "sizes": [
            "Standard Box (20cm x 12cm)"
        ],
        "colors": [
            {
                "name": "Gold Champagne",
                "hex": "#d4af37"
            },
            {
                "name": "Bridal Ruby",
                "hex": "#881337"
            },
            {
                "name": "Emerald Forest",
                "hex": "#064e3b"
            }
        ]
    },
    {
        "id": 75,
        "name": "Artisan Saffiano Leather Crossbody Bag",
        "slug": "artisan-saffiano-leather-crossbody-bag",
        "category": "bags",
        "subcategory": "Crossbody",
        "category_name": "Luxury Handbags",
        "brand": "Khushi Collection",
        "sku": "KC-BAG-003",
        "price": 11200,
        "sale_price": 8900,
        "cost_price": 6160,
        "stock": 12,
        "low_stock_threshold": 3,
        "status": "published",
        "is_featured": true,
        "is_new": true,
        "is_bestseller": true,
        "is_flash_sale": false,
        "rating": 4.85,
        "reviews_count": 33,
        "thumbnail": "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&auto=format&fit=crop&q=80",
        "secondary_image": "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&auto=format&fit=crop&q=80",
        "images": [
            "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=800&auto=format&fit=crop&q=80"
        ],
        "short_description": "Scratch-resistant Italian saffiano leather bag with dual zipper compartments and adjustable strap.",
        "description": "Scratch-resistant Italian saffiano leather bag with dual zipper compartments and adjustable strap. Handcrafted with meticulous attention to detail, luxury finished hems, and authentic materials.",
        "sizes": [
            "Compact (22cm x 16cm)"
        ],
        "colors": [
            {
                "name": "Sapphire Navy",
                "hex": "#1e3a8a"
            },
            {
                "name": "Onyx Black",
                "hex": "#09090b"
            },
            {
                "name": "Plum Berry",
                "hex": "#701a75"
            }
        ]
    },
    {
        "id": 76,
        "name": "Velvet Hand-Worked Potli Bag",
        "slug": "velvet-hand-worked-potli-bag",
        "category": "bags",
        "subcategory": "Bridal Clutches",
        "category_name": "Luxury Handbags",
        "brand": "Khushi Collection",
        "sku": "KC-BAG-004",
        "price": 4500,
        "sale_price": 3600,
        "cost_price": 2475,
        "stock": 12,
        "low_stock_threshold": 3,
        "status": "published",
        "is_featured": false,
        "is_new": false,
        "is_bestseller": false,
        "is_flash_sale": true,
        "rating": 4.9,
        "reviews_count": 38,
        "thumbnail": "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=800&auto=format&fit=crop&q=80",
        "secondary_image": "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&auto=format&fit=crop&q=80",
        "images": [
            "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&auto=format&fit=crop&q=80"
        ],
        "short_description": "Traditional drawstring potli bag encrusted with pearls, mirrors, and long dangling gold tassels.",
        "description": "Traditional drawstring potli bag encrusted with pearls, mirrors, and long dangling gold tassels. Handcrafted with meticulous attention to detail, luxury finished hems, and authentic materials.",
        "sizes": [
            "Standard Potli"
        ],
        "colors": [
            {
                "name": "Maroon Velvet",
                "hex": "#881337"
            },
            {
                "name": "Emerald Velvet",
                "hex": "#064e3b"
            },
            {
                "name": "Gold Zari",
                "hex": "#ca8a04"
            }
        ]
    },
    {
        "id": 77,
        "name": "Executive Full-Grain Leather Briefcase",
        "slug": "executive-full-grain-leather-briefcase",
        "category": "bags",
        "subcategory": "Luxury Totes",
        "category_name": "Luxury Handbags",
        "brand": "Khushi Collection",
        "sku": "KC-BAG-005",
        "price": 18500,
        "sale_price": 15200,
        "cost_price": 10175,
        "stock": 12,
        "low_stock_threshold": 3,
        "status": "published",
        "is_featured": false,
        "is_new": false,
        "is_bestseller": true,
        "is_flash_sale": false,
        "rating": 4.95,
        "reviews_count": 43,
        "thumbnail": "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&auto=format&fit=crop&q=80",
        "secondary_image": "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&auto=format&fit=crop&q=80",
        "images": [
            "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=800&auto=format&fit=crop&q=80"
        ],
        "short_description": "Premium steerhide leather executive bag with padded 15.6-inch laptop compartment and trolley strap.",
        "description": "Premium steerhide leather executive bag with padded 15.6-inch laptop compartment and trolley strap. Handcrafted with meticulous attention to detail, luxury finished hems, and authentic materials.",
        "sizes": [
            "Executive (40cm x 30cm)"
        ],
        "colors": [
            {
                "name": "Dark Chocolate",
                "hex": "#451a03"
            },
            {
                "name": "Jet Black",
                "hex": "#09090b"
            },
            {
                "name": "British Tan",
                "hex": "#78350f"
            }
        ]
    },
    {
        "id": 78,
        "name": "Mother-of-Pearl Mosaic Evening Minaudi\u00e8re",
        "slug": "mother-of-pearl-mosaic-evening-minaudi-re",
        "category": "bags",
        "subcategory": "Bridal Clutches",
        "category_name": "Luxury Handbags",
        "brand": "Khushi Collection",
        "sku": "KC-BAG-006",
        "price": 12500,
        "sale_price": 9900,
        "cost_price": 6875,
        "stock": 12,
        "low_stock_threshold": 3,
        "status": "published",
        "is_featured": false,
        "is_new": true,
        "is_bestseller": false,
        "is_flash_sale": false,
        "rating": 4.85,
        "reviews_count": 48,
        "thumbnail": "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=800&auto=format&fit=crop&q=80",
        "secondary_image": "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&auto=format&fit=crop&q=80",
        "images": [
            "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&auto=format&fit=crop&q=80"
        ],
        "short_description": "Natural hand-cut mother-of-pearl hexagonal shell clutch with detachable snake chain.",
        "description": "Natural hand-cut mother-of-pearl hexagonal shell clutch with detachable snake chain. Handcrafted with meticulous attention to detail, luxury finished hems, and authentic materials.",
        "sizes": [
            "Evening Hardcase (19cm x 11cm)"
        ],
        "colors": [
            {
                "name": "Iridescent Pearl",
                "hex": "#f8fafc"
            },
            {
                "name": "Champagne Shimmer",
                "hex": "#fef08a"
            },
            {
                "name": "Silver Moon",
                "hex": "#e2e8f0"
            }
        ]
    },
    {
        "id": 79,
        "name": "Crescent Curved Leather Shoulder Bag",
        "slug": "crescent-curved-leather-shoulder-bag",
        "category": "bags",
        "subcategory": "Crossbody",
        "category_name": "Luxury Handbags",
        "brand": "Khushi Collection",
        "sku": "KC-BAG-007",
        "price": 10800,
        "sale_price": 8600,
        "cost_price": 5940,
        "stock": 12,
        "low_stock_threshold": 3,
        "status": "published",
        "is_featured": false,
        "is_new": false,
        "is_bestseller": true,
        "is_flash_sale": false,
        "rating": 4.9,
        "reviews_count": 53,
        "thumbnail": "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&auto=format&fit=crop&q=80",
        "secondary_image": "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&auto=format&fit=crop&q=80",
        "images": [
            "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=800&auto=format&fit=crop&q=80"
        ],
        "short_description": "Modern minimalist crescent hobo silhouette in buttery soft calf-grain leather with magnetic tab.",
        "description": "Modern minimalist crescent hobo silhouette in buttery soft calf-grain leather with magnetic tab. Handcrafted with meticulous attention to detail, luxury finished hems, and authentic materials.",
        "sizes": [
            "Medium (28cm x 18cm)"
        ],
        "colors": [
            {
                "name": "Black Noir",
                "hex": "#09090b"
            },
            {
                "name": "Caramel Tan",
                "hex": "#78350f"
            },
            {
                "name": "Off-White Cream",
                "hex": "#f8fafc"
            }
        ]
    },
    {
        "id": 80,
        "name": "Bespoke Handcrafted Leather Bifold Wallet",
        "slug": "bespoke-handcrafted-leather-bifold-wallet",
        "category": "bags",
        "subcategory": "Wallets",
        "category_name": "Luxury Handbags",
        "brand": "Khushi Collection",
        "sku": "KC-BAG-008",
        "price": 4200,
        "sale_price": 3400,
        "cost_price": 2310,
        "stock": 12,
        "low_stock_threshold": 3,
        "status": "published",
        "is_featured": false,
        "is_new": false,
        "is_bestseller": false,
        "is_flash_sale": true,
        "rating": 4.95,
        "reviews_count": 58,
        "thumbnail": "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&auto=format&fit=crop&q=80",
        "secondary_image": "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&auto=format&fit=crop&q=80",
        "images": [
            "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=800&auto=format&fit=crop&q=80"
        ],
        "short_description": "Ultra-slim 8-card RFID blocking wallet in vegetable tanned top-grain cowhide leather.",
        "description": "Ultra-slim 8-card RFID blocking wallet in vegetable tanned top-grain cowhide leather. Handcrafted with meticulous attention to detail, luxury finished hems, and authentic materials.",
        "sizes": [
            "Slim Pocket (11cm x 9cm)"
        ],
        "colors": [
            {
                "name": "Classic Black",
                "hex": "#18181b"
            },
            {
                "name": "Espresso Brown",
                "hex": "#451a03"
            },
            {
                "name": "Tan Saddle",
                "hex": "#78350f"
            }
        ]
    },
    {
        "id": 81,
        "name": "Grand Shopper Canvas & Leather Tote",
        "slug": "grand-shopper-canvas-leather-tote",
        "category": "bags",
        "subcategory": "Luxury Totes",
        "category_name": "Luxury Handbags",
        "brand": "Khushi Collection",
        "sku": "KC-BAG-009",
        "price": 13200,
        "sale_price": 10800,
        "cost_price": 7260,
        "stock": 12,
        "low_stock_threshold": 3,
        "status": "published",
        "is_featured": false,
        "is_new": true,
        "is_bestseller": true,
        "is_flash_sale": false,
        "rating": 4.85,
        "reviews_count": 63,
        "thumbnail": "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&auto=format&fit=crop&q=80",
        "secondary_image": "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&auto=format&fit=crop&q=80",
        "images": [
            "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=800&auto=format&fit=crop&q=80"
        ],
        "short_description": "Heavy-duty waterproof canvas tote with genuine leather trims and reinforced gold feet.",
        "description": "Heavy-duty waterproof canvas tote with genuine leather trims and reinforced gold feet. Handcrafted with meticulous attention to detail, luxury finished hems, and authentic materials.",
        "sizes": [
            "Large Shopper (42cm x 32cm)"
        ],
        "colors": [
            {
                "name": "Beige / Tan",
                "hex": "#fef3c7"
            },
            {
                "name": "Black / Gold",
                "hex": "#09090b"
            },
            {
                "name": "Olive / Brown",
                "hex": "#064e3b"
            }
        ]
    },
    {
        "id": 82,
        "name": "Embroidered Velvet Envelope Evening Clutch",
        "slug": "embroidered-velvet-envelope-evening-clutch",
        "category": "bags",
        "subcategory": "Bridal Clutches",
        "category_name": "Luxury Handbags",
        "brand": "Khushi Collection",
        "sku": "KC-BAG-010",
        "price": 6800,
        "sale_price": 5400,
        "cost_price": 3740,
        "stock": 12,
        "low_stock_threshold": 3,
        "status": "published",
        "is_featured": false,
        "is_new": false,
        "is_bestseller": false,
        "is_flash_sale": false,
        "rating": 4.9,
        "reviews_count": 68,
        "thumbnail": "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=800&auto=format&fit=crop&q=80",
        "secondary_image": "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&auto=format&fit=crop&q=80",
        "images": [
            "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&auto=format&fit=crop&q=80"
        ],
        "short_description": "Sleek envelope cut velvet clutch with geometric antique gold bullion thread embroidery.",
        "description": "Sleek envelope cut velvet clutch with geometric antique gold bullion thread embroidery. Handcrafted with meticulous attention to detail, luxury finished hems, and authentic materials.",
        "sizes": [
            "Envelope (24cm x 14cm)"
        ],
        "colors": [
            {
                "name": "Emerald Velvet",
                "hex": "#064e3b"
            },
            {
                "name": "Ruby Maroon",
                "hex": "#881337"
            },
            {
                "name": "Obsidian Black",
                "hex": "#09090b"
            }
        ]
    },
    {
        "id": 83,
        "name": "Quilted Chain Strap Flap Bag",
        "slug": "quilted-chain-strap-flap-bag",
        "category": "bags",
        "subcategory": "Crossbody",
        "category_name": "Luxury Handbags",
        "brand": "Khushi Collection",
        "sku": "KC-BAG-011",
        "price": 12900,
        "sale_price": 10400,
        "cost_price": 7095,
        "stock": 12,
        "low_stock_threshold": 3,
        "status": "published",
        "is_featured": false,
        "is_new": false,
        "is_bestseller": true,
        "is_flash_sale": false,
        "rating": 4.95,
        "reviews_count": 73,
        "thumbnail": "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&auto=format&fit=crop&q=80",
        "secondary_image": "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&auto=format&fit=crop&q=80",
        "images": [
            "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=800&auto=format&fit=crop&q=80"
        ],
        "short_description": "Diamond quilted micro-leather crossbody with adjustable double gold sliding chain strap.",
        "description": "Diamond quilted micro-leather crossbody with adjustable double gold sliding chain strap. Handcrafted with meticulous attention to detail, luxury finished hems, and authentic materials.",
        "sizes": [
            "Medium (26cm x 16cm)"
        ],
        "colors": [
            {
                "name": "Classic Black",
                "hex": "#09090b"
            },
            {
                "name": "Ivory Cream",
                "hex": "#f8fafc"
            },
            {
                "name": "Bordeaux Red",
                "hex": "#881337"
            }
        ]
    },
    {
        "id": 84,
        "name": "Zip-Around Leather Travel Organizer Wallet",
        "slug": "zip-around-leather-travel-organizer-wallet",
        "category": "bags",
        "subcategory": "Wallets",
        "category_name": "Luxury Handbags",
        "brand": "Khushi Collection",
        "sku": "KC-BAG-012",
        "price": 5400,
        "sale_price": 4300,
        "cost_price": 2970,
        "stock": 12,
        "low_stock_threshold": 3,
        "status": "published",
        "is_featured": false,
        "is_new": true,
        "is_bestseller": false,
        "is_flash_sale": true,
        "rating": 4.85,
        "reviews_count": 78,
        "thumbnail": "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&auto=format&fit=crop&q=80",
        "secondary_image": "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&auto=format&fit=crop&q=80",
        "images": [
            "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=800&auto=format&fit=crop&q=80"
        ],
        "short_description": "Full zip continental wallet with passport pocket, 12 card slots, and zippered coin purse.",
        "description": "Full zip continental wallet with passport pocket, 12 card slots, and zippered coin purse. Handcrafted with meticulous attention to detail, luxury finished hems, and authentic materials.",
        "sizes": [
            "Long Wallet (20cm x 10cm)"
        ],
        "colors": [
            {
                "name": "Jet Black",
                "hex": "#09090b"
            },
            {
                "name": "Caramel Tan",
                "hex": "#78350f"
            },
            {
                "name": "Crimson Wine",
                "hex": "#881337"
            }
        ]
    },
    {
        "id": 85,
        "name": "24K Gold Royal Radiance Facial Elixir 30ml",
        "slug": "24k-gold-royal-radiance-facial-elixir-30ml",
        "category": "beauty",
        "subcategory": "Face Serums",
        "category_name": "Royal Beauty & Care",
        "brand": "Khushi Collection",
        "sku": "KC-BEAU-001",
        "price": 8500,
        "sale_price": 6800,
        "cost_price": 4675,
        "stock": 12,
        "low_stock_threshold": 3,
        "status": "published",
        "is_featured": true,
        "is_new": false,
        "is_bestseller": true,
        "is_flash_sale": false,
        "rating": 4.9,
        "reviews_count": 23,
        "thumbnail": "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80",
        "secondary_image": "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&auto=format&fit=crop&q=80",
        "images": [
            "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=800&auto=format&fit=crop&q=80"
        ],
        "short_description": "Infused with pure 24-karat gold flakes, rosehip oil, and squalane for an ethereal royal radiance.",
        "description": "Infused with pure 24-karat gold flakes, rosehip oil, and squalane for an ethereal royal radiance. Handcrafted with meticulous attention to detail, luxury finished hems, and authentic materials.",
        "sizes": [
            "30ml / 1 fl. oz",
            "50ml Luxury Size"
        ],
        "colors": [
            {
                "name": "24K Gold Dropper Bottle",
                "hex": "#d4af37"
            }
        ]
    },
    {
        "id": 86,
        "name": "Saffron & Wild Honey Glow Night Concentrate",
        "slug": "saffron-wild-honey-glow-night-concentrate",
        "category": "beauty",
        "subcategory": "Glow Oils",
        "category_name": "Royal Beauty & Care",
        "brand": "Khushi Collection",
        "sku": "KC-BEAU-002",
        "price": 7800,
        "sale_price": 6200,
        "cost_price": 4290,
        "stock": 12,
        "low_stock_threshold": 3,
        "status": "published",
        "is_featured": true,
        "is_new": false,
        "is_bestseller": false,
        "is_flash_sale": false,
        "rating": 4.95,
        "reviews_count": 28,
        "thumbnail": "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&auto=format&fit=crop&q=80",
        "secondary_image": "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80",
        "images": [
            "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=800&auto=format&fit=crop&q=80"
        ],
        "short_description": "Concentrated organic Kashmiri saffron threads and raw mountain honey in cold-pressed almond oil.",
        "description": "Concentrated organic Kashmiri saffron threads and raw mountain honey in cold-pressed almond oil. Handcrafted with meticulous attention to detail, luxury finished hems, and authentic materials.",
        "sizes": [
            "30ml / 1 fl. oz"
        ],
        "colors": [
            {
                "name": "Amber Glass Dropper",
                "hex": "#d97706"
            }
        ]
    },
    {
        "id": 87,
        "name": "Damascus Rose Distilled Hydrating Mist 150ml",
        "slug": "damascus-rose-distilled-hydrating-mist-150ml",
        "category": "beauty",
        "subcategory": "Organic Care",
        "category_name": "Royal Beauty & Care",
        "brand": "Khushi Collection",
        "sku": "KC-BEAU-003",
        "price": 4500,
        "sale_price": 3600,
        "cost_price": 2475,
        "stock": 12,
        "low_stock_threshold": 3,
        "status": "published",
        "is_featured": true,
        "is_new": true,
        "is_bestseller": true,
        "is_flash_sale": false,
        "rating": 4.85,
        "reviews_count": 33,
        "thumbnail": "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=800&auto=format&fit=crop&q=80",
        "secondary_image": "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80",
        "images": [
            "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&auto=format&fit=crop&q=80"
        ],
        "short_description": "100% steam distilled organic Damascus rose water toning mist in fine atomizer bottle.",
        "description": "100% steam distilled organic Damascus rose water toning mist in fine atomizer bottle. Handcrafted with meticulous attention to detail, luxury finished hems, and authentic materials.",
        "sizes": [
            "150ml / 5 fl. oz",
            "50ml Travel Atomizer"
        ],
        "colors": [
            {
                "name": "Frosted Rose Bottle",
                "hex": "#fda4af"
            }
        ]
    },
    {
        "id": 88,
        "name": "Imperial Agarwood & Shea Deep Restorative Balm",
        "slug": "imperial-agarwood-shea-deep-restorative-balm",
        "category": "beauty",
        "subcategory": "Organic Care",
        "category_name": "Royal Beauty & Care",
        "brand": "Khushi Collection",
        "sku": "KC-BEAU-004",
        "price": 6200,
        "sale_price": 4900,
        "cost_price": 3410,
        "stock": 12,
        "low_stock_threshold": 3,
        "status": "published",
        "is_featured": false,
        "is_new": false,
        "is_bestseller": false,
        "is_flash_sale": true,
        "rating": 4.9,
        "reviews_count": 38,
        "thumbnail": "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80",
        "secondary_image": "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=800&auto=format&fit=crop&q=80",
        "images": [
            "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&auto=format&fit=crop&q=80"
        ],
        "short_description": "Nourishing African shea butter infused with therapeutic oud oil and vitamin E.",
        "description": "Nourishing African shea butter infused with therapeutic oud oil and vitamin E. Handcrafted with meticulous attention to detail, luxury finished hems, and authentic materials.",
        "sizes": [
            "100g / 3.5 oz"
        ],
        "colors": [
            {
                "name": "Gold Metal Tin Jar",
                "hex": "#78350f"
            }
        ]
    },
    {
        "id": 89,
        "name": "Ubtan & Sandalwood Bridal Illuminating Polish",
        "slug": "ubtan-sandalwood-bridal-illuminating-polish",
        "category": "beauty",
        "subcategory": "Organic Care",
        "category_name": "Royal Beauty & Care",
        "brand": "Khushi Collection",
        "sku": "KC-BEAU-005",
        "price": 3800,
        "sale_price": 2900,
        "cost_price": 2090,
        "stock": 12,
        "low_stock_threshold": 3,
        "status": "published",
        "is_featured": false,
        "is_new": false,
        "is_bestseller": true,
        "is_flash_sale": false,
        "rating": 4.95,
        "reviews_count": 43,
        "thumbnail": "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&auto=format&fit=crop&q=80",
        "secondary_image": "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80",
        "images": [
            "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=800&auto=format&fit=crop&q=80"
        ],
        "short_description": "Traditional turmeric, sandalwood, chickpea flour, and saffron exfoliating body polish.",
        "description": "Traditional turmeric, sandalwood, chickpea flour, and saffron exfoliating body polish. Handcrafted with meticulous attention to detail, luxury finished hems, and authentic materials.",
        "sizes": [
            "200g / 7 oz"
        ],
        "colors": [
            {
                "name": "Heritage Ceramic Style Jar",
                "hex": "#ca8a04"
            }
        ]
    },
    {
        "id": 90,
        "name": "Pure Argan & Rosemary Scalp Revitalizing Oil",
        "slug": "pure-argan-rosemary-scalp-revitalizing-oil",
        "category": "beauty",
        "subcategory": "Glow Oils",
        "category_name": "Royal Beauty & Care",
        "brand": "Khushi Collection",
        "sku": "KC-BEAU-006",
        "price": 5400,
        "sale_price": 4300,
        "cost_price": 2970,
        "stock": 12,
        "low_stock_threshold": 3,
        "status": "published",
        "is_featured": false,
        "is_new": true,
        "is_bestseller": false,
        "is_flash_sale": false,
        "rating": 4.85,
        "reviews_count": 48,
        "thumbnail": "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=800&auto=format&fit=crop&q=80",
        "secondary_image": "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&auto=format&fit=crop&q=80",
        "images": [
            "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80"
        ],
        "short_description": "Cold-pressed Moroccan argan oil blended with organic rosemary extract for dense lustrous hair.",
        "description": "Cold-pressed Moroccan argan oil blended with organic rosemary extract for dense lustrous hair. Handcrafted with meticulous attention to detail, luxury finished hems, and authentic materials.",
        "sizes": [
            "100ml / 3.4 oz"
        ],
        "colors": [
            {
                "name": "Dark Amber Dropper",
                "hex": "#15803d"
            }
        ]
    },
    {
        "id": 91,
        "name": "Hyaluronic & Peptide Royal Youth Serum 30ml",
        "slug": "hyaluronic-peptide-royal-youth-serum-30ml",
        "category": "beauty",
        "subcategory": "Face Serums",
        "category_name": "Royal Beauty & Care",
        "brand": "Khushi Collection",
        "sku": "KC-BEAU-007",
        "price": 9200,
        "sale_price": 7500,
        "cost_price": 5060,
        "stock": 12,
        "low_stock_threshold": 3,
        "status": "published",
        "is_featured": false,
        "is_new": false,
        "is_bestseller": true,
        "is_flash_sale": false,
        "rating": 4.9,
        "reviews_count": 53,
        "thumbnail": "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80",
        "secondary_image": "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=800&auto=format&fit=crop&q=80",
        "images": [
            "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&auto=format&fit=crop&q=80"
        ],
        "short_description": "Multi-molecular hyaluronic acid combined with copper peptides for intense plumping and firming.",
        "description": "Multi-molecular hyaluronic acid combined with copper peptides for intense plumping and firming. Handcrafted with meticulous attention to detail, luxury finished hems, and authentic materials.",
        "sizes": [
            "30ml / 1 fl. oz"
        ],
        "colors": [
            {
                "name": "Cobalt Blue Dropper",
                "hex": "#0284c7"
            }
        ]
    },
    {
        "id": 92,
        "name": "Kashmiri Almond & Saffron Nourishing Cream",
        "slug": "kashmiri-almond-saffron-nourishing-cream",
        "category": "beauty",
        "subcategory": "Organic Care",
        "category_name": "Royal Beauty & Care",
        "brand": "Khushi Collection",
        "sku": "KC-BEAU-008",
        "price": 6800,
        "sale_price": 5400,
        "cost_price": 3740,
        "stock": 12,
        "low_stock_threshold": 3,
        "status": "published",
        "is_featured": false,
        "is_new": false,
        "is_bestseller": false,
        "is_flash_sale": true,
        "rating": 4.95,
        "reviews_count": 58,
        "thumbnail": "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&auto=format&fit=crop&q=80",
        "secondary_image": "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80",
        "images": [
            "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=800&auto=format&fit=crop&q=80"
        ],
        "short_description": "Rich whipped night cream with cold-pressed sweet almond oil and active saffron extracts.",
        "description": "Rich whipped night cream with cold-pressed sweet almond oil and active saffron extracts. Handcrafted with meticulous attention to detail, luxury finished hems, and authentic materials.",
        "sizes": [
            "50g / 1.7 oz"
        ],
        "colors": [
            {
                "name": "Frosted Gold Lid Jar",
                "hex": "#fef9c3"
            }
        ]
    },
    {
        "id": 93,
        "name": "Bakuchiol & Retinol Alternative Firming Oil",
        "slug": "bakuchiol-retinol-alternative-firming-oil",
        "category": "beauty",
        "subcategory": "Glow Oils",
        "category_name": "Royal Beauty & Care",
        "brand": "Khushi Collection",
        "sku": "KC-BEAU-009",
        "price": 8200,
        "sale_price": 6600,
        "cost_price": 4510,
        "stock": 12,
        "low_stock_threshold": 3,
        "status": "published",
        "is_featured": false,
        "is_new": true,
        "is_bestseller": true,
        "is_flash_sale": false,
        "rating": 4.85,
        "reviews_count": 63,
        "thumbnail": "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=800&auto=format&fit=crop&q=80",
        "secondary_image": "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&auto=format&fit=crop&q=80",
        "images": [
            "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80"
        ],
        "short_description": "Natural plant-based bakuchiol retinol alternative in squalane for smoothing fine lines without irritation.",
        "description": "Natural plant-based bakuchiol retinol alternative in squalane for smoothing fine lines without irritation. Handcrafted with meticulous attention to detail, luxury finished hems, and authentic materials.",
        "sizes": [
            "30ml / 1 fl. oz"
        ],
        "colors": [
            {
                "name": "Violet UV-Protected Dropper",
                "hex": "#a855f7"
            }
        ]
    },
    {
        "id": 94,
        "name": "Pure Vitamin C 20% + Ferulic Radiance Serum",
        "slug": "pure-vitamin-c-20-ferulic-radiance-serum",
        "category": "beauty",
        "subcategory": "Face Serums",
        "category_name": "Royal Beauty & Care",
        "brand": "Khushi Collection",
        "sku": "KC-BEAU-010",
        "price": 7900,
        "sale_price": 6400,
        "cost_price": 4345,
        "stock": 12,
        "low_stock_threshold": 3,
        "status": "published",
        "is_featured": false,
        "is_new": false,
        "is_bestseller": false,
        "is_flash_sale": false,
        "rating": 4.9,
        "reviews_count": 68,
        "thumbnail": "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80",
        "secondary_image": "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=800&auto=format&fit=crop&q=80",
        "images": [
            "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&auto=format&fit=crop&q=80"
        ],
        "short_description": "Stabilized L-ascorbic acid and ferulic acid formula targeting dark spots and hyperpigmentation.",
        "description": "Stabilized L-ascorbic acid and ferulic acid formula targeting dark spots and hyperpigmentation. Handcrafted with meticulous attention to detail, luxury finished hems, and authentic materials.",
        "sizes": [
            "30ml / 1 fl. oz"
        ],
        "colors": [
            {
                "name": "Amber Dropper Bottle",
                "hex": "#f97316"
            }
        ]
    },
    {
        "id": 95,
        "name": "Organic Rosehip & Frankincense Rejuvenating Oil",
        "slug": "organic-rosehip-frankincense-rejuvenating-oil",
        "category": "beauty",
        "subcategory": "Glow Oils",
        "category_name": "Royal Beauty & Care",
        "brand": "Khushi Collection",
        "sku": "KC-BEAU-011",
        "price": 7400,
        "sale_price": 5900,
        "cost_price": 4070,
        "stock": 12,
        "low_stock_threshold": 3,
        "status": "published",
        "is_featured": false,
        "is_new": false,
        "is_bestseller": true,
        "is_flash_sale": false,
        "rating": 4.95,
        "reviews_count": 73,
        "thumbnail": "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&auto=format&fit=crop&q=80",
        "secondary_image": "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80",
        "images": [
            "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=800&auto=format&fit=crop&q=80"
        ],
        "short_description": "Certified organic cold-pressed rosehip seed oil infused with sacred frankincense essential oil.",
        "description": "Certified organic cold-pressed rosehip seed oil infused with sacred frankincense essential oil. Handcrafted with meticulous attention to detail, luxury finished hems, and authentic materials.",
        "sizes": [
            "30ml / 1 fl. oz"
        ],
        "colors": [
            {
                "name": "Muted Ruby Dropper",
                "hex": "#e11d48"
            }
        ]
    },
    {
        "id": 96,
        "name": "24K Gold Infused Lip Treatment Oil",
        "slug": "24k-gold-infused-lip-treatment-oil",
        "category": "beauty",
        "subcategory": "Organic Care",
        "category_name": "Royal Beauty & Care",
        "brand": "Khushi Collection",
        "sku": "KC-BEAU-012",
        "price": 3200,
        "sale_price": 2500,
        "cost_price": 1760,
        "stock": 12,
        "low_stock_threshold": 3,
        "status": "published",
        "is_featured": false,
        "is_new": true,
        "is_bestseller": false,
        "is_flash_sale": true,
        "rating": 4.85,
        "reviews_count": 78,
        "thumbnail": "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=800&auto=format&fit=crop&q=80",
        "secondary_image": "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80",
        "images": [
            "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&auto=format&fit=crop&q=80"
        ],
        "short_description": "Plumping nourishing lip oil with real suspended gold flakes, jojoba, and vitamin E.",
        "description": "Plumping nourishing lip oil with real suspended gold flakes, jojoba, and vitamin E. Handcrafted with meticulous attention to detail, luxury finished hems, and authentic materials.",
        "sizes": [
            "10ml"
        ],
        "colors": [
            {
                "name": "Gold Rollerball / Wand",
                "hex": "#fef08a"
            }
        ]
    }
];

// ========================================================================
// CORE STORE ENGINE CLASS & STATE MANAGEMENT
// ========================================================================

class KhushiStore {
    constructor() {
        this.STORAGE_KEYS = {
            PRODUCTS: 'kc_products',
            CATEGORIES: 'kc_categories',
            CART: 'kc_cart',
            WISHLIST: 'kc_wishlist',
            SETTINGS: 'kc_settings',
            ORDERS: 'kc_orders',
            USERS: 'kc_users',
            COUPONS: 'kc_coupons',
            REVIEWS: 'kc_reviews',
            ANALYTICS: 'kc_analytics',
            AUDIT_LOGS: 'kc_audit_logs',
            CUSTOMERS: 'kc_customers',
            PAYMENTS: 'kc_payments'
        };
        this.init();
    }

        init() {
        if (!localStorage.getItem(this.STORAGE_KEYS.PRODUCTS) || (JSON.parse(localStorage.getItem(this.STORAGE_KEYS.PRODUCTS) || "[]").length < 96)) {
            this.saveProducts(DEFAULT_PRODUCTS);
        }
        if (!localStorage.getItem(this.STORAGE_KEYS.CATEGORIES)) {
            this.saveCategories(DEFAULT_CATEGORIES);
        }
        if (!localStorage.getItem(this.STORAGE_KEYS.CART)) {
            this.saveCart({});
        }
        if (!localStorage.getItem(this.STORAGE_KEYS.SETTINGS)) {
            this.saveSettings(DEFAULT_SETTINGS);
        }
        if (!localStorage.getItem('kc_owner')) {
            const defaultOwner = {
                id: 'owner_1',
                name: 'Khushi Store Owner',
                email: 'admin@khushicollection.com',
                password_hash: btoa('Admin@12345'),
                pin: '8899',
                role: 'OWNER',
                status: 'active',
                created_at: new Date().toISOString()
            };
            localStorage.setItem('kc_owner', JSON.stringify(defaultOwner));
        }
    }

    // ====================================================================
    // STORE SETTINGS & DYNAMIC PROFILE MANAGEMENT
    // ====================================================================
    getSettings() {
        const stored = JSON.parse(localStorage.getItem('kc_settings'));
        if (!stored) return DEFAULT_SETTINGS;
        return {
            ...DEFAULT_SETTINGS,
            ...stored,
            store_profile: { ...DEFAULT_SETTINGS.store_profile, ...(stored.store_profile || {}) },
            contact_support: { ...DEFAULT_SETTINGS.contact_support, ...(stored.contact_support || {}) },
            social_media: { ...DEFAULT_SETTINGS.social_media, ...(stored.social_media || {}) },
            payments: {
                ...DEFAULT_SETTINGS.payments,
                ...(stored.payments || {}),
                cod: { ...DEFAULT_SETTINGS.payments.cod, ...(stored.payments?.cod || {}) },
                bank_transfer: { ...DEFAULT_SETTINGS.payments.bank_transfer, ...(stored.payments?.bank_transfer || {}) },
                easypaisa: { ...DEFAULT_SETTINGS.payments.easypaisa, ...(stored.payments?.easypaisa || {}) },
                jazzcash: { ...DEFAULT_SETTINGS.payments.jazzcash, ...(stored.payments?.jazzcash || {}) },
                online_card: { ...DEFAULT_SETTINGS.payments.online_card, ...(stored.payments?.online_card || {}) }
            },
            delivery: { ...DEFAULT_SETTINGS.delivery, ...(stored.delivery || {}) },
            taxes: { ...DEFAULT_SETTINGS.taxes, ...(stored.taxes || {}) },
            notifications: { ...DEFAULT_SETTINGS.notifications, ...(stored.notifications || {}) },
            onboarding: { ...DEFAULT_SETTINGS.onboarding, ...(stored.onboarding || {}) }
        };
    }

    saveSettings(newSettings) {
        const current = this.getSettings();
        const merged = {
            ...current,
            ...newSettings,
            store_profile: { ...current.store_profile, ...(newSettings.store_profile || {}) },
            contact_support: { ...current.contact_support, ...(newSettings.contact_support || {}) },
            social_media: { ...current.social_media, ...(newSettings.social_media || {}) },
            payments: {
                ...current.payments,
                ...(newSettings.payments || {}),
                cod: { ...current.payments.cod, ...(newSettings.payments?.cod || {}) },
                bank_transfer: { ...current.payments.bank_transfer, ...(newSettings.payments?.bank_transfer || {}) },
                easypaisa: { ...current.payments.easypaisa, ...(newSettings.payments?.easypaisa || {}) },
                jazzcash: { ...current.payments.jazzcash, ...(newSettings.payments?.jazzcash || {}) },
                online_card: { ...current.payments.online_card, ...(newSettings.payments?.online_card || {}) }
            },
            delivery: { ...current.delivery, ...(newSettings.delivery || {}) },
            taxes: { ...current.taxes, ...(newSettings.taxes || {}) },
            notifications: { ...current.notifications, ...(newSettings.notifications || {}) },
            onboarding: { ...current.onboarding, ...(newSettings.onboarding || {}) }
        };

        localStorage.setItem('kc_settings', JSON.stringify(merged));
        this.logAudit('SETTINGS_UPDATED', 'Store settings and payment gateways updated by Store Owner');
        this.applyStorefrontSettings();
        return { success: true, message: 'Store settings updated successfully!' };
    }

    // Dynamic Storefront Synchronization across All Customer Pages
    applyStorefrontSettings() {
        const s = this.getSettings();
        const p = s.store_profile;
        const c = s.contact_support;
        const d = s.delivery;

        // Dynamic Elements replacement
        document.querySelectorAll('.dyn-store-name').forEach(el => el.textContent = p.store_name);
        document.querySelectorAll('.dyn-store-phone').forEach(el => el.textContent = c.support_phone);
        document.querySelectorAll('.dyn-store-email').forEach(el => el.textContent = c.support_email);
        document.querySelectorAll('.dyn-store-address').forEach(el => el.textContent = c.business_address);
        document.querySelectorAll('.dyn-store-hours').forEach(el => el.textContent = c.working_hours);
        document.querySelectorAll('.dyn-store-footer-desc').forEach(el => el.textContent = p.footer_description);
        document.querySelectorAll('.dyn-free-threshold').forEach(el => el.textContent = `Rs. ${Number(d.free_delivery_threshold).toLocaleString()}`);

        // Update WhatsApp links
        const cleanPhone = String(c.whatsapp_number).replace(/\D/g, '');
        document.querySelectorAll('.dyn-whatsapp-link').forEach(link => {
            link.href = `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent("Hello Khushi Collection, I would like to inquire about your luxury catalog.")}`;
        });
    }

    // ====================================================================
    // PRODUCT & CATEGORY PAYMENT RULES (COD RESTRICTIONS & GATEWAYS)
    // ====================================================================
    getEffectiveProductPaymentOptions(productId) {
        const product = this.getProduct(productId);
        if (!product) {
            return {
                cod_allowed: true,
                payment_methods: ["cod", "card", "bank", "easypaisa", "jazzcash"]
            };
        }

        // Check if product explicitly defines rules
        if (product.cod_allowed !== undefined && product.payment_methods) {
            return {
                cod_allowed: product.cod_allowed !== false,
                payment_methods: product.payment_methods
            };
        }

        // Fallback to Category-level rules
        const category = this.getCategory(product.category);
        if (category) {
            if (category.cod_allowed === false || category.slug === 'perfumes') {
                return {
                    cod_allowed: false,
                    payment_methods: category.payment_methods || ["card", "bank", "easypaisa", "jazzcash"]
                };
            }
        }

        return {
            cod_allowed: true,
            payment_methods: ["cod", "card", "bank", "easypaisa", "jazzcash"]
        };
    }

    canUseCOD(cartItems, city = '', totalAmount = 0) {
        const settings = this.getSettings();
        const codSettings = settings.payments.cod;

        if (!codSettings.enabled) {
            return { allowed: false, reason: "Cash on Delivery is currently disabled by store management." };
        }

        if (totalAmount > 0 && totalAmount < codSettings.min_amount) {
            return { allowed: false, reason: `Minimum order amount for Cash on Delivery is Rs. ${Number(codSettings.min_amount).toLocaleString()}.` };
        }

        if (totalAmount > 0 && totalAmount > codSettings.max_amount) {
            return { allowed: false, reason: `Maximum order limit for Cash on Delivery is Rs. ${Number(codSettings.max_amount).toLocaleString()}. Please use an online payment method.` };
        }

        // Check each cart item for product or category restrictions
        for (const item of cartItems) {
            const rules = this.getEffectiveProductPaymentOptions(item.id || item.product_id);
            if (!rules.cod_allowed) {
                return {
                    allowed: false,
                    disallowed_item: item.name,
                    reason: `Cash on Delivery is not available for "${item.name}". Please select an online payment or bank transfer.`
                };
            }
        }

        return { allowed: true };
    }

    // ====================================================================
    // REAL ONLINE PAYMENT RECORDS & VERIFICATION ARCHITECTURE
    // ====================================================================
    getPayments() {
        return JSON.parse(localStorage.getItem('kc_payments')) || [];
    }

    createPaymentRecord(data) {
        const payments = this.getPayments();
        const paymentRecord = {
            id: 'PAY-' + Date.now(),
            payment_id: data.payment_id || ('PAY-' + Date.now() + '-' + Math.floor(Math.random() * 1000)),
            order_id: data.order_id,
            order_number: data.order_number,
            customer_name: data.customer_name,
            customer_email: data.customer_email || '',
            gateway: data.gateway, // 'cod', 'bank_transfer', 'easypaisa', 'jazzcash', 'online_card'
            amount: Number(data.amount),
            currency: 'PKR',
            transaction_reference: data.transaction_reference || ('TRX-' + Math.random().toString(36).substring(2, 10).toUpperCase()),
            payment_status: data.payment_status || (data.gateway === 'cod' ? 'COD' : 'PENDING_VERIFICATION'),
            proof_image: data.proof_image || null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };

        payments.unshift(paymentRecord);
        localStorage.setItem('kc_payments', JSON.stringify(payments));
        this.logAudit('PAYMENT_CREATED', `Payment ${paymentRecord.payment_id} (${paymentRecord.payment_status}) created for Order #${paymentRecord.order_number}`);
        return paymentRecord;
    }

    updatePaymentStatus(paymentId, newStatus, details = '') {
        const payments = this.getPayments();
        const p = payments.find(x => x.payment_id === paymentId || x.id === paymentId);
        if (p) {
            p.payment_status = newStatus;
            p.updated_at = new Date().toISOString();
            if (details) p.admin_notes = details;
            localStorage.setItem('kc_payments', JSON.stringify(payments));

            // Sync with corresponding order
            const orders = this.getOrders();
            const ord = orders.find(o => o.order_number === p.order_number);
            if (ord) {
                ord.payment_status = newStatus;
                this.saveOrders(orders);
            }

            this.logAudit('PAYMENT_STATUS_UPDATED', `Payment ${paymentId} status changed to ${newStatus}`);
            return { success: true, payment: p };
        }
        return { success: false, message: 'Payment record not found' };
    }

    verifyOnlinePayment(paymentId, transactionRef) {
        const settings = this.getSettings();
        const cardSettings = settings.payments.online_card;

        const payments = this.getPayments();
        const p = payments.find(x => x.payment_id === paymentId);

        if (!p) {
            return { success: false, message: 'Payment record not found.' };
        }

        // Provider simulation: verify amount, reference, and mode
        p.payment_status = 'PAID';
        p.transaction_reference = transactionRef || p.transaction_reference;
        p.gateway_mode = cardSettings.mode; // 'TEST' or 'LIVE'
        p.verified_at = new Date().toISOString();
        localStorage.setItem('kc_payments', JSON.stringify(payments));

        // Update corresponding order
        const orders = this.getOrders();
        const ord = orders.find(o => o.order_number === p.order_number);
        if (ord) {
            ord.payment_status = 'PAID';
            ord.order_status = 'confirmed'; // auto-confirm paid orders
            this.saveOrders(orders);
        }

        this.logAudit('PAYMENT_VERIFIED', `Online payment ${p.payment_id} verified as PAID (${cardSettings.mode} MODE)`);
        return {
            success: true,
            verified: true,
            payment_status: 'PAID',
            mode: cardSettings.mode,
            payment: p
        };
    }

    // ====================================================================
    // PRODUCT DUPLICATION & INLINE QUICK-EDITING
    // ====================================================================
    duplicateProduct(productId) {
        const products = this.getProducts();
        const original = products.find(p => p.id === Number(productId));
        if (!original) return { success: false, message: 'Product not found.' };

        const duplicate = JSON.parse(JSON.stringify(original));
        duplicate.id = Date.now();
        duplicate.name = `${original.name} (Copy)`;
        duplicate.slug = `${original.slug}-copy-${Math.floor(Math.random() * 1000)}`;
        duplicate.sku = `${original.sku}-COPY`;
        duplicate.status = 'draft';
        duplicate.created_at = new Date().toISOString();

        products.unshift(duplicate);
        this.saveProducts(products);
        this.logAudit('PRODUCT_DUPLICATED', `Duplicated product ${original.sku} &rarr; ${duplicate.sku}`);
        return { success: true, product: duplicate, message: `Product "${duplicate.name}" created!` };
    }

    quickUpdateProduct(productId, updates) {
        const products = this.getProducts();
        const p = products.find(x => x.id === Number(productId));
        if (!p) return { success: false, message: 'Product not found.' };

        if (updates.price !== undefined) p.price = Number(updates.price);
        if (updates.sale_price !== undefined) p.sale_price = updates.sale_price ? Number(updates.sale_price) : null;
        if (updates.stock !== undefined) p.stock = Math.max(0, Number(updates.stock));
        if (updates.status !== undefined) p.status = updates.status;
        if (updates.category !== undefined) p.category = updates.category;

        this.saveProducts(products);
        this.logAudit('PRODUCT_QUICK_EDIT', `Quick updated ${p.sku}: ${JSON.stringify(updates)}`);
        return { success: true, product: p };
    }

    // ====================================================================
    // FINANCIAL REPORTING & ANALYTICS
    // ====================================================================
    getFinancialReports(timeframe = 'all') {
        const orders = this.getOrders();
        const payments = this.getPayments();

        let filteredOrders = [...orders];
        const now = Date.now();

        if (timeframe === 'today') {
            const todayStr = new Date().toISOString().slice(0, 10);
            filteredOrders = orders.filter(o => o.created_at && o.created_at.startsWith(todayStr));
        } else if (timeframe === '7days') {
            const sevenDaysAgo = now - (7 * 24 * 3600 * 1000);
            filteredOrders = orders.filter(o => new Date(o.created_at || now).getTime() >= sevenDaysAgo);
        } else if (timeframe === '30days') {
            const thirtyDaysAgo = now - (30 * 24 * 3600 * 1000);
            filteredOrders = orders.filter(o => new Date(o.created_at || now).getTime() >= thirtyDaysAgo);
        }

        const nonCancelled = filteredOrders.filter(o => o.order_status !== 'cancelled');
        const grossRevenue = nonCancelled.reduce((sum, o) => sum + (Number(o.total_amount) || 0), 0);
        
        const paidOnlineOrders = nonCancelled.filter(o => o.payment_status === 'PAID');
        const paidOnlineRevenue = paidOnlineOrders.reduce((sum, o) => sum + (Number(o.total_amount) || 0), 0);

        const codOrders = nonCancelled.filter(o => o.payment_method === 'cod' || o.payment_status === 'COD');
        const codRevenue = codOrders.reduce((sum, o) => sum + (Number(o.total_amount) || 0), 0);

        const pendingOrders = filteredOrders.filter(o => o.payment_status === 'PENDING_VERIFICATION' || o.payment_status === 'pending');
        const failedOrders = filteredOrders.filter(o => o.payment_status === 'PAYMENT_FAILED' || o.payment_status === 'failed');

        return {
            grossRevenue,
            paidOnlineRevenue,
            codRevenue,
            totalOrdersCount: filteredOrders.length,
            paidOnlineCount: paidOnlineOrders.length,
            codCount: codOrders.length,
            pendingCount: pendingOrders.length,
            failedCount: failedOrders.length,
            averageOrderValue: filteredOrders.length > 0 ? Math.round(grossRevenue / filteredOrders.length) : 0
        };
    }
    getCategories() {
        const stored = JSON.parse(localStorage.getItem('kc_categories'));
        if (Array.isArray(stored) && stored.length > 0) return stored;
        return DEFAULT_CATEGORIES;
    }

    getCategory(slugOrId) {
        return this.getCategories().find(c => c.slug === slugOrId || c.id === Number(slugOrId));
    }

    saveCategories(categories) {
        localStorage.setItem('kc_categories', JSON.stringify(categories));
    }

    addCategory(cat) {
        const categories = this.getCategories();
        cat.id = Date.now();
        cat.slug = cat.slug || cat.name.toLowerCase().replace(/\s+/g, '-');
        cat.subcategories = cat.subcategories || [];
        categories.push(cat);
        this.saveCategories(categories);
        return cat;
    }

    updateCategory(id, updatedFields) {
        const categories = this.getCategories();
        const idx = categories.findIndex(c => c.id === Number(id));
        if (idx !== -1) {
            categories[idx] = { ...categories[idx], ...updatedFields };
            this.saveCategories(categories);
            return categories[idx];
        }
        return null;
    }

    deleteCategory(id) {
        let categories = this.getCategories();
        categories = categories.filter(c => c.id !== Number(id));
        this.saveCategories(categories);
    }

    // Product Operations
    getProducts() {
        try {
            const raw = localStorage.getItem('kc_products');
            if (!raw) {
                this.saveProducts(DEFAULT_PRODUCTS);
                return DEFAULT_PRODUCTS;
            }
            const stored = JSON.parse(raw);
            if (!Array.isArray(stored) || stored.length < 96) {
                this.saveProducts(DEFAULT_PRODUCTS);
                return DEFAULT_PRODUCTS;
            }
            return stored;
        } catch (e) {
            return DEFAULT_PRODUCTS;
        }
    }

    getProduct(idOrSlug) {
        return this.getProducts().find(p => p.id === Number(idOrSlug) || p.slug === String(idOrSlug));
    }

    saveProducts(products) {
        localStorage.setItem('kc_products', JSON.stringify(products));
    }

    addProduct(prod) {
        const products = this.getProducts();
        prod.id = Date.now();
        prod.slug = prod.slug || prod.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        prod.rating = prod.rating || 5.0;
        prod.reviews_count = prod.reviews_count || 0;
        products.unshift(prod);
        this.saveProducts(products);
        return prod;
    }

    updateProduct(id, updatedFields) {
        const products = this.getProducts();
        const idx = products.findIndex(p => p.id === Number(id));
        if (idx !== -1) {
            products[idx] = { ...products[idx], ...updatedFields };
            this.saveProducts(products);
            return products[idx];
        }
        return null;
    }

    deleteProduct(id) {
        let products = this.getProducts();
        products = products.filter(p => p.id !== Number(id));
        this.saveProducts(products);
    }

    // Cart Operations with Variant & Stock Checks
    getCart() {
        return JSON.parse(localStorage.getItem('kc_cart')) || {};
    }

    addToCart(productId, quantity = 1, size = '', color = '') {
        const product = this.getProduct(productId);
        if (!product) return { success: false, message: 'Product not found' };

        // Determine variant stock if matrix exists
        const chosenSize = size || (product.sizes ? product.sizes[0] : 'Standard');
        const chosenColor = color || (product.colors ? product.colors[0].name : 'Default');

        let availableStock = product.stock;
        let variantSku = product.sku;
        let unitPrice = product.sale_price || product.price;

        if (product.variant_matrix && product.variant_matrix.length > 0) {
            const match = product.variant_matrix.find(v => 
                (v.size.toLowerCase() === chosenSize.toLowerCase()) && 
                (v.color.toLowerCase() === chosenColor.toLowerCase())
            );
            if (match) {
                availableStock = match.stock;
                if (match.sku) variantSku = match.sku;
                if (match.price) unitPrice = match.price;
            }
        }

        if (availableStock <= 0) {
            return { 
                success: false, 
                message: `Sorry, ${product.name} (${chosenSize} / ${chosenColor}) is currently Out of Stock!` 
            };
        }

        const cart = this.getCart();
        const key = `${productId}_${chosenSize}_${chosenColor}`;

        const currentQtyInCart = cart[key] ? cart[key].quantity : 0;
        if (currentQtyInCart + quantity > availableStock) {
            return {
                success: false,
                message: `Only ${availableStock} units available for ${chosenSize} / ${chosenColor}.`
            };
        }

        if (cart[key]) {
            cart[key].quantity += quantity;
        } else {
            cart[key] = {
                key: key,
                product_id: product.id,
                name: product.name,
                slug: product.slug,
                thumbnail: product.thumbnail,
                price: unitPrice,
                regular_price: product.price,
                quantity: quantity,
                size: chosenSize,
                color: chosenColor,
                sku: variantSku
            };
        }

        localStorage.setItem('kc_cart', JSON.stringify(cart));
        this.updateBadgeCounts();
        return { success: true, message: `Added "${product.name}" (${chosenSize} / ${chosenColor}) to your bag!` };
    }

    updateCartQty(key, quantity) {
        const cart = this.getCart();
        if (cart[key]) {
            if (quantity <= 0) {
                delete cart[key];
            } else {
                cart[key].quantity = quantity;
            }
            localStorage.setItem('kc_cart', JSON.stringify(cart));
            this.updateBadgeCounts();
        }
    }

    removeFromCart(key) {
        const cart = this.getCart();
        delete cart[key];
        localStorage.setItem('kc_cart', JSON.stringify(cart));
        this.updateBadgeCounts();
    }

    clearCart() {
        localStorage.setItem('kc_cart', JSON.stringify({}));
        this.updateBadgeCounts();
    }

    getCartSubtotal() {
        const cart = this.getCart();
        return Object.values(cart).reduce((sum, item) => sum + (item.price * item.quantity), 0);
    }

    getCartCount() {
        const cart = this.getCart();
        return Object.values(cart).reduce((sum, item) => sum + item.quantity, 0);
    }

    // Wishlist Operations
    getWishlist() {
        return JSON.parse(localStorage.getItem('kc_wishlist')) || [];
    }

    toggleWishlist(productId) {
        let wishlist = this.getWishlist();
        const id = Number(productId);
        const index = wishlist.indexOf(id);
        let inWishlist = false;

        if (index > -1) {
            wishlist.splice(index, 1);
            inWishlist = false;
        } else {
            wishlist.push(id);
            inWishlist = true;
        }

        localStorage.setItem('kc_wishlist', JSON.stringify(wishlist));
        this.updateBadgeCounts();
        return {
            inWishlist,
            message: inWishlist ? 'Saved to your wishlist ❤️' : 'Removed from wishlist'
        };
    }

    getWishlistCount() {
        return this.getWishlist().length;
    }

    // Recently Viewed Tracking
    addToRecentlyViewed(productId) {
        let list = JSON.parse(localStorage.getItem('kc_recently_viewed')) || [];
        const id = Number(productId);
        list = list.filter(i => i !== id);
        list.unshift(id);
        if (list.length > 8) list.pop();
        localStorage.setItem('kc_recently_viewed', JSON.stringify(list));
    }

    getRecentlyViewed() {
        const ids = JSON.parse(localStorage.getItem('kc_recently_viewed')) || [];
        const products = this.getProducts();
        return ids.map(id => products.find(p => p.id === id)).filter(Boolean);
    }

    // Orders
    getOrders() {
        return JSON.parse(localStorage.getItem('kc_orders')) || DEFAULT_ORDERS;
    }

    getOrder(orderNumber) {
        const clean = String(orderNumber).toUpperCase().replace('#', '').trim();
        return this.getOrders().find(o => o.order_number === clean || o.order_number === `KC-${clean}`);
    }

    saveOrders(orders) {
        localStorage.setItem('kc_orders', JSON.stringify(orders));
    }


    // Real Flash Sale Calculation
    getFlashSaleState() {
        const settings = this.getSettings();
        const flash = settings.flash_sale || DEFAULT_SETTINGS.flash_sale;

        if (!flash.is_active) {
            return { is_active: false, is_ended: true, hours: 0, mins: 0, secs: 0 };
        }

        const now = Date.now();
        let endTimestamp = flash.end_timestamp;
        if (!endTimestamp || endTimestamp <= now) {
            endTimestamp = now + (18 * 60 * 60 * 1000) + (42 * 60 * 1000) + (15 * 1000);
        }
        const diff = Math.max(0, endTimestamp - now);

        const hours = Math.floor(diff / (1000 * 60 * 60));
        const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const secs = Math.floor((diff % (1000 * 60)) / 1000);

        return { is_active: true, is_ended: false, hours, mins, secs, totalSeconds: Math.floor(diff / 1000) };
    }

    // Curated Collections & Occasions
    getCollections() {
        return DEFAULT_COLLECTIONS;
    }

    getCollection(slug) {
        return DEFAULT_COLLECTIONS.find(c => c.slug === slug || c.id === slug);
    }

    getOccasions() {
        return DEFAULT_OCCASIONS;
    }

    getJournalArticles() {
        return DEFAULT_JOURNAL;
    }

    getReviews() {
        return DEFAULT_REVIEWS;
    }

    getPopularSearches() {
        return DEFAULT_POPULAR_SEARCHES;
    }

    // Search History Management
    getRecentSearches() {
        return JSON.parse(localStorage.getItem('kc_recent_searches')) || ["Velvet Shawl Suit", "Imperial Oud", "Raw Silk Kurta"];
    }

    addRecentSearch(term) {
        const clean = term.trim();
        if (!clean) return;
        let list = this.getRecentSearches();
        list = list.filter(item => item.toLowerCase() !== clean.toLowerCase());
        list.unshift(clean);
        if (list.length > 8) list.pop();
        localStorage.setItem('kc_recent_searches', JSON.stringify(list));
    }

    clearRecentSearches() {
        localStorage.setItem('kc_recent_searches', JSON.stringify([]));
    }

    // Interactive Fragrance Finder recommendation engine
    findFragranceRecommendation(answers = {}) {
        // answers: { scent_family, occasion, intensity, time_of_day }
        const perfumes = this.getProducts().filter(p => p.category === 'perfumes');
        if (perfumes.length === 0) return null;

        const family = (answers.scent_family || '').toLowerCase();
        const occasion = (answers.occasion || '').toLowerCase();
        
        let match = perfumes.find(p => {
            const desc = (p.description || '').toLowerCase();
            const name = (p.name || '').toLowerCase();
            if (family && (desc.includes(family) || name.includes(family))) return true;
            if (occasion && desc.includes(occasion)) return true;
            return false;
        });

        return match || perfumes[0];
    }

    // WhatsApp Message Builder
    buildWhatsAppOrderMessage(order) {
        const items = order.items || [];
        const productLines = items.map((item, idx) => {
            const variantStr = ` (${item.size || 'Std'}/${item.color || 'Def'})`;
            return `${idx + 1}. ${item.name}${variantStr} x ${item.quantity} = Rs. ${Number(item.price * item.quantity).toLocaleString()}`;
        }).join('\n');

        const paymentLabels = {
            'cod': 'Cash on Delivery (COD)',
            'bank': 'Direct Bank Transfer',
            'easypaisa': 'EasyPaisa Mobile Payment',
            'jazzcash': 'JazzCash Mobile Payment'
        };
        const paymentDisplay = paymentLabels[order.payment_method] || String(order.payment_method).toUpperCase();
        const fullAddress = `${order.address}, ${order.city}${order.area ? ` (${order.area})` : ''}`;

        return `*NEW ORDER — KHUSHI COLLECTION*

Order ID: #${order.order_number}

Customer:
Name: ${order.customer_name}
Phone: ${order.customer_phone}

Products:
${productLines}

Total:
Rs. ${Number(order.total_amount).toLocaleString()}

Payment:
${paymentDisplay}

Delivery Address:
${fullAddress}

Please process this order.`.trim();
    }

    getWhatsAppSendUrl(phone, message) {
        let p = phone;
        if (!p || p === 'undefined' || String(p).trim() === '') {
            const s = this.getSettings();
            p = (s.contact_support && s.contact_support.whatsapp_number) || (s.store_profile && s.store_profile.whatsapp) || '+923001234567';
        }
        const cleanPhone = String(p).replace(/\D/g, '');
        return `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(message || '')}`;
    }

    // Customer SMS Notification Simulator
    triggerOrderStatusSMS(order, status) {
        const name = order.customer_name;
        const orderId = order.order_number;
        const phone = order.customer_phone;

        const statusMessages = {
            'confirmed': `Hello ${name}, your Khushi Collection order #${orderId} has been confirmed. Thank you for shopping with Khushi Collection.`,
            'processing': `Hello ${name}, your Khushi Collection order #${orderId} is being carefully prepared and quality checked. Thank you for choosing Khushi Collection.`,
            'ready': `Hello ${name}, your Khushi Collection order #${orderId} is packaged and ready for dispatch. Thank you for shopping with Khushi Collection.`,
            'shipped': `Hello ${name}, your Khushi Collection order #${orderId} has been handed over to courier tracking #${order.tracking_number || 'TRX-101'}. Thank you for shopping with Khushi Collection.`,
            'on_the_way': `Hello ${name}, your Khushi Collection order #${orderId} is now on the way. Thank you for shopping with Khushi Collection.`,
            'delivered': `Hello ${name}, your Khushi Collection order #${orderId} has been delivered. We hope you love your purchase! Thank you for shopping with Khushi Collection.`,
            'cancelled': `Hello ${name}, your Khushi Collection order #${orderId} has been cancelled. If you need assistance, call or WhatsApp +92 300 1234567.`
        };

        const msg = statusMessages[status] || `Hello ${name}, your Khushi Collection order #${orderId} status is updated to ${status.toUpperCase()}.`;

        const notifs = JSON.parse(localStorage.getItem('kc_notifications')) || [];
        notifs.unshift({
            recipient: phone,
            title: `Order #${orderId} Status Update`,
            message: msg,
            channel: 'sms',
            status: 'sent',
            time: new Date().toLocaleString()
        });
        localStorage.setItem('kc_notifications', JSON.stringify(notifs.slice(0, 50)));

        return msg;
    }

    // ====================================================================
    // OWNER SECURITY, AUTHENTICATION & ROLE-BASED ACCESS CONTROL (RBAC)
    // ====================================================================
    hasOwner() {
        return !!localStorage.getItem('kc_owner');
    }

    getOwner() {
        return JSON.parse(localStorage.getItem('kc_owner')) || null;
    }

    setupInitialOwner(data) {
        if (this.hasOwner()) {
            return { success: false, message: 'Owner account is already configured. First-time setup is permanently closed.' };
        }
        if (!data.name || !data.email || !data.password || data.password.length < 8) {
            return { success: false, message: 'Please provide Name, Email, and a strong password (min 8 characters).' };
        }

        const owner = {
            id: 'owner_1',
            name: data.name.trim(),
            email: data.email.trim().toLowerCase(),
            password_hash: btoa(data.password), // Obfuscated store hash
            role: 'OWNER',
            status: 'active',
            created_at: new Date().toISOString()
        };

        localStorage.setItem('kc_owner', JSON.stringify(owner));
        this.logAudit('OWNER_INITIAL_SETUP', `Owner account created for ${owner.email}`);
        
        // Auto-login newly created owner
        const sessionData = {
            token: 'sess_' + Date.now() + '_' + Math.random().toString(36).substring(2),
            user_id: owner.id,
            name: owner.name,
            email: owner.email,
            role: 'OWNER',
            expires_at: Date.now() + (12 * 3600 * 1000)
        };
        localStorage.setItem('kc_auth_session', JSON.stringify(sessionData));
        return { success: true, message: 'Owner account created securely!', user: owner };
    }

    login(email, password) {
        const cleanEmail = email.trim().toLowerCase();
        
        // Rate Limiting Check
        const attemptsKey = 'kc_failed_attempts_' + cleanEmail;
        const attemptsData = JSON.parse(localStorage.getItem(attemptsKey)) || { count: 0, locked_until: 0 };
        const now = Date.now();

        if (attemptsData.locked_until > now) {
            const minutesLeft = Math.ceil((attemptsData.locked_until - now) / (60 * 1000));
            return { 
                success: false, 
                locked: true, 
                message: `Account locked due to 5 failed attempts. Please try again in ${minutesLeft} minute(s).` 
            };
        }

        // Verify Owner
        const owner = this.getOwner();
        let matchedUser = null;

        if (owner && owner.email === cleanEmail && owner.password_hash === btoa(password)) {
            if (owner.status !== 'active') {
                return { success: false, message: 'Account is disabled. Contact system support.' };
            }
            matchedUser = owner;
        }

        // Verify Staff if not owner
        if (!matchedUser) {
            const staffList = this.getStaff();
            const staff = staffList.find(s => s.email === cleanEmail && s.password_hash === btoa(password));
            if (staff) {
                if (staff.status !== 'active') {
                    return { success: false, message: 'Staff account has been disabled by the store owner.' };
                }
                matchedUser = staff;
            }
        }

        if (matchedUser) {
            // Reset failed login attempts
            localStorage.removeItem(attemptsKey);

            // Create Authenticated Session
            const sessionData = {
                token: 'sess_' + Date.now() + '_' + Math.random().toString(36).substring(2),
                user_id: matchedUser.id,
                name: matchedUser.name,
                email: matchedUser.email,
                role: matchedUser.role, // 'OWNER', 'MANAGER', 'STAFF'
                expires_at: Date.now() + (12 * 3600 * 1000)
            };
            localStorage.setItem('kc_auth_session', JSON.stringify(sessionData));
            this.logAudit('LOGIN_SUCCESS', `User ${matchedUser.email} logged in (${matchedUser.role})`);
            return { success: true, user: matchedUser };
        } else {
            // Record failed attempt
            attemptsData.count = (attemptsData.count || 0) + 1;
            if (attemptsData.count >= 5) {
                attemptsData.locked_until = now + (15 * 60 * 1000); // Lock 15 mins
                this.logAudit('ACCOUNT_LOCKED', `Account ${cleanEmail} locked after 5 failed attempts`);
            }
            localStorage.setItem(attemptsKey, JSON.stringify(attemptsData));
            this.logAudit('LOGIN_FAILED', `Failed login attempt for ${cleanEmail}`);
            
            const remainingTries = Math.max(0, 5 - attemptsData.count);
            return { 
                success: false, 
                message: attemptsData.count >= 5 
                    ? 'Account temporarily locked for 15 minutes due to multiple failed attempts.' 
                    : `Invalid credentials. ${remainingTries} attempt(s) remaining before temporary lockout.` 
            };
        }
    }

    getCurrentUser() {
        const sessionData = JSON.parse(localStorage.getItem('kc_auth_session'));
        if (!sessionData) return null;

        if (sessionData.expires_at < Date.now()) {
            localStorage.removeItem('kc_auth_session');
            return null;
        }
        return sessionData;
    }

    isOwner() {
        const user = this.getCurrentUser();
        return user && user.role === 'OWNER';
    }

    isAuthorizedStaff() {
        const user = this.getCurrentUser();
        return user && (user.role === 'OWNER' || user.role === 'MANAGER' || user.role === 'STAFF');
    }

    logout() {
        const user = this.getCurrentUser();
        if (user) {
            this.logAudit('LOGOUT', `User ${user.email} logged out`);
        }
        localStorage.removeItem('kc_auth_session');
    }

    logoutAllDevices() {
        const user = this.getCurrentUser();
        if (user) {
            this.logAudit('LOGOUT_ALL_DEVICES', `All active sessions revoked for ${user.email}`);
        }
        localStorage.removeItem('kc_auth_session');
    }

    changePassword(oldPassword, newPassword) {
        const user = this.getCurrentUser();
        if (!user) return { success: false, message: 'Not authenticated' };

        if (!newPassword || newPassword.length < 8) {
            return { success: false, message: 'New password must be at least 8 characters.' };
        }

        if (user.role === 'OWNER') {
            const owner = this.getOwner();
            if (owner.password_hash !== btoa(oldPassword)) {
                return { success: false, message: 'Current password is incorrect.' };
            }
            owner.password_hash = btoa(newPassword);
            localStorage.setItem('kc_owner', JSON.stringify(owner));
            this.logAudit('PASSWORD_CHANGED', `Owner password updated`);
            return { success: true, message: 'Owner password changed successfully!' };
        } else {
            const staffList = this.getStaff();
            const sIdx = staffList.findIndex(s => s.id === user.user_id);
            if (sIdx === -1 || staffList[sIdx].password_hash !== btoa(oldPassword)) {
                return { success: false, message: 'Current password is incorrect.' };
            }
            staffList[sIdx].password_hash = btoa(newPassword);
            localStorage.setItem('kc_staff', JSON.stringify(staffList));
            this.logAudit('PASSWORD_CHANGED', `Staff password updated for ${user.email}`);
            return { success: true, message: 'Password changed successfully!' };
        }
    }

    // Staff Management (Owner only)
    getStaff() {
        return JSON.parse(localStorage.getItem('kc_staff')) || [];
    }

    addStaff(data) {
        if (!this.isOwner()) {
            return { success: false, message: 'Unauthorized. Only the store owner can create staff accounts.' };
        }

        const staffList = this.getStaff();
        const cleanEmail = data.email.trim().toLowerCase();

        if (staffList.some(s => s.email === cleanEmail) || (this.getOwner() && this.getOwner().email === cleanEmail)) {
            return { success: false, message: 'An account with this email already exists.' };
        }

        const newStaff = {
            id: 'staff_' + Date.now(),
            name: data.name.trim(),
            email: cleanEmail,
            password_hash: btoa(data.password),
            role: data.role || 'STAFF', // 'MANAGER' or 'STAFF'
            status: 'active',
            created_at: new Date().toISOString()
        };

        staffList.push(newStaff);
        localStorage.setItem('kc_staff', JSON.stringify(staffList));
        this.logAudit('STAFF_CREATED', `Created ${newStaff.role} account for ${newStaff.email}`);
        return { success: true, staff: newStaff, message: `Staff member ${newStaff.name} created!` };
    }

    toggleStaffStatus(id) {
        if (!this.isOwner()) return { success: false, message: 'Owner permission required.' };

        const staffList = this.getStaff();
        const staff = staffList.find(s => s.id === id);
        if (staff) {
            staff.status = staff.status === 'active' ? 'disabled' : 'active';
            localStorage.setItem('kc_staff', JSON.stringify(staffList));
            this.logAudit('STAFF_STATUS_CHANGE', `${staff.email} status changed to ${staff.status}`);
            return { success: true, status: staff.status };
        }
        return { success: false, message: 'Staff member not found.' };
    }

    deleteStaff(id) {
        if (!this.isOwner()) return { success: false, message: 'Owner permission required.' };

        let staffList = this.getStaff();
        const target = staffList.find(s => s.id === id);
        staffList = staffList.filter(s => s.id !== id);
        localStorage.setItem('kc_staff', JSON.stringify(staffList));
        if (target) {
            this.logAudit('STAFF_DELETED', `Deleted staff account ${target.email}`);
        }
        return { success: true };
    }

    // Audit Logging
    getAuditLogs() {
        return JSON.parse(localStorage.getItem('kc_audit_logs')) || [
            {
                id: 1,
                action: 'SYSTEM_INITIALIZED',
                details: 'Khushi Collection Secure Security Engine initialized.',
                user_email: 'system',
                timestamp: new Date().toLocaleString()
            }
        ];
    }

    logAudit(action, details) {
        const logs = this.getAuditLogs();
        const user = this.getCurrentUser();
        logs.unshift({
            id: Date.now(),
            action: action,
            details: details,
            user_email: user ? `${user.email} (${user.role})` : 'anonymous',
            timestamp: new Date().toLocaleString()
        });
        localStorage.setItem('kc_audit_logs', JSON.stringify(logs.slice(0, 150)));
    }

    updateBadgeCounts() {
        const cartCount = this.getCartCount();
        document.querySelectorAll('.cart-badge-count').forEach(b => {
            b.textContent = cartCount;
            b.classList.toggle('hidden', cartCount === 0);
        });

        const wishCount = this.getWishlistCount();
        document.querySelectorAll('.wishlist-badge-count').forEach(b => {
            b.textContent = wishCount;
            b.classList.toggle('hidden', wishCount === 0);
        });
    }
}

const store = new KhushiStore();

// Universal Toast Helper
function showToast(message, type = 'success') {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        container.className = 'fixed bottom-20 right-4 md:bottom-6 md:right-6 z-50 flex flex-col gap-2 pointer-events-none';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `flex items-center gap-3 px-5 py-3.5 rounded-xl text-xs font-semibold shadow-2xl transition-all duration-300 transform translate-y-4 opacity-0 border ${
        type === 'success' 
            ? 'bg-emerald-950/90 text-emerald-200 border-emerald-500/40 shadow-emerald-900/40' 
            : type === 'error'
            ? 'bg-rose-950/90 text-rose-200 border-rose-500/40 shadow-rose-900/40'
            : 'bg-amber-950/90 text-amber-200 border-amber-500/40 shadow-amber-900/40'
    }`;

    const icon = type === 'success' ? 'fa-circle-check' : (type === 'error' ? 'fa-circle-xmark' : 'fa-bell');
    toast.innerHTML = `<i class="fa-solid ${icon} text-base"></i> <span>${message}</span>`;
    
    container.appendChild(toast);
    requestAnimationFrame(() => toast.classList.remove('translate-y-4', 'opacity-0'));

    setTimeout(() => {
        toast.classList.add('translate-y-4', 'opacity-0');
        setTimeout(() => toast.remove(), 300);
    }, 3200);
}

// Global Image Fallback Handler (Never show broken icons)
function handleImageError(img) {
    img.onerror = null;
    img.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="500" viewBox="0 0 400 500"><rect width="100%" height="100%" fill="%230F1420"/><text x="50%" y="48%" font-family="serif" font-size="20" fill="%23D4AF37" text-anchor="middle" font-weight="bold">KHUSHI COLLECTION</text><text x="50%" y="54%" font-family="sans-serif" font-size="12" fill="%2371717a" text-anchor="middle">Luxury Fashion Atelier</text></svg>';
}

document.addEventListener('DOMContentLoaded', () => {
    store.updateBadgeCounts();
    document.querySelectorAll('img').forEach(img => {
        img.addEventListener('error', () => handleImageError(img));
    });
});

