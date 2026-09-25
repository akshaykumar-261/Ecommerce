import { Routes, Route } from "react-router-dom";
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import ForgotPassword from "../pages/Auth/ForgotPwd";
import Home from "../pages/Unauth/Home";
import Products from "../pages/Unauth/Products";
import CategoryGroup from "../pages/Unauth/CategoryGroup";
import ProductDetail from "../pages/Unauth/ProductDetail";
import SearchResults from "../pages/Unauth/SearchResults";
import About from "../pages/Unauth/About";
import Contact from "../pages/Unauth/Contact";
import Faq from "../pages/Unauth/Faq";
import Blog from "../pages/Unauth/Blog";
import OtpVerify from "../pages/Auth/OtpVerify";
import OtpVerifyForgotPassword from "../pages/Auth/OtpVerifyForgotPassword";
import ResetPassword from "../pages/Auth/ResetPassword";
import VendorRegister from "../pages/Auth/VendoreRegister";
import VenderLogin from "../pages/Auth/VenderLogin";
import Sidebar from "../components/common/SideBar";
import Topbar from "../components/common/Topbar";
import BusinessDetails from "../pages/Vendor/BusinessDetails";
import Dashboard from "../pages/Vendor/Dashboard";
import AddProducts from "../pages/Vendor/AddProducts";
import AddProductMedia from "../pages/Vendor/AddProductMedia";
import EditProduct from "../pages/Vendor/EditProduct";
import StoreSettings from "../pages/Vendor/StoreSettings";
import VendorOrders from "../pages/Vendor/VendorOrders";
import VendorPayouts from "../pages/Vendor/VendorPayouts";
import ProtectedRoute from "../components/common/ProtectedRoute";
import GuestRoute from "../components/common/GuestRoute";
import Profile from "../pages/Vendor/Profile";
import UserProfile from "../pages/Unauth/UserProfile";
import Wishlist from "../pages/Unauth/Wishlist";
import Cart from "../pages/Unauth/Cart";
import CheckoutAddress from "../pages/Unauth/CheckoutAddress";
import MyOrders from "../pages/Unauth/MyOrders";
import OrderDetail from "../pages/Unauth/OrderDetail";
import AdminLogin from "../pages/Admin/AdminLogin";
import AdminDashboard from "../pages/Admin/AdminDashboard";
import AdminVendors from "../pages/Admin/AdminVendors";
import AdminVendorDetail from "../pages/Admin/AdminVendorDetail";
import AdminCustomers from "../pages/Admin/AdminCustomers";
import AdminProducts from "../pages/Admin/AdminProducts";
import AdminCategories from "../pages/Admin/AdminCategories";
import AdminOrders from "../pages/Admin/AdminOrders";
import AdminPayouts from "../pages/Admin/AdminPayouts";
import AdminSettings from "../pages/Admin/AdminSettings";
import AdminChat from "../pages/Admin/AdminChat";
import VendorChat from "../pages/Vendor/VendorChat";
import ErrorBoundary from "../components/admin/ErrorBoundary";

function eb(Comp) {
  return (
    <ErrorBoundary>
      <Comp />
    </ErrorBoundary>
  );
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
      <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />
      <Route path="/forgot-password" element={<GuestRoute><ForgotPassword /></GuestRoute>} />
      <Route path="/home" element={<Home />} />
      <Route path="/products/category/:id" element={<Products />} />
      <Route path="/products/:group" element={<CategoryGroup />} />
      <Route path="/product/:id" element={<ProductDetail />} />
      <Route path="/search/:query" element={<SearchResults />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/faq" element={<Faq />} />
      <Route path="/blog" element={<Blog />} />
      <Route
        path="/otpVerify"
        element={
          <ProtectedRoute requireRegistration>
            <OtpVerify />
          </ProtectedRoute>
        }
      />
      <Route
        path="/otpVerifyForgotPassword"
        element={
          <ProtectedRoute requireForgotPasswordEmail>
            <OtpVerifyForgotPassword />
          </ProtectedRoute>
        }
      />
      <Route
        path="/resetPassword"
        element={
          <ProtectedRoute requireForgotPasswordOtp>
            <ResetPassword />
          </ProtectedRoute>
        }
      />
      <Route path="/vendorRegister" element={<GuestRoute><VendorRegister /></GuestRoute>} />
      <Route path="/vendorLogin" element={<GuestRoute><VenderLogin /></GuestRoute>} />
      <Route path="/sideBar" element={<Sidebar />} />
      <Route path="/topBar" element={<Topbar />} />
      <Route path="/vendor/dashboard" element={<Dashboard />} />
      <Route
        path="/bussinessAccountVendor"
        element={
          <ProtectedRoute requireOtpVerified>
            <BusinessDetails />
          </ProtectedRoute>
        }
      />
      <Route path="/vendor/addProduct" element={<AddProducts />} />
      <Route
        path="/vendor/addProductImage/:productId"
        element={<AddProductMedia />}
      />
      <Route path="/vendor/editProduct/:productId" element={<EditProduct />} />
      <Route path="/vendor/store-settings" element={<StoreSettings />} />
      <Route path="/vendor/orders" element={<VendorOrders />} />
      <Route path="/vendor/payouts" element={<VendorPayouts />} />
      <Route path="/vendor/chat" element={<VendorChat />} />
      <Route
        path="/profile"
        element={
          <ProtectedRoute requireAuth>
            <UserProfile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/wishlist"
        element={
          <ProtectedRoute requireAuth>
            <Wishlist />
          </ProtectedRoute>
        }
      />
      <Route
        path="/cart"
        element={
          <ProtectedRoute requireAuth>
            <Cart />
          </ProtectedRoute>
        }
      />
      <Route
        path="/checkout"
        element={
          <ProtectedRoute requireAuth>
            <CheckoutAddress />
          </ProtectedRoute>
        }
      />
      <Route
        path="/orders"
        element={
          <ProtectedRoute requireAuth>
            <MyOrders />
          </ProtectedRoute>
        }
      />
      <Route
        path="/orders/:orderId"
        element={
          <ProtectedRoute requireAuth>
            <OrderDetail />
          </ProtectedRoute>
        }
      />
      {/* Admin console */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/dashboard" element={eb(AdminDashboard)} />
      <Route path="/admin/vendors" element={eb(AdminVendors)} />
      <Route path="/admin/vendors/:id" element={eb(AdminVendorDetail)} />
      <Route path="/admin/customers" element={eb(AdminCustomers)} />
      <Route path="/admin/products" element={eb(AdminProducts)} />
      <Route path="/admin/categories" element={eb(AdminCategories)} />
      <Route path="/admin/orders" element={eb(AdminOrders)} />
      <Route path="/admin/payouts" element={eb(AdminPayouts)} />
      <Route path="/admin/settings" element={eb(AdminSettings)} />
      <Route path="/admin/chat" element={eb(AdminChat)} />
    </Routes>
  );
}

export default AppRoutes;
