import { useState } from "react";
import { Plus, Pencil, Trash2, Tags, Package, Star } from "lucide-react";
import AdminLayout from "../../components/admin/AdminLayout";
import StatusBadge from "../../components/admin/StatusBadge";
import ConfirmDialog from "../../components/admin/ConfirmDialog";
import Button from "../../components/admin/Button";
import Pagination from "../../components/admin/Pagination";
import { TableShell, TableState } from "../../components/admin/Table";
import {
  useAdminCategories,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
  useProductsByCategoryId,
  useProductsByCategoryAndRating,
} from "../../api/useAdminApi";
import toast from "react-hot-toast";

/*
 * Category CRUD. The backend derives the slug from cat_name, so the panel
 * only collects the display name.
 */
function AdminCategories() {
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(null); // { mode: "create" | "edit", category, name }
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [viewProducts, setViewProducts] = useState(null); // category object

  const query = useAdminCategories(search, undefined);
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();

  const categories = query.data?.data?.categories;
  const rows = Array.isArray(categories) ? categories : [];

  const submitModal = (e) => {
    e.preventDefault();
    const name = modal?.name?.trim();
    if (!name) return;
    if (modal?.mode === "create") {
      createCategory.mutate(
        { cat_name: name },
        {
          onSuccess: (res) => {
            toast.success(res?.message || "Category created");
            setModal(null);
          },
          onError: (error) => toast.error(error?.response?.data?.error || "Create failed"),
        },
      );
    } else if (modal?.mode === "edit" && modal?.category?.id) {
      updateCategory.mutate(
        { categoryId: modal.category.id, data: { cat_name: name } },
        {
          onSuccess: (res) => {
            toast.success(res?.message || "Category updated");
            setModal(null);
          },
          onError: (error) => toast.error(error?.response?.data?.error || "Update failed"),
        },
      );
    }
  };

  return (
    <AdminLayout>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">Categories</h1>
          <p className="mt-1 text-sm text-slate-500">Marketplace taxonomy</p>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search categories..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50/70 px-4 py-2.5 text-sm outline-none transition focus:border-indigo-300 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 sm:w-56"
          />
          <Button onClick={() => setModal({ mode: "create", name: "" })}>
            <Plus size={16} />
            Add Category
          </Button>
        </div>
      </div>

      <div className="animate-fade-up overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
        <TableShell headers={["Category", "Slug", "Status", "Actions"]}>
          {query.isLoading || query.isError || rows.length === 0 ? (
            <TableState
              loading={query.isLoading}
              error={query.isError}
              colSpan={4}
              empty="No categories yet"
            />
          ) : (
            rows.filter(Boolean).map((category) => (
              <tr key={category?.id} className="transition hover:bg-slate-50/60">
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-50 text-violet-500">
                      <Tags size={15} />
                    </div>
                    <span className="text-sm font-medium text-slate-700">{category?.cat_name}</span>
                  </div>
                </td>
                <td className="px-5 py-3.5">
                  <code className="rounded bg-slate-50 px-2 py-1 text-[11px] text-slate-500">
                    /{category?.slug}
                  </code>
                </td>
                <td className="px-5 py-3.5">
                  <StatusBadge status={category?.is_active ? "active" : "inactive"} />
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      type="button"
                      onClick={() => category && setViewProducts(category)}
                      className="rounded-lg p-2 text-slate-400 transition hover:bg-emerald-50 hover:text-emerald-600"
                      title="View Products"
                    >
                      <Package size={15} />
                    </button>
                    <button
                      type="button"
                      onClick={() => category && setModal({ mode: "edit", category, name: category.cat_name || "" })}
                      className="rounded-lg p-2 text-slate-400 transition hover:bg-indigo-50 hover:text-indigo-600"
                      title="Rename"
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      type="button"
                      onClick={() => category && setConfirmDelete(category)}
                      className="rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-500"
                      title="Delete"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </TableShell>
      </div>

      {/* Create / edit modal */}
      {modal && (
        <div className="animate-fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <form
            onSubmit={submitModal}
            className="w-full max-w-sm rounded-3xl bg-white p-7 shadow-2xl"
          >
            <h3 className="text-lg font-semibold text-slate-900">
              {modal.mode === "create" ? "New Category" : "Rename Category"}
            </h3>
            <p className="mt-1 text-xs text-slate-400">
              The slug is generated automatically from the name.
            </p>
            <input
              type="text"
              autoFocus
              value={modal?.name || ""}
              onChange={(e) => setModal({ ...modal, name: e.target.value })}
              placeholder="Category name"
              className="mt-4 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none transition focus:border-indigo-300 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
            />
            <div className="mt-5 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setModal(null)}
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
              >
                Cancel
              </button>
              <Button
                type="submit"
                loading={createCategory.isPending || updateCategory.isPending}
              >
                {modal.mode === "create" ? "Create" : "Save"}
              </Button>
            </div>
          </form>
        </div>
      )}

      <ConfirmDialog
        open={Boolean(confirmDelete)}
        title="Delete category"
        message={`Remove "${confirmDelete?.cat_name}"? Products in this category may need reassignment.`}
        confirmLabel="Delete"
        loading={deleteCategory.isPending}
        onConfirm={() => {
          if (!confirmDelete?.id) return;
          deleteCategory.mutate(confirmDelete.id, {
            onSuccess: (res) => {
              toast.success(res?.message || "Category deleted");
              setConfirmDelete(null);
            },
            onError: (error) =>
              toast.error(error?.response?.data?.error || "Delete failed"),
          });
        }}
        onCancel={() => setConfirmDelete(null)}
      />

      {/* View Products modal */}
      {viewProducts && (
        <CategoryProductsModal
          category={viewProducts}
          onClose={() => setViewProducts(null)}
        />
      )}
    </AdminLayout>
  );
}

export default AdminCategories;

function CategoryProductsModal({ category, onClose }) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [rating, setRating] = useState(null);

  const ratingQuery = useProductsByCategoryAndRating(
    category.id,
    page,
    8,
    rating,
    search,
  );

  const allQuery = useProductsByCategoryId(category.id, page, 8, search);

  const query = rating ? ratingQuery : allQuery;
  const products = query.data?.data?.products?.data || query.data?.data?.data || [];
  const pagination = query.data?.data?.products || query.data?.data;

  return (
    <div className="animate-fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="animate-pop flex max-h-[85vh] w-full max-w-3xl flex-col rounded-3xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              Products in "{category.cat_name}"
            </h3>
            <p className="mt-0.5 text-xs text-slate-400">Browse and filter by rating</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
          >
            ✕
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 border-b border-slate-100 px-6 py-3">
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search products..."
            className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm outline-none transition focus:border-indigo-300 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
          />
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => { setRating(null); setPage(1); }}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                rating === null
                  ? "bg-indigo-500 text-white"
                  : "bg-slate-100 text-slate-500 hover:bg-slate-200"
              }`}
            >
              All
            </button>
            {[1, 2, 3, 4, 5].map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => { setRating(r); setPage(1); }}
                className={`flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition ${
                  rating === r
                    ? "bg-amber-400 text-white"
                    : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                }`}
              >
                {r}
                <Star size={11} fill={rating === r ? "white" : "currentColor"} />
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {query.isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-16 animate-pulse rounded-xl bg-slate-100" />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="py-12 text-center">
              <Package size={32} className="mx-auto text-slate-300" />
              <p className="mt-3 text-sm text-slate-400">No products found</p>
            </div>
          ) : (
            <div className="space-y-2">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/60 px-4 py-3 transition hover:bg-slate-50"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-500">
                      <Package size={16} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-700">{product.pro_name}</p>
                      <p className="text-[11px] text-slate-400">
                        ₹{Number(product.price || 0).toLocaleString()}
                        {product.rating != null && (
                          <span className="ml-2 inline-flex items-center gap-0.5 text-amber-500">
                            <Star size={10} fill="currentColor" /> {product.rating}
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                  <StatusBadge status={product.is_active ? "active" : "inactive"} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer pagination */}
        {pagination?.totalPages > 1 && (
          <div className="border-t border-slate-100 px-6 py-3">
            <Pagination pagination={pagination} onPageChange={setPage} />
          </div>
        )}
      </div>
    </div>
  );
}
