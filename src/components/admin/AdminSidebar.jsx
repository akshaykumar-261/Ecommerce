import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import {
  LayoutDashboard,
  Users,
  Store,
  Package,
  ShoppingBag,
  WalletCards,
  Tags,
  Settings,
  LogOut,
  X,
  MessageCircle,
} from "lucide-react";
import { AdminLogo, logoutAdmin } from "./adminShared";
import ConfirmDialog from "./ConfirmDialog";

// Non-component export is intentional: nav config lives beside the sidebar
// that renders it. eslint-disable-next-line covered below.
/* eslint-disable react-refresh/only-export-components */
/*
 * Admin panel navigation, grouped for scannability. Paths match AppRoutes.
 */
export const adminGroups = [
  {
    title: "Overview",
    items: [{ label: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard }],
  },
  {
    title: "Marketplace",
    items: [
      { label: "Vendors", path: "/admin/vendors", icon: Store },
      { label: "Customers", path: "/admin/customers", icon: Users },
      { label: "Products", path: "/admin/products", icon: Package },
      { label: "Categories", path: "/admin/categories", icon: Tags },
    ],
  },
  {
    title: "Commerce",
    items: [
      { label: "Orders", path: "/admin/orders", icon: ShoppingBag },
      { label: "Payouts", path: "/admin/payouts", icon: WalletCards },
      { label: "Chat", path: "/admin/chat", icon: MessageCircle },
      { label: "Settings", path: "/admin/settings", icon: Settings },
    ],
  },
];

/**
 * Fixed left sidebar for the admin panel. Light-slate theme to visually
 * separate the admin console from the vendor gradient panel.
 */
function AdminSidebar({ setMobileOpen }) {
  const [logoutConfirm, setLogoutConfirm] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-[260px] flex-col border-r border-slate-200 bg-slate-900 text-slate-300">
      {/* Brand */}
      <div className="flex h-[70px] shrink-0 items-center justify-between border-b border-white/5 bg-gradient-to-r from-[#1e1b4b] to-[#1e3a8a] px-5">
        <AdminLogo />
        {setMobileOpen && (
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="rounded-lg p-1.5 text-white/70 transition hover:bg-white/10 lg:hidden"
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="admin-menu flex-1 overflow-y-auto px-3 py-4">
        {adminGroups.map((group) => (
          <div key={group.title} className="mb-5">
            <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
              {group.title}
            </p>
            <div className="space-y-1">
              {group.items.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileOpen?.(false)}
                    className={({ isActive }) => `
                      group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all duration-200
                      ${
                        isActive
                          ? "bg-indigo-500/15 font-semibold text-white"
                          : "text-slate-400 hover:translate-x-0.5 hover:bg-white/5 hover:text-white"
                      }
                    `}
                  >
                    {({ isActive }) => (
                      <>
                        <span
                          className={`absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-indigo-400 transition-opacity ${
                            isActive ? "opacity-100" : "opacity-0"
                          }`}
                        />
                        <Icon
                          size={17}
                          className={`transition-transform duration-200 group-hover:scale-110 ${
                            isActive ? "text-indigo-300" : "text-slate-500 group-hover:text-indigo-300"
                          }`}
                        />
                        {item.label}
                      </>
                    )}
                  </NavLink>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Logout */}
      <div className="shrink-0 border-t border-white/5 p-3">
        <button
          type="button"
          onClick={() => setLogoutConfirm(true)}
          className="group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-400 transition-all duration-200 hover:bg-red-500/15 hover:text-red-300"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 transition-transform duration-200 group-hover:scale-110">
            <LogOut size={15} />
          </span>
          Logout
        </button>
      </div>

      <ConfirmDialog
        open={logoutConfirm}
        title="Logout"
        message="Are you sure you want to logout?"
        confirmLabel="Yes, Logout"
        variant="danger"
        onConfirm={() => {
          setLogoutConfirm(false);
          logoutAdmin(queryClient, navigate);
        }}
        onCancel={() => setLogoutConfirm(false)}
      />

      <style>
        {`
          .admin-menu::-webkit-scrollbar { display: none; }
          .admin-menu { scrollbar-width: none; -ms-overflow-style: none; }
        `}
      </style>
    </aside>
  );
}

export default AdminSidebar;