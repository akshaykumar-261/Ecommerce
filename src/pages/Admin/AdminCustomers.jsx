import { useState } from "react";
import { ShieldOff, ShieldCheck } from "lucide-react";
import AdminLayout from "../../components/admin/AdminLayout";
import StatusBadge from "../../components/admin/StatusBadge";
import Pagination from "../../components/admin/Pagination";
import ConfirmDialog from "../../components/admin/ConfirmDialog";
import { TableSearch, TableShell, TableState } from "../../components/admin/Table";
import { useAdminUsers, useUpdateUserStatus } from "../../api/useAdminApi";
import toast from "react-hot-toast";

/*
 * Customer accounts (role_Id 3). Admin can block/unblock via PATCH
 * /admin/users/:id/status; deletion is not exposed by the backend.
 */
function AdminCustomers() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [confirm, setConfirm] = useState(null);

  const query = useAdminUsers(page, 8, search, status === "all" ? undefined : status);
  const updateStatus = useUpdateUserStatus();

  const rows = query.data?.data?.data || [];
  const pagination = query.data?.data;

  const toggleStatus = () => {
    if (!confirm) return;
    updateStatus.mutate(
      { userId: confirm.userId, isActive: confirm.nextActive },
      {
        onSuccess: (res) => {
          toast.success(res.message || "Customer updated");
          setConfirm(null);
        },
        onError: (error) => toast.error(error.response?.data?.message || "Update failed"),
      },
    );
  };

  return (
    <AdminLayout>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">Customers</h1>
          <p className="mt-1 text-sm text-slate-500">Registered buyer accounts</p>
        </div>
        <TableSearch
          value={search}
          onChange={(v) => { setSearch(v); setPage(1); }}
          placeholder="Search customers..."
        />
      </div>

      <div className="animate-fade-up overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
        <div className="flex flex-wrap gap-2 px-5 py-3.5">
          {["all", "unblocked", "blocked"].map((filter) => (
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

        <TableShell headers={["Customer", "Contact", "Status", "Joined", "Actions"]}>
          {query.isLoading || query.isError || rows.length === 0 ? (
            <TableState
              loading={query.isLoading}
              error={query.isError}
              colSpan={5}
              empty="No customers found"
            />
          ) : (
            rows.map((user) => (
              <tr key={user.id} className="transition hover:bg-slate-50/60">
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-blue-500 text-xs font-bold text-white">
                      {(user.name || "U").charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-700">{user.name} {user.lastname}</p>
                      <p className="text-[11px] text-slate-400">ID #{user.id}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3.5">
                  <p className="text-xs text-slate-600">{user.email}</p>
                  <p className="text-[11px] text-slate-400">{user.phoneNo || "-"}</p>
                </td>
                <td className="px-5 py-3.5">
                  <StatusBadge status={user.is_active ? "active" : "blocked"} />
                </td>
                <td className="px-5 py-3.5 text-xs text-slate-500">
                  {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "-"}
                </td>
                <td className="px-5 py-3.5">
                  <button
                    type="button"
                    onClick={() =>
                      setConfirm({
                        userId: user.id,
                        nextActive: !user.is_active,
                        title: user.is_active ? "Block customer" : "Unblock customer",
                        message: user.is_active
                          ? `${user.name} will lose access to their account until unblocked.`
                          : `${user.name} will regain full account access.`,
                        confirmLabel: user.is_active ? "Block" : "Unblock",
                      })
                    }
                    className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                      user.is_active
                        ? "text-red-500 hover:bg-red-50"
                        : "text-emerald-600 hover:bg-emerald-50"
                    }`}
                  >
                    {user.is_active ? <ShieldOff size={14} /> : <ShieldCheck size={14} />}
                    {user.is_active ? "Block" : "Unblock"}
                  </button>
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
        confirmLabel={confirm?.title?.split(" ")[0]}
        loading={updateStatus.isPending}
        onConfirm={toggleStatus}
        onCancel={() => setConfirm(null)}
      />
    </AdminLayout>
  );
}

export default AdminCustomers;
