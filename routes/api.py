import os
import json
import random
import uuid
import base64
from datetime import datetime
from flask import Blueprint, request, jsonify, session, current_app
from database import query_db, execute_db

from routes.admin import admin_required

api_bp = Blueprint('api', __name__, url_prefix='/api')

@api_bp.after_request
def add_cors_headers(response):
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization, X-Requested-With, X-Session-Token'
    return response

@api_bp.route('/<path:dummy>', methods=['OPTIONS'])
@api_bp.route('', methods=['OPTIONS'])
def api_options_handler(dummy=''):
    return jsonify({'success': True}), 200

def dump_products_to_json():
    """Export current products from database to local products.json file"""
    try:
        from config import BASE_DIR
        products_raw = query_db('''
            SELECT p.*, c.name as category_name
            FROM products p
            LEFT JOIN categories c ON p.category_id = c.id
            WHERE p.status != "deleted"
            ORDER BY COALESCE(p.display_order, 0) ASC, p.id ASC
        ''')
        products = [format_product_dict(p) for p in products_raw]
        products_file = os.path.join(BASE_DIR, 'products.json')
        with open(products_file, 'w', encoding='utf-8') as f:
            json.dump(products, f, indent=2, ensure_ascii=False)
        return products
    except Exception as e:
        print(f"Notice: dump_products_to_json: {e}")
        return []

def sync_products_to_github(commit_message="Update product catalog via Admin"):
    """Directly commit updated products.json to GitHub repository for permanent persistence"""
    token = os.environ.get('GITHUB_TOKEN')
    repo = os.environ.get('GITHUB_REPO', 'danyalniaz/KHUSHI')
    if not token or not repo:
        return {'success': False, 'error': 'GitHub token or repo not configured'}

    try:
        import urllib.request
        import urllib.error

        products_raw = query_db('''
            SELECT p.*, c.name as category_name
            FROM products p
            LEFT JOIN categories c ON p.category_id = c.id
            WHERE p.status != "deleted"
            ORDER BY COALESCE(p.display_order, 0) ASC, p.id ASC
        ''')
        products = [format_product_dict(p) for p in products_raw]
        content_bytes = json.dumps(products, indent=2, ensure_ascii=False).encode('utf-8')
        encoded_content = base64.b64encode(content_bytes).decode('utf-8')

        api_url = f"https://api.github.com/repos/{repo}/contents/products.json"
        req = urllib.request.Request(api_url, headers={
            'Authorization': f'token {token}',
            'Accept': 'application/vnd.github.v3+json',
            'User-Agent': 'Khushi-Backend'
        })
        sha = None
        try:
            with urllib.request.urlopen(req) as response:
                if response.status == 200:
                    current_file = json.loads(response.read().decode('utf-8'))
                    sha = current_file.get('sha')
        except urllib.error.HTTPError as e:
            if e.code != 404:
                return {'success': False, 'error': f'HTTP {e.code}: {e.read().decode("utf-8")}'}

        payload = {
            'message': commit_message,
            'content': encoded_content,
            'branch': 'main'
        }
        if sha:
            payload['sha'] = sha

        put_req = urllib.request.Request(api_url, data=json.dumps(payload).encode('utf-8'), headers={
            'Authorization': f'token {token}',
            'Accept': 'application/vnd.github.v3+json',
            'Content-Type': 'application/json',
            'User-Agent': 'Khushi-Backend'
        }, method='PUT')

        with urllib.request.urlopen(put_req) as response:
            res_data = json.loads(response.read().decode('utf-8'))
            return {'success': True, 'commit': res_data.get('commit', {}).get('sha'), 'message': 'Catalog committed to GitHub successfully!'}
    except Exception as e:
        return {'success': False, 'error': str(e)}

def get_cart():
    if 'cart' not in session:
        session['cart'] = {}
    return session['cart']

# 1. Global Instant Search
@api_bp.route('/search')
def live_search():
    q = request.args.get('q', '').strip()
    if len(q) < 2:
        return jsonify({'products': []})

    term = f"%{q}%"
    sql = '''
        SELECT p.id, p.name, p.slug, p.brand, p.sku, p.price, p.sale_price, p.thumbnail, p.stock, c.name as category_name
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        WHERE p.status = 'active' AND (
            p.name LIKE ? OR
            p.brand LIKE ? OR
            p.sku LIKE ? OR
            p.tags LIKE ? OR
            p.description LIKE ? OR
            c.name LIKE ?
        )
        ORDER BY p.is_bestseller DESC, p.id DESC
        LIMIT 10
    '''
    rows = query_db(sql, (term, term, term, term, term, term))
    products = [dict(r) for r in rows]
    return jsonify({'products': products})

def format_product_dict(p):
    if not p:
        return {}
    p = dict(p)
    for field in ['colors', 'sizes', 'images', 'variant_matrix', 'size_guide', 'custom_attributes', 'category_attributes', 'payment_methods', 'tags']:
        val = p.get(field)
        if isinstance(val, str):
            try:
                p[field] = json.loads(val)
            except Exception:
                if field in ['sizes', 'tags']:
                    p[field] = [x.strip() for x in val.split(',') if x.strip()]
                else:
                    p[field] = []
        elif val is None:
            p[field] = [] if field in ['colors', 'sizes', 'images', 'variant_matrix', 'size_guide', 'custom_attributes', 'payment_methods', 'tags'] else {}
    for bool_field in ['is_featured', 'is_new', 'is_bestseller', 'is_flash_sale', 'is_active', 'cod_allowed']:
        if bool_field in p:
            p[bool_field] = bool(p[bool_field])
    return p

def format_category_dict(c):
    if not c:
        return {}
    c = dict(c)
    if 'subcategories' in c:
        val = c['subcategories']
        if isinstance(val, str):
            try:
                c['subcategories'] = json.loads(val)
            except Exception:
                c['subcategories'] = [x.strip() for x in val.split(',') if x.strip()]
        elif val is None:
            c['subcategories'] = []
    if 'is_featured' in c:
        c['is_featured'] = bool(c['is_featured'])
    if 'cod_allowed' in c:
        c['cod_allowed'] = bool(c['cod_allowed'])
    return c

# 2. Categories API
@api_bp.route('/categories', methods=['GET'])
def get_all_categories():
    rows = query_db('SELECT * FROM categories WHERE is_active = 1 ORDER BY display_order ASC, id ASC')
    categories = [format_category_dict(r) for r in rows]
    return jsonify({'success': True, 'categories': categories})

@api_bp.route('/categories', methods=['POST'])
@admin_required(['OWNER', 'MANAGER', 'SUPER_ADMIN'])
def create_category():
    data = request.get_json() or request.form.to_dict() or {}
    name = data.get('name', '').strip()
    if not name:
        return jsonify({'success': False, 'error': 'Category name is required'}), 400
    
    slug = data.get('slug', '').strip().lower().replace(' ', '-')
    if not slug:
        slug = name.lower().replace(' ', '-')
        
    description = data.get('description', '').strip()
    image_url = data.get('image_url', '').strip()
    banner_url = data.get('banner_url', '').strip()
    icon = data.get('icon', '').strip()
    display_order = int(data.get('display_order', 0))
    is_featured = 1 if data.get('is_featured') in [True, 1, '1', 'true', 'on'] else 0
    cod_allowed = 1 if data.get('cod_allowed', True) in [True, 1, '1', 'true', 'on'] else 0
    
    subs = data.get('subcategories', [])
    if isinstance(subs, list):
        subcategories_json = json.dumps(subs)
    elif isinstance(subs, str):
        subcategories_json = json.dumps([x.strip() for x in subs.split(',') if x.strip()])
    else:
        subcategories_json = json.dumps([])

    existing = query_db('SELECT id FROM categories WHERE slug = ?', (slug,), one=True)
    if existing:
        cat_id = existing['id']
        execute_db('''
            UPDATE categories SET
                name = ?, description = ?, image_url = ?, banner_url = ?,
                icon = ?, display_order = ?, is_featured = ?, cod_allowed = ?, subcategories = ?
            WHERE id = ?
        ''', (name, description, image_url, banner_url, icon, display_order, is_featured, cod_allowed, subcategories_json, cat_id))
    else:
        cat_id = execute_db('''
            INSERT INTO categories (name, slug, description, image_url, banner_url, icon, display_order, is_featured, cod_allowed, subcategories)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (name, slug, description, image_url, banner_url, icon, display_order, is_featured, cod_allowed, subcategories_json))
        
    cat = query_db('SELECT * FROM categories WHERE id = ?', (cat_id,), one=True)
    return jsonify({'success': True, 'category': format_category_dict(cat), 'message': f"Category '{name}' saved successfully!"})

@api_bp.route('/categories/<identifier>', methods=['PUT', 'POST'])
@admin_required(['OWNER', 'MANAGER', 'SUPER_ADMIN'])
def update_category_api(identifier):
    data = request.get_json() or request.form.to_dict() or {}
    cat = query_db('SELECT * FROM categories WHERE id = ? OR slug = ?', (identifier, identifier), one=True)
    if not cat:
        return jsonify({'success': False, 'error': f'Category {identifier} not found'}), 404
        
    cat_id = cat['id']
    name = data.get('name', cat['name']).strip()
    slug = data.get('slug', cat['slug']).strip()
    description = data.get('description', cat['description'] or '')
    image_url = data.get('image_url', cat['image_url'] or '')
    banner_url = data.get('banner_url', cat['banner_url'] or '')
    icon = data.get('icon', cat['icon'] or '')
    display_order = int(data.get('display_order', cat['display_order'] or 0))
    is_featured = 1 if data.get('is_featured', cat['is_featured']) in [True, 1, '1', 'true', 'on'] else 0
    cod_allowed = 1 if data.get('cod_allowed', True) in [True, 1, '1', 'true', 'on'] else 0
    
    if 'subcategories' in data:
        subs = data.get('subcategories')
        if isinstance(subs, list):
            subcategories_json = json.dumps(subs)
        elif isinstance(subs, str):
            subcategories_json = json.dumps([x.strip() for x in subs.split(',') if x.strip()])
        else:
            subcategories_json = json.dumps([])
    else:
        subcategories_json = cat['subcategories'] or '[]'
        
    execute_db('''
        UPDATE categories SET
            name = ?, slug = ?, description = ?, image_url = ?, banner_url = ?,
            icon = ?, display_order = ?, is_featured = ?, cod_allowed = ?, subcategories = ?
        WHERE id = ?
    ''', (name, slug, description, image_url, banner_url, icon, display_order, is_featured, cod_allowed, subcategories_json, cat_id))
    
    updated = query_db('SELECT * FROM categories WHERE id = ?', (cat_id,), one=True)
    return jsonify({'success': True, 'category': format_category_dict(updated), 'message': f"Category '{name}' updated successfully!"})

@api_bp.route('/categories/<identifier>', methods=['DELETE'])
@api_bp.route('/categories/delete/<identifier>', methods=['POST', 'DELETE'])
@admin_required(['OWNER', 'MANAGER', 'SUPER_ADMIN'])
def delete_category_api(identifier):
    cat = query_db('SELECT id, name FROM categories WHERE id = ? OR slug = ?', (identifier, identifier), one=True)
    if not cat:
        return jsonify({'success': False, 'error': 'Category not found'}), 404
    cat_id = cat['id']
    execute_db('DELETE FROM categories WHERE id = ?', (cat_id,))
    return jsonify({'success': True, 'message': f"Category '{cat['name']}' deleted successfully!"})

# 3. Products API
@api_bp.route('/products', methods=['GET'])
def all_products():
    products = query_db('''
        SELECT p.*, c.name as category_name
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        WHERE p.status != 'deleted'
        ORDER BY COALESCE(p.display_order, 0) ASC, p.id DESC
    ''')
    formatted = [format_product_dict(p) for p in products]
    return jsonify({'success': True, 'products': formatted, 'count': len(formatted)})

@api_bp.route('/products/<identifier>', methods=['GET'])
def get_product(identifier):
    product = query_db('SELECT p.*, c.name as category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE p.id = ? OR p.slug = ? OR p.sku = ?', (identifier, identifier, identifier), one=True)
    if not product:
        return jsonify({'error': 'Product not found'}), 404
    return jsonify(format_product_dict(product))

@api_bp.route('/products', methods=['POST'])
@admin_required(['OWNER', 'MANAGER', 'SUPER_ADMIN'])
def create_product():
    data = request.get_json() or request.form.to_dict() or {}
    name = data.get('name', '').strip()
    if not name:
        return jsonify({'success': False, 'error': 'Product title is required'}), 400
        
    slug = data.get('slug', '').strip().lower().replace(' ', '-')
    if not slug:
        slug = name.lower().replace(' ', '-') + '-' + str(random.randint(100, 999))
        
    sku = data.get('sku', '').strip().upper()
    if not sku:
        sku = 'KC-' + str(random.randint(10000, 99999))
        
    brand = data.get('brand', 'Khushi Collection').strip()
    category_slug = data.get('category', '').strip()
    category_id = data.get('category_id')
    category_name = data.get('category_name', '')
    
    if not category_id and category_slug:
        cat = query_db('SELECT id, name FROM categories WHERE slug = ?', (category_slug,), one=True)
        if cat:
            category_id = cat['id']
            category_name = cat['name']
        else:
            category_name = category_slug.title()
    elif category_id and not category_name:
        cat = query_db('SELECT name, slug FROM categories WHERE id = ?', (category_id,), one=True)
        if cat:
            category_name = cat['name']
            if not category_slug:
                category_slug = cat['slug']
    
    if not category_name:
        category_name = 'Couture'
        
    subcategory = data.get('subcategory', '').strip()
    price = float(data.get('price', 0))
    sale_price = float(data['sale_price']) if data.get('sale_price') is not None and str(data.get('sale_price')).strip() != '' else None
    cost_price = float(data['cost_price']) if data.get('cost_price') is not None and str(data.get('cost_price')).strip() != '' else None
    stock = int(data.get('stock', 10))
    low_stock_threshold = int(data.get('low_stock_threshold', 3))
    
    thumbnail = data.get('thumbnail', '')
    secondary_image = data.get('secondary_image', thumbnail)
    images = data.get('images', [])
    if isinstance(images, list):
        images_json = json.dumps(images)
    elif isinstance(images, str):
        images_json = json.dumps([x.strip() for x in images.split('\n') if x.strip()])
    else:
        images_json = json.dumps([thumbnail] if thumbnail else [])
        
    sizes = data.get('sizes', [])
    sizes_json = json.dumps(sizes) if isinstance(sizes, list) else json.dumps([s.strip() for s in str(sizes).split(',') if s.strip()])
    
    colors = data.get('colors', [])
    colors_json = json.dumps(colors) if isinstance(colors, (list, dict)) else '[]'
    
    variant_matrix = data.get('variant_matrix', [])
    variant_matrix_json = json.dumps(variant_matrix) if isinstance(variant_matrix, list) else '[]'
    
    size_guide = data.get('size_guide', [])
    size_guide_json = json.dumps(size_guide) if isinstance(size_guide, list) else '[]'
    
    custom_attributes = data.get('custom_attributes', [])
    custom_attributes_json = json.dumps(custom_attributes) if isinstance(custom_attributes, list) else '[]'
    
    category_attributes = data.get('category_attributes', {})
    category_attributes_json = json.dumps(category_attributes) if isinstance(category_attributes, dict) else '{}'
    
    payment_methods = data.get('payment_methods', ['cod', 'card', 'bank', 'easypaisa', 'jazzcash'])
    payment_methods_json = json.dumps(payment_methods) if isinstance(payment_methods, list) else '[]'
    
    cod_allowed = 1 if data.get('cod_allowed', True) in [True, 1, '1', 'true', 'on'] else 0
    is_featured = 1 if data.get('is_featured') in [True, 1, '1', 'true', 'on'] else 0
    is_new = 1 if data.get('is_new') in [True, 1, '1', 'true', 'on'] else 0
    is_bestseller = 1 if data.get('is_bestseller') in [True, 1, '1', 'true', 'on'] else 0
    is_flash_sale = 1 if data.get('is_flash_sale') in [True, 1, '1', 'true', 'on'] else 0
    status = data.get('status', 'active')
    
    short_description = data.get('short_description', '').strip()
    description = data.get('description', '').strip()
    care_instructions = data.get('care_instructions', '').strip()
    shipping_info = data.get('shipping_info', '').strip()
    video_url = data.get('video_url', '').strip()
    seo_title = data.get('seo_title', '').strip()
    meta_description = data.get('meta_description', '').strip()
    tags = data.get('tags', [])
    tags_str = json.dumps(tags) if isinstance(tags, list) else str(tags)
    
    existing = query_db('SELECT id FROM products WHERE sku = ? OR slug = ?', (sku, slug), one=True)
    if existing:
        prod_id = existing['id']
        execute_db('''
            UPDATE products SET
                name = ?, slug = ?, sku = ?, brand = ?, category_id = ?, category_slug = ?, category_name = ?,
                subcategory = ?, price = ?, sale_price = ?, cost_price = ?, stock = ?, low_stock_threshold = ?,
                thumbnail = ?, secondary_image = ?, images = ?, sizes = ?, colors = ?,
                variant_matrix = ?, size_guide = ?, custom_attributes = ?, category_attributes = ?,
                cod_allowed = ?, payment_methods = ?, is_featured = ?, is_new = ?, is_bestseller = ?,
                is_flash_sale = ?, status = ?, short_description = ?, description = ?,
                care_instructions = ?, shipping_info = ?, video_url = ?, seo_title = ?, meta_description = ?, tags = ?
            WHERE id = ?
        ''', (
            name, slug, sku, brand, category_id, category_slug, category_name,
            subcategory, price, sale_price, cost_price, stock, low_stock_threshold,
            thumbnail, secondary_image, images_json, sizes_json, colors_json,
            variant_matrix_json, size_guide_json, custom_attributes_json, category_attributes_json,
            cod_allowed, payment_methods_json, is_featured, is_new, is_bestseller,
            is_flash_sale, status, short_description, description,
            care_instructions, shipping_info, video_url, seo_title, meta_description, tags_str,
            prod_id
        ))
    else:
        prod_id = execute_db('''
            INSERT INTO products (
                name, slug, sku, brand, category_id, category_slug, category_name,
                subcategory, price, sale_price, cost_price, stock, low_stock_threshold,
                thumbnail, secondary_image, images, sizes, colors,
                variant_matrix, size_guide, custom_attributes, category_attributes,
                cod_allowed, payment_methods, is_featured, is_new, is_bestseller,
                is_flash_sale, status, short_description, description,
                care_instructions, shipping_info, video_url, seo_title, meta_description, tags
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            name, slug, sku, brand, category_id, category_slug, category_name,
            subcategory, price, sale_price, cost_price, stock, low_stock_threshold,
            thumbnail, secondary_image, images_json, sizes_json, colors_json,
            variant_matrix_json, size_guide_json, custom_attributes_json, category_attributes_json,
            cod_allowed, payment_methods_json, is_featured, is_new, is_bestseller,
            is_flash_sale, status, short_description, description,
            care_instructions, shipping_info, video_url, seo_title, meta_description, tags_str
        ))
        
    created = query_db('SELECT * FROM products WHERE id = ?', (prod_id,), one=True)
    dump_products_to_json()
    try:
        sync_products_to_github(f"Catalog update: Added product {name}")
    except Exception:
        pass
    return jsonify({'success': True, 'product': format_product_dict(created), 'message': f"Product '{name}' saved successfully!"})

@api_bp.route('/products/<identifier>', methods=['PUT', 'POST'])
@admin_required(['OWNER', 'MANAGER', 'SUPER_ADMIN'])
def update_product_api(identifier):
    data = request.get_json() or request.form.to_dict() or {}
    product = query_db('SELECT * FROM products WHERE id = ? OR slug = ? OR sku = ?', (identifier, identifier, identifier), one=True)
    if not product:
        return jsonify({'success': False, 'error': f'Product {identifier} not found'}), 404
        
    prod_id = product['id']
    name = data.get('name', product['name']).strip()
    slug = data.get('slug', product['slug']).strip()
    sku = data.get('sku', product['sku']).strip()
    brand = data.get('brand', product['brand'] or 'Khushi Collection').strip()
    category_slug = data.get('category', product['category_slug'] or '')
    category_id = data.get('category_id', product['category_id'])
    category_name = data.get('category_name', product['category_name'] or 'Couture')
    subcategory = data.get('subcategory', product['subcategory'] or '')
    
    price = float(data.get('price', product['price']))
    sale_price = float(data['sale_price']) if data.get('sale_price') is not None and str(data.get('sale_price')).strip() != '' else (product['sale_price'] if 'sale_price' not in data else None)
    cost_price = float(data['cost_price']) if data.get('cost_price') is not None and str(data.get('cost_price')).strip() != '' else product['cost_price']
    stock = int(data.get('stock', product['stock']))
    low_stock_threshold = int(data.get('low_stock_threshold', product['low_stock_threshold'] or 3))
    
    thumbnail = data.get('thumbnail', product['thumbnail'] or '')
    secondary_image = data.get('secondary_image', product['secondary_image'] or thumbnail)
    
    if 'images' in data:
        images = data.get('images')
        images_json = json.dumps(images) if isinstance(images, list) else json.dumps([x.strip() for x in str(images).split('\n') if x.strip()])
    else:
        images_json = product['images'] or '[]'
        
    if 'sizes' in data:
        sizes = data.get('sizes')
        sizes_json = json.dumps(sizes) if isinstance(sizes, list) else json.dumps([s.strip() for s in str(sizes).split(',') if s.strip()])
    else:
        sizes_json = product['sizes'] or '[]'
        
    if 'colors' in data:
        colors = data.get('colors')
        colors_json = json.dumps(colors) if isinstance(colors, (list, dict)) else '[]'
    else:
        colors_json = product['colors'] or '[]'
        
    if 'variant_matrix' in data:
        variant_matrix_json = json.dumps(data['variant_matrix']) if isinstance(data['variant_matrix'], list) else '[]'
    else:
        variant_matrix_json = product['variant_matrix'] or '[]'
        
    if 'size_guide' in data:
        size_guide_json = json.dumps(data['size_guide']) if isinstance(data['size_guide'], list) else '[]'
    else:
        size_guide_json = product['size_guide'] or '[]'
        
    if 'custom_attributes' in data:
        custom_attributes_json = json.dumps(data['custom_attributes']) if isinstance(data['custom_attributes'], list) else '[]'
    else:
        custom_attributes_json = product['custom_attributes'] or '[]'
        
    if 'category_attributes' in data:
        category_attributes_json = json.dumps(data['category_attributes']) if isinstance(data['category_attributes'], dict) else '{}'
    else:
        category_attributes_json = product['category_attributes'] or '{}'
        
    if 'payment_methods' in data:
        payment_methods_json = json.dumps(data['payment_methods']) if isinstance(data['payment_methods'], list) else '[]'
    else:
        payment_methods_json = product['payment_methods'] or '["cod","card","bank","easypaisa","jazzcash"]'
        
    cod_allowed = 1 if data.get('cod_allowed', product['cod_allowed'] if product['cod_allowed'] is not None else 1) in [True, 1, '1', 'true', 'on'] else 0
    is_featured = 1 if data.get('is_featured', product['is_featured']) in [True, 1, '1', 'true', 'on'] else 0
    is_new = 1 if data.get('is_new', product['is_new']) in [True, 1, '1', 'true', 'on'] else 0
    is_bestseller = 1 if data.get('is_bestseller', product['is_bestseller']) in [True, 1, '1', 'true', 'on'] else 0
    is_flash_sale = 1 if data.get('is_flash_sale', product['is_flash_sale']) in [True, 1, '1', 'true', 'on'] else 0
    status = data.get('status', product['status'] or 'active')
    
    short_description = data.get('short_description', product['short_description'] or '')
    description = data.get('description', product['description'] or '')
    care_instructions = data.get('care_instructions', product['care_instructions'] or '')
    shipping_info = data.get('shipping_info', product['shipping_info'] or '')
    video_url = data.get('video_url', product['video_url'] or '')
    seo_title = data.get('seo_title', product['seo_title'] or '')
    meta_description = data.get('meta_description', product['meta_description'] or '')
    
    if 'tags' in data:
        tags = data.get('tags')
        tags_str = json.dumps(tags) if isinstance(tags, list) else str(tags)
    else:
        tags_str = product['tags'] or '[]'
        
    execute_db('''
        UPDATE products SET
            name = ?, slug = ?, sku = ?, brand = ?, category_id = ?, category_slug = ?, category_name = ?,
            subcategory = ?, price = ?, sale_price = ?, cost_price = ?, stock = ?, low_stock_threshold = ?,
            thumbnail = ?, secondary_image = ?, images = ?, sizes = ?, colors = ?,
            variant_matrix = ?, size_guide = ?, custom_attributes = ?, category_attributes = ?,
            cod_allowed = ?, payment_methods = ?, is_featured = ?, is_new = ?, is_bestseller = ?,
            is_flash_sale = ?, status = ?, short_description = ?, description = ?,
            care_instructions = ?, shipping_info = ?, video_url = ?, seo_title = ?, meta_description = ?, tags = ?
        WHERE id = ?
    ''', (
        name, slug, sku, brand, category_id, category_slug, category_name,
        subcategory, price, sale_price, cost_price, stock, low_stock_threshold,
        thumbnail, secondary_image, images_json, sizes_json, colors_json,
        variant_matrix_json, size_guide_json, custom_attributes_json, category_attributes_json,
        cod_allowed, payment_methods_json, is_featured, is_new, is_bestseller,
        is_flash_sale, status, short_description, description,
        care_instructions, shipping_info, video_url, seo_title, meta_description, tags_str,
        prod_id
    ))
    
    updated = query_db('SELECT * FROM products WHERE id = ?', (prod_id,), one=True)
    dump_products_to_json()
    try:
        sync_products_to_github(f"Catalog update: Updated product {name}")
    except Exception:
        pass
    return jsonify({'success': True, 'product': format_product_dict(updated), 'message': f"Product '{name}' updated successfully!"})

@api_bp.route('/products/<identifier>', methods=['DELETE'])
@api_bp.route('/products/delete/<identifier>', methods=['POST', 'DELETE'])
@admin_required(['OWNER', 'MANAGER', 'SUPER_ADMIN'])
def delete_product_api(identifier):
    prod = query_db('SELECT id, name FROM products WHERE id = ? OR slug = ? OR sku = ?', (identifier, identifier, identifier), one=True)
    if not prod:
        return jsonify({'success': False, 'error': f'Product {identifier} not found'}), 404
    execute_db('DELETE FROM products WHERE id = ?', (prod['id'],))
    dump_products_to_json()
    try:
        sync_products_to_github(f"Catalog update: Deleted product {prod['name']}")
    except Exception:
        pass
    return jsonify({'success': True, 'message': f"Product '{prod['name']}' deleted permanently!"})

@api_bp.route('/products/publish', methods=['POST', 'GET'])
@admin_required(['OWNER', 'MANAGER', 'SUPER_ADMIN'])
def publish_catalog_api():
    """Explicitly publish current catalog to JSON and GitHub repository"""
    prods = dump_products_to_json()
    gh_res = sync_products_to_github("Publish catalog to live website via Admin")
    return jsonify({
        'success': True,
        'count': len(prods),
        'github_sync': gh_res,
        'message': 'Product catalog successfully published to live website and GitHub!'
    })

@api_bp.route('/products/reorder', methods=['POST'])
@admin_required(['OWNER', 'MANAGER', 'SUPER_ADMIN'])
def reorder_products_api():
    """Update display_order for products in database and persist to JSON"""
    data = request.get_json(silent=True) or {}
    orders = data.get('product_orders') or data.get('orders') or []
    if not orders or not isinstance(orders, list):
        return jsonify({'success': False, 'error': 'Invalid product orders array'}), 400

    try:
        for idx, item in enumerate(orders):
            if isinstance(item, dict):
                pid = item.get('id')
                order_val = item.get('display_order', idx)
            else:
                pid = item
                order_val = idx

            if pid is not None:
                execute_db('UPDATE products SET display_order = ? WHERE id = ?', (order_val, pid))

        dump_products_to_json()
        return jsonify({'success': True, 'message': 'Product ordering saved successfully!'}), 200
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

# 4. Universal Image Upload API
@api_bp.route('/upload', methods=['POST'])
@admin_required(['OWNER', 'MANAGER', 'STAFF', 'SUPER_ADMIN'])
def upload_file_api():
    if 'file' in request.files or 'image' in request.files:
        file = request.files.get('file') or request.files.get('image')
        if file and file.filename:
            ext = file.filename.rsplit('.', 1)[-1].lower() if '.' in file.filename else 'jpg'
            fname = f"img_{uuid.uuid4().hex[:12]}.{ext}"
            upload_folder = current_app.config.get('UPLOAD_FOLDER', 'static/uploads')
            try:
                os.makedirs(upload_folder, exist_ok=True)
                dest = os.path.join(upload_folder, fname)
                file.save(dest)
                url = f"/static/uploads/{fname}"
                return jsonify({'success': True, 'url': url})
            except Exception:
                file.seek(0)
                b64 = base64.b64encode(file.read()).decode('utf-8')
                mime = f"image/{ext}" if ext in ['png', 'jpg', 'jpeg', 'webp', 'gif'] else 'image/jpeg'
                return jsonify({'success': True, 'url': f"data:{mime};base64,{b64}"})
    data = request.get_json() or {}
    b64_val = data.get('image_base64') or data.get('data_url') or data.get('data') or data.get('image')
    if b64_val:
        return jsonify({'success': True, 'url': b64_val})
    return jsonify({'success': False, 'error': 'No file uploaded'}), 400

def sync_settings_to_github(commit_message="Update store settings & homepage CMS via Admin"):
    """Directly commit updated settings.json to GitHub repository for permanent persistence"""
    token = os.environ.get('GITHUB_TOKEN')
    repo = os.environ.get('GITHUB_REPO', 'danyalniaz/KHUSHI')
    if not token or not repo:
        return {'success': False, 'error': 'GitHub token or repo not configured'}

    try:
        import urllib.request
        import urllib.error
        from config import BASE_DIR
        settings_path = os.path.join(BASE_DIR, 'settings.json')
        if not os.path.exists(settings_path):
            return {'success': False, 'error': 'settings.json does not exist'}

        with open(settings_path, 'r', encoding='utf-8') as f:
            content_bytes = f.read().encode('utf-8')
        encoded_content = base64.b64encode(content_bytes).decode('utf-8')

        api_url = f"https://api.github.com/repos/{repo}/contents/settings.json"
        req = urllib.request.Request(api_url, headers={
            'Authorization': f'token {token}',
            'Accept': 'application/vnd.github.v3+json',
            'User-Agent': 'Khushi-Backend'
        })
        sha = None
        try:
            with urllib.request.urlopen(req) as response:
                curr_data = json.loads(response.read().decode('utf-8'))
                sha = curr_data.get('sha')
        except urllib.error.HTTPError as e:
            if e.code != 404:
                return {'success': False, 'error': f'HTTP {e.code}: {e.read().decode("utf-8")}'}

        payload = {
            'message': commit_message,
            'content': encoded_content,
            'branch': 'main'
        }
        if sha:
            payload['sha'] = sha

        put_req = urllib.request.Request(api_url, data=json.dumps(payload).encode('utf-8'), headers={
            'Authorization': f'token {token}',
            'Accept': 'application/vnd.github.v3+json',
            'Content-Type': 'application/json',
            'User-Agent': 'Khushi-Backend'
        }, method='PUT')

        with urllib.request.urlopen(put_req) as response:
            res_data = json.loads(response.read().decode('utf-8'))
            return {'success': True, 'commit': res_data.get('commit', {}).get('sha'), 'message': 'Settings committed to GitHub successfully!'}
    except Exception as e:
        return {'success': False, 'error': str(e)}

# Settings API
@api_bp.route('/settings', methods=['GET'])
def get_store_settings_api():
    from config import BASE_DIR
    settings_file = os.path.join(BASE_DIR, 'settings.json')
    file_settings = {}
    if os.path.exists(settings_file):
        try:
            with open(settings_file, 'r', encoding='utf-8') as sf:
                file_settings = json.load(sf)
        except Exception:
            pass

    from routes.payments import get_settings_from_db
    db_settings = get_settings_from_db()

    merged = {**file_settings, **db_settings}
    if isinstance(file_settings.get('homepage'), dict) and isinstance(db_settings.get('homepage'), dict):
        merged['homepage'] = {**file_settings['homepage'], **db_settings['homepage']}

    if 'payments' in merged and isinstance(merged['payments'], dict) and 'online_card' in merged['payments']:
        merged['payments']['online_card'].pop('secret_key', None)
        merged['payments']['online_card'].pop('private_key', None)

    return jsonify({'success': True, 'settings': merged})

@api_bp.route('/settings', methods=['POST', 'PUT'])
@admin_required(['OWNER', 'SUPER_ADMIN'])
def update_store_settings_api():
    data = request.get_json(silent=True) or request.form.to_dict() or {}
    if not data:
        return jsonify({'success': False, 'error': 'No settings payload provided'}), 400

    from config import BASE_DIR
    settings_file = os.path.join(BASE_DIR, 'settings.json')
    current_settings = {}
    if os.path.exists(settings_file):
        try:
            with open(settings_file, 'r', encoding='utf-8') as sf:
                current_settings = json.load(sf)
        except Exception:
            pass

    for k, v in data.items():
        if isinstance(v, dict) and isinstance(current_settings.get(k), dict):
            current_settings[k] = {**current_settings[k], **v}
        else:
            current_settings[k] = v

    # Strip secret keys from settings payload before writing
    if 'payments' in current_settings and isinstance(current_settings['payments'], dict) and 'online_card' in current_settings['payments']:
        current_settings['payments']['online_card'].pop('secret_key', None)
        current_settings['payments']['online_card'].pop('private_key', None)

    # 1. Update SQLite settings table
    try:
        for k, v in current_settings.items():
            val_str = json.dumps(v) if isinstance(v, (dict, list)) else str(v)
            execute_db('''
                INSERT INTO settings (setting_key, setting_value, updated_at)
                VALUES (?, ?, CURRENT_TIMESTAMP)
                ON CONFLICT(setting_key) DO UPDATE SET
                    setting_value = excluded.setting_value,
                    updated_at = CURRENT_TIMESTAMP
            ''', (k, val_str))
    except Exception as e:
        print(f"Notice: saving settings to db: {e}")

    # 2. Write to settings.json
    try:
        with open(settings_file, 'w', encoding='utf-8') as sf:
            json.dump(current_settings, sf, indent=2, ensure_ascii=False)
    except Exception as e:
        print(f"Notice: writing settings.json: {e}")

    # 3. Direct GitHub Cloud Sync
    gh_res = sync_settings_to_github("Update store settings & homepage CMS via Admin")

    return jsonify({
        'success': True,
        'message': 'Store settings and homepage CMS updated permanently!',
        'settings': current_settings,
        'github_sync': gh_res
    })

# 5. Full Storefront Sync API (Single high-speed call for all devices)
@api_bp.route('/sync', methods=['GET'])
def get_full_store_sync():
    prods_raw = query_db('SELECT p.*, c.name as category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE p.status != "deleted" ORDER BY COALESCE(p.display_order, 0) ASC, p.id DESC')
    products = [format_product_dict(p) for p in prods_raw]
    
    cats_raw = query_db('SELECT * FROM categories WHERE is_active = 1 ORDER BY display_order ASC, id ASC')
    categories = [format_category_dict(c) for c in cats_raw]
    
    from routes.payments import get_settings_from_db
    settings = get_settings_from_db()
    
    return jsonify({
        'success': True,
        'products': products,
        'categories': categories,
        'settings': settings,
        'timestamp': datetime.now().isoformat()
    })

# 6. Cart API
@api_bp.route('/cart')
def get_cart_data():
    cart = get_cart()
    items = []
    subtotal = 0.0
    total_count = 0

    for key, item in cart.items():
        product = query_db('SELECT id, name, slug, price, sale_price, thumbnail, stock FROM products WHERE id = ?', (item['product_id'],), one=True)
        if product:
            unit_price = float(product['sale_price'] if product['sale_price'] else product['price'])
            item_total = unit_price * int(item['quantity'])
            subtotal += item_total
            total_count += int(item['quantity'])
            items.append({
                'key': key,
                'product_id': product['id'],
                'name': product['name'],
                'slug': product['slug'],
                'thumbnail': product['thumbnail'],
                'price': unit_price,
                'regular_price': float(product['price']),
                'quantity': int(item['quantity']),
                'size': item.get('size', ''),
                'color': item.get('color', ''),
                'stock': product['stock'],
                'total': item_total
            })

    return jsonify({
        'items': items,
        'subtotal': subtotal,
        'total_count': total_count
    })

@api_bp.route('/cart/add', methods=['POST'])
def add_to_cart():
    data = request.get_json() or {}
    product_id = data.get('product_id')
    qty = max(1, int(data.get('quantity', 1)))
    size = data.get('size', '')
    color = data.get('color', '')

    product = query_db('SELECT id, name, stock FROM products WHERE id = ? AND status = "active"', (product_id,), one=True)
    if not product:
        return jsonify({'success': False, 'message': 'Product unavailable'}), 404

    cart = get_cart()
    key = f"{product_id}_{size}_{color}"
    if key in cart:
        cart[key]['quantity'] += qty
    else:
        cart[key] = {
            'product_id': product_id,
            'quantity': qty,
            'size': size,
            'color': color
        }
    session['cart'] = cart
    session.modified = True

    total_count = sum(item['quantity'] for item in cart.values())
    return jsonify({'success': True, 'message': f"Added '{product['name']}' to your shopping bag!", 'cart_count': total_count})


# 7. Orders Real-Time Sync & Bulk Operations API
@api_bp.route('/orders', methods=['GET'])
@admin_required(['OWNER', 'MANAGER', 'STAFF', 'SUPER_ADMIN'])
def api_get_orders():
    rows = query_db('SELECT * FROM orders ORDER BY id DESC')
    orders_list = []
    for r in rows:
        o = dict(r)
        items = query_db('SELECT * FROM order_items WHERE order_id = ?', (r['id'],))
        o['items'] = [dict(it) for it in items]
        timeline = query_db('SELECT * FROM order_timeline WHERE order_id = ? ORDER BY id ASC', (r['id'],))
        o['timeline'] = [dict(tl) for tl in timeline]
        orders_list.append(o)
    return jsonify({'success': True, 'orders': orders_list, 'count': len(orders_list)})


@api_bp.route('/orders/<identifier>', methods=['DELETE', 'POST'])
@admin_required(['OWNER', 'MANAGER', 'SUPER_ADMIN'])
def api_delete_order(identifier):
    clean = str(identifier).replace('#', '').strip()
    order = query_db(
        'SELECT id, order_number FROM orders WHERE order_number = ? OR order_number = ? OR id = ?',
        (clean, f"KC-{clean}", clean),
        one=True
    )
    if not order:
        return jsonify({'success': False, 'error': f'Order {identifier} not found'}), 404

    ord_id = order['id']
    ord_num = order['order_number']
    execute_db('DELETE FROM order_items WHERE order_id = ?', (ord_id,))
    execute_db('DELETE FROM order_timeline WHERE order_id = ?', (ord_id,))
    execute_db('DELETE FROM payment_records WHERE order_number = ? OR order_id = ?', (ord_num, ord_id))
    execute_db('DELETE FROM payments WHERE order_number = ? OR order_id = ?', (ord_num, ord_id))
    execute_db('DELETE FROM notification_logs WHERE order_number = ? OR order_id = ?', (ord_num, ord_id))
    execute_db('DELETE FROM orders WHERE id = ?', (ord_id,))
    return jsonify({'success': True, 'message': f'Order #{ord_num} deleted permanently.'})


@api_bp.route('/orders/bulk-delete', methods=['POST'])
@admin_required(['OWNER', 'SUPER_ADMIN'])
def api_bulk_delete_orders():
    data = request.get_json(silent=True) or {}
    order_numbers = data.get('order_numbers') or data.get('order_ids') or []
    if isinstance(order_numbers, str):
        order_numbers = [x.strip() for x in order_numbers.split(',') if x.strip()]

    if not order_numbers:
        return jsonify({'success': False, 'error': 'No orders provided for deletion.'}), 400

    deleted = 0
    for num in order_numbers:
        clean = str(num).replace('#', '').strip()
        order = query_db(
            'SELECT id, order_number FROM orders WHERE order_number = ? OR order_number = ? OR id = ?',
            (clean, f"KC-{clean}", clean),
            one=True
        )
        if order:
            ord_id = order['id']
            ord_num = order['order_number']
            execute_db('DELETE FROM order_items WHERE order_id = ?', (ord_id,))
            execute_db('DELETE FROM order_timeline WHERE order_id = ?', (ord_id,))
            execute_db('DELETE FROM payment_records WHERE order_number = ? OR order_id = ?', (ord_num, ord_id))
            execute_db('DELETE FROM payments WHERE order_number = ? OR order_id = ?', (ord_num, ord_id))
            execute_db('DELETE FROM notification_logs WHERE order_number = ? OR order_id = ?', (ord_num, ord_id))
            execute_db('DELETE FROM orders WHERE id = ?', (ord_id,))
            deleted += 1

    return jsonify({'success': True, 'deleted_count': deleted, 'message': f'{deleted} orders deleted successfully.'})


@api_bp.route('/orders/clear-all', methods=['POST'])
@admin_required(['OWNER', 'SUPER_ADMIN'])
def api_clear_all_orders():
    execute_db('DELETE FROM order_items')
    execute_db('DELETE FROM order_timeline')
    execute_db('DELETE FROM payment_records')
    execute_db('DELETE FROM payments')
    execute_db('DELETE FROM notification_logs')
    execute_db('DELETE FROM orders')
    return jsonify({'success': True, 'message': 'All orders cleared successfully from store database.'})




