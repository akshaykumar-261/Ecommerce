import {
  Package,
  CheckCircle2,
  XCircle,
  PackageX,
  AlertTriangle,
  Plus,
  ArrowRight,
  Store,
  Sparkles,
  WalletCards,
  LayoutGrid,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/common/SideBar";
import Topbar from "../../components/common/Topbar";
import { useVenderDashboard, useGetStore } from "../../api/useVendorApi";

function Dashboard() {
  const navigate = useNavigate();
  const { data, isLoading, isError } = useVenderDashboard();
  const { data: storeData } = useGetStore();
  const dashboard = data?.data?.dashboard || {};
  const storeName = storeData?.data?.store?.store_name || "there";
  const total = dashboard?.totalProduct || 0;
  const stats = [
    {
      label: "Total Products",
      value: dashboard?.totalProduct || 0,
      icon: Package,
      iconBg: "from-violet-500 to-fuchsia-500",
      iconShadow: "shadow-violet-500/25",
      bar: "from-violet-500 to-fuchsia-500",
    },
    {
      label: "Active Products",
      value: dashboard?.active || 0,
      icon: CheckCircle2,
      iconBg: "from-emerald-500 to-teal-500",
      iconShadow: "shadow-emerald-500/25",
      bar: "from-emerald-500 to-teal-500",
    },
    {
      label: "Inactive Products",
      value: dashboard?.inactive || 0,
      icon: XCircle,
      iconBg: "from-indigo-500 to-blue-500",
      iconShadow: "shadow-indigo-500/25",
      bar: "from-indigo-500 to-blue-500",
    },
    {
      label: "Out of Stock",
      value: dashboard?.outOfStock || 0,
      icon: PackageX,
      iconBg: "from-red-500 to-rose-500",
      iconShadow: "shadow-red-500/25",
      bar: "from-red-500 to-rose-500",
    },
    {
      label: "Low Stock",
      value: dashboard?.lowStock || 0,
      icon: AlertTriangle,
      iconBg: "from-amber-500 to-orange-500",
      iconShadow: "shadow-amber-500/25",
      bar: "from-amber-500 to-orange-500",
    },
  ];

  const quickLinks = [
  
    {
      label: "Manage Products",
      description: "View and edit your catalog",
      path: "/vendor/addProduct",
      icon: LayoutGrid,
      iconBg: "from-indigo-500 to-blue-500",
    },
    {
      label: "Store Settings",
      description: "Update your business details",
      path: "/vendor/store-settings",
      icon: Store,
      iconBg: "from-amber-500 to-orange-500",
    },
    {
      label: "Payouts",
      description: "View your earnings and payout history",
      path: "/vendor/payouts",
      icon: WalletCards,
      iconBg: "from-violet-500 to-purple-500",
    },
  ];

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-[#f0f2f8]">
      <Sidebar role="vendor" />

      <div className="min-h-screen lg:ml-[270px]">
        <Topbar role="vendor" userName={storeName} />

        <main className="space-y-6 p-5 lg:p-7">
          {/* ================= HERO ================= */}
          <section className="animate-fade-up relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#4630d8] via-[#365fe0] to-[#2e8ee8] p-7 text-white shadow-[0_16px_50px_-12px_rgba(70,48,216,0.5)] sm:p-9">
            {/* decorative blur circles */}
            <div className="animate-float-slow absolute -right-20 -top-24 h-72 w-72 rounded-full bg-white/10 blur-2xl" />
            <div className="animate-float-slow absolute -bottom-28 left-1/3 h-64 w-64 rounded-full bg-fuchsia-400/20 blur-2xl [animation-delay:1.5s]" />
            <div className="absolute right-8 top-8 hidden rounded-2xl border border-white/15 bg-white/10 p-3 backdrop-blur-md md:block">
              <Sparkles size={22} className="animate-float text-amber-200" />
            </div>

            <div className="relative">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/60">
                {today}
              </p>
              <h1 className="mt-2 text-2xl font-bold leading-tight sm:text-3xl">
                Welcome back, {storeName} 👋
              </h1>
              <p className="mt-2 max-w-xl text-sm text-white/80">
                Here's what's happening with your store today. Keep growing —
                your customers are waiting.
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-3">
               
                <button
                  type="button"
                  onClick={() => navigate("/vendor/store-settings")}
                  className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/20"
                >
                  Manage Store
                  <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1" />
                </button>
              </div>
            </div>
          </section>

          {/* ================= LOADING / ERROR ================= */}
          {isLoading && (
            <div className="flex min-h-[260px] flex-col items-center justify-center gap-3 rounded-2xl border border-slate-100 bg-white">
              <span className="h-10 w-10 animate-spin rounded-full border-[3px] border-violet-500 border-t-transparent" />
              <p className="text-sm text-slate-500">Loading dashboard...</p>
            </div>
          )}

          {isError && !isLoading && (
            <div className="flex min-h-[260px] items-center justify-center rounded-2xl border border-red-100 bg-white">
              <div className="text-sm text-red-500">
                Failed to load dashboard. Please try again.
              </div>
            </div>
          )}

          {!isLoading && !isError && (
            <>
              {/* ================= STAT CARDS ================= */}
              <section className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5">
                {stats.map((stat, i) => {
                  const Icon = stat.icon;
                  const pct = total ? Math.round((stat.value / total) * 100) : 0;

                  return (
                    <div
                      key={stat.label}
                      className="animate-fade-up group relative overflow-hidden rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-white hover:shadow-xl hover:shadow-slate-200/70"
                      style={{ animationDelay: `${150 + i * 90}ms` }}
                    >
                      <div className="flex items-start justify-between">
                        <div
                          className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${stat.iconBg} ${stat.iconShadow} text-white transition-all duration-300 group-hover:scale-110 group-hover:-rotate-3`}
                        >
                          <Icon size={22} />
                        </div>

                        <span className="rounded-full bg-slate-50 px-2 py-0.5 text-[11px] font-semibold text-slate-500 transition group-hover:bg-slate-100">
                          {pct}%
                        </span>
                      </div>

                      <p className="mt-4 text-3xl font-bold text-slate-800 transition-colors duration-300 group-hover:text-indigo-600">
                        {stat.value}
                      </p>

                      <p className="mt-1 text-sm text-slate-500">
                        {stat.label}
                      </p>

                      <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                        <div
                          className={`h-full rounded-full bg-gradient-to-r ${stat.bar} transition-all duration-1000`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </section>

              {/* ================= QUICK ACTIONS ================= */}
              <section>
                <div className="mb-4 flex items-center gap-2">
                  <span className="h-5 w-1 rounded-full bg-gradient-to-b from-violet-500 to-blue-500" />
                  <h2 className="text-base font-semibold text-slate-800">
                    Quick Actions
                  </h2>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {quickLinks.map((link, i) => {
                    const Icon = link.icon;

                    return (
                      <button
                        key={link.label}
                        type="button"
                        onClick={() => navigate(link.path)}
                        className="animate-fade-up group relative overflow-hidden rounded-2xl border border-slate-100 bg-white p-5 text-left shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-indigo-100"
                        style={{ animationDelay: `${300 + i * 90}ms` }}
                      >
                        <div
                          className={`absolute -right-6 -top-6 h-20 w-20 rounded-full bg-gradient-to-br ${link.iconBg} opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-30`}
                        />

                        <div className="relative flex items-center justify-between">
                          <div
                            className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${link.iconBg} text-white shadow-lg transition-transform duration-300 group-hover:scale-110`}
                          >
                            <Icon size={20} />
                          </div>

                          <ArrowRight
                            size={18}
                            className="text-slate-300 transition-all duration-300 group-hover:translate-x-1 group-hover:text-indigo-500"
                          />
                        </div>

                        <p className="relative mt-4 text-sm font-semibold text-slate-800">
                          {link.label}
                        </p>

                        <p className="relative mt-1 text-xs text-slate-400">
                          {link.description}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </section>
            </>
          )}
        </main>
      </div>

      {/* ================= ANIMATIONS ================= */}
      <style>
        {`
          @keyframes fadeUp {
            from { opacity: 0; transform: translateY(18px); }
            to   { opacity: 1; transform: translateY(0); }
          }
          @keyframes float {
            0%, 100% { transform: translateY(0); }
            50%      { transform: translateY(-6px); }
          }
          .animate-fade-up {
            animation: fadeUp 0.6s cubic-bezier(0.22, 1, 0.36, 1) both;
          }
          .animate-float {
            animation: float 3s ease-in-out infinite;
          }
          .animate-float-slow {
            animation: float 5s ease-in-out infinite;
          }
        `}
      </style>
    </div>
  );
}

export default Dashboard;