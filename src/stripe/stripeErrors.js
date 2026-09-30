/*
 * Stripe rejects a vendor transfer for a handful of reasons that all look like
 * raw API text in the payouts table. These are the ones that actually happen on
 * a marketplace, translated into something an admin can act on, with the
 * original Stripe message kept at the end for reference.
 *
 * Classification is on Stripe's own fields (error.code, error.param) wherever
 * Stripe provides one; the currency mismatch has no code, only a param, so it
 * falls back to a message shape match.
 */

const MAX_REASON_LENGTH = 500;

const truncate = (text) =>
  text.length > MAX_REASON_LENGTH
    ? `${text.slice(0, MAX_REASON_LENGTH - 3)}...`
    : text;

const listCurrencies = (text) =>
  (text.match(/\(([a-z]{3})\)/g) || [])
    .map((c) => c.slice(1, -1).toUpperCase())
    .filter((c, i, all) => all.indexOf(c) === i);

export const describeStripeTransferFailure = (error) => {
  const stripeMessage = error?.message || "Unknown Stripe error";
  const code = error?.code;
  const param = error?.param;

  // The charge settled in one currency and the payout is denominated in
  // another. Not fixable in code — the platform balance has to hold the
  // payout currency.
  if (
    param === "source_transaction" &&
    /must be the same as the transfer currency/i.test(stripeMessage)
  ) {
    const [settled, payout] = listCurrencies(stripeMessage);
    return truncate(
      `Transfer blocked: payout is denominated in ${payout} but the charge settled in ${settled}. ` +
        `The platform Stripe account cannot hold ${payout}, so add ${payout} under ` +
        `Settings > Payments > Settlement currencies, then retry this payout. ` +
        `Stripe: ${stripeMessage}`,
    );
  }

  if (code === "balance_insufficient") {
    return truncate(
      `Platform balance has no available funds to cover this transfer. ` +
        `Wait for the charge to settle, or add funds to the platform balance, then retry. ` +
        `Stripe: ${stripeMessage}`,
    );
  }

  if (code === "resource_missing" && param === "destination") {
    return truncate(
      `Vendor connected account cannot receive transfers — it may be restricted, ` +
        `not fully onboarded, or the wrong account id. Re-onboard the vendor in Stripe, ` +
        `then retry. Stripe: ${stripeMessage}`,
    );
  }

  if (param === "amount" && /amount/i.test(stripeMessage)) {
    return truncate(
      `Transfer amount was rejected by Stripe. Check the payout amount for this row. ` +
        `Stripe: ${stripeMessage}`,
    );
  }

  return truncate(stripeMessage);
};
