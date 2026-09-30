import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

/*
 * The currency the platform charges in, and therefore the currency every
 * vendor payout is denominated in.
 *
 * It has to be a currency the platform Stripe account can actually settle in:
 * Stripe converts a charge into the account's settlement currency, and a
 * transfer can only be drawn from a balance held in that same currency. So if
 * this is set to a currency the account cannot hold, every PaymentIntent
 * succeeds and every vendor transfer fails with a currency mismatch.
 *
 * Defaults to inr. Set STRIPE_CURRENCY=aud to exercise the payout flow against
 * an AUD-settling account.
 */
export const CURRENCY = (process.env.STRIPE_CURRENCY || "inr").toLowerCase();

export default stripe;
