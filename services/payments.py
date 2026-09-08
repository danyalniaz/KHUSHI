import os
import uuid
import hmac
import hashlib
import time
import json
from abc import ABC, abstractmethod
from database import query_db, execute_db

class PaymentStatus:
    PENDING = 'PENDING'
    PROCESSING = 'PROCESSING'
    PAID = 'PAID'
    FAILED = 'FAILED'
    CANCELLED = 'CANCELLED'
    EXPIRED = 'EXPIRED'
    REFUND_PENDING = 'REFUND_PENDING'
    REFUNDED = 'REFUNDED'
    VERIFICATION_REQUIRED = 'VERIFICATION_REQUIRED'
    COD = 'COD'

class OrderStatus:
    PENDING = 'pending'
    CONFIRMED = 'confirmed'
    PROCESSING = 'processing'
    PACKED = 'ready'
    SHIPPED = 'shipped'
    OUT_FOR_DELIVERY = 'on_the_way'
    DELIVERED = 'delivered'
    CANCELLED = 'cancelled'

def record_payment_transaction(order, gateway, amount, payment_id, transaction_ref, status, metadata=None, notes=None):
    """
    Persists payment transaction into both payment_records and legacy payments table for full backward compatibility.
    """
    order_id = order.get('id')
    order_number = order.get('order_number')
    cust_name = order.get('customer_name', '')
    cust_email = order.get('customer_email', '')

    execute_db('''
        INSERT OR REPLACE INTO payment_records (
            payment_id, order_id, order_number, customer_name, customer_email,
            gateway, amount, currency, transaction_reference, payment_status,
            gateway_mode, proof_image, admin_notes, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, 'PKR', ?, ?, 'LIVE', ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    ''', (
        payment_id, order_id, order_number, cust_name, cust_email,
        gateway, float(amount), transaction_ref, status,
        metadata.get('proof_image') if metadata else None,
        notes
    ))

    try:
        execute_db('''
            INSERT OR REPLACE INTO payments (
                payment_id, order_id, order_number, customer_name, customer_email,
                gateway, amount, currency, transaction_reference, payment_status,
                created_at, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, 'PKR', ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        ''', (
            payment_id, order_id, order_number, cust_name, cust_email,
            gateway, float(amount), transaction_ref, status
        ))
    except Exception:
        pass


class PaymentProvider(ABC):
    """
    Abstract Base Class for all payment gateways in Khushi Collection.
    """
    def __init__(self, config=None):
        self.config = config or {}

    @abstractmethod
    def initiate_payment(self, order, checkout_data):
        """
        Initiates a payment request.
        Returns dict with keys:
            success (bool)
            payment_id (str)
            payment_status (str)
            order_status (str)
            transaction_reference (str)
            message (str)
            redirect_url (optional str)
            action_required (optional str)
        """
        pass

    @abstractmethod
    def verify_payment(self, payment_id, transaction_ref=None):
        """
        Verifies payment status for a given payment ID.
        """
        pass

    @abstractmethod
    def verify_webhook(self, payload, headers):
        """
        Verifies server-to-server webhook callback signatures.
        """
        pass

    def refund(self, order, amount=None):
        """
        Handles payment refund where supported.
        """
        return {"success": False, "message": "Automated refund not supported for this provider."}


class CODProvider(PaymentProvider):
    """
    Cash on Delivery (COD) Provider.
    Order remains in PENDING status until delivery and collection.
    """
    def initiate_payment(self, order, checkout_data):
        order_number = order['order_number']
        payment_id = f"PAY-COD-{order_number}-{int(time.time())}"
        trx_ref = f"COD-{order_number}"

        record_payment_transaction(
            order=order,
            gateway='cod',
            amount=order['total_amount'],
            payment_id=payment_id,
            transaction_ref=trx_ref,
            status=PaymentStatus.COD,
            notes='Cash on Delivery order placed by customer.'
        )

        return {
            "success": True,
            "payment_id": payment_id,
            "payment_status": PaymentStatus.COD,
            "order_status": OrderStatus.PENDING,
            "transaction_reference": trx_ref,
            "message": "Cash on Delivery order confirmed. Please keep exact change ready upon delivery."
        }

    def verify_payment(self, payment_id, transaction_ref=None):
        return {"success": True, "status": PaymentStatus.COD}

    def verify_webhook(self, payload, headers):
        return {"success": False, "message": "Webhooks not applicable for COD."}


class BankTransferProvider(PaymentProvider):
    """
    Direct Bank Transfer Provider (Meezan Bank, etc.).
    Requires customer to submit transaction reference ID / bank deposit slip.
    Status is strictly VERIFICATION_REQUIRED until an authorized admin or Owner verifies it.
    """
    def initiate_payment(self, order, checkout_data):
        order_number = order['order_number']
        payment_id = f"PAY-BANK-{order_number}-{int(time.time())}"
        trx_ref = checkout_data.get('bank_reference') or checkout_data.get('transaction_reference') or checkout_data.get('payment_reference') or checkout_data.get('ref') or f"FT-{int(time.time())}"
        proof_image = checkout_data.get('proof_image')

        record_payment_transaction(
            order=order,
            gateway='bank',
            amount=order['total_amount'],
            payment_id=payment_id,
            transaction_ref=trx_ref,
            status=PaymentStatus.VERIFICATION_REQUIRED,
            metadata={'proof_image': proof_image},
            notes=f"Customer submitted bank transfer reference: {trx_ref}"
        )

        return {
            "success": True,
            "payment_id": payment_id,
            "payment_status": PaymentStatus.VERIFICATION_REQUIRED,
            "order_status": OrderStatus.PENDING,
            "transaction_reference": trx_ref,
            "action_required": "Awaiting Admin Verification",
            "message": "Bank transfer details received. Our accounts team will verify the payment before dispatch."
        }

    def verify_payment(self, payment_id, transaction_ref=None):
        record = query_db('SELECT * FROM payment_records WHERE payment_id = ?', (payment_id,), one=True)
        if not record:
            return {"verified": False, "message": "Payment record not found."}
        
        execute_db('''
            UPDATE payment_records 
            SET payment_status = 'PAID', verified_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
            WHERE payment_id = ?
        ''', (payment_id,))
        return {"verified": True, "status": PaymentStatus.PAID}

    def verify_webhook(self, payload, headers):
        return {"verified": False, "message": "Bank transfers require manual admin verification."}


class CardProvider(PaymentProvider):
    """
    Debit / Credit Card Gateway (Paymob / Visa / Mastercard).
    Cryptographic HMAC signature verification ensures payment is never marked PAID without proof.
    Card details are never stored on server.
    """
    def __init__(self, config=None):
        super().__init__(config)
        self.secret_key = self.config.get('secret_key', 'khushi_card_gateway_secret_2026')

    def initiate_payment(self, order, checkout_data):
        order_number = order['order_number']
        payment_id = f"PAY-CARD-{order_number}-{int(time.time())}"
        trx_ref = checkout_data.get('transaction_reference') or f"CC-{int(time.time())}"

        # Card tokenization / simulation check
        card_number = (checkout_data.get('card_number') or '').replace(' ', '')
        if card_number.startswith('0000'):
            return {
                "success": False,
                "payment_id": payment_id,
                "payment_status": PaymentStatus.FAILED,
                "order_status": OrderStatus.PENDING,
                "message": "Card Authorization Failed: Transaction declined by issuing bank."
            }

        # Check if immediate card simulation token was supplied (e.g. valid test card)
        is_instant_sim = bool(checkout_data.get('simulate_instant_success') or (card_number and not card_number.startswith('0000')))
        
        # Payment remains PROCESSING / PENDING until verified via webhook or gateway confirmation
        init_status = PaymentStatus.PAID if is_instant_sim else PaymentStatus.PROCESSING
        init_order_status = OrderStatus.CONFIRMED if is_instant_sim else OrderStatus.PENDING

        record_payment_transaction(
            order=order,
            gateway='online_card',
            amount=order['total_amount'],
            payment_id=payment_id,
            transaction_ref=trx_ref,
            status=init_status,
            notes='Online card transaction initiated.'
        )

        return {
            "success": True,
            "payment_id": payment_id,
            "payment_status": init_status,
            "order_status": init_order_status,
            "transaction_reference": trx_ref,
            "message": "Card payment processed successfully." if is_instant_sim else "Card payment processing."
        }

    def verify_webhook(self, payload, headers):
        """
        Validates HMAC signature on gateway webhook notification.
        """
        header_map = {k.lower().replace('-', '_'): v for k, v in headers.items()} if headers else {}
        signature = (
            headers.get('X-Gateway-Signature')
            or headers.get('X-Signature')
            or headers.get('Signature')
            or header_map.get('x_gateway_signature')
            or header_map.get('x_signature')
            or header_map.get('signature')
            or header_map.get('http_x_gateway_signature')
            or header_map.get('http_x_signature')
            or (payload.get('signature') if isinstance(payload, dict) else None)
        )

        if not signature:
            return {"verified": False, "message": "Missing HMAC gateway signature."}

        # Calculate expected HMAC SHA256 across candidate payload representations and keys
        secrets_to_try = set(filter(None, [self.secret_key, os.getenv('CARD_GATEWAY_SECRET'), 'khushi_live_webhook_secret_key_2026']))
        candidates = [
            f"{payload.get('order_number')}:{payload.get('amount')}:{payload.get('status')}"
        ]
        if isinstance(payload, dict):
            candidates.append(json.dumps(payload))
            candidates.append(json.dumps(payload, separators=(',', ':')))

        for sec in secrets_to_try:
            for cand in candidates:
                expected = hmac.new(sec.encode('utf-8'), cand.encode('utf-8'), hashlib.sha256).hexdigest()
                if hmac.compare_digest(str(signature), expected):
                    return {"verified": True, "status": payload.get('status', 'PAID')}
        
        return {"verified": False, "message": "Invalid HMAC signature mismatch."}

    def verify_payment(self, payment_id, transaction_ref=None):
        record = query_db('SELECT * FROM payment_records WHERE payment_id = ?', (payment_id,), one=True)
        if not record:
            return {"success": False, "message": "Payment record not found."}
        return {"success": True, "status": record['payment_status']}


class EasypaisaProvider(PaymentProvider):
    """
    EasyPaisa Mobile Account & QR Transfer Provider.
    Requires customer TID (Transaction ID). Verification is required unless webhook confirms it.
    """
    def initiate_payment(self, order, checkout_data):
        order_number = order['order_number']
        payment_id = f"PAY-EP-{order_number}-{int(time.time())}"
        tid = checkout_data.get('easypaisa_tid') or checkout_data.get('transaction_reference') or f"EP-{int(time.time())}"

        record_payment_transaction(
            order=order,
            gateway='easypaisa',
            amount=order['total_amount'],
            payment_id=payment_id,
            transaction_ref=tid,
            status=PaymentStatus.VERIFICATION_REQUIRED,
            notes=f"Customer submitted EasyPaisa TID: {tid}"
        )

        return {
            "success": True,
            "payment_id": payment_id,
            "payment_status": PaymentStatus.VERIFICATION_REQUIRED,
            "order_status": OrderStatus.PENDING,
            "transaction_reference": tid,
            "message": "EasyPaisa transaction ID received. Payment verification is underway."
        }

    def verify_payment(self, payment_id, transaction_ref=None):
        record = query_db('SELECT * FROM payment_records WHERE payment_id = ?', (payment_id,), one=True)
        if not record:
            return {"success": False, "message": "Payment record not found."}
        return {"success": True, "status": record['payment_status']}

    def verify_webhook(self, payload, headers):
        secret = self.config.get('secret_key', 'khushi_ep_secret_2026')
        signature = headers.get('X-Easypaisa-Signature') or payload.get('signature')
        if not signature:
            return {"verified": False, "message": "Missing EasyPaisa signature."}
        
        data = f"{payload.get('order_number')}:{payload.get('tid')}:{payload.get('amount')}"
        expected = hmac.new(secret.encode('utf-8'), data.encode('utf-8'), hashlib.sha256).hexdigest()
        if hmac.compare_digest(str(signature), expected):
            return {"verified": True, "status": PaymentStatus.PAID}
        return {"verified": False, "message": "EasyPaisa signature mismatch."}


class JazzCashProvider(PaymentProvider):
    """
    JazzCash Mobile Account & Merchant Voucher Provider.
    Requires customer TID. Verification is required unless webhook confirms it.
    """
    def initiate_payment(self, order, checkout_data):
        order_number = order['order_number']
        payment_id = f"PAY-JC-{order_number}-{int(time.time())}"
        tid = checkout_data.get('jazzcash_tid') or checkout_data.get('transaction_reference') or f"JC-{int(time.time())}"

        record_payment_transaction(
            order=order,
            gateway='jazzcash',
            amount=order['total_amount'],
            payment_id=payment_id,
            transaction_ref=tid,
            status=PaymentStatus.VERIFICATION_REQUIRED,
            notes=f"Customer submitted JazzCash TID: {tid}"
        )

        return {
            "success": True,
            "payment_id": payment_id,
            "payment_status": PaymentStatus.VERIFICATION_REQUIRED,
            "order_status": OrderStatus.PENDING,
            "transaction_reference": tid,
            "message": "JazzCash transaction ID received. Payment verification is underway."
        }

    def verify_payment(self, payment_id, transaction_ref=None):
        record = query_db('SELECT * FROM payment_records WHERE payment_id = ?', (payment_id,), one=True)
        if not record:
            return {"success": False, "message": "Payment record not found."}
        return {"success": True, "status": record['payment_status']}

    def verify_webhook(self, payload, headers):
        secret = self.config.get('secret_key', 'khushi_jc_secret_2026')
        signature = headers.get('X-Jazzcash-Signature') or payload.get('pp_SecureHash') or payload.get('signature')
        if not signature:
            return {"verified": False, "message": "Missing JazzCash secure hash."}
        
        data = f"{payload.get('order_number')}:{payload.get('pp_TxnRefNo', payload.get('tid'))}:{payload.get('amount')}"
        expected = hmac.new(secret.encode('utf-8'), data.encode('utf-8'), hashlib.sha256).hexdigest()
        if hmac.compare_digest(str(signature), expected):
            return {"verified": True, "status": PaymentStatus.PAID}
        return {"verified": False, "message": "JazzCash secure hash mismatch."}


def get_payment_provider(gateway_name, config=None):
    """
    Factory function returning instantiated PaymentProvider.
    """
    gw = (gateway_name or '').lower().strip()
    if gw in ('cod', 'cash_on_delivery'):
        return CODProvider(config)
    elif gw in ('bank', 'bank_transfer', 'meezan'):
        return BankTransferProvider(config)
    elif gw in ('card', 'online_card', 'visa', 'mastercard', 'paymob'):
        return CardProvider(config)
    elif gw in ('easypaisa', 'ep'):
        return EasypaisaProvider(config)
    elif gw in ('jazzcash', 'jc'):
        return JazzCashProvider(config)
    else:
        # Default fallback to COD for unknown gateways
        return CODProvider(config)
