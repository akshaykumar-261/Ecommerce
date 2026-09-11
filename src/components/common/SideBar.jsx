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
} from "lucide-react";

import { NavLink } from "react-router-dom";

const vendorMenu = [
  {
    label: "Dashboard",
    path: "/vendor/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Products",
    path: "/vendor/products",
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
    label: "Profile",
    path: "/vendor/profile",
    icon: User,
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
            pb-[180px]
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
