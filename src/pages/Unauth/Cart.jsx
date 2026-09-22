import { useState, useRef, useEffect } from "react";
import {
  ShoppingCart,
  Trash2,
  Minus,
  Plus,
  ArrowRight,
  ChevronRight,
  Tag,
  ShieldCheck,
  RotateCcw,
  Truck,
  Sparkles,
} from "lucide-react";
import {
  useCart,
  useUpdateCartQuantity,
  useRemoveFromCart,
} from "../../api/useCart";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/common/Navbar";

function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#eef0ff] via-[#f8f9fc] to-white">
      <Navbar />
      <div className="mx-auto max-w-6xl animate-pulse px-4 py-8 lg:px-8">
        <div className="mb-6 h-8 w-48 rounded-xl bg-gray-200/70" />
        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="space-y-4">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="flex gap-4 rounded-3xl border border-gray-100 bg-white p-5 shadow-sm"
              >
                <div className="h-32 w-32 shrink-0 rounded-2xl bg-gray-200/70" />
                <div className="flex-1 space-y-3 py-2">
                  <div className="h-4 w-3/4 rounded-lg bg-gray-200/70" />
                  <div className="h-3 w-1/2 rounded-lg bg-gray-200/60" />
                  <div className="h-6 w-28 rounded-lg bg-gray-200/70" />
                </div>
              </div>
            ))}
          </div>
          <div className="h-80 rounded-3xl border border-gray-100 bg-white shadow-sm" />
        </div>
      </div>
    </div>
  );
}

function Cart() {
  const navigate = useNavigate();
  const { data, isLoading, isError } = useCart();
  const { mutate: updateQuantity } = useUpdateCartQuantity();
  const { mutate: removeFromCart } = useRemoveFromCart();
  const [updatingId, setUpdatingId] = useState(null);
  const [removingId, setRemovingId] = useState(null);
  const [localQuantities, setLocalQuantities] = useState({});
  const updateTimers = useRef({});

  useEffect(() => {
    const timers = updateTimers.current;
    return () => {
      Object.values(timers).forEach((timer) => clearTimeout(timer));
    };
  }, []);

  const cart = data?.data?.cart;
  const items = cart?.cartItems || [];

  const formatINR = (value) => `₹${value.toFixed(2)}`;

  const enrichedItems = items
    .filter((item) => item.product)
    .map((item) => {
      const product = item.product;
      const price = parseFloat(product?.price) || 0;
      const discountPrice = parseFloat(product?.discount_price) || 0;
      const lineMrp = price * item.quantity;
      const lineFinal =
        (discountPrice > 0 ? discountPrice : price) * item.quantity;
      const primaryMedia = product?.product_media?.find((m) => m.is_primary);
      return {
        ...item,
        price,
        discountPrice,
        lineMrp,
        lineDiscount: lineMrp - lineFinal,
        lineFinal,
        imageUrl: primaryMedia?.media_url || null,
      };
    });

  const mrpTotal = enrichedItems.reduce((sum, i) => sum + i.lineMrp, 0);
  const discountTotal = enrichedItems.reduce(
    (sum, i) => sum + i.lineDiscount,
    0,
  );
  const finalTotal = enrichedItems.reduce((sum, i) => sum + i.lineFinal, 0);

  const handleUpdateQuantity = (item, newQuantity) => {
    if (newQuantity < 1) return;
    const maxStock = parseInt(item.product?.quantity) || Infinity;
    if (newQuantity > maxStock) {
      toast.error("This product is currently out of stock.");
      return;
    }

    setLocalQuantities((prev) => ({ ...prev, [item.id]: newQuantity }));

    if (updateTimers.current[item.id]) {
      clearTimeout(updateTimers.current[item.id]);
    }

    updateTimers.current[item.id] = setTimeout(() => {
      setUpdatingId(item.id);
      updateQuantity(
        { cartItemId: item.id, quantity: newQuantity },
        {
          onSuccess: () => {
            setUpdatingId(null);
          },
          onError: () => {
            setUpdatingId(null);
            setLocalQuantities((prev) => ({ ...prev, [item.id]: item.quantity }));
          },
        },
      );
    }, 3000);
  };

  const handleRemove = (item) => {
    setRemovingId(item.id);
    removeFromCart(item.product_id, {
      onSuccess: (res) => {
        toast.success(res?.message || "Removed from cart");
        setRemovingId(null);
      },
      onError: () => {
        toast.error("Failed to remove from cart");
        setRemovingId(null);
      },
    });
  };

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (isError || !cart) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#eef0ff] via-[#f8f9fc] to-white">
        <Navbar />
        <div className="flex min-h-screen items-center justify-center px-4">
          <div className="rounded-3xl border border-red-100 bg-white p-8 text-center shadow-sm">
            <p className="text-red-500">Failed to load your cart.</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 rounded-xl bg-[#4c2ed8] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#3a24b0]"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#eef0ff] via-[#f8f9fc] to-white">
      <Navbar />

      <main className="mx-auto max-w-6xl px-4 py-8 lg:px-8">
        {enrichedItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-[2rem] border border-gray-100 bg-white px-6 py-24 text-center shadow-sm">
            <div className="relative mb-6 flex h-28 w-28 items-center justify-center">
              <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-[#4c2ed8]/15 to-[#368de8]/15 blur-xl"></div>
              <div className="relative flex h-24 w-24 items-center justify-center rounded-[1.75rem] border border-[#4c2ed8]/10 bg-gradient-to-br from-[#4c2ed8]/10 to-[#368de8]/10">
                <ShoppingCart size={40} className="text-[#4c2ed8]" />
              </div>
            </div>
            <h2 className="mb-2 text-xl font-bold text-gray-900">
              Your cart feels a little light
            </h2>
            <p className="mb-8 max-w-sm text-sm text-gray-500">
              Looks like you haven't added anything yet. Explore our collection
              and find something you'll love.
            </p>
            <button
              onClick={() => navigate("/home")}
              className="rounded-2xl bg-gradient-to-r from-[#4c2ed8] to-[#368de8] px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-[#4c2ed8]/25 transition hover:shadow-xl hover:shadow-[#4c2ed8]/35 active:scale-[0.98]"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#4c2ed8] to-[#368de8] shadow-lg shadow-indigo-200">
                  <ShoppingCart size={20} className="text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">
                    Shopping Cart
                  </h1>
                  <p className="text-xs text-gray-500">
                    {enrichedItems.length}{" "}
                    {enrichedItems.length === 1 ? "item" : "items"} in your bag
                  </p>
                </div>
              </div>
              <button
                onClick={() => navigate("/home")}
                className="flex items-center gap-1 rounded-xl px-3 py-2 text-sm font-medium text-[#4c2ed8] transition hover:bg-[#4c2ed8]/5"
              >
                Continue Shopping
                <ChevronRight size={14} />
              </button>
            </div>

            <div className="grid items-start gap-6 lg:grid-cols-[1fr_360px]">
              {/* Left: Cart Items */}
              <div className="space-y-4">
                {enrichedItems.map((item) => {
                  const product = item.product;
                  const isUpdating = updatingId === item.id;
                  const isRemoving = removingId === item.id;
                  const currentQty = localQuantities[item.id] ?? item.quantity;
                  const unitPrice =
                    item.discountPrice > 0 ? item.discountPrice : item.price;

                  return (
                    <div
                      key={item.id}
                      className="group flex flex-col gap-5 rounded-[1.75rem] border border-gray-100 bg-white p-5 shadow-sm transition-all duration-300 hover:border-[#4c2ed8]/10 hover:shadow-xl hover:shadow-gray-200/70 sm:flex-row"
                    >
                      {/* Image */}
                      <div
                        onClick={() => navigate(`/product/${product.id}`)}
                        className="relative flex h-36 w-full shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 sm:w-36"
                      >
                        {item.imageUrl ? (
                          <img
                            src={item.imageUrl}
                            alt={product.pro_name}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-200/60 text-gray-300">
                            <ShoppingCart size={28} />
                          </div>
                        )}
                        {item.lineDiscount > 0 && (
                          <span className="absolute left-3 top-3 rounded-xl bg-green-500 px-2 py-1 text-[10px] font-bold text-white shadow-sm">
                            −{Math.round(
                              (item.lineDiscount / item.lineMrp) * 100,
                            )}
                            %
                          </span>
                        )}
                      </div>

                      {/* Details */}
                      <div className="flex flex-1 flex-col">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <h3
                              onClick={() => navigate(`/product/${product.id}`)}
                              className="line-clamp-2 cursor-pointer text-[15px] font-semibold leading-snug text-gray-800 transition hover:text-[#4c2ed8]"
                            >
                              {product.pro_name}
                            </h3>
                            <p className="mt-1.5 text-xs text-gray-400">
                              Sold by ShopEase
                            </p>
                            <div className="mt-3 flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
                              <span className="text-lg font-bold text-gray-900">
                                {formatINR(item.lineFinal)}
                              </span>
                              {item.discountPrice > 0 && item.price > 0 && (
                                <span className="text-sm text-gray-400 line-through">
                                  {formatINR(item.lineMrp)}
                                </span>
                              )}
                              <span className="text-xs font-semibold text-green-600">
                                Save {formatINR(item.lineDiscount)}
                              </span>
                            </div>
                            <p className="mt-1 text-[11px] text-gray-400">
                              {formatINR(unitPrice)} / piece × {currentQty}
                            </p>
                          </div>

                          <button
                            onClick={() => handleRemove(item)}
                            disabled={isRemoving}
                            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-gray-100 text-gray-400 transition hover:border-red-100 hover:bg-red-50 hover:text-red-500 disabled:opacity-50"
                          >
                            {isRemoving ? (
                              <div className="h-4 w-4 animate-spin rounded-full border-2 border-red-500 border-t-transparent"></div>
                            ) : (
                              <Trash2 size={16} />
                            )}
                          </button>
                        </div>

                        {/* Quantity Stepper */}
                        <div className="mt-5 flex items-center justify-between border-t border-dashed border-gray-100 pt-4">
                          <div className="flex items-center rounded-full border border-gray-200 bg-gray-50 p-1">
                            <button
                              onClick={() =>
                                handleUpdateQuantity(item, currentQty - 1)
                              }
                              disabled={isUpdating || currentQty <= 1 || isRemoving}
                              className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-gray-600 shadow-sm transition hover:bg-gray-100 hover:text-[#4c2ed8] disabled:opacity-40"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="w-10 text-center text-sm font-bold text-gray-800">
                              {isUpdating ? (
                                <div className="mx-auto h-4 w-4 animate-spin rounded-full border-2 border-[#4c2ed8] border-t-transparent"></div>
                              ) : (
                                currentQty
                              )}
                            </span>
                            <button
                              onClick={() =>
                                handleUpdateQuantity(item, currentQty + 1)
                              }
                              disabled={isUpdating || isRemoving}
                              className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-r from-[#4c2ed8] to-[#368de8] text-white shadow-md shadow-indigo-200 transition hover:brightness-110 active:scale-95 disabled:opacity-40"
                            >
                              <Plus size={14} />
                            </button>
                          </div>

                          <button
                            onClick={() => handleRemove(item)}
                            disabled={isRemoving}
                            className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold text-red-500 transition hover:bg-red-50 disabled:opacity-50"
                          >
                            <Trash2 size={14} />
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Right: Price Details */}
              <div className="lg:sticky lg:top-20 lg:self-start">
                <div className="overflow-hidden rounded-[1.75rem] border border-gray-100 bg-white shadow-sm transition-shadow duration-300 hover:shadow-lg hover:shadow-gray-200/60">
                  {/* Header */}
                  <div className="flex items-center gap-2.5 bg-gradient-to-r from-[#4c2ed8] to-[#368de8] px-6 py-4">
                    <Tag size={16} className="text-white/90" />
                    <h2 className="text-sm font-bold uppercase tracking-wider text-white">
                      Price Details
                    </h2>
                  </div>

                  <div className="p-6">
                    <div className="space-y-3.5 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500">
                          Price ({enrichedItems.length}{" "}
                          {enrichedItems.length === 1 ? "item" : "items"})
                        </span>
                        <span className="font-semibold text-gray-800">
                          {formatINR(mrpTotal)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500">Discount</span>
                        <span className="font-semibold text-green-600">
                          −{formatINR(discountTotal)}
                        </span>
                      </div>

                      <div className="flex items-center justify-between border-t border-dashed border-gray-200 pt-4">
                        <span className="text-base font-bold text-gray-900">
                          Total Amount
                        </span>
                        <span className="text-xl font-extrabold text-gray-900">
                          {formatINR(finalTotal)}
                        </span>
                      </div>
                    </div>

                    {discountTotal > 0 && (
                      <div className="mt-4 flex items-start gap-2.5 rounded-2xl border border-green-100 bg-green-50/70 px-4 py-3">
                        <Sparkles size={16} className="mt-0.5 shrink-0 text-green-600" />
                        <p className="text-xs font-semibold leading-relaxed text-green-700">
                          Congratulations! You will save{" "}
                          {formatINR(discountTotal)} on this order
                        </p>
                      </div>
                    )}

                    <button
                      onClick={() => toast("Checkout is coming soon!")}
                      className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#4c2ed8] to-[#368de8] px-6 py-4 text-sm font-bold text-white shadow-lg shadow-[#4c2ed8]/25 transition hover:shadow-xl hover:shadow-[#4c2ed8]/35 active:scale-[0.98]"
                    >
                      Place Order
                      <ArrowRight size={16} />
                    </button>

                    <div className="mt-5 flex items-center justify-center gap-5 border-t border-gray-100 pt-4 text-[11px] font-medium text-gray-400">
                      <span className="flex items-center gap-1.5">
                        <Truck size={14} className="text-green-500" />
                        Free Delivery
                      </span>
                      <span className="flex items-center gap-1.5">
                        <RotateCcw size={14} className="text-blue-500" />
                        7-Day Returns
                      </span>
                      <span className="flex items-center gap-1.5">
                        <ShieldCheck size={14} className="text-purple-500" />
                        Secure Payments
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default Cart;