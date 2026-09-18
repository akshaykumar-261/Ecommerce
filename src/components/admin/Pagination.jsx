import { ChevronLeft, ChevronRight } from "lucide-react";

/**
 * Shared pagination footer for admin tables. Reads the backend pagination
 * envelope: { totalRecords, totalPages, currentPage, pageSize } and calls
 * onPageChange(nextPage) — the page owns the page state and the query key.
 */
function Pagination({ pagination, onPageChange }) {
  if (!pagination || !pagination.totalRecords) return null;
  const { currentPage, totalPages, totalRecords } = pagination;

  const navButton =
    "rounded-lg border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40";

  return (
    <div className="flex flex-col items-center justify-between gap-3 border-t border-slate-100 px-5 py-4 sm:flex-row">
      <p className="text-xs text-slate-500">
        Showing page <span className="font-semibold text-slate-700">{currentPage}</span> of{" "}
        <span className="font-semibold text-slate-700">{totalPages}</span> ·{" "}
        {totalRecords} records
      </p>

      <div className="flex items-center gap-2">
        <button
          type="button"
          aria-label="Previous page"
          className={navButton}
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          <ChevronLeft size={16} />
        </button>

        <span className="rounded-lg bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-600">
          {currentPage} / {totalPages}
        </span>

        <button
          type="button"
          aria-label="Next page"
          className={navButton}
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}

export default Pagination;