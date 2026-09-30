import stripe from "../../config/stripe.js";
import OrderService from "../order/orderService.js";
import { PAYMENT_RECORD_STATUS, PAYOUT_STATUS } from "../helper/constants.js";
import { describeStripeTransferFailure } from "./stripeErrors.js";

/*
 * Stripe Connect — separate charges and transfers.
 *
 *   customer -> ONE PaymentIntent on the platform account -> webhook
 *            -> one Transfer per vendor for that vendor's share
 *
 * The webhook is the only place a vendor payout becomes "paid", because that
 * is the moment Stripe actually moves the money. A transfer only succeeds if the
 * platform balance covers it, so a failure here is recorded per vendor and
 * left retryable rather than failing the whole event.
 */
export default class StripeWebhookController {
  async init(db) {
    this.services = new OrderService();
    await this.services.init(db);
  }

  async handleWebhook(req, res) {
    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        req.headers["stripe-signature"],
        process.env.STRIPE_WEBHOOK_SECRET,
      );
    } catch (err) {
      console.error("Webhook signature verification failed:", err.message);

      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    try {
      switch (event.type) {
        // ---------------------------------------------
        // PAYMENT SUCCESS
        // ---------------------------------------------
        case "payment_intent.succeeded":
          await this.onPaymentSucceeded(event.data.object);
          break;

        // ---------------------------------------------
        // PAYMENT FAILED
        // ---------------------------------------------
        case "payment_intent.payment_failed":
          await this.onPaymentFailed(event.data.object);
          break;

        default:
          break;
      }

      return res.json({ received: true });
    } catch (error) {
      console.error("Stripe webhook error:", error);

      // 500 makes Stripe retry, which is what we want for a transient failure.
      return res.status(500).json({
        received: false,
        error: error.message,
      });
    }
  }

  async onPaymentSucceeded(paymentIntent) {
    const orderId = paymentIntent.metadata?.order_id;

    if (!orderId) {
      console.warn("payment_intent.succeeded without order_id metadata");
      return;
    }

    const payment = await this.services.getPaymentByTransactionId(
      paymentIntent.id,
    );

    if (!payment) {
      console.error("Payment record not found:", paymentIntent.id);
      return;
    }

    await this.services.updatePayment(payment.id, {
      status: PAYMENT_RECORD_STATUS.SUCCESS,
    });

    // The shopper may close the tab before confirmPayment runs, so the order is
    // finalized here too. finalizePaidOrder is idempotent.
    await this.services.finalizePaidOrder(
      orderId,
      paymentIntent.metadata.user_id,
    );

    const payouts = await this.services.getVendorPayoutsByOrderId(orderId);

    for (const payout of payouts) {
      // Stripe redelivers events, so an already-transferred payout is skipped.
      if (payout.payout_status === PAYOUT_STATUS.PAID && payout.transfer_id) {
        continue;
      }

      try {
        const transfer = await stripe.transfers.create(
          {
            amount: Math.round(Number(payout.vendor_amount) * 100),
            // The charge's currency is authoritative: with source_transaction
            // set, Stripe requires the transfer currency to match the balance
            // transaction the charge settled into.
            currency: paymentIntent.currency || payout.currency,
            destination: payout.stripe_account_id,
            transfer_group: paymentIntent.transfer_group,
            // Ties the transfer to the charge it came from so the money is
            // pulled from that balance rather than the platform's float.
            source_transaction: paymentIntent.latest_charge,
            description: `Vendor payout for Order #${orderId}`,
            metadata: {
              order_id: String(orderId),
              payment_id: String(payment.id),
              vendor_id: String(payout.vendor_id),
            },
          },
          {
            // Keyed per payout so a Stripe retry cannot double-pay a vendor.
            idempotencyKey: `${paymentIntent.id}-${payout.vendor_id}`,
          },
        );

        await this.services.updateVendorPayoutById(payout.id, {
          transfer_id: transfer.id,
          payout_status: PAYOUT_STATUS.PAID,
          failure_reason: null,
        });
      } catch (error) {
        // Typically an account-level problem (see describeStripeTransferFailure)
        // rather than bad data, so the row keeps its transfer_id empty and stays
        // retryable once it is resolved.
        const reason = describeStripeTransferFailure(error);
        await this.services.updateVendorPayoutById(payout.id, {
          payout_status: PAYOUT_STATUS.FAILED,
          failure_reason: reason,
        });
        console.error(
          `Vendor transfer failed for payout ${payout.id}:`,
          reason,
        );
      }
    }
  }

  async onPaymentFailed(paymentIntent) {
    const payment = await this.services.getPaymentByTransactionId(
      paymentIntent.id,
    );

    if (payment) {
      await this.services.updatePayment(payment.id, {
        status: PAYMENT_RECORD_STATUS.FAILED,
      });
    }
  }
}
