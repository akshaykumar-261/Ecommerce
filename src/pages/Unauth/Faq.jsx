import { useState } from "react";
import {
  HelpCircle,
  ChevronDown,
  MessageCircle,
  Truck,
  RefreshCcw,
  CreditCard,
  User,
  Search,
} from "lucide-react";
import Navbar from "../../components/common/Navbar";
import Footer from "../../components/common/Footer";
import { useNavigate } from "react-router-dom";

const CATEGORIES = [
  { key: "all", label: "All", icon: Search },
  { key: "orders", label: "Orders & Shipping", icon: Truck },
  { key: "returns", label: "Returns & Refunds", icon: RefreshCcw },
  { key: "payments", label: "Payments", icon: CreditCard },
  { key: "account", label: "Account", icon: User },
];

const FAQS = [
  {
    category: "orders",
    question: "How do I track my order?",
    answer:
      "Once your order is shipped, you'll receive an email and SMS with a tracking link. You can also track your order anytime from your Profile → My Orders section using your ShopEase account.",
  },
  {
    category: "orders",
    question: "How long does delivery take?",
    answer:
      "Standard delivery usually takes 3–7 working days depending on your location. Metro cities often get orders in 2–3 days. You'll always see an estimated delivery date at checkout.",
  },
  {
    category: "orders",
    question: "Can I change my delivery address after ordering?",
    answer:
      "Yes, as long as your order hasn't been shipped yet. Head to My Orders, open the order, and use the 'Change Address' option. Once an order is out for delivery, changes aren't possible.",
  },
  {
    category: "returns",
    question: "What is your return policy?",
    answer:
      "Eligible items can be returned within 7 days of delivery for a full refund. Products must be unused, in original packaging, with all tags attached. Some items like perishables and personal care are non-returnable.",
  },
  {
    category: "returns",
    question: "When will I get my refund?",
    answer:
      "Once your return is picked up and verified (usually within 2 days), refunds are initiated within 24 hours. Depending on your payment method, the amount may take 3–7 business days to reflect.",
  },
  {
    category: "returns",
    question: "How do I request a replacement?",
    answer:
      "If you received a damaged or incorrect product, request a replacement from My Orders. A reverse pickup will be scheduled, and a fresh item will be dispatched once the original is collected.",
  },
  {
    category: "payments",
    question: "Which payment methods do you accept?",
    answer:
      "We accept UPI, all major debit and credit cards, net banking, mobile wallets, and Cash on Delivery. You can also save multiple cards and wallets for a faster checkout.",
  },
  {
    category: "payments",
    question: "Is it safe to pay online on ShopEase?",
    answer:
      "Absolutely. All payments are processed through PCI-DSS compliant, encrypted gateways. We never store your card details on our servers.",
  },
  {
    category: "payments",
    question: "Why was my payment charged twice?",
    answer:
      "This occasionally happens due to network glitches. Don't worry — the duplicate charge is auto-reversed within 5–7 business days. If it persists, contact our support team with your transaction IDs.",
  },
  {
    category: "account",
    question: "How do I create a ShopEase account?",
    answer:
      "Tap 'Login' in the top bar and choose 'Create Account'. Register with your email or mobile number, verify your OTP, and you're ready to shop, track orders, and save your wishlist.",
  },
  {
    category: "account",
    question: "I forgot my password. How do I reset it?",
    answer:
      "On the Login page, tap 'Forgot Password'. Enter your registered email, verify the OTP we send, and set a new password. It takes less than a minute.",
  },
  {
    category: "account",
    question: "How do I delete my account?",
    answer:
      "You can request account deletion from Profile → Settings. Once verified, your account and personal data will be removed within 7 working days. Pending orders must be completed first.",
  },
];

function Faq() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("all");
  const [openIndex, setOpenIndex] = useState(0);

  const visibleFaqs =
    activeCategory === "all"
      ? FAQS
      : FAQS.filter((f) => f.category === activeCategory);

  return (
    <div className="min-h-screen bg-[#f8f9fc]">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#4c2ed8] via-[#3f3ad8] to-[#368de8]">
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="relative mx-auto max-w-5xl px-4 py-20 text-center lg:px-8">
          <span className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-white backdrop-blur-sm">
            <HelpCircle size={14} />
            FAQs
          </span>
          <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
            How can we help you?
          </h1>
          <p className="mx-auto max-w-2xl text-base leading-relaxed text-white/90">
            Browse the most common questions about orders, shipping, returns,
            payments, and your account.
          </p>
        </div>
      </section>

      {/* Category Tabs */}
      <section className="relative z-10 mx-auto -mt-8 max-w-4xl px-4 lg:px-8">
        <div className="flex flex-wrap items-center justify-center gap-2 rounded-2xl bg-white p-3 shadow-lg shadow-gray-200/50">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const active = activeCategory === cat.key;
            return (
              <button
                key={cat.key}
                onClick={() => {
                  setActiveCategory(cat.key);
                  setOpenIndex(0);
                }}
                className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-200 ${
                  active
                    ? "bg-gradient-to-r from-[#4c2ed8] to-[#365fe0] text-white shadow-lg shadow-[#4c2ed8]/25"
                    : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                }`}
              >
                <Icon size={15} />
                {cat.label}
              </button>
            );
          })}
        </div>
      </section>

      {/* FAQ List */}
      <section className="mx-auto max-w-4xl px-4 py-12 lg:px-8">
        <div className="space-y-3">
          {visibleFaqs.map((faq, i) => {
            const open = openIndex === i;
            return (
              <div
                key={faq.question}
                className={`overflow-hidden rounded-2xl border bg-white transition-all duration-300 ${
                  open
                    ? "border-[#4c2ed8]/25 shadow-lg shadow-[#4c2ed8]/5"
                    : "border-gray-100 shadow-sm"
                }`}
              >
                <button
                  onClick={() => setOpenIndex(open ? -1 : i)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left sm:px-6"
                >
                  <span className="text-sm font-semibold text-gray-800 sm:text-base">
                    {faq.question}
                  </span>
                  <ChevronDown
                    size={20}
                    className={`shrink-0 text-[#4c2ed8] transition-transform duration-300 ${
                      open ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <div
                  className={`grid transition-all duration-300 ${
                    open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="px-5 pb-5 text-sm leading-relaxed text-gray-500 sm:px-6">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Still have questions */}
      <section className="mx-auto max-w-4xl px-4 pb-16 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#4c2ed8] via-[#3f3ad8] to-[#368de8] p-10 text-center shadow-xl shadow-[#4c2ed8]/20 sm:p-12">
          <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
          <div className="relative mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15">
            <MessageCircle size={26} className="text-white" />
          </div>
          <h2 className="relative mb-3 text-2xl font-bold text-white sm:text-3xl">
            Still have questions?
          </h2>
          <p className="relative mx-auto mb-8 max-w-lg text-sm leading-relaxed text-white/90">
            Our support team is available 24/7 to answer any question you
            have about your orders, payments, or returns.
          </p>
          <div className="relative flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => navigate("/contact")}
              className="rounded-xl bg-white px-6 py-3 text-sm font-semibold text-[#4c2ed8] shadow-xl transition hover:bg-gray-100"
            >
              Contact Support
            </button>
            <button
              onClick={() => navigate("/home")}
              className="rounded-xl border border-white/40 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Back to Home
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Faq;