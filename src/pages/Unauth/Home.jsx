import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import pro4 from "../../assets/pro4.png";
import { GetTopRatedProducts } from "../../api/productApi";
import { useAddToCart, useCart } from "../../api/useCart";
import { useGetCategory } from "../../api/useVendorApi";
import WishlistButton from "../../components/common/WishlistButton";
import Navbar from "../../components/common/Navbar";
import Footer from "../../components/common/Footer";
import toast from "react-hot-toast";
import {
  Search,
  ShoppingCart,
  ChevronRight,
  Star,
  Truck,
  Shield,
  RotateCcw,
  Headphones,
  Smartphone,
  Laptop,
  Monitor,
  Shirt,
  Baby,
  Footprints,
  Sparkles,
  Home as HomeIcon,
  Armchair,
  Apple,
  BookOpen,
  Dumbbell,
  Car,
  PawPrint,
  BriefcaseBusiness,
  Gamepad2,
  ArrowRight,
  Flame,
  TrendingUp,
  Tag,
  Gem,
} from "lucide-react";

/* ───────── Category ↔ Icon Map ───────── */
const CATEGORY_ICONS = {
  electronics: Smartphone,
  mobiles: Smartphone,
  laptops: Laptop,
  "computers-accessories": Monitor,
  fashion: Shirt,
  "mens-clothing": Shirt,
  "childs-clothing": Baby,
  "womens-clothing": Sparkles,
  footwear: Footprints,
  "beauty-personal-care": Sparkles,
  "home-kitchen": HomeIcon,
  furniture: Armchair,
  grocery: Apple,
  books: BookOpen,
  "sports-fitness": Dumbbell,
  automotive: Car,
  "pet-supplies": PawPrint,
  "office-supplies": BriefcaseBusiness,
  jewellery: Gem,
  "bags-luggage": BriefcaseBusiness,
  "toys-games": Gamepad2,
};
/* ────────────────────────────────────────
   HERO BANNER
   ──────────────────────────────────────── */
function HeroBanner() {
  return (
    <section className="relative overflow-hidden h-[420px]">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img src={pro4} alt="Hero Banner" className="w-full h-full object-cover" />
      </div>

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Content */}
      <div className="relative z-10 mx-auto flex h-full max-w-7xl items-center px-4 lg:px-8">
        <div className="max-w-2xl animate-home-slide-up">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-sm font-medium text-white/90 backdrop-blur-sm">
            <Flame size={14} />
            Mega Sale — Up to 70% Off
          </div>

          <h1 className="mb-4 text-4xl font-extrabold leading-tight tracking-tight text-white md:text-5xl lg:text-6xl">
            Discover the
            <span className="block bg-gradient-to-r from-yellow-300 to-orange-400 bg-clip-text text-transparent">
              Best Deals Online
            </span>
          </h1>

          <p className="mb-8 max-w-md text-base text-white/75 md:text-lg">
            Shop from thousands of products across 20+ categories. Unbeatable
            prices, fast delivery, and secure payments.
          </p>

          <div className="flex flex-wrap gap-3">
            <button className="flex items-center gap-2 rounded-xl bg-white px-7 py-3.5 text-sm font-semibold text-[#4c2ed8] shadow-lg transition hover:shadow-xl hover:shadow-white/20">
              Shop Now
              <ArrowRight size={16} />
            </button>
            <button className="flex items-center gap-2 rounded-xl border border-white/30 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/10">
              View Deals
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────
   TRUST BADGES
   ──────────────────────────────────────── */
function TrustBadges() {
  const badges = [
    { icon: Truck, label: "Free Shipping", sub: "On orders over $50" },
    { icon: Shield, label: "Secure Payment", sub: "100% protected" },
    { icon: RotateCcw, label: "Easy Returns", sub: "30-day policy" },
    { icon: Headphones, label: "24/7 Support", sub: "Dedicated help" },
  ];

  return (
    <section className="border-b border-gray-100 bg-white">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-4 py-3 md:grid-cols-4 lg:px-8">
        {badges.map((b, i) => (
          <div
            key={i}
            className="flex items-center gap-3 rounded-xl px-4 py-3 transition hover:bg-gray-50"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#4c2ed8]/8 text-[#4c2ed8]">
              <b.icon size={20} />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">{b.label}</p>
              <p className="text-xs text-gray-500">{b.sub}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ────────────────────────────────────────
   CATEGORIES GRID
   ──────────────────────────────────────── */
function CategoriesSection() {
  const navigate = useNavigate();
  const scrollRef = React.useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const { data: categoryData, isLoading } = useGetCategory();
  const categories = categoryData?.data?.categories || [];

  const checkScroll = () => {
    const el = scrollRef.current;
    if (el) {
      setCanScrollLeft(el.scrollLeft > 10);
      setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
    }
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      checkScroll();
      el.addEventListener("scroll", checkScroll);
      window.addEventListener("resize", checkScroll);
    }
    return () => {
      if (el) el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, []);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.clientWidth * 0.6;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="bg-gray-50/60">
      <div className="mx-auto max-w-7xl px-4 py-4 lg:px-8">
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-gray-900">
            Shop by Category
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Browse our wide range of categories
          </p>
        </div>

        <div className="relative">
          {/* Left Arrow */}
          {canScrollLeft && (
            <button
              onClick={() => scroll("left")}
              className="absolute -left-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-gray-200 bg-white shadow-lg text-gray-600 transition-all duration-200 hover:bg-[#4c2ed8] hover:text-white hover:shadow-xl hover:scale-105 active:scale-95"
            >
              <ChevronRight size={22} className="rotate-180" />
            </button>
          )}

          {/* Left Fade */}
          {canScrollLeft && (
            <div className="pointer-events-none absolute -left-1 top-0 bottom-0 w-12 bg-gradient-to-r from-gray-50/90 to-transparent z-[5]" />
          )}

          {/* Right Fade */}
          {canScrollRight && (
            <div className="pointer-events-none absolute -right-1 top-0 bottom-0 w-12 bg-gradient-to-l from-gray-50/90 to-transparent z-[5]" />
          )}

          {/* Right Arrow */}
          {canScrollRight && (
            <button
              onClick={() => scroll("right")}
              className="absolute -right-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-gray-200 bg-white shadow-lg text-gray-600 transition-all duration-200 hover:bg-[#4c2ed8] hover:text-white hover:shadow-xl hover:scale-105 active:scale-95"
            >
              <ChevronRight size={22} />
            </button>
          )}

          {/* Scrollable Categories */}
          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto scroll-smooth pb-4"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#4c2ed8] border-t-transparent" />
              </div>
            ) : categories.map((cat) => {
              const Icon = CATEGORY_ICONS[cat.slug] || Tag;
              return (
                <button
                  key={cat.id}
                  onClick={() => navigate(`/products/category/${cat.id}`)}
                  className="group flex min-w-[120px] flex-col items-center gap-3 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all duration-200 hover:border-[#4c2ed8]/20 hover:shadow-md hover:shadow-[#4c2ed8]/5 hover:-translate-y-0.5"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#4c2ed8]/8 to-[#368de8]/8 text-[#4c2ed8] transition-all duration-200 group-hover:from-[#4c2ed8] group-hover:to-[#368de8] group-hover:text-white group-hover:shadow-lg group-hover:shadow-[#4c2ed8]/20">
                    <Icon size={24} />
                  </div>
                  <span className="whitespace-nowrap text-center text-xs font-medium leading-tight text-gray-700 group-hover:text-[#4c2ed8]">
                    {cat.cat_name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────
   PRODUCT CARD
   ──────────────────────────────────────── */
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
  const imageUrl =
    primaryMedia?.media_url || product.product_media?.[0]?.media_url || null;

  const productName = product.pro_name || product.name;
  const avgRating = parseFloat(product.avgRating) || 0;
  const reviewCount = parseInt(product.reviewCount) || 0;

  const handleAddToCartClick = (e) => {
    e.stopPropagation();
    if (!localStorage.getItem("accessToken")) {
      toast.error("Please login to add to cart");
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
    <div
      onClick={() => product.id && navigate(`/product/${product.id}`)}
      className="group relative flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:shadow-lg hover:shadow-gray-200/60 hover:-translate-y-1"
    >
      <div className="relative flex h-52 items-center justify-center overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={productName}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-200/60 text-gray-300 transition group-hover:scale-110">
            <ShoppingCart size={32} />
          </div>
        )}

        {discount > 0 && (
          <span className="absolute left-3 top-3 z-10 rounded-lg bg-red-500 px-2 py-1 text-[10px] font-bold text-white">
            -{discount}%
          </span>
        )}

        <WishlistButton
          productId={product.id}
          className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-md backdrop-blur-sm transition hover:bg-white hover:scale-110"
        />

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
          {productName}
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
  );
}

/* ────────────────────────────────────────
   FEATURED PRODUCTS
   ──────────────────────────────────────── */
function FeaturedProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopRated = async () => {
      try {
        const res = await GetTopRatedProducts({ minRating: 3, limit: 8 });
        setProducts(res?.data?.products || []);
      } catch (err) {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchTopRated();
  }, []);

  return (
    <section>
      <div className="mx-auto max-w-7xl px-4 py-4 lg:px-8">
        <div className="mb-4 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Top Rated Products
            </h2>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#4c2ed8] border-t-transparent" />
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
              <Star size={32} className="text-gray-300" />
            </div>
            <p className="text-sm text-gray-500">
              No rated products available yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {products.map((p) => (
              <div key={p.id}>
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

/* ────────────────────────────────────────
   PROMO BANNER
   ──────────────────────────────────────── */
function PromoBanner() {
  const navigate = useNavigate();

  return (
    <section className="bg-gray-50/60">
      <div className="mx-auto max-w-7xl px-4 py-4 lg:px-8">
        <div className="grid gap-4 md:grid-cols-2">
          {/* Banner 1 - Fashion Sale */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-rose-500 to-pink-600 p-8 text-white">
            <div className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/10" />
            <div className="pointer-events-none absolute -bottom-6 -left-6 h-32 w-32 rounded-full bg-white/10" />
            <p className="mb-1 text-sm font-medium text-white/80">
              Limited Time Offer
            </p>
            <h3 className="mb-3 text-2xl font-bold">Fashion Sale</h3>
            <p className="mb-5 max-w-xs text-sm text-white/80">
              Up to 60% off on top brands. Don't miss out on the latest trends.
            </p>
            <button
              onClick={() => navigate("/products/fashion")}
              className="flex items-center gap-2 rounded-xl bg-white px-6 py-2.5 text-sm font-semibold text-rose-600 transition hover:bg-white/90"
            >
              Shop Fashion <ArrowRight size={14} />
            </button>
          </div>

          {/* Banner 2 - Gadget Deals */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#4c2ed8] to-[#368de8] p-8 text-white">
            <div className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/10" />
            <div className="pointer-events-none absolute -bottom-6 -left-6 h-32 w-32 rounded-full bg-white/10" />
            <p className="mb-1 text-sm font-medium text-white/80">
              Electronics Week
            </p>
            <h3 className="mb-3 text-2xl font-bold">Gadget Deals</h3>
            <p className="mb-5 max-w-xs text-sm text-white/80">
              Save big on phones, laptops, and accessories. Free shipping on all
              orders.
            </p>
            <button
              onClick={() => navigate("/products/electronics")}
              className="flex items-center gap-2 rounded-xl bg-white px-6 py-2.5 text-sm font-semibold text-[#4c2ed8] transition hover:bg-white/90"
            >
              Shop Electronics <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="space-y-0">
        <HeroBanner />
        <TrustBadges />
        <CategoriesSection />
        <FeaturedProducts />
        <PromoBanner />
        {/* <Newsletter /> */}
      </div>
      <Footer />
    </div>
  );
}
