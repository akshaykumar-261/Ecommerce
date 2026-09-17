import React from "react";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  WalletCards,
  Store,
  User,
  Headphones,
  Users,
  Settings,
  BarChart3,
  LogOut,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
import { useLogout } from "../../api/useAuth";
const vendorMenu = [
  {
    label: "Dashboard",
    path: "/vendor/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Products",
    path: "/vendor/addProduct",
    icon: Package,
  },
  {
    label: "Orders",
    path: "/vendor/orders",
    icon: ShoppingBag,
  },
  {
    label: "Payouts",
    path: "/vendor/stripeConnectLink",
    icon: WalletCards,
  },
  {
    label: "Store Settings",
    path: "/vendor/store-settings",
    icon: Store,
  },
  {
    label: "Support",
    path: "/vendor/support",
    icon: Headphones,
  },
];

const adminMenu = [
  {
    label: "Dashboard",
    path: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Users",
    path: "/admin/users",
    icon: Users,
  },
  {
    label: "Vendors",
    path: "/admin/vendors",
    icon: Store,
  },
  {
    label: "Products",
    path: "/admin/products",
    icon: Package,
  },
  {
    label: "Orders",
    path: "/admin/orders",
    icon: ShoppingBag,
  },
  {
    label: "Analytics",
    path: "/admin/analytics",
    icon: BarChart3,
  },
  {
    label: "Settings",
    path: "/admin/settings",
    icon: Settings,
  },
];

function Sidebar({ roleId = 2 }) {
  const menu = roleId === 1 ? adminMenu : vendorMenu;
  const isAdmin = roleId === 1;
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const logoutMutation = useLogout();

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        queryClient.clear();
        toast.success("Logged out successfully");
        navigate(roleId === 1 ? "/login" : "/vendorLogin");
      },
      onError: () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        queryClient.clear();
        navigate(roleId === 1 ? "/login" : "/vendorLogin");
      },
    });
  };

  return (
    <>
      <aside
        className="
          fixed
          left-0
          top-0
          h-screen
          w-[270px]
          bg-gradient-to-b
          from-[#4630d8]
          via-[#365fe0]
          to-[#2e8ee8]
          text-white
        "
      >
        {/* ================= LOGO ================= */}

        <div className="h-[85px] px-7 pt-5">
          <h1 className="text-2xl font-bold">ShopEase</h1>

          <p className="text-sm text-white/80">
            {isAdmin ? "Admin Panel" : "Vendor Panel"}
          </p>
        </div>

        {/* ================= MENU ================= */}

        <nav
          className="
            sidebar-menu
            h-[calc(100vh-85px)]
            overflow-y-auto
            px-4
            pb-[220px]
          "
        >
          {menu.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => `
                  mb-2
                  flex
                  items-center
                  gap-4
                  rounded-xl
                  px-5
                  py-3.5
                  transition-all

                  ${
                    isActive
                      ? "bg-white/20 shadow-lg"
                      : "text-white/85 hover:bg-white/10"
                  }
                `}
              >
                <Icon size={21} />

                <span className="font-medium">{item.label}</span>
              </NavLink>
            );
          })}

          {/* ================= LOGOUT ================= */}
          <div className="mt-3 border-t border-white/10 pt-4">
            <button
              type="button"
              onClick={handleLogout}
              disabled={logoutMutation.isPending}
              className="group flex w-full items-center gap-4 rounded-xl px-5 py-3.5 text-left text-sm font-medium text-white/60 transition-all hover:bg-red-500/20 hover:text-white"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 transition-all duration-300 group-hover:bg-red-500/25 group-hover:scale-110">
                <LogOut
                  size={20}
                  className="transition-transform duration-300 group-hover:-translate-x-0.5 group-hover:translate-y-0.5"
                />
              </span>
              {logoutMutation.isPending ? "Logging out..." : "Logout"}
            </button>
          </div>
        </nav>

        {/* ================= BOTTOM BOX ================= */}

        <div className="absolute bottom-4 left-4 right-4">
          <div
            className="
              rounded-xl
              border
              border-white/20
              bg-white/10
              p-3.5
            "
          >
            <h3 className="text-sm font-semibold">
              {isAdmin ? "Manage ShopEase" : "Grow Your Business"}
            </h3>

            <p className="mt-1 text-xs leading-4 text-white/75">
              {isAdmin
                ? "Monitor and manage your marketplace."
                : "Sell more, reach more customers."}
            </p>

            <div className="mt-3 flex justify-center">
              <div
                className="
                  flex
                  h-11
                  w-14
                  items-center
                  justify-center
                  rounded-lg
                  bg-white/10
                "
              >
                <Store size={26} className="text-white/80" />
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* ================= HIDE SCROLLBAR ================= */}

      <style>
        {`
          .sidebar-menu::-webkit-scrollbar {
            display: none;
          }

          .sidebar-menu {
            scrollbar-width: none;
            -ms-overflow-style: none;
          }
        `}
      </style>
    </>
  );
}

export default Sidebar;
