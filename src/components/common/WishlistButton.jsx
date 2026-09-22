import { useState } from "react";
import { Heart } from "lucide-react";
import {
  useWishlist,
  useAddToWishlist,
  useRemoveFromWishlist,
} from "../../api/useWishlist";
import toast from "react-hot-toast";

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

  const wishlist =
    wishlistData?.data?.wishlists || wishlistData?.data?.wishlist || [];
  const isWishlisted = wishlist.some(
    (item) => Number(item.product_id) === Number(productId),
  );
  const isPending = pendingId === productId;

  const handleClick = (e) => {
    e.stopPropagation();
    if (!localStorage.getItem("accessToken")) {
      toast.error("Please login to add to wishlist");
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
  );
}

export default WishlistButton;