import {
  ArrowUp,
  Headphones,
  Mail,
  MessageCircle,
  Phone,
  RotateCcw,
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

const SERVICE_HIGHLIGHTS = [
  { label: "Fast & Reliable Shipping", Icon: Truck },
  { label: "Secure Payments", Icon: ShieldCheck },
  { label: "24/7 Support", Icon: Headphones },
  { label: "Easy Returns", Icon: RotateCcw },
];

const SOCIAL_LINKS = [
  { label: "Facebook", href: "https://www.facebook.com/" },
  { label: "Instagram", href: "https://www.instagram.com/" },
  { label: "X", href: "https://x.com/" },
  { label: "YouTube", href: "https://www.youtube.com/" },
  { label: "LinkedIn", href: "https://www.linkedin.com/" },
];

const CONTACT_CHANNELS = [
  {
    label: "Call us",
    value: "+91 98765 43210",
    note: "Mon - Sun, 9AM - 11PM",
    href: "tel:+919876543210",
    Icon: Phone,
  },
  {
    label: "Email us",
    value: "support@shopease.com",
    note: "We reply within 24 hours",
    href: "mailto:support@shopease.com",
    Icon: Mail,
  },
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

function FooterLinkGroup({ title, links, centered = false }) {
  return (
    <div className={centered ? "text-center" : undefined}>
      <h2 className="text-[0.7rem] font-bold uppercase tracking-[0.18em] text-[#9aa0b8]">
        {title}
      </h2>
      <span
        className={`mt-3 block h-[3px] w-9 rounded-full bg-gradient-to-r from-[#7c3aed] to-[#38bdf8] ${
          centered ? "mx-auto" : ""
        }`}
      />
      <ul className="mt-4 space-y-0.5">
        {links.map((link) => (
          <li key={link.label}>
            <Link
              to={link.to}
              className={`group inline-flex min-h-9 items-center text-sm text-[#66708f] transition-colors duration-200 hover:text-[#4f46e5] focus:outline-none focus-visible:text-[#4f46e5] ${
                centered ? "justify-center" : ""
              }`}
            >
              {/* The dash lives in a reserved slot and scales in place, so the
                  label itself never shifts on hover. */}
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
    <footer
      id="site-footer"
      className="relative isolate overflow-hidden border-t border-[#eeeafd] font-sans text-[#10152f] bg-[linear-gradient(180deg,#ffffff_0%,#fdfcff_55%,#faf9ff_100%)]"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-28 -top-32 -z-10 h-96 w-96 rounded-full bg-[#e9e4ff] blur-[90px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-32 -left-24 -z-10 h-80 w-80 rounded-full bg-[#e0f2fe] blur-[90px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-px bg-gradient-to-r from-transparent via-[#c4b5fd] to-transparent"
      />

      <div className="mx-auto max-w-7xl px-5 pt-9 sm:px-6 lg:px-8 lg:pt-10">
        <div className="grid gap-x-10 gap-y-8 md:grid-cols-2 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,0.8fr)_minmax(0,1.2fr)]">
          <section aria-labelledby="footer-brand-title">
            <Link
              to="/home"
              className="group inline-flex items-center gap-3"
              aria-label="ShopEase home"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#7c3aed] via-[#4f46e5] to-[#38bdf8] shadow-[0_10px_26px_rgba(99,102,241,0.28)] ring-1 ring-[#4f46e5]/10 transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-105">
                <Zap size={22} className="fill-white text-white" />
              </span>
              <span
                id="footer-brand-title"
                className="text-[1.45rem] font-extrabold tracking-tight text-[#111735]"
              >
                Shop<span className="bg-gradient-to-r from-[#7c3aed] to-[#0ea5e9] bg-clip-text text-transparent">Ease</span>
              </span>
            </Link>

            <p className="mt-3.5 max-w-sm text-sm leading-6 text-[#66708f]">
              Your one-stop destination for the best products at unbeatable
              prices. Shop with confidence — every order is protected end to end.
            </p>

            <ul className="mt-5 flex items-center gap-2" aria-label="Social media">
              {SOCIAL_LINKS.map(({ label, href }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noreferrer noopener"
                    aria-label={label}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-[#e6e1fb] bg-[#f7f5ff] text-[#5d55cf] transition duration-300 hover:-translate-y-0.5 hover:border-transparent hover:bg-gradient-to-br hover:from-[#7c3aed] hover:to-[#4f46e5] hover:text-white hover:shadow-[0_10px_20px_rgba(99,102,241,0.3)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4f46e5]/40"
                  >
                    <SocialIcon label={label} />
                  </a>
                </li>
              ))}
            </ul>
          </section>

          <nav aria-label="Quick links">
            <FooterLinkGroup title="Quick Links" links={QUICK_LINKS} centered />
          </nav>

          <section
            aria-label="Contact support"
            className="md:col-span-2 lg:col-span-1"
          >
            <h2 className="text-[0.7rem] font-bold uppercase tracking-[0.18em] text-[#9aa0b8]">
              Get In Touch
            </h2>
            <span className="mt-3 block h-[3px] w-9 rounded-full bg-gradient-to-r from-[#7c3aed] to-[#38bdf8]" />

            <ul className="mt-4 grid gap-3 md:grid-cols-2 lg:block lg:space-y-2.5">
              {CONTACT_CHANNELS.map(({ label, value, note, href, Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    className="group flex items-start gap-3.5 rounded-2xl border border-[#eae6fb] bg-[#faf9ff] p-3 transition duration-300 hover:-translate-y-0.5 hover:border-[#c9c1ff] hover:bg-white hover:shadow-[0_10px_24px_rgba(99,102,241,0.12)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4f46e5]/40"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#7c3aed] to-[#4f46e5] text-white shadow-[0_6px_16px_rgba(79,70,229,0.28)]">
                      <Icon size={17} />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[10px] font-bold uppercase tracking-[0.16em] text-[#a3a9c0]">
                        {label}
                      </span>
                      <span className="mt-1 block truncate text-sm font-bold text-[#232a4d] transition-colors group-hover:text-[#4f46e5]">
                        {value}
                      </span>
                      <span className="mt-0.5 block text-[11px] text-[#8a91a7]">
                        {note}
                      </span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>

            <Link
              to="/contact"
              className="mt-3.5 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#7c3aed] to-[#4f46e5] px-5 text-sm font-bold text-white shadow-[0_12px_26px_rgba(79,70,229,0.28)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_32px_rgba(79,70,229,0.36)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4f46e5]/50"
            >
              <MessageCircle size={17} />
              Contact Us
            </Link>
          </section>
        </div>

        <section
          className="mt-8 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4"
          aria-label="Shopping benefits"
        >
          {SERVICE_HIGHLIGHTS.map(({ label, Icon }) => (
            <div
              key={label}
              className="group flex items-center gap-3.5 rounded-2xl border border-[#ece8fb] bg-white px-4 py-2.5 transition duration-300 hover:-translate-y-0.5 hover:border-[#c9c1ff] hover:shadow-[0_10px_24px_rgba(99,102,241,0.12)]"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#f3f1ff] text-[#5b52d8] ring-1 ring-[#e6e1fb] transition duration-300 group-hover:bg-gradient-to-br group-hover:from-[#7c3aed] group-hover:to-[#4f46e5] group-hover:text-white group-hover:ring-transparent">
                <Icon size={18} strokeWidth={2.1} />
              </span>
              <span className="text-[13px] font-semibold leading-5 text-[#3c4467]">
                {label}
              </span>
            </div>
          ))}
        </section>

        <div className="mt-8 border-t border-[#eceaf6] py-5">
          <div className="relative flex items-center justify-center">
            <p className="text-center text-xs text-[#7b839d]">
              &copy; 2026 ShopEase. All rights reserved.
            </p>

            {/* <button
              type="button"
              onClick={scrollToTop}
              aria-label="Back to top"
              title="Back to top"
              className="group absolute right-0 flex h-9 w-9 items-center justify-center rounded-full border border-[#e6e1fb] bg-[#f7f5ff] text-[#5d55cf] transition duration-300 hover:-translate-y-0.5 hover:border-transparent hover:bg-gradient-to-br hover:from-[#7c3aed] hover:to-[#4f46e5] hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4f46e5]/40"
            >
              <ArrowUp
                size={16}
                className="transition-transform duration-300 group-hover:-translate-y-0.5"
              />
            </button> */}
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
