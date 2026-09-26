import { useState } from "react";
import { Menu, ChevronDown, User, Mail, Phone } from "lucide-react";
import { useGetUser } from "../../api/useAuth";
import { useNavigate } from "react-router-dom";
function Topbar({ setMobileOpen, role = "vendor", userName = "Vikash Store" }) {
  const [profileOpen, setProfileOpen] = useState(false);
  const { data, isLoading } = useGetUser();
  const user = data?.data;
  const displayName = user?.name || user?.first_name || userName;
  const navigate = useNavigate();
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
      {/* LEFT */}
      <div className="flex items-center">
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

      {/* RIGHT */}
      <div className="relative flex items-center gap-4">
        {/* PROFILE BUTTON */}
        <button
          type="button"
          onClick={() => setProfileOpen((prev) => !prev)}
          className="
            flex
            items-center
            gap-2.5
            rounded-lg
            px-2
            py-1.5
            transition
            hover:bg-gray-50
          "
        >
          {/* avtar */}
          <div
            className="
            flex
            h-9
            w-9
            items-center
            justify-center
            overflow-hidden
            rounded-full
            bg-gradient-to-r
            from-[#4c2ed8]
            to-[#368de8]
            text-xs
            font-semibold
            text-white
          "
          >
            {user?.avtar ? (
              <img
                src={user.avtar}
                alt="Profile"
                className="h-full w-full object-cover"
              />
            ) : (
              displayName?.charAt(0)?.toUpperCase() || "U"
            )}
          </div>

          {/* User Name */}
          <div className="hidden text-left sm:block">
            <p className="text-xs font-semibold leading-4 text-gray-800">
              {isLoading ? "Loading..." : displayName}
            </p>

            <p className="text-[11px] leading-4 text-gray-500">
              {role === "admin" ? "Administrator" : "Vendor"}
            </p>
          </div>

          {/* Dropdown Icon */}
          <ChevronDown
            size={16}
            strokeWidth={1.8}
            className={`text-gray-500 transition-transform ${
              profileOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {/* PROFILE DROPDOWN */}
        {profileOpen && (
          <div
            className="
              absolute
              right-0
              top-12
              z-50
              w-72
              rounded-xl
              border
              border-gray-100
              bg-white
              p-4
              shadow-lg
            "
          >
            {/* Profile Header */}
            <div className="mb-4 flex items-center gap-3">
              <div
                className="
            flex
            h-9
            w-9
            items-center
            justify-center
            overflow-hidden
            rounded-full
            bg-gradient-to-r
            from-[#4c2ed8]
            to-[#368de8]
            text-xs
            font-semibold
            text-white
          "
              >
                {user?.avtar ? (
                  <img
                    src={user.avtar}
                    alt="Profile"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  displayName?.charAt(0)?.toUpperCase() || "U"
                )}
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-800">
                  {isLoading ? "Loading..." : displayName}
                </p>

                <p className="text-xs text-gray-500">
                  {role === "admin" ? "Administrator" : "Vendor"}
                </p>
              </div>
            </div>

            {/* User Details */}
            <div className="space-y-3 border-t border-gray-100 pt-3">
              {/* Name */}
              <div className="flex items-center gap-3">
                <User size={16} className="text-gray-400" />

                <div>
                  <p className="text-[11px] text-gray-400">Name</p>

                  <p className="text-xs font-medium text-gray-700">
                    {user?.name || user?.first_name || "-"}
                  </p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-center gap-3">
                <Mail size={16} className="text-gray-400" />

                <div>
                  <p className="text-[11px] text-gray-400">Email</p>

                  <p className="text-xs font-medium text-gray-700">
                    {user?.email || "-"}
                  </p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-center gap-3">
                <Phone size={16} className="text-gray-400" />

                <div>
                  <p className="text-[11px] text-gray-400">Phone</p>

                  <p className="text-xs font-medium text-gray-700">
                    {user?.phoneNo || user?.phone || "-"}
                  </p>
                </div>
              </div>
            </div>

            {/* Profile Button */}
            <button
              type="button"
              onClick={() => {
                setProfileOpen(false);
                navigate(role === "admin" ? "/profile" : "/vendor/profile");
              }}
              className="
               mt-4
               w-full
               rounded-lg
               bg-gray-50
               px-3
               py-2
               text-xs
               font-medium
               text-gray-700
               transition
               hover:bg-gray-100
             "
            >
              View Profile
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

export default Topbar;
