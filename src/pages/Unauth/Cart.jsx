import { useState, useRef, useEffect } from "react";
import {
  ShoppingCart,
  Trash2,
  Minus,
  Plus,
  ArrowRight,
  ChevronRight,
} from "lucide-react";
import {
  useCart,
  useUpdateCartQuantity,
  useRemoveFromCart,
} from "../../api/useCart";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/common/Navbar";

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
    return () => {
      Object.values(updateTimers.current).forEach((timer) =>
        clearTimeout(timer),
      );
    };
  }, []);

  const cart = data?.data?.cart;

  useEffect(() => {
    const initial = {};
    (cart?.cartItems || []).forEach((item) => {
      initial[item.id] = item.quantity;
    });
    setLocalQuantities(initial);
  }, [cart]);
  const items = cart?.cartItems || [];

  const formatINR = (value) => `₹${value.toFixed(2)}`;

  const enrichedItems = items.map((item) => {
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
          onSuccess: (res) => {
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
    return (
      <div className="min-h-screen bg-[#f8f9fc]">
        <Navbar />
        <div className="flex min-h-screen items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#4c2ed8] border-t-transparent"></div>
            <p className="text-sm text-gray-500">Loading your cart...</p>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !cart) {
    return (
      <div className="min-h-screen bg-[#f8f9fc]">
        <Navbar />
        <div className="flex min-h-screen items-center justify-center">
          <div className="rounded-2xl bg-white p-8 shadow-sm">
            <p className="text-center text-red-500">
              Failed to load your cart.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fc]">
      <Navbar />

      <main className="mx-auto max-w-6xl px-4 py-6">
        {enrichedItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl bg-white py-20 shadow-sm">
            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-[#4c2ed8]/10">
              <ShoppingCart size={36} className="text-[#4c2ed8]" />
            </div>
            <h2 className="mb-1 text-lg font-bold text-gray-900">
              Your cart is empty
            </h2>
            <p className="mb-6 text-sm text-gray-500">
              Add items to cart and shop from here
            </p>
            <button
              onClick={() => navigate("/home")}
              className="rounded-xl bg-[#4c2ed8] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#3a24b0]"
            >
              Browse Products
            </button>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
            {/* Left: Cart Items */}
            <div className="space-y-3">
              <div className="flex items-center justify-between px-1 pb-1">
                <h1 className="text-lg font-bold text-gray-900">
                  My Cart ({enrichedItems.length}{" "}
                  {enrichedItems.length === 1 ? "item" : "items"})
                </h1>
                <button
                  onClick={() => navigate("/home")}
                  className="flex items-center gap-1 text-sm font-medium text-[#4c2ed8] transition hover:underline"
                >
                  Continue Shopping
                  <ChevronRight size={14} />
                </button>
              </div>

              {enrichedItems.map((item) => {
                const product = item.product;
                const isUpdating = updatingId === item.id;
                const isRemoving = removingId === item.id;
                return (
                  <div
                    key={item.id}
                    className="flex flex-col gap-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:flex-row"
                  >
                    <div
                      onClick={() => navigate(`/product/${product.id}`)}
                      className="flex h-28 w-full shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 sm:w-28"
                    >
                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl}
                          alt={product.pro_name}
                          className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-200/60 text-gray-300">
                          <ShoppingCart size={24} />
                        </div>
                      )}
                    </div>

                    <div className="flex flex-1 flex-col">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <h3
                            onClick={() => navigate(`/product/${product.id}`)}
                            className="line-clamp-2 cursor-pointer text-sm font-semibold text-gray-800 hover:text-[#4c2ed8]"
                          >
                            {product.pro_name}
                          </h3>
                          {product.description && (
                            <p className="mt-1 line-clamp-1 text-xs text-gray-500">
                              {product.description}
                            </p>
                          )}
                          <div className="mt-2 flex items-baseline gap-2">
                            <span className="text-base font-bold text-gray-900">
                              {formatINR(item.lineFinal)}
                            </span>
                            {item.discountPrice > 0 && item.price > 0 && (
                              <span className="text-xs text-gray-400 line-through">
                                {formatINR(item.lineMrp)}
                              </span>
                            )}
                            {item.lineDiscount > 0 && (
                              <span className="text-xs font-semibold text-green-600">
                                {formatINR(item.lineDiscount)} off
                              </span>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={() => handleRemove(item)}
                          disabled={isRemoving}
                          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-gray-400 transition hover:bg-red-50 hover:text-red-500 disabled:opacity-50"
                        >
                          {isRemoving ? (
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-red-500 border-t-transparent"></div>
                          ) : (
                            <Trash2 size={16} />
                          )}
                        </button>
                      </div>

                      {/* Quantity Stepper */}
                      <div className="mt-4 flex items-center gap-3">
                        <div className="flex items-center rounded-lg border border-gray-200">
                          <button
                            onClick={() =>
                              handleUpdateQuantity(
                                item,
                                (localQuantities[item.id] ?? item.quantity) - 1,
                              )
                            }
                            disabled={
                              isUpdating ||
                              (localQuantities[item.id] ?? item.quantity) <= 1 ||
                              isRemoving
                            }
                            className="flex h-9 w-9 items-center justify-center text-gray-600 transition hover:bg-gray-50 disabled:opacity-40"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="w-10 text-center text-sm font-semibold text-gray-800">
                            {isUpdating ? (
                              <div className="mx-auto h-4 w-4 animate-spin rounded-full border-2 border-[#4c2ed8] border-t-transparent"></div>
                            ) : (
                              localQuantities[item.id] ?? item.quantity
                            )}
                          </span>
                          <button
                            onClick={() =>
                              handleUpdateQuantity(
                                item,
                                (localQuantities[item.id] ?? item.quantity) + 1,
                              )
                            }
                            disabled={isUpdating || isRemoving}
                            className="flex h-9 w-9 items-center justify-center text-gray-600 transition hover:bg-gray-50 disabled:opacity-40"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        <button
                          onClick={() => handleRemove(item)}
                          disabled={isRemoving}
                          className="text-xs font-medium text-red-500 hover:underline disabled:opacity-50"
                        >
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
              <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                <h2 className="mb-4 text-sm font-bold uppercase tracking-wider text-gray-500">
                  Price Details
                </h2>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">
                      Price ({enrichedItems.length}{" "}
                      {enrichedItems.length === 1 ? "item" : "items"})
                    </span>
                    <span className="font-medium text-gray-800">
                      {formatINR(mrpTotal)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Discount</span>
                    <span className="font-medium text-green-600">
                      −{formatINR(discountTotal)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-t border-dashed border-gray-200 pt-3">
                    <span className="font-semibold text-gray-900">
                      Total Amount
                    </span>
                    <span className="font-bold text-gray-900">
                      {formatINR(finalTotal)}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-green-600">
                    You will save {formatINR(discountTotal)} on this order
                  </p>
                </div>

                <button
                  onClick={() => toast("Checkout is coming soon!")}
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#4c2ed8] px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#4c2ed8]/25 transition hover:bg-[#3a24b0] active:scale-[0.98]"
                >
                  Place Order
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default Cart;