import { useState } from "react";
import {
  ShoppingBag,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Package,
} from "lucide-react";
import Sidebar from "../../components/common/SideBar";
import Topbar from "../../components/common/Topbar";
import { useGetOrders, useUpdateOrderStatus } from "../../api/useVendorApi";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const ORDER_STATUSES = [
  "All",
  "Pending",
  "Confirmed",
  "Packed",
  "Shipped",
  "Delivered",
  "Cancelled",
];

const CHANGEABLE_STATUSES = ORDER_STATUSES.filter((s) => s !== "All");

const STATUS_STYLES = {
  Pending: "bg-amber-50 text-amber-600 border border-amber-200",
  Confirmed: "bg-blue-50 text-blue-600 border border-blue-200",
  Packed: "bg-purple-50 text-purple-600 border border-purple-200",
  Shipped: "bg-cyan-50 text-cyan-600 border border-cyan-200",
  Delivered: "bg-emerald-50 text-emerald-600 border border-emerald-200",
  Cancelled: "bg-red-50 text-red-500 border border-red-200",
  Paid: "bg-emerald-50 text-emerald-600 border border-emerald-200",
  Pending_payment: "bg-amber-50 text-amber-600 border border-amber-200",
  Failed: "bg-red-50 text-red-500 border border-red-200",
};

function getStatusStyle(status) {
  if (STATUS_STYLES[status]) return STATUS_STYLES[status];
  if (status === "Paid") return STATUS_STYLES.Paid;
  if (status === "Pending") return STATUS_STYLES.Pending_payment;
  return "bg-gray-50 text-gray-500 border border-gray-200";
}

function VendorOrders() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("all");
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState(null);

  const query = useGetOrders(
    page,
    10,
    status === "all" ? undefined : status,
    search,
  );

  const { mutate: updateOrderStatus, isPending: isUpdating } =
    useUpdateOrderStatus();

  const orderItems = query.data?.data?.data || [];
  const pagination = query.data?.data;
  const totalPages = pagination?.totalPages || 1;

  const rows = orderItems.reduce((acc, item) => {
    const order = item.order;
    if (!order || !order.id) return acc;
    const existing = acc.find((o) => o.id === order.id);
    if (existing) {
      existing.order_items.push(item);
    } else {
      acc.push({ ...order, order_items: [item] });
    }
    return acc;
  }, []);

  const handleStatusChange = (orderId, newStatus) => {
    if (!orderId || !newStatus) return;

    updateOrderStatus(
      { orderId, status: newStatus },
      {
        onSuccess: (data) => {
          toast.success(data?.message || "Order status updated!");
          queryClient.invalidateQueries({ queryKey: ["vendor-orders"] });
        },
        onError: (error) => {
          toast.error(
            error.response?.data?.message || "Failed to update order status",
          );
        },
      },
    );
  };

  return (
    <div className="min-h-screen bg-[#f0f2f8]">
      <Sidebar role="vendor" />

      <div className="min-h-screen lg:ml-[270px]">
        <Topbar role="vendor" />

        <main className="space-y-6 p-5 lg:p-7">
          {/* Header */}
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-slate-800">Orders</h1>
              <p className="mt-1 text-sm text-slate-500">
                Manage and fulfill your store orders
              </p>
            </div>

            {/* Search */}
            <div className="relative w-full max-w-xs">
              <input
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder="Search order #..."
                className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-4 pr-4 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>
          </div>

          {/* Table Card */}
          <div className="animate-fade-up overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
            {/* Status Filters */}
            <div className="flex flex-wrap gap-2 px-5 py-3.5">
              {ORDER_STATUSES.map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => {
                    setStatus(value);
                    setPage(1);
                  }}
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

            {/* Table */}
            <div className="overflow-x-auto">
              {query.isLoading ? (
                <div className="flex min-h-[300px] items-center justify-center">
                  <div className="flex flex-col items-center gap-3">
                    <span className="h-8 w-8 animate-spin rounded-full border-[3px] border-indigo-500 border-t-transparent" />
                    <p className="text-sm text-slate-500">Loading orders...</p>
                  </div>
                </div>
              ) : query.isError ? (
                <div className="flex min-h-[300px] items-center justify-center">
                  <p className="text-sm text-red-500">
                    Failed to load orders. Please try again.
                  </p>
                </div>
              ) : rows.length === 0 ? (
                <div className="flex min-h-[300px] flex-col items-center justify-center px-5 text-center">
                  <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
                    <ShoppingBag size={26} className="text-slate-400" />
                  </div>
                  <h3 className="text-base font-semibold text-slate-700">
                    No Orders Found
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">
                    Orders will appear here when customers purchase your
                    products.
                  </p>
                </div>
              ) : (
                <table className="w-full min-w-[900px]">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50">
                      <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Order
                      </th>
                      <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Customer
                      </th>
                      <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Payment
                      </th>
                      <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Status
                      </th>
                      <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Total
                      </th>
                      <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Items
                      </th>
                      <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Date
                      </th>
                      <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((order) => (
                      <OrderRow
                        key={order.id}
                        order={order}
                        expanded={expanded === order.id}
                        onToggle={() =>
                          setExpanded(expanded === order.id ? null : order.id)
                        }
                        onStatusChange={handleStatusChange}
                        isUpdating={isUpdating}
                      />
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* Pagination */}
            {rows.length > 0 && (
              <div className="flex flex-col gap-4 border-t border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-slate-500">
                  Page{" "}
                  <span className="font-medium text-slate-700">{page}</span> of{" "}
                  <span className="font-medium text-slate-700">{totalPages}</span>
                </p>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1 || query.isLoading}
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <ChevronLeft size={17} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages || query.isLoading}
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <ChevronRight size={17} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      <style>
        {`
          @keyframes fadeUp {
            from { opacity: 0; transform: translateY(18px); }
            to   { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-up {
            animation: fadeUp 0.6s cubic-bezier(0.22, 1, 0.36, 1) both;
          }
        `}
      </style>
    </div>
  );
}

function OrderRow({ order, expanded, onToggle, onStatusChange, isUpdating }) {
  const currentStatus = order.order_status;
  const [selectedStatus, setSelectedStatus] = useState(
    currentStatus === "Delivered" || currentStatus === "Cancelled"
      ? currentStatus
      : currentStatus || "Pending",
  );
  const canManage =
    currentStatus !== "Delivered" && currentStatus !== "Cancelled";

  return (
    <>
      <tr
        className="cursor-pointer border-b border-slate-50 transition hover:bg-slate-50/60"
        onClick={onToggle}
      >
        <td className="px-5 py-3.5">
          <p className="text-sm font-semibold text-slate-700">
            {order.order_number}
          </p>
          <p className="text-[11px] text-slate-400">ID #{order.id}</p>
        </td>
        <td className="px-5 py-3.5">
          <p className="text-xs text-slate-600">
            {order.user?.name || order.user?.first_name || "Customer"}
          </p>
          <p className="text-[11px] text-slate-400">{order.user?.email || ""}</p>
        </td>
        <td className="px-5 py-3.5">
          <span
            className={`inline-block rounded-full px-2.5 py-1 text-[11px] font-semibold ${getStatusStyle(order.payment_status)}`}
          >
            {order.payment_status}
          </span>
        </td>
        <td className="px-5 py-3.5">
          <span
            className={`inline-block rounded-full px-2.5 py-1 text-[11px] font-semibold ${getStatusStyle(currentStatus)}`}
          >
            {currentStatus}
          </span>
        </td>
        <td className="px-5 py-3.5 text-sm font-semibold text-slate-700">
           ₹{Number(order.grand_total || 0).toLocaleString()}
        </td>
        <td className="px-5 py-3.5 text-xs text-slate-500">
          {order.order_items?.length || 0}
        </td>
        <td className="px-5 py-3.5 text-xs text-slate-500">
          {order.createdAt
            ? new Date(order.createdAt).toLocaleDateString()
            : "-"}
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
          <td colSpan={8} className="px-5 py-4">
            <div className="space-y-3">
              {/* Order Items */}
              <div className="mb-3">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Order Items
                </p>
                <div className="space-y-2">
                  {(order.orderItems || []).map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between rounded-lg border border-slate-100 bg-white px-4 py-2.5"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100">
                          <Package size={16} className="text-slate-400" />
                        </div>
                        <div>
                          <p className="text-xs font-medium text-slate-700">
                            {item.product?.pro_name ||
                              `Product #${item.product_id}`}
                          </p>
                          <p className="text-[11px] text-slate-400">
                            Qty: {item.quantity} &times; $
                            {Number(item.price || 0).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <p className="text-xs font-semibold text-slate-600">
                        ${Number(item.total ?? item.price ?? 0).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 border-t border-slate-200 pt-3">
                {canManage ? (
                  <>
                    <p className="mr-1 text-xs font-semibold text-slate-500">
                      Set Status:
                    </p>
                    <select
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value)}
                      disabled={isUpdating}
                      className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 outline-none transition focus:border-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {CHANGEABLE_STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onStatusChange(order.id, selectedStatus);
                      }}
                      disabled={isUpdating || selectedStatus === currentStatus}
                      className="rounded-lg bg-gradient-to-r from-indigo-600 to-blue-500 px-3.5 py-1.5 text-xs font-medium text-white shadow-sm transition hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isUpdating ? "Updating..." : "Update"}
                    </button>
                    {selectedStatus === "Cancelled" && (
                      <span className="text-[11px] text-red-400">
                        Order will be marked as cancelled
                      </span>
                    )}
                  </>
                ) : (
                  <span className="text-xs text-slate-400">
                    No further actions available
                  </span>
                )}
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

export default VendorOrders;
