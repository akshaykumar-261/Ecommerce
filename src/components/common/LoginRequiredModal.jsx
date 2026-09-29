import { useEffect } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { LockKeyhole, LogIn, X } from "lucide-react";

function LoginRequiredModal({ open, onClose, redirectTo }) {
  const navigate = useNavigate();

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "auto";
    };
  }, [open, onClose]);

  if (!open) return null;

  const handleLogin = () => {
    onClose?.();
    navigate("/login", redirectTo ? { state: { from: redirectTo } } : undefined);
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#1b1633]/55 p-4 backdrop-blur-md"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Login required"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-sm rounded-[24px] bg-white px-6 py-7 text-center shadow-[0_24px_60px_-18px_rgba(76,46,216,0.38)] sm:px-7"
      >
        {/* Close */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-3.5 top-3.5 flex h-8 w-8 items-center justify-center rounded-full text-gray-400 transition hover:bg-[#f4f2ff] hover:text-[#4c2ed8]"
        >
          <X size={17} />
        </button>

        {/* Lock Icon */}
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#f1efff] to-[#e8e4ff]">
          <LockKeyhole size={22} className="text-[#4c2ed8]" />
        </div>

        <h2 className="mt-4 text-[22px] font-bold tracking-tight text-[#131a35] sm:text-2xl">
          Login Required
        </h2>

        <p className="mx-auto mt-2 max-w-xs text-[13px] leading-6 text-slate-500">
          Please log in to your account to access this feature and enjoy a
          personalized experience.
        </p>

        {/* Actions */}
        <div className="mt-6 flex flex-col gap-2.5 sm:flex-row">
          <button
            type="button"
            onClick={onClose}
            className="h-12 w-full rounded-[15px] border border-[#ddd8f5] bg-white px-5 text-sm font-semibold text-slate-600 transition hover:bg-[#f7f5ff] sm:w-1/2"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleLogin}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-[15px] bg-gradient-to-r from-[#4c2ed8] to-[#6d4bf0] px-5 text-sm font-semibold text-white shadow-md shadow-[#4c2ed8]/30 transition hover:shadow-lg hover:shadow-[#4c2ed8]/40 active:scale-[0.98] sm:w-1/2"
          >
            <LogIn size={17} />
            Login
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}

export default LoginRequiredModal;
