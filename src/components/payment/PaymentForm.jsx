import { useState, useEffect } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import toast from "react-hot-toast";

export function PaymentForm({ paymentIntentId, onSuccess, onError }) {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [stripeReady, setStripeReady] = useState(false);
  const [stripeError, setStripeError] = useState(null);

  useEffect(() => {
    if (stripe) {
      setStripeReady(true);
    }
  }, [stripe]);

  useEffect(() => {
    if (!import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY === "pk_test_your_stripe_publishable_key_here") {
      setStripeError("Stripe publishable key not configured");
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setProcessing(true);

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: elements.getElement(CardElement),
    });

    if (error) {
      toast.error(error.message || "Invalid card details");
      setProcessing(false);
      return;
    }

    try {
      await onSuccess(paymentMethod.id);
    } catch (err) {
      toast.error(err.response?.data?.message || "Payment failed");
      onError?.(err);
    } finally {
      setProcessing(false);
    }
  };

  if (stripeError) {
    return (
      <div className="p-4 text-center text-red-500">
        <p>{stripeError}</p>
        <p className="text-xs mt-2">Add VITE_STRIPE_PUBLISHABLE_KEY to .env file</p>
      </div>
    );
  }

  if (!stripeReady) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="h-8 w-8 animate-spin rounded-full border-3 border-[#4c2ed8] border-t-transparent" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: "16px",
                color: "#1f2937",
                fontFamily: "system-ui, sans-serif",
                "::placeholder": { color: "#9ca3af" },
              },
              invalid: { color: "#ef4444" },
            },
          }}
        />
      </div>

      <button
        type="submit"
        disabled={processing}
        className="w-full rounded-xl bg-gradient-to-r from-[#4c2ed8] to-[#368de8] px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#4c2ed8]/25 transition hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
      >
        {processing ? (
          <>
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent mr-2" />
            Processing...
          </>
        ) : (
          "Pay Now"
        )}
      </button>
    </form>
  );
}