import { useState } from "react";
import {
  Wallet,
  Clock,
  CheckCircle2,
  XCircle,
  TrendingUp,
  CreditCard,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";
import Sidebar from "../../components/common/SideBar";
import Topbar from "../../components/common/Topbar";
import { useGetPayouts } from "../../api/useVendorApi";
import { useVenderOnboarding, useVenderStripeDetail } from "../../api/useAuth";

const STATUS_STYLES = {
  pending: "bg-amber-50 text-amber-600 border border-amber-200",
  paid: "bg-emerald-50 text-emerald-600 border border-emerald-200",
  failed: "bg-red-50 text-red-500 border border-red-200",
  refunded: "bg-slate-100 text-slate-500 border border-slate-200",
};

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

function VendorPayouts() {
  const [status, setStatus] = useState("all");

  const { mutate: createOnboarding, isPending: isOnboardingPending } =
    useVenderOnboarding();
  const {
    data: stripeData,
    isLoading: stripeLoading,
    isError: stripeError,
  } = useVenderStripeDetail();

  const isStripeConnected =
    stripeData?.data?.details_submitted &&
    stripeData?.data?.charges_enabled &&
    stripeData?.data?.payouts_enabled;

  const query = useGetPayouts(status === "all" ? undefined : status);

  const rows = query.data?.data?.payouts || query.data?.data || [];

  const payouts = Array.isArray(rows) ? rows : [];

  const totalEarnings = payouts.reduce(
    (sum, p) => sum + Number(p.vendor_amount || 0),
    0,
  );
  const totalFees = payouts.reduce(
    (sum, p) => sum + Number(p.platform_fee || 0),
    0,
  );
  const pendingAmount = payouts
    .filter((p) => p.payout_status === "pending")
    .reduce((sum, p) => sum + Number(p.vendor_amount || 0), 0);
  const paidAmount = payouts
    .filter((p) => p.payout_status === "paid")
    .reduce((sum, p) => sum + Number(p.vendor_amount || 0), 0);
  const failedAmount = payouts
    .filter((p) => p.payout_status === "failed")
    .reduce((sum, p) => sum + Number(p.vendor_amount || 0), 0);

  const summaryCards = [
    {
      label: "Total Earnings",
      value: formatMoney(totalEarnings),
      icon: TrendingUp,
      tone: "from-indigo-500 to-blue-500",
      shadow: "shadow-indigo-500/25",
    },
    {
      label: "Platform Fees",
      value: formatMoney(totalFees),
      icon: Wallet,
      tone: "from-amber-500 to-orange-500",
      shadow: "shadow-amber-500/25",
    },
    {
      label: "Pending",
      value: formatMoney(pendingAmount),
      icon: Clock,
      tone: "from-sky-500 to-cyan-500",
      shadow: "shadow-sky-500/25",
    },
    {
      label: "Paid Out",
      value: formatMoney(paidAmount),
      icon: CheckCircle2,
      tone: "from-emerald-500 to-teal-500",
      shadow: "shadow-emerald-500/25",
    },
    {
      label: "Failed",
      value: formatMoney(failedAmount),
      icon: XCircle,
      tone: "from-rose-500 to-red-500",
      shadow: "shadow-rose-500/25",
    },
  ];

  const handleConnectStripe = () => {
    createOnboarding(undefined, {
      onSuccess: (data) => {
        const stripeUrl = data?.data?.url;
        if (stripeUrl) {
          window.location.href = stripeUrl;
        }
      },
      onError: (error) => {
        console.error("Stripe onboarding error:", error);
      },
    });
  };

  // ================= LOADING STATE =================
  if (stripeLoading) {
    return (
      <div className="min-h-screen bg-[#f0f2f8]">
        <Sidebar role="vendor" />
        <div className="min-h-screen lg:ml-[270px]">
          <Topbar role="vendor" />
          <main className="flex min-h-[60vh] items-center justify-center p-5 lg:p-7">
            <div className="flex flex-col items-center gap-3">
              <span className="h-8 w-8 animate-spin rounded-full border-[3px] border-indigo-500 border-t-transparent" />
              <p className="text-sm text-slate-500">
                Checking Stripe account status...
              </p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  // ================= STRIPE ERROR STATE =================
  if (stripeError) {
    return (
      <div className="min-h-screen bg-[#f0f2f8]">
        <Sidebar role="vendor" />
        <div className="min-h-screen lg:ml-[270px]">
          <Topbar role="vendor" />
          <main className="p-5 lg:p-7">
            <div className="mx-auto max-w-2xl">
              <h1 className="mb-6 text-2xl font-semibold text-slate-800">
                Payouts
              </h1>
              <div className="rounded-2xl border border-red-100 bg-white p-8 text-center shadow-sm">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
                  <XCircle size={24} className="text-red-500" />
                </div>
                <p className="font-semibold text-red-700">
                  Unable to check Stripe account status
                </p>
                <p className="mt-1 text-sm text-red-500">
                  Please try again later.
                </p>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  // ================= NOT CONNECTED - SHOW ONBOARDING =================
  if (!isStripeConnected) {
    return (
      <div className="min-h-screen bg-[#f0f2f8]">
        <Sidebar role="vendor" />
        <div className="min-h-screen lg:ml-[270px]">
          <Topbar role="vendor" />
          <main className="p-5 lg:p-7">
            <div className="mx-auto max-w-2xl">
              {/* Header */}
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-800">Payouts</h1>
                <p className="mt-1 text-sm text-slate-500">
                  Connect your Stripe account to receive payouts
                </p>
              </div>

              {/* Onboarding Card */}
              <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
                {/* Card Header */}
                <div className="bg-gradient-to-r from-[#4630d8] via-[#365fe0] to-[#2e8ee8] px-6 py-7 text-white lg:px-8">
                  <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-white/15">
                      <CreditCard size={30} />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold lg:text-2xl">
                        Connect Stripe Account
                      </h2>
                      <p className="mt-1 text-sm text-white/80">
                        Set up your payment account to receive payouts
                      </p>
                    </div>
                  </div>
                </div>

                {/* Card Body */}
                <div className="px-6 py-7 lg:px-8 lg:py-8">
                  <h3 className="text-lg font-semibold text-slate-800">
                    Receive payments securely
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    Connect your Stripe account to receive payments from
                    customers and manage your payouts securely.
                  </p>

                  {/* Features */}
                  <div className="mt-7 space-y-5">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                        <ShieldCheck size={20} />
                      </div>
                      <div>
                        <p className="font-medium text-slate-800">
                          Secure payments
                        </p>
                        <p className="mt-1 text-sm leading-5 text-slate-500">
                          Your payment information is securely handled by
                          Stripe.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                        <ShieldCheck size={20} />
                      </div>
                      <div>
                        <p className="font-medium text-slate-800">
                          Fast payouts
                        </p>
                        <p className="mt-1 text-sm leading-5 text-slate-500">
                          Receive your earnings directly into your connected
                          account.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Connect Button */}
                  <button
                    type="button"
                    onClick={handleConnectStripe}
                    disabled={isOnboardingPending}
                    className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#4630d8] to-[#368de8] px-5 py-3.5 font-semibold text-white shadow-md transition-all duration-200 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isOnboardingPending
                      ? "Connecting..."
                      : "Connect Stripe Account"}
                    {!isOnboardingPending && <ArrowRight size={19} />}
                  </button>

                  <p className="mt-5 text-center text-xs text-slate-400">
                    You will be redirected to Stripe to complete the setup.
                  </p>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  // ================= CONNECTED - SHOW PAYOUTS =================
  return (
    <div className="min-h-screen bg-[#f0f2f8]">
      <Sidebar role="vendor" />

      <div className="min-h-screen lg:ml-[270px]">
        <Topbar role="vendor" />

        <main className="space-y-6 p-5 lg:p-7">
          {/* Header */}
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-slate-800">
                Payouts
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                Track your earnings and payout history
              </p>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5">
            {summaryCards.map((card, i) => {
              const Icon = card.icon;
              return (
                <div
                  key={card.label}
                  className="animate-fade-up group rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br ${card.tone} ${card.shadow} text-white shadow-md transition group-hover:scale-110`}
                  >
                    <Icon size={18} />
                  </div>
                  <p className="mt-3 text-lg font-bold text-slate-800">
                    {card.value}
                  </p>
                  <p className="mt-0.5 text-xs text-slate-500">{card.label}</p>
                </div>
              );
            })}
          </div>

          {/* Table Card */}
          <div className="animate-fade-up overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
            {/* Status Filters */}
            <div className="flex flex-wrap gap-2 px-5 py-3.5">
              {["all", "pending", "paid", "failed", "refunded"].map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setStatus(value)}
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

            {/* Table */}
            <div className="overflow-x-auto">
              {query.isLoading ? (
                <div className="flex min-h-[300px] items-center justify-center">
                  <div className="flex flex-col items-center gap-3">
                    <span className="h-8 w-8 animate-spin rounded-full border-[3px] border-indigo-500 border-t-transparent" />
                    <p className="text-sm text-slate-500">
                      Loading payouts...
                    </p>
                  </div>
                </div>
              ) : query.isError ? (
                <div className="flex min-h-[300px] items-center justify-center">
                  <p className="text-sm text-red-500">
                    Failed to load payouts. Please try again.
                  </p>
                </div>
              ) : payouts.length === 0 ? (
                <div className="flex min-h-[300px] flex-col items-center justify-center px-5 text-center">
                  <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
                    <Wallet size={26} className="text-slate-400" />
                  </div>
                  <h3 className="text-base font-semibold text-slate-700">
                    No Payouts Yet
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">
                    Your payout history will appear here once you start making
                    sales.
                  </p>
                </div>
              ) : (
                <table className="w-full min-w-[800px]">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50">
                      <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Payout
                      </th>
                      <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Order
                      </th>
                      <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Gross
                      </th>
                      <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Platform Fee
                      </th>
                      <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Your Earning
                      </th>
                      <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Status
                      </th>
                      <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {payouts.map((payout) => (
                      <tr
                        key={payout.id}
                        className="border-b border-slate-50 transition hover:bg-slate-50/60"
                      >
                        <td className="px-5 py-3.5">
                          <p className="text-sm font-semibold text-slate-700">
                            #{payout.id}
                          </p>
                        </td>
                        <td className="px-5 py-3.5 text-xs text-slate-500">
                          Order #{payout.order_id}
                        </td>
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
                          <span
                            className={`inline-block rounded-full px-2.5 py-1 text-[11px] font-semibold ${STATUS_STYLES[payout.payout_status] || "bg-slate-50 text-slate-500 border border-slate-200"}`}
                          >
                            {payout.payout_status}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-xs text-slate-500">
                          {payout.createdAt
                            ? new Date(
                                payout.createdAt,
                              ).toLocaleDateString()
                            : "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </main>
      </div>

      <style>
        {`
          @keyframes fadeUp {
            from { opacity: 0; transform: translateY(18px); }
            to   { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-up {
            animation: fadeUp 0.6s cubic-bezier(0.22, 1, 0.36, 1) both;
          }
        `}
      </style>
    </div>
  );
}

export default VendorPayouts;
