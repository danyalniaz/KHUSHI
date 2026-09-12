import os
import re

files = [f for f in os.listdir('.') if f.startswith('admin-') and f.endswith('.html')]

mappings = {
    'admin-dashboard.html': '/admin',
    'admin-products.html': '/admin/products',
    'admin-categories.html': '/admin/categories',
    'admin-orders.html': '/admin/orders',
    'admin-customers.html': '/admin/customers',
    'admin-settings.html': '/admin/settings',
    'admin-security.html': '/admin/security',
    'admin-staff.html': '/admin/security',
    'admin-reports.html': '/admin/reports'
}

for filepath in files:
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            code = f.read()
            
        for old, new in mappings.items():
            code = code.replace(f'href="{old}"', f'href="{new}"')
            
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(code)
            
        print(f"Updated links in {filepath}")
    except Exception as e:
        print(f"Error on {filepath}: {e}")
