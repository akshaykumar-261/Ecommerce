import { useState } from "react";
import { Wallet, Clock, CheckCircle2, XCircle } from "lucide-react";
import AdminLayout from "../../components/admin/AdminLayout";
import StatusBadge from "../../components/admin/StatusBadge";
import Pagination from "../../components/admin/Pagination";
import { TableShell, TableState } from "../../components/admin/Table";
import { useAdminPayouts, useAdminPayoutSummary } from "../../api/useAdminApi";

/*
 * Vendor payouts. Summary tiles come from /admin/vendor-payouts/summary;
 * the table lists records with an optional status filter.
 */
function formatMoney(amount, currency = "USD") {
  const value = Number(amount || 0);
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: String(currency).toUpperCase(),
      maximumFractionDigits: 2,
    }).format(value);
  } catch {
    return value.toFixed(2);
  }
}

function AdminPayouts() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("all");

  const summary = useAdminPayoutSummary();
  const query = useAdminPayouts(page, 8, status === "all" ? undefined : status, undefined);

  const rows = query.data?.data?.data || [];
  const pagination = query.data?.data;
  const summaryData = summary.data?.data || {};

  const cards = [
    { label: "Gross Volume", value: summaryData.total_gross_amount, icon: Wallet, tone: "from-indigo-500 to-blue-500" },
    { label: "Platform Fees", value: summaryData.total_platform_fee, icon: Wallet, tone: "from-amber-500 to-orange-500" },
    { label: "Pending", value: summaryData.pending_amount, icon: Clock, tone: "from-sky-500 to-cyan-500" },
    { label: "Paid Out", value: summaryData.paid_amount, icon: CheckCircle2, tone: "from-emerald-500 to-teal-500" },
    { label: "Failed", value: summaryData.failed_amount, icon: XCircle, tone: "from-rose-500 to-red-500" },
  ];

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-slate-800">Payouts</h1>
        <p className="mt-1 text-sm text-slate-500">Vendor settlements and platform fees</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5">
        {cards.map((card, i) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className="animate-fade-up group rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className={`flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br ${card.tone} text-white shadow-md transition group-hover:scale-110`}>
                <Icon size={18} />
              </div>
              <p className="mt-3 text-lg font-bold text-slate-800">
                {formatMoney(card.value)}
              </p>
              <p className="mt-0.5 text-xs text-slate-500">{card.label}</p>
            </div>
          );
        })}
      </div>

      {/* Table */}
      <div className="animate-fade-up mt-6 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
        <div className="flex flex-wrap gap-2 px-5 py-3.5">
          {["all", "pending", "paid", "failed", "refunded"].map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => { setStatus(value); setPage(1); }}
              className={`rounded-full px-3.5 py-1.5 text-xs font-semibold capitalize transition ${
                status === value
                  ? "bg-gradient-to-r from-indigo-600 to-blue-500 text-white shadow-md shadow-indigo-500/25"
                  : "bg-slate-50 text-slate-500 hover:bg-slate-100"
              }`}
            >
              {value}
            </button>
          ))}
        </div>

        <TableShell headers={["Payout", "Vendor", "Gross", "Fee", "Vendor Amount", "Status", "Date"]}>
          {query.isLoading || query.isError || rows.length === 0 ? (
            <TableState
              loading={query.isLoading}
              error={query.isError}
              colSpan={7}
              empty="No payouts recorded"
            />
          ) : (
            rows.map((payout) => (
              <tr key={payout.id} className="transition hover:bg-slate-50/60">
                <td className="px-5 py-3.5">
                  <p className="text-sm font-semibold text-slate-700">#{payout.id}</p>
                  <p className="text-[11px] text-slate-400">Order #{payout.order_id}</p>
                </td>
                <td className="px-5 py-3.5 text-xs text-slate-500">Vendor #{payout.vendor_id}</td>
                <td className="px-5 py-3.5 text-xs font-medium text-slate-700">
                  {formatMoney(payout.gross_amount, payout.currency)}
                </td>
                <td className="px-5 py-3.5 text-xs text-amber-600">
                  {formatMoney(payout.platform_fee, payout.currency)}
                </td>
                <td className="px-5 py-3.5 text-xs font-semibold text-emerald-600">
                  {formatMoney(payout.vendor_amount, payout.currency)}
                </td>
                <td className="px-5 py-3.5">
                  <StatusBadge status={payout.payout_status} />
                </td>
                <td className="px-5 py-3.5 text-xs text-slate-500">
                  {payout.createdAt ? new Date(payout.createdAt).toLocaleDateString() : "-"}
                </td>
              </tr>
            ))
          )}
        </TableShell>

        <Pagination pagination={pagination} onPageChange={setPage} />
      </div>
    </AdminLayout>
  );
}

export default AdminPayouts;
