
/**
 * Status pill with fixed color mapping. Colors are static Tailwind classes so
 * the JIT compiler keeps them in the build.
 */
const styles = {
  active: "bg-emerald-50 text-emerald-600 ring-emerald-200",
  approved: "bg-emerald-50 text-emerald-600 ring-emerald-200",
  verified: "bg-emerald-50 text-emerald-600 ring-emerald-200",
  paid: "bg-emerald-50 text-emerald-600 ring-emerald-200",
  delivered: "bg-emerald-50 text-emerald-600 ring-emerald-200",
  inactive: "bg-slate-100 text-slate-500 ring-slate-200",
  pending: "bg-amber-50 text-amber-600 ring-amber-200",
  confirmed: "bg-sky-50 text-sky-600 ring-sky-200",
  packed: "bg-indigo-50 text-indigo-600 ring-indigo-200",
  shipped: "bg-violet-50 text-violet-600 ring-violet-200",
  cancelled: "bg-red-50 text-red-500 ring-red-200",
  failed: "bg-red-50 text-red-500 ring-red-200",
  rejected: "bg-red-50 text-red-500 ring-red-200",
  blocked: "bg-red-50 text-red-500 ring-red-200",
  refunded: "bg-amber-50 text-amber-600 ring-amber-200",
  unknown: "bg-slate-50 text-slate-500 ring-slate-200",
};

function StatusBadge({ status }) {
  const key = String(status || "unknown").toLowerCase();
  const cls = styles[key] || styles.unknown;
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold capitalize ring-1 ${cls}`}
    >
      {key}
    </span>
  );
}

export default StatusBadge;