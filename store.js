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

// Rich Luxury Product Catalog (Upgraded with 8-12 Gallery Images, Secondary Images, and Variant Matrices)
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

// Rich Luxury Product Catalog (Upgraded with 8-12 Gallery Images, Secondary Images, and Variant Matrices)
const DEFAULT_PRODUCTS = [
    {
        "id": 1,
        "name": "Khushi Royal Embroidered Velvet Shawl Suit",
        "slug": "khushi-royal-embroidered-velvet-shawl-suit",
        "category": "women",
        "subcategory": "Dresses",
        "category_name": "Women Couture",
        "brand": "Khushi Signature",
        "sku": "KC-WMN-001",
        "price": 18500,
        "sale_price": 14950,
        "cost_price": 9500,
        "stock": 14,
        "low_stock_threshold": 3,
        "status": "published",
        "is_featured": true,
        "is_new": true,
        "is_bestseller": true,
        "is_flash_sale": false,
        "rating": 4.95,
        "reviews_count": 34,
        "thumbnail": "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&auto=format&fit=crop&q=80",
        "secondary_image": "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&auto=format&fit=crop&q=80",
        "images": [
            "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800&auto=format&fit=crop&q=80"
        ],
        "short_description": "Signature hand-embroidered velvet 3-piece suit with plush border shawl and tailored raw silk pants.",
        "description": "Indulge in absolute luxury with our signature handcrafted velvet ensemble. Featuring intricate tilla, sequin, and zardozi needlework along the neckline, hemlines, and sleeve cuffs. Paired with a plush micro-velvet printed border shawl and matching cigarette trousers.",
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
                "name": "Royal Maroon",
                "hex": "#881337"
            },
            {
                "name": "Deep Navy",
                "hex": "#0f172a"
            }
        ],
        "category_attributes": {
            "gender": "Women",
            "clothing_type": "3-Piece Stitched",
            "fabric": "Micro Velvet 9000",
            "pattern": "Embroidered",
            "occasion": "Wedding Formal"
        }
    },
    {
        "id": 2,
        "name": "Emerald Green Handcrafted Zardozi Bridal Anarkali",
        "slug": "emerald-green-handcrafted-zardozi-bridal-anarkali",
        "category": "women",
        "subcategory": "Dresses",
        "category_name": "Women Couture",
        "brand": "Khushi Bridal Studio",
        "sku": "KC-WMN-002",
        "price": 28500,
        "sale_price": 24900,
        "cost_price": 14000,
        "stock": 8,
        "low_stock_threshold": 2,
        "status": "published",
        "is_featured": true,
        "is_new": true,
        "is_bestseller": true,
        "is_flash_sale": false,
        "rating": 5.0,
        "reviews_count": 19,
        "thumbnail": "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&auto=format&fit=crop&q=80",
        "secondary_image": "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&auto=format&fit=crop&q=80",
        "images": [
            "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800&auto=format&fit=crop&q=80"
        ],
        "short_description": "Floor-length 16-kali Anarkali gown with kora dabka handwork and organza mukesh dupatta.",
        "description": "A breathtaking heirloom creation adorned with real kora, dabka, and pearl embellishments. Hand-stitched with pure chiffon kali panels and a heavy border organza dupatta.",
        "sizes": [
            "S",
            "M",
            "L"
        ],
        "colors": [
            {
                "name": "Imperial Emerald",
                "hex": "#064e3b"
            },
            {
                "name": "Ruby Red",
                "hex": "#991b1b"
            }
        ],
        "category_attributes": {
            "gender": "Women",
            "clothing_type": "3-Piece Stitched",
            "fabric": "Pure Chiffon & Silk",
            "pattern": "Embroidered",
            "occasion": "Wedding Formal"
        }
    },
    {
        "id": 3,
        "name": "Champagne Gold Stitched Raw Silk Pret Ensemble",
        "slug": "champagne-gold-stitched-raw-silk-pret-ensemble",
        "category": "women",
        "subcategory": "Shalwar Kameez",
        "category_name": "Women Couture",
        "brand": "Khushi Pret",
        "sku": "KC-WMN-003",
        "price": 14500,
        "sale_price": 11800,
        "cost_price": 6500,
        "stock": 18,
        "low_stock_threshold": 4,
        "status": "published",
        "is_featured": true,
        "is_new": false,
        "is_bestseller": true,
        "is_flash_sale": false,
        "rating": 4.88,
        "reviews_count": 42,
        "thumbnail": "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800&auto=format&fit=crop&q=80",
        "secondary_image": "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800&auto=format&fit=crop&q=80",
        "images": [
            "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&auto=format&fit=crop&q=80"
        ],
        "short_description": "Korean raw silk straight cut tunic with sequin neckline and jacquard organza dupatta.",
        "description": "Refined modern minimalism crafted from 80-gram Korean raw silk with subtle gold resham embroidery and delicate scalloped lace trims.",
        "sizes": [
            "XS",
            "S",
            "M",
            "L",
            "XL"
        ],
        "colors": [
            {
                "name": "Champagne Gold",
                "hex": "#fef08a"
            },
            {
                "name": "Ivory Mist",
                "hex": "#f8fafc"
            }
        ],
        "category_attributes": {
            "gender": "Women",
            "clothing_type": "2-Piece Stitched",
            "fabric": "Korean Raw Silk",
            "pattern": "Solid",
            "occasion": "Festive / Eid"
        }
    },
    {
        "id": 4,
        "name": "Midnight Black Heavily Embellished Velvet Kaftan",
        "slug": "midnight-black-heavily-embellished-velvet-kaftan",
        "category": "women",
        "subcategory": "Abayas",
        "category_name": "Women Couture",
        "brand": "Khushi Luxury",
        "sku": "KC-WMN-004",
        "price": 16900,
        "sale_price": 13500,
        "cost_price": 8000,
        "stock": 10,
        "low_stock_threshold": 3,
        "status": "published",
        "is_featured": false,
        "is_new": true,
        "is_bestseller": false,
        "is_flash_sale": true,
        "rating": 4.92,
        "reviews_count": 15,
        "thumbnail": "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800&auto=format&fit=crop&q=80",
        "secondary_image": "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&auto=format&fit=crop&q=80",
        "images": [
            "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&auto=format&fit=crop&q=80"
        ],
        "short_description": "Flowing micro-velvet royal kaftan with 3D crystal floral motifs along the waistline.",
        "description": "Dramatic silhouettes meet artisan craftsmanship. Fully lined in pure silk with a cinched inner waist tie and crystal hand embroidery.",
        "sizes": [
            "Free Size",
            "Plus Size"
        ],
        "colors": [
            {
                "name": "Onyx Black",
                "hex": "#18181b"
            },
            {
                "name": "Plum Wine",
                "hex": "#4a044e"
            }
        ],
        "category_attributes": {
            "gender": "Women",
            "clothing_type": "Abaya",
            "fabric": "Micro Velvet 9000",
            "pattern": "Embroidered",
            "occasion": "Party Wear"
        }
    },
    {
        "id": 5,
        "name": "Crimson Red Festive Organza 3-Piece Stitched Suit",
        "slug": "crimson-red-festive-organza-3-piece-stitched-suit",
        "category": "women",
        "subcategory": "Dresses",
        "category_name": "Women Couture",
        "brand": "Khushi Signature",
        "sku": "KC-WMN-005",
        "price": 21500,
        "sale_price": 17800,
        "cost_price": 10500,
        "stock": 15,
        "low_stock_threshold": 3,
        "status": "published",
        "is_featured": true,
        "is_new": true,
        "is_bestseller": true,
        "is_flash_sale": false,
        "rating": 4.96,
        "reviews_count": 27,
        "thumbnail": "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=800&auto=format&fit=crop&q=80",
        "secondary_image": "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800&auto=format&fit=crop&q=80",
        "images": [
            "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&auto=format&fit=crop&q=80"
        ],
        "short_description": "Pure organza embroidered long shirt with jamawar trouser and scalloped zari dupatta.",
        "description": "Vibrant crimson festive luxury complete with delicate tilla work, matching silk slip, and a four-sided scalloped dupatta.",
        "sizes": [
            "XS",
            "S",
            "M",
            "L",
            "XL"
        ],
        "colors": [
            {
                "name": "Crimson Red",
                "hex": "#dc2626"
            },
            {
                "name": "Sunset Coral",
                "hex": "#ea580c"
            }
        ],
        "category_attributes": {
            "gender": "Women",
            "clothing_type": "3-Piece Stitched",
            "fabric": "Pure Organza",
            "pattern": "Embroidered",
            "occasion": "Wedding Formal"
        }
    },
    {
        "id": 6,
        "name": "Pastel Lilac Pearl-Embroidered Chiffon Saree",
        "slug": "pastel-lilac-pearl-embroidered-chiffon-saree",
        "category": "women",
        "subcategory": "Sarees",
        "category_name": "Women Couture",
        "brand": "Khushi Saree Studio",
        "sku": "KC-WMN-006",
        "price": 22500,
        "sale_price": 18900,
        "cost_price": 11000,
        "stock": 7,
        "low_stock_threshold": 2,
        "status": "published",
        "is_featured": false,
        "is_new": true,
        "is_bestseller": false,
        "is_flash_sale": false,
        "rating": 4.85,
        "reviews_count": 11,
        "thumbnail": "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&auto=format&fit=crop&q=80",
        "secondary_image": "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&auto=format&fit=crop&q=80",
        "images": [
            "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&auto=format&fit=crop&q=80"
        ],
        "short_description": "6-yard flowing chiffon saree with pearl pallu borders and unstitched raw silk blouse piece.",
        "description": "Ethereal pastel aesthetics with shimmering sequins, Austrian pearls, and a customized silk underskirt included.",
        "sizes": [
            "Free Size (6 Yards)"
        ],
        "colors": [
            {
                "name": "Lilac Mist",
                "hex": "#c084fc"
            },
            {
                "name": "Powder Pink",
                "hex": "#f472b6"
            }
        ],
        "category_attributes": {
            "gender": "Women",
            "clothing_type": "Saree",
            "fabric": "Pure Chiffon",
            "pattern": "Embroidered",
            "occasion": "Party Wear"
        }
    },
    {
        "id": 7,
        "name": "Royal Ivory Jacquard Formal Pishwas",
        "slug": "royal-ivory-jacquard-formal-pishwas",
        "category": "women",
        "subcategory": "Dresses",
        "category_name": "Women Couture",
        "brand": "Khushi Signature",
        "sku": "KC-WMN-007",
        "price": 26000,
        "sale_price": 21500,
        "cost_price": 13000,
        "stock": 9,
        "low_stock_threshold": 2,
        "status": "published",
        "is_featured": true,
        "is_new": false,
        "is_bestseller": true,
        "is_flash_sale": false,
        "rating": 4.97,
        "reviews_count": 39,
        "thumbnail": "https://images.unsplash.com/photo-1609357605129-26f69add5d6e?w=800&auto=format&fit=crop&q=80",
        "secondary_image": "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800&auto=format&fit=crop&q=80",
        "images": [
            "https://images.unsplash.com/photo-1609357605129-26f69add5d6e?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800&auto=format&fit=crop&q=80"
        ],
        "short_description": "Regal 12-kali jacquard pishwas with heavily embroidered bodice and silk churidar.",
        "description": "Crafted from fine metallic jacquard weave with gold bullion accents, hand-attached pearl tassels, and a diaphanous organza dupatta.",
        "sizes": [
            "S",
            "M",
            "L",
            "XL"
        ],
        "colors": [
            {
                "name": "Royal Ivory",
                "hex": "#fafaf9"
            },
            {
                "name": "Antique Gold",
                "hex": "#eab308"
            }
        ],
        "category_attributes": {
            "gender": "Women",
            "clothing_type": "3-Piece Stitched",
            "fabric": "Metallic Jacquard",
            "pattern": "Jacquard",
            "occasion": "Wedding Formal"
        }
    },
    {
        "id": 8,
        "name": "Sapphire Blue Pure Chiffon Embroidered Dupatta Suit",
        "slug": "sapphire-blue-pure-chiffon-embroidered-dupatta-suit",
        "category": "women",
        "subcategory": "Shalwar Kameez",
        "category_name": "Women Couture",
        "brand": "Khushi Pret",
        "sku": "KC-WMN-008",
        "price": 17500,
        "sale_price": 13900,
        "cost_price": 8500,
        "stock": 16,
        "low_stock_threshold": 4,
        "status": "published",
        "is_featured": false,
        "is_new": true,
        "is_bestseller": false,
        "is_flash_sale": true,
        "rating": 4.9,
        "reviews_count": 21,
        "thumbnail": "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800&auto=format&fit=crop&q=80",
        "secondary_image": "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&auto=format&fit=crop&q=80",
        "images": [
            "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&auto=format&fit=crop&q=80"
        ],
        "short_description": "Sapphire blue stitched chiffon kameez with cigarette pants and a contrast zari dupatta.",
        "description": "Deep jewel tones adorned with mirror work, gota patti lace, and an all-over embroidered front panel.",
        "sizes": [
            "XS",
            "S",
            "M",
            "L"
        ],
        "colors": [
            {
                "name": "Sapphire Blue",
                "hex": "#1d4ed8"
            },
            {
                "name": "Teal Blue",
                "hex": "#0e7490"
            }
        ],
        "category_attributes": {
            "gender": "Women",
            "clothing_type": "3-Piece Stitched",
            "fabric": "Pure Chiffon",
            "pattern": "Embroidered",
            "occasion": "Festive / Eid"
        }
    },
    {
        "id": 9,
        "name": "Rose Gold Brocade Festive Lehenga Choli",
        "slug": "rose-gold-brocade-festive-lehenga-choli",
        "category": "women",
        "subcategory": "Dresses",
        "category_name": "Women Couture",
        "brand": "Khushi Bridal Studio",
        "sku": "KC-WMN-009",
        "price": 32000,
        "sale_price": 27500,
        "cost_price": 16000,
        "stock": 6,
        "low_stock_threshold": 2,
        "status": "published",
        "is_featured": true,
        "is_new": false,
        "is_bestseller": true,
        "is_flash_sale": false,
        "rating": 5.0,
        "reviews_count": 48,
        "thumbnail": "https://images.unsplash.com/photo-1534126511673-b6899657816a?w=800&auto=format&fit=crop&q=80",
        "secondary_image": "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800&auto=format&fit=crop&q=80",
        "images": [
            "https://images.unsplash.com/photo-1534126511673-b6899657816a?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1609357605129-26f69add5d6e?w=800&auto=format&fit=crop&q=80"
        ],
        "short_description": "Heavy Banarasi brocade lehenga skirt with a hand-embellished sweetheart choli.",
        "description": "Grand festive couture woven with genuine gold lurex threads, complete with can-can layering and a heavily bordered veil.",
        "sizes": [
            "S",
            "M",
            "L"
        ],
        "colors": [
            {
                "name": "Rose Gold",
                "hex": "#fb7185"
            },
            {
                "name": "Peach Blush",
                "hex": "#fed7aa"
            }
        ],
        "category_attributes": {
            "gender": "Women",
            "clothing_type": "3-Piece Stitched",
            "fabric": "Banarasi Brocade",
            "pattern": "Jacquard",
            "occasion": "Wedding Formal"
        }
    },
    {
        "id": 10,
        "name": "Plum Purple Hand-Worked Silk Kurti with Trousers",
        "slug": "plum-purple-hand-worked-silk-kurti-with-trousers",
        "category": "women",
        "subcategory": "Tops",
        "category_name": "Women Couture",
        "brand": "Khushi Pret",
        "sku": "KC-WMN-010",
        "price": 12500,
        "sale_price": 9950,
        "cost_price": 5500,
        "stock": 22,
        "low_stock_threshold": 5,
        "status": "published",
        "is_featured": false,
        "is_new": true,
        "is_bestseller": false,
        "is_flash_sale": true,
        "rating": 4.89,
        "reviews_count": 18,
        "thumbnail": "https://images.unsplash.com/photo-1550614000-4895a10e1bfd?w=800&auto=format&fit=crop&q=80",
        "secondary_image": "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&auto=format&fit=crop&q=80",
        "images": [
            "https://images.unsplash.com/photo-1550614000-4895a10e1bfd?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800&auto=format&fit=crop&q=80"
        ],
        "short_description": "Pure raw silk kurti with delicate pearl buttons and straight cut cigarette trousers.",
        "description": "Chic everyday luxury engineered for effortless comfort and unmatched festive elegance.",
        "sizes": [
            "XS",
            "S",
            "M",
            "L",
            "XL"
        ],
        "colors": [
            {
                "name": "Plum Purple",
                "hex": "#581c87"
            },
            {
                "name": "Aubergine",
                "hex": "#3b0764"
            }
        ],
        "category_attributes": {
            "gender": "Women",
            "clothing_type": "2-Piece Stitched",
            "fabric": "Pure Raw Silk",
            "pattern": "Solid",
            "occasion": "Casual Luxury"
        }
    },
    {
        "id": 11,
        "name": "Heritage Korean Raw Silk Kurta Pajama (Ivory)",
        "slug": "heritage-korean-raw-silk-kurta-pajama-ivory",
        "category": "men",
        "subcategory": "Shalwar Kameez",
        "category_name": "Men Royal Pret",
        "brand": "Khushi Menswear",
        "sku": "KC-MEN-001",
        "price": 12500,
        "sale_price": 9800,
        "cost_price": 5500,
        "stock": 20,
        "low_stock_threshold": 4,
        "status": "published",
        "is_featured": true,
        "is_new": true,
        "is_bestseller": true,
        "is_flash_sale": false,
        "rating": 4.92,
        "reviews_count": 45,
        "thumbnail": "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=800&auto=format&fit=crop&q=80",
        "secondary_image": "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&auto=format&fit=crop&q=80",
        "images": [
            "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&auto=format&fit=crop&q=80"
        ],
        "short_description": "Pure 80g Korean raw silk kurta with metal cuff-links and matching slim trousers.",
        "description": "Bespoke tailored band collar kurta featuring immaculate hand-stitch details and hidden placket styling.",
        "sizes": [
            "S",
            "M",
            "L",
            "XL",
            "XXL"
        ],
        "colors": [
            {
                "name": "Royal Ivory",
                "hex": "#fafaf9"
            },
            {
                "name": "Jet Black",
                "hex": "#18181b"
            }
        ],
        "category_attributes": {
            "gender": "Men",
            "clothing_type": "Kurta",
            "fabric": "Korean Raw Silk",
            "pattern": "Solid",
            "occasion": "Wedding Formal"
        }
    },
    {
        "id": 12,
        "name": "Royal Black Jamawar Hand-Embroidered Waistcoat",
        "slug": "royal-black-jamawar-hand-embroidered-waistcoat",
        "category": "men",
        "subcategory": "Waistcoats",
        "category_name": "Men Royal Pret",
        "brand": "Khushi Menswear",
        "sku": "KC-MEN-002",
        "price": 8500,
        "sale_price": 6450,
        "cost_price": 3500,
        "stock": 15,
        "low_stock_threshold": 3,
        "status": "published",
        "is_featured": true,
        "is_new": true,
        "is_bestseller": true,
        "is_flash_sale": false,
        "rating": 4.95,
        "reviews_count": 31,
        "thumbnail": "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&auto=format&fit=crop&q=80",
        "secondary_image": "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=800&auto=format&fit=crop&q=80",
        "images": [
            "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&auto=format&fit=crop&q=80"
        ],
        "short_description": "Pure Banarasi jamawar jacquard waistcoat with brass monogram crest buttons.",
        "description": "Structured tailored waistcoat with welt pockets and a satin inner lining for groomsmen and festive events.",
        "sizes": [
            "38 (S)",
            "40 (M)",
            "42 (L)",
            "44 (XL)"
        ],
        "colors": [
            {
                "name": "Onyx Black",
                "hex": "#18181b"
            },
            {
                "name": "Maroon Gold",
                "hex": "#7f1d1d"
            }
        ],
        "category_attributes": {
            "gender": "Men",
            "clothing_type": "Waistcoat",
            "fabric": "Pure Jamawar Jacquard",
            "pattern": "Jacquard",
            "occasion": "Wedding Formal"
        }
    },
    {
        "id": 13,
        "name": "Navy Blue Bespoke Prince Suit with Monogram Crest",
        "slug": "navy-blue-bespoke-prince-suit-with-monogram-crest",
        "category": "men",
        "subcategory": "Suits",
        "category_name": "Men Royal Pret",
        "brand": "Khushi Menswear",
        "sku": "KC-MEN-003",
        "price": 24000,
        "sale_price": 19500,
        "cost_price": 12000,
        "stock": 7,
        "low_stock_threshold": 2,
        "status": "published",
        "is_featured": true,
        "is_new": false,
        "is_bestseller": true,
        "is_flash_sale": false,
        "rating": 4.98,
        "reviews_count": 29,
        "thumbnail": "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&auto=format&fit=crop&q=80",
        "secondary_image": "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&auto=format&fit=crop&q=80",
        "images": [
            "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=800&auto=format&fit=crop&q=80"
        ],
        "short_description": "Italian tropical wool tailored Prince coat with bespoke gold crest buttons.",
        "description": "Double-breasted Prince suit with structured shoulders, hand-stitched lapels, and tailored dress trousers.",
        "sizes": [
            "38R",
            "40R",
            "42R",
            "44R"
        ],
        "colors": [
            {
                "name": "Midnight Navy",
                "hex": "#1e3a8a"
            },
            {
                "name": "Charcoal Grey",
                "hex": "#334155"
            }
        ],
        "category_attributes": {
            "gender": "Men",
            "clothing_type": "Suits",
            "fabric": "Italian Tropical Wool",
            "pattern": "Solid",
            "occasion": "Wedding Formal"
        }
    },
    {
        "id": 14,
        "name": "Charcoal Grey Tailored Sherwani with Gold Buttons",
        "slug": "charcoal-grey-tailored-sherwani-with-gold-buttons",
        "category": "men",
        "subcategory": "Suits",
        "category_name": "Men Royal Pret",
        "brand": "Khushi Menswear",
        "sku": "KC-MEN-004",
        "price": 35000,
        "sale_price": 29900,
        "cost_price": 17000,
        "stock": 5,
        "low_stock_threshold": 1,
        "status": "published",
        "is_featured": true,
        "is_new": true,
        "is_bestseller": false,
        "is_flash_sale": false,
        "rating": 5.0,
        "reviews_count": 14,
        "thumbnail": "https://images.unsplash.com/photo-1593032465175-481ac7f401a0?w=800&auto=format&fit=crop&q=80",
        "secondary_image": "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&auto=format&fit=crop&q=80",
        "images": [
            "https://images.unsplash.com/photo-1593032465175-481ac7f401a0?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=800&auto=format&fit=crop&q=80"
        ],
        "short_description": "Micro-textured groom sherwani with intricate collar zardozi and silk inner lining.",
        "description": "Command regal majesty with hand-crafted sherwani tailoring, fitted with pure raw silk churidar.",
        "sizes": [
            "38 (S)",
            "40 (M)",
            "42 (L)",
            "44 (XL)"
        ],
        "colors": [
            {
                "name": "Charcoal Grey",
                "hex": "#374151"
            },
            {
                "name": "Ivory Gold",
                "hex": "#fef08a"
            }
        ],
        "category_attributes": {
            "gender": "Men",
            "clothing_type": "Suits",
            "fabric": "Textured Suiting Wool",
            "pattern": "Solid",
            "occasion": "Wedding Formal"
        }
    },
    {
        "id": 15,
        "name": "Pure Cotton Festive Designer Kurta (Sage Green)",
        "slug": "pure-cotton-festive-designer-kurta-sage-green",
        "category": "men",
        "subcategory": "Shalwar Kameez",
        "category_name": "Men Royal Pret",
        "brand": "Khushi Menswear",
        "sku": "KC-MEN-005",
        "price": 7500,
        "sale_price": 5950,
        "cost_price": 3200,
        "stock": 25,
        "low_stock_threshold": 5,
        "status": "published",
        "is_featured": false,
        "is_new": true,
        "is_bestseller": true,
        "is_flash_sale": true,
        "rating": 4.88,
        "reviews_count": 38,
        "thumbnail": "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80",
        "secondary_image": "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=800&auto=format&fit=crop&q=80",
        "images": [
            "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&auto=format&fit=crop&q=80"
        ],
        "short_description": "Egyptian giza cotton lightweight summer kurta with tonal thread work.",
        "description": "Breathable, pre-shrunk Egyptian cotton tailored with a comfortable relaxed fit for Eid and summer celebrations.",
        "sizes": [
            "S",
            "M",
            "L",
            "XL",
            "XXL"
        ],
        "colors": [
            {
                "name": "Sage Green",
                "hex": "#84cc16"
            },
            {
                "name": "Sky Blue",
                "hex": "#38bdf8"
            }
        ],
        "category_attributes": {
            "gender": "Men",
            "clothing_type": "Kurta",
            "fabric": "100% Giza Cotton",
            "pattern": "Solid",
            "occasion": "Festive / Eid"
        }
    },
    {
        "id": 16,
        "name": "Maroon Velvet Royal Festive Waistcoat",
        "slug": "maroon-velvet-royal-festive-waistcoat",
        "category": "men",
        "subcategory": "Waistcoats",
        "category_name": "Men Royal Pret",
        "brand": "Khushi Menswear",
        "sku": "KC-MEN-006",
        "price": 9500,
        "sale_price": 7800,
        "cost_price": 4200,
        "stock": 12,
        "low_stock_threshold": 3,
        "status": "published",
        "is_featured": false,
        "is_new": false,
        "is_bestseller": true,
        "is_flash_sale": false,
        "rating": 4.93,
        "reviews_count": 22,
        "thumbnail": "https://images.unsplash.com/photo-1598808503746-f34c53b9323e?w=800&auto=format&fit=crop&q=80",
        "secondary_image": "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&auto=format&fit=crop&q=80",
        "images": [
            "https://images.unsplash.com/photo-1598808503746-f34c53b9323e?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=800&auto=format&fit=crop&q=80"
        ],
        "short_description": "Deep maroon plush micro-velvet waistcoat with gold tilla border embroidery.",
        "description": "Luxurious velvet with gold crest buttons, double-piped pockets, and a tailored mandarin collar.",
        "sizes": [
            "38 (S)",
            "40 (M)",
            "42 (L)",
            "44 (XL)"
        ],
        "colors": [
            {
                "name": "Royal Maroon",
                "hex": "#881337"
            },
            {
                "name": "Navy Blue",
                "hex": "#1e3a8a"
            }
        ],
        "category_attributes": {
            "gender": "Men",
            "clothing_type": "Waistcoat",
            "fabric": "Micro Velvet 9000",
            "pattern": "Embroidered",
            "occasion": "Wedding Formal"
        }
    },
    {
        "id": 17,
        "name": "Olive Green Italian Linen Summer Kurta Pajama",
        "slug": "olive-green-italian-linen-summer-kurta-pajama",
        "category": "men",
        "subcategory": "Shalwar Kameez",
        "category_name": "Men Royal Pret",
        "brand": "Khushi Menswear",
        "sku": "KC-MEN-007",
        "price": 10500,
        "sale_price": 8400,
        "cost_price": 4800,
        "stock": 19,
        "low_stock_threshold": 4,
        "status": "published",
        "is_featured": false,
        "is_new": true,
        "is_bestseller": false,
        "is_flash_sale": false,
        "rating": 4.87,
        "reviews_count": 17,
        "thumbnail": "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=800&auto=format&fit=crop&q=80",
        "secondary_image": "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=800&auto=format&fit=crop&q=80",
        "images": [
            "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80"
        ],
        "short_description": "Pure Italian linen washed kurta with tailored straight trousers.",
        "description": "Stay cool and sharp with naturally breathable European linen, featuring Mother of Pearl buttons.",
        "sizes": [
            "S",
            "M",
            "L",
            "XL"
        ],
        "colors": [
            {
                "name": "Olive Green",
                "hex": "#65a30d"
            },
            {
                "name": "Khaki Sand",
                "hex": "#d97706"
            }
        ],
        "category_attributes": {
            "gender": "Men",
            "clothing_type": "Kurta",
            "fabric": "100% Pure Linen",
            "pattern": "Solid",
            "occasion": "Casual Luxury"
        }
    },
    {
        "id": 18,
        "name": "Pure White Self-Textured Jacquard Kurta",
        "slug": "pure-white-self-textured-jacquard-kurta",
        "category": "men",
        "subcategory": "Shalwar Kameez",
        "category_name": "Men Royal Pret",
        "brand": "Khushi Menswear",
        "sku": "KC-MEN-008",
        "price": 8900,
        "sale_price": 7200,
        "cost_price": 4000,
        "stock": 28,
        "low_stock_threshold": 5,
        "status": "published",
        "is_featured": false,
        "is_new": false,
        "is_bestseller": true,
        "is_flash_sale": false,
        "rating": 4.96,
        "reviews_count": 52,
        "thumbnail": "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&auto=format&fit=crop&q=80",
        "secondary_image": "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=800&auto=format&fit=crop&q=80",
        "images": [
            "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&auto=format&fit=crop&q=80"
        ],
        "short_description": "Timeless self-jacquard woven cotton kurta with embroidered collar.",
        "description": "The quintessential Friday and Eid essential. Self-embossed geometric weave on crisp white fabric.",
        "sizes": [
            "S",
            "M",
            "L",
            "XL",
            "XXL"
        ],
        "colors": [
            {
                "name": "Crisp White",
                "hex": "#ffffff"
            },
            {
                "name": "Off White",
                "hex": "#f5f5f4"
            }
        ],
        "category_attributes": {
            "gender": "Men",
            "clothing_type": "Kurta",
            "fabric": "Self-Jacquard Cotton",
            "pattern": "Jacquard",
            "occasion": "Festive / Eid"
        }
    },
    {
        "id": 19,
        "name": "Classic Camel Wool Blend Tailored Blazer",
        "slug": "classic-camel-wool-blend-tailored-blazer",
        "category": "men",
        "subcategory": "Jackets",
        "category_name": "Men Royal Pret",
        "brand": "Khushi Menswear",
        "sku": "KC-MEN-009",
        "price": 18500,
        "sale_price": 14900,
        "cost_price": 9000,
        "stock": 11,
        "low_stock_threshold": 3,
        "status": "published",
        "is_featured": false,
        "is_new": true,
        "is_bestseller": false,
        "is_flash_sale": true,
        "rating": 4.91,
        "reviews_count": 16,
        "thumbnail": "https://images.unsplash.com/photo-1548883354-7622d03aca27?w=800&auto=format&fit=crop&q=80",
        "secondary_image": "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&auto=format&fit=crop&q=80",
        "images": [
            "https://images.unsplash.com/photo-1548883354-7622d03aca27?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&auto=format&fit=crop&q=80"
        ],
        "short_description": "Single-breasted camel hair blend blazer with horn buttons and silk interior.",
        "description": "Refined outerwear featuring notch lapels, flap pockets, and double back vents for modern gentlemen.",
        "sizes": [
            "38R",
            "40R",
            "42R",
            "44R"
        ],
        "colors": [
            {
                "name": "Camel Tan",
                "hex": "#b45309"
            },
            {
                "name": "Espresso Brown",
                "hex": "#451a03"
            }
        ],
        "category_attributes": {
            "gender": "Men",
            "clothing_type": "Jackets",
            "fabric": "Wool Blend",
            "pattern": "Solid",
            "occasion": "Party Wear"
        }
    },
    {
        "id": 20,
        "name": "Burgundy Silk Embroidered Kurta with Shalwar",
        "slug": "burgundy-silk-embroidered-kurta-with-shalwar",
        "category": "men",
        "subcategory": "Shalwar Kameez",
        "category_name": "Men Royal Pret",
        "brand": "Khushi Menswear",
        "sku": "KC-MEN-010",
        "price": 11900,
        "sale_price": 9500,
        "cost_price": 5400,
        "stock": 17,
        "low_stock_threshold": 4,
        "status": "published",
        "is_featured": false,
        "is_new": false,
        "is_bestseller": true,
        "is_flash_sale": false,
        "rating": 4.94,
        "reviews_count": 28,
        "thumbnail": "https://images.unsplash.com/photo-1516257984-b1b4d707412e?w=800&auto=format&fit=crop&q=80",
        "secondary_image": "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=800&auto=format&fit=crop&q=80",
        "images": [
            "https://images.unsplash.com/photo-1516257984-b1b4d707412e?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&auto=format&fit=crop&q=80"
        ],
        "short_description": "Pure art silk kurta shalwar with delicate zari neck placket needlework.",
        "description": "Rich burgundy shade crafted with traditional Pakistani cut, offering graceful drape and festive luxury.",
        "sizes": [
            "S",
            "M",
            "L",
            "XL"
        ],
        "colors": [
            {
                "name": "Burgundy",
                "hex": "#831843"
            },
            {
                "name": "Black",
                "hex": "#18181b"
            }
        ],
        "category_attributes": {
            "gender": "Men",
            "clothing_type": "Shalwar Kameez",
            "fabric": "Pure Art Silk",
            "pattern": "Embroidered",
            "occasion": "Festive / Eid"
        }
    },
    {
        "id": 21,
        "name": "Prince Embroidered Jamawar Kurta Set for Boys",
        "slug": "prince-embroidered-jamawar-kurta-set-for-boys",
        "category": "kids",
        "subcategory": "Boys",
        "category_name": "Kids Festive",
        "brand": "Khushi Juniors",
        "sku": "KC-KID-001",
        "price": 6500,
        "sale_price": 4990,
        "cost_price": 2800,
        "stock": 20,
        "low_stock_threshold": 4,
        "status": "published",
        "is_featured": true,
        "is_new": true,
        "is_bestseller": true,
        "is_flash_sale": false,
        "rating": 4.9,
        "reviews_count": 35,
        "thumbnail": "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=800&auto=format&fit=crop&q=80",
        "secondary_image": "https://images.unsplash.com/photo-1508807526345-15e9b5f4eaff?w=800&auto=format&fit=crop&q=80",
        "images": [
            "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1508807526345-15e9b5f4eaff?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1514090458221-65bb69cf63e6?w=800&auto=format&fit=crop&q=80"
        ],
        "short_description": "Soft cotton-silk festive kurta pajama paired with a mini jacquard waistcoat.",
        "description": "Crafted with ultra-soft hypoallergenic lining so young princes stay comfortable all day at weddings and Eid.",
        "sizes": [
            "2-3 Yrs",
            "4-5 Yrs",
            "6-7 Yrs",
            "8-9 Yrs",
            "10-12 Yrs"
        ],
        "colors": [
            {
                "name": "Royal Maroon",
                "hex": "#881337"
            },
            {
                "name": "Ivory Gold",
                "hex": "#fef08a"
            }
        ],
        "category_attributes": {
            "gender": "Boys",
            "clothing_type": "Festive Kurta Sets",
            "fabric": "Cotton Silk Blend",
            "occasion": "Wedding Formal"
        }
    },
    {
        "id": 22,
        "name": "Little Princess Velvet Anarkali Dress with Dupatta",
        "slug": "little-princess-velvet-anarkali-dress-with-dupatta",
        "category": "kids",
        "subcategory": "Girls",
        "category_name": "Kids Festive",
        "brand": "Khushi Juniors",
        "sku": "KC-KID-002",
        "price": 8500,
        "sale_price": 6800,
        "cost_price": 3800,
        "stock": 14,
        "low_stock_threshold": 3,
        "status": "published",
        "is_featured": true,
        "is_new": true,
        "is_bestseller": true,
        "is_flash_sale": false,
        "rating": 4.96,
        "reviews_count": 29,
        "thumbnail": "https://images.unsplash.com/photo-1508807526345-15e9b5f4eaff?w=800&auto=format&fit=crop&q=80",
        "secondary_image": "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=800&auto=format&fit=crop&q=80",
        "images": [
            "https://images.unsplash.com/photo-1508807526345-15e9b5f4eaff?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=800&auto=format&fit=crop&q=80"
        ],
        "short_description": "Emerald velvet festive frock with golden gota patti trims and matching net dupatta.",
        "description": "Adorable twirl-friendly silhouette lined in pure cotton to protect delicate skin.",
        "sizes": [
            "2-3 Yrs",
            "4-5 Yrs",
            "6-7 Yrs",
            "8-9 Yrs"
        ],
        "colors": [
            {
                "name": "Emerald Green",
                "hex": "#064e3b"
            },
            {
                "name": "Ruby Red",
                "hex": "#991b1b"
            }
        ],
        "category_attributes": {
            "gender": "Girls",
            "clothing_type": "Dresses",
            "fabric": "Micro Velvet",
            "occasion": "Festive / Eid"
        }
    },
    {
        "id": 23,
        "name": "Festive Raw Silk Stitched Kurta Pajama (Teal)",
        "slug": "festive-raw-silk-stitched-kurta-pajama-teal",
        "category": "kids",
        "subcategory": "Boys",
        "category_name": "Kids Festive",
        "brand": "Khushi Juniors",
        "sku": "KC-KID-003",
        "price": 5500,
        "sale_price": 4200,
        "cost_price": 2400,
        "stock": 18,
        "low_stock_threshold": 4,
        "status": "published",
        "is_featured": false,
        "is_new": true,
        "is_bestseller": false,
        "is_flash_sale": true,
        "rating": 4.88,
        "reviews_count": 19,
        "thumbnail": "https://images.unsplash.com/photo-1514090458221-65bb69cf63e6?w=800&auto=format&fit=crop&q=80",
        "secondary_image": "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=800&auto=format&fit=crop&q=80",
        "images": [
            "https://images.unsplash.com/photo-1514090458221-65bb69cf63e6?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1508807526345-15e9b5f4eaff?w=800&auto=format&fit=crop&q=80"
        ],
        "short_description": "Vibrant teal silk kurta with white shalwar and embroidered placket.",
        "description": "Classic festive essentials for boys, lightweight and easy to wear.",
        "sizes": [
            "3-4 Yrs",
            "5-6 Yrs",
            "7-8 Yrs",
            "9-10 Yrs"
        ],
        "colors": [
            {
                "name": "Teal Blue",
                "hex": "#0e7490"
            },
            {
                "name": "Mustard Yellow",
                "hex": "#ca8a04"
            }
        ],
        "category_attributes": {
            "gender": "Boys",
            "clothing_type": "Festive Kurta Sets",
            "fabric": "Raw Silk Blend",
            "occasion": "Festive / Eid"
        }
    },
    {
        "id": 24,
        "name": "Golden Embroidered Festive Gown for Girls",
        "slug": "golden-embroidered-festive-gown-for-girls",
        "category": "kids",
        "subcategory": "Girls",
        "category_name": "Kids Festive",
        "brand": "Khushi Juniors",
        "sku": "KC-KID-004",
        "price": 7900,
        "sale_price": 6300,
        "cost_price": 3600,
        "stock": 12,
        "low_stock_threshold": 3,
        "status": "published",
        "is_featured": false,
        "is_new": false,
        "is_bestseller": true,
        "is_flash_sale": false,
        "rating": 4.92,
        "reviews_count": 24,
        "thumbnail": "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=800&auto=format&fit=crop&q=80",
        "secondary_image": "https://images.unsplash.com/photo-1508807526345-15e9b5f4eaff?w=800&auto=format&fit=crop&q=80",
        "images": [
            "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1508807526345-15e9b5f4eaff?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=800&auto=format&fit=crop&q=80"
        ],
        "short_description": "Organza layered party gown with sequin bodice and satin belt bow.",
        "description": "Fairy-tale festive styling with multi-layer volume netting and 100% cotton inner base.",
        "sizes": [
            "2-3 Yrs",
            "4-5 Yrs",
            "6-7 Yrs",
            "8-10 Yrs"
        ],
        "colors": [
            {
                "name": "Champagne Gold",
                "hex": "#fde047"
            },
            {
                "name": "Blush Pink",
                "hex": "#fbcfe8"
            }
        ],
        "category_attributes": {
            "gender": "Girls",
            "clothing_type": "Dresses",
            "fabric": "Organza & Net",
            "occasion": "Party Wear"
        }
    },
    {
        "id": 25,
        "name": "Pure Cotton Soft Breathable Summer Kurta (Yellow)",
        "slug": "pure-cotton-soft-breathable-summer-kurta-yellow",
        "category": "kids",
        "subcategory": "Baby",
        "category_name": "Kids Festive",
        "brand": "Khushi Juniors",
        "sku": "KC-KID-005",
        "price": 3800,
        "sale_price": 2990,
        "cost_price": 1600,
        "stock": 30,
        "low_stock_threshold": 6,
        "status": "published",
        "is_featured": false,
        "is_new": true,
        "is_bestseller": true,
        "is_flash_sale": true,
        "rating": 4.95,
        "reviews_count": 41,
        "thumbnail": "https://images.unsplash.com/photo-1522771930-78848d9293e8?w=800&auto=format&fit=crop&q=80",
        "secondary_image": "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=800&auto=format&fit=crop&q=80",
        "images": [
            "https://images.unsplash.com/photo-1522771930-78848d9293e8?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1514090458221-65bb69cf63e6?w=800&auto=format&fit=crop&q=80"
        ],
        "short_description": "Organic lawn cotton printed kurta set for infants and toddlers.",
        "description": "Ultra-gentle on delicate baby skin, with snap button shoulder opening for easy dressing.",
        "sizes": [
            "6-12 Months",
            "12-18 Months",
            "18-24 Months"
        ],
        "colors": [
            {
                "name": "Sunshine Yellow",
                "hex": "#facc15"
            },
            {
                "name": "Mint Green",
                "hex": "#86efac"
            }
        ],
        "category_attributes": {
            "gender": "Baby",
            "clothing_type": "Festive Kurta Sets",
            "fabric": "100% Organic Cotton",
            "occasion": "Casual Luxury"
        }
    },
    {
        "id": 26,
        "name": "Royal Blue Velvet Waistcoat Set for Boys",
        "slug": "royal-blue-velvet-waistcoat-set-for-boys",
        "category": "kids",
        "subcategory": "Boys",
        "category_name": "Kids Festive",
        "brand": "Khushi Juniors",
        "sku": "KC-KID-006",
        "price": 7200,
        "sale_price": 5750,
        "cost_price": 3200,
        "stock": 16,
        "low_stock_threshold": 3,
        "status": "published",
        "is_featured": false,
        "is_new": false,
        "is_bestseller": true,
        "is_flash_sale": false,
        "rating": 4.89,
        "reviews_count": 26,
        "thumbnail": "https://images.unsplash.com/photo-1471286174890-9c112ffca564?w=800&auto=format&fit=crop&q=80",
        "secondary_image": "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=800&auto=format&fit=crop&q=80",
        "images": [
            "https://images.unsplash.com/photo-1471286174890-9c112ffca564?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1508807526345-15e9b5f4eaff?w=800&auto=format&fit=crop&q=80"
        ],
        "short_description": "Plush royal blue velvet waistcoat over a crisp white cotton-silk kurta pajama.",
        "description": "Smart formal attire for young gentlemen attending wedding functions and family banquets.",
        "sizes": [
            "3-4 Yrs",
            "5-6 Yrs",
            "7-8 Yrs",
            "9-10 Yrs",
            "11-12 Yrs"
        ],
        "colors": [
            {
                "name": "Royal Blue",
                "hex": "#1d4ed8"
            },
            {
                "name": "Black",
                "hex": "#18181b"
            }
        ],
        "category_attributes": {
            "gender": "Boys",
            "clothing_type": "Festive Kurta Sets",
            "fabric": "Velvet & Cotton Silk",
            "occasion": "Wedding Formal"
        }
    },
    {
        "id": 27,
        "name": "Pink Organza Floral Festive Pishwas for Girls",
        "slug": "pink-organza-floral-festive-pishwas-for-girls",
        "category": "kids",
        "subcategory": "Girls",
        "category_name": "Kids Festive",
        "brand": "Khushi Juniors",
        "sku": "KC-KID-007",
        "price": 8900,
        "sale_price": 7100,
        "cost_price": 4000,
        "stock": 11,
        "low_stock_threshold": 3,
        "status": "published",
        "is_featured": false,
        "is_new": true,
        "is_bestseller": false,
        "is_flash_sale": false,
        "rating": 4.94,
        "reviews_count": 18,
        "thumbnail": "https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=800&auto=format&fit=crop&q=80",
        "secondary_image": "https://images.unsplash.com/photo-1508807526345-15e9b5f4eaff?w=800&auto=format&fit=crop&q=80",
        "images": [
            "https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1508807526345-15e9b5f4eaff?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=800&auto=format&fit=crop&q=80"
        ],
        "short_description": "Pastel pink floral printed pishwas with mirror lace and matching chiffon dupatta.",
        "description": "Graceful traditional pishwas tailored with generous flared hemline and comfortable elastic trousers.",
        "sizes": [
            "2-3 Yrs",
            "4-5 Yrs",
            "6-7 Yrs",
            "8-9 Yrs"
        ],
        "colors": [
            {
                "name": "Powder Pink",
                "hex": "#f472b6"
            },
            {
                "name": "Peach",
                "hex": "#fdba74"
            }
        ],
        "category_attributes": {
            "gender": "Girls",
            "clothing_type": "Dresses",
            "fabric": "Floral Organza",
            "occasion": "Festive / Eid"
        }
    },
    {
        "id": 28,
        "name": "Mint Green Hand-Block Printed Cotton Kurta Set",
        "slug": "mint-green-hand-block-printed-cotton-kurta-set",
        "category": "kids",
        "subcategory": "Boys",
        "category_name": "Kids Festive",
        "brand": "Khushi Juniors",
        "sku": "KC-KID-008",
        "price": 4800,
        "sale_price": 3850,
        "cost_price": 2000,
        "stock": 22,
        "low_stock_threshold": 4,
        "status": "published",
        "is_featured": false,
        "is_new": false,
        "is_bestseller": false,
        "is_flash_sale": true,
        "rating": 4.86,
        "reviews_count": 15,
        "thumbnail": "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=800&auto=format&fit=crop&q=80",
        "secondary_image": "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=800&auto=format&fit=crop&q=80",
        "images": [
            "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1514090458221-65bb69cf63e6?w=800&auto=format&fit=crop&q=80"
        ],
        "short_description": "Hand-block printed pure cotton kurta paired with white soft cotton trousers.",
        "description": "Artisanal block print motifs with gentle wooden buttons and relaxed sleeve cuffs.",
        "sizes": [
            "2-3 Yrs",
            "4-5 Yrs",
            "6-7 Yrs",
            "8-9 Yrs"
        ],
        "colors": [
            {
                "name": "Mint Green",
                "hex": "#a7f3d0"
            },
            {
                "name": "Sky Blue",
                "hex": "#bae6fd"
            }
        ],
        "category_attributes": {
            "gender": "Boys",
            "clothing_type": "Festive Kurta Sets",
            "fabric": "100% Hand-Block Cotton",
            "occasion": "Casual Luxury"
        }
    },
    {
        "id": 29,
        "name": "Maroon Heritage Kurta with Trouser for Boys",
        "slug": "maroon-heritage-kurta-with-trouser-for-boys",
        "category": "kids",
        "subcategory": "Boys",
        "category_name": "Kids Festive",
        "brand": "Khushi Juniors",
        "sku": "KC-KID-009",
        "price": 5200,
        "sale_price": 4100,
        "cost_price": 2200,
        "stock": 17,
        "low_stock_threshold": 3,
        "status": "published",
        "is_featured": false,
        "is_new": true,
        "is_bestseller": false,
        "is_flash_sale": false,
        "rating": 4.91,
        "reviews_count": 21,
        "thumbnail": "https://images.unsplash.com/photo-1490902931849-b803a1f07bc5?w=800&auto=format&fit=crop&q=80",
        "secondary_image": "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=800&auto=format&fit=crop&q=80",
        "images": [
            "https://images.unsplash.com/photo-1490902931849-b803a1f07bc5?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1508807526345-15e9b5f4eaff?w=800&auto=format&fit=crop&q=80"
        ],
        "short_description": "Festive maroon cotton-silk kurta with geometric neckline embroidery.",
        "description": "Rich festive hue tailored with care, providing comfort and regal look for young boys.",
        "sizes": [
            "3-4 Yrs",
            "5-6 Yrs",
            "7-8 Yrs",
            "9-10 Yrs"
        ],
        "colors": [
            {
                "name": "Maroon",
                "hex": "#881337"
            },
            {
                "name": "Navy",
                "hex": "#1e3a8a"
            }
        ],
        "category_attributes": {
            "gender": "Boys",
            "clothing_type": "Festive Kurta Sets",
            "fabric": "Cotton Silk Blend",
            "occasion": "Festive / Eid"
        }
    },
    {
        "id": 30,
        "name": "Ivory Pearl-Embellished Festive Frock for Girls",
        "slug": "ivory-pearl-embellished-festive-frock-for-girls",
        "category": "kids",
        "subcategory": "Girls",
        "category_name": "Kids Festive",
        "brand": "Khushi Juniors",
        "sku": "KC-KID-010",
        "price": 8200,
        "sale_price": 6500,
        "cost_price": 3700,
        "stock": 15,
        "low_stock_threshold": 3,
        "status": "published",
        "is_featured": false,
        "is_new": false,
        "is_bestseller": true,
        "is_flash_sale": false,
        "rating": 4.97,
        "reviews_count": 33,
        "thumbnail": "https://images.unsplash.com/photo-1485546246426-74dc88dec4d9?w=800&auto=format&fit=crop&q=80",
        "secondary_image": "https://images.unsplash.com/photo-1508807526345-15e9b5f4eaff?w=800&auto=format&fit=crop&q=80",
        "images": [
            "https://images.unsplash.com/photo-1485546246426-74dc88dec4d9?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1508807526345-15e9b5f4eaff?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=800&auto=format&fit=crop&q=80"
        ],
        "short_description": "Pure net flared frock with pearl scatter embroidery and raw silk lining.",
        "description": "Elegant party frock designed for birthdays, weddings, and memorable family photographs.",
        "sizes": [
            "2-3 Yrs",
            "4-5 Yrs",
            "6-7 Yrs",
            "8-10 Yrs"
        ],
        "colors": [
            {
                "name": "Royal Ivory",
                "hex": "#fafaf9"
            },
            {
                "name": "Golden Cream",
                "hex": "#fef08a"
            }
        ],
        "category_attributes": {
            "gender": "Girls",
            "clothing_type": "Dresses",
            "fabric": "Pure Net & Silk",
            "occasion": "Party Wear"
        }
    },
    {
        "id": 31,
        "name": "Artisanal Handcrafted Gold Tilla Bridal Khussa",
        "slug": "artisanal-handcrafted-gold-tilla-bridal-khussa",
        "category": "shoes",
        "subcategory": "Women Khussas",
        "category_name": "Artisanal Footwear",
        "brand": "Khushi Footwear",
        "sku": "KC-SHS-001",
        "price": 4500,
        "sale_price": 3250,
        "cost_price": 1700,
        "stock": 25,
        "low_stock_threshold": 5,
        "status": "published",
        "is_featured": true,
        "is_new": true,
        "is_bestseller": true,
        "is_flash_sale": false,
        "rating": 4.95,
        "reviews_count": 64,
        "thumbnail": "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&auto=format&fit=crop&q=80",
        "secondary_image": "https://images.unsplash.com/photo-1560343090-f0409e92791a?w=800&auto=format&fit=crop&q=80",
        "images": [
            "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1560343090-f0409e92791a?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1535043934128-cf0b28d52f95?w=800&auto=format&fit=crop&q=80"
        ],
        "short_description": "Pure cow leather sole with 24k gold tilla embroidery on luxury micro-velvet.",
        "description": "Double-padded memory foam insole prevents shoe bites and guarantees all-night wedding comfort.",
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
                "name": "Champagne Gold",
                "hex": "#fef08a"
            },
            {
                "name": "Ruby Red",
                "hex": "#991b1b"
            },
            {
                "name": "Emerald Green",
                "hex": "#064e3b"
            }
        ],
        "category_attributes": {
            "gender": "Women",
            "shoe_type": "Khussa",
            "material": "Embroidered Velvet",
            "sole_material": "Genuine Cow Leather"
        }
    },
    {
        "id": 32,
        "name": "Royal Black Pure Steerhide Peshawari Chappal",
        "slug": "royal-black-pure-steerhide-peshawari-chappal",
        "category": "shoes",
        "subcategory": "Men Peshawari",
        "category_name": "Artisanal Footwear",
        "brand": "Khushi Footwear",
        "sku": "KC-SHS-002",
        "price": 6500,
        "sale_price": 4990,
        "cost_price": 2600,
        "stock": 30,
        "low_stock_threshold": 6,
        "status": "published",
        "is_featured": true,
        "is_new": true,
        "is_bestseller": true,
        "is_flash_sale": false,
        "rating": 4.98,
        "reviews_count": 82,
        "thumbnail": "https://images.unsplash.com/photo-1560343090-f0409e92791a?w=800&auto=format&fit=crop&q=80",
        "secondary_image": "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&auto=format&fit=crop&q=80",
        "images": [
            "https://images.unsplash.com/photo-1560343090-f0409e92791a?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=800&auto=format&fit=crop&q=80"
        ],
        "short_description": "Hand-stitched full grain cow leather traditional Kaptaan Peshawari chappal.",
        "description": "Authentic master artisan stitching with durable vehicular rubber tyre sole and cushioned arch support.",
        "sizes": [
            "39",
            "40",
            "41",
            "42",
            "43",
            "44"
        ],
        "colors": [
            {
                "name": "Jet Black",
                "hex": "#18181b"
            },
            {
                "name": "Chocolate Brown",
                "hex": "#451a03"
            },
            {
                "name": "Mustard Tan",
                "hex": "#d97706"
            }
        ],
        "category_attributes": {
            "gender": "Men",
            "shoe_type": "Peshawari Chappal",
            "material": "Full Grain Cowhide Leather",
            "sole_material": "Tyre Rubber Sole"
        }
    },
    {
        "id": 33,
        "name": "Champagne Crystal Embellished Velvet Mules",
        "slug": "champagne-crystal-embellished-velvet-mules",
        "category": "shoes",
        "subcategory": "Handcrafted Mules",
        "category_name": "Artisanal Footwear",
        "brand": "Khushi Footwear",
        "sku": "KC-SHS-003",
        "price": 5500,
        "sale_price": 4200,
        "cost_price": 2200,
        "stock": 18,
        "low_stock_threshold": 4,
        "status": "published",
        "is_featured": false,
        "is_new": true,
        "is_bestseller": false,
        "is_flash_sale": true,
        "rating": 4.91,
        "reviews_count": 27,
        "thumbnail": "https://images.unsplash.com/photo-1535043934128-cf0b28d52f95?w=800&auto=format&fit=crop&q=80",
        "secondary_image": "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&auto=format&fit=crop&q=80",
        "images": [
            "https://images.unsplash.com/photo-1535043934128-cf0b28d52f95?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1560343090-f0409e92791a?w=800&auto=format&fit=crop&q=80"
        ],
        "short_description": "Pointed-toe luxury mules adorned with baguette crystals and a sleek 1-inch heel.",
        "description": "Slip-on couture mules pairing seamlessly with stitched raw silk pret and festive trousers.",
        "sizes": [
            "36",
            "37",
            "38",
            "39",
            "40"
        ],
        "colors": [
            {
                "name": "Champagne",
                "hex": "#fef08a"
            },
            {
                "name": "Black Onyx",
                "hex": "#18181b"
            }
        ],
        "category_attributes": {
            "gender": "Women",
            "shoe_type": "Mules",
            "material": "Velvet with Baguette Crystals",
            "sole_material": "Leather"
        }
    },
    {
        "id": 34,
        "name": "Heritage Brown Norozi Peshawari Double-Sole",
        "slug": "heritage-brown-norozi-peshawari-double-sole",
        "category": "shoes",
        "subcategory": "Men Peshawari",
        "category_name": "Artisanal Footwear",
        "brand": "Khushi Footwear",
        "sku": "KC-SHS-004",
        "price": 7500,
        "sale_price": 5990,
        "cost_price": 3100,
        "stock": 15,
        "low_stock_threshold": 3,
        "status": "published",
        "is_featured": false,
        "is_new": false,
        "is_bestseller": true,
        "is_flash_sale": false,
        "rating": 4.97,
        "reviews_count": 49,
        "thumbnail": "https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=800&auto=format&fit=crop&q=80",
        "secondary_image": "https://images.unsplash.com/photo-1560343090-f0409e92791a?w=800&auto=format&fit=crop&q=80",
        "images": [
            "https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1560343090-f0409e92791a?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&auto=format&fit=crop&q=80"
        ],
        "short_description": "Quetta Norozi style double-tire sole with premium hand-burnished pull-up leather.",
        "description": "Heavy-duty traditional heritage design offering unmatched masculine elegance and decades of durability.",
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
                "name": "Rustic Brown",
                "hex": "#78350f"
            },
            {
                "name": "Black",
                "hex": "#18181b"
            }
        ],
        "category_attributes": {
            "gender": "Men",
            "shoe_type": "Peshawari Chappal",
            "material": "Pull-up Leather",
            "sole_material": "Double Tyre Sole"
        }
    },
    {
        "id": 35,
        "name": "Rose Gold Hand-Beaded Bridal Block Heels",
        "slug": "rose-gold-hand-beaded-bridal-block-heels",
        "category": "shoes",
        "subcategory": "Bridal Heels",
        "category_name": "Artisanal Footwear",
        "brand": "Khushi Footwear",
        "sku": "KC-SHS-005",
        "price": 8500,
        "sale_price": 6800,
        "cost_price": 3600,
        "stock": 10,
        "low_stock_threshold": 2,
        "status": "published",
        "is_featured": true,
        "is_new": true,
        "is_bestseller": false,
        "is_flash_sale": false,
        "rating": 4.93,
        "reviews_count": 31,
        "thumbnail": "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&auto=format&fit=crop&q=80",
        "secondary_image": "https://images.unsplash.com/photo-1535043934128-cf0b28d52f95?w=800&auto=format&fit=crop&q=80",
        "images": [
            "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1535043934128-cf0b28d52f95?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1560343090-f0409e92791a?w=800&auto=format&fit=crop&q=80"
        ],
        "short_description": "2.5-inch comfortable block heel covered in pearls, zari, and rose gold sequins.",
        "description": "Engineered for brides who demand stability, height, and glamour without aching feet.",
        "sizes": [
            "36",
            "37",
            "38",
            "39",
            "40"
        ],
        "colors": [
            {
                "name": "Rose Gold",
                "hex": "#fb7185"
            },
            {
                "name": "Silver Chrome",
                "hex": "#e2e8f0"
            }
        ],
        "category_attributes": {
            "gender": "Women",
            "shoe_type": "Bridal Heels",
            "material": "Beaded Silk",
            "sole_material": "Anti-Slip Rubber"
        }
    },
    {
        "id": 36,
        "name": "Emerald Velvet Embroidered Traditional Khussa",
        "slug": "emerald-velvet-embroidered-traditional-khussa",
        "category": "shoes",
        "subcategory": "Women Khussas",
        "category_name": "Artisanal Footwear",
        "brand": "Khushi Footwear",
        "sku": "KC-SHS-006",
        "price": 4200,
        "sale_price": 3100,
        "cost_price": 1600,
        "stock": 20,
        "low_stock_threshold": 4,
        "status": "published",
        "is_featured": false,
        "is_new": false,
        "is_bestseller": true,
        "is_flash_sale": true,
        "rating": 4.88,
        "reviews_count": 44,
        "thumbnail": "https://images.unsplash.com/photo-1560343090-f0409e92791a?w=800&auto=format&fit=crop&q=80",
        "secondary_image": "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&auto=format&fit=crop&q=80",
        "images": [
            "https://images.unsplash.com/photo-1560343090-f0409e92791a?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1535043934128-cf0b28d52f95?w=800&auto=format&fit=crop&q=80"
        ],
        "short_description": "Pure emerald velvet upper with intricate silver and gold floral tilla work.",
        "description": "Handmade in Lahore's historic bazaars using authentic generational shoemaking techniques.",
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
                "name": "Emerald Green",
                "hex": "#064e3b"
            },
            {
                "name": "Royal Blue",
                "hex": "#1e3a8a"
            }
        ],
        "category_attributes": {
            "gender": "Women",
            "shoe_type": "Khussa",
            "material": "Velvet",
            "sole_material": "Genuine Cow Leather"
        }
    },
    {
        "id": 37,
        "name": "Tan Brown Hand-Stitched Leather Penny Loafers",
        "slug": "tan-brown-hand-stitched-leather-penny-loafers",
        "category": "shoes",
        "subcategory": "Loafers",
        "category_name": "Artisanal Footwear",
        "brand": "Khushi Footwear",
        "sku": "KC-SHS-007",
        "price": 8900,
        "sale_price": 7200,
        "cost_price": 3800,
        "stock": 14,
        "low_stock_threshold": 3,
        "status": "published",
        "is_featured": false,
        "is_new": true,
        "is_bestseller": false,
        "is_flash_sale": false,
        "rating": 4.96,
        "reviews_count": 25,
        "thumbnail": "https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=800&auto=format&fit=crop&q=80",
        "secondary_image": "https://images.unsplash.com/photo-1560343090-f0409e92791a?w=800&auto=format&fit=crop&q=80",
        "images": [
            "https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1560343090-f0409e92791a?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&auto=format&fit=crop&q=80"
        ],
        "short_description": "Full-grain calfskin leather classic penny loafers with stacked leather heel.",
        "description": "Blake-stitched Italian construction with supple leather interior for both Eastern and Western attire.",
        "sizes": [
            "40",
            "41",
            "42",
            "43",
            "44"
        ],
        "colors": [
            {
                "name": "Tan Brown",
                "hex": "#b45309"
            },
            {
                "name": "Black",
                "hex": "#18181b"
            }
        ],
        "category_attributes": {
            "gender": "Men",
            "shoe_type": "Loafers",
            "material": "Calfskin Leather",
            "sole_material": "Stacked Leather"
        }
    },
    {
        "id": 38,
        "name": "Ruby Red Dabka-Worked Festive Jutti",
        "slug": "ruby-red-dabka-worked-festive-jutti",
        "category": "shoes",
        "subcategory": "Women Khussas",
        "category_name": "Artisanal Footwear",
        "brand": "Khushi Footwear",
        "sku": "KC-SHS-008",
        "price": 4800,
        "sale_price": 3600,
        "cost_price": 1900,
        "stock": 21,
        "low_stock_threshold": 4,
        "status": "published",
        "is_featured": false,
        "is_new": false,
        "is_bestseller": true,
        "is_flash_sale": false,
        "rating": 4.92,
        "reviews_count": 39,
        "thumbnail": "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&auto=format&fit=crop&q=80",
        "secondary_image": "https://images.unsplash.com/photo-1535043934128-cf0b28d52f95?w=800&auto=format&fit=crop&q=80",
        "images": [
            "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1535043934128-cf0b28d52f95?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1560343090-f0409e92791a?w=800&auto=format&fit=crop&q=80"
        ],
        "short_description": "Pure silk jutti embellished with French knots, sequins, and metallic dabka work.",
        "description": "Charming festive Punjabi jutti with soft inner lining and hand-burnished sole.",
        "sizes": [
            "36",
            "37",
            "38",
            "39",
            "40"
        ],
        "colors": [
            {
                "name": "Ruby Red",
                "hex": "#991b1b"
            },
            {
                "name": "Golden Yellow",
                "hex": "#eab308"
            }
        ],
        "category_attributes": {
            "gender": "Women",
            "shoe_type": "Khussa",
            "material": "Pure Silk with Dabka",
            "sole_material": "Leather"
        }
    },
    {
        "id": 39,
        "name": "Midnight Blue Suede Formal Moccasins",
        "slug": "midnight-blue-suede-formal-moccasins",
        "category": "shoes",
        "subcategory": "Loafers",
        "category_name": "Artisanal Footwear",
        "brand": "Khushi Footwear",
        "sku": "KC-SHS-009",
        "price": 7900,
        "sale_price": 6300,
        "cost_price": 3300,
        "stock": 13,
        "low_stock_threshold": 3,
        "status": "published",
        "is_featured": false,
        "is_new": true,
        "is_bestseller": false,
        "is_flash_sale": true,
        "rating": 4.89,
        "reviews_count": 19,
        "thumbnail": "https://images.unsplash.com/photo-1560343090-f0409e92791a?w=800&auto=format&fit=crop&q=80",
        "secondary_image": "https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=800&auto=format&fit=crop&q=80",
        "images": [
            "https://images.unsplash.com/photo-1560343090-f0409e92791a?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&auto=format&fit=crop&q=80"
        ],
        "short_description": "Water-resistant premium suede driving moccasins with rubber pebble grip sole.",
        "description": "Effortless casual luxury designed for long drives and festive evening get-togethers.",
        "sizes": [
            "40",
            "41",
            "42",
            "43",
            "44"
        ],
        "colors": [
            {
                "name": "Midnight Navy",
                "hex": "#1e3a8a"
            },
            {
                "name": "Charcoal Grey",
                "hex": "#374151"
            }
        ],
        "category_attributes": {
            "gender": "Men",
            "shoe_type": "Loafers",
            "material": "Water-Resistant Suede",
            "sole_material": "Pebbled Rubber Grip"
        }
    },
    {
        "id": 40,
        "name": "Ivory Pearl-Stitched Pointed Court Shoes",
        "slug": "ivory-pearl-stitched-pointed-court-shoes",
        "category": "shoes",
        "subcategory": "Bridal Heels",
        "category_name": "Artisanal Footwear",
        "brand": "Khushi Footwear",
        "sku": "KC-SHS-010",
        "price": 8800,
        "sale_price": 7100,
        "cost_price": 3700,
        "stock": 9,
        "low_stock_threshold": 2,
        "status": "published",
        "is_featured": false,
        "is_new": false,
        "is_bestseller": true,
        "is_flash_sale": false,
        "rating": 4.97,
        "reviews_count": 36,
        "thumbnail": "https://images.unsplash.com/photo-1535043934128-cf0b28d52f95?w=800&auto=format&fit=crop&q=80",
        "secondary_image": "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&auto=format&fit=crop&q=80",
        "images": [
            "https://images.unsplash.com/photo-1535043934128-cf0b28d52f95?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1560343090-f0409e92791a?w=800&auto=format&fit=crop&q=80"
        ],
        "short_description": "3-inch stiletto court shoe with hand-sewn pearl clusters and memory foam base.",
        "description": "The quintessential bridal heel, impeccably balanced for comfort and pure luxury poise.",
        "sizes": [
            "36",
            "37",
            "38",
            "39",
            "40"
        ],
        "colors": [
            {
                "name": "Royal Ivory",
                "hex": "#fafaf9"
            },
            {
                "name": "Golden Nude",
                "hex": "#fde047"
            }
        ],
        "category_attributes": {
            "gender": "Women",
            "shoe_type": "Bridal Heels",
            "material": "Satin with Pearls",
            "sole_material": "Smooth Leather"
        }
    },
    {
        "id": 41,
        "name": "Royal Chronograph Sapphire Glass Watch (Obsidian)",
        "slug": "royal-chronograph-sapphire-glass-watch-obsidian",
        "category": "watches",
        "subcategory": "Men Chronographs",
        "category_name": "Luxury Timepieces",
        "brand": "Khushi Timepieces",
        "sku": "KC-WTC-001",
        "price": 16500,
        "sale_price": 12900,
        "cost_price": 7200,
        "stock": 15,
        "low_stock_threshold": 3,
        "status": "published",
        "is_featured": true,
        "is_new": true,
        "is_bestseller": true,
        "is_flash_sale": false,
        "rating": 4.96,
        "reviews_count": 58,
        "thumbnail": "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&auto=format&fit=crop&q=80",
        "secondary_image": "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&auto=format&fit=crop&q=80",
        "images": [
            "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?w=800&auto=format&fit=crop&q=80"
        ],
        "short_description": "Japanese quartz chronograph with scratch-resistant sapphire crystal and 50M water resistance.",
        "description": "Crafted from solid 316L stainless steel with an obsidian sunburst dial, luminous hands, and double-butterfly deployment clasp.",
        "sizes": [
            "41mm Standard Case"
        ],
        "colors": [
            {
                "name": "Obsidian Black",
                "hex": "#18181b"
            },
            {
                "name": "Silver Steel",
                "hex": "#cbd5e1"
            }
        ],
        "category_attributes": {
            "brand": "Khushi Timepieces",
            "movement": "Japanese Quartz Chronograph",
            "dial_color": "Obsidian Black",
            "water_resistance": "5 ATM / 50M"
        }
    },
    {
        "id": 42,
        "name": "Khushi Heritage 24K Gold Plated Dress Watch",
        "slug": "khushi-heritage-24k-gold-plated-dress-watch",
        "category": "watches",
        "subcategory": "Men Chronographs",
        "category_name": "Luxury Timepieces",
        "brand": "Khushi Timepieces",
        "sku": "KC-WTC-002",
        "price": 19500,
        "sale_price": 15400,
        "cost_price": 8500,
        "stock": 10,
        "low_stock_threshold": 2,
        "status": "published",
        "is_featured": true,
        "is_new": true,
        "is_bestseller": true,
        "is_flash_sale": false,
        "rating": 4.98,
        "reviews_count": 42,
        "thumbnail": "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&auto=format&fit=crop&q=80",
        "secondary_image": "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&auto=format&fit=crop&q=80",
        "images": [
            "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1533139502658-0198f920d8e8?w=800&auto=format&fit=crop&q=80"
        ],
        "short_description": "24K electroplated gold case with champagne dial and Roman numerals.",
        "description": "The ultimate statement timepiece for weddings, featuring Swiss movement and anti-reflective sapphire glass.",
        "sizes": [
            "40mm Case"
        ],
        "colors": [
            {
                "name": "24K Gold",
                "hex": "#eab308"
            }
        ],
        "category_attributes": {
            "brand": "Khushi Timepieces",
            "movement": "Swiss Quartz Movement",
            "dial_color": "Champagne Gold",
            "water_resistance": "3 ATM / 30M"
        }
    },
    {
        "id": 43,
        "name": "Imperial Emerald Sunburst Dial Automatic Watch",
        "slug": "imperial-emerald-sunburst-dial-automatic-watch",
        "category": "watches",
        "subcategory": "Automatic Mechanical",
        "category_name": "Luxury Timepieces",
        "brand": "Khushi Timepieces",
        "sku": "KC-WTC-003",
        "price": 28000,
        "sale_price": 22900,
        "cost_price": 13500,
        "stock": 7,
        "low_stock_threshold": 2,
        "status": "published",
        "is_featured": true,
        "is_new": false,
        "is_bestseller": true,
        "is_flash_sale": false,
        "rating": 5.0,
        "reviews_count": 31,
        "thumbnail": "https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?w=800&auto=format&fit=crop&q=80",
        "secondary_image": "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&auto=format&fit=crop&q=80",
        "images": [
            "https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&auto=format&fit=crop&q=80"
        ],
        "short_description": "24-jewel self-winding automatic movement with exhibition case back and emerald dial.",
        "description": "40-hour power reserve mechanical automatic timepiece with hand-polished ceramic rotating bezel.",
        "sizes": [
            "42mm Case"
        ],
        "colors": [
            {
                "name": "Imperial Emerald",
                "hex": "#064e3b"
            },
            {
                "name": "Silver Steel",
                "hex": "#e2e8f0"
            }
        ],
        "category_attributes": {
            "brand": "Khushi Timepieces",
            "movement": "Automatic Mechanical",
            "dial_color": "Sunburst Emerald",
            "water_resistance": "10 ATM / 100M"
        }
    },
    {
        "id": 44,
        "name": "Midnight Ceramic Minimalist Luxury Timepiece",
        "slug": "midnight-ceramic-minimalist-luxury-timepiece",
        "category": "watches",
        "subcategory": "Women Luxury Timepieces",
        "category_name": "Luxury Timepieces",
        "brand": "Khushi Timepieces",
        "sku": "KC-WTC-004",
        "price": 15500,
        "sale_price": 11950,
        "cost_price": 6800,
        "stock": 14,
        "low_stock_threshold": 3,
        "status": "published",
        "is_featured": false,
        "is_new": true,
        "is_bestseller": false,
        "is_flash_sale": true,
        "rating": 4.92,
        "reviews_count": 23,
        "thumbnail": "https://images.unsplash.com/photo-1533139502658-0198f920d8e8?w=800&auto=format&fit=crop&q=80",
        "secondary_image": "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&auto=format&fit=crop&q=80",
        "images": [
            "https://images.unsplash.com/photo-1533139502658-0198f920d8e8?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&auto=format&fit=crop&q=80"
        ],
        "short_description": "High-tech scratchproof black ceramic bracelet with diamond hour markers.",
        "description": "Sleek, featherlight ceramic styling engineered for timeless everyday luxury and red-carpet elegance.",
        "sizes": [
            "34mm Slim Case"
        ],
        "colors": [
            {
                "name": "Midnight Ceramic",
                "hex": "#09090b"
            },
            {
                "name": "Rose Gold Trim",
                "hex": "#fb7185"
            }
        ],
        "category_attributes": {
            "brand": "Khushi Timepieces",
            "movement": "Japanese Quartz",
            "dial_color": "Obsidian Black",
            "water_resistance": "5 ATM / 50M"
        }
    },
    {
        "id": 45,
        "name": "Swiss Movement Rose Gold Diamond Bezel Watch",
        "slug": "swiss-movement-rose-gold-diamond-bezel-watch",
        "category": "watches",
        "subcategory": "Women Luxury Timepieces",
        "category_name": "Luxury Timepieces",
        "brand": "Khushi Timepieces",
        "sku": "KC-WTC-005",
        "price": 23500,
        "sale_price": 18900,
        "cost_price": 11000,
        "stock": 8,
        "low_stock_threshold": 2,
        "status": "published",
        "is_featured": true,
        "is_new": true,
        "is_bestseller": true,
        "is_flash_sale": false,
        "rating": 4.97,
        "reviews_count": 39,
        "thumbnail": "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&auto=format&fit=crop&q=80",
        "secondary_image": "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&auto=format&fit=crop&q=80",
        "images": [
            "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&auto=format&fit=crop&q=80"
        ],
        "short_description": "Mother of Pearl dial with cubic zirconia halo bezel and five-link bracelet.",
        "description": "A dazzling masterpiece crafted for ladies of prestige, featuring precision Swiss timekeeping.",
        "sizes": [
            "32mm Case"
        ],
        "colors": [
            {
                "name": "Rose Gold",
                "hex": "#fb7185"
            },
            {
                "name": "Silver Pearl",
                "hex": "#f1f5f9"
            }
        ],
        "category_attributes": {
            "brand": "Khushi Timepieces",
            "movement": "Swiss Quartz",
            "dial_color": "Mother of Pearl",
            "water_resistance": "3 ATM / 30M"
        }
    },
    {
        "id": 46,
        "name": "Classic Aviator Brown Leather Chronograph",
        "slug": "classic-aviator-brown-leather-chronograph",
        "category": "watches",
        "subcategory": "Men Chronographs",
        "category_name": "Luxury Timepieces",
        "brand": "Khushi Timepieces",
        "sku": "KC-WTC-006",
        "price": 14500,
        "sale_price": 11500,
        "cost_price": 6500,
        "stock": 19,
        "low_stock_threshold": 4,
        "status": "published",
        "is_featured": false,
        "is_new": false,
        "is_bestseller": true,
        "is_flash_sale": false,
        "rating": 4.9,
        "reviews_count": 47,
        "thumbnail": "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&auto=format&fit=crop&q=80",
        "secondary_image": "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&auto=format&fit=crop&q=80",
        "images": [
            "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?w=800&auto=format&fit=crop&q=80"
        ],
        "short_description": "Vintage aviator pilot dial with Italian distressed calfskin leather strap.",
        "description": "Multi-function chronograph sub-dials, date aperture, and luminescent hands for high visibility.",
        "sizes": [
            "43mm Case"
        ],
        "colors": [
            {
                "name": "Cognac Brown",
                "hex": "#78350f"
            },
            {
                "name": "Jet Black",
                "hex": "#18181b"
            }
        ],
        "category_attributes": {
            "brand": "Khushi Timepieces",
            "movement": "Japanese Quartz Chronograph",
            "dial_color": "Matte Black",
            "water_resistance": "5 ATM / 50M"
        }
    },
    {
        "id": 47,
        "name": "Platinum Silver Mesh Bracelet Dress Watch",
        "slug": "platinum-silver-mesh-bracelet-dress-watch",
        "category": "watches",
        "subcategory": "Women Luxury Timepieces",
        "category_name": "Luxury Timepieces",
        "brand": "Khushi Timepieces",
        "sku": "KC-WTC-007",
        "price": 12900,
        "sale_price": 9900,
        "cost_price": 5500,
        "stock": 16,
        "low_stock_threshold": 3,
        "status": "published",
        "is_featured": false,
        "is_new": true,
        "is_bestseller": false,
        "is_flash_sale": true,
        "rating": 4.88,
        "reviews_count": 21,
        "thumbnail": "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&auto=format&fit=crop&q=80",
        "secondary_image": "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&auto=format&fit=crop&q=80",
        "images": [
            "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1533139502658-0198f920d8e8?w=800&auto=format&fit=crop&q=80"
        ],
        "short_description": "Ultra-thin 6mm profile with Milanese magnetic steel mesh strap.",
        "description": "Minimalist Bauhaus aesthetics designed to slide comfortably under tailored cuffs.",
        "sizes": [
            "36mm Ultra-Thin"
        ],
        "colors": [
            {
                "name": "Platinum Silver",
                "hex": "#e2e8f0"
            }
        ],
        "category_attributes": {
            "brand": "Khushi Timepieces",
            "movement": "Japanese Quartz",
            "dial_color": "Silver Sunburst",
            "water_resistance": "3 ATM / 30M"
        }
    },
    {
        "id": 48,
        "name": "Deep Ocean Blue Diver 100M Water-Resistant Watch",
        "slug": "deep-ocean-blue-diver-100m-water-resistant-watch",
        "category": "watches",
        "subcategory": "Men Chronographs",
        "category_name": "Luxury Timepieces",
        "brand": "Khushi Timepieces",
        "sku": "KC-WTC-008",
        "price": 21000,
        "sale_price": 16800,
        "cost_price": 9500,
        "stock": 12,
        "low_stock_threshold": 3,
        "status": "published",
        "is_featured": false,
        "is_new": false,
        "is_bestseller": true,
        "is_flash_sale": false,
        "rating": 4.95,
        "reviews_count": 38,
        "thumbnail": "https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?w=800&auto=format&fit=crop&q=80",
        "secondary_image": "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&auto=format&fit=crop&q=80",
        "images": [
            "https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&auto=format&fit=crop&q=80"
        ],
        "short_description": "100M professional diving watch with unidirectional bezel and Super-LumiNova markers.",
        "description": "Heavy-duty diver with screw-down crown, solid steel oyster link bracelet, and magnified date cyclops.",
        "sizes": [
            "42mm Diver Case"
        ],
        "colors": [
            {
                "name": "Ocean Blue",
                "hex": "#1d4ed8"
            },
            {
                "name": "Batman Blue/Black",
                "hex": "#0f172a"
            }
        ],
        "category_attributes": {
            "brand": "Khushi Timepieces",
            "movement": "Japanese Quartz Chronograph",
            "dial_color": "Sunburst Blue",
            "water_resistance": "10 ATM / 100M"
        }
    },
    {
        "id": 49,
        "name": "Damascus Steel Limited Edition Skeleton Watch",
        "slug": "damascus-steel-limited-edition-skeleton-watch",
        "category": "watches",
        "subcategory": "Automatic Mechanical",
        "category_name": "Luxury Timepieces",
        "brand": "Khushi Timepieces",
        "sku": "KC-WTC-009",
        "price": 32000,
        "sale_price": 26900,
        "cost_price": 15000,
        "stock": 5,
        "low_stock_threshold": 1,
        "status": "published",
        "is_featured": true,
        "is_new": true,
        "is_bestseller": false,
        "is_flash_sale": false,
        "rating": 5.0,
        "reviews_count": 16,
        "thumbnail": "https://images.unsplash.com/photo-1533139502658-0198f920d8e8?w=800&auto=format&fit=crop&q=80",
        "secondary_image": "https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?w=800&auto=format&fit=crop&q=80",
        "images": [
            "https://images.unsplash.com/photo-1533139502658-0198f920d8e8?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&auto=format&fit=crop&q=80"
        ],
        "short_description": "Forged Damascus pattern steel case with full front and back skeleton mechanics.",
        "description": "Each case features a unique hand-folded steel grain pattern, showcasing the beating heart of automatic gears.",
        "sizes": [
            "44mm Case"
        ],
        "colors": [
            {
                "name": "Damascus Pattern",
                "hex": "#475569"
            }
        ],
        "category_attributes": {
            "brand": "Khushi Timepieces",
            "movement": "Automatic Mechanical",
            "dial_color": "Openwork Skeleton",
            "water_resistance": "5 ATM / 50M"
        }
    },
    {
        "id": 50,
        "name": "Vintage Champagne Dial Roman Numeral Timepiece",
        "slug": "vintage-champagne-dial-roman-numeral-timepiece",
        "category": "watches",
        "subcategory": "Men Chronographs",
        "category_name": "Luxury Timepieces",
        "brand": "Khushi Timepieces",
        "sku": "KC-WTC-010",
        "price": 13900,
        "sale_price": 10500,
        "cost_price": 5800,
        "stock": 20,
        "low_stock_threshold": 4,
        "status": "published",
        "is_featured": false,
        "is_new": false,
        "is_bestseller": true,
        "is_flash_sale": true,
        "rating": 4.93,
        "reviews_count": 34,
        "thumbnail": "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&auto=format&fit=crop&q=80",
        "secondary_image": "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&auto=format&fit=crop&q=80",
        "images": [
            "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&auto=format&fit=crop&q=80"
        ],
        "short_description": "Heritage Art-Deco rectangle gold case with sapphire glass and black leather strap.",
        "description": "Timeless aristocratic design reminiscent of European royalty, featuring blue stiletto hands.",
        "sizes": [
            "Rectangular 38x28mm"
        ],
        "colors": [
            {
                "name": "Gold / Champagne",
                "hex": "#eab308"
            }
        ],
        "category_attributes": {
            "brand": "Khushi Timepieces",
            "movement": "Swiss Quartz",
            "dial_color": "Champagne",
            "water_resistance": "3 ATM / 30M"
        }
    },
    {
        "id": 51,
        "name": "Khushi Imperial Oud De Parfum (100ml)",
        "slug": "khushi-imperial-oud-de-parfum",
        "category": "perfumes",
        "subcategory": "Oriental Oud",
        "category_name": "Imperial Ouds",
        "brand": "Khushi Haute Parfumerie",
        "sku": "KC-PRF-001",
        "price": 9500,
        "sale_price": 6990,
        "cost_price": 3800,
        "stock": 25,
        "low_stock_threshold": 5,
        "status": "published",
        "is_featured": true,
        "is_new": true,
        "is_bestseller": true,
        "is_flash_sale": true,
        "rating": 4.95,
        "reviews_count": 78,
        "thumbnail": "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&auto=format&fit=crop&q=80",
        "secondary_image": "https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=800&auto=format&fit=crop&q=80",
        "images": [
            "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=800&auto=format&fit=crop&q=80"
        ],
        "short_description": "28% concentrated aged Cambodian agarwood with Damascus rose, saffron, and Madagascar vanilla.",
        "description": "An opulent, long-lasting scent opening with sparkling saffron and damascus rose, melting into aged Cambodian agarwood, ambergris, and sweet Madagascan vanilla. Lasts over 24 hours on fabric.",
        "sizes": [
            "100ml / 3.4 fl. oz",
            "50ml / 1.7 fl. oz"
        ],
        "colors": [
            {
                "name": "Amber Noir",
                "hex": "#78350f"
            }
        ],
        "cod_allowed": false,
        "category_attributes": {
            "brand": "Khushi Haute Parfumerie",
            "fragrance_type": "Eau De Parfum (EDP)",
            "gender": "Unisex",
            "volume": "100ml / 3.4 fl. oz",
            "concentration": "28% Pure Oil Concentration"
        }
    },
    {
        "id": 52,
        "name": "Royal Velvet Damascus Rose Extrait De Parfum (100ml)",
        "slug": "royal-velvet-damascus-rose-extrait-de-parfum",
        "category": "perfumes",
        "subcategory": "Floral Eau De Parfum",
        "category_name": "Imperial Ouds",
        "brand": "Khushi Haute Parfumerie",
        "sku": "KC-PRF-002",
        "price": 11500,
        "sale_price": 8900,
        "cost_price": 4800,
        "stock": 18,
        "low_stock_threshold": 4,
        "status": "published",
        "is_featured": true,
        "is_new": true,
        "is_bestseller": true,
        "is_flash_sale": false,
        "rating": 4.98,
        "reviews_count": 52,
        "thumbnail": "https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=800&auto=format&fit=crop&q=80",
        "secondary_image": "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&auto=format&fit=crop&q=80",
        "images": [
            "https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=800&auto=format&fit=crop&q=80"
        ],
        "short_description": "Pure Taif and Damascus rose petals distilled with white musk and soft cashmere wood.",
        "description": "Romantic floral opulence with velvety sweet rose notes and projection that leaves an unforgettable royal trail.",
        "sizes": [
            "100ml"
        ],
        "colors": [
            {
                "name": "Rose Gold",
                "hex": "#fb7185"
            }
        ],
        "cod_allowed": false,
        "category_attributes": {
            "brand": "Khushi Haute Parfumerie",
            "fragrance_type": "Extrait De Parfum",
            "gender": "For Her",
            "volume": "100ml"
        }
    },
    {
        "id": 53,
        "name": "Amber Noir Pure Cambodian Dehn Al Oud (12ml Attar)",
        "slug": "amber-noir-pure-cambodian-dehn-al-oud-12ml",
        "category": "perfumes",
        "subcategory": "Attar Concentrates",
        "category_name": "Imperial Ouds",
        "brand": "Khushi Haute Parfumerie",
        "sku": "KC-PRF-003",
        "price": 14000,
        "sale_price": 10800,
        "cost_price": 6000,
        "stock": 12,
        "low_stock_threshold": 3,
        "status": "published",
        "is_featured": true,
        "is_new": false,
        "is_bestseller": true,
        "is_flash_sale": false,
        "rating": 5.0,
        "reviews_count": 64,
        "thumbnail": "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=800&auto=format&fit=crop&q=80",
        "secondary_image": "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&auto=format&fit=crop&q=80",
        "images": [
            "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=800&auto=format&fit=crop&q=80"
        ],
        "short_description": "100% alcohol-free vintage aged organic Cambodian Dehn Al Oud oil in crystal decanter.",
        "description": "Deep woody animalic base with sweet barnyard and balsamic undertones. A true collector's heirloom attar.",
        "sizes": [
            "12ml Crystal Tola Bottle"
        ],
        "colors": [
            {
                "name": "Dark Amber",
                "hex": "#78350f"
            }
        ],
        "cod_allowed": false,
        "category_attributes": {
            "brand": "Khushi Haute Parfumerie",
            "fragrance_type": "Pure Concentrated Attar",
            "gender": "Unisex",
            "volume": "12ml"
        }
    },
    {
        "id": 54,
        "name": "Mystical Saffron & Smoky Birch Extrait (100ml)",
        "slug": "mystical-saffron-smoky-birch-extrait",
        "category": "perfumes",
        "subcategory": "Oriental Oud",
        "category_name": "Imperial Ouds",
        "brand": "Khushi Haute Parfumerie",
        "sku": "KC-PRF-004",
        "price": 10500,
        "sale_price": 7950,
        "cost_price": 4200,
        "stock": 16,
        "low_stock_threshold": 3,
        "status": "published",
        "is_featured": false,
        "is_new": true,
        "is_bestseller": false,
        "is_flash_sale": true,
        "rating": 4.91,
        "reviews_count": 28,
        "thumbnail": "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=800&auto=format&fit=crop&q=80",
        "secondary_image": "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&auto=format&fit=crop&q=80",
        "images": [
            "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=800&auto=format&fit=crop&q=80"
        ],
        "short_description": "Kashmiri saffron, smoky birch tar, rich cardamom, and golden amber crystals.",
        "description": "Intoxicating, mysterious, and warm. Designed for evening gala nights and winter formal gatherings.",
        "sizes": [
            "100ml"
        ],
        "colors": [
            {
                "name": "Golden Saffron",
                "hex": "#eab308"
            }
        ],
        "cod_allowed": false,
        "category_attributes": {
            "brand": "Khushi Haute Parfumerie",
            "fragrance_type": "Extrait De Parfum",
            "gender": "Unisex",
            "volume": "100ml"
        }
    },
    {
        "id": 55,
        "name": "Jasmine Blanc French Concentrated Eau De Parfum (50ml)",
        "slug": "jasmine-blanc-french-concentrated-eau-de-parfum",
        "category": "perfumes",
        "subcategory": "Floral Eau De Parfum",
        "category_name": "Imperial Ouds",
        "brand": "Khushi Haute Parfumerie",
        "sku": "KC-PRF-005",
        "price": 8500,
        "sale_price": 6400,
        "cost_price": 3400,
        "stock": 22,
        "low_stock_threshold": 4,
        "status": "published",
        "is_featured": false,
        "is_new": true,
        "is_bestseller": true,
        "is_flash_sale": false,
        "rating": 4.93,
        "reviews_count": 37,
        "thumbnail": "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=800&auto=format&fit=crop&q=80",
        "secondary_image": "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=800&auto=format&fit=crop&q=80",
        "images": [
            "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&auto=format&fit=crop&q=80"
        ],
        "short_description": "Pure Grasse Sambac jasmine with fresh bergamot and sheer white amber.",
        "description": "A radiant white floral bouquet embodying grace, purity, and uplifting daytime freshness.",
        "sizes": [
            "50ml / 1.7 fl. oz"
        ],
        "colors": [
            {
                "name": "Crystal Clear",
                "hex": "#f8fafc"
            }
        ],
        "cod_allowed": false,
        "category_attributes": {
            "brand": "Khushi Haute Parfumerie",
            "fragrance_type": "Eau De Parfum (EDP)",
            "gender": "For Her",
            "volume": "50ml"
        }
    },
    {
        "id": 56,
        "name": "Arabian Nights Agarwood & Warm Ambergris (100ml)",
        "slug": "arabian-nights-agarwood-warm-ambergris",
        "category": "perfumes",
        "subcategory": "Oriental Oud",
        "category_name": "Imperial Ouds",
        "brand": "Khushi Haute Parfumerie",
        "sku": "KC-PRF-006",
        "price": 12500,
        "sale_price": 9800,
        "cost_price": 5200,
        "stock": 14,
        "low_stock_threshold": 3,
        "status": "published",
        "is_featured": true,
        "is_new": false,
        "is_bestseller": true,
        "is_flash_sale": false,
        "rating": 4.97,
        "reviews_count": 45,
        "thumbnail": "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&auto=format&fit=crop&q=80",
        "secondary_image": "https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=800&auto=format&fit=crop&q=80",
        "images": [
            "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=800&auto=format&fit=crop&q=80"
        ],
        "short_description": "Pure Arabian agarwood smoke, salty marine ambergris, and sweet patchouli.",
        "description": "Heavily concentrated royal blend inspired by ancient Middle Eastern Sultan palaces.",
        "sizes": [
            "100ml"
        ],
        "colors": [
            {
                "name": "Onyx Black Bottle",
                "hex": "#18181b"
            }
        ],
        "cod_allowed": false,
        "category_attributes": {
            "brand": "Khushi Haute Parfumerie",
            "fragrance_type": "Eau De Parfum (EDP)",
            "gender": "Unisex",
            "volume": "100ml"
        }
    },
    {
        "id": 57,
        "name": "Golden Santal & Cardamom Rich Elixir (50ml)",
        "slug": "golden-santal-cardamom-rich-elixir",
        "category": "perfumes",
        "subcategory": "Men Fragrances",
        "category_name": "Imperial Ouds",
        "brand": "Khushi Haute Parfumerie",
        "sku": "KC-PRF-007",
        "price": 8900,
        "sale_price": 6800,
        "cost_price": 3600,
        "stock": 20,
        "low_stock_threshold": 4,
        "status": "published",
        "is_featured": false,
        "is_new": true,
        "is_bestseller": false,
        "is_flash_sale": true,
        "rating": 4.88,
        "reviews_count": 22,
        "thumbnail": "https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=800&auto=format&fit=crop&q=80",
        "secondary_image": "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=800&auto=format&fit=crop&q=80",
        "images": [
            "https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&auto=format&fit=crop&q=80"
        ],
        "short_description": "Creamy Mysore sandalwood infused with green cardamom, iris, and cedarwood.",
        "description": "Sophisticated, smooth, and refined. The signature scent of modern gentlemen of distinction.",
        "sizes": [
            "50ml"
        ],
        "colors": [
            {
                "name": "Golden Sand",
                "hex": "#d97706"
            }
        ],
        "cod_allowed": false,
        "category_attributes": {
            "brand": "Khushi Haute Parfumerie",
            "fragrance_type": "Eau De Parfum (EDP)",
            "gender": "For Him",
            "volume": "50ml"
        }
    },
    {
        "id": 58,
        "name": "White Musk & French Bergamot Pure Oil (12ml)",
        "slug": "white-musk-french-bergamot-pure-oil",
        "category": "perfumes",
        "subcategory": "Attar Concentrates",
        "category_name": "Imperial Ouds",
        "brand": "Khushi Haute Parfumerie",
        "sku": "KC-PRF-008",
        "price": 6500,
        "sale_price": 4990,
        "cost_price": 2500,
        "stock": 27,
        "low_stock_threshold": 5,
        "status": "published",
        "is_featured": false,
        "is_new": false,
        "is_bestseller": true,
        "is_flash_sale": false,
        "rating": 4.96,
        "reviews_count": 51,
        "thumbnail": "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=800&auto=format&fit=crop&q=80",
        "secondary_image": "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&auto=format&fit=crop&q=80",
        "images": [
            "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=800&auto=format&fit=crop&q=80"
        ],
        "short_description": "Silky clean white musk with sparkling Italian bergamot and lily of the valley.",
        "description": "Non-alcoholic concentrated perfume oil providing clean, fresh aura that lasts for hours.",
        "sizes": [
            "12ml"
        ],
        "colors": [
            {
                "name": "Crystal White",
                "hex": "#ffffff"
            }
        ],
        "cod_allowed": false,
        "category_attributes": {
            "brand": "Khushi Haute Parfumerie",
            "fragrance_type": "Pure Concentrated Attar",
            "gender": "Unisex",
            "volume": "12ml"
        }
    },
    {
        "id": 59,
        "name": "Oriental Leather & Sweet Tobacco Parfum (100ml)",
        "slug": "oriental-leather-sweet-tobacco-parfum",
        "category": "perfumes",
        "subcategory": "Men Fragrances",
        "category_name": "Imperial Ouds",
        "brand": "Khushi Haute Parfumerie",
        "sku": "KC-PRF-009",
        "price": 11000,
        "sale_price": 8500,
        "cost_price": 4500,
        "stock": 15,
        "low_stock_threshold": 3,
        "status": "published",
        "is_featured": false,
        "is_new": true,
        "is_bestseller": false,
        "is_flash_sale": false,
        "rating": 4.94,
        "reviews_count": 33,
        "thumbnail": "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=800&auto=format&fit=crop&q=80",
        "secondary_image": "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&auto=format&fit=crop&q=80",
        "images": [
            "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=800&auto=format&fit=crop&q=80"
        ],
        "short_description": "Supple Tuscan leather, golden tobacco leaves, tonka bean, and spicy clove.",
        "description": "Dark, confident, and intensely sensual masculine fragrance with rich 18-hour longevity.",
        "sizes": [
            "100ml"
        ],
        "colors": [
            {
                "name": "Tobacco Brown",
                "hex": "#451a03"
            }
        ],
        "cod_allowed": false,
        "category_attributes": {
            "brand": "Khushi Haute Parfumerie",
            "fragrance_type": "Eau De Parfum (EDP)",
            "gender": "For Him",
            "volume": "100ml"
        }
    },
    {
        "id": 60,
        "name": "Imperial Citrus & Cedarwood Fresh EDP (100ml)",
        "slug": "imperial-citrus-cedarwood-fresh-edp",
        "category": "perfumes",
        "subcategory": "Men Fragrances",
        "category_name": "Imperial Ouds",
        "brand": "Khushi Haute Parfumerie",
        "sku": "KC-PRF-010",
        "price": 8900,
        "sale_price": 6990,
        "cost_price": 3600,
        "stock": 21,
        "low_stock_threshold": 4,
        "status": "published",
        "is_featured": false,
        "is_new": false,
        "is_bestseller": true,
        "is_flash_sale": true,
        "rating": 4.9,
        "reviews_count": 42,
        "thumbnail": "https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=800&auto=format&fit=crop&q=80",
        "secondary_image": "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&auto=format&fit=crop&q=80",
        "images": [
            "https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=800&auto=format&fit=crop&q=80"
        ],
        "short_description": "Zesty Sicilian lemons, pink pepper, vetiver, and atlas cedarwood.",
        "description": "Vibrant, energizing summer luxury designed to withstand hot weather with long-lasting freshness.",
        "sizes": [
            "100ml"
        ],
        "colors": [
            {
                "name": "Citrus Gold",
                "hex": "#eab308"
            }
        ],
        "cod_allowed": false,
        "category_attributes": {
            "brand": "Khushi Haute Parfumerie",
            "fragrance_type": "Eau De Parfum (EDP)",
            "gender": "Unisex",
            "volume": "100ml"
        }
    },
    {
        "id": 61,
        "name": "Artisan Structured Quilted Leather Tote Bag",
        "slug": "artisan-structured-quilted-leather-tote-bag",
        "category": "bags",
        "subcategory": "Luxury Totes",
        "category_name": "Leather Bags",
        "brand": "Khushi Leathercraft",
        "sku": "KC-BAG-001",
        "price": 8900,
        "sale_price": 6800,
        "cost_price": 3600,
        "stock": 14,
        "low_stock_threshold": 3,
        "status": "published",
        "is_featured": true,
        "is_new": true,
        "is_bestseller": true,
        "is_flash_sale": false,
        "rating": 4.95,
        "reviews_count": 48,
        "thumbnail": "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&auto=format&fit=crop&q=80",
        "secondary_image": "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&auto=format&fit=crop&q=80",
        "images": [
            "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&auto=format&fit=crop&q=80"
        ],
        "short_description": "Supple micro-grain vegan leather with 24k gold-plated accents and dedicated compartments.",
        "description": "Handcrafted from supple vegan leather with gold hardware, dedicated laptop compartment, and protective metal base feet.",
        "sizes": [
            "Standard Medium (34x26x13cm)"
        ],
        "colors": [
            {
                "name": "Caramel Tan",
                "hex": "#b45309"
            },
            {
                "name": "Onyx Black",
                "hex": "#18181b"
            }
        ],
        "category_attributes": {
            "brand": "Khushi Leathercraft",
            "bag_type": "Structured Tote",
            "material": "Vegan Micro-grain Leather",
            "compartments": 3
        }
    },
    {
        "id": 62,
        "name": "Royal Gold-Framed Bridal Velvet Minaudi\u00e8re Clutch",
        "slug": "royal-gold-framed-bridal-velvet-minaudiere-clutch",
        "category": "bags",
        "subcategory": "Bridal Clutches",
        "category_name": "Leather Bags",
        "brand": "Khushi Leathercraft",
        "sku": "KC-BAG-002",
        "price": 6500,
        "sale_price": 4990,
        "cost_price": 2500,
        "stock": 19,
        "low_stock_threshold": 4,
        "status": "published",
        "is_featured": true,
        "is_new": true,
        "is_bestseller": true,
        "is_flash_sale": false,
        "rating": 4.98,
        "reviews_count": 62,
        "thumbnail": "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=800&auto=format&fit=crop&q=80",
        "secondary_image": "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&auto=format&fit=crop&q=80",
        "images": [
            "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&auto=format&fit=crop&q=80"
        ],
        "short_description": "Hand-embroidered zardozi and pearl bridal box clutch with detachable gold chain.",
        "description": "The perfect bridal clutch, sized generously to hold any modern smartphone, compact mirror, and lipstick.",
        "sizes": [
            "Evening Box Size (20x12x5cm)"
        ],
        "colors": [
            {
                "name": "Royal Maroon",
                "hex": "#881337"
            },
            {
                "name": "Emerald Green",
                "hex": "#064e3b"
            },
            {
                "name": "Golden Ivory",
                "hex": "#fef08a"
            }
        ],
        "category_attributes": {
            "brand": "Khushi Leathercraft",
            "bag_type": "Bridal Clutch",
            "material": "Velvet & Brass Frame",
            "strap_type": "Detachable Gold Chain"
        }
    },
    {
        "id": 63,
        "name": "Classic Monogram Top-Handle Shoulder Bag",
        "slug": "classic-monogram-top-handle-shoulder-bag",
        "category": "bags",
        "subcategory": "Crossbody",
        "category_name": "Leather Bags",
        "brand": "Khushi Leathercraft",
        "sku": "KC-BAG-003",
        "price": 7900,
        "sale_price": 6200,
        "cost_price": 3200,
        "stock": 16,
        "low_stock_threshold": 3,
        "status": "published",
        "is_featured": false,
        "is_new": true,
        "is_bestseller": false,
        "is_flash_sale": true,
        "rating": 4.9,
        "reviews_count": 28,
        "thumbnail": "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&auto=format&fit=crop&q=80",
        "secondary_image": "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&auto=format&fit=crop&q=80",
        "images": [
            "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=800&auto=format&fit=crop&q=80"
        ],
        "short_description": "Structured top-handle bag with embossed logo emblem and adjustable leather strap.",
        "description": "Timeless Parisian-inspired silhouette for effortless transition from boardroom to high tea.",
        "sizes": [
            "Medium (28x20x10cm)"
        ],
        "colors": [
            {
                "name": "Ivory Cream",
                "hex": "#fafaf9"
            },
            {
                "name": "Ebony Black",
                "hex": "#18181b"
            }
        ],
        "category_attributes": {
            "brand": "Khushi Leathercraft",
            "bag_type": "Crossbody",
            "material": "Embossed Saffiano",
            "strap_type": "Dual Top Handle & Crossbody"
        }
    },
    {
        "id": 64,
        "name": "Emerald Velvet Hand-Zardozi Evening Potli Bag",
        "slug": "emerald-velvet-hand-zardozi-evening-potli-bag",
        "category": "bags",
        "subcategory": "Bridal Clutches",
        "category_name": "Leather Bags",
        "brand": "Khushi Leathercraft",
        "sku": "KC-BAG-004",
        "price": 5200,
        "sale_price": 3950,
        "cost_price": 2000,
        "stock": 25,
        "low_stock_threshold": 5,
        "status": "published",
        "is_featured": false,
        "is_new": false,
        "is_bestseller": true,
        "is_flash_sale": false,
        "rating": 4.96,
        "reviews_count": 55,
        "thumbnail": "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&auto=format&fit=crop&q=80",
        "secondary_image": "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=800&auto=format&fit=crop&q=80",
        "images": [
            "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&auto=format&fit=crop&q=80"
        ],
        "short_description": "Hand-crafted drawstring potli bag with heavy pearl latkans and tilla tassels.",
        "description": "Rich traditional aesthetic that pairs flawlessly with bridal lehengas and festive stitched pret.",
        "sizes": [
            "Standard Potli"
        ],
        "colors": [
            {
                "name": "Emerald Green",
                "hex": "#064e3b"
            },
            {
                "name": "Crimson Red",
                "hex": "#991b1b"
            }
        ],
        "category_attributes": {
            "brand": "Khushi Leathercraft",
            "bag_type": "Bridal Clutch",
            "material": "Micro Velvet",
            "closure_type": "Drawstring with Tassels"
        }
    },
    {
        "id": 65,
        "name": "Saffiano Vegan Leather Everyday Crossbody Bag",
        "slug": "saffiano-vegan-leather-everyday-crossbody-bag",
        "category": "bags",
        "subcategory": "Crossbody",
        "category_name": "Leather Bags",
        "brand": "Khushi Leathercraft",
        "sku": "KC-BAG-005",
        "price": 6200,
        "sale_price": 4800,
        "cost_price": 2400,
        "stock": 21,
        "low_stock_threshold": 4,
        "status": "published",
        "is_featured": false,
        "is_new": true,
        "is_bestseller": false,
        "is_flash_sale": true,
        "rating": 4.87,
        "reviews_count": 34,
        "thumbnail": "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&auto=format&fit=crop&q=80",
        "secondary_image": "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&auto=format&fit=crop&q=80",
        "images": [
            "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&auto=format&fit=crop&q=80"
        ],
        "short_description": "Scratchproof Saffiano finish crossbody with zippered compartments and gold hardware.",
        "description": "Compact, lightweight, and incredibly durable for busy modern women on the move.",
        "sizes": [
            "Compact (22x15x7cm)"
        ],
        "colors": [
            {
                "name": "Dusty Rose",
                "hex": "#fb7185"
            },
            {
                "name": "Taupe Grey",
                "hex": "#a8a29e"
            }
        ],
        "category_attributes": {
            "brand": "Khushi Leathercraft",
            "bag_type": "Crossbody",
            "material": "Saffiano Vegan Leather",
            "compartments": 2
        }
    },
    {
        "id": 66,
        "name": "Midnight Black Crocodile-Embossed Baguette",
        "slug": "midnight-black-crocodile-embossed-baguette",
        "category": "bags",
        "subcategory": "Luxury Totes",
        "category_name": "Leather Bags",
        "brand": "Khushi Leathercraft",
        "sku": "KC-BAG-006",
        "price": 6900,
        "sale_price": 5400,
        "cost_price": 2800,
        "stock": 17,
        "low_stock_threshold": 3,
        "status": "published",
        "is_featured": false,
        "is_new": true,
        "is_bestseller": true,
        "is_flash_sale": false,
        "rating": 4.93,
        "reviews_count": 39,
        "thumbnail": "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&auto=format&fit=crop&q=80",
        "secondary_image": "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=800&auto=format&fit=crop&q=80",
        "images": [
            "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&auto=format&fit=crop&q=80"
        ],
        "short_description": "90s retro high-shine crocodile texture shoulder baguette with magnetic closure.",
        "description": "Chic arm-candy statement piece lined in suede with internal card organizer.",
        "sizes": [
            "Baguette (26x14x6cm)"
        ],
        "colors": [
            {
                "name": "Onyx Black",
                "hex": "#18181b"
            },
            {
                "name": "Burgundy Croc",
                "hex": "#881337"
            }
        ],
        "category_attributes": {
            "brand": "Khushi Leathercraft",
            "bag_type": "Structured Tote",
            "material": "Embossed Croc Leather",
            "closure_type": "Magnetic Snap"
        }
    },
    {
        "id": 67,
        "name": "Pearl-Beaded Festive Silk Handbag",
        "slug": "pearl-beaded-festive-silk-handbag",
        "category": "bags",
        "subcategory": "Bridal Clutches",
        "category_name": "Leather Bags",
        "brand": "Khushi Leathercraft",
        "sku": "KC-BAG-007",
        "price": 7500,
        "sale_price": 5900,
        "cost_price": 3000,
        "stock": 11,
        "low_stock_threshold": 2,
        "status": "published",
        "is_featured": false,
        "is_new": false,
        "is_bestseller": true,
        "is_flash_sale": false,
        "rating": 4.97,
        "reviews_count": 46,
        "thumbnail": "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=800&auto=format&fit=crop&q=80",
        "secondary_image": "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&auto=format&fit=crop&q=80",
        "images": [
            "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&auto=format&fit=crop&q=80"
        ],
        "short_description": "Thousands of Austrian micro-pearls hand-woven into a luxury raw silk frame.",
        "description": "A dazzling bridal accessory crafted to complement heirloom festive jewellery.",
        "sizes": [
            "Evening Handbag (22x16x8cm)"
        ],
        "colors": [
            {
                "name": "Royal Ivory",
                "hex": "#fafaf9"
            }
        ],
        "category_attributes": {
            "brand": "Khushi Leathercraft",
            "bag_type": "Bridal Clutch",
            "material": "Pearls & Raw Silk",
            "strap_type": "Pearl Beaded Handle"
        }
    },
    {
        "id": 68,
        "name": "Cognac Brown Multi-Compartment Carryall Bag",
        "slug": "cognac-brown-multi-compartment-carryall-bag",
        "category": "bags",
        "subcategory": "Luxury Totes",
        "category_name": "Leather Bags",
        "brand": "Khushi Leathercraft",
        "sku": "KC-BAG-008",
        "price": 9500,
        "sale_price": 7500,
        "cost_price": 4000,
        "stock": 13,
        "low_stock_threshold": 3,
        "status": "published",
        "is_featured": false,
        "is_new": true,
        "is_bestseller": false,
        "is_flash_sale": true,
        "rating": 4.91,
        "reviews_count": 25,
        "thumbnail": "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&auto=format&fit=crop&q=80",
        "secondary_image": "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&auto=format&fit=crop&q=80",
        "images": [
            "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&auto=format&fit=crop&q=80"
        ],
        "short_description": "Spacious 3-section everyday tote with central padded zipper sleeve for 13-inch laptops.",
        "description": "Hand-burnished edges, reinforced stitching, and solid metal accents for the professional woman.",
        "sizes": [
            "Large Carryall (38x29x14cm)"
        ],
        "colors": [
            {
                "name": "Cognac Brown",
                "hex": "#78350f"
            },
            {
                "name": "Olive Khaki",
                "hex": "#65a30d"
            }
        ],
        "category_attributes": {
            "brand": "Khushi Leathercraft",
            "bag_type": "Structured Tote",
            "material": "Vegan Leather",
            "compartments": 3
        }
    },
    {
        "id": 69,
        "name": "Rose Gold Metallic Party Clutch with Chain",
        "slug": "rose-gold-metallic-party-clutch-with-chain",
        "category": "bags",
        "subcategory": "Bridal Clutches",
        "category_name": "Leather Bags",
        "brand": "Khushi Leathercraft",
        "sku": "KC-BAG-009",
        "price": 5800,
        "sale_price": 4400,
        "cost_price": 2200,
        "stock": 20,
        "low_stock_threshold": 4,
        "status": "published",
        "is_featured": false,
        "is_new": false,
        "is_bestseller": true,
        "is_flash_sale": false,
        "rating": 4.89,
        "reviews_count": 31,
        "thumbnail": "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=800&auto=format&fit=crop&q=80",
        "secondary_image": "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&auto=format&fit=crop&q=80",
        "images": [
            "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&auto=format&fit=crop&q=80"
        ],
        "short_description": "Shimmering metallic textured envelope clutch with magnetic lock.",
        "description": "Glinting rose-gold finish catching ambient ballroom light effortlessly.",
        "sizes": [
            "Envelope (24x13x4cm)"
        ],
        "colors": [
            {
                "name": "Rose Gold",
                "hex": "#fb7185"
            },
            {
                "name": "Silver Chrome",
                "hex": "#e2e8f0"
            }
        ],
        "category_attributes": {
            "brand": "Khushi Leathercraft",
            "bag_type": "Bridal Clutch",
            "material": "Metallic Leatherette",
            "strap_type": "Detachable Chain"
        }
    },
    {
        "id": 70,
        "name": "Heritage Khaddi Silk Hand-Embroidered Tote",
        "slug": "heritage-khaddi-silk-hand-embroidered-tote",
        "category": "bags",
        "subcategory": "Luxury Totes",
        "category_name": "Leather Bags",
        "brand": "Khushi Leathercraft",
        "sku": "KC-BAG-010",
        "price": 8200,
        "sale_price": 6500,
        "cost_price": 3400,
        "stock": 12,
        "low_stock_threshold": 3,
        "status": "published",
        "is_featured": false,
        "is_new": true,
        "is_bestseller": false,
        "is_flash_sale": false,
        "rating": 4.95,
        "reviews_count": 27,
        "thumbnail": "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&auto=format&fit=crop&q=80",
        "secondary_image": "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&auto=format&fit=crop&q=80",
        "images": [
            "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=800&auto=format&fit=crop&q=80"
        ],
        "short_description": "Handloom khaddi raw silk body with genuine leather shoulder handles.",
        "description": "Celebrates rich Pakistani artisanal weaving combined with modern durable construction.",
        "sizes": [
            "Tote (35x30x12cm)"
        ],
        "colors": [
            {
                "name": "Mustard Silk",
                "hex": "#eab308"
            },
            {
                "name": "Teal Silk",
                "hex": "#0e7490"
            }
        ],
        "category_attributes": {
            "brand": "Khushi Leathercraft",
            "bag_type": "Structured Tote",
            "material": "Khaddi Handloom Silk & Leather",
            "compartments": 2
        }
    },
    {
        "id": 71,
        "name": "24K Pure Gold Radiance Glow Face Elixir",
        "slug": "24k-pure-gold-radiance-glow-face-elixir",
        "category": "beauty",
        "subcategory": "Face Serums",
        "category_name": "Luxury Skincare",
        "brand": "Khushi Botanicals",
        "sku": "KC-BTY-001",
        "price": 5500,
        "sale_price": 3990,
        "cost_price": 1800,
        "stock": 35,
        "low_stock_threshold": 6,
        "status": "published",
        "is_featured": true,
        "is_new": true,
        "is_bestseller": true,
        "is_flash_sale": false,
        "rating": 4.97,
        "reviews_count": 89,
        "thumbnail": "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80",
        "secondary_image": "https://images.unsplash.com/photo-1608248597359-0056e4c76b92?w=800&auto=format&fit=crop&q=80",
        "images": [
            "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1608248597359-0056e4c76b92?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&auto=format&fit=crop&q=80"
        ],
        "short_description": "Genuine 24K edible gold flakes in cold-pressed rosehip and squalane oil for luminous skin.",
        "description": "Fights dullness, stimulates cellular collagen, and imparts an instant dewy glass-skin glow before festive makeup.",
        "sizes": [
            "30ml Dropper Bottle"
        ],
        "colors": [
            {
                "name": "24K Liquid Gold",
                "hex": "#eab308"
            }
        ],
        "category_attributes": {
            "brand": "Khushi Botanicals",
            "skin_type": "All Skin Types",
            "volume": "30ml",
            "benefits": "Instant Radiance & Hydration"
        }
    },
    {
        "id": 72,
        "name": "Pure Moroccan Cold-Pressed Argan Oil (50ml)",
        "slug": "pure-moroccan-cold-pressed-argan-oil",
        "category": "beauty",
        "subcategory": "Glow Oils",
        "category_name": "Luxury Skincare",
        "brand": "Khushi Botanicals",
        "sku": "KC-BTY-002",
        "price": 4200,
        "sale_price": 3200,
        "cost_price": 1500,
        "stock": 28,
        "low_stock_threshold": 5,
        "status": "published",
        "is_featured": true,
        "is_new": false,
        "is_bestseller": true,
        "is_flash_sale": false,
        "rating": 4.94,
        "reviews_count": 67,
        "thumbnail": "https://images.unsplash.com/photo-1608248597359-0056e4c76b92?w=800&auto=format&fit=crop&q=80",
        "secondary_image": "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80",
        "images": [
            "https://images.unsplash.com/photo-1608248597359-0056e4c76b92?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&auto=format&fit=crop&q=80"
        ],
        "short_description": "100% organic virgin Moroccan liquid gold for silky hair, radiant face, and soft cuticles.",
        "description": "Rich in natural Vitamin E, Omega-6, and antioxidants. Deeply nourishes dry skin and repairs heat-damaged hair.",
        "sizes": [
            "50ml Glass Bottle"
        ],
        "colors": [
            {
                "name": "Golden Amber",
                "hex": "#d97706"
            }
        ],
        "category_attributes": {
            "brand": "Khushi Botanicals",
            "skin_type": "Dry / Normal",
            "volume": "50ml",
            "benefits": "Deep Nourishment"
        }
    },
    {
        "id": 73,
        "name": "Organic Damascus Rose Water Hydrating Mist",
        "slug": "organic-damascus-rose-water-hydrating-mist",
        "category": "beauty",
        "subcategory": "Organic Care",
        "category_name": "Luxury Skincare",
        "brand": "Khushi Botanicals",
        "sku": "KC-BTY-003",
        "price": 2500,
        "sale_price": 1850,
        "cost_price": 800,
        "stock": 45,
        "low_stock_threshold": 8,
        "status": "published",
        "is_featured": false,
        "is_new": true,
        "is_bestseller": true,
        "is_flash_sale": true,
        "rating": 4.96,
        "reviews_count": 94,
        "thumbnail": "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&auto=format&fit=crop&q=80",
        "secondary_image": "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80",
        "images": [
            "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1608248597359-0056e4c76b92?w=800&auto=format&fit=crop&q=80"
        ],
        "short_description": "Pure steam-distilled Kashmiri and Damascus rose hydrosol in fine mist spray.",
        "description": "Balances skin pH, tightens pores, and refreshes makeup throughout demanding celebratory days.",
        "sizes": [
            "120ml Spray Bottle"
        ],
        "colors": [
            {
                "name": "Pure Rose",
                "hex": "#fda4af"
            }
        ],
        "category_attributes": {
            "brand": "Khushi Botanicals",
            "skin_type": "All Skin Types",
            "volume": "120ml",
            "benefits": "Hydrating & Toning"
        }
    },
    {
        "id": 74,
        "name": "Royal Saffron & Turmeric Brightening Face Mask",
        "slug": "royal-saffron-turmeric-brightening-face-mask",
        "category": "beauty",
        "subcategory": "Organic Care",
        "category_name": "Luxury Skincare",
        "brand": "Khushi Botanicals",
        "sku": "KC-BTY-004",
        "price": 3800,
        "sale_price": 2950,
        "cost_price": 1300,
        "stock": 30,
        "low_stock_threshold": 5,
        "status": "published",
        "is_featured": false,
        "is_new": false,
        "is_bestseller": true,
        "is_flash_sale": false,
        "rating": 4.91,
        "reviews_count": 53,
        "thumbnail": "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&auto=format&fit=crop&q=80",
        "secondary_image": "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80",
        "images": [
            "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&auto=format&fit=crop&q=80"
        ],
        "short_description": "Traditional Ubtan formulation with wild Kasturi turmeric, Kashmiri saffron, and sandalwood.",
        "description": "Gently exfoliates dead cells, fades dark spots, and restores instant bridal glow.",
        "sizes": [
            "100g Jar"
        ],
        "colors": [
            {
                "name": "Golden Saffron",
                "hex": "#eab308"
            }
        ],
        "category_attributes": {
            "brand": "Khushi Botanicals",
            "skin_type": "Dull / Pigmented",
            "volume": "100g",
            "benefits": "Brightening & Exfoliation"
        }
    },
    {
        "id": 75,
        "name": "Illuminating Pearl Radiance Facial Serum",
        "slug": "illuminating-pearl-radiance-facial-serum",
        "category": "beauty",
        "subcategory": "Face Serums",
        "category_name": "Luxury Skincare",
        "brand": "Khushi Botanicals",
        "sku": "KC-BTY-005",
        "price": 4900,
        "sale_price": 3650,
        "cost_price": 1700,
        "stock": 26,
        "low_stock_threshold": 5,
        "status": "published",
        "is_featured": true,
        "is_new": true,
        "is_bestseller": false,
        "is_flash_sale": true,
        "rating": 4.93,
        "reviews_count": 38,
        "thumbnail": "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&auto=format&fit=crop&q=80",
        "secondary_image": "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80",
        "images": [
            "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1608248597359-0056e4c76b92?w=800&auto=format&fit=crop&q=80"
        ],
        "short_description": "Niacinamide 10% + Zinc 1% with genuine crushed freshwater pearl extract.",
        "description": "Refines enlarged pores, regulates excess oil, and leaves skin smooth, radiant, and clear.",
        "sizes": [
            "30ml Dropper Bottle"
        ],
        "colors": [
            {
                "name": "Opalescent Pearl",
                "hex": "#f1f5f9"
            }
        ],
        "category_attributes": {
            "brand": "Khushi Botanicals",
            "skin_type": "Oily / Combination",
            "volume": "30ml",
            "benefits": "Pore Tightening & Clarity"
        }
    },
    {
        "id": 76,
        "name": "Velvet Matte Long-Lasting Couture Lip Oil",
        "slug": "velvet-matte-long-lasting-couture-lip-oil",
        "category": "beauty",
        "subcategory": "Glow Oils",
        "category_name": "Luxury Skincare",
        "brand": "Khushi Botanicals",
        "sku": "KC-BTY-006",
        "price": 2800,
        "sale_price": 2100,
        "cost_price": 950,
        "stock": 40,
        "low_stock_threshold": 7,
        "status": "published",
        "is_featured": false,
        "is_new": true,
        "is_bestseller": true,
        "is_flash_sale": false,
        "rating": 4.9,
        "reviews_count": 61,
        "thumbnail": "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=800&auto=format&fit=crop&q=80",
        "secondary_image": "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80",
        "images": [
            "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&auto=format&fit=crop&q=80"
        ],
        "short_description": "Nourishing jojoba and vitamin E lip treatment with sheer festive berry tint.",
        "description": "Non-sticky, mirror-shine plumping oil that hydrates dry lips and enhances natural lip color.",
        "sizes": [
            "8ml Wand Tube"
        ],
        "colors": [
            {
                "name": "Royal Berry",
                "hex": "#9f1239"
            },
            {
                "name": "Rose Nude",
                "hex": "#fb7185"
            }
        ],
        "category_attributes": {
            "brand": "Khushi Botanicals",
            "skin_type": "All",
            "volume": "8ml",
            "benefits": "Plumping & Hydration"
        }
    },
    {
        "id": 77,
        "name": "Botanical Vitamin C & E Antioxidant Elixir",
        "slug": "botanical-vitamin-c-e-antioxidant-elixir",
        "category": "beauty",
        "subcategory": "Face Serums",
        "category_name": "Luxury Skincare",
        "brand": "Khushi Botanicals",
        "sku": "KC-BTY-007",
        "price": 4600,
        "sale_price": 3490,
        "cost_price": 1600,
        "stock": 24,
        "low_stock_threshold": 4,
        "status": "published",
        "is_featured": false,
        "is_new": false,
        "is_bestseller": true,
        "is_flash_sale": false,
        "rating": 4.92,
        "reviews_count": 48,
        "thumbnail": "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&auto=format&fit=crop&q=80",
        "secondary_image": "https://images.unsplash.com/photo-1608248597359-0056e4c76b92?w=800&auto=format&fit=crop&q=80",
        "images": [
            "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1608248597359-0056e4c76b92?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80"
        ],
        "short_description": "15% stabilized L-Ascorbic acid with Ferulic acid for sun damage recovery.",
        "description": "Fades stubborn hyperpigmentation, protects against environmental pollution, and brightens complexion.",
        "sizes": [
            "30ml Dark Amber Bottle"
        ],
        "colors": [
            {
                "name": "Citrus Glow",
                "hex": "#ea580c"
            }
        ],
        "category_attributes": {
            "brand": "Khushi Botanicals",
            "skin_type": "Sun Damaged / Aging",
            "volume": "30ml",
            "benefits": "Antioxidant Shield"
        }
    },
    {
        "id": 78,
        "name": "Organic Shea & Rosehip Body Butter",
        "slug": "organic-shea-rosehip-body-butter",
        "category": "beauty",
        "subcategory": "Organic Care",
        "category_name": "Luxury Skincare",
        "brand": "Khushi Botanicals",
        "sku": "KC-BTY-008",
        "price": 3400,
        "sale_price": 2600,
        "cost_price": 1200,
        "stock": 32,
        "low_stock_threshold": 6,
        "status": "published",
        "is_featured": false,
        "is_new": true,
        "is_bestseller": false,
        "is_flash_sale": true,
        "rating": 4.88,
        "reviews_count": 29,
        "thumbnail": "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&auto=format&fit=crop&q=80",
        "secondary_image": "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&auto=format&fit=crop&q=80",
        "images": [
            "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80"
        ],
        "short_description": "Whipped African shea butter with organic rosehip seed oil and vanilla pods.",
        "description": "Melts instantly on contact to hydrate dry elbows, knees, and heels with zero greasiness.",
        "sizes": [
            "200g Tub"
        ],
        "colors": [
            {
                "name": "Whipped Cream",
                "hex": "#fef08a"
            }
        ],
        "category_attributes": {
            "brand": "Khushi Botanicals",
            "skin_type": "Dry / Very Dry",
            "volume": "200g",
            "benefits": "Intense Moisture"
        }
    },
    {
        "id": 79,
        "name": "Ayurvedic 21-Herb Revitalizing Hair Oil",
        "slug": "ayurvedic-21-herb-revitalizing-hair-oil",
        "category": "beauty",
        "subcategory": "Glow Oils",
        "category_name": "Luxury Skincare",
        "brand": "Khushi Botanicals",
        "sku": "KC-BTY-009",
        "price": 3600,
        "sale_price": 2750,
        "cost_price": 1300,
        "stock": 38,
        "low_stock_threshold": 6,
        "status": "published",
        "is_featured": false,
        "is_new": false,
        "is_bestseller": true,
        "is_flash_sale": false,
        "rating": 4.97,
        "reviews_count": 82,
        "thumbnail": "https://images.unsplash.com/photo-1608248597359-0056e4c76b92?w=800&auto=format&fit=crop&q=80",
        "secondary_image": "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80",
        "images": [
            "https://images.unsplash.com/photo-1608248597359-0056e4c76b92?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&auto=format&fit=crop&q=80"
        ],
        "short_description": "Bhringraj, Amla, Shikakai, Rosemary, and Castor oil slow-infused for hair strength.",
        "description": "Stops hair fall, strengthens hair roots, and promotes thick lustrous hair growth naturally.",
        "sizes": [
            "200ml Bottle"
        ],
        "colors": [
            {
                "name": "Herbal Green",
                "hex": "#15803d"
            }
        ],
        "category_attributes": {
            "brand": "Khushi Botanicals",
            "hair_type": "All Hair Types",
            "volume": "200ml",
            "benefits": "Hair Fall Control & Shine"
        }
    },
    {
        "id": 80,
        "name": "Silk Hydration Hyaluronic Acid Serum",
        "slug": "silk-hydration-hyaluronic-acid-serum",
        "category": "beauty",
        "subcategory": "Face Serums",
        "category_name": "Luxury Skincare",
        "brand": "Khushi Botanicals",
        "sku": "KC-BTY-010",
        "price": 4200,
        "sale_price": 3150,
        "cost_price": 1400,
        "stock": 29,
        "low_stock_threshold": 5,
        "status": "published",
        "is_featured": false,
        "is_new": true,
        "is_bestseller": false,
        "is_flash_sale": true,
        "rating": 4.95,
        "reviews_count": 44,
        "thumbnail": "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&auto=format&fit=crop&q=80",
        "secondary_image": "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80",
        "images": [
            "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1608248597359-0056e4c76b92?w=800&auto=format&fit=crop&q=80"
        ],
        "short_description": "Multi-molecular weight Hyaluronic Acid 2% + B5 for intense cellular hydration.",
        "description": "Quenches thirsty skin, plumps fine lines, and creates an ultra-smooth velvety makeup canvas.",
        "sizes": [
            "30ml Dropper"
        ],
        "colors": [
            {
                "name": "Crystal Clear",
                "hex": "#f8fafc"
            }
        ],
        "category_attributes": {
            "brand": "Khushi Botanicals",
            "skin_type": "Dehydrated / Dry",
            "volume": "30ml",
            "benefits": "Intense Plumping Hydration"
        }
    }
];

// Default Comprehensive Store Settings (Configurable by Owner)
const DEFAULT_SETTINGS = {
    store_profile: {
        store_name: "Khushi Collection",
        owner_name: "Khushi Fatima",
        phone: "+92 300 1234567",
        whatsapp: "+92 300 1234567",
        email: "support@khushicollection.com",
        address: "Suite 104, Gulberg Galleria, Main Boulevard",
        city: "Lahore",
        country: "Pakistan",
        maps_url: "https://maps.google.com/?q=Gulberg+Galleria+Lahore",
        business_hours: "Mon - Sat: 11:00 AM - 10:00 PM | Sun: 02:00 PM - 09:00 PM",
        logo_url: "static/images/logo.svg",
        favicon_url: "static/images/logo.svg",
        store_description: "Khushi Collection defines the pinnacle of contemporary Pakistani luxury fashion, bespoke festive bridal ensembles, royal raw silk kurtas, and rare oriental ouds.",
        footer_description: "The Crown of Pakistani Couture. Crafted with artisan precision, pure hand embellishments, and regal heritage fabrics."
    },
    contact_support: {
        support_phone: "+92 300 1234567",
        whatsapp_number: "+92 300 1234567",
        support_email: "support@khushicollection.com",
        whatsapp_business: "+92 300 1234567",
        business_address: "Suite 104, Gulberg Galleria, Main Boulevard, Lahore, Pakistan",
        working_hours: "11:00 AM - 10:00 PM (PKT)"
    },
    social_media: {
        facebook: "https://facebook.com/khushicollection",
        instagram: "https://instagram.com/khushicollection",
        tiktok: "https://tiktok.com/@khushicollection",
        youtube: "https://youtube.com/@khushicollection"
    },
    payments: {
        cod: {
            enabled: true,
            min_amount: 500,
            max_amount: 100000,
            cod_fee: 0,
            available_cities: "All Cities",
            excluded_categories: ["perfumes"]
        },
        bank_transfer: {
            enabled: true,
            bank_name: "Meezan Bank Limited",
            account_title: "Khushi Collection Pvt Ltd",
            account_number: "02010108927182",
            iban: "PK44MEZN0002010108927182",
            branch: "Gulberg III Main Branch, Lahore",
            instructions: "Please transfer the exact order amount and upload your payment confirmation receipt screenshot."
        },
        easypaisa: {
            enabled: true,
            account_name: "Khushi Fatima",
            account_number: "03001234567",
            instructions: "Transfer payment to Easypaisa account 03001234567 (Khushi Fatima). Enter your 11-digit Transaction ID (TID) upon checkout."
        },
        jazzcash: {
            enabled: true,
            account_name: "Khushi Fatima",
            account_number: "03007654321",
            instructions: "Transfer payment to JazzCash account 03007654321 (Khushi Fatima). Enter your Transaction ID (TID) upon checkout."
        },
        online_card: {
            enabled: true,
            gateway_name: "Paymob / Visa / Mastercard",
            mode: "TEST", // "TEST" or "LIVE"
            merchant_id: "MERCH_KHUSHI_99",
            public_key: "pk_test_khushi_live_sec_key_44",
            secret_key: "sk_test_••••••••••••••••"
        }
    },
    delivery: {
        free_delivery_threshold: 5000,
        default_delivery_fee: 250,
        lahore_delivery_fee: 200,
        karachi_delivery_fee: 250,
        islamabad_delivery_fee: 250,
        estimated_delivery_time: "2 - 4 Working Days",
        express_delivery_fee: 500
    },
    taxes: {
        enabled: false,
        tax_name: "GST / Sales Tax",
        tax_percentage: 0,
        tax_inclusive: true
    },
    notifications: {
        sms_enabled: true,
        whatsapp_enabled: true,
        email_enabled: true,
        templates: {
            order_confirmed: "Hello {customer_name}, your Khushi Collection order #{order_id} for Rs. {total} has been confirmed. Thank you for shopping with us.",
            order_processing: "Hello {customer_name}, your Khushi Collection order #{order_id} is being tailored and prepared for dispatch.",
            order_ready: "Hello {customer_name}, your Khushi Collection order #{order_id} is packed and ready for dispatch.",
            order_shipped: "Hello {customer_name}, your Khushi Collection order #{order_id} has been dispatched via courier with tracking #{tracking_number}.",
            order_on_the_way: "Hello {customer_name}, your Khushi Collection order #{order_id} is now on the way to your delivery address.",
            order_delivered: "Hello {customer_name}, your Khushi Collection order #{order_id} has been safely delivered. We hope you adore your luxury pieces!"
        }
    },
    onboarding: {
        step1_profile: true,
        step2_logo: true,
        step3_contact: true,
        step4_delivery: true,
        step5_payments: true,
        step6_whatsapp: true,
        step7_sms: true,
        step8_launch: true
    }
};

// Curated Luxury Collections
const DEFAULT_COLLECTIONS = [
    {
        id: "festive-royal",
        name: "Festive Royal",
        tagline: "The Grand Winter Festive Drop",
        description: "Opulent micro-velvet, zardozi needlework, and hand-embroidered shawls crafted for regal evenings.",
        image_url: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&auto=format&fit=crop&q=80",
        count: 14,
        category: "women",
        slug: "festive-royal"
    },
    {
        id: "wedding-edit",
        name: "Wedding Edit",
        tagline: "Bridal & Groom Couture",
        description: "Pure organza, raw silk anarkalis, and prince suits tailored with antique dabka and tilla.",
        image_url: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&auto=format&fit=crop&q=80",
        count: 18,
        category: "women",
        slug: "wedding-edit"
    },
    {
        id: "heritage-men",
        name: "Heritage Men",
        tagline: "Bespoke Menswear & Prince Suits",
        description: "Korean raw silk kurtas, tailored jamawar waistcoats, and regal groom sherwanis.",
        image_url: "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=800&auto=format&fit=crop&q=80",
        count: 12,
        category: "men",
        slug: "heritage-men"
    },
    {
        id: "luxury-pret",
        name: "Luxury Pret",
        tagline: "Effortless Ready-to-Wear Elegance",
        description: "Contemporary cuts in pure bamberg chiffon, grip silk, and jacquard tailored to perfection.",
        image_url: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&auto=format&fit=crop&q=80",
        count: 16,
        category: "women",
        slug: "luxury-pret"
    },
    {
        id: "evening-glam",
        name: "Evening Glam",
        tagline: "After-Hours Silhouette & Shimmer",
        description: "Heavily embellished kaftans, cocktail sarees, and midnight velvet statements.",
        image_url: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800&auto=format&fit=crop&q=80",
        count: 10,
        category: "women",
        slug: "evening-glam"
    },
    {
        id: "oud-collection",
        name: "The Art of Oud",
        tagline: "Royal Fragrance & Attar Elixirs",
        description: "Aged Cambodian and Hindi ouds, Damascus rose oils, and saffron amber extraits.",
        image_url: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&auto=format&fit=crop&q=80",
        count: 10,
        category: "perfumes",
        slug: "oud-collection"
    },
    {
        id: "signature-accessories",
        name: "Signature Accessories",
        tagline: "Timepieces, Minaudières & Khussas",
        description: "Gold chronographs, handcrafted bridal khussas, and zardozi potli bags.",
        image_url: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&auto=format&fit=crop&q=80",
        count: 20,
        category: "watches",
        slug: "signature-accessories"
    }
];

// Occasions Data
const DEFAULT_OCCASIONS = [
    { name: "Wedding", slug: "wedding", icon: "fa-ring", image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&auto=format&fit=crop&q=80" },
    { name: "Eid Festive", slug: "eid", icon: "fa-moon", image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600&auto=format&fit=crop&q=80" },
    { name: "Festive Soirée", slug: "festive", icon: "fa-sparkles", image: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=600&auto=format&fit=crop&q=80" },
    { name: "Formal Gala", slug: "formal", icon: "fa-tie", image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&auto=format&fit=crop&q=80" },
    { name: "Casual Luxury", slug: "casual", icon: "fa-sun", image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&auto=format&fit=crop&q=80" },
    { name: "Party Glam", slug: "party", icon: "fa-champagne-glasses", image: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=600&auto=format&fit=crop&q=80" },
    { name: "Royal Gifting", slug: "gifting", icon: "fa-gift", image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=600&auto=format&fit=crop&q=80" }
];

// Khushi Journal Articles
const DEFAULT_JOURNAL = [
    {
        id: 1,
        title: "The Royal Art of Velvet: Styling Zardozi for Winter Nuptials",
        category: "Couture Styling",
        read_time: "4 min read",
        date: "September 2026",
        image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&auto=format&fit=crop&q=80",
        excerpt: "Discover why micro-velvet remains the supreme textile of Pakistani aristocracy, paired with antique tilla and precious gemstones."
    },
    {
        id: 2,
        title: "How to Style the Modern Jamawar Waistcoat with Shalwar Kameez",
        category: "Men's Heritage",
        read_time: "5 min read",
        date: "August 2026",
        image: "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=800&auto=format&fit=crop&q=80",
        excerpt: "A gentleman's guide to monochromatic styling, mandarin collar cuts, and pairing hand-worked brass buttons with bespoke leather footwear."
    },
    {
        id: 3,
        title: "The Connoisseur's Guide to Pure Arabic Oud & Saffron Extraits",
        category: "Fragrance Notes",
        read_time: "6 min read",
        date: "August 2026",
        image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&auto=format&fit=crop&q=80",
        excerpt: "From wild Cambodian agarwood harvests to slow distillation in copper pots, explore the sensory universe of luxury oriental perfumery."
    },
    {
        id: 4,
        title: "The Evolution of the Pakistani Bridal Silhouette",
        category: "Heritage",
        read_time: "7 min read",
        date: "July 2026",
        image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&auto=format&fit=crop&q=80",
        excerpt: "An intimate look into how timeless Mughal motifs harmonize with contemporary cuts for the modern Pakistani bride."
    }
];

// Customer Testimonials & Verified Reviews
const DEFAULT_REVIEWS = [
    {
        id: 1,
        name: "Zainab Qureshi",
        city: "Islamabad",
        rating: 5,
        product: "Khushi Royal Embroidered Velvet Shawl Suit",
        review: "The needlework and fabric weight are breathtaking. Wore this to my brother's Mehndi in Islamabad and received endless compliments. Truly heirloom quality!",
        verified: true,
        date: "2 days ago"
    },
    {
        id: 2,
        name: "Hamza Tariq",
        city: "Lahore",
        rating: 5,
        product: "Heritage Korean Raw Silk Kurta Pajama",
        review: "Impeccable bespoke cut. The off-white Korean silk has a gorgeous natural sheen and breathes effortlessly. Packaging came in a signature gold-crested box.",
        verified: true,
        date: "1 week ago"
    },
    {
        id: 3,
        name: "Ayesha Malik",
        city: "Karachi",
        rating: 5,
        product: "Khushi Imperial Oud De Parfum (100ml)",
        review: "The longevity of this Oud is unbelievable. 14+ hours of rich Cambodian oud, saffron, and amber. Compares with niche Parisian perfumeries.",
        verified: true,
        date: "2 weeks ago"
    },
    {
        id: 4,
        name: "Dr. Fatima Shah",
        city: "Dubai (Overseas Client)",
        rating: 5,
        product: "Emerald Green Handcrafted Zardozi Anarkali",
        review: "Express DHL delivery to Dubai took only 3 days! The custom stitching measurements were exact to the centimeter. Khushi Collection is my go-to for overseas wedding attire.",
        verified: true,
        date: "3 weeks ago"
    }
];

const DEFAULT_POPULAR_SEARCHES = [
    "Velvet Shawl Suit",
    "Raw Silk Kurta",
    "Imperial Oud",
    "Bridal Khussa",
    "Prince Suit",
    "Chronograph Watch",
    "Chiffon Saree",
    "Minaudière Bag"
];

// Unified KhushiStore Engine
class KhushiStore {
    constructor() {
        this.init();
    }

    init() {
        if (!localStorage.getItem('kc_categories')) {
            localStorage.setItem('kc_categories', JSON.stringify(DEFAULT_CATEGORIES));
        }
        const currentProducts = JSON.parse(localStorage.getItem('kc_products') || '[]');
        if (!Array.isArray(currentProducts) || currentProducts.length < DEFAULT_PRODUCTS.length) {
            localStorage.setItem('kc_products', JSON.stringify(DEFAULT_PRODUCTS));
        }
        if (!localStorage.getItem('kc_settings')) {
            localStorage.setItem('kc_settings', JSON.stringify(DEFAULT_SETTINGS));
        }
        if (!localStorage.getItem('kc_orders')) {
            localStorage.setItem('kc_orders', JSON.stringify(DEFAULT_ORDERS));
        }
        if (!localStorage.getItem('kc_payments')) {
            localStorage.setItem('kc_payments', JSON.stringify([]));
        }
        if (!localStorage.getItem('kc_cart')) {
            localStorage.setItem('kc_cart', JSON.stringify({}));
        }
        if (!localStorage.getItem('kc_wishlist')) {
            localStorage.setItem('kc_wishlist', JSON.stringify([]));
        }
        if (!localStorage.getItem('kc_recently_viewed')) {
            localStorage.setItem('kc_recently_viewed', JSON.stringify([1, 5, 3]));
        }
        if (!localStorage.getItem('kc_notifications')) {
            localStorage.setItem('kc_notifications', JSON.stringify([]));
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
        const stored = JSON.parse(localStorage.getItem('kc_products'));
        if (Array.isArray(stored) && stored.length > 0) return stored;
        return DEFAULT_PRODUCTS;
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
