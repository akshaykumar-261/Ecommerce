import { useEffect, useRef, useState } from "react";
import { Check, Link2, Mail, Share2 } from "lucide-react";
import toast from "react-hot-toast";

/*
 * Product share button. On phones it hands off to the native share sheet; on
 * desktop (no navigator.share) it opens a panel with a copyable link and the
 * usual networks.
 */

function WhatsAppIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M12.04 2c-5.5 0-9.96 4.46-9.96 9.96 0 1.76.46 3.48 1.34 4.99L2 22l5.2-1.36a9.9 9.9 0 0 0 4.84 1.24h.01c5.5 0 9.96-4.46 9.96-9.96 0-2.66-1.04-5.16-2.92-7.04A9.88 9.88 0 0 0 12.04 2Zm5.8 14.13c-.24.68-1.4 1.3-1.94 1.34-.5.05-.98.23-3.3-.69-2.78-1.1-4.55-3.95-4.69-4.14-.13-.19-1.13-1.5-1.13-2.87 0-1.36.71-2.03.97-2.3.24-.29.53-.36.71-.36.18 0 .36 0 .52.01.18.01.41-.07.64.49.24.58.81 2 .88 2.14.07.14.12.31.02.5-.1.19-.14.31-.29.47-.14.17-.3.37-.43.5-.14.14-.29.29-.12.57.17.28.75 1.23 1.6 1.99 1.1.98 2.03 1.29 2.31 1.43.28.14.44.12.61-.07.17-.19.71-.83.9-1.11.19-.29.38-.24.64-.14.26.09 1.65.78 1.93.92.28.14.47.21.54.33.07.12.07.69-.17 1.36Z" />
    </svg>
  );
}

function XIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M18.9 2H22l-6.8 7.8L23.2 22H17l-4.9-6.4L6.5 22H3.3l7.2-8.3L2.7 2h6.3l4.4 5.8L18.9 2Zm-1.1 18h1.7L7.1 3.9H5.3L17.8 20Z" />
    </svg>
  );
}

function FacebookIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M14 8.5V7c0-.8.2-1.2 1.5-1.2H17V2.1A19 19 0 0 0 14.6 2C11.5 2 10 3.6 10 6.4v2.1H7V13h3v9h4v-9h3.2l.5-4.5H14Z" />
    </svg>
  );
}

function TelegramIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M21.7 4.3 18.9 20c-.2 1-.8 1.2-1.7.8l-4.6-3.4-2.2 2.2c-.2.2-.4.4-.9.4l.3-4.6 8.4-7.6c.4-.3 0-.5-.5-.2L7.4 13.2 3 11.7c-1-.3-1-1 .2-1.5l17-6.6c.8-.3 1.5.2 1.5 1.2v-.5Z" />
    </svg>
  );
}

const copyToClipboard = async (text) => {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // falls through to the legacy path below
  }
  try {
    const field = document.createElement("textarea");
    field.value = text;
    field.setAttribute("readonly", "");
    field.style.position = "fixed";
    field.style.opacity = "0";
    document.body.appendChild(field);
    field.select();
    const copied = document.execCommand("copy");
    document.body.removeChild(field);
    return copied;
  } catch {
    return false;
  }
};

export default function ShareButton({ url, title, text, label = "Share", className = "" }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const containerRef = useRef(null);
  const copyTimer = useRef(null);

  const shareUrl = url || (typeof window !== "undefined" ? window.location.href : "");
  const shareText = text || title || "Check this out on ShopEase";
  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedText = encodeURIComponent(`${shareText}\n${shareUrl}`);

  useEffect(() => {
    if (!open) return undefined;
    const close = () => setOpen(false);
    const onPointerDown = (event) => {
      if (!containerRef.current?.contains(event.target)) close();
    };
    const onKeyDown = (event) => {
      if (event.key === "Escape") close();
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", close);
    window.addEventListener("scroll", close, true);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("resize", close);
      window.removeEventListener("scroll", close, true);
    };
  }, [open]);

  useEffect(() => () => clearTimeout(copyTimer.current), []);

  const canNativeShare = typeof navigator !== "undefined" && navigator.share;

  const handleShareClick = async () => {
    if (canNativeShare) {
      try {
        await navigator.share({ title, text: shareText, url: shareUrl });
      } catch {
        // The visitor dismissed the sheet — nothing to report.
      }
      return;
    }
    setOpen((prev) => !prev);
  };

  const handleCopy = async () => {
    const copiedOk = await copyToClipboard(shareUrl);
    if (copiedOk) {
      setCopied(true);
      toast.success("Product link copied");
      clearTimeout(copyTimer.current);
      copyTimer.current = setTimeout(() => setCopied(false), 2000);
      setOpen(false);
    } else {
      toast.error("Could not copy the link");
    }
  };

  const networks = [
    {
      name: "WhatsApp",
      href: `https://wa.me/?text=${encodedText}`,
      Icon: WhatsAppIcon,
      className: "text-[#25D366] hover:bg-[#25D366]/10",
    },
    {
      name: "X",
      href: `https://twitter.com/intent/tweet?text=${encodedText}`,
      Icon: XIcon,
      className: "text-gray-900 hover:bg-gray-900/10",
    },
    {
      name: "Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      Icon: FacebookIcon,
      className: "text-[#1877F2] hover:bg-[#1877F2]/10",
    },
    {
      name: "Telegram",
      href: `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`,
      Icon: TelegramIcon,
      className: "text-[#229ED9] hover:bg-[#229ED9]/10",
    },
  ];

  return (
    <div className="relative" ref={containerRef}>
      <button
        onClick={handleShareClick}
        aria-haspopup={canNativeShare ? undefined : "menu"}
        aria-expanded={canNativeShare ? undefined : open}
        className={className}
      >
        {copied ? <Check size={16} className="text-green-600" /> : <Share2 size={16} />}
        {label}
      </button>

      {open && (
        <div
          role="menu"
          className="absolute left-0 top-full z-30 mt-2 w-64 origin-top-left rounded-2xl border border-gray-100 bg-white p-4 shadow-xl shadow-gray-900/10"
        >
          <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.14em] text-gray-400">
            Share this product
          </p>

          <div className="grid grid-cols-4 gap-2">
            {networks.map(({ name, href, Icon, className: tone }) => (
              <a
                key={name}
                href={href}
                target="_blank"
                rel="noreferrer noopener"
                role="menuitem"
                title={name}
                onClick={() => setOpen(false)}
                className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gray-50 transition-colors duration-200 ${tone}`}
              >
                <Icon className="h-4 w-4" />
                <span className="sr-only">{name}</span>
              </a>
            ))}
          </div>

          <div className="mt-3 space-y-1 border-t border-gray-100 pt-3">
            <button
              onClick={handleCopy}
              role="menuitem"
              className="flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-sm font-medium text-gray-700 transition-colors duration-200 hover:bg-gray-50"
            >
              <Link2 size={15} className="text-[#4c2ed8]" />
              Copy link
            </button>
            <a
              href={`mailto:?subject=${encodeURIComponent(title || "ShopEase product")}&body=${encodedText}`}
              role="menuitem"
              onClick={() => setOpen(false)}
              className="flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-sm font-medium text-gray-700 transition-colors duration-200 hover:bg-gray-50"
            >
              <Mail size={15} className="text-[#4c2ed8]" />
              Share by email
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
