import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { CardElement } from "@stripe/react-stripe-js";
import {
  MapPin,
  Plus,
  Pencil,
  ChevronLeft,
  ChevronRight,
  Phone,
  Building2,
  Home,
  Navigation,
  Landmark,
  Globe,
  Hash,
  User as UserIcon,
  CreditCard,
  ArrowRight,
  Trash2,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
  Lock,
  CheckCircle2,
  Store,
  AlertCircle,
} from "lucide-react";
import toast from "react-hot-toast";
import Navbar from "../../components/common/Navbar";
import { useCart, useAddToCart, useRemoveFromCart } from "../../api/useCart";
import {
  useAddresses,
  useAddAddress,
  useUpdateAddress,
  useDeleteAddress,
} from "../../api/useAddress";
import { usePlaceOrder, useConfirmPayment } from "../../api/useOrder";
import { PaymentForm } from "../../components/payment/PaymentForm";

const emptyForm = {
  name: "",
  phone_no: "",
  house_no: "",
  road_area_colony: "",
  city: "",
  zipcode: "",
  landmark: "",
  state: "",
  country: "",
};

const emptyFormKeys = Object.keys(emptyForm);

function LoadingState() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#eef0ff] via-[#f8f9fc] to-white">
      <Navbar />
      <div className="mx-auto max-w-6xl animate-pulse px-4 py-8 lg:px-8">
        <div className="mb-6 h-8 w-48 rounded-xl bg-gray-200/70" />
        <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
          <div className="space-y-4">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="h-40 rounded-3xl border border-gray-100 bg-white p-5 shadow-sm"
              >
                <div className="h-4 w-1/2 rounded-lg bg-gray-200/70" />
                <div className="mt-4 h-3 w-3/4 rounded-lg bg-gray-200/60" />
                <div className="mt-2 h-3 w-2/3 rounded-lg bg-gray-200/60" />
              </div>
            ))}
          </div>
          <div className="h-80 rounded-3xl border border-gray-100 bg-white shadow-sm" />
        </div>
      </div>
    </div>
  );
}

function CheckoutAddress() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: cartData, isLoading: cartLoading } = useCart();
  const { data: addressData, isLoading: addressesLoading } = useAddresses();
  const addAddress = useAddAddress();
  const updateAddress = useUpdateAddress();
  const deleteAddress = useDeleteAddress();
  const addToCart = useAddToCart();
  const removeFromCart = useRemoveFromCart();
  const placeOrder = usePlaceOrder();
  const confirmPayment = useConfirmPayment();

  const addresses = useMemo(
    () => addressData?.data?.addresses || [],
    [addressData],
  );

  const [selectedId, setSelectedId] = useState(null);
  const [mode, setMode] = useState("list");
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [paymentIntentId, setPaymentIntentId] = useState(null);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [placedOrderId, setPlacedOrderId] = useState(null);

  const [vendorOrders, setVendorOrders] = useState([]);
  const [placingOrders, setPlacingOrders] = useState(false);
  const [placingProgress, setPlacingProgress] = useState(null);
  const [payProgress, setPayProgress] = useState({
    current: 0,
    processing: false,
    error: null,
  });
  const [paidIntentIds, setPaidIntentIds] = useState([]);

  const effectiveSelectedId = selectedId || addresses[0]?.id || null;
  const selectedAddress = addresses.find((a) => a.id === effectiveSelectedId);

  const cart = cartData?.data?.cart;
  const items = cart?.cartItems || [];

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
  const discountTotal = enrichedItems.reduce((sum, i) => sum + i.lineDiscount, 0);
  const finalTotal = enrichedItems.reduce((sum, i) => sum + i.lineFinal, 0);
  const formatINR = (value) => `₹${value.toFixed(2)}`;

  const vendorGroups = (() => {
    const map = new Map();
    for (const it of enrichedItems) {
      const vendorId = it.product?.store?.user_id;
      if (!vendorId) continue;
      const key = String(vendorId);
      if (!map.has(key)) {
        map.set(key, {
          vendorId,
          vendorName:
            it.product?.store?.store_name || `Seller #${vendorId}`,
          items: [],
          subtotal: 0,
          mrp: 0,
          discount: 0,
        });
      }
      const group = map.get(key);
      group.items.push(it);
      group.subtotal += it.lineFinal;
      group.mrp += it.lineMrp;
      group.discount += it.lineDiscount;
    }
    return [...map.values()];
  })();

  const isMultiVendor = vendorGroups.length > 1;

  const handleChange = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const startAdd = () => {
    setEditingId(null);
    setForm(emptyForm);
    setMode("form");
  };

  const startEdit = (address) => {
    setEditingId(address.id);
    setForm(
      emptyFormKeys.reduce((acc, key) => {
        acc[key] = address[key] || "";
        return acc;
      }, {}),
    );
    setMode("form");
  };

  const backToList = () => {
    setMode("list");
    setEditingId(null);
    setForm(emptyForm);
  };

  const handleSubmitAddress = (e) => {
    e.preventDefault();
    if (!/^[0-9]{10,15}$/.test(form.phone_no)) {
      toast.error("Phone number must be between 10 and 15 digits.");
      return;
    }

    if (editingId) {
      updateAddress.mutate(
        { addressId: editingId, payload: form },
        {
          onSuccess: (res) => {
            toast.success(res?.message || "Address updated successfully");
            setSelectedId(res?.data?.address?.id || editingId);
            backToList();
          },
          onError: (err) => {
            toast.error(
              err.response?.data?.error ||
                err.response?.data?.message ||
                "Failed to update address",
            );
          },
        },
      );
    } else {
      addAddress.mutate(form, {
        onSuccess: (res) => {
          toast.success(res?.message || "Address added successfully");
          setSelectedId(res?.data?.address?.id);
          backToList();
        },
        onError: (err) => {
          toast.error(
            err.response?.data?.error ||
              err.response?.data?.message ||
              "Failed to add address",
          );
        },
      });
    }
  };

  const handleDeleteAddress = (address) => {
    if (
      !window.confirm("Are you sure you want to delete this address?")
    ) {
      return;
    }
    deleteAddress.mutate(address.id, {
      onSuccess: (res) => {
        toast.success(res?.message || "Address deleted successfully");
        if (effectiveSelectedId === address.id) {
          setSelectedId(null);
        }
      },
      onError: (err) => {
        toast.error(
          err.response?.data?.message || "Failed to delete address",
        );
      },
    });
  };

  const handlePlaceOrder = async () => {
    if (!effectiveSelectedId) {
      toast.error("Please select a delivery address.");
      return;
    }

    if (vendorGroups.length === 0) {
      toast.error("Unable to determine sellers for your cart items.");
      return;
    }

    setPlacingOrders(true);
    setPlacingProgress({ current: 1, total: vendorGroups.length, label: "" });
    try {
      const orders = [];
      let productsInCart = new Set(
        enrichedItems.map((it) => it.product_id).filter(Boolean),
      );

      for (let i = 0; i < vendorGroups.length; i++) {
        const group = vendorGroups[i];
        setPlacingProgress({
          current: i + 1,
          total: vendorGroups.length,
          label: group.vendorName,
        });

        // Rebuild the backend cart so it only contains THIS seller's items,
        // because the backend places one order (and one Stripe payment) from
        // the whole cart at a time.
        const targetIds = new Set(group.items.map((it) => it.product_id));
        for (const pid of [...productsInCart]) {
          if (!targetIds.has(pid)) {
            try {
              await removeFromCart.mutateAsync(pid);
            } catch {
              // item already gone - safe to skip
            }
            productsInCart.delete(pid);
          }
        }
        for (const it of group.items) {
          if (!productsInCart.has(it.product_id)) {
            await addToCart.mutateAsync({
              product_id: it.product_id,
              quantity: it.quantity,
            });
            productsInCart.add(it.product_id);
          }
        }

        const res = await placeOrder.mutateAsync(effectiveSelectedId);
        const piId = res?.data?.payment_intent_id;
        if (!piId) {
          throw new Error(`Payment intent not created for ${group.vendorName}`);
        }
        orders.push({
          orderId: res?.data?.order?.id,
          paymentIntentId: piId,
          amount: Number(res?.data?.order?.grand_total || group.subtotal),
          vendorName: group.vendorName,
        });
      }

      // Restore the full original cart so nothing looks lost before payment.
      for (const pid of [...productsInCart]) {
        try {
          await removeFromCart.mutateAsync(pid);
        } catch {
          // item already gone - safe to skip
        }
      }
      for (const it of enrichedItems) {
        try {
          await addToCart.mutateAsync({
            product_id: it.product_id,
            quantity: it.quantity,
          });
        } catch {
          // best-effort restore
        }
      }

      setVendorOrders(orders);
      setPaidIntentIds([]);
      setPayProgress({ current: 0, processing: false, error: null });
      setPaymentIntentId(orders[0]?.paymentIntentId || null);
      setShowPaymentForm(true);
      toast.success(
        orders.length > 1
          ? `${orders.length} orders created. Please complete payment for each seller.`
          : "Order created. Please complete payment.",
      );
    } catch (error) {
      toast.error(
        error.response?.data?.message || error.message || "Failed to place order",
      );
      try {
        for (const it of enrichedItems) {
          await addToCart.mutateAsync({
            product_id: it.product_id,
            quantity: it.quantity,
          });
        }
      } catch {
        // best-effort restore
      }
    } finally {
      setPlacingOrders(false);
      setPlacingProgress(null);
    }
  };

const handlePaymentSuccess = async (paymentMethodId, paymentParams = {}) => {
    if (!vendorOrders.length) return;

    const { stripe, elements } = paymentParams;
    const unpaid = vendorOrders
      .map((o, i) => ({ o, i }))
      .filter(({ o }) => !paidIntentIds.includes(o.paymentIntentId));

    if (unpaid.length === 0) {
      setPaymentSuccess(true);
      setShowPaymentForm(true);
      return;
    }

    const newlyPaid = [...paidIntentIds];
    setPayProgress({ current: unpaid[0].i, processing: true, error: null });
    try {
      for (const { o, i } of unpaid) {
        setPayProgress({ current: i, processing: true, error: null });

        // Stripe allows a PaymentMethod to be used with only ONE
        // PaymentIntent (unless attached to the Customer first), so we
        // mint a fresh payment method from the card for every seller order.
        let pmId = paymentMethodId;
        if (unpaid.length > 1 && stripe && elements) {
          const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: "card",
            card: elements.getElement(CardElement),
          });
          if (error) throw error;
          pmId = paymentMethod.id;
        }

        await confirmPayment.mutateAsync({
          paymentIntentId: o.paymentIntentId,
          paymentMethodId: pmId,
        });
        newlyPaid.push(o.paymentIntentId);
        setPaidIntentIds(newlyPaid);
      }
      setPayProgress({
        current: vendorOrders.length,
        processing: false,
        error: null,
      });
      setPlacedOrderId(vendorOrders[0].orderId || null);
      setPaymentSuccess(true);
      setShowPaymentForm(true);
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      queryClient.invalidateQueries({ queryKey: ["cart-count"] });
      toast.success(
        vendorOrders.length > 1
          ? "All orders paid successfully!"
          : "Payment successful!",
      );
    } catch (error) {
      toast.error(
        error.response?.data?.message || error.message || "Payment failed",
      );
      setPayProgress((p) => ({ ...p, processing: false, error: true }));
    }
  };

  const handlePaymentCancel = () => {
    setShowPaymentForm(false);
    setPaymentIntentId(null);
    setPaymentSuccess(false);
    setPlacedOrderId(null);
    setVendorOrders([]);
    setPaidIntentIds([]);
    setPayProgress({ current: 0, processing: false, error: null });
  };

  const handleViewOrder = () => {
    if (vendorOrders.length > 1) {
      navigate("/orders");
      return;
    }
    if (placedOrderId) {
      navigate(`/orders/${placedOrderId}`);
    } else {
      navigate("/orders");
    }
  };

  if (
    cartLoading ||
    (addressesLoading && addresses.length === 0)
  ) {
    return <LoadingState />;
  }

  if (enrichedItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#eef0ff] via-[#f8f9fc] to-white">
        <Navbar />
        <div className="flex min-h-[70vh] flex-col items-center justify-center px-4">
          <div className="rounded-3xl border border-gray-100 bg-white p-8 text-center shadow-sm">
            <p className="text-red-500">Your cart is empty.</p>
            <button
              onClick={() => navigate("/home")}
              className="mt-4 rounded-xl bg-[#4c2ed8] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#3a24b0]"
            >
              Start Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  const fieldBase =
    "w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-4 text-sm text-gray-800 outline-none transition-all focus:border-[#4c2ed8] focus:bg-white focus:ring-2 focus:ring-[#4c2ed8]/10";
  const labelCls =
    "mb-2 block text-xs font-bold uppercase tracking-wider text-gray-500";

  const renderField = (icon, label, obj) => {
    const Icon = icon;
    return (
      <div className="group">
        <label className={labelCls}>
          {label} {obj.required && <span className="text-red-500">*</span>}
        </label>
        <div className="relative">
          {Icon && (
            <Icon
              size={17}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 transition-colors group-focus-within:text-[#4c2ed8]"
            />
          )}
          <input
            type={obj.type || "text"}
            value={form[obj.name]}
            onChange={(e) => handleChange(obj.name, e.target.value)}
            placeholder={obj.placeholder}
            className={fieldBase}
          />
        </div>
      </div>
    );
  };

  const renderAddressCard = (address) => {
    const isSelected = effectiveSelectedId === address.id;
    return (
      <div
        key={address.id}
        onClick={() => setSelectedId(address.id)}
        className={`flex items-start gap-3 rounded-xl border p-3.5 transition-colors ${
          isSelected
            ? "border-[#4c2ed8] bg-[#4c2ed8]/5"
            : "border-gray-200 bg-white hover:border-[#4c2ed8]/30"
        }`}
      >
        <input
          type="radio"
          checked={isSelected}
          onChange={() => setSelectedId(address.id)}
          className="mt-1 h-4 w-4 shrink-0 accent-[#4c2ed8]"
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline gap-2">
            <span className="truncate text-[13px] font-bold text-gray-900">
              {address.name || "Delivery Address"}
            </span>
            <span className="text-xs text-gray-500">{address.phone_no}</span>
          </div>
          <p className="mt-0.5 truncate text-xs leading-relaxed text-gray-600">
            {address.house_no}, {address.road_area_colony}, {address.city},{" "}
            {address.state} - {address.zipcode}
            {address.landmark ? `, ${address.landmark}` : ""},{" "}
            {address.country}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-0.5">
          <button
            onClick={(e) => {
              e.stopPropagation();
              startEdit(address);
            }}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition hover:bg-[#4c2ed8]/10 hover:text-[#4c2ed8]"
            title="Edit address"
          >
            <Pencil size={14} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteAddress(address);
            }}
            disabled={deleteAddress.isPending}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition hover:bg-red-50 hover:text-red-500 disabled:opacity-40"
            title="Delete address"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#eef0ff] via-[#f8f9fc] to-white">
      <Navbar />

      <main className="mx-auto max-w-6xl px-4 py-8 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate("/cart")}
            className="flex items-center gap-1.5 text-sm font-semibold text-[#4c2ed8] transition hover:text-[#3a24b0]"
          >
            <ChevronLeft size={16} />
            Back to Cart
          </button>
          <div className="mt-3 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#4c2ed8] to-[#368de8] shadow-lg shadow-indigo-200">
              <Lock size={19} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Checkout</h1>
              <p className="text-xs text-gray-500">
                Complete your delivery details to place the order
              </p>
            </div>
          </div>

          {/* Stepper */}
          <div className="mt-5 flex items-center gap-2 text-xs font-semibold">
            <span className="flex items-center gap-1.5 rounded-full bg-[#4c2ed8] px-4 py-2 text-white shadow-md shadow-[#4c2ed8]/20">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/20 text-[10px]">
                1
              </span>
              Delivery Address
            </span>
            <ChevronRight size={14} className="text-gray-300" />
            <span className="flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-gray-400 ring-1 ring-gray-200">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gray-100 text-[10px]">
                2
              </span>
              Payment
            </span>
          </div>
        </div>

        <div className="grid items-start gap-6 lg:grid-cols-[1fr_380px]">
          {/* Left: Address Section */}
          <div>
            {mode === "form" ? (
              <div className="rounded-[1.75rem] border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <h2 className="text-base font-bold text-gray-900">
                      {editingId ? "Edit Delivery Address" : "Add New Address"}
                    </h2>
                    <p className="mt-1 text-xs text-gray-500">
                      Fill in the delivery details below
                    </p>
                  </div>
                  <button
                    onClick={backToList}
                    className="flex items-center gap-1 rounded-xl px-3 py-2 text-sm font-medium text-[#4c2ed8] transition hover:bg-[#4c2ed8]/5"
                  >
                    <ChevronLeft size={14} />
                    Back
                  </button>
                </div>

                <form onSubmit={handleSubmitAddress} className="space-y-5">
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    {renderField(UserIcon, "Full Name", {
                      name: "name",
                      placeholder: "Enter recipient name",
                    })}
                    {renderField(Phone, "Phone Number", {
                      name: "phone_no",
                      placeholder: "10-15 digit contact number",
                      type: "tel",
                      required: true,
                    })}
                  </div>

                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    {renderField(Home, "House No / Flat", {
                      name: "house_no",
                      placeholder: "House number, building",
                      required: true,
                    })}
                    {renderField(Navigation, "Road / Area / Colony", {
                      name: "road_area_colony",
                      placeholder: "Street, area, colony",
                      required: true,
                    })}
                  </div>

                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    {renderField(Building2, "City", {
                      name: "city",
                      placeholder: "Enter city",
                      required: true,
                    })}
                    {renderField(Hash, "Zipcode", {
                      name: "zipcode",
                      placeholder: "Postal / PIN code",
                      required: true,
                    })}
                  </div>

                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    {renderField(Landmark, "Landmark", {
                      name: "landmark",
                      placeholder: "Nearby landmark (optional)",
                    })}
                    {renderField(Globe, "State", {
                      name: "state",
                      placeholder: "Enter state",
                      required: true,
                    })}
                  </div>

                  <div className="grid grid-cols-1 gap-5">
                    {renderField(Globe, "Country", {
                      name: "country",
                      placeholder: "Enter country",
                      required: true,
                    })}
                  </div>

                  <div className="flex items-center justify-end gap-3 border-t border-gray-100 pt-6">
                    <button
                      type="button"
                      onClick={backToList}
                      className="rounded-xl px-5 py-3 text-sm font-semibold text-gray-500 transition hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={addAddress.isPending || updateAddress.isPending}
                      className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#4c2ed8] to-[#368de8] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-[#4c2ed8]/25 transition hover:shadow-xl disabled:opacity-50"
                    >
                      {addAddress.isPending || updateAddress.isPending ? (
                        <>
                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                          Saving...
                        </>
                      ) : editingId ? (
                        <>
                          <Pencil size={15} />
                          Update Address
                        </>
                      ) : (
                        <>
                          <Plus size={15} />
                          Save Address
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="mb-1 flex items-center justify-between">
                  <div>
                    <h2 className="text-base font-bold text-gray-900">
                      Delivery Address
                    </h2>
                    <p className="mt-0.5 text-xs text-gray-500">
                      {addresses.length > 0
                        ? `${addresses.length} saved ${
                            addresses.length === 1 ? "address" : "addresses"
                          }`
                        : "No saved addresses yet"}
                    </p>
                  </div>
                  <button
                    onClick={startAdd}
                    className="flex items-center gap-1.5 rounded-xl bg-[#4c2ed8] px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-[#4c2ed8]/20 transition hover:bg-[#3a24b0]"
                  >
                    <Plus size={14} />
                    Add New Address
                  </button>
                </div>

                {addressesLoading ? (
                  <div className="flex items-center justify-center rounded-[1.75rem] border border-gray-100 bg-white py-16 shadow-sm">
                    <div className="h-9 w-9 animate-spin rounded-full border-3 border-[#4c2ed8] border-t-transparent"></div>
                  </div>
                ) : addresses.length === 0 ? (
                  <div className="flex flex-col items-center justify-center rounded-[1.75rem] border border-dashed border-gray-200 bg-white px-6 py-16 text-center shadow-sm">
                    <div className="relative mb-5 flex h-20 w-20 items-center justify-center">
                      <div className="absolute inset-0 rounded-[1.5rem] bg-gradient-to-br from-[#4c2ed8]/15 to-[#368de8]/15 blur-xl"></div>
                      <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-[#4c2ed8]/10 bg-gradient-to-br from-[#4c2ed8]/10 to-[#368de8]/10">
                        <MapPin size={26} className="text-[#4c2ed8]" />
                      </div>
                    </div>
                    <p className="text-sm font-bold text-gray-800">
                      No saved addresses yet
                    </p>
                    <p className="mt-1 mb-6 max-w-xs text-xs text-gray-500">
                      Add a delivery address so we know where to send your order.
                    </p>
                    <button
                      onClick={startAdd}
                      className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#4c2ed8] to-[#368de8] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-[#4c2ed8]/25 transition hover:shadow-xl"
                    >
                      <Plus size={16} />
                      Add New Address
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {addresses.map(renderAddressCard)}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right: Order Summary */}
          <div className="lg:sticky lg:top-20 lg:self-start">
            <div className="overflow-hidden rounded-[1.75rem] border border-gray-100 bg-white shadow-sm">
              <div className="flex items-center gap-2.5 bg-gradient-to-r from-[#4c2ed8] to-[#368de8] px-6 py-4">
                <CreditCard size={16} className="text-white/90" />
                <h2 className="text-sm font-bold uppercase tracking-wider text-white">
                  Order Summary
                </h2>
              </div>

              <div className="p-6">
                {/* Items */}
                <div className="max-h-56 space-y-3 overflow-y-auto pr-1">
                  {enrichedItems.map((item) => (
                    <div key={item.id} className="flex items-center gap-3">
                      <div className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-gray-50 to-gray-100">
                        {item.imageUrl ? (
                          <img
                            src={item.imageUrl}
                            alt={item.product.pro_name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <Trash2 size={16} className="text-gray-300" />
                        )}
                        <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#4c2ed8] text-[9px] font-bold text-white">
                          {item.quantity}
                        </span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-semibold text-gray-800">
                          {item.product.pro_name}
                        </p>
                        <p className="text-[11px] text-gray-400">
                          ₹
                          {item.discountPrice > 0
                            ? item.discountPrice
                            : item.price}{" "}
                          × {item.quantity}
                        </p>
                      </div>
                      <span className="shrink-0 text-xs font-bold text-gray-900">
                        {formatINR(item.lineFinal)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="mt-5 space-y-3 border-t border-dashed border-gray-200 pt-4 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Price ({enrichedItems.length} {enrichedItems.length === 1 ? "item" : "items"})</span>
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
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Delivery</span>
                    <span className="flex items-center gap-1 font-semibold text-green-600">
                      <Truck size={13} />
                      FREE
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
                    <Sparkles size={15} className="mt-0.5 shrink-0 text-green-600" />
                    <p className="text-xs font-semibold leading-relaxed text-green-700">
                      You will save {formatINR(discountTotal)} on this order
                    </p>
                  </div>
                )}

                {mode === "list" && (
                  <>
                    {selectedAddress ? (
                      <div className="mt-4 flex items-start gap-2.5 rounded-2xl border border-[#4c2ed8]/10 bg-[#4c2ed8]/5 px-4 py-3">
                        <MapPin size={15} className="mt-0.5 shrink-0 text-[#4c2ed8]" />
                        <p className="text-xs leading-relaxed text-gray-600">
                          <span className="font-bold text-gray-800">
                            {selectedAddress.name || "Delivery Address"}
                          </span>{" "}
                          - {selectedAddress.house_no},{" "}
                          {selectedAddress.road_area_colony},{" "}
                          {selectedAddress.city}, {selectedAddress.state} -{" "}
                          {selectedAddress.zipcode}
                        </p>
                      </div>
                    ) : (
                      <div className="mt-4 rounded-2xl bg-amber-50 px-4 py-3 text-xs font-medium text-amber-600">
                        Please select or add a delivery address to continue.
                      </div>
                    )}

                    {isMultiVendor && (
                      <div className="mt-4 rounded-2xl border border-[#4c2ed8]/10 bg-[#4c2ed8]/5 px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Store size={15} className="shrink-0 text-[#4c2ed8]" />
                          <p className="text-xs font-bold text-gray-800">
                            Your cart has items from {vendorGroups.length}{" "}
                            sellers
                          </p>
                        </div>
                        <p className="mt-1 text-[11px] leading-relaxed text-gray-500">
                          Your order will be split into {vendorGroups.length}{" "}
                          separate orders so every seller gets paid. Enter your
                          card once and we settle each seller.
                        </p>
                      </div>
                    )}

                    <button
                      onClick={handlePlaceOrder}
                      disabled={addresses.length === 0 || !effectiveSelectedId || placeOrder.isPending || placingOrders}
                      className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#4c2ed8] to-[#368de8] px-6 py-4 text-sm font-bold text-white shadow-lg shadow-[#4c2ed8]/25 transition hover:shadow-xl hover:shadow-[#4c2ed8]/35 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
                    >
                      {placeOrder.isPending || placingOrders ? (
                        <>
                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                          Placing Order...
                        </>
                      ) : (
                        <>
                          {isMultiVendor
                            ? `Place ${vendorGroups.length} Orders`
                            : "Place Order"}
                          <ArrowRight size={16} />
                        </>
                      )}
                    </button>
                  </>
                )}

                <div className="mt-5 flex items-center justify-center gap-5 border-t border-gray-100 pt-4 text-[11px] font-medium text-gray-400">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck size={14} className="text-purple-500" />
                    Secure Payments
                  </span>
                  <span className="flex items-center gap-1.5">
                    <RotateCcw size={14} className="text-blue-500" />
                    7-Day Returns
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {showPaymentForm && paymentIntentId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            {paymentSuccess ? (
              <div className="py-6 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                  <CheckCircle2 size={32} className="text-green-600" />
                </div>
                <h2 className="text-lg font-bold text-gray-900">
                  Payment Successful!
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">
                  {vendorOrders.length > 1
                    ? `All ${vendorOrders.length} seller orders were paid successfully and your orders have been placed.`
                    : "Your payment has been processed successfully and your order has been placed."}
                </p>
                <button
                  onClick={handleViewOrder}
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#4c2ed8] to-[#368de8] px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#4c2ed8]/25 transition hover:shadow-xl"
                >
                  {vendorOrders.length > 1 ? "View My Orders" : "View Your Order"}
                  <ArrowRight size={16} />
                </button>
              </div>
            ) : (
              <>
                <div className="mb-5 flex items-center justify-between">
                  <h2 className="text-lg font-bold text-gray-900">
                    {vendorOrders.length > 1
                      ? `Pay ${vendorOrders.length} Seller Orders`
                      : "Enter Card Details"}
                  </h2>
                  <button
                    onClick={handlePaymentCancel}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {vendorOrders.length > 1 ? (
                  <>
                    <div className="mb-4 space-y-2 rounded-xl border border-gray-100 bg-gray-50 p-3">
                      {(() => {
                        const unpaidIndex = vendorOrders.findIndex(
                          (oo) => !paidIntentIds.includes(oo.paymentIntentId),
                        );
                        return vendorOrders.map((o, i) => {
                          const isPaid = paidIntentIds.includes(
                            o.paymentIntentId,
                          );
                          const isCurrent =
                            i === unpaidIndex && payProgress.processing;
                          const isError =
                            i === unpaidIndex &&
                            payProgress.error &&
                            !payProgress.processing;
                          return (
                          <div
                            key={o.paymentIntentId}
                            className="flex items-center justify-between text-xs"
                          >
                            <span className="flex min-w-0 items-center gap-2 font-medium text-gray-700">
                              {isPaid ? (
                                <CheckCircle2 size={15} className="shrink-0 text-green-500" />
                              ) : isCurrent ? (
                                <span className="h-3.5 w-3.5 shrink-0 animate-spin rounded-full border-2 border-[#4c2ed8] border-t-transparent" />
                              ) : isError ? (
                                <AlertCircle size={15} className="shrink-0 text-red-500" />
                              ) : (
                                <span className="h-3.5 w-3.5 shrink-0 rounded-full border-2 border-gray-300" />
                              )}
                              <span className="truncate">
                                {o.vendorName || `Seller ${i + 1}`}
                              </span>
                            </span>
                            <span className="shrink-0 font-bold text-gray-800">
                              {formatINR(o.amount)}
                            </span>
                          </div>
                        );
                        });
                      })()}
                    </div>
                    {isMultiVendor && (
                      <p className="mb-4 text-xs text-gray-500">
                        Enter your card once — we will charge each seller
                        separately.
                      </p>
                    )}
                  </>
                ) : (
                  <p className="mb-4 text-sm text-gray-600">
                    Total: {formatINR(finalTotal)}
                  </p>
                )}
                <PaymentForm
                  paymentIntentId={paymentIntentId}
                  onSuccess={handlePaymentSuccess}
                  onError={handlePaymentCancel}
                />
              </>
            )}
          </div>
        </div>
      )}

      {placingOrders && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 text-center shadow-xl">
            {placingProgress ? (
              <>
                <div className="mx-auto mb-4 h-11 w-11 animate-spin rounded-full border-[3px] border-[#4c2ed8] border-t-transparent" />
                <h2 className="text-base font-bold text-gray-900">
                  Creating your orders
                </h2>
                <p className="mt-1.5 text-sm text-gray-500">
                  Order {placingProgress.current} of {placingProgress.total} —{" "}
                  {placingProgress.label}
                </p>
                <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-gray-100">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#4c2ed8] to-[#368de8] transition-all duration-500"
                    style={{
                      width: `${(placingProgress.current / placingProgress.total) * 100}%`,
                    }}
                  />
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center gap-3 text-sm text-gray-500">
                <span className="h-8 w-8 animate-spin rounded-full border-2 border-[#4c2ed8] border-t-transparent" />
                Please wait...
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default CheckoutAddress;