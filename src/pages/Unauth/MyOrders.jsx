import {
  Package,
  ChevronRight,
  ShoppingBag,
  ShoppingCart,
  Truck,
  MapPin,
} from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/common/Navbar";
import { useMyOrders } from "../../api/useOrder";

const ORDER_STATUS_STYLES = {
  Pending: "bg-amber-50 text-amber-600 ring-amber-200",
  Confirmed: "bg-blue-50 text-blue-600 ring-blue-200",
  Packed: "bg-indigo-50 text-indigo-600 ring-indigo-200",
  Shipped: "bg-purple-50 text-purple-600 ring-purple-200",
  Delivered: "bg-green-50 text-green-600 ring-green-200",
  Cancelled: "bg-red-50 text-red-600 ring-red-200",
};

const PAYMENT_STATUS_STYLES = {
  Paid: "bg-green-50 text-green-600 ring-green-200",
  Pending: "bg-amber-50 text-amber-600 ring-amber-200",
  Failed: "bg-red-50 text-red-600 ring-red-200",
  Refunded: "bg-gray-100 text-gray-600 ring-gray-200",
};

function orderBadge(status, styles) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ring-1 ${
        styles[status] || "bg-gray-50 text-gray-600 ring-gray-200"
      }`}
    >
      {status}
    </span>
  );
}

function formatDate(dateStr) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function MyOrders() {
  const navigate = useNavigate();
  const { data, isLoading, isError } = useMyOrders();

  const orders = data?.data?.orders || [];

  const handleCopyOrderNumber = (orderNumber) => {
    navigator.clipboard.writeText(orderNumber);
    toast.success("Order number copied");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f8f9fc]">
        <div className="flex min-h-screen items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#4c2ed8] border-t-transparent"></div>
            <p className="text-sm text-gray-500">Loading your orders...</p>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-[#f8f9fc]">
        <div className="flex min-h-screen items-center justify-center">
          <div className="rounded-2xl bg-white p-8 shadow-sm">
            <p className="text-center text-red-500">Failed to load orders.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fc]">
      <Navbar />

      <main className="mx-auto max-w-5xl px-4 py-6">
        {/* Header */}
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#4c2ed8] to-[#368de8] shadow-lg shadow-indigo-200">
            <Package size={19} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">My Orders</h1>
            <p className="text-xs text-gray-500">
              {orders.length > 0
                ? `${orders.length} ${
                    orders.length === 1 ? "order" : "orders"
                  } placed`
                : "Track and manage your orders"}
            </p>
          </div>
        </div>

        {/* Empty State */}
        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl bg-white py-20 shadow-sm">
            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-indigo-50">
              <ShoppingBag size={36} className="text-indigo-300" />
            </div>
            <h2 className="mb-1 text-lg font-bold text-gray-900">
              No orders yet
            </h2>
            <p className="mb-6 text-sm text-gray-500">
              When you place an order, it will appear here
            </p>
            <button
              onClick={() => navigate("/home")}
              className="rounded-xl bg-[#4c2ed8] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#3a24b0]"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const items = order.orderItems || [];
              const images = items
                .map((item) => {
                  const media = item.product?.product_media;
                  const primary = media?.find((m) => m.is_primary);
                  return primary?.media_url || media?.[0]?.media_url || null;
                })
                .filter(Boolean)
                .slice(0, 4);

              return (
                <div
                  key={order.id}
                  className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition hover:shadow-md"
                >
                  {/* Order Header */}
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-dashed border-gray-100 bg-gradient-to-r from-[#4c2ed8]/5 to-transparent px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleCopyOrderNumber(order.order_number)}
                        title="Copy order number"
                        className="text-left"
                      >
                        <p className="text-[11px] uppercase tracking-wider text-gray-400">
                          Order #{order.order_number}
                        </p>
                      </button>
                      <span className="hidden text-xs text-gray-400 sm:inline">
                        • {formatDate(order.createdAt)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {orderBadge(order.order_status, ORDER_STATUS_STYLES)}
                      {orderBadge(order.payment_status, PAYMENT_STATUS_STYLES)}
                    </div>
                  </div>

                  {/* Order Body */}
                  <div className="flex flex-wrap items-center gap-4 px-5 py-4">
                    {/* Thumbnails */}
                    <div className="flex shrink-0 items-center">
                      {images.length > 0 ? (
                        images.map((url, idx) => (
                          <img
                            key={idx}
                            src={url}
                            alt={items[idx]?.product?.pro_name || "product"}
                            className={`h-12 w-12 rounded-xl border border-gray-100 bg-gray-50 object-cover ${
                              idx > 0 ? "-ml-3" : ""
                            }`}
                          />
                        ))
                      ) : (
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 text-gray-300">
                          <ShoppingCart size={18} />
                        </div>
                      )}
                    </div>

                    {/* Item summary */}
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-gray-800">
                        {items[0]?.product?.pro_name ||
                          `${items.length} item${items.length === 1 ? "" : "s"}`}
                        {items.length > 1 && (
                          <span className="ml-1 truncate text-xs font-normal text-gray-400">
                            +{items.length - 1} more
                          </span>
                        )}
                      </p>
                      <p className="mt-0.5 flex items-center gap-1 text-xs text-gray-500">
                        <MapPin size={11} className="shrink-0 text-[#4c2ed8]" />
                        {order.address
                          ? `${order.address.city}, ${order.address.state}`
                          : "Delivery address"}
                      </p>
                    </div>

                    {/* Total */}
                    <div className="shrink-0 text-right">
                      <p className="text-[11px] uppercase tracking-wider text-gray-400">
                        Total
                      </p>
                      <p className="text-base font-extrabold text-gray-900">
                        ₹{parseFloat(order.grand_total).toFixed(2)}
                      </p>
                    </div>

                    {/* View detail */}
                    <button
                      onClick={() => navigate(`/orders/${order.id}`)}
                      className="flex shrink-0 items-center gap-1 rounded-xl bg-[#4c2ed8] px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-[#4c2ed8]/20 transition hover:bg-[#3a24b0]"
                    >
                      View Details
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="mt-8 flex items-center justify-center gap-2 text-[11px] font-medium text-gray-400">
          <Truck size={14} className="text-[#4c2ed8]" />
          Need help with an order? Contact our support team
        </div>
      </main>
    </div>
  );
}

export default MyOrders;