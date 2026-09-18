import { Search, AlertTriangle, Inbox } from "lucide-react";

/**
 * Shared table chrome: search box, table shell with sticky header,
 * loading / empty / error states. All admin list pages compose these so the
 * UX stays consistent and each page only defines columns + rows.
 */

export function TableSearch({ value, onChange, placeholder = "Search..." }) {
  return (
    <div className="relative">
      <Search
        size={16}
        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-slate-200 bg-slate-50/70 py-2.5 pl-10 pr-3 text-sm text-slate-700 outline-none transition focus:border-indigo-300 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 sm:w-64"
      />
    </div>
  );
}

export function TableShell({ headers, children }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[720px] text-left">
        <thead>
          <tr className="border-b border-slate-100 bg-slate-50/60">
            {headers.map((header) => (
              <th
                key={header}
                className="px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">{children}</tbody>
      </table>
    </div>
  );
}

export function TableState({ loading, error, empty, colSpan }) {
  if (loading) {
    return (
      <tr>
        <td colSpan={colSpan} className="px-5 py-16 text-center">
          <span className="mx-auto block h-8 w-8 animate-spin rounded-full border-[3px] border-indigo-500 border-t-transparent" />
          <p className="mt-3 text-xs text-slate-400">Loading...</p>
        </td>
      </tr>
    );
  }
  if (error) {
    return (
      <tr>
        <td colSpan={colSpan} className="px-5 py-16 text-center">
          <AlertTriangle size={28} className="mx-auto text-red-300" />
          <p className="mt-2 text-xs text-red-400">
            Something went wrong. Please retry.
          </p>
        </td>
      </tr>
    );
  }
  return (
    <tr>
      <td colSpan={colSpan} className="px-5 py-16 text-center">
        <Inbox size={28} className="mx-auto text-slate-300" />
        <p className="mt-2 text-xs text-slate-400">{empty || "No records found"}</p>
      </td>
    </tr>
  );
}