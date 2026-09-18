import { Loader2 } from "lucide-react";

/**
 * Buttons used across the admin panel. Variants mirror the design system:
 * primary (gradient), danger, ghost, outline. `loading` disables and spins.
 */
const variants = {
  primary:
    "bg-gradient-to-r from-[#4630d8] to-[#2e8ee8] text-white shadow-lg shadow-indigo-500/25 hover:opacity-90",
  danger:
    "bg-red-500 text-white shadow-lg shadow-red-500/25 hover:bg-red-600",
  outline:
    "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
  ghost: "text-slate-600 hover:bg-slate-100",
};

function Button({
  children,
  variant = "primary",
  type = "button",
  loading = false,
  disabled = false,
  onClick,
  className = "",
}) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all duration-200 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60";
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${base} ${variants[variant] || variants.primary} ${className}`}
    >
      {loading && <Loader2 size={16} className="animate-spin" />}
      {children}
    </button>
  );
}

export default Button;