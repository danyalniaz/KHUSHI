import os
import shutil

BASE_DIR = os.path.abspath(os.path.dirname(__file__))

# Check if running in a serverless environment (Vercel, AWS Lambda, or read-only filesystem)
IS_SERVERLESS = os.environ.get('VERCEL') == '1' or os.environ.get('AWS_LAMBDA_FUNCTION_NAME') is not None or not os.access(BASE_DIR, os.W_OK)

if IS_SERVERLESS:
    DATA_DIR = '/tmp'
    DB_PATH = os.path.join(DATA_DIR, 'khushi.db')
    src_db = os.path.join(BASE_DIR, 'khushi.db')
    if os.path.exists(src_db) and not os.path.exists(DB_PATH):
        try:
            shutil.copy2(src_db, DB_PATH)
        except Exception:
            pass
    UPLOAD_DIR = os.path.join(DATA_DIR, 'uploads')
else:
    DATA_DIR = BASE_DIR
    DB_PATH = os.path.join(BASE_DIR, 'khushi.db')
    UPLOAD_DIR = os.path.join(BASE_DIR, 'static', 'uploads')

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY', 'khushi-collection-secret-key-2026-luxury-brand')
    DATABASE = DB_PATH
    UPLOAD_FOLDER = UPLOAD_DIR
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16 MB max upload
    STORE_NAME = "Khushi Collection"
    STORE_PHONE = "+92 300 1234567"
    STORE_WHATSAPP = "923001234567"
    STORE_EMAIL = "support@khushicollection.com"
    CURRENCY = "Rs."
    BASE_DELIVERY_FEE = 200
    FREE_DELIVERY_THRESHOLD = 5000
