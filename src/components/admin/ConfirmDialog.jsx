import { AlertTriangle } from "lucide-react";
import Button from "./Button";

/**
 * Reusable confirmation modal used for destructive admin actions
 * (vendor delete, category delete, reject, block...).
 */
function ConfirmDialog({ open, title, message, confirmLabel = "Confirm", variant = "danger", loading, onConfirm, onCancel }) {
  if (!open) return null;
  return (
    <div className="animate-fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="animate-pop w-full max-w-md rounded-3xl bg-white p-7 shadow-2xl">
        <div
          className={`mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full ring-8 ${
            variant === "danger"
              ? "bg-red-50 ring-red-50/60"
              : "bg-amber-50 ring-amber-50/60"
          }`}
        >
          <AlertTriangle
            size={28}
            className={variant === "danger" ? "text-red-500" : "text-amber-500"}
          />
        </div>

        <h3 className="text-center text-lg font-semibold text-slate-900">{title}</h3>
        <p className="mt-2 text-center text-sm leading-6 text-slate-500">{message}</p>

        <div className="mt-7 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
          >
            Cancel
          </button>
          <Button variant={variant} loading={loading} onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDialog;