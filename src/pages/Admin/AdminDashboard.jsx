import {
  Users,
  Store,
  Package,
  ShoppingBag,
  WalletCards,
  CheckCircle2,
  XCircle,
  Clock,
  CreditCard,
} from "lucide-react";
import AdminLayout from "../../components/admin/AdminLayout";import StatCard from "../../components/admin/StatCard";
import { useAdminDashboard } from "../../api/useAdminApi";

/**
 * Marketplace overview: entity counts from /admin/dashboard plus the
 * per-currency financial summary. Amounts are never summed across currencies
 * (the API groups them), so each currency renders as its own row.
 */

const ORDER_PIPELINE = [
  { key: "delivered", label: "Delivered", icon: CheckCircle2, tone: "text-emerald-500" },
  { label: "In Progress", value: "pending", icon: Clock, tone: "text-sky-500" },
  { label: "Cancelled", value: "cancelled", icon: XCircle, tone: "text-red-400" },
  { label: "Paid", value: "paid", icon: CreditCard, tone: "text-indigo-500" },
];

const PAYOUT_STATUSES = ["pending", "paid", "failed", "refunded"];

function formatMoney(amount, currency) {
  const value = Number(amount || 0);
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: String(currency || "USD").toUpperCase(),
      maximumFractionDigits: 2,
    }).format(value);
  } catch {
    return `${currency} ${value.toFixed(2)}`;
  }
}

function LoadingGrid() {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="h-32 animate-pulse rounded-2xl border border-slate-100 bg-white"
        />
      ))}
    </div>
  );
}

function AdminDashboard() {
  const { data, isLoading, isError } = useAdminDashboard();
  const counts = data?.data?.counts || {};
  const orders = counts.orders || {};
  const financials = data?.data?.financial_summary || [];
  const payouts = data?.data?.payout_breakdown || {};

  const statCards = [
    { label: "Total Users", value: counts.users ?? 0, icon: Users, tone: "indigo" },
    { label: "Vendors", value: counts.vendors ?? 0, icon: Store, tone: "violet" },
    { label: "Customers", value: counts.customers ?? 0, icon: Users, tone: "sky" },
    { label: "Products", value: counts.products ?? 0, icon: Package, tone: "emerald" },
    { label: "Orders", value: orders.total ?? 0, icon: ShoppingBag, tone: "amber" },
    { label: "Stores", value: counts.stores ?? 0, icon: Store, tone: "indigo" },
    { label: "Categories", value: counts.categories ?? 0, icon: WalletCards, tone: "violet" },
    { label: "Payouts", value: counts.payouts ?? 0, icon: WalletCards, tone: "rose" },
  ];

  return (
    <AdminLayout>
      {/* Header */}
      <div className="animate-fade-up mb-6">
        <h1 className="text-2xl font-semibold text-slate-800">Dashboard</h1>
        <p className="mt-1 text-sm text-slate-500">Marketplace health at a glance</p>
      </div>

      {isLoading && <LoadingGrid />}

      {isError && !isLoading && (
        <div className="rounded-2xl border border-red-100 bg-white p-10 text-center">
          <p className="text-sm text-red-500">Failed to load dashboard.</p>
        </div>
      )}

      {!isLoading && !isError && (
        <>
          {/* Stat cards */}
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {statCards.map((card, i) => (
              <StatCard key={card.label} {...card} delay={i * 70} />
            ))}
          </div>

          <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
            {/* Orders pipeline */}
            <section
              className="animate-fade-up rounded-2xl border border-slate-100 bg-white p-6 shadow-sm"
              style={{ animationDelay: "350ms" }}
            >
              <h2 className="text-sm font-semibold text-slate-800">Order Pipeline</h2>
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {ORDER_PIPELINE.map(({ value, label, icon: Icon, tone }) => (
                  <div
                    key={label}
                    className="rounded-xl border border-slate-100 bg-slate-50/60 p-4 text-center transition hover:shadow-md"
                  >
                    <Icon size={18} className={`mx-auto ${tone}`} />
                    <p className="mt-2 text-xl font-bold text-slate-800">
                      {orders[value] ?? 0}
                    </p>
                    <p className="mt-0.5 text-[11px] text-slate-500">{label}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Financial summary per currency */}
            <section
              className="animate-fade-up rounded-2xl border border-slate-100 bg-white p-6 shadow-sm"
              style={{ animationDelay: "420ms" }}
            >
              <h2 className="text-sm font-semibold text-slate-800">Financial Summary</h2>
              <p className="mt-0.5 text-[11px] text-slate-400">
                Grouped by currency from payout records
              </p>

              {financials.length === 0 ? (
                <p className="mt-6 text-center text-xs text-slate-400">
                  No payout data yet.
                </p>
              ) : (
                <div className="mt-4 space-y-3">
                  {financials.map((row) => (
                    <div
                      key={row.currency}
                      className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/60 px-4 py-3"
                    >
                      <span className="rounded-lg bg-indigo-50 px-2 py-1 text-[11px] font-bold uppercase text-indigo-600">
                        {row.currency}
                      </span>
                      <div className="flex items-center gap-5 text-xs">
                        <div className="text-right">
                          <p className="text-slate-400">Gross</p>
                          <p className="font-semibold text-slate-700">
                            {formatMoney(row.gross_amount, row.currency)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-slate-400">Fee</p>
                          <p className="font-semibold text-amber-600">
                            {formatMoney(row.platform_fee, row.currency)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-slate-400">Vendors</p>
                          <p className="font-semibold text-emerald-600">
                            {formatMoney(row.vendor_amount, row.currency)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>

          {/* Payout status breakdown */}
          <section
            className="animate-fade-up mt-6 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm"
            style={{ animationDelay: "490ms" }}
          >
            <h2 className="text-sm font-semibold text-slate-800">Payout Status</h2>
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {PAYOUT_STATUSES.map((status) => {
                const rows = payouts[status] || [];
                const total = rows.reduce(
                  (sum, r) => sum + Number(r.vendor_amount || 0),
                  0,
                );
                const count = rows.reduce((sum, r) => sum + Number(r.payouts || 0), 0);
                return (
                  <div
                    key={status}
                    className="rounded-xl border border-slate-100 bg-slate-50/60 p-4 transition hover:shadow-md"
                  >
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                      {status}
                    </p>
                    <p className="mt-1 text-lg font-bold text-slate-800">
                      {formatMoney(total, rows[0]?.currency || "usd")}
                    </p>
                    <p className="mt-0.5 text-[11px] text-slate-400">{count} payouts</p>
                  </div>
                );
              })}
            </div>
          </section>
        </>
      )}
    </AdminLayout>
  );
}

export default AdminDashboard;