import {
  CreditCard,
  Headphones,
  LifeBuoy,
  Package,
  RefreshCcw,
  Search,
  User,
} from "lucide-react";
import InfoPage from "../../components/common/InfoPage";

const SECTIONS = [
  {
    id: "getting-started",
    title: "Getting Started",
    icon: Search,
    intro:
      "New to ShopEase? Everything you need to place your first order and keep track of it afterwards.",
    items: [
      {
        title: "Place your first order",
        body: "Add items to your cart, choose a delivery address, and pay once at checkout. If your cart contains products from several sellers, a single payment covers all of them.",
      },
      {
        title: "Track your order",
        body: "Open My Orders from your profile to see live status — placed, confirmed, shipped and delivered — along with the courier tracking link.",
      },
      {
        title: "Save items for later",
        body: "Tap the heart icon on any product to add it to your wishlist. Your wishlist stays synced to your account across devices.",
      },
    ],
  },
  {
    id: "account",
    title: "Account & Login",
    icon: User,
    items: [
      {
        title: "Forgot your password",
        body: "On the login page choose 'Forgot Password', verify the OTP we email you, and set a new password in under a minute.",
      },
      {
        title: "Update your details",
        body: "Name, email and phone number can be changed from Profile → Settings. Address book entries can be added, edited or deleted at any time.",
      },
      {
        title: "Delete your account",
        body: "You can request deletion from Profile → Settings. Any pending orders must be completed first, after which your data is removed within 7 working days.",
      },
    ],
  },
  {
    id: "payments",
    title: "Payments & Refunds",
    icon: CreditCard,
    items: [
      {
        title: "Accepted methods",
        body: "All major debit and credit cards, UPI, net banking and mobile wallets are supported. Card details are tokenised by our payment provider and never stored on our servers.",
      },
      {
        title: "Payment is final once confirmed",
        body: "As soon as your payment is approved, your order is confirmed. Even if a seller payout is still being processed in the background, your order stays confirmed and your delivery schedule is unaffected.",
      },
      {
        title: "Refund timelines",
        body: "Refunds are initiated within 24 hours of approval and usually reflect on your statement within 3–7 business days, depending on your bank.",
      },
    ],
    note: "If a payment is debited but your order is not confirmed, contact support with your transaction ID — duplicate debits are auto-reversed within 5–7 business days.",
  },
  {
    id: "orders",
    title: "Orders & Cancellations",
    icon: Package,
    items: [
      {
        title: "Change your address",
        body: "You can edit the delivery address any time before the order is shipped. Once it is out for delivery, changes are no longer possible.",
      },
      {
        title: "Cancel an order",
        body: "Orders can be cancelled from My Orders while the status is 'Placed' or 'Confirmed'. A full refund is issued to the original payment method.",
      },
      {
        title: "Items sold by independent sellers",
        body: "Some products are sold by third-party sellers. Their return windows and stock are managed by the seller, but ShopEase support mediates any dispute.",
      },
    ],
  },
  {
    id: "returns",
    title: "Returns & Replacements",
    icon: RefreshCcw,
    items: [
      {
        title: "Start a return",
        body: "Eligible items can be returned within 7 days of delivery from My Orders → the order → 'Request Return'. Our courier arranges a free reverse pickup.",
      },
      {
        title: "Replacements",
        body: "For damaged or incorrect items we arrange a replacement instead of a refund. The replacement is dispatched as soon as the pickup is verified.",
      },
    ],
  },
  {
    id: "support",
    title: "Contacting Support",
    icon: Headphones,
    items: [
      {
        title: "Call us",
        body: "+91 98765 43210, available Monday to Sunday between 9AM and 11PM IST.",
      },
      {
        title: "Email us",
        body: "Write to support@shopease.com. We reply to every mail within 24 hours, usually much sooner.",
      },
      {
        title: "Live chat",
        body: "Use the chat option on the Contact page for the quickest response during business hours.",
      },
    ],
  },
];

function HelpCenter() {
  return (
    <InfoPage
      badge="Help Center"
      icon={LifeBuoy}
      title="How can we help?"
      subtitle="Guides and answers for the most common things — your account, payments, orders, delivery and returns."
      sections={SECTIONS}
      ctaTitle="Still stuck?"
      ctaText="Our support team is available 24/7 to answer any question you have about your orders, payments, or returns."
    />
  );
}

export default HelpCenter;
