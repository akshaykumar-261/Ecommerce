import { createPortal } from "react-dom";

function Popup({
  open,
  onClose,
  icon,
  iconClassName = "bg-gray-100",
  title,
  message,
  children,
}) {
  if (!open) return null;
  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-2xl bg-white p-6 text-center shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {icon && (
          <div
            className={`mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full ${iconClassName}`}
          >
            {icon}
          </div>
        )}
        {title && (
          <h3 className="mb-1 text-lg font-semibold text-gray-900">{title}</h3>
        )}
        {message && <p className="mb-6 text-sm text-gray-500">{message}</p>}
        {children}
      </div>
    </div>,
    document.body,
  );
}

export default Popup;