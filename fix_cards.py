import re

files = ['templates/admin/dashboard.html', 'admin-dashboard.html']
for filepath in files:
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            code = f.read()
        
        mappings = {
            '<!-- 1. Total Sales -->': '/admin/reports',
            '<!-- 2. Today''s Sales -->': '/admin/reports',
            '<!-- 3. Total Orders -->': '/admin/orders',
            '<!-- 4. Pending -->': '/admin/orders?status=pending',
            '<!-- 5. Processing -->': '/admin/orders?status=processing',
            '<!-- 6. Delivered -->': '/admin/orders?status=delivered',
            '<!-- 7. Cancelled -->': '/admin/orders?status=cancelled',
            '<!-- 8. Customers -->': '/admin/customers',
            '<!-- 9. Products -->': '/admin/products',
            '<!-- 10. Low Stock -->': '/admin/inventory'
        }
        
        for comment, link in mappings.items():
            pattern = re.escape(comment) + r'\s*<div class="luxury-card'
            replacement = comment + '\n        <div onclick="window.location.href=\'' + link + '\'" style="cursor: pointer;" class="luxury-card hover:border-amber-400 transition '
            code = re.sub(pattern, replacement, code)
            
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(code)
            
        print('Updated', filepath)
    except Exception as e:
        print('Error on', filepath, e)
