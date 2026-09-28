import {
  Ban,
  ClipboardCheck,
  CreditCard,
  PackageOpen,
  RefreshCcw,
  Truck,
} from "lucide-react";
import InfoPage from "../../components/common/InfoPage";

const SECTIONS = [
  {
    id: "window",
    title: "Return Window",
    icon: RefreshCcw,
    intro:
      "Eligible items can be returned within 7 days of delivery. The window starts from the day your order is marked delivered in your account.",
    items: [
      {
        title: "7 days to raise a request",
        body: "Raise it from My Orders → the order → 'Request Return'. Requests made after 7 days cannot be accepted, except for items that are defective on arrival.",
      },
      {
        title: "Items must be resaleable",
        body: "Products should be unused, unwashed, in their original packaging with all tags, accessories and manuals intact.",
      },
    ],
  },
  {
    id: "how-to",
    title: "How To Return",
    icon: ClipboardCheck,
    items: [
      {
        title: "1. Open your order",
        body: "Go to Profile → My Orders, select the order and choose 'Request Return' within the return window.",
      },
      {
        title: "2. Pick a reason",
        body: "Tell us why you are returning the item and upload a photo if it helps us process it faster.",
      },
      {
        title: "3. Hand over the parcel",
        body: "Our courier arranges a free reverse pickup from your address. You can also drop the parcel at any supported pickup point.",
      },
      {
        title: "4. Verification and refund",
        body: "Returns are verified within 2 days of pickup. Once approved, the refund is issued to your original payment method.",
      },
    ],
  },
  {
    id: "refunds",
    title: "Refunds & Timelines",
    icon: CreditCard,
    items: [
      {
        title: "Approved within 24 hours",
        body: "After verification the refund is initiated to the same card, UPI ID or bank account you paid with.",
      },
      {
        title: "3–7 business days to reflect",
        body: "The time to appear on your statement depends on your bank, not on us. We share the refund reference with you by email.",
      },
      {
        title: "Shipping charges",
        body: "Shipping charges are refunded only when the return is caused by a damaged, defective or wrong item. For change-of-mind returns they are non-refundable.",
      },
    ],
  },
  {
    id: "replacement",
    title: "Replacements",
    icon: PackageOpen,
    items: [
      {
        title: "Defective or incorrect items",
        body: "We arrange a replacement instead of a refund. A fresh item is dispatched as soon as the reverse pickup is verified.",
      },
      {
        title: "Out of stock after your return",
        body: "If the replacement item is unavailable, the amount is refunded to your original payment method.",
      },
    ],
  },
  {
    id: "not-eligible",
    title: "Non-Returnable Items",
    icon: Ban,
    intro:
      "For hygiene and safety reasons, the following categories cannot be returned or exchanged:",
    items: [
      {
        title: "Perishables & personal care",
        body: "Opened food, supplements, cosmetics, and personal care items cannot be returned once the seal is broken.",
      },
      {
        title: "Innerwear & swimwear",
        body: "For hygiene reasons these items are returnable only in their original sealed packaging.",
      },
      {
        title: "Handmade & customised goods",
        body: "Made-to-order and personalised products are non-returnable unless they arrive damaged or faulty.",
      },
      {
        title: "Software & digital content",
        body: "Digital products and downloadable content are non-refundable once delivery has begun.",
      },
    ],
  },
  {
    id: "cancellations",
    title: "Cancellations",
    icon: Truck,
    items: [
      {
        title: "Before dispatch",
        body: "Cancel any order whose status is 'Placed' or 'Confirmed' from My Orders. The full amount is refunded to the original payment method.",
      },
      {
        title: "After dispatch",
        body: "Once an order is shipped it can no longer be cancelled. You can still return it after delivery as long as it is within the 7-day window.",
      },
    ],
  },
];

function Returns() {
  return (
    <InfoPage
      badge="Returns"
      icon={RefreshCcw}
      title="Returns & Refunds"
      subtitle="How the 7-day return window works, how refunds are processed, and which items can't be returned."
      sections={SECTIONS}
      ctaTitle="Need a return?"
      ctaText="Share your order number with our support team and we will guide you through the quickest return option."
    />
  );
}

export default Returns;
