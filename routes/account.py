from functools import wraps
from flask import Blueprint, render_template, request, redirect, url_for, session, flash
from werkzeug.security import generate_password_hash, check_password_hash
from database import query_db, execute_db

account_bp = Blueprint('account', __name__)

def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if not session.get('user_id'):
            flash('Please log in to access your account.', 'info')
            return redirect(url_for('account.login', next=request.url))
        return f(*args, **kwargs)
    return decorated_function

# 1. Login
@account_bp.route('/login', methods=['GET', 'POST'])
def login():
    if session.get('user_id'):
        return redirect(url_for('account.dashboard'))

    if request.method == 'POST':
        email = request.form.get('email', '').strip().lower()
        password = request.form.get('password', '')
        next_url = request.args.get('next') or url_for('account.dashboard')

        user = query_db('SELECT * FROM users WHERE email = ?', (email,), one=True)
        if user and check_password_hash(user['password_hash'], password):
            if user['status'] != 'active':
                flash('Your account has been deactivated. Please contact support.', 'error')
                return render_template('auth/login.html')

            session['user_id'] = user['id']
            session['user_name'] = user['name']
            session['user_email'] = user['email']
            session['user_role'] = user['role']
            flash(f'Welcome back, {user["name"]}!', 'success')
            
            # If admin or manager, give quick redirect option
            if user['role'] in ('super_admin', 'manager', 'staff'):
                return redirect(url_for('admin.dashboard'))

            return redirect(next_url)
        else:
            flash('Invalid email address or password.', 'error')

    return render_template('auth/login.html')

# 2. Register
@account_bp.route('/register', methods=['GET', 'POST'])
def register():
    if session.get('user_id'):
        return redirect(url_for('account.dashboard'))

    if request.method == 'POST':
        name = request.form.get('name', '').strip()
        email = request.form.get('email', '').strip().lower()
        phone = request.form.get('phone', '').strip()
        password = request.form.get('password', '')
        confirm_password = request.form.get('confirm_password', '')

        if not name or not email or not password:
            flash('Please fill in all required fields.', 'error')
            return render_template('auth/register.html')

        if password != confirm_password:
            flash('Passwords do not match.', 'error')
            return render_template('auth/register.html')

        existing = query_db('SELECT id FROM users WHERE email = ?', (email,), one=True)
        if existing:
            flash('An account with this email already exists.', 'error')
            return render_template('auth/register.html')

        pwd_hash = generate_password_hash(password)
        user_id = execute_db('''
            INSERT INTO users (name, email, phone, password_hash, role, status)
            VALUES (?, ?, ?, ?, 'customer', 'active')
        ''', (name, email, phone, pwd_hash))

        session['user_id'] = user_id
        session['user_name'] = name
        session['user_email'] = email
        session['user_role'] = 'customer'

        flash('Your account has been created successfully! Welcome to Khushi Collection.', 'success')
        return redirect(url_for('account.dashboard'))

    return render_template('auth/register.html')

# 3. Logout
@account_bp.route('/logout')
def logout():
    session.pop('user_id', None)
    session.pop('user_name', None)
    session.pop('user_email', None)
    session.pop('user_role', None)
    flash('You have been logged out safely.', 'info')
    return redirect(url_for('storefront.home'))

# 4. Customer Account Dashboard
@account_bp.route('/account')
@login_required
def dashboard():
    user = query_db('SELECT * FROM users WHERE id = ?', (session['user_id'],), one=True)
    orders = query_db('SELECT * FROM orders WHERE user_id = ? ORDER BY id DESC LIMIT 5', (session['user_id'],))
    addresses = query_db('SELECT * FROM addresses WHERE user_id = ? ORDER BY is_default DESC', (session['user_id'],))
    
    total_orders = query_db('SELECT COUNT(*) as cnt FROM orders WHERE user_id = ?', (session['user_id'],), one=True)['cnt']
    total_spent = query_db('SELECT COALESCE(SUM(total_amount), 0) as sm FROM orders WHERE user_id = ?', (session['user_id'],), one=True)['sm']

    return render_template(
        'account/profile.html',
        user=user,
        orders=orders,
        addresses=addresses,
        total_orders=total_orders,
        total_spent=total_spent
    )

# 5. Customer Orders List
@account_bp.route('/account/orders')
@login_required
def orders():
    orders_list = query_db('SELECT * FROM orders WHERE user_id = ? ORDER BY id DESC', (session['user_id'],))
    return render_template('account/orders.html', orders=orders_list)

# 6. Saved Addresses
@account_bp.route('/account/addresses', methods=['GET', 'POST'])
@login_required
def addresses():
    user_id = session['user_id']

    if request.method == 'POST':
        label = request.form.get('label', 'Home').strip()
        full_name = request.form.get('full_name', '').strip()
        phone = request.form.get('phone', '').strip()
        address = request.form.get('address', '').strip()
        city = request.form.get('city', '').strip()
        area = request.form.get('area', '').strip()
        postal_code = request.form.get('postal_code', '').strip()
        is_default = 1 if request.form.get('is_default') else 0

        if is_default:
            execute_db('UPDATE addresses SET is_default = 0 WHERE user_id = ?', (user_id,))

        execute_db('''
            INSERT INTO addresses (user_id, label, full_name, phone, address, city, area, postal_code, is_default)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (user_id, label, full_name, phone, address, city, area, postal_code, is_default))

        flash('Address saved successfully!', 'success')
        return redirect(url_for('account.addresses'))

    addresses_list = query_db('SELECT * FROM addresses WHERE user_id = ? ORDER BY is_default DESC', (user_id,))
    return render_template('account/addresses.html', addresses=addresses_list)

@account_bp.route('/account/addresses/delete/<int:id>', methods=['POST'])
@login_required
def delete_address(id):
    execute_db('DELETE FROM addresses WHERE id = ? AND user_id = ?', (id, session['user_id']))
    flash('Address removed.', 'info')
    return redirect(url_for('account.addresses'))

# 7. Change Password
@account_bp.route('/account/change-password', methods=['POST'])
@login_required
def change_password():
    current_pwd = request.form.get('current_password')
    new_pwd = request.form.get('new_password')
    confirm_pwd = request.form.get('confirm_password')

    user = query_db('SELECT * FROM users WHERE id = ?', (session['user_id'],), one=True)
    if not check_password_hash(user['password_hash'], current_pwd):
        flash('Incorrect current password.', 'error')
        return redirect(url_for('account.dashboard'))

    if new_pwd != confirm_pwd:
        flash('New passwords do not match.', 'error')
        return redirect(url_for('account.dashboard'))

    execute_db('UPDATE users SET password_hash = ? WHERE id = ?', (generate_password_hash(new_pwd), session['user_id']))
    flash('Password updated successfully!', 'success')
    return redirect(url_for('account.dashboard'))
