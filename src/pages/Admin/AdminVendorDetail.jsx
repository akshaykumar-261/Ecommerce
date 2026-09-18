import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Store, Package, ShoppingBag, IndianRupee, Wallet } from "lucide-react";
import AdminLayout from "../../components/admin/AdminLayout";
import StatusBadge from "../../components/admin/StatusBadge";
import { TableSearch, TableShell, TableState } from "../../components/admin/Table";
import { useAdminVendorDashboard, useVendorStoreDetails, useVendorAction } from "../../api/useAdminApi";
import ConfirmDialog from "../../components/admin/ConfirmDialog";
import toast from "react-hot-toast";

/*
 * Vendor 360 view: profile stats from /admin/vender/dashBoard/:id plus the
 * store profile and product list from /admin/vendor/store/:id.
 */
function AdminVendorDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [confirm, setConfirm] = useState(null);

  const dashboard = useAdminVendorDashboard(id);
  const storeDetails = useVendorStoreDetails(id, search);
  const vendorAction = useVendorAction();

  const store = storeDetails?.data?.data;
  const products = store?.products || [];
  const isLoading = storeDetails.isLoading;
  const isError = storeDetails.isError;

  return (
    <AdminLayout>
      <button
        type="button"
        onClick={() => navigate("/admin/vendors")}
        className="mb-5 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 transition hover:text-indigo-600"
      >
        <ArrowLeft size={16} />
        Back to vendors
      </button>

      {/* Vendor metrics */}
      <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        <MetricCard icon={Package} label="Total Products" value={dashboard.data?.data?.total_products ?? 0} tone="from-indigo-500 to-blue-500" />
        <MetricCard icon={ShoppingBag} label="Total Orders" value={dashboard.data?.data?.total_orders ?? 0} tone="from-violet-500 to-fuchsia-500" />
        <MetricCard icon={IndianRupee} label="Total Sales" value={dashboard.data?.data?.total_sales ?? 0} tone="from-emerald-500 to-teal-500" />
        <MetricCard icon={Wallet} label="Earnings" value={dashboard.data?.data?.total_earnings ?? 0} tone="from-amber-500 to-orange-500" />
      </div>

      {/* Store card */}
      <div className="animate-fade-up overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
        {isLoading && (
          <div className="p-10 text-center text-sm text-slate-400">Loading vendor store...</div>
        )}
        {isError && (
          <div className="p-10 text-center text-sm text-red-400">
            Failed to load vendor store.
          </div>
        )}
        {store && (
          <>
            <div className="flex flex-col gap-4 border-b border-slate-100 p-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                {store.store?.store_logo ? (
                  <img src={store.store.store_logo} alt="logo" className="h-14 w-14 rounded-xl object-cover ring-2 ring-indigo-100" />
                ) : (
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-indigo-50 text-indigo-500">
                    <Store size={22} />
                  </div>
                )}
                <div>
                  <h2 className="text-lg font-bold text-slate-800">{store.store?.store_name}</h2>
                  <p className="text-xs text-slate-400">/{store.store?.slug}</p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <StatusBadge status={store.store?.is_active ? "active" : "inactive"} />
                <StatusBadge status={store.store?.is_verified ? "verified" : "pending"} />
              </div>
            </div>

            <div className="border-t border-slate-100 px-6 py-3.5">
              <TableSearch value={search} onChange={setSearch} placeholder="Search products..." />
            </div>

            <TableShell headers={["Product", "Price", "Stock", "Status"]}>
              {products.length === 0 ? (
                <TableState colSpan={4} empty="No products for this vendor" />
              ) : (
                products.map((product) => (
                  <tr key={product.id} className="transition hover:bg-slate-50/60">
                    <td className="px-5 py-3.5 text-sm font-medium text-slate-700">{product.pro_name}</td>
                    <td className="px-5 py-3.5 text-xs text-slate-600">₹{product.price}</td>
                    <td className="px-5 py-3.5 text-xs text-slate-600">{product.quantity}</td>
                    <td className="px-5 py-3.5">
                      <StatusBadge status={product.status ? "active" : "inactive"} />
                    </td>
                  </tr>
                ))
              )}
            </TableShell>
          </>
        )}
      </div>

      <ConfirmDialog
        open={Boolean(confirm)}
        title={confirm?.title}
        message={confirm?.message}
        loading={vendorAction.isPending}
        onConfirm={() => {
          if (!confirm) return;
          vendorAction.mutate(
            { vendorId: id, action: confirm.action },
            {
              onSuccess: (res) => { toast.success(res.message || "Updated"); setConfirm(null); },
              onError: (error) => toast.error(error.response?.data?.message || "Action failed"),
            },
          );
        }}
        onCancel={() => setConfirm(null)}
      />
    </AdminLayout>
  );
}

function MetricCard({ icon: Icon, label, value, tone }) {
  return (
    <div className="animate-fade-up group rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
      <div className={`flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br ${tone} text-white shadow-md transition group-hover:scale-110`}>
        <Icon size={18} />
      </div>
      <p className="mt-3 text-xl font-bold text-slate-800">{Number(value).toLocaleString()}</p>
      <p className="mt-0.5 text-xs text-slate-500">{label}</p>
    </div>
  );
}

export default AdminVendorDetail;
