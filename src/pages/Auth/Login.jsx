import React, { useState } from "react";
import AuthLayout from "../../components/auth/AuthLayout";
import { Link } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import Button from "../../components/common/Button";
import { loginSchema } from "../../validation/auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import authBanner from "../../assets/image.png";
import { useLogin } from "../../api/useAuth";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const { mutate: loginUser } = useLogin();
  const navigate = useNavigate();
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmitData = (data) => {
    loginUser(data, {
      onSuccess: () => {
        toast.success("Login Successfully!");
        reset();
        navigate("/home");
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
      <form onSubmit={handleSubmit(onSubmitData)} className="space-y-4">
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
              className="
                w-full
                border
                border-gray-300
                rounded-lg
                py-2
                pl-10
                pr-4
                text-sm
                outline-none
                focus:border-violet-500
              "
            />
          </div>
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
          )}
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
              className="
                w-full
                border
                border-gray-300
                rounded-lg
                py-2
                pl-10
                pr-10
                text-sm
                outline-none
                focus:border-violet-500
              "
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.password && (
            <p className="text-red-500 text-xs mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* REMEMBER & FORGOT PASSWORD */}
        <div className="flex items-center justify-between text-xs">
          <label className="flex items-center gap-2 text-gray-600 cursor-pointer">
            <input
              type="checkbox"
              className="w-3.5 h-3.5 accent-violet-600 rounded"
            />
            Remember me
          </label>
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
