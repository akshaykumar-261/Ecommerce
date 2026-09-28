import {
  Cookie,
  Database,
  Lock,
  Share2,
  ShieldCheck,
  ShoppingBag,
  UserCog,
} from "lucide-react";
import InfoPage from "../../components/common/InfoPage";

const SECTIONS = [
  {
    id: "what-we-collect",
    title: "What We Collect",
    icon: Database,
    intro:
      "We collect only what is needed to run a marketplace: your account details, your orders, and the basics of how you use the site.",
    items: [
      {
        title: "Account information",
        body: "Your name, email address, phone number and the addresses saved in your address book. We also keep your password in a hashed form — we can never read it.",
      },
      {
        title: "Order and payment records",
        body: "What you bought, from which seller, where it was shipped and the amount paid. Card numbers are never stored on our servers; they are tokenised by our payment provider.",
      },
      {
        title: "Usage information",
        body: "Pages you visit, searches you run and your approximate location, so we can improve search results and show relevant products.",
      },
    ],
  },
  {
    id: "how-we-use",
    title: "How We Use Your Data",
    icon: ShoppingBag,
    items: [
      {
        title: "To fulfil your orders",
        body: "Your address is shared with the seller and courier only for the purpose of delivering that specific order.",
      },
      {
        title: "To keep your account secure",
        body: "Login activity and device information are used to detect suspicious access and to let you know if your account is used from a new device.",
      },
      {
        title: "To improve the marketplace",
        body: "Aggregated, non-identifiable data helps sellers understand demand and helps us fix issues in checkout and delivery.",
      },
    ],
  },
  {
    id: "sharing",
    title: "Who We Share It With",
    icon: Share2,
    items: [
      {
        title: "Sellers and couriers",
        body: "Only the details needed to ship your order: name, delivery address and phone number. Sellers do not receive your email or payment details.",
      },
      {
        title: "Service providers",
        body: "Payment processing, email delivery, cloud hosting and analytics partners, each bound by contract to protect your data.",
      },
      {
        title: "Authorities, where required",
        body: "We disclose information only when required by valid Indian law, a court order, or to protect the safety of our users.",
      },
    ],
    note: "We never sell your personal information to anyone, for any purpose.",
  },
  {
    id: "cookies",
    title: "Cookies & Local Storage",
    icon: Cookie,
    items: [
      {
        title: "Essential cookies",
        body: "These keep you signed in and remember your cart. They are required for the site to work and cannot be switched off.",
      },
      {
        title: "Preference cookies",
        body: "These remember things like your last viewed category so the site feels familiar when you return.",
      },
      {
        title: "Analytics cookies",
        body: "These tell us which pages are useful. You can opt out of these without losing any functionality.",
      },
    ],
  },
  {
    id: "security",
    title: "How We Protect Your Data",
    icon: ShieldCheck,
    items: [
      {
        title: "Encrypted in transit",
        body: "All traffic is protected with TLS, so nothing you type can be read in between.",
      },
      {
        title: "Encrypted payments",
        body: "Card details go straight to our PCI-DSS compliant payment provider. Your card number never touches our servers.",
      },
      {
        title: "Access on a need-to-know basis",
        body: "Only the team members who need your data to do their job can access it, and every access is logged.",
      },
    ],
  },
  {
    id: "your-rights",
    title: "Your Rights & Controls",
    icon: UserCog,
    items: [
      {
        title: "See and correct your data",
        body: "You can review and update your profile, addresses and saved details at any time from Profile → Settings.",
      },
      {
        title: "Download your data",
        body: "Write to us and we will provide a copy of the personal data and order history we hold about you.",
      },
      {
        title: "Delete your account",
        body: "You can request deletion from Profile → Settings. Any pending orders must be completed first, after which your data is removed within 7 working days.",
      },
      {
        title: "Withdraw consent",
        body: "You can stop receiving promotional messages at any time using the unsubscribe link in any email, or by contacting support.",
      },
    ],
  },
  {
    id: "contact",
    title: "Privacy Questions",
    icon: Lock,
    items: [
      {
        title: "Write to us",
        body: "Email support@shopease.com with 'Privacy' in the subject line and we will respond within 24 hours.",
      },
      {
        title: "Call us",
        body: "+91 98765 43210, Monday to Sunday, 9AM to 11PM IST.",
      },
    ],
  },
];

function PrivacyPolicy() {
  return (
    <InfoPage
      badge="Privacy Policy"
      icon={Lock}
      title="Your Privacy Matters"
      subtitle="What data we collect, why we need it, who we share it with, and the controls you have over it."
      sections={SECTIONS}
      ctaTitle="Have a privacy question?"
      ctaText="Our support team can walk you through anything on this page, or help you exercise any of your rights."
    />
  );
}

export default PrivacyPolicy;
