import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { jwtDecode } from "jwt-decode";
import toast from "react-hot-toast";
import { Mail, Lock, Eye, EyeOff, ShieldCheck, Loader2 } from "lucide-react";
import { loginSchema } from "../../validation/auth";
import { useLogin } from "../../api/useAuth";

/**
 * Admin sign-in. Reuses the platform /users/login endpoint (roles share one
 * auth service), but the destination and gating are admin-specific: only
 * role_Id 1 (Super Admin) may proceed, and the token is verified by the
 * backend on every /admin request.
 */
function AdminLogin() {
  const [showPassword, setShowPassword] = useState(false);
  const { mutate: loginUser, isPending } = useLogin();
  const navigate = useNavigate();

  // Already signed in as admin? Straight to the console.
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) return;
    try {
      if (jwtDecode(token).role_Id === 1) navigate("/admin/dashboard", { replace: true });
    } catch {
      /* stale/invalid token: stay on login */
    }
  }, [navigate]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(loginSchema), mode: "onSubmit" });

  const onSubmit = (data) => {
    loginUser(data, {
      onSuccess: (response) => {
        const decoded = jwtDecode(response.data.accessToken);
        if (decoded.role_Id !== 1) {
          // Not an admin: drop the tokens immediately so a vendor/customer
          // session never lingers in admin storage.
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          toast.error("This account does not have admin access");
          return;
        }
        toast.success("Welcome back, Admin");
        navigate("/admin/dashboard", { replace: true });
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || "Login failed");
      },
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 p-4">
      {/* Ambient glow */}
      <div className="pointer-events-none fixed -left-32 -top-32 h-96 w-96 rounded-full bg-indigo-600/20 blur-3xl" />
      <div className="pointer-events-none fixed -bottom-32 -right-32 h-96 w-96 rounded-full bg-blue-500/20 blur-3xl" />

      <div className="animate-fade-up relative w-full max-w-md">
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-8 shadow-2xl backdrop-blur-xl">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 shadow-lg shadow-indigo-500/30">
              <ShieldCheck size={26} className="text-white" />
            </div>
            <h1 className="text-xl font-bold text-white">Admin Console</h1>
            <p className="mt-1 text-xs text-slate-400">
              Sign in with your administrator account
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Email */}
            <div>
              <div className="relative">
                <Mail size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="email"
                  placeholder="Admin email"
                  {...register("email")}
                  className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-slate-500 outline-none transition focus:border-indigo-400 focus:bg-white/10 focus:ring-4 focus:ring-indigo-500/20"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <div className="relative">
                <Lock size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  {...register("password")}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-10 text-sm text-slate-800 outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/15"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-600"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-500 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/30 transition hover:opacity-90 active:scale-[0.98] disabled:opacity-60"
            >
              {isPending && <Loader2 size={16} className="animate-spin" />}
              {isPending ? "Signing in..." : "Sign in to Console"}
            </button>
          </form>

          <p className="mt-6 text-center text-[11px] leading-5 text-slate-500">
            Restricted area. All actions are audited.
          </p>
        </div>

        <p className="mt-5 text-center text-xs text-slate-600">
          Vendor or customer?{" "}
          <Link to="/vendorLogin" className="font-medium text-indigo-400 hover:underline">
            Use the vendor login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default AdminLogin;