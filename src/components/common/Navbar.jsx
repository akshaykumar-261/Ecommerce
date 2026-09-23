import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  ShoppingCart,
  User,
  Menu,
  X,
  LogOut,
  Store,
  Zap,
} from "lucide-react";
import { SearchSuggestions } from "../../api/productApi";
import { useGetUser, useLogout } from "../../api/useAuth";
import { useCartCount } from "../../api/useCart";
import Popup from "./Popup";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const dropdownRef = useRef(null);
  const searchRef = useRef(null);
  const searchTimerRef = useRef(null);
  const navigate = useNavigate();
  const { data: userData } = useGetUser();
  const logoutMutation = useLogout();
  const { data: cartCountData } = useCartCount();
  const user = userData?.data;
  const isLoggedIn = !!localStorage.getItem("accessToken");
  const cartCount = isLoggedIn
    ? Number(cartCountData?.data?.count) || 0
    : 0;

  const handleCartClick = () => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }
    navigate("/cart");
  };

  useEffect(() => {
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

  useEffect(() => {
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
            <form
              onSubmit={handleSearch}
              className={`flex items-center rounded-xl border-2 bg-gray-50 transition-all duration-200 ${
                searchFocused || showSuggestions
                  ? "border-[#4c2ed8] bg-white shadow-lg shadow-[#4c2ed8]/5"
                  : "border-transparent"
              }`}
            >
              <Search size={18} className="ml-3 text-gray-400" />
              <input
                type="text"
                value={searchValue}
                onChange={(e) => {
                  setSearchValue(e.target.value);
                  if (e.target.value.trim().length >= 2)
                    setShowSuggestions(true);
                }}
                placeholder="Search for products, brands and more..."
                className="w-full bg-transparent px-3 py-2.5 text-sm text-gray-800 outline-none placeholder:text-gray-400"
                onFocus={() => {
                  setSearchFocused(true);
                  if (suggestions.length > 0) setShowSuggestions(true);
                }}
                onBlur={() => setSearchFocused(false)}
              />
              <button
                type="submit"
                className="mr-1 rounded-lg bg-[#4c2ed8] px-5 py-2 text-sm font-medium text-white transition hover:bg-[#3a24b0]"
              >
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
                            ₹
                            {product.discount_price > 0
                              ? product.discount_price
                              : product.price}
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
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#4c2ed8] to-[#368de8] text-xs font-semibold text-white">
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
                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-[#4c2ed8] to-[#368de8] text-sm font-semibold text-white">
                        {userInitial}
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-gray-900">
                        {userName}
                      </p>
                      <p className="truncate text-xs text-gray-500">
                        {userEmail}
                      </p>
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
          <button
            onClick={handleCartClick}
            className="relative rounded-lg p-2 text-gray-700 transition hover:bg-gray-100"
          >
            <ShoppingCart size={22} />
            {cartCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#4c2ed8] text-[10px] font-bold text-white">
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            )}
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
            <form
              onSubmit={handleSearch}
              className="flex items-center rounded-xl border bg-gray-50"
            >
              <Search size={18} className="ml-3 text-gray-400" />
              <input
                type="text"
                value={searchValue}
                onChange={(e) => {
                  setSearchValue(e.target.value);
                  if (e.target.value.trim().length >= 2)
                    setShowSuggestions(true);
                }}
                placeholder="Search products..."
                className="w-full bg-transparent px-3 py-2.5 text-sm outline-none"
              />
              <button
                type="submit"
                className="mr-2 rounded-lg bg-[#4c2ed8] px-4 py-1.5 text-xs font-medium text-white"
              >
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
                          ₹
                          {product.discount_price > 0
                            ? product.discount_price
                            : product.price}
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
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-[#4c2ed8] to-[#368de8] text-sm font-semibold text-white">
                    {userInitial}
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {userName}
                  </p>
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
      <Popup
        open={showLogoutDialog}
        onClose={() => setShowLogoutDialog(false)}
        icon={<LogOut size={24} className="text-red-500" />}
        iconClassName="bg-red-100"
        title="Confirm Logout"
        message="Are you sure you want to logout from your account?"
      >
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
      </Popup>
    </header>
  );
}
