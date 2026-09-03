import os
from flask import Flask, render_template
from config import Config
from database import init_db
from seed_data import seed

# Import Blueprints
from routes.storefront import storefront_bp
from routes.api import api_bp
from routes.account import account_bp
from routes.admin import admin_bp
from routes.payments import payments_bp

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Ensure uploads directory exists safely
    try:
        os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
    except Exception:
        pass

    # Initialize and seed database if not already seeded
    try:
        init_db()
        seed()
    except Exception as e:
        print(f"Serverless DB init notice: {e}")

    # Jinja Filters
    import json
    app.jinja_env.filters['from_json'] = lambda s: json.loads(s) if s else []

    # Register Blueprints
    app.register_blueprint(storefront_bp)
    app.register_blueprint(api_bp)
    app.register_blueprint(account_bp)
    app.register_blueprint(admin_bp)
    app.register_blueprint(payments_bp)

    # Error Handlers
    @app.errorhandler(404)
    def not_found(e):
        return render_template('404.html'), 404

    @app.errorhandler(500)
    def internal_error(e):
        return render_template('500.html'), 500

    return app

app = create_app()

# WSGI Handler for Serverless Environments
handler = app

if __name__ == '__main__':
    print("Starting Khushi Collection luxury e-commerce server...")
    print("Access customer storefront at: http://127.0.0.1:5000")
    print("Access admin dashboard at: http://127.0.0.1:5000/admin")
    app.run(host='0.0.0.0', port=5000, debug=True)
