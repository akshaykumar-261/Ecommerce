import { Store as LogoMark } from "lucide-react";
import toast from "react-hot-toast";

/* eslint-disable react-refresh/only-export-components */
/*
 * Shared constants/helpers for the admin chrome. Session helpers live here so
 * every admin entry point (login guard, sidebar, topbar) degrades identically.
 */

export const ADMIN_LOGIN_PATH = "/admin/login";

/**
 * Wipe the shared token pair and return to the admin login. Tokens are shared
 * with the storefront (single localStorage pair); after a role failure or
 * logout the cache must be purged so no admin data renders for the next login.
 */
export function clearAdminSession(queryClient, navigate, { silent = true } = {}) {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  queryClient?.clear?.();
  if (!silent) toast.success("Logged out");
  if (typeof navigate === "function") navigate(ADMIN_LOGIN_PATH, { replace: true });
}

export function logoutAdmin(queryClient, navigate) {
  clearAdminSession(queryClient, navigate, { silent: false });
}

export function AdminLogo() {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/25 bg-white/15 shadow-lg shadow-black/10 backdrop-blur-md">
        <LogoMark size={20} className="text-white" />
      </div>
      <div>
        <h1 className="text-lg font-extrabold tracking-tight text-white">
          Shop<span className="text-amber-300">Ease</span>
        </h1>
        <p className="text-[11px] font-medium tracking-wide text-white/60">
          Admin Panel
        </p>
      </div>
    </div>
  );
}
