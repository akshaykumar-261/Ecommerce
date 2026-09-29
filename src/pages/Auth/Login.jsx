import React, { useState } from "react";
import AuthLayout from "../../components/auth/AuthLayout";
import { Link, useLocation } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import Button from "../../components/common/Button";
import { loginSchema } from "../../validation/auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import authBanner from "../../assets/image.png";
import { useLogin } from "../../api/useAuth";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import authFieldClass from "../../components/auth/authFieldClass";
import AuthFieldError from "../../components/auth/AuthFieldError";

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const { mutate: loginUser } = useLogin();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from;
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    mode: "onTouched",
  });

  const onSubmitData = (data) => {
    loginUser(data, {
      onSuccess: () => {
        toast.success("Login Successfully!");
        reset();
        navigate(redirectTo || "/home", { replace: true });
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || "Login Failed");
      }
    });
  };

  return (
    <AuthLayout image={authBanner}>
      {/* TABS */}
      <div className="flex border-b mb-4 text-sm font-medium">
        <Link
          to="/login"
          className="w-1/2 text-center pb-2 text-violet-600 border-b-2 border-violet-600"
        >
          Login
        </Link>
        <Link
          to="/register"
          className="w-1/2 text-center pb-2 text-gray-500 hover:text-gray-700"
        >
          Register
        </Link>
      </div>

      {/* HEADING */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Welcome back!</h1>
        <p className="text-xs text-gray-500 mt-1">
          Sign in to your account and continue shopping
        </p>
      </div>

      {/* FORM */}
      <form onSubmit={handleSubmit(onSubmitData)} className="space-y-4" noValidate>
        {/* EMAIL */}
        <div>
          <div className="relative">
            <Mail
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="email"
              placeholder="Enter Your Email"
              {...register("email")}
              className={authFieldClass()}
              aria-invalid={!!errors.email}
            />
          </div>
          <AuthFieldError message={errors.email?.message} />
        </div>

        {/* PASSWORD */}
        <div>
          <div className="relative">
            <Lock
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter Your Password"
              {...register("password")}
              className={authFieldClass("pr-10")}
              aria-invalid={!!errors.password}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 transition hover:text-violet-600"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          <AuthFieldError message={errors.password?.message} />
        </div>

        {/* REMEMBER & FORGOT PASSWORD */}
        <div className="flex items-center justify-between text-xs">
        
          <Link
            to="/forgot-password"
            className="text-violet-600 hover:underline font-medium"
          >
            Forgot Password?
          </Link>
        </div>

        {/* BUTTON */}
        <Button type="submit" className="py-2 text-sm">
          LOGIN
        </Button>
      </form>

      {/* BOTTOM */}
      <p className="text-center mt-6 text-xs text-gray-600">
        Don't have an account?{" "}
        <Link to="/register" className="text-violet-600 font-medium">
          Sign up
        </Link>
      </p>
    </AuthLayout>
  );
}

export default Login;
