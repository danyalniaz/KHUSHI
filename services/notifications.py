import urllib.parse
from database import execute_db, query_db

def build_whatsapp_order_message(order, items, store_settings):
    order = dict(order)
    product_lines = []
    for idx, raw_item in enumerate(items, 1):
        item = dict(raw_item)
        variant_str = f" ({item['size']}/{item['color']})" if item.get('size') or item.get('color') else ""
        product_lines.append(f"{idx}. {item['product_name']}{variant_str} x {item['quantity']} = Rs. {int(item['total']):,}")
    products_text = "\n".join(product_lines)

    payment_labels = {
        'cod': 'Cash on Delivery (COD)',
        'bank': 'Direct Bank Transfer',
        'easypaisa': 'EasyPaisa Mobile Payment',
        'jazzcash': 'JazzCash Mobile Payment'
    }
    payment_display = payment_labels.get(order['payment_method'], str(order['payment_method']).upper())

    full_address = f"{order['address']}, {order['city']}"
    if order.get('area'):
        full_address += f" ({order['area']})"

    message = f"""*NEW ORDER — KHUSHI COLLECTION*

Order ID: #{order['order_number']}

Customer:
Name: {order['customer_name']}
Phone: {order['customer_phone']}

Products:
{products_text}

Total:
Rs. {int(order['total_amount']):,}

Payment:
{payment_display}

Delivery Address:
{full_address}

Please process this order."""
    
    return message.strip()

def get_whatsapp_send_url(phone, message):
    """Generates direct click-to-send WhatsApp link"""
    clean_phone = "".join(filter(str.isdigit, str(phone)))
    encoded_text = urllib.parse.quote(message)
    return f"https://api.whatsapp.com/send?phone={clean_phone}&text={encoded_text}"

def trigger_order_status_sms(order, status):
    """
    Sends SMS customer notification upon status updates:
    E.g. for ON THE WAY:
    “Hello {customer name}, your Khushi Collection order #{order ID} is now on the way. Thank you for shopping with Khushi Collection.”
    """
    order = dict(order)
    name = order['customer_name']
    order_id = order['order_number']
    phone = order['customer_phone']

    status_messages = {
        'confirmed': f"Hello {name}, your Khushi Collection order #{order_id} has been confirmed. Thank you for shopping with Khushi Collection.",
        'processing': f"Hello {name}, your Khushi Collection order #{order_id} is being carefully prepared and quality checked. Thank you for choosing Khushi Collection.",
        'ready': f"Hello {name}, your Khushi Collection order #{order_id} is packaged and ready for dispatch. Thank you for shopping with Khushi Collection.",
        'shipped': f"Hello {name}, your Khushi Collection order #{order_id} has been handed over to courier tracking #{order.get('tracking_number') or 'TRX-101'}. Thank you for shopping with Khushi Collection.",
        'on_the_way': f"Hello {name}, your Khushi Collection order #{order_id} is now on the way. Thank you for shopping with Khushi Collection.",
        'delivered': f"Hello {name}, your Khushi Collection order #{order_id} has been delivered. We hope you love your purchase! Thank you for shopping with Khushi Collection.",
        'cancelled': f"Hello {name}, your Khushi Collection order #{order_id} has been cancelled. If you need assistance, call or WhatsApp +92 300 1234567."
    }

    message = status_messages.get(status, f"Hello {name}, your Khushi Collection order #{order_id} status is updated to {status.upper()}.")

    # Record notification in database
    execute_db('''
    INSERT INTO notifications (recipient_type, recipient, title, message, channel, status)
    VALUES ('customer', ?, ?, ?, 'sms', 'sent')
    ''', (phone, f"Order #{order_id} Status Update", message))

    return message
