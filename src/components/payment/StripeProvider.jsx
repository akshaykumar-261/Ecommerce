import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useMemo } from "react";

export function StripeProvider({ children }) {
  const stripePromise = useMemo(
    () => loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY),
    []
  );

  return <Elements stripe={stripePromise}>{children}</Elements>;
}