import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heart } from "lucide-react";
import {
  useWishlist,
  useAddToWishlist,
  useRemoveFromWishlist,
} from "../../api/useWishlist";
import toast from "react-hot-toast";
import Popup from "./Popup";

function WishlistButton({
  productId,
  className = "",
  activeClassName = "",
  iconSize = 16,
  inactiveIconClassName = "text-gray-400",
  label,
  activeLabel,
}) {
  const { data: wishlistData } = useWishlist();
  const { mutate: addToWishlist } = useAddToWishlist();
  const { mutate: removeFromWishlist } = useRemoveFromWishlist();
  const [pendingId, setPendingId] = useState(null);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const navigate = useNavigate();

  const wishlist =
    wishlistData?.data?.wishlists || wishlistData?.data?.wishlist || [];
  const isWishlisted = wishlist.some(
    (item) => Number(item.product_id) === Number(productId),
  );
  const isPending = pendingId === productId;

  const handleClick = (e) => {
    e.stopPropagation();
    if (!localStorage.getItem("accessToken")) {
      setShowLoginPrompt(true);
      return;
    }
    setPendingId(productId);
    const action = isWishlisted ? removeFromWishlist : addToWishlist;
    action(productId, {
      onError: () =>
        toast.error(
          isWishlisted
            ? "Failed to remove from wishlist"
            : "Failed to add to wishlist",
        ),
      onSettled: () => setPendingId(null),
    });
  };

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        disabled={isPending}
        aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        className={`${className} ${isWishlisted ? activeClassName : ""}`.trim()}
      >
        {isPending ? (
          <div
            style={{ width: iconSize, height: iconSize }}
            className="animate-spin rounded-full border-2 border-current border-t-transparent"
          />
        ) : (
          <>
            <Heart
              size={iconSize}
              className={
                isWishlisted ? "fill-red-500 text-red-500" : inactiveIconClassName
              }
            />
            {label && <span>{isWishlisted ? activeLabel || label : label}</span>}
          </>
        )}
      </button>

      <Popup
        open={showLoginPrompt}
        onClose={() => setShowLoginPrompt(false)}
        icon={<Heart size={24} className="text-red-500" />}
        iconClassName="bg-red-50"
        title="Login Required"
        message="Please login to your account to add products to your wishlist."
      >
        <div className="flex gap-3">
          <button
            onClick={() => setShowLoginPrompt(false)}
            className="flex-1 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              setShowLoginPrompt(false);
              navigate("/login");
            }}
            className="flex-1 rounded-xl bg-[#4c2ed8] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#3a24b0]"
          >
            Login
          </button>
        </div>
      </Popup>
    </>
  );
}

export default WishlistButton;