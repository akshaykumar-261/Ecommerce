import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Store, Eye } from "lucide-react";
import AdminLayout from "../../components/admin/AdminLayout";
import StatusBadge from "../../components/admin/StatusBadge";
import Pagination from "../../components/admin/Pagination";
import ConfirmDialog from "../../components/admin/ConfirmDialog";
import { TableSearch, TableShell, TableState } from "../../components/admin/Table";
import Button from "../../components/admin/Button";
import { useAdminVendors, useVendorAction } from "../../api/useAdminApi";
import toast from "react-hot-toast";

/*
 * Vendor management: searchable, filterable, paginated list plus the
 * approve/reject/block/delete actions. Each destructive action asks for
 * confirmation; the underlying PATCH invalidates the list via React Query.
 */

const STATUS_FILTERS = ["all", "approved", "rejected", "blocked", "unblocked", "deleted"];

function AdminVendors() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [confirm, setConfirm] = useState(null); // { vendor, action, title, message }

  const query = useAdminVendors(page, 8, search, status === "all" ? undefined : status);
  const vendorAction = useVendorAction();

  const rows = query.data?.data?.data || [];
  const pagination = query.data?.data;

  const runAction = () => {
    if (!confirm) return;
    vendorAction.mutate(
      { vendorId: confirm.vendorId, action: confirm.action },
      {
        onSuccess: (res) => {
          toast.success(res.message || "Vendor updated");
          setConfirm(null);
        },
        onError: (error) => {
          toast.error(error.response?.data?.message || "Action failed");
        },
      },
    );
  };

  return (
    <AdminLayout>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">Vendors</h1>
          <p className="mt-1 text-sm text-slate-500">
            Review, approve and manage seller accounts
          </p>
        </div>
        <TableSearch value={search} onChange={(v) => { setSearch(v); setPage(1); }} placeholder="Search vendors..." />
      </div>

      <div className="animate-fade-up overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
        {/* Filters */}
        <div className="flex flex-wrap gap-2 border-b border-slate-100 px-5 py-3.5">
          {STATUS_FILTERS.map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => { setStatus(filter); setPage(1); }}
              className={`rounded-full px-3.5 py-1.5 text-xs font-semibold capitalize transition ${
                status === filter
                  ? "bg-gradient-to-r from-indigo-600 to-blue-500 text-white shadow-md shadow-indigo-500/25"
                  : "bg-slate-50 text-slate-500 hover:bg-slate-100"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        <TableShell headers={["Vendor", "Contact", "Account", "Joined", "Actions"]}>
          {query.isLoading || query.isError || rows.length === 0 ? (
            <TableState
              loading={query.isLoading}
              error={query.isError}
              colSpan={5}
              empty="No vendors match this view"
            />
          ) : (
            rows.map((vendor) => (
              <tr key={vendor.id} className="transition hover:bg-slate-50/60">
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-indigo-500">
                      <Store size={16} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-700">
                        {vendor.name} {vendor.lastname}
                      </p>
                      <p className="text-[11px] text-slate-400">ID #{vendor.id}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3.5">
                  <p className="text-xs text-slate-600">{vendor.email}</p>
                  <p className="text-[11px] text-slate-400">{vendor.phoneNo || "-"}</p>
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex flex-wrap gap-1.5">
                    <StatusBadge status={vendor.is_account_enabled ? "approved" : "rejected"} />
                    <StatusBadge status={vendor.is_active ? "active" : "blocked"} />
                  </div>
                </td>
                <td className="px-5 py-3.5 text-xs text-slate-500">
                  {vendor.createdAt ? new Date(vendor.createdAt).toLocaleDateString() : "-"}
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      type="button"
                      onClick={() => navigate(`/admin/vendors/${vendor.id}`)}
                      className="rounded-lg p-2 text-slate-400 transition hover:bg-indigo-50 hover:text-indigo-600"
                      title="View details"
                    >
                      <Eye size={16} />
                    </button>
                    {vendor.is_account_enabled ? (
                      <Button variant="outline" className="!px-3 !py-1.5 !text-xs" onClick={() => setConfirm({
                        vendorId: vendor.id, action: "reject",
                        title: "Reject vendor",
                        message: `Disable marketplace access for ${vendor.name} ${vendor.lastname}? They will no longer be able to operate their store.`,
                        confirmLabel: "Reject",
                      })}>
                        Reject
                      </Button>
                    ) : (
                      <Button className="!px-3 !py-1.5 !text-xs" onClick={() => setConfirm({
                        vendorId: vendor.id, action: "approve",
                        title: "Approve vendor",
                        message: `Grant marketplace access to ${vendor.name} ${vendor.lastname}?`,
                        confirmLabel: "Approve",
                      })}>
                        Approve
                      </Button>
                    )}
                    <button
                      type="button"
                      onClick={() => setConfirm({
                        vendorId: vendor.id, action: "delete",
                        title: "Delete vendor",
                        message: `Permanently remove ${vendor.name} ${vendor.lastname}? Their store stays in records but access is removed. This cannot be undone from the panel.`,
                        confirmLabel: "Delete",
                      })}
                      className="rounded-lg px-3 py-1.5 text-xs font-semibold text-red-500 transition hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </TableShell>

        <Pagination pagination={pagination} onPageChange={setPage} />
      </div>

      <ConfirmDialog
        open={Boolean(confirm)}
        title={confirm?.title}
        message={confirm?.message}
        confirmLabel={confirm?.confirmLabel}
        loading={vendorAction.isPending}
        onConfirm={runAction}
        onCancel={() => setConfirm(null)}
      />
    </AdminLayout>
  );
}

export default AdminVendors;
