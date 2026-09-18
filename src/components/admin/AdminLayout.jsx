import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { Menu, ShieldCheck, ChevronDown, User, Mail, Phone, LogOut } from "lucide-react";
import { jwtDecode } from "jwt-decode";
import AdminSidebar from "./AdminSidebar";
import { clearAdminSession, ADMIN_LOGIN_PATH } from "./adminShared";
import { useAdminProfile } from "../../api/useAdminApi";
import ConfirmDialog from "./ConfirmDialog";

/**
 * Shared admin page chrome: sidebar + topbar + content slot. Every admin page
 * renders inside this so mobile handling, auth-failure handling and profile
 * display stay in one place.
 *
 * Role enforcement: the backend enforces "Super Admin" on every /admin route;
 * here we only decode the JWT to redirect obviously-wrong roles fast and to
 * know whether to render at all.
 */
function AdminLayout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [logoutConfirm, setLogoutConfirm] = useState(false);
  const profileRef = useRef(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: profileData } = useAdminProfile();

  // Session guard: no token, or a token that decodes to a non-admin role,
  // cannot stay on admin pages. Backend still verifies every request.
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      navigate(ADMIN_LOGIN_PATH, { replace: true });
      return;
    }
    try {
      const { role_Id: roleId } = jwtDecode(token);
      if (roleId !== 1) clearAdminSession(queryClient, navigate);
    } catch {
      clearAdminSession(queryClient, navigate);
    }
  }, [navigate, queryClient]);

  // Close profile dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    if (profileOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [profileOpen]);

  const displayName =
    [profileData?.data?.name, profileData?.data?.lastname]
      .filter(Boolean)
      .join(" ") || "Admin";

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <AdminSidebar setMobileOpen={setMobileOpen} />

      <div className="min-h-screen lg:ml-[260px]">
        {/* Topbar */}
        <header className="sticky top-0 z-30 flex h-[60px] items-center justify-between border-b border-slate-200/70 bg-white/85 px-4 shadow-[0_8px_24px_-18px_rgba(15,23,42,0.35)] backdrop-blur-xl lg:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="rounded-lg p-2 text-slate-600 transition hover:bg-slate-100 active:scale-90 lg:hidden"
              aria-label="Open menu"
            >
              <Menu size={20} />
            </button>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-semibold text-emerald-600 ring-1 ring-emerald-200 sm:inline-flex">
              <ShieldCheck size={12} />
              Super Admin
            </span>

            {/* Profile trigger */}
            <div ref={profileRef} className="relative">
              <button
                type="button"
                onClick={() => setProfileOpen((p) => !p)}
                className="flex items-center gap-2.5 rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 transition hover:bg-slate-50"
              >
                <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-[#4630d8] to-[#2e8ee8]">
                  {profileData?.data?.avtar ? (
                    <img
                      src={profileData.data.avtar}
                      alt="Profile"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-xs font-bold text-white">
                      {displayName.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <div className="hidden text-left sm:block">
                  <p className="text-xs font-semibold leading-4 text-slate-800">
                    {displayName}
                  </p>
                  <p className="text-[10px] leading-4 text-slate-400">Administrator</p>
                </div>
                <ChevronDown
                  size={14}
                  className={`ml-1 hidden text-slate-400 transition-transform sm:block ${profileOpen ? "rotate-180" : ""}`}
                />
              </button>

              {/* Dropdown */}
              {profileOpen && (
                <div className="absolute right-0 top-12 z-50 w-72 rounded-xl border border-slate-100 bg-white p-4 shadow-xl">
                  {/* Header */}
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-[#4630d8] to-[#2e8ee8]">
                      {profileData?.data?.avtar ? (
                        <img
                          src={profileData.data.avtar}
                          alt="Profile"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="text-sm font-bold text-white">
                          {displayName.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-800">{displayName}</p>
                      <p className="text-xs text-slate-400">Administrator</p>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="space-y-3 border-t border-slate-100 pt-3">
                    <div className="flex items-center gap-3">
                      <User size={15} className="text-slate-400" />
                      <div>
                        <p className="text-[11px] text-slate-400">Name</p>
                        <p className="text-xs font-medium text-slate-700">
                          {profileData?.data?.name || "-"} {profileData?.data?.lastname || ""}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail size={15} className="text-slate-400" />
                      <div>
                        <p className="text-[11px] text-slate-400">Email</p>
                        <p className="text-xs font-medium text-slate-700">
                          {profileData?.data?.email || "-"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone size={15} className="text-slate-400" />
                      <div>
                        <p className="text-[11px] text-slate-400">Phone</p>
                        <p className="text-xs font-medium text-slate-700">
                          {profileData?.data?.phoneNo || "-"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-4 space-y-2 border-t border-slate-100 pt-3">
                    <button
                      type="button"
                      onClick={() => {
                        setProfileOpen(false);
                        navigate("/admin/settings");
                      }}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-slate-600 transition hover:bg-slate-50"
                    >
                      <User size={14} />
                      View Profile
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setProfileOpen(false);
                        setLogoutConfirm(true);
                      }}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-red-500 transition hover:bg-red-50"
                    >
                      <LogOut size={14} />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="p-5 lg:p-7">{children}</main>
      </div>

      <ConfirmDialog
        open={logoutConfirm}
        title="Logout"
        message="Are you sure you want to logout?"
        confirmLabel="Yes, Logout"
        variant="danger"
        onConfirm={() => {
          setLogoutConfirm(false);
          clearAdminSession(queryClient, navigate, { silent: false });
        }}
        onCancel={() => setLogoutConfirm(false)}
      />
    </div>
  );
}

export default AdminLayout;