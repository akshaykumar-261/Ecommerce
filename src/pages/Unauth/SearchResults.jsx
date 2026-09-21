import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  ShoppingCart,
  ArrowLeft,
  Search,
  Package,
  ChevronRight,
  Zap,
  User,
  Menu,
  X,
  Star,
  Heart,
} from "lucide-react";
import { SearchProducts } from "../../api/productApi";
import { useWishlist, useAddToWishlist, useRemoveFromWishlist } from "../../api/useWishlist";

function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchValue.trim()) {
      navigate(`/search/${encodeURIComponent(searchValue.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 lg:px-8">
        <button onClick={() => navigate("/home")} className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#4c2ed8] to-[#368de8]">
            <Zap size={20} className="text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-gray-900">
            Shop<span className="text-[#4c2ed8]">Ease</span>
          </span>
        </button>

        <div className="hidden flex-1 px-8 md:block">
          <form onSubmit={handleSearch} className="flex items-center rounded-xl border-2 border-transparent bg-gray-50">
            <Search size={18} className="ml-3 text-gray-400" />
            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Search for products, brands and more..."
              className="w-full bg-transparent px-3 py-2.5 text-sm text-gray-800 outline-none placeholder:text-gray-400"
            />
            <button type="submit" className="mr-1 rounded-lg bg-[#4c2ed8] px-5 py-2 text-sm font-medium text-white transition hover:bg-[#3a24b0]">
              Search
            </button>
          </form>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate("/login")}
            className="hidden items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 sm:flex"
          >
            <User size={18} />
            Sign In
          </button>
          <button className="relative rounded-lg p-2 text-gray-700 transition hover:bg-gray-100">
            <ShoppingCart size={22} />
            <span className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#4c2ed8] text-[10px] font-bold text-white">
              3
            </span>
          </button>
          <button
            className="rounded-lg p-2 text-gray-700 transition hover:bg-gray-100 md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>
    </header>
  );
}

function ProductCard({ product }) {
  const navigate = useNavigate();
  const { mutate: addToWishlist } = useAddToWishlist();
  const { mutate: removeFromWishlist } = useRemoveFromWishlist();
  const { data: wishlistData } = useWishlist();
  const wishlist = wishlistData?.data?.wishlist || [];
  const isWishlisted = wishlist.some((item) => item.product_id === product.id);

  const price = parseFloat(product.price) || 0;
  const discountPrice = parseFloat(product.discount_price) || 0;
  const discount =
    price > 0 && discountPrice > 0
      ? Math.round(((price - discountPrice) / price) * 100)
      : 0;

  const primaryMedia = product.product_media?.find((m) => m.is_primary);
  const imageUrl = primaryMedia?.media_url || product.product_media?.[0]?.media_url || null;

  const handleWishlistClick = (e) => {
    e.stopPropagation();
    if (!localStorage.getItem("accessToken")) {
      toast.error("Please login to add to wishlist");
      return;
    }
    if (isWishlisted) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product.id);
    }
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

        <button
          onClick={handleWishlistClick}
          className="absolute left-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-md backdrop-blur-sm transition hover:bg-white hover:scale-110"
        >
          <Heart
            size={16}
            className={isWishlisted ? "fill-red-500 text-red-500" : "text-gray-400"}
          />
        </button>

        {discount > 0 && (
          <span className="absolute right-3 top-3 rounded-lg bg-red-500 px-2 py-1 text-[10px] font-bold text-white">
            -{discount}%
          </span>
        )}

        <div className="absolute bottom-0 left-0 right-0 flex translate-y-full justify-center gap-2 bg-gradient-to-t from-black/30 to-transparent pb-4 pt-10 transition-transform duration-300 group-hover:translate-y-0">
          <button className="rounded-lg bg-white/90 px-4 py-2 text-xs font-semibold text-gray-800 shadow backdrop-blur-sm transition hover:bg-white">
            Add to Cart
          </button>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="mb-1 line-clamp-2 text-sm font-semibold leading-snug text-gray-800 group-hover:text-[#4c2ed8]">
          {product.pro_name}
        </h3>
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

export default function SearchResults() {
  const { query } = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchSearch = async () => {
      setLoading(true);
      try {
        const res = await SearchProducts(query, { page, limit: 12 });
        const data = res?.data?.products;
        setProducts(data?.data || []);
        setTotalPages(data?.totalPages || 1);
      } catch (err) {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    if (query) fetchSearch();
  }, [query, page]);

  useEffect(() => {
    setPage(1);
  }, [query]);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
        {/* Breadcrumb */}
        <div className="mb-6 flex items-center gap-2 text-sm text-gray-500">
          <button onClick={() => navigate("/home")} className="transition hover:text-[#4c2ed8]">
            Home
          </button>
          <ChevronRight size={14} />
          <span className="font-medium text-gray-800">Search</span>
          <ChevronRight size={14} />
          <span className="font-medium text-gray-800">"{query}"</span>
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
            <h1 className="text-2xl font-bold text-gray-900">
              Search Results for "{query}"
            </h1>
            <p className="text-sm text-gray-500">
              {loading ? "Searching..." : `${products.length} products found`}
            </p>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#4c2ed8] border-t-transparent" />
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gray-100">
              <Package size={48} className="text-gray-300" />
            </div>
            <h2 className="mb-2 text-xl font-bold text-gray-800">
              No Products Found
            </h2>
            <p className="mb-6 max-w-sm text-center text-sm text-gray-500">
              We couldn't find any products matching{" "}
              <span className="font-semibold text-gray-700">"{query}"</span>.
              Try different keywords or browse categories.
            </p>
            <button
              onClick={() => navigate("/home")}
              className="flex items-center gap-2 rounded-xl bg-[#4c2ed8] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#3a24b0]"
            >
              <ArrowLeft size={16} />
              Back to Home
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
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
