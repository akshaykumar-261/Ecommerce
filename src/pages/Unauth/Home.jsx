import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import pro4 from "../../assets/pro4.png";
import { GetTopRatedProducts, SearchSuggestions } from "../../api/productApi";
import { useGetUser, useLogout } from "../../api/useAuth";
import { useWishlist, useAddToWishlist, useRemoveFromWishlist } from "../../api/useWishlist";
import toast from "react-hot-toast";
import {
  Search,
  ShoppingCart,
  User,
  Menu,
  X,
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
  Briefcase,
  Gem,
  BriefcaseBusiness,
  Gamepad2,
  ArrowRight,
  Flame,
  TrendingUp,
  Zap,
  Tag,
  LogOut,
  Store,
  Heart,
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
const CATEGORIES = [
  { id: 1, cat_name: "Electronics", slug: "electronics" },
  { id: 2, cat_name: "Mobiles", slug: "mobiles" },
  { id: 3, cat_name: "Laptops", slug: "laptops" },
  { id: 4, cat_name: "Computers & Accessories", slug: "computers-accessories" },
  { id: 5, cat_name: "Fashion", slug: "fashion" },
  { id: 6, cat_name: "Men's Clothing", slug: "mens-clothing" },
  { id: 7, cat_name: "Children's Clothing", slug: "childs-clothing" },
  { id: 8, cat_name: "Women's Clothing", slug: "womens-clothing" },
  { id: 9, cat_name: "Footwear", slug: "footwear" },
  { id: 10, cat_name: "Beauty & Personal Care", slug: "beauty-personal-care" },
  { id: 11, cat_name: "Home & Kitchen", slug: "home-kitchen" },
  { id: 12, cat_name: "Furniture", slug: "furniture" },
  { id: 13, cat_name: "Grocery", slug: "grocery" },
  { id: 14, cat_name: "Books", slug: "books" },
  { id: 15, cat_name: "Sports & Fitness", slug: "sports-fitness" },
  { id: 16, cat_name: "Automotive", slug: "automotive" },
  { id: 17, cat_name: "Pet Supplies", slug: "pet-supplies" },
  { id: 18, cat_name: "Office Supplies", slug: "office-supplies" },
  { id: 19, cat_name: "Jewellery", slug: "jewellery" },
  { id: 20, cat_name: "Bags & Luggage", slug: "bags-luggage" },
  { id: 21, cat_name: "Toys & Games", slug: "toys-games" },
];

/* ────────────────────────────────────────
   NAVBAR
   ──────────────────────────────────────── */
function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const dropdownRef = React.useRef(null);
  const searchRef = React.useRef(null);
  const searchTimerRef = React.useRef(null);
  const navigate = useNavigate();
  const { data: userData } = useGetUser();
  const logoutMutation = useLogout();
  const user = userData?.data;
  const isLoggedIn = !!localStorage.getItem("accessToken");

  React.useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setUserDropdownOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  React.useEffect(() => {
    if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    if (searchValue.trim().length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    setSuggestionsLoading(true);
    searchTimerRef.current = setTimeout(async () => {
      try {
        const res = await SearchSuggestions(searchValue.trim(), { limit: 8 });
        setSuggestions(res?.data?.suggestions || []);
        setShowSuggestions(true);
      } catch {
        setSuggestions([]);
      } finally {
        setSuggestionsLoading(false);
      }
    }, 300);
    return () => clearTimeout(searchTimerRef.current);
  }, [searchValue]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchValue.trim()) {
      setShowSuggestions(false);
      navigate(`/search/${encodeURIComponent(searchValue.trim())}`);
    }
  };

  const handleSuggestionClick = (product) => {
    setShowSuggestions(false);
    setSearchValue(product.pro_name);
    navigate(`/search/${encodeURIComponent(product.pro_name)}`);
  };

  const confirmLogout = () => {
    setShowLogoutDialog(false);
    logoutMutation.mutate(undefined, {
      onSettled: () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        navigate("/home", { replace: true });
      },
    });
  };

  const userAvatar = user?.avtar;
  const userName = user?.name || "User";
  const userEmail = user?.email || "";
  const userInitial = userName.charAt(0).toUpperCase();

  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 lg:px-8">
        {/* Logo */}
        <button
          onClick={() => navigate("/home")}
          className="flex items-center gap-2"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#4c2ed8] to-[#368de8]">
            <Zap size={20} className="text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-gray-900">
            Shop<span className="text-[#4c2ed8]">Ease</span>
          </span>
        </button>

        {/* Search Bar – desktop */}
        <div className="hidden flex-1 px-8 md:block" ref={searchRef}>
          <div className="relative">
            <form onSubmit={handleSearch} className={`flex items-center rounded-xl border-2 bg-gray-50 transition-all duration-200 ${
              searchFocused || showSuggestions
                ? "border-[#4c2ed8] bg-white shadow-lg shadow-[#4c2ed8]/5"
                : "border-transparent"
            }`}>
              <Search size={18} className="ml-3 text-gray-400" />
              <input
                type="text"
                value={searchValue}
                onChange={(e) => {
                  setSearchValue(e.target.value);
                  if (e.target.value.trim().length >= 2) setShowSuggestions(true);
                }}
                placeholder="Search for products, brands and more..."
                className="w-full bg-transparent px-3 py-2.5 text-sm text-gray-800 outline-none placeholder:text-gray-400"
                onFocus={() => {
                  setSearchFocused(true);
                  if (suggestions.length > 0) setShowSuggestions(true);
                }}
                onBlur={() => setSearchFocused(false)}
              />
              <button type="submit" className="mr-1 rounded-lg bg-[#4c2ed8] px-5 py-2 text-sm font-medium text-white transition hover:bg-[#3a24b0]">
                Search
              </button>
            </form>

            {/* Suggestions Dropdown */}
            {showSuggestions && searchValue.trim().length >= 2 && (
              <div className="absolute left-0 right-0 top-full z-50 mt-1 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-xl shadow-gray-200/60">
                {suggestionsLoading ? (
                  <div className="flex items-center justify-center py-6">
                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#4c2ed8] border-t-transparent"></div>
                  </div>
                ) : suggestions.length > 0 ? (
                  <>
                    {suggestions.map((product) => (
                      <button
                        key={product.id}
                        type="button"
                        onMouseDown={() => handleSuggestionClick(product)}
                        className="flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-gray-50"
                      >
                        {product.product_media?.[0]?.media_url ? (
                          <img
                            src={product.product_media[0].media_url}
                            alt={product.pro_name}
                            className="h-10 w-10 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
                            <Search size={16} className="text-gray-400" />
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-gray-800">
                            {product.pro_name}
                          </p>
                          <p className="text-xs font-semibold text-[#4c2ed8]">
                            ₹{product.discount_price > 0 ? product.discount_price : product.price}
                          </p>
                        </div>
                      </button>
                    ))}
                    <button
                      type="button"
                      onMouseDown={handleSearch}
                      className="flex w-full items-center justify-center gap-2 border-t border-gray-100 bg-gray-50 px-4 py-2.5 text-sm font-medium text-[#4c2ed8] transition hover:bg-gray-100"
                    >
                      <Search size={14} />
                      Search for "{searchValue}"
                    </button>
                  </>
                ) : (
                  <div className="px-4 py-6 text-center">
                    <p className="text-sm text-gray-500">No products found</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          {isLoggedIn ? (
            <div className="relative hidden sm:block" ref={dropdownRef}>
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 rounded-lg px-2 py-1.5 transition hover:bg-gray-100"
              >
                {userAvatar ? (
                  <img
                    src={userAvatar}
                    alt={userName}
                    className="h-8 w-8 rounded-full object-cover ring-2 ring-[#4c2ed8]/20"
                  />
                ) : (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#4c2ed8] to-[#368de8] text-white font-semibold text-xs">
                    {userInitial}
                  </div>
                )}
                <span className="max-w-[100px] truncate text-sm font-medium text-gray-700">
                  {userName}
                </span>
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-64 rounded-xl border border-gray-100 bg-white py-2 shadow-xl shadow-gray-200/60">
                  <div className="flex items-center gap-3 border-b border-gray-100 px-4 py-3">
                    {userAvatar ? (
                      <img
                        src={userAvatar}
                        alt={userName}
                        className="h-11 w-11 rounded-full object-cover ring-2 ring-[#4c2ed8]/20"
                      />
                    ) : (
                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-[#4c2ed8] to-[#368de8] text-white font-semibold text-sm">
                        {userInitial}
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">{userName}</p>
                      <p className="text-xs text-gray-500 truncate">{userEmail}</p>
                    </div>
                  </div>
                  <div className="py-1">
                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        navigate("/profile");
                      }}
                      className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <User size={16} />
                      My Profile
                    </button>
                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        navigate("/orders");
                      }}
                      className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <ShoppingCart size={16} />
                      My Orders
                    </button>
                  </div>
                  <div className="border-t border-gray-100 pt-1">
                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        setShowLogoutDialog(true);
                      }}
                      className="flex w-full items-center gap-2 px-4 py-2.5 text-sm font-medium text-red-500 hover:bg-red-50"
                    >
                      <LogOut size={16} />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <button
                onClick={() => navigate("/vendorRegister")}
                className="hidden items-center gap-2 rounded-lg border border-[#4c2ed8] bg-[#4c2ed8]/5 px-4 py-2 text-sm font-medium text-[#4c2ed8] transition hover:bg-[#4c2ed8] hover:text-white sm:flex"
              >
                <Store size={16} />
                Become Seller
              </button>
              <button
                onClick={() => navigate("/login")}
                className="hidden items-center gap-2 rounded-lg bg-[#4c2ed8] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#3a24b0] sm:flex"
              >
                <User size={16} />
                Login
              </button>
            </>
          )}
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

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-gray-100 bg-white px-4 pb-4 pt-3 md:hidden">
          <div className="relative mb-3">
            <form onSubmit={handleSearch} className="flex items-center rounded-xl border bg-gray-50">
              <Search size={18} className="ml-3 text-gray-400" />
              <input
                type="text"
                value={searchValue}
                onChange={(e) => {
                  setSearchValue(e.target.value);
                  if (e.target.value.trim().length >= 2) setShowSuggestions(true);
                }}
                placeholder="Search products..."
                className="w-full bg-transparent px-3 py-2.5 text-sm outline-none"
              />
              <button type="submit" className="mr-2 rounded-lg bg-[#4c2ed8] px-4 py-1.5 text-xs font-medium text-white">
                Search
              </button>
            </form>
            {showSuggestions && searchValue.trim().length >= 2 && (
              <div className="absolute left-0 right-0 top-full z-50 mt-1 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-xl">
                {suggestionsLoading ? (
                  <div className="flex items-center justify-center py-4">
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#4c2ed8] border-t-transparent"></div>
                  </div>
                ) : suggestions.length > 0 ? (
                  suggestions.map((product) => (
                    <button
                      key={product.id}
                      type="button"
                      onMouseDown={() => {
                        handleSuggestionClick(product);
                        setMobileOpen(false);
                      }}
                      className="flex w-full items-center gap-3 px-3 py-2.5 text-left transition hover:bg-gray-50"
                    >
                      {product.product_media?.[0]?.media_url ? (
                        <img
                          src={product.product_media[0].media_url}
                          alt={product.pro_name}
                          className="h-9 w-9 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100">
                          <Search size={14} className="text-gray-400" />
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-gray-800">
                          {product.pro_name}
                        </p>
                        <p className="text-xs font-semibold text-[#4c2ed8]">
                          ₹{product.discount_price > 0 ? product.discount_price : product.price}
                        </p>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="px-3 py-4 text-center">
                    <p className="text-sm text-gray-500">No products found</p>
                  </div>
                )}
              </div>
            )}
          </div>
          {isLoggedIn ? (
            <>
              <div className="mb-3 flex items-center gap-3 rounded-lg px-3 py-2.5">
                {userAvatar ? (
                  <img
                    src={userAvatar}
                    alt={userName}
                    className="h-11 w-11 rounded-full object-cover ring-2 ring-[#4c2ed8]/20"
                  />
                ) : (
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-[#4c2ed8] to-[#368de8] text-white font-semibold text-sm">
                    {userInitial}
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium text-gray-900">{userName}</p>
                  <p className="text-xs text-gray-500">{userEmail}</p>
                </div>
              </div>
              <div className="mb-2 space-y-1">
                <button
                  onClick={() => {
                    navigate("/profile");
                    setMobileOpen(false);
                  }}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  <User size={18} /> My Profile
                </button>
                <button
                  onClick={() => {
                    navigate("/orders");
                    setMobileOpen(false);
                  }}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  <ShoppingCart size={18} /> My Orders
                </button>
              </div>
              <button
                onClick={() => {
                  setMobileOpen(false);
                  setShowLogoutDialog(true);
                }}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-red-500 hover:bg-red-50"
              >
                <LogOut size={18} /> Logout
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => {
                  navigate("/vendorRegister");
                  setMobileOpen(false);
                }}
                className="mb-2 flex w-full items-center gap-2 rounded-lg border border-[#4c2ed8] bg-[#4c2ed8]/5 px-3 py-2.5 text-sm font-medium text-[#4c2ed8] hover:bg-[#4c2ed8] hover:text-white"
              >
                <Store size={18} /> Become Seller
              </button>
              <button
                onClick={() => {
                  navigate("/login");
                  setMobileOpen(false);
                }}
                className="flex w-full items-center gap-2 rounded-lg bg-[#4c2ed8] px-3 py-2.5 text-sm font-medium text-white hover:bg-[#3a24b0]"
              >
                <User size={18} /> Login
              </button>
            </>
          )}
        </div>
      )}

      {/* Logout Confirmation Dialog */}
      {showLogoutDialog && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="mx-4 w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
              <LogOut size={24} className="text-red-500" />
            </div>
            <h3 className="mb-1 text-lg font-semibold text-gray-900">
              Confirm Logout
            </h3>
            <p className="mb-6 text-sm text-gray-500">
              Are you sure you want to logout from your account?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutDialog(false)}
                className="flex-1 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmLogout}
                className="flex-1 rounded-xl bg-red-500 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-red-600"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

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
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-4 py-6 md:grid-cols-4 lg:px-8">
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
    <section className="bg-gray-50/60 py-14">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="mb-8">
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
            {CATEGORIES.map((cat) => {
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
  const { mutate: addToWishlist } = useAddToWishlist();
  const { mutate: removeFromWishlist } = useRemoveFromWishlist();
  const { data: wishlistData } = useWishlist();
  const wishlist = wishlistData?.data?.wishlists || [];
  const isWishlisted = wishlist.some((item) => item.product_id === product.id);

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

  const handleWishlistClick = (e) => {
    e.stopPropagation();
    if (!localStorage.getItem("accessToken")) {
      toast.error("Please login to add to wishlist");
      return;
    }
    if (isWishlisted) {
      removeFromWishlist(product.id, {
        onSuccess: () => toast.success("Removed from wishlist"),
        onError: () => toast.error("Failed to remove from wishlist"),
      });
    } else {
      addToWishlist(product.id, {
        onSuccess: () => toast.success("Added to wishlist"),
        onError: () => toast.error("Failed to add to wishlist"),
      });
    }
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

        <button
          onClick={handleWishlistClick}
          className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-md backdrop-blur-sm transition hover:bg-white hover:scale-110"
        >
          <Heart
            size={16}
            className={isWishlisted ? "fill-red-500 text-red-500" : "text-gray-400"}
          />
        </button>

        <div className="absolute bottom-0 left-0 right-0 flex translate-y-full justify-center gap-2 bg-gradient-to-t from-black/30 to-transparent pb-4 pt-10 transition-transform duration-300 group-hover:translate-y-0">
          <button className="rounded-lg bg-white/90 px-4 py-2 text-xs font-semibold text-gray-800 shadow backdrop-blur-sm transition hover:bg-white">
            Add to Cart
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
    <section className="py-14">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <TrendingUp size={20} className="text-[#4c2ed8]" />
              <span className="text-xs font-bold uppercase tracking-widest text-[#4c2ed8]">
                Trending Now
              </span>
            </div>
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
    <section className="bg-gray-50/60 py-14">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
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

/* ────────────────────────────────────────
   NEWSLETTER
   ──────────────────────────────────────── */
// function Newsletter() {
//   return (
//     <section className="py-14">
//       <div className="mx-auto max-w-7xl px-4 lg:px-8">
//         <div className="overflow-hidden rounded-2xl bg-gradient-to-r from-gray-900 to-gray-800 px-6 py-12 text-center text-white md:px-16">
//           <h2 className="mb-2 text-2xl font-bold">Stay in the Loop</h2>
//           <p className="mb-6 text-sm text-gray-400">
//             Subscribe for exclusive deals, new arrivals, and more.
//           </p>
//           <div className="mx-auto flex max-w-md flex-col gap-3 sm:flex-row">
//             <input
//               type="email"
//               placeholder="Enter your email"
//               className="flex-1 rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-gray-500 focus:border-[#4c2ed8] focus:outline-none"
//             />
//             <button className="rounded-xl bg-[#4c2ed8] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#3a24b0]">
//               Subscribe
//             </button>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }

/* ────────────────────────────────────────
   FOOTER
   ──────────────────────────────────────── */
function Footer() {
  return (
    <footer className="border-t border-gray-100 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Brand */}
          <div>
            <div className="mb-3 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#4c2ed8] to-[#368de8]">
                <Zap size={16} className="text-white" />
              </div>
              <span className="text-lg font-bold text-gray-900">
                Shop<span className="text-[#4c2ed8]">Hub</span>
              </span>
            </div>
            <p className="max-w-xs text-sm leading-relaxed text-gray-500">
              Your one-stop destination for the best products at unbeatable
              prices. Shop with confidence.
            </p>
          </div>

          {/* Links */}
          {[
            {
              title: "Quick Links",
              links: ["About Us", "Contact", "FAQs", "Blog"],
            },
            {
              title: "Categories",
              links: ["Electronics", "Fashion", "Home & Kitchen", "Sports"],
            },
            {
              title: "Support",
              links: [
                "Help Center",
                "Shipping Info",
                "Returns",
                "Privacy Policy",
              ],
            },
          ].map((col, i) => (
            <div key={i}>
              <h4 className="mb-3 text-sm font-semibold text-gray-900">
                {col.title}
              </h4>
              <ul className="space-y-2">
                {col.links.map((link, j) => (
                  <li key={j}>
                    <a
                      href="#"
                      className="text-sm text-gray-500 transition hover:text-[#4c2ed8]"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 border-t border-gray-100 pt-6 text-center text-xs text-gray-400">
          &copy; {new Date().getFullYear()} ShopEase. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

/* ────────────────────────────────────────
   HOME PAGE (default export)
   ──────────────────────────────────────── */
export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <HeroBanner />
      <TrustBadges />
      <CategoriesSection />
      <FeaturedProducts />
      <PromoBanner />
      {/* <Newsletter /> */}
      <Footer />
    </div>
  );
}
