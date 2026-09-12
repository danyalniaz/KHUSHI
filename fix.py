import re

with open('routes/admin.py', 'r', encoding='utf-8') as f:
    code = f.read()

pattern = re.compile(r"def delete_order_endpoint\(identifier\):.*?try:.*?clean = str\(identifier\).*?execute_db\('DELETE FROM orders WHERE id = \?', \(ord_id,\)\).*?return jsonify\(\{'success': True, 'message': f'Order \{ord_num\} permanently deleted.'\}\)", re.DOTALL)

def repl(m):
    return """def delete_order_endpoint(identifier):
    try:
        clean = str(identifier).replace('#', '').strip()
        order = query_db(
            'SELECT id, order_number FROM orders WHERE order_number = ? OR order_number = ? OR id = ?',
            (clean, f\"KC-{clean}\", clean),
            one=True
        )
        wants_json = request.headers.get('Accept', '').find('application/json') > -1 or request.headers.get('Content-Type') == 'application/json' or request.is_json
        
        if not order:
            if not wants_json:
                from flask import flash, redirect, url_for, request
                flash(f'Order {identifier} not found.', 'error')
                return redirect(request.referrer or url_for('admin.orders'))
            return jsonify({'success': False, 'error': f'Order {identifier} not found.'}), 404

        ord_id = order['id']
        ord_num = order['order_number']

        execute_db('DELETE FROM order_items WHERE order_id = ?', (ord_id,))
        execute_db('DELETE FROM order_timeline WHERE order_id = ?', (ord_id,))
        execute_db('DELETE FROM payment_records WHERE order_number = ? OR order_id = ?', (ord_num, ord_id))
        execute_db('DELETE FROM payments WHERE order_number = ? OR order_id = ?', (ord_num, ord_id))
        execute_db('DELETE FROM notification_logs WHERE order_number = ? OR order_id = ?', (ord_num, ord_id))
        execute_db('DELETE FROM orders WHERE id = ?', (ord_id,))

        if not wants_json:
            from flask import flash, redirect, url_for, request
            flash(f'Order {ord_num} permanently deleted.', 'success')
            return redirect(request.referrer or url_for('admin.orders'))
            
        return jsonify({'success': True, 'message': f'Order {ord_num} permanently deleted.'})"""

code = pattern.sub(repl, code)
with open('routes/admin.py', 'w', encoding='utf-8') as f:
    f.write(code)
