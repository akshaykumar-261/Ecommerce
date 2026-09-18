
/**
 * Small stat tile for the admin dashboard. Purely presentational — the page
 * computes values and passes them in.
 */
function StatCard({ label, value, icon: Icon, tone = "indigo", delay = 0 }) {
  const tones = {
    indigo: "from-indigo-500 to-blue-500 shadow-indigo-500/25",
    violet: "from-violet-500 to-fuchsia-500 shadow-violet-500/25",
    emerald: "from-emerald-500 to-teal-500 shadow-emerald-500/25",
    amber: "from-amber-500 to-orange-500 shadow-amber-500/25",
    rose: "from-rose-500 to-red-500 shadow-rose-500/25",
    sky: "from-sky-500 to-cyan-500 shadow-sky-500/25",
  };

  return (
    <div
      className="animate-fade-up group rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/70"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div
        className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-lg transition-transform duration-300 group-hover:scale-110 ${
          tones[tone] || tones.indigo
        }`}
      >
        <Icon size={22} />
      </div>
      <p className="mt-4 text-3xl font-bold text-slate-800">{value}</p>
      <p className="mt-1 text-sm text-slate-500">{label}</p>
    </div>
  );
}

export default StatCard;