import React from "react";
import { useState } from "react";
import AuthLayout from "../../components/auth/AuthLayout";
import { Link } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import Button from "../../components/common/Button";
function Login() {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <AuthLayout>
      <div className="flex border-b mb-10">
        <Link
          to="/login"
          className="w-1/2 text-center pb-4 mt-3 text-1xl font-medium text-violet-600 border-b-2 border-violet-600"
        >
          Login
        </Link>
        <Link
          to="/register"
          className="w-1/2 text-center pb-4 mt-3 text-1xl  font-medium text-gray-500"
        >
          Register
        </Link>
      </div>
      {/* HEADING....................... */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Welcome back!</h1>
        <p className=" text-1xl text-gray-500 mt-2">
          Sign in to your account and continue shopping
        </p>
      </div>
      {/* // FORM HANDALING........................................... */}
      <form className="space-y-5">
        {/* EMAIL...................... */}
        <div>
          <div className="relative">
            <Mail
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="email"
              placeholder=" Enter Your Email "
              className="
                w-full
                border
                border-gray-300
                rounded-lg
                py-2
                pl-12
                pr-4
                outline-none
                focus:border-violet-500
              "
            />
          </div>
        </div>
        {/* PASSWORD...................... */}
        <div>
          <div className="relative">
            <Lock
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type={showPassword ? "text" : "password"}
              placeholder=" Enter Your Password "
              className="
                w-full
                border
                border-gray-300
                rounded-lg
                py-2
                pl-12
                pr-4
                outline-none
                focus:border-violet-500
              "
            />
            {/* Eye Button */}
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
            >
              {showPassword ? <EyeOff size={21} /> : <Eye size={21} />}
            </button>
          </div>
        </div>
        {/* REMEMBER........................................... */}
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-gray-600">
            <input type="checkbox" className="w-4 h-4 accent-violet-600" />
            Remember me
          </label>
          <Link
            to="/forgot-password"
            className="text-violet-600 hover:underline"
          >
            Forgot Password
          </Link>
        </div>
        {/* LOGIN BUTTON....................... */}
        <Button type="submit">LOGIN</Button>
      </form>
    </AuthLayout>
  );
}

export default Login;
