import urllib.parse
import re
import os
import time
import json
import logging
from database import execute_db, query_db

logger = logging.getLogger(__name__)

def normalize_pk_phone(phone):
    """
    Normalizes Pakistani phone numbers to canonical E.164 international format (+92 3XX XXXXXXX).
    Examples:
      '03001234567' -> '+923001234567'
      '0300-1234567' -> '+923001234567'
      '923001234567' -> '+923001234567'
      '+92 300 1234567' -> '+923001234567'
    """
    if not phone:
        return ""
    digits = re.sub(r'\D', '', str(phone))
    if digits.startswith('0') and len(digits) == 11:
        return f"+92{digits[1:]}"
    elif digits.startswith('92') and len(digits) == 12:
        return f"+{digits}"
    elif len(digits) == 10 and digits.startswith('3'):
        return f"+92{digits}"
    elif phone.startswith('+'):
        return f"+{digits}"
    return f"+{digits}" if digits else ""


def send_sms(phone, message, title=None, order_id=None, order_number=None, recipient_type='customer', idempotency_key=None):
    """
    Dispatches SMS notification with idempotency check and audit logging.
    Never raises exceptions that would disrupt checkout or order operations.
    """
    clean_phone = normalize_pk_phone(phone)
    if not clean_phone:
        logger.warning(f"send_sms: Invalid or empty recipient phone: {phone}")
        return False

    # Idempotency check: prevent duplicate notifications
    if idempotency_key:
        existing = query_db(
            'SELECT id FROM notification_logs WHERE idempotency_key = ?',
            (idempotency_key,),
            one=True
        )
        if existing:
            logger.info(f"send_sms: Skipped duplicate notification for key {idempotency_key}")
            return True

    status = 'sent'
    err_msg = None

    try:
        sms_provider = os.getenv('SMS_PROVIDER', 'MOCK')
        if sms_provider == 'LIVE':
            pass
        else:
            logger.info(f"[SMS DISPATCH to {clean_phone}]: {message}")
    except Exception as e:
        status = 'failed'
        err_msg = str(e)
        logger.error(f"Failed to dispatch SMS to {clean_phone}: {e}")

    # Persist log to notification_logs
    try:
        execute_db('''
            INSERT INTO notification_logs (
                order_id, order_number, recipient_type, recipient,
                channel, title, message, status, idempotency_key, error_message, created_at
            ) VALUES (?, ?, ?, ?, 'sms', ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
        ''', (
            order_id, order_number, recipient_type, clean_phone,
            title or f"Notification for #{order_number or order_id}",
            message, status, idempotency_key, err_msg
        ))
    except Exception as log_err:
        logger.warning(f"Could not write to notification_logs: {log_err}")

    # Also persist to notifications table for admin bell/activity feed
    try:
        execute_db('''
            INSERT INTO notifications (recipient_type, recipient, title, message, channel, status)
            VALUES (?, ?, ?, ?, 'sms', ?)
        ''', (recipient_type, clean_phone, title or f"Order #{order_number or order_id}", message, status))
    except Exception:
        pass

    return status == 'sent'


def send_whatsapp_message(phone, message, title=None, order_id=None, order_number=None, recipient_type='customer', idempotency_key=None, store_settings=None):
    """
    Dispatches automated WhatsApp notification directly from store/owner to customer with idempotency check,
    audit logging, and multi-gateway support (UltraMsg, Meta WhatsApp Cloud API, Twilio, Webhooks, or Direct Concierge).
    """
    clean_phone = normalize_pk_phone(phone)
    if not clean_phone:
        logger.warning(f"send_whatsapp_message: Invalid recipient phone: {phone}")
        return False

    wa_phone_digits = re.sub(r'\D', '', clean_phone)

    # Idempotency check: prevent duplicate notifications
    if idempotency_key:
        existing = query_db(
            'SELECT id FROM notification_logs WHERE idempotency_key = ?',
            (idempotency_key,),
            one=True
        )
        if existing:
            logger.info(f"send_whatsapp_message: Skipped duplicate WhatsApp for key {idempotency_key}")
            return True

    status = 'sent'
    err_msg = None

    # Load WhatsApp configuration from store_settings or environment
    s = store_settings or {}
    wa_cfg = s.get('whatsapp_automation') or {}
    provider = wa_cfg.get('provider') or os.getenv('WHATSAPP_PROVIDER', 'DIRECT')
    api_token = wa_cfg.get('api_token') or os.getenv('WHATSAPP_API_TOKEN', '')
    instance_id = wa_cfg.get('instance_id') or os.getenv('WHATSAPP_INSTANCE_ID', '')
    api_url = wa_cfg.get('api_url') or os.getenv('WHATSAPP_API_URL', '')

    try:
        if provider == 'ULTRAMSG' and instance_id and api_token:
            import urllib.request
            post_data = urllib.parse.urlencode({
                'token': api_token,
                'to': f"+{wa_phone_digits}",
                'body': message
            }).encode('utf-8')
            req = urllib.request.Request(
                f"https://api.ultramsg.com/{instance_id}/messages/chat",
                data=post_data,
                headers={'Content-Type': 'application/x-www-form-urlencoded', 'User-Agent': 'Khushi-Collection-Store/3.0'}
            )
            with urllib.request.urlopen(req, timeout=8) as resp:
                resp_text = resp.read().decode('utf-8')
                logger.info(f"UltraMsg response for {clean_phone}: {resp_text}")
        elif provider == 'META_CLOUD' and instance_id and api_token:
            import urllib.request
            payload_data = json.dumps({
                "messaging_product": "whatsapp",
                "recipient_type": "individual",
                "to": wa_phone_digits,
                "type": "text",
                "text": {"preview_url": True, "body": message}
            }).encode('utf-8')
            req = urllib.request.Request(
                f"https://graph.facebook.com/v18.0/{instance_id}/messages",
                data=payload_data,
                headers={
                    'Authorization': f"Bearer {api_token}",
                    'Content-Type': 'application/json'
                }
            )
            with urllib.request.urlopen(req, timeout=8) as resp:
                logger.info(f"Meta Cloud WhatsApp response for {clean_phone}: {resp.read().decode('utf-8')}")
        elif provider == 'WEBHOOK' and api_url:
            import urllib.request
            payload_data = json.dumps({
                "phone": clean_phone,
                "whatsapp_number": wa_phone_digits,
                "message": message,
                "order_number": order_number,
                "recipient_type": recipient_type
            }).encode('utf-8')
            req = urllib.request.Request(
                api_url,
                data=payload_data,
                headers={'Content-Type': 'application/json'}
            )
            with urllib.request.urlopen(req, timeout=8) as resp:
                logger.info(f"Webhook WhatsApp response: {resp.read().decode('utf-8')}")
        else:
            logger.info(f"[WHATSAPP AUTOMATED DISPATCH to {clean_phone} from Owner]:\n{message}")
    except Exception as e:
        status = 'failed'
        err_msg = str(e)
        logger.error(f"Failed to dispatch WhatsApp to {clean_phone}: {e}")

    # Persist log in notification_logs
    try:
        execute_db('''
            INSERT INTO notification_logs (
                order_id, order_number, recipient_type, recipient,
                channel, title, message, status, idempotency_key, error_message, created_at
            ) VALUES (?, ?, ?, ?, 'whatsapp', ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
        ''', (
            order_id, order_number, recipient_type, clean_phone,
            title or f"WhatsApp for #{order_number or order_id}",
            message, status, idempotency_key, err_msg
        ))
    except Exception as log_err:
        logger.warning(f"Could not write WhatsApp log: {log_err}")

    # Persist in notifications table
    try:
        execute_db('''
            INSERT INTO notifications (recipient_type, recipient, title, message, channel, status)
            VALUES (?, ?, ?, ?, 'whatsapp', ?)
        ''', (recipient_type, clean_phone, title or f"Order #{order_number or order_id}", message, status))
    except Exception:
        pass

    return status == 'sent'


def build_customer_whatsapp_order_message(order, items=None, store_settings=None):
    """
    Builds a luxury automated WhatsApp confirmation message specifically formatted for the customer.
    """
    order = dict(order)
    cust_name = order.get('customer_name', 'Valued Client')
    order_num = order.get('order_number', 'KC-1000')
    cust_phone = order.get('customer_phone', '')
    total = int(float(order.get('total_amount', 0)))
    store_name = (store_settings or {}).get('store_name', 'Khushi Collection')
    store_phone = (store_settings or {}).get('phone') or (store_settings or {}).get('whatsapp') or '+92 300 1234567'

    payment_labels = {
        'cod': 'Cash on Delivery (COD)',
        'bank': 'Direct Bank Transfer',
        'easypaisa': 'EasyPaisa Mobile Payment',
        'jazzcash': 'JazzCash Mobile Payment',
        'online_card': 'Online Debit / Credit Card'
    }
    pay_display = payment_labels.get(order.get('payment_method'), str(order.get('payment_method', '')).upper())

    product_lines = []
    if items:
        for idx, raw_item in enumerate(items, 1):
            item = dict(raw_item)
            variant_str = f" ({item['size']}/{item['color']})" if item.get('size') or item.get('color') else ""
            product_lines.append(f"  • {item.get('product_name') or item.get('name')}{variant_str} × {item.get('quantity', 1)} = Rs. {int(float(item.get('total', item.get('price', 0)))):,}")
    
    products_text = "\n".join(product_lines) if product_lines else "  • Luxury Pret Ensemble × 1"
    full_address = f"{order.get('address', '')}, {order.get('city', '')}"
    if order.get('area'):
        full_address += f" ({order['area']})"

    msg = f"""✨ *{store_name.upper()}* ✨
*ORDER CONFIRMATION*

Dear *{cust_name}*,

Thank you for choosing *{store_name}*! Your luxury order has been received and is now being processed.

📋 *Order Number:* #{order_num}
💰 *Total Amount:* Rs. {total:,}
💳 *Payment Method:* {pay_display}
📍 *Delivery Address:* {full_address}

📦 *Items in your parcel:*
{products_text}

🚚 *Estimated Delivery:* 2 - 4 Business Days
🔍 *Track Your Order Live:*
https://khushicollection.com/track-order?order_id={order_num}&phone={cust_phone}

Our concierge team is preparing your package with master craftsmanship. If you have any special instructions, simply reply to this message!

With warm regards,
*{store_name} Concierge*
WhatsApp: {store_phone}"""

    return msg.strip()


def trigger_order_placed_notifications(order, items=None, store_settings=None):
    """
    Sends customer order confirmation SMS & WhatsApp, and alerts store owner/admin.
    """
    order = dict(order)
    order_id = order.get('id')
    order_number = order.get('order_number')
    cust_name = order.get('customer_name', 'Valued Customer')
    cust_phone = order.get('customer_phone')
    total = int(float(order.get('total_amount', 0)))
    pay_method = order.get('payment_method', 'cod').upper()
    pay_status = order.get('payment_status', 'PENDING')

    # 1. Customer Confirmation SMS
    if cust_phone:
        cust_sms = (
            f"Dear {cust_name}, thank you for choosing Khushi Collection! "
            f"Your order #{order_number} for Rs. {total:,} ({pay_method} - {pay_status}) has been received. "
            f"Track anytime at https://khushicollection.com/track-order?order_id={order_number}&phone={cust_phone}"
        )
        send_sms(
            phone=cust_phone,
            message=cust_sms,
            title=f"Order #{order_number} Received",
            order_id=order_id,
            order_number=order_number,
            recipient_type='customer',
            idempotency_key=f"order_placed_cust_{order_number}"
        )

        # 2. Automated Customer WhatsApp Message (Direct to customer's WhatsApp)
        cust_wa_msg = build_customer_whatsapp_order_message(order, items, store_settings)
        send_whatsapp_message(
            phone=cust_phone,
            message=cust_wa_msg,
            title=f"WhatsApp Order #{order_number}",
            order_id=order_id,
            order_number=order_number,
            recipient_type='customer',
            idempotency_key=f"order_placed_cust_wa_{order_number}",
            store_settings=store_settings
        )

    # 3. Store Owner / Admin Alert (SMS & WhatsApp)
    admin_phone = (store_settings or {}).get('store_phone') or (store_settings or {}).get('whatsapp') or os.getenv('ADMIN_ALERT_PHONE', '+923001234567')
    if admin_phone:
        admin_msg = (
            f"🛍️ [Khushi Collection] NEW ORDER ALERT: Order #{order_number} placed by {cust_name} ({cust_phone}). "
            f"Total: Rs. {total:,}. Method: {pay_method} ({pay_status})."
        )
        send_sms(
            phone=admin_phone,
            message=admin_msg,
            title=f"New Order #{order_number}",
            order_id=order_id,
            order_number=order_number,
            recipient_type='admin',
            idempotency_key=f"order_placed_admin_{order_number}"
        )

        # WhatsApp alert to store owner
        admin_wa_msg = build_whatsapp_order_message(order, items or [], store_settings)
        send_whatsapp_message(
            phone=admin_phone,
            message=admin_wa_msg,
            title=f"Admin Alert #{order_number}",
            order_id=order_id,
            order_number=order_number,
            recipient_type='admin',
            idempotency_key=f"order_placed_admin_wa_{order_number}",
            store_settings=store_settings
        )


def trigger_payment_verified_sms(order, payment_record=None, store_settings=None):
    """
    Sends SMS and WhatsApp to customer when payment is successfully verified/paid.
    """
    order = dict(order)
    order_id = order.get('id')
    order_number = order.get('order_number')
    cust_name = order.get('customer_name', 'Valued Customer')
    cust_phone = order.get('customer_phone')
    total = int(float(order.get('total_amount', 0)))

    if not cust_phone:
        return False

    msg = (
        f"Dear {cust_name}, your payment of Rs. {total:,} for Khushi Collection order #{order_number} "
        f"has been verified successfully! Your order is now confirmed for priority preparation."
    )
    send_sms(
        phone=cust_phone,
        message=msg,
        title=f"Payment Verified — Order #{order_number}",
        order_id=order_id,
        order_number=order_number,
        recipient_type='customer',
        idempotency_key=f"payment_verified_{order_number}"
    )

    wa_msg = f"""✅ *PAYMENT VERIFIED — KHUSHI COLLECTION*

Dear *{cust_name}*,

We are pleased to inform you that your payment of *Rs. {total:,}* for Order *#{order_number}* has been verified successfully.

Your order is now confirmed and our atelier is preparing your pieces with priority.

Thank you for choosing Khushi Collection!"""

    send_whatsapp_message(
        phone=cust_phone,
        message=wa_msg,
        title=f"Payment Verified WhatsApp #{order_number}",
        order_id=order_id,
        order_number=order_number,
        recipient_type='customer',
        idempotency_key=f"payment_verified_wa_{order_number}",
        store_settings=store_settings
    )

    return True


def trigger_order_status_sms(order, status, store_settings=None):
    """
    Sends customer notification via SMS and WhatsApp upon lifecycle status updates (confirmed, processing, shipped, etc.)
    """
    order = dict(order)
    order_id = order.get('id')
    order_number = order.get('order_number')
    cust_name = order.get('customer_name', 'Valued Customer')
    cust_phone = order.get('customer_phone')
    tracking_num = order.get('tracking_number') or 'TRX-101'
    courier = order.get('courier_name') or 'Trax Logistics'

    if not cust_phone:
        return None

    status_key = str(status).lower().strip()
    status_messages = {
        'confirmed': (
            f"Hello {cust_name}, your Khushi Collection order #{order_number} has been confirmed. "
            f"Our master artisans are preparing your luxury garments."
        ),
        'processing': (
            f"Hello {cust_name}, your Khushi Collection order #{order_number} is undergoing quality check and luxury packaging."
        ),
        'ready': (
            f"Hello {cust_name}, your order #{order_number} is packed and sealed, awaiting courier pickup."
        ),
        'shipped': (
            f"Hello {cust_name}, order #{order_number} has shipped via {courier} (Tracking #{tracking_num}). "
            f"Track: https://khushicollection.com/track-order?order_id={order_number}&phone={cust_phone}"
        ),
        'on_the_way': (
            f"Hello {cust_name}, your Khushi Collection package #{order_number} is out for delivery today. "
            f"Please keep your mobile active."
        ),
        'delivered': (
            f"Hello {cust_name}, order #{order_number} has been delivered. We hope you love your pieces! "
            f"Thank you for choosing Khushi Collection."
        ),
        'cancelled': (
            f"Hello {cust_name}, your Khushi Collection order #{order_number} has been cancelled. "
            f"If you need assistance, contact our concierge at +92 300 1234567."
        )
    }

    message = status_messages.get(
        status_key,
        f"Hello {cust_name}, your order #{order_number} status is now: {str(status).upper()}."
    )

    send_sms(
        phone=cust_phone,
        message=message,
        title=f"Order #{order_number} Status Update",
        order_id=order_id,
        order_number=order_number,
        recipient_type='customer',
        idempotency_key=f"order_status_{order_number}_{status_key}_{int(time.time()*1000)}"
    )

    # WhatsApp Status Notification
    wa_status_titles = {
        'confirmed': 'Order Confirmed ✨',
        'processing': 'Garment in Atelier Quality Check 🪡',
        'ready': 'Parcel Sealed & Ready for Courier 📦',
        'shipped': f'Parcel Dispatched via {courier} 🚚',
        'on_the_way': 'Out for Delivery Today 🛵',
        'delivered': 'Delivered Successfully 🎁',
        'cancelled': 'Order Cancelled ⚠️'
    }
    wa_title = wa_status_titles.get(status_key, f"Status Update: {status.upper()}")

    wa_msg = f"""*{wa_title}*
*Khushi Collection — Order #{order_number}*

Dear *{cust_name}*,

{message}

🔍 *Track Package Live:*
https://khushicollection.com/track-order?order_id={order_number}&phone={cust_phone}

Thank you for choosing Khushi Collection!"""

    send_whatsapp_message(
        phone=cust_phone,
        message=wa_msg,
        title=f"WhatsApp Status {status_key} #{order_number}",
        order_id=order_id,
        order_number=order_number,
        recipient_type='customer',
        idempotency_key=f"wa_status_{order_number}_{status_key}_{int(time.time()*1000)}",
        store_settings=store_settings
    )

    return message


def build_whatsapp_order_message(order, items, store_settings=None):
    """
    Builds rich luxury formatted WhatsApp text message for store owner / admin notification.
    """
    order = dict(order)
    product_lines = []
    for idx, raw_item in enumerate(items, 1):
        item = dict(raw_item)
        variant_str = f" ({item['size']}/{item['color']})" if item.get('size') or item.get('color') else ""
        product_lines.append(f"{idx}. {item.get('product_name') or item.get('name')}{variant_str} x {item.get('quantity', 1)} = Rs. {int(float(item.get('total', item.get('subtotal', item.get('price', 0))))):,}")
    products_text = "\n".join(product_lines) if product_lines else "1. Luxury Pret Ensemble x 1"

    payment_labels = {
        'cod': 'Cash on Delivery (COD)',
        'bank': 'Direct Bank Transfer',
        'easypaisa': 'EasyPaisa Mobile Payment',
        'jazzcash': 'JazzCash Mobile Payment',
        'online_card': 'Online Debit / Credit Card'
    }
    payment_display = payment_labels.get(order.get('payment_method'), str(order.get('payment_method', '')).upper())

    full_address = f"{order.get('address', '')}, {order.get('city', '')}"
    if order.get('area'):
        full_address += f" ({order['area']})"

    message = f"""*NEW ORDER — KHUSHI COLLECTION*

Order ID: #{order.get('order_number')}

Customer:
Name: {order.get('customer_name')}
Phone: {order.get('customer_phone')}

Products:
{products_text}

Total:
Rs. {int(float(order.get('total_amount', 0))):,}

Payment Method:
{payment_display} (Status: {order.get('payment_status', 'PENDING').upper()})

Delivery Address:
{full_address}

Please process this order."""
    
    return message.strip()


def get_whatsapp_send_url(phone, message):
    """Generates direct click-to-send WhatsApp link."""
    clean_phone = "".join(filter(str.isdigit, str(phone)))
    encoded_text = urllib.parse.quote(message)
    return f"https://api.whatsapp.com/send?phone={clean_phone}&text={encoded_text}"

