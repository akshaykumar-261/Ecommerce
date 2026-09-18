import { useState } from "react";
import { Package } from "lucide-react";
import AdminLayout from "../../components/admin/AdminLayout";
import StatusBadge from "../../components/admin/StatusBadge";
import Pagination from "../../components/admin/Pagination";
import { TableSearch, TableShell, TableState } from "../../components/admin/Table";
import { useAdminProducts, useAdminCategories, useUpdateProductStatus } from "../../api/useAdminApi";
import toast from "react-hot-toast";

/*
 * Global product moderation. Filters: search, category, vendor, status.
 * Status toggle PATCHes /admin/products/:id/status (0/1) and invalidates.
 */
function AdminProducts() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [status, setStatus] = useState("all");

  const categories = useAdminCategories("", undefined);
  const query = useAdminProducts(
    page,
    8,
    search,
    categoryId || undefined,
    undefined,
    status === "all" ? undefined : status,
  );
  const updateStatus = useUpdateProductStatus();

  const rows = query.data?.data?.data || [];
  const pagination = query.data?.data;

  const toggleStatus = (product) => {
    const next = product.status ? 0 : 1;
    updateStatus.mutate(
      { productId: product.id, status: next },
      {
        onSuccess: () => toast.success(`Product ${next ? "activated" : "deactivated"}`),
        onError: (error) => toast.error(error.response?.data?.error || "Update failed"),
      },
    );
  };

  return (
    <AdminLayout>
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">Products</h1>
          <p className="mt-1 text-sm text-slate-500">All listings across the marketplace</p>
        </div>
        <TableSearch value={search} onChange={(v) => { setSearch(v); setPage(1); }} placeholder="Search products..." />
      </div>

      <div className="animate-fade-up overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
        {/* Filters */}
        <div className="flex flex-col gap-3 border-b border-slate-100 px-5 py-3.5 sm:flex-row sm:items-center">
          <select
            value={categoryId}
            onChange={(e) => { setCategoryId(e.target.value); setPage(1); }}
            className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-600 outline-none focus:border-indigo-300"
          >
            <option value="">All Categories</option>
            {(categories.data?.data?.categories || []).map((c) => (
              <option key={c.id} value={c.id}>{c.cat_name}</option>
            ))}
          </select>

          <div className="flex gap-2">
            {["all", "1", "0"].map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => { setStatus(value); setPage(1); }}
                className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
                  status === value
                    ? "bg-gradient-to-r from-indigo-600 to-blue-500 text-white shadow-md shadow-indigo-500/25"
                    : "bg-slate-50 text-slate-500 hover:bg-slate-100"
                }`}
              >
                {value === "all" ? "All" : value === "1" ? "Active" : "Inactive"}
              </button>
            ))}
          </div>
        </div>

        <TableShell headers={["Product", "Store", "Category", "Price", "Status", "Action"]}>
          {query.isLoading || query.isError || rows.length === 0 ? (
            <TableState
              loading={query.isLoading}
              error={query.isError}
              colSpan={6}
              empty="No products match these filters"
            />
          ) : (
            rows.map((product) => {
              const media = (product.product_media || []).find((m) => m.is_primary) || product.product_media?.[0];
              return (
                <tr key={product.id} className="transition hover:bg-slate-50/60">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      {media?.media_url ? (
                        <img src={media.media_url} alt="" className="h-9 w-9 rounded-lg object-cover" />
                      ) : (
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-400">
                          <Package size={15} />
                        </div>
                      )}
                      <div className="max-w-[220px]">
                        <p className="truncate text-sm font-medium text-slate-700">{product.pro_name}</p>
                        <p className="text-[11px] text-slate-400">ID #{product.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-xs text-slate-600">
                    {product.store?.store_name || "-"}
                  </td>
                  <td className="px-5 py-3.5 text-xs text-slate-600">
                    {product.category?.cat_name || "-"}
                  </td>
                  <td className="px-5 py-3.5 text-xs font-semibold text-slate-700">
                    ₹{product.discount_price > 0 && product.discount_price < product.price
                      ? product.discount_price
                      : product.price}
                  </td>
                  <td className="px-5 py-3.5">
                    <StatusBadge status={product.status ? "active" : "inactive"} />
                  </td>
                  <td className="px-5 py-3.5">
                    <button
                      type="button"
                      onClick={() => toggleStatus(product)}
                      disabled={updateStatus.isPending}
                      className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition disabled:opacity-50 ${
                        product.status
                          ? "text-red-500 hover:bg-red-50"
                          : "text-emerald-600 hover:bg-emerald-50"
                      }`}
                    >
                      {product.status ? "Deactivate" : "Activate"}
                    </button>
                  </td>
                </tr>
              );
            })
          )}
        </TableShell>

        <Pagination pagination={pagination} onPageChange={setPage} />
      </div>
    </AdminLayout>
  );
}

export default AdminProducts;
