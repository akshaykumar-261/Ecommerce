import { Link } from "react-router-dom";
import { Zap } from "lucide-react";

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

function Footer() {
  return (
    <footer className="border-t border-gray-100 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Brand */}
          <div>
            <Link to="/home" className="mb-3 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#4c2ed8] to-[#368de8]">
                <Zap size={16} className="text-white" />
              </div>
              <span className="text-lg font-bold text-gray-900">
                Shop<span className="text-[#4c2ed8]">Ease</span>
              </span>
            </Link>
            <p className="max-w-xs text-sm leading-relaxed text-gray-500">
              Your one-stop destination for the best products at unbeatable
              prices. Shop with confidence.
            </p>
          </div>

          {/* Links */}
          {LINK_COLUMNS.map((col) => (
            <div key={col.title}>
              <h4 className="mb-3 text-sm font-semibold text-gray-900">
                {col.title}
              </h4>
              <ul className="space-y-2">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="text-sm text-gray-500 transition hover:text-[#4c2ed8]"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 border-t border-gray-100 pt-6 text-center text-xs text-gray-400">
          &copy; {new Date().getFullYear()} ShopEase. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export default Footer;