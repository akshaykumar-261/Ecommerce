import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  ShoppingCart,
  ArrowLeft,
  Package,
  ChevronRight,
  Star,
} from "lucide-react";
import { GetProductsByCategory } from "../../api/productApi";
import { useAddToCart, useCart } from "../../api/useCart";
import { useGetCategory } from "../../api/useVendorApi";
import WishlistButton from "../../components/common/WishlistButton";
import Navbar from "../../components/common/Navbar";
import Popup from "../../components/common/Popup";
import { LogIn, X } from "lucide-react";

const GROUP_CONFIG = {
  fashion: {
    title: "Fashion Sale",
    slugs: ["fashion", "mens-clothing", "womens-clothing", "childs-clothing", "footwear"],
  },
  electronics: {
    title: "Gadget Deals",
    slugs: ["electronics", "mobiles", "laptops", "computers-accessories"],
  },
};

function ProductCard({ product }) {
  const navigate = useNavigate();
  const { mutate: addToCart, isPending: addingToCart } = useAddToCart();
  const { data: cartData } = useCart();
  const isInCart = (cartData?.data?.cart?.cartItems || []).some(
    (item) => item.product_id === product.id,
  );

  const price = parseFloat(product.price) || 0;
  const discountPrice = parseFloat(product.discount_price) || 0;
  const discount =
    price > 0 && discountPrice > 0
      ? Math.round(((price - discountPrice) / price) * 100)
      : 0;

  const primaryMedia = product.product_media?.find((m) => m.is_primary);
  const imageUrl = primaryMedia?.media_url || product.product_media?.[0]?.media_url || null;

  const avgRating = parseFloat(product.avgRating) || 0;
  const reviewCount = parseInt(product.reviewCount) || 0;
  const [showLoginPopup, setShowLoginPopup] = useState(false);

  const handleAddToCartClick = (e) => {
    e.stopPropagation();
    if (!localStorage.getItem("accessToken")) {
      setShowLoginPopup(true);
      return;
    }
    if (isInCart) {
      navigate("/cart");
      return;
    }
    if (product.quantity < 1) {
      toast.error("This product is currently out of stock.");
      return;
    }
    addToCart(
      { product_id: product.id, quantity: 1 },
      {
        onSuccess: (res) =>
          toast.success(res?.message || "Added to cart successfully"),
        onError: (err) =>
          toast.error(err?.response?.data?.message || "Failed to add to cart"),
      },
    );
  };

  return (
    <>
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
    <Popup
      open={showLoginPopup}
      onClose={() => setShowLoginPopup(false)}
      title="Login Required"
      message="Please login to add items to your cart"
    >
      <div className="flex gap-3 mt-4">
        <button
          onClick={() => {
            setShowLoginPopup(false);
            navigate("/login");
          }}
          className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-[#4c2ed8] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#3a24b0]"
        >
          <LogIn size={16} />
          Login
        </button>
        <button
          onClick={() => setShowLoginPopup(false)}
          className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-600 transition hover:bg-gray-50"
        >
          <X size={16} />
          Cancel
        </button>
      </div>
    </Popup>
  </>
  );
}

function EmptyState({ groupName }) {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gray-100">
        <Package size={48} className="text-gray-300" />
      </div>
      <h2 className="mb-2 text-xl font-bold text-gray-800">
        No Products Found
      </h2>
      <p className="mb-6 max-w-sm text-center text-sm text-gray-500">
        We couldn't find any products in the{" "}
        <span className="font-semibold text-gray-700">{groupName}</span>{" "}
        category. Try browsing other categories or check back later.
      </p>
      <button
        onClick={() => navigate("/home")}
        className="flex items-center gap-2 rounded-xl bg-[#4c2ed8] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#3a24b0]"
      >
        <ArrowLeft size={16} />
        Back to Home
      </button>
    </div>
  );
}

export default function CategoryGroup() {
  const { group } = useParams();
  const navigate = useNavigate();
  const { data: categoryData, isLoading: catLoading } = useGetCategory();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const config = GROUP_CONFIG[group];
  const categories = categoryData?.data?.categories || [];
  const groupCategories = config
    ? categories.filter((cat) => config.slugs.includes(cat.slug))
    : [];

  useEffect(() => {
    if (catLoading || groupCategories.length === 0) return;

    const fetchAllProducts = async () => {
      setLoading(true);
      try {
        const allProducts = [];
        for (const cat of groupCategories) {
          try {
            const res = await GetProductsByCategory(cat.id, { page, limit: 12 });
            const catProducts = res?.data?.products?.data || [];
            allProducts.push(...catProducts);
          } catch {
            // skip failed category
          }
        }
        setProducts(allProducts);
        setTotalPages(1);
      } catch {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAllProducts();
  }, [group, page, catLoading, groupCategories.length]);

  if (!config) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
          <EmptyState groupName="Unknown" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
        {/* Breadcrumb */}
        <div className="mb-6 flex items-center gap-2 text-sm text-gray-500">
          <button
            onClick={() => navigate("/home")}
            className="transition hover:text-[#4c2ed8]"
          >
            Home
          </button>
          <ChevronRight size={14} />
          <span className="font-medium text-gray-800">{config.title}</span>
        </div>

        {/* Header */}
        <div className="mb-8 flex items-center gap-4">
          <button
            onClick={() => navigate("/home")}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 text-gray-600 transition hover:bg-gray-50 hover:text-[#4c2ed8]"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{config.title}</h1>
            <p className="text-sm text-gray-500">
              {loading ? "Loading..." : `${products.length} products found`}
            </p>
          </div>
        </div>

        {/* Category chips */}
        <div className="mb-6 flex flex-wrap gap-2">
          {groupCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => navigate(`/products/category/${cat.id}`)}
              className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-600 transition hover:border-[#4c2ed8] hover:bg-[#4c2ed8]/5 hover:text-[#4c2ed8]"
            >
              {cat.cat_name}
            </button>
          ))}
        </div>

        {/* Content */}
        {loading || catLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#4c2ed8] border-t-transparent" />
          </div>
        ) : products.length === 0 ? (
          <EmptyState groupName={config.title} />
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {products.map((product) => (
                <ProductCard key={product._id || product.id} product={product} />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Previous
                </button>
                <span className="px-4 text-sm text-gray-600">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
