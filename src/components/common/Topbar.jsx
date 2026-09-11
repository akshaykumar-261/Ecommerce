import React from "react";
import { Bell, Menu, ChevronDown } from "lucide-react";

function Topbar({ setMobileOpen, role = "vendor", userName = "Vikash Store" }) {
  return (
    <header
      className="
        sticky top-0 z-30
        flex h-[58px]
        items-center justify-between
        border-b border-gray-100
        bg-white
        px-4
        lg:px-6
      "
    >
      {/* ================= LEFT ================= */}
      <div className="flex items-center">
        {/* Mobile Menu */}
        <button
          className="
            rounded-lg
            p-2
            text-gray-600
            transition
            hover:bg-gray-100
            lg:hidden
          "
          onClick={() => setMobileOpen(true)}
        >
          <Menu size={22} />
        </button>
      </div>

      {/* ================= RIGHT ================= */}
      <div className="flex items-center gap-4">
        {/* ================= NOTIFICATION ================= */}
        <button
          className="
            relative
            flex h-9 w-9
            items-center justify-center
            rounded-full
            transition
            hover:bg-gray-100
          "
        >
          <Bell size={20} strokeWidth={1.8} className="text-gray-600" />

          {/* Notification Count */}
          <span
            className="
              absolute
              -right-0.5
              -top-0.5
              flex
              h-4
              min-w-4
              items-center
              justify-center
              rounded-full
              bg-red-500
              px-1
              text-[9px]
              font-semibold
              text-white
            "
          >
            3
          </span>
        </button>

        {/* ================= PROFILE ================= */}
        <div
          className="
            flex
            cursor-pointer
            items-center
            gap-2.5
            rounded-lg
            px-2
            py-1.5
            transition
            hover:bg-gray-50
          "
        >
          {/* Avatar */}
          <div
            className="
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-full
              bg-gradient-to-r
              from-[#4c2ed8]
              to-[#368de8]
              text-xs
              font-semibold
              text-white
            "
          >
            {role === "admin" ? "AD" : "VS"}
          </div>

          {/* User Information */}
          <div className="hidden sm:block">
            <p className="text-xs font-semibold leading-4 text-gray-800">
              {userName}
            </p>

            <p className="text-[11px] leading-4 text-gray-500">
              {role === "admin" ? "Administrator" : "Vendor"}
            </p>
          </div>

          {/* Dropdown */}
          <ChevronDown size={16} strokeWidth={1.8} className="text-gray-500" />
        </div>
      </div>
    </header>
  );
}

export default Topbar;
