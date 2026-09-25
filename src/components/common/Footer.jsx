import {
  ArrowRight,
  Headphones,
  LockKeyhole,
  Mail,
  MessageCircle,
  Phone,
  ShieldCheck,
  Truck,
  Zap,
} from "lucide-react";
import { Link } from "react-router-dom";

const LINK_COLUMNS = [
  {
    title: "Quick Links",
    links: [
      { label: "About Us", to: "/about" },
      { label: "Contact", to: "/contact" },
      { label: "FAQs", to: "/faq" },
      { label: "Blog", to: "/blog" },
    ],
  },
  {
    title: "Categories",
    links: [
      { label: "Electronics", to: "/products/electronics" },
      { label: "Fashion", to: "/products/fashion" },
      { label: "Home & Kitchen", to: "/home" },
      { label: "Sports", to: "/home" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Help Center", to: "/faq" },
      { label: "Shipping Info", to: "/contact" },
      { label: "Returns", to: "/faq" },
      { label: "Privacy Policy", to: "/about" },
    ],
  },
];

const SERVICE_HIGHLIGHTS = [
  { label: "Fast & Reliable Shipping", Icon: Truck },
  { label: "Secure Payments", Icon: ShieldCheck },
  { label: "24/7 Support", Icon: Headphones },
];

const PAYMENT_METHODS = ["VISA", "Mastercard", "RuPay", "UPI", "PayPal"];

const SOCIAL_LINKS = [
  { label: "Facebook", href: "https://www.facebook.com/" },
  { label: "Instagram", href: "https://www.instagram.com/" },
  { label: "X", href: "https://x.com/" },
  { label: "YouTube", href: "https://www.youtube.com/" },
  { label: "LinkedIn", href: "https://www.linkedin.com/" },
];

function SocialIcon({ label }) {
  if (label === "Facebook") {
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
        <path d="M14 8.5V7c0-.8.2-1.2 1.5-1.2H17V2.1A19 19 0 0 0 14.6 2C11.5 2 10 3.6 10 6.4v2.1H7V13h3v9h4v-9h3.2l.5-4.5H14Z" />
      </svg>
    );
  }

  if (label === "Instagram") {
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
      </svg>
    );
  }

  if (label === "X") {
    return (
      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor" aria-hidden="true">
        <path d="M18.9 2H22l-6.8 7.8L23.2 22H17l-4.9-6.4L6.5 22H3.3l7.2-8.3L2.7 2h6.3l4.4 5.8L18.9 2Zm-1.1 18h1.7L7.1 3.9H5.3L17.8 20Z" />
      </svg>
    );
  }

  if (label === "YouTube") {
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
        <path d="M21.6 7.2a2.8 2.8 0 0 0-2-2C17.9 4.7 12 4.7 12 4.7s-5.9 0-7.6.5a2.8 2.8 0 0 0-2 2A29 29 0 0 0 2 12a29 29 0 0 0 .4 4.8 2.8 2.8 0 0 0 2 2c1.7.5 7.6.5 7.6.5s5.9 0 7.6-.5a2.8 2.8 0 0 0 2-2A29 29 0 0 0 22 12a29 29 0 0 0-.4-4.8ZM10 15.2V8.8l5.5 3.2-5.5 3.2Z" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
      <path d="M5.3 7.8A2.3 2.3 0 1 0 5.3 3a2.3 2.3 0 0 0 0 4.8ZM3.4 9.4h3.8V21H3.4V9.4ZM9.1 9.4h3.6V11h.1c.5-1 1.8-2 3.6-2 3.9 0 4.6 2.5 4.6 5.8V21h-3.8v-5.4c0-1.3 0-3-1.8-3s-2.1 1.4-2.1 2.9V21H9.1V9.4Z" />
    </svg>
  );
}

function Footer() {
  return (
    <footer className="relative isolate overflow-hidden border-t border-[#eeeafd] bg-[linear-gradient(180deg,#ffffff_0%,#fdfcff_58%,#faf9ff_100%)] font-sans text-[#10152f]">
      <div className="pointer-events-none absolute -right-24 -top-28 -z-10 h-80 w-80 rounded-full bg-[#e9e4ff]/45 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-28 -left-24 -z-10 h-72 w-72 rounded-full bg-[#f1eaff]/70 blur-3xl" />

      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid items-start gap-y-12 lg:grid-cols-[minmax(230px,0.9fr)_minmax(480px,1.8fr)_minmax(240px,0.9fr)]">
          <div>
            <Link
              to="/home"
              className="group inline-flex items-center gap-3"
              aria-label="ShopEase home"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#4f46e5] to-[#7c3aed] shadow-[0_8px_20px_rgba(79,70,229,0.22)] transition-transform duration-300 group-hover:-rotate-3 group-hover:scale-105">
                <Zap size={21} className="fill-white text-white" />
              </span>
              <span className="text-[1.35rem] font-extrabold tracking-tight text-[#111735]">
                Shop<span className="text-[#4f46e5]">Ease</span>
              </span>
            </Link>

            <p className="mt-5 max-w-sm text-sm leading-7 text-[#66708f]">
              <span className="block whitespace-nowrap">
                Your one-stop destination for
              </span>
              <span className="block whitespace-nowrap">
                the best products at unbeatable
              </span>
              <span className="block whitespace-nowrap">
                prices. Shop with confidence.
              </span>
            </p>

            <ul className="mt-5 space-y-2.5">
              {SERVICE_HIGHLIGHTS.map(({ label, Icon }) => (
                <li
                  key={label}
                  className="flex items-center gap-3 text-[13px] font-medium text-[#46506f]"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#f1efff] text-[#5b52d8]">
                    <Icon size={15} strokeWidth={2.2} />
                  </span>
                  {label}
                </li>
              ))}
            </ul>

            <form
              className="mt-6 rounded-[1.4rem] border border-[#e8e3ff] bg-gradient-to-br from-[#f8f6ff] to-[#f1efff] p-4 shadow-[0_10px_30px_rgba(88,72,190,0.06)]"
              onSubmit={(event) => event.preventDefault()}
            >
              <div className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-[#5b52d8] shadow-sm">
                  <Mail size={18} />
                </span>
                <div>
                  <h3 className="text-sm font-bold text-[#171c3b]">
                    Join Our Newsletter
                  </h3>
                  <p className="mt-1 text-xs leading-5 text-[#69718c]">
                    Get the latest updates, deals and offers directly to your
                    inbox.
                  </p>
                </div>
              </div>
              <label htmlFor="footer-email" className="sr-only">
                Email address
              </label>
              <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                <input
                  id="footer-email"
                  type="email"
                  required
                  placeholder="Enter your email address"
                  className="min-w-0 flex-1 rounded-xl border border-[#e2ddf7] bg-white px-3.5 py-2.5 text-xs text-[#171c3b] outline-none transition placeholder:text-[#9aa1b7] focus:border-[#8b83e6] focus:ring-2 focus:ring-[#8b83e6]/15"
                />
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#4f46e5] px-4 py-2.5 text-xs font-semibold text-white shadow-[0_7px_16px_rgba(79,70,229,0.2)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#4338ca] hover:shadow-[0_9px_20px_rgba(79,70,229,0.28)] focus:outline-none focus:ring-2 focus:ring-[#4f46e5]/40"
                >
                  Subscribe
                  <ArrowRight size={14} />
                </button>
              </div>
            </form>
          </div>

          <nav
            aria-label="Footer navigation"
            className="grid border-t border-[#ece9f8] pt-10 md:col-span-2 md:grid-cols-3 md:border-t-0 md:pt-0 lg:col-span-1"
          >
            {LINK_COLUMNS.map((column) => (
              <div key={column.title} className="py-7 text-center md:px-4 lg:py-1">
                <h2 className="text-sm font-bold text-[#171c3b]">
                  {column.title}
                </h2>
                <span className="mx-auto mt-2.5 block h-1 w-7 rounded-full bg-[#6d63e8]" />
                <ul className="mt-5 space-y-1.5">
                  {column.links.map((link) => (
                    <li key={link.label} className="flex justify-center">
                      <Link
                        to={link.to}
                        className="relative inline-block px-1 py-1.5 text-sm text-[#66708f] transition-colors duration-200 after:absolute after:bottom-0 after:left-1/2 after:h-px after:w-0 after:-translate-x-1/2 after:bg-[#4f46e5] after:transition-all after:duration-200 hover:text-[#4f46e5] hover:after:w-full focus:outline-none focus:text-[#4f46e5]"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>

          <aside className="rounded-[1.4rem] border border-[#e8e3ff] bg-gradient-to-br from-[#f8f6ff] to-[#f1efff] p-4 shadow-[0_10px_30px_rgba(88,72,190,0.06)] sm:p-5 lg:p-4 xl:p-5">
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-[#5b52d8] shadow-sm">
                <Headphones size={18} />
              </span>
              <div>
                <h2 className="text-sm font-bold text-[#171c3b]">
                  Need Help?
                </h2>
                <p className="mt-1 text-xs leading-5 text-[#69718c]">
                  Our support team is available 24/7 to assist you.
                </p>
              </div>
            </div>
            <Link
              to="/contact"
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#4f46e5] to-[#7c3aed] px-4 py-3 text-sm font-semibold text-white shadow-[0_9px_20px_rgba(79,70,229,0.22)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_25px_rgba(79,70,229,0.3)] focus:outline-none focus:ring-2 focus:ring-[#4f46e5]/40"
            >
              <MessageCircle size={17} />
              Contact Us
            </Link>

            <div className="my-5 h-px bg-[#e6e1f6]" />

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <span className="mt-0.5 text-[#6259dc]">
                  <Phone size={17} />
                </span>
                <div>
                  <a
                    href="tel:+919876543210"
                    className="text-sm font-semibold text-[#303754] transition hover:text-[#4f46e5]"
                  >
                    +91 98765 43210
                  </a>
                  <p className="mt-0.5 text-[11px] text-[#8a91a7]">
                    Mon - Sun, 9AM - 11PM
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="mt-0.5 text-[#6259dc]">
                  <Mail size={17} />
                </span>
                <div className="min-w-0">
                  <a
                    href="mailto:support@shopease.com"
                    className="block break-all text-sm font-semibold text-[#303754] transition hover:text-[#4f46e5]"
                  >
                    support@shopease.com
                  </a>
                  <p className="mt-0.5 text-[11px] text-[#8a91a7]">
                    We reply within 24 hours
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>

        <div className="mt-12 border-t border-[#eae7f6] pt-7">
          <div className="grid items-center gap-6 xl:grid-cols-[1fr_auto_1fr]">
            <p className="order-1 text-xs text-[#7b839d]">
              &copy; 2026 ShopEase. All rights reserved.
            </p>

            <div className="order-3 flex flex-wrap items-center justify-center gap-2.5 xl:order-2">
              <div className="flex flex-wrap items-center justify-center gap-2">
                {PAYMENT_METHODS.map((method) => (
                  <span
                    key={method}
                    className="inline-flex min-w-12 items-center justify-center rounded-lg border border-[#e8e5f2] bg-white px-2.5 py-1.5 text-[10px] font-extrabold tracking-tight text-[#59617b] shadow-sm"
                  >
                    {method}
                  </span>
                ))}
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#f1efff] px-3 py-2 text-[10px] font-semibold text-[#5d55cf]">
                <LockKeyhole size={12} />
                Secure Checkout
              </span>
            </div>

            <div className="order-2 flex items-center gap-2 sm:justify-center xl:order-3 xl:justify-self-end">
              {SOCIAL_LINKS.map(({ label, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f1efff] text-xs font-extrabold text-[#5d55cf] transition duration-200 hover:-translate-y-0.5 hover:bg-[#4f46e5] hover:text-white hover:shadow-[0_7px_15px_rgba(79,70,229,0.2)] focus:outline-none focus:ring-2 focus:ring-[#4f46e5]/30"
                >
                  <SocialIcon label={label} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
