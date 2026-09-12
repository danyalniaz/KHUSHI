import re

files = ['templates/admin/dashboard.html', 'admin-dashboard.html']

mappings = {
    '1. Total Sales': '/admin/reports',
    '2. Today\\'s Sales': '/admin/reports',
    '3. Total Orders': '/admin/orders',
    '4. Pending': '/admin/orders?status=pending',
    '5. Processing': '/admin/orders?status=processing',
    '6. Delivered': '/admin/orders?status=delivered',
    '7. Cancelled': '/admin/orders?status=cancelled',
    '8. Customers': '/admin/customers',
    '9. Products': '/admin/products',
    '10. Low Stock': '/admin/inventory',
    
    # Static fallbacks
    'Total Sales': '/admin/reports',
    'Today\\'s Sales': '/admin/reports',
    'Total Orders': '/admin/orders',
    'Pending': '/admin/orders?status=pending',
    'Processing': '/admin/orders?status=processing',
    'Delivered': '/admin/orders?status=delivered',
    'Cancelled': '/admin/orders?status=cancelled',
    'Customers': '/admin/customers',
    'Products': '/admin/products',
    'Low Stock': '/admin/inventory'
}

for filepath in files:
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
            
        for name, link in mappings.items():
            # Find the comment
            comment = f'<!-- {name} -->'
            if comment in content:
                # We need to replace <div class="luxury-card ..."> immediately following the comment
                # with <div onclick="..." class="cursor-pointer hover:border-amber-400 transition luxury-card ...">
                pattern = re.compile(re.escape(comment) + r'\s*<div class="luxury-card')
                replacement = comment + f'\n        <div onclick="window.location.href=\'{link}\'" class="cursor-pointer hover:border-amber-400 transition luxury-card'
                content = pattern.sub(replacement, content)
                
        # Also need to re-apply the links in the sidebar for admin-dashboard.html, since I reverted it!
        if filepath == 'admin-dashboard.html':
            sidebar_maps = {
                'admin-products.html': '/admin/products',
                'admin-categories.html': '/admin/categories',
                'admin-orders.html': '/admin/orders',
                'admin-customers.html': '/admin/customers',
                'admin-settings.html': '/admin/settings',
                'admin-security.html': '/admin/security',
                'admin-reports.html': '/admin/reports'
            }
            for old, new in sidebar_maps.items():
                content = content.replace(f'href="{old}"', f'href="{new}"')
                
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Fixed {filepath}")
    except Exception as e:
        print(f"Error {filepath}: {e}")
