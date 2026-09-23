import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
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
} from "lucide-react";
import toast from "react-hot-toast";
import Navbar from "../../components/common/Navbar";
import { useCart } from "../../api/useCart";
import {
  useAddresses,
  useAddAddress,
  useUpdateAddress,
  useDeleteAddress,
} from "../../api/useAddress";

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

  const { data: cartData, isLoading: cartLoading } = useCart();
  const { data: addressData, isLoading: addressesLoading } = useAddresses();
  const addAddress = useAddAddress();
  const updateAddress = useUpdateAddress();
  const deleteAddress = useDeleteAddress();

  const addresses = useMemo(
    () => addressData?.data?.addresses || [],
    [addressData],
  );

  const [selectedId, setSelectedId] = useState(null);
  const [mode, setMode] = useState("list");
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);

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

  const handlePlaceOrder = () => {
    if (!effectiveSelectedId) {
      toast.error("Please select a delivery address.");
      return;
    }
    toast("Order placement coming soon!");
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

                    <button
                      onClick={handlePlaceOrder}
                      disabled={addresses.length === 0 || !effectiveSelectedId}
                      className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#4c2ed8] to-[#368de8] px-6 py-4 text-sm font-bold text-white shadow-lg shadow-[#4c2ed8]/25 transition hover:shadow-xl hover:shadow-[#4c2ed8]/35 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
                    >
                      Place Order
                      <ArrowRight size={16} />
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
    </div>
  );
}

export default CheckoutAddress;