import { useState } from "react";
import { ChevronDown } from "lucide-react";
import AdminLayout from "../../components/admin/AdminLayout";
import { useAdminOrders } from "../../api/useAdminApi";
import StatusBadge from "../../components/admin/StatusBadge";
import Pagination from "../../components/admin/Pagination";
import { TableSearch, TableShell, TableState } from "../../components/admin/Table";

/*
 * All marketplace orders with items. Search hits order_number (backend LIKE).
 * Item rows are collapsed by default to keep the table scannable.
 */
const ORDER_STATUSES = ["all", "Pending", "Confirmed", "Packed", "Shipped", "Delivered", "Cancelled"];

function AdminOrders() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("all");
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState(null);

  const query = useAdminOrders(
    page,
    8,
    status === "all" ? undefined : status,
    search,
  );

  const rows = query.data?.data?.data || [];
  const pagination = query.data?.data;

  return (
    <AdminLayout>
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">Orders</h1>
          <p className="mt-1 text-sm text-slate-500">Every order across all vendors</p>
        </div>
        <TableSearch value={search} onChange={(v) => { setSearch(v); setPage(1); }} placeholder="Search order #..." />
      </div>

      <div className="animate-fade-up overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
        <div className="flex flex-wrap gap-2 px-5 py-3.5">
          {ORDER_STATUSES.map((value) => (
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
              {value}
            </button>
          ))}
        </div>

        <TableShell headers={["Order", "Payment", "Status", "Total", "Items", "Date", ""]}>
          {query.isLoading || query.isError || rows.length === 0 ? (
            <TableState
              loading={query.isLoading}
              error={query.isError}
              colSpan={7}
              empty="No orders found"
            />
          ) : (
            rows.map((order) => (
              <OrderRow
                key={order.id}
                order={order}
                expanded={expanded === order.id}
                onToggle={() => setExpanded(expanded === order.id ? null : order.id)}
              />
            ))
          )}
        </TableShell>

        <Pagination pagination={pagination} onPageChange={setPage} />
      </div>
    </AdminLayout>
  );
}

function OrderRow({ order, expanded, onToggle }) {
  return (
    <>
      <tr className="cursor-pointer transition hover:bg-slate-50/60" onClick={onToggle}>
        <td className="px-5 py-3.5">
          <p className="text-sm font-semibold text-slate-700">{order.order_number}</p>
          <p className="text-[11px] text-slate-400">ID #{order.id}</p>
        </td>
        <td className="px-5 py-3.5">
          <StatusBadge status={order.payment_status} />
        </td>
        <td className="px-5 py-3.5">
          <StatusBadge status={order.order_status} />
        </td>
        <td className="px-5 py-3.5 text-sm font-semibold text-slate-700">
          ₹{Number(order.grand_total).toLocaleString()}
        </td>
        <td className="px-5 py-3.5 text-xs text-slate-500">
          {order.orderItems?.length || 0}
        </td>
        <td className="px-5 py-3.5 text-xs text-slate-500">
          {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "-"}
        </td>
        <td className="px-5 py-3.5 text-right">
          <ChevronDown
            size={16}
            className={`inline text-slate-400 transition-transform duration-300 ${expanded ? "rotate-180" : ""}`}
          />
        </td>
      </tr>

      {expanded && (
        <tr className="bg-slate-50/70">
          <td colSpan={7} className="px-5 py-4">
            <div className="space-y-2">
              {(order.orderItems || []).map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-lg border border-slate-100 bg-white px-4 py-2.5"
                >
                  <div>
                    <p className="text-xs font-medium text-slate-700">
                      {item.product?.pro_name || `Product #${item.product_id}`}
                    </p>
                    <p className="text-[11px] text-slate-400">Qty {item.quantity}</p>
                  </div>
                  <p className="text-xs font-semibold text-slate-600">
                    ₹{Number(item.total ?? item.price ?? 0).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

export default AdminOrders;
