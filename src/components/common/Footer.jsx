import {
  ArrowUp,
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

const QUICK_LINKS = [
  { label: "About Us", to: "/about" },
  { label: "Contact", to: "/contact" },
  { label: "FAQs", to: "/faq" },
  { label: "Blog", to: "/blog" },
];

const SUPPORT_LINKS = [
  { label: "Help Center", to: "/faq" },
  { label: "Shipping Info", to: "/contact" },
  { label: "Returns", to: "/faq" },
  { label: "Privacy Policy", to: "/about" },
];

const UTILITY_LINKS = [
  { label: "Terms", to: "/faq" },
  { label: "Privacy", to: "/about" },
  { label: "Sitemap", to: "/home" },
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

function FooterLinkGroup({ title, links }) {
  return (
    <div>
      <h2 className="text-sm font-bold text-[#171c3b]">{title}</h2>
      <span className="mt-2.5 block h-1 w-7 rounded-full bg-[#6d63e8]" />
      <ul className="mt-4 space-y-1">
        {links.map((link) => (
          <li key={link.label}>
            <Link
              to={link.to}
              className="group inline-flex min-h-9 items-center text-sm text-[#66708f] transition-colors duration-200 hover:text-[#4f46e5] focus:outline-none focus:text-[#4f46e5]"
            >
              <span className="mr-2 h-1 w-1 rounded-full bg-[#c8c1ff] transition-colors group-hover:bg-[#4f46e5]" />
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer id="site-footer" className="relative isolate overflow-hidden border-t border-[#eeeafd] bg-[linear-gradient(180deg,#ffffff_0%,#fdfcff_58%,#faf9ff_100%)] font-sans text-[#10152f]">
      <div className="pointer-events-none absolute -right-24 -top-28 -z-10 h-80 w-80 rounded-full bg-[#e9e4ff]/40 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-28 -left-24 -z-10 h-72 w-72 rounded-full bg-[#f1eaff]/60 blur-3xl" />

      <div className="mx-auto max-w-7xl px-5 pt-12 sm:px-6 lg:px-8 lg:pt-14">
        <div className="grid gap-x-8 gap-y-10 md:grid-cols-[minmax(0,1.5fr)_minmax(0,0.75fr)_minmax(0,0.85fr)]">
          <section aria-labelledby="footer-brand-title">
            <Link
              to="/home"
              className="group inline-flex items-center gap-3"
              aria-label="ShopEase home"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#4f46e5] to-[#7c3aed] shadow-[0_8px_20px_rgba(79,70,229,0.22)] transition-transform duration-300 group-hover:-rotate-3 group-hover:scale-105">
                <Zap size={21} className="fill-white text-white" />
              </span>
              <span id="footer-brand-title" className="text-[1.35rem] font-extrabold tracking-tight text-[#111735]">
                Shop<span className="text-[#4f46e5]">Ease</span>
              </span>
            </Link>

            <p className="mt-4 max-w-sm text-sm leading-6 text-[#66708f]">
              Your one-stop destination for the best products at unbeatable
              prices. Shop with confidence.
            </p>

            <ul className="mt-5 flex items-center gap-2" aria-label="Social media">
              {SOCIAL_LINKS.map(({ label, href }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noreferrer noopener"
                    aria-label={label}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-[#e3defb] bg-[#f7f5ff] text-[#5d55cf] transition duration-200 hover:-translate-y-0.5 hover:border-[#4f46e5] hover:bg-[#4f46e5] hover:text-white hover:shadow-[0_7px_15px_rgba(79,70,229,0.18)] focus:outline-none focus:ring-2 focus:ring-[#4f46e5]/30"
                  >
                    <SocialIcon label={label} />
                  </a>
                </li>
              ))}
            </ul>

            <ul className="mt-5 space-y-2.5" aria-label="Shopping benefits">
              {SERVICE_HIGHLIGHTS.map(({ label, Icon }) => (
                <li
                  key={label}
                  className="flex items-center gap-2.5 text-xs font-medium text-[#46506f]"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#ddd7ff] bg-[#f7f5ff] text-[#5b52d8]">
                    <Icon size={14} strokeWidth={2.2} />
                  </span>
                  {label}
                </li>
              ))}
            </ul>
          </section>

          <nav aria-label="Quick links">
            <FooterLinkGroup title="Quick Links" links={QUICK_LINKS} />
          </nav>

          <nav aria-label="Customer support">
            <FooterLinkGroup title="Customer Support" links={SUPPORT_LINKS} />
          </nav>

        </div>

        <section
          className="mt-10 rounded-[1.5rem] border border-[#e8e3ff] bg-[#f8f6ff]/90 p-5 sm:p-6"
          aria-label="Contact support"
        >
          <div className="grid items-center gap-y-5 md:grid-cols-2 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,0.85fr)_minmax(0,1fr)_auto] lg:gap-5">
            <div className="flex items-center gap-3.5">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#ddd7ff] bg-white text-[#5b52d8] shadow-sm">
                <Headphones size={20} />
              </span>
              <div>
                <h2 className="text-xs font-extrabold uppercase tracking-[0.14em] text-[#4f46e5]">
                  Need Help?
                </h2>
                <p className="mt-1 text-xs leading-5 text-[#69718c]">
                  Our support team is available 24/7 to assist you.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#e0dbf8] bg-white text-[#6259dc]">
                <Phone size={17} />
              </span>
              <div className="min-w-0">
                <a
                  href="tel:+919876543210"
                  className="block text-sm font-bold text-[#303754] transition hover:text-[#4f46e5] focus:outline-none focus:text-[#4f46e5]"
                >
                  +91 98765 43210
                </a>
                <p className="mt-0.5 text-[11px] text-[#8a91a7]">
                  Mon - Sun, 9AM - 11PM
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#e0dbf8] bg-white text-[#6259dc]">
                <Mail size={17} />
              </span>
              <div className="min-w-0">
                <a
                  href="mailto:support@shopease.com"
                  className="block truncate text-sm font-bold text-[#303754] transition hover:text-[#4f46e5] focus:outline-none focus:text-[#4f46e5]"
                >
                  support@shopease.com
                </a>
                <p className="mt-0.5 text-[11px] text-[#8a91a7]">
                  We reply within 24 hours
                </p>
              </div>
            </div>

            <Link
              to="/contact"
              className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#4f46e5] to-[#7c3aed] px-5 text-sm font-semibold text-white shadow-[0_8px_18px_rgba(79,70,229,0.2)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_22px_rgba(79,70,229,0.28)] focus:outline-none focus:ring-2 focus:ring-[#4f46e5]/40 md:col-span-2 lg:col-span-1 lg:w-auto"
            >
              <MessageCircle size={17} />
              Contact Us
            </Link>
          </div>
        </section>

        <div className="mt-8 border-t border-[#eae7f6] py-6">
          <div className="flex flex-col items-start gap-5 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
            <p className="text-xs text-[#7b839d]">
              &copy; 2026 ShopEase. All rights reserved.
            </p>

            <div className="flex flex-wrap items-center justify-start gap-2.5">
              <div className="flex flex-wrap items-center gap-2">
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

            <div className="flex flex-wrap items-center justify-between gap-3 sm:justify-end">
              <nav className="flex flex-wrap items-center gap-x-4 gap-y-2" aria-label="Legal links">
                {UTILITY_LINKS.map((link) => (
                  <Link
                    key={link.label}
                    to={link.to}
                    className="text-xs text-[#7b839d] transition hover:text-[#4f46e5] focus:outline-none focus:text-[#4f46e5]"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
              <button
                type="button"
                onClick={scrollToTop}
                aria-label="Back to top"
                title="Back to top"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#ddd7ff] bg-white text-[#5d55cf] shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-[#4f46e5] hover:bg-[#4f46e5] hover:text-white focus:outline-none focus:ring-2 focus:ring-[#4f46e5]/30"
              >
                <ArrowUp size={15} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
