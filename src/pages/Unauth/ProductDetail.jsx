import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  ArrowLeft,
  ChevronRight,
  ChevronLeft,
  X,
  Heart,
  Share2,
  Truck,
  Shield,
  RotateCcw,
  Star,
} from "lucide-react";
import { GetProductById } from "../../api/productApi";
import { useWishlist, useAddToWishlist, useRemoveFromWishlist } from "../../api/useWishlist";
import Navbar from "../../components/common/Navbar";
import toast from "react-hot-toast";

function ImageGallery({ images, isWishlisted, handleWishlistToggle }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const nextImage = () => {
    setSelectedIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setSelectedIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const openLightbox = () => {
    setLightboxOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    document.body.style.overflow = "auto";
  };

  const lightboxNext = () => {
    setSelectedIndex((prev) => (prev + 1) % images.length);
  };

  const lightboxPrev = () => {
    setSelectedIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  if (!images || images.length === 0) {
    return (
      <div className="flex h-[400px] items-center justify-center rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 lg:h-[500px]">
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gray-200/60 text-gray-300">
          <ShoppingCart size={48} />
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-4">
        {/* Main Image */}
        <div
          className="relative cursor-zoom-in overflow-hidden rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100"
          onClick={openLightbox}
        >
          <div className="relative aspect-square max-h-[500px] overflow-hidden">
            <img
              src={images[selectedIndex].media_url}
              alt={`Product ${selectedIndex + 1}`}
              className="h-full w-full object-contain transition-transform duration-500 hover:scale-110"
            />
          </div>

          {/* Wishlist Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleWishlistToggle();
            }}
            className={`absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full shadow-md backdrop-blur-sm transition-all hover:scale-110 ${
              isWishlisted
                ? "bg-red-50 shadow-red-200"
                : "bg-white/90 hover:bg-white"
            }`}
          >
            <Heart
              size={18}
              className={isWishlisted ? "fill-red-500 text-red-500" : "text-gray-500"}
            />
          </button>

          {/* Zoom Hint */}
          <div className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-lg bg-black/50 px-2.5 py-1.5 text-[11px] font-medium text-white backdrop-blur-sm">
            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
            </svg>
            Click to zoom
          </div>

          {/* Navigation Arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); prevImage(); }}
                className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 shadow-lg transition hover:bg-white hover:scale-105"
              >
                <ChevronLeft size={20} className="text-gray-700" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); nextImage(); }}
                className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 shadow-lg transition hover:bg-white hover:scale-105"
              >
                <ChevronRight size={20} className="text-gray-700" />
              </button>
            </>
          )}

          {/* Image Counter */}
          <div className="absolute bottom-3 left-3 rounded-full bg-black/60 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
            {selectedIndex + 1} / {images.length}
          </div>
        </div>

        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-2">
            {images.map((img, index) => (
              <button
                key={img.id}
                onClick={() => setSelectedIndex(index)}
                className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border-2 transition-all duration-200 lg:h-20 lg:w-20 ${
                  selectedIndex === index
                    ? "border-[#4c2ed8] shadow-md shadow-[#4c2ed8]/20"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <img
                  src={img.media_url}
                  alt={`Thumbnail ${index + 1}`}
                  className="h-full w-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Fullscreen Lightbox */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm"
          onClick={closeLightbox}
        >
          {/* Close Button */}
          <button
            onClick={closeLightbox}
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 hover:scale-110 z-[110]"
          >
            <X size={24} />
          </button>

          {/* Image Counter */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-sm z-[110]">
            {selectedIndex + 1} / {images.length}
          </div>

          {/* Previous Button */}
          {images.length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); lightboxPrev(); }}
              className="absolute left-4 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 hover:scale-110 z-[110]"
            >
              <ChevronLeft size={28} />
            </button>
          )}

          {/* Image */}
          <img
            src={images[selectedIndex].media_url}
            alt={`Product ${selectedIndex + 1}`}
            className="max-h-[85vh] max-w-[90vw] object-contain rounded-lg z-[105]"
            onClick={(e) => e.stopPropagation()}
          />

          {/* Next Button */}
          {images.length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); lightboxNext(); }}
              className="absolute right-4 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 hover:scale-110 z-[110]"
            >
              <ChevronRight size={28} />
            </button>
          )}

          {/* Thumbnail Strip */}
          {images.length > 1 && (
            <div
              className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2 z-[110]"
              onClick={(e) => e.stopPropagation()}
            >
              {images.map((img, index) => (
                <button
                  key={img.id}
                  onClick={() => setSelectedIndex(index)}
                  className={`h-14 w-14 overflow-hidden rounded-lg border-2 transition-all duration-200 ${
                    selectedIndex === index
                      ? "border-white shadow-lg scale-105"
                      : "border-white/30 opacity-60 hover:opacity-100"
                  }`}
                >
                  <img
                    src={img.media_url}
                    alt={`Thumb ${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const { data: wishlistData } = useWishlist();
  const { mutate: addToWishlist } = useAddToWishlist();
  const { mutate: removeFromWishlist } = useRemoveFromWishlist();

  const wishlist = wishlistData?.data?.wishlists || [];
  const isWishlisted = wishlist.some((item) => item.product_id === Number(id));

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await GetProductById(id);
        setProduct(res?.data?.product || res?.data || res);
      } catch (err) {
        setError("Product not found or something went wrong.");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleWishlistToggle = () => {
    if (!localStorage.getItem("accessToken")) {
      toast.error("Please login to add to wishlist");
      return;
    }
    if (isWishlisted) {
      removeFromWishlist(id, {
        onSuccess: (res) => toast.success(res?.message || "Removed from wishlist"),
        onError: () => toast.error("Failed to remove from wishlist"),
      });
    } else {
      addToWishlist(id, {
        onSuccess: (res) => toast.success(res?.message || "Added to wishlist"),
        onError: () => toast.error("Failed to add to wishlist"),
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="flex items-center justify-center py-32">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#4c2ed8] border-t-transparent" />
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="flex flex-col items-center justify-center py-32">
          <p className="mb-4 text-sm text-red-500">{error || "Product not found"}</p>
          <button
            onClick={() => navigate("/home")}
            className="flex items-center gap-2 rounded-xl bg-[#4c2ed8] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#3a24b0]"
          >
            <ArrowLeft size={16} />
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const price = parseFloat(product.price) || 0;
  const discountPrice = parseFloat(product.discount_price) || 0;
  const discount =
    price > 0 && discountPrice > 0
      ? Math.round(((price - discountPrice) / price) * 100)
      : 0;

  const images = product.product_media || [];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="mx-auto max-w-7xl px-4 py-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="mb-6 flex items-center gap-2 text-sm text-gray-500">
          <button onClick={() => navigate("/home")} className="transition hover:text-[#4c2ed8]">
            Home
          </button>
          <ChevronRight size={14} />
          <button
            onClick={() => navigate(`/products/category/${product.category_id}`)}
            className="transition hover:text-[#4c2ed8]"
          >
            {product.category?.cat_name || "Category"}
          </button>
          <ChevronRight size={14} />
          <span className="font-medium text-gray-800 line-clamp-1">{product.pro_name}</span>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Left: Image Gallery */}
          <div>
            <ImageGallery images={images} isWishlisted={isWishlisted} handleWishlistToggle={handleWishlistToggle} />
          </div>

          {/* Right: Product Info */}
          <div className="flex flex-col">
            <h1 className="mb-2 text-2xl font-bold text-gray-900 lg:text-3xl">
              {product.pro_name}
            </h1>

            {/* Rating Placeholder */}
            <div className="mb-4 flex items-center gap-2">
              <div className="flex items-center gap-1 rounded-lg bg-green-600 px-2 py-0.5">
                <Star size={12} className="fill-white text-white" />
                <span className="text-xs font-semibold text-white">4.0</span>
              </div>
              <span className="text-sm text-gray-400">|</span>
              <span className="text-sm text-gray-500">In Stock</span>
            </div>

            {/* Price */}
            <div className="mb-6 rounded-xl bg-gray-50 p-4">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-extrabold text-gray-900">
                  ₹{discountPrice > 0 ? discountPrice.toFixed(2) : price.toFixed(2)}
                </span>
                {discountPrice > 0 && price > 0 && (
                  <>
                    <span className="text-lg text-gray-400 line-through">
                      ₹{price.toFixed(2)}
                    </span>
                    <span className="rounded-lg bg-green-100 px-2 py-0.5 text-sm font-bold text-green-700">
                      {discount}% off
                    </span>
                  </>
                )}
              </div>
              <p className="mt-1 text-xs text-gray-500">Inclusive of all taxes</p>
            </div>

            {/* Description */}
            <div className="mb-6">
              <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-gray-500">
                Description
              </h3>
              <p className="text-sm leading-relaxed text-gray-600">
                {product.description || "No description available for this product."}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="mb-6 flex gap-3">
              <button className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#4c2ed8] px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#4c2ed8]/25 transition hover:bg-[#3a24b0] hover:shadow-xl hover:shadow-[#4c2ed8]/30 active:scale-[0.98]">
                <ShoppingCart size={18} />
                Add to Cart
              </button>
              <button className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-orange-500 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-orange-500/25 transition hover:bg-orange-600 hover:shadow-xl hover:shadow-orange-500/30 active:scale-[0.98]">
                Buy Now
              </button>
            </div>

            {/* Wishlist & Share */}
            <div className="mb-6 flex gap-3">
              <button
                onClick={handleWishlistToggle}
                className={`flex items-center gap-2 rounded-xl border px-5 py-2.5 text-sm font-medium transition-all duration-200 ${
                  isWishlisted
                    ? "border-red-200 bg-red-50 text-red-600"
                    : "border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
              >
                <Heart
                  size={16}
                  className={isWishlisted ? "fill-red-500 text-red-500" : ""}
                />
                {isWishlisted ? "Wishlisted" : "Wishlist"}
              </button>
              <button className="flex items-center gap-2 rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-gray-50">
                <Share2 size={16} />
                Share
              </button>
            </div>

            {/* Delivery Info */}
            <div className="rounded-xl border border-gray-100 p-4">
              <h3 className="mb-3 text-sm font-semibold text-gray-900">
                Delivery Options
              </h3>
              <div className="flex flex-col gap-3 sm:flex-row">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                    <Truck size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">Free Delivery</p>
                    <p className="text-xs text-gray-400">On orders above ₹499</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-50 text-green-600">
                    <RotateCcw size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">7-Day Returns</p>
                    <p className="text-xs text-gray-400">Easy return policy</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-50 text-purple-600">
                    <Shield size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">Secure Payment</p>
                    <p className="text-xs text-gray-400">100% protected checkout</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
