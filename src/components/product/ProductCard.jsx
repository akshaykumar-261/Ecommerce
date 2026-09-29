import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { ShoppingCart, Star } from "lucide-react";
import { useAddToCart, useCart, useIsInGuestCart } from "../../api/useCart";
import WishlistButton from "../common/WishlistButton";

function ProductCard({ product }) {
  const navigate = useNavigate();
  const { mutate: addToCart, isPending: addingToCart } = useAddToCart();
  const { data: cartData } = useCart();
  const isInGuestCart = useIsInGuestCart(product.id);
  const isLoggedIn = !!localStorage.getItem("accessToken");
  const isInCart = isLoggedIn
    ? (cartData?.data?.cart?.cartItems || []).some(
        (item) => item.product_id === product.id,
      )
    : isInGuestCart;

  const price = parseFloat(product.price) || 0;
  const discountPrice = parseFloat(product.discount_price) || 0;
  const discount =
    price > 0 && discountPrice > 0
      ? Math.round(((price - discountPrice) / price) * 100)
      : 0;

  const primaryMedia = product.product_media?.find((m) => m.is_primary);
  const imageUrl =
    primaryMedia?.media_url || product.product_media?.[0]?.media_url || null;
  const avgRating = parseFloat(product.avgRating) || 0;
  const reviewCount = parseInt(product.reviewCount) || 0;

  const handleAddToCartClick = (e) => {
    e.stopPropagation();
    if (isInCart) {
      navigate("/cart");
      return;
    }
    if (product.quantity < 1) {
      toast.error("This product is currently out of stock.");
      return;
    }
    addToCart(
      { product_id: product.id, product, quantity: 1 },
      {
        onSuccess: (res) =>
          toast.success(res?.message || "Added to cart successfully"),
        onError: (err) =>
          toast.error(err?.response?.data?.message || "Failed to add to cart"),
      },
    );
  };

  return (
    <div
      onClick={() => navigate(`/product/${product.id}`)}
      className="group relative flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:shadow-lg hover:shadow-gray-200/60 hover:-translate-y-1"
    >
      <div className="relative flex h-52 items-center justify-center overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={product.pro_name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-200/60 text-gray-300 transition group-hover:scale-110">
            <ShoppingCart size={32} />
          </div>
        )}

        <WishlistButton
          productId={product.id}
          className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-md backdrop-blur-sm transition hover:bg-white hover:scale-110"
        />

        {discount > 0 && (
          <span className="absolute left-3 top-3 z-10 rounded-lg bg-red-500 px-2 py-1 text-[10px] font-bold text-white">
            -{discount}%
          </span>
        )}

        <div className="absolute bottom-0 left-0 right-0 flex translate-y-full justify-center gap-2 bg-gradient-to-t from-black/30 to-transparent pb-4 pt-10 transition-transform duration-300 group-hover:translate-y-0">
          <button
            onClick={handleAddToCartClick}
            disabled={addingToCart}
            className="flex items-center gap-1.5 rounded-lg bg-white/90 px-4 py-2 text-xs font-semibold text-gray-800 shadow backdrop-blur-sm transition hover:bg-white disabled:opacity-60"
          >
            {addingToCart ? (
              <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-[#4c2ed8] border-t-transparent"></div>
            ) : (
              <ShoppingCart size={14} />
            )}
            {isInCart ? "Go to Cart" : "Add to Cart"}
          </button>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="mb-1 line-clamp-2 text-sm font-semibold leading-snug text-gray-800 group-hover:text-[#4c2ed8]">
          {product.pro_name}
        </h3>
        {avgRating > 0 && (
          <div className="mb-2 flex items-center gap-1">
            <div className="flex items-center gap-1 rounded-md bg-green-600 px-1.5 py-0.5">
              <Star size={10} className="fill-white text-white" />
              <span className="text-[11px] font-semibold text-white">
                {avgRating.toFixed(1)}
              </span>
            </div>
            <span className="text-[11px] text-gray-400">
              ({reviewCount.toLocaleString()})
            </span>
          </div>
        )}
        <p className="mb-2 line-clamp-2 text-xs text-gray-400">
          {product.description}
        </p>
        <div className="mt-auto flex items-baseline gap-2">
          <span className="text-lg font-bold text-gray-900">
            ₹{discountPrice > 0 ? discountPrice.toFixed(2) : price.toFixed(2)}
          </span>
          {discountPrice > 0 && price > 0 && (
            <span className="text-sm text-gray-400 line-through">
              ₹{price.toFixed(2)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
