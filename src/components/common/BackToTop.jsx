import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

// Show the control only once the user is far enough down that returning to the
// top is actually useful.
const SCROLL_THRESHOLD = 400;

function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > SCROLL_THRESHOLD);

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Back to top"
      title="Back to top"
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
      className={`fixed bottom-5 right-5 z-40 flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-[#7c3aed] to-[#4f46e5] text-white shadow-[0_12px_28px_rgba(79,70,229,0.35)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_34px_rgba(79,70,229,0.45)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4f46e5]/60 focus-visible:ring-offset-2 ${
        visible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-3 opacity-0"
      }`}
    >
      <ArrowUp size={18} className="transition-transform duration-300" />
    </button>
  );
}

export default BackToTop;
