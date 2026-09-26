import { useState } from "react";
import {
  ArrowLeft,
  Heart,
  ShoppingCart,
  Trash2,
} from "lucide-react";
import { useWishlist, useRemoveFromWishlist } from "../../api/useWishlist";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/common/Navbar";

function Wishlist() {
  const navigate = useNavigate();
  const { data, isLoading, isError } = useWishlist();
  const { mutate: removeFromWishlist } = useRemoveFromWishlist();
  const [removingId, setRemovingId] = useState(null);

  const wishlist = data?.data?.wishlists || data?.data?.wishlist || [];

  const handleRemove = (productId) => {
    setRemovingId(productId);
    removeFromWishlist(productId, {
      onSuccess: (res) => {
        toast.success(res?.message || "Removed from wishlist");
        setRemovingId(null);
      },
      onError: () => {
        toast.error("Failed to remove from wishlist");
        setRemovingId(null);
      },
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f8f9fc]">
        <div className="flex min-h-screen items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#4c2ed8] border-t-transparent"></div>
            <p className="text-sm text-gray-500">Loading wishlist...</p>
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
            <p className="text-center text-red-500">
              Failed to load wishlist.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fc]">
      <Navbar />

      <main className="mx-auto max-w-5xl px-4 py-6">
        {/* Wishlist Count */}
        <div className="mb-6 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Heart size={20} className="fill-red-500 text-red-500" />
            <span className="text-sm text-gray-600">
              {wishlist.length} {wishlist.length === 1 ? "item" : "items"} saved
            </span>
          </div>
          <button
            type="button"
            onClick={() => navigate("/home")}
            className="flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-4 py-2 text-xs font-semibold text-gray-700 shadow-sm transition hover:border-[#4c2ed8] hover:text-[#4c2ed8]"
          >
            <ArrowLeft size={14} />
            Back to Home
          </button>
        </div>

        {wishlist.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl bg-white py-20 shadow-sm">
            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-red-50">
              <Heart size={36} className="text-red-300" />
            </div>
            <h2 className="mb-1 text-lg font-bold text-gray-900">
              Your wishlist is empty
            </h2>
            <p className="mb-6 text-sm text-gray-500">
              Save your favorite products here
            </p>
            <button
              onClick={() => navigate("/home")}
              className="rounded-xl bg-[#4c2ed8] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#3a24b0]"
            >
              Browse Products
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {wishlist.map((item) => {
              const product = item.product;
              if (!product) return null;

              const primaryMedia = product.product_media?.find(
                (m) => m.is_primary
              );
              const imageUrl =
                primaryMedia?.media_url ||
                product.product_media?.[0]?.media_url ||
                null;
              const price = parseFloat(product.price) || 0;
              const discountPrice =
                parseFloat(product.discount_price) || 0;
              const discount =
                price > 0 && discountPrice > 0
                  ? Math.round(((price - discountPrice) / price) * 100)
                  : 0;
              const isRemoving = removingId === product.id;

              return (
                <div
                  key={item.id}
                  className="group overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:shadow-lg hover:shadow-gray-200/60 hover:-translate-y-0.5"
                >
                  {/* Product Image */}
                  <div
                    onClick={() => navigate(`/product/${product.id}`)}
                    className="relative flex h-52 cursor-pointer items-center justify-center overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100"
                  >
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={product.pro_name}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-200/60 text-gray-300">
                        <ShoppingCart size={32} />
                      </div>
                    )}
                    {discount > 0 && (
                      <span className="absolute right-3 top-3 rounded-lg bg-red-500 px-2 py-1 text-[10px] font-bold text-white">
                        -{discount}%
                      </span>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="p-4">
                    <h3
                      onClick={() => navigate(`/product/${product.id}`)}
                      className="mb-2 line-clamp-2 cursor-pointer text-sm font-semibold text-gray-800 hover:text-[#4c2ed8]"
                    >
                      {product.pro_name}
                    </h3>
                    {product.description && (
                      <p className="mb-3 line-clamp-1 text-xs text-gray-500">
                        {product.description}
                      </p>
                    )}
                    <div className="flex items-center justify-between">
                      <div className="flex items-baseline gap-2">
                        <span className="text-lg font-bold text-gray-900">
                          ₹
                          {discountPrice > 0
                            ? discountPrice.toFixed(2)
                            : price.toFixed(2)}
                        </span>
                        {discountPrice > 0 && price > 0 && (
                          <span className="text-sm text-gray-400 line-through">
                            ₹{price.toFixed(2)}
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => handleRemove(product.id)}
                        disabled={isRemoving}
                        className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-400 transition hover:bg-red-50 hover:text-red-500 disabled:opacity-50"
                      >
                        {isRemoving ? (
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-red-500 border-t-transparent"></div>
                        ) : (
                          <Trash2 size={16} />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

export default Wishlist;
