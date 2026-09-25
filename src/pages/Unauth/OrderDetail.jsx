import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Package,
  ShoppingCart,
  Truck,
  CheckCircle2,
  XCircle,
  CreditCard,
} from "lucide-react";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
import Navbar from "../../components/common/Navbar";
import {
  useOrderById,
  useTrackOrder,
  useCancelOrder,
} from "../../api/useOrder";

const ORDER_STEPS = ["Pending", "Confirmed", "Packed", "Shipped", "Delivered"];

const STATUS_STYLES = {
  Pending: "bg-amber-50 text-amber-600 ring-amber-200",
  Confirmed: "bg-blue-50 text-blue-600 ring-blue-200",
  Packed: "bg-indigo-50 text-indigo-600 ring-indigo-200",
  Shipped: "bg-purple-50 text-purple-600 ring-purple-200",
  Delivered: "bg-green-50 text-green-600 ring-green-200",
  Cancelled: "bg-red-50 text-red-600 ring-red-200",
};

const PAYMENT_STYLES = {
  Paid: "bg-green-50 text-green-600 ring-green-200",
  Pending: "bg-amber-50 text-amber-600 ring-amber-200",
  Failed: "bg-red-50 text-red-600 ring-red-200",
  Refunded: "bg-gray-100 text-gray-600 ring-gray-200",
};

function statusBadge(status, styles) {
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
  return new Date(dateStr).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function TrackTimeline({ orderStatus, lastUpdated }) {
  const cancelled = orderStatus === "Cancelled";

  if (cancelled) {
    return (
      <div className="rounded-2xl border border-red-100 bg-red-50/60 px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100">
            <XCircle size={18} className="text-red-500" />
          </div>
          <div>
            <p className="text-sm font-bold text-red-700">Order Cancelled</p>
            <p className="text-xs text-red-500">
              {formatDate(lastUpdated)}
            </p>
          </div>
        </div>
      </div>
    );
  }

  const currentIndex = ORDER_STEPS.indexOf(orderStatus);
  const activeIndex = currentIndex === -1 ? 0 : currentIndex;

  return (
    <div className="px-5 py-6">
      <div className="flex items-center">
        {ORDER_STEPS.map((step, idx) => {
          const done = idx <= activeIndex;
          return (
            <div key={step} className="flex flex-1 items-center last:flex-none">
              <div className="flex flex-col items-center">
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-full ring-2 transition-colors ${
                    done
                      ? "bg-gradient-to-br from-[#4c2ed8] to-[#368de8] text-white ring-[#4c2ed8]/20"
                      : "bg-gray-100 text-gray-400 ring-gray-200"
                  }`}
                >
                  {done ? (
                    <CheckCircle2 size={16} />
                  ) : (
                    <span className="text-[10px] font-bold">{idx + 1}</span>
                  )}
                </div>
                <span
                  className={`mt-1.5 text-[10px] font-semibold ${
                    done ? "text-[#4c2ed8]" : "text-gray-400"
                  }`}
                >
                  {step}
                </span>
              </div>
              {idx < ORDER_STEPS.length - 1 && (
                <div
                  className={`mx-1 mb-4 h-0.5 flex-1 rounded-full ${
                    idx < activeIndex ? "bg-[#368de8]" : "bg-gray-200"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
      <p className="mt-3 text-center text-xs text-gray-400">
        {formatDate(lastUpdated)}
      </p>
    </div>
  );
}

function OrderDetail() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useOrderById(orderId);
  const { data: trackData } = useTrackOrder(orderId);
  const { mutate: cancelOrder, isPending: cancelling } = useCancelOrder();

  const order = data?.data?.order;
  const track = trackData?.data;

  const items = order?.orderItems || [];
  const isCancelled = order?.order_status === "Cancelled";
  const isDelivered = order?.order_status === "Delivered";
  const canCancel = !isCancelled && !isDelivered;

  const handleCancel = () => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;
    cancelOrder(order.id, {
      onSuccess: (res) => {
        toast.success(res?.message || "Order cancelled successfully");
        queryClient.invalidateQueries({ queryKey: ["order", orderId] });
        queryClient.invalidateQueries({ queryKey: ["trackOrder", orderId] });
        queryClient.invalidateQueries({ queryKey: ["myOrders"] });
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || "Failed to cancel order");
      },
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f8f9fc]">
        <div className="flex min-h-screen items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#4c2ed8] border-t-transparent"></div>
            <p className="text-sm text-gray-500">Loading order details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className="min-h-screen bg-[#f8f9fc]">
        <Navbar />
        <div className="flex min-h-[70vh] items-center justify-center">
          <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
            <p className="mb-5 text-red-500">Failed to load order details.</p>
            <button
              onClick={() => navigate("/orders")}
              className="rounded-xl bg-[#4c2ed8] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#3a24b0]"
            >
              Back to Orders
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fc]">
      <Navbar />

      <main className="mx-auto max-w-4xl px-4 py-6">
        {/* Header */}
        <button
          onClick={() => navigate("/orders")}
          className="mb-4 flex items-center gap-1.5 text-sm font-semibold text-[#4c2ed8] transition hover:text-[#3a24b0]"
        >
          <ArrowLeft size={16} />
          Back to Orders
        </button>

        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#4c2ed8] to-[#368de8] shadow-lg shadow-indigo-200">
              <Package size={19} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                Order #{order.order_number}
              </h1>
              <p className="text-xs text-gray-500">
                Placed on {formatDate(order.createdAt)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {statusBadge(order.order_status, STATUS_STYLES)}
            {statusBadge(order.payment_status, PAYMENT_STYLES)}
          </div>
        </div>

        {/* Track Timeline */}
        <div className="mb-5 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          <div className="flex items-center gap-2 border-b border-dashed border-gray-100 px-5 py-3">
            <Truck size={15} className="text-[#4c2ed8]" />
            <h2 className="text-sm font-bold text-gray-900">
              Track Order
            </h2>
            {track?.order_status && (
              <span className="ml-auto text-xs text-gray-400">
                {track.order_status}
              </span>
            )}
          </div>
          <TrackTimeline
            orderStatus={order.order_status}
            lastUpdated={order.updatedAt}
          />
        </div>

        {/* Items */}
        <div className="mb-5 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          <div className="flex items-center gap-2 border-b border-dashed border-gray-100 px-5 py-3">
            <ShoppingCart size={15} className="text-[#4c2ed8]" />
            <h2 className="text-sm font-bold text-gray-900">
              Items ({items.length})
            </h2>
          </div>
          <div className="divide-y divide-dashed divide-gray-100">
            {items.map((item) => {
              const media = item.product?.product_media;
              const primary = media?.find((m) => m.is_primary);
              const imageUrl =
                primary?.media_url || media?.[0]?.media_url || null;
              return (
                <div
                  key={item.id}
                  className="flex items-center gap-3 px-5 py-4"
                >
                  <div className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-gray-50 to-gray-100">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={item.product?.pro_name || "product"}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <ShoppingCart size={16} className="text-gray-300" />
                    )}
                    <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#4c2ed8] text-[9px] font-bold text-white">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-gray-800">
                      {item.product?.pro_name || `Product #${item.product_id}`}
                    </p>
                    <p className="text-[11px] text-gray-400">
                      ₹{parseFloat(item.price).toFixed(2)} × {item.quantity}
                    </p>
                  </div>
                  <span className="shrink-0 text-sm font-bold text-gray-900">
                    ₹{parseFloat(item.total).toFixed(2)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Summary + Actions */}
        <div className="grid gap-5 md:grid-cols-[1fr_280px]">
          <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
            <div className="flex items-center gap-2 border-b border-dashed border-gray-100 px-5 py-3">
              <CreditCard size={15} className="text-[#4c2ed8]" />
              <h2 className="text-sm font-bold text-gray-900">
                Payment Summary
              </h2>
            </div>
            <div className="space-y-3 px-5 py-4 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Total ({items.length} {items.length === 1 ? "item" : "items"})</span>
                <span className="font-semibold text-gray-800">
                  ₹{parseFloat(order.grand_total).toFixed(2)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Delivery</span>
                <span className="flex items-center gap-1 font-semibold text-green-600">
                  <Truck size={13} />
                  FREE
                </span>
              </div>
              <div className="flex items-center justify-between border-t border-dashed border-gray-200 pt-3">
                <span className="text-base font-bold text-gray-900">
                  Amount Paid
                </span>
                <span className="text-lg font-extrabold text-gray-900">
                  ₹{parseFloat(order.grand_total).toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {/* Cancel */}
            {canCancel && (
              <button
                onClick={handleCancel}
                disabled={cancelling}
                className="w-full rounded-2xl border border-red-200 bg-red-50/60 px-5 py-3.5 text-sm font-bold text-red-600 transition hover:bg-red-50 disabled:opacity-50"
              >
                {cancelling ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-red-500 border-t-transparent" />
                    Cancelling...
                  </span>
                ) : (
                  "Cancel Order"
                )}
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default OrderDetail;