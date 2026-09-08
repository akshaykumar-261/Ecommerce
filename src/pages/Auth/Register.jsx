import React, { useState } from "react";
import AuthLayout from "../../components/auth/AuthLayout";
import { Link } from "react-router-dom";
import { User, Mail, Phone, MapPin, Lock, Eye, EyeOff } from "lucide-react";
import Button from "../../components/common/Button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "../../validation/auth";
import authBanner from "../../assets/image.png";
function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const onSubmitData = (data) => console.log("Registering Data:", data);

  return (
    <AuthLayout image={authBanner}>
      {/* TABS */}
      <div className="flex border-b mb-4 text-sm font-medium">
        <Link to="/login" className="w-1/2 text-center pb-2 text-gray-500">
          Login
        </Link>
        <Link
          to="/register"
          className="w-1/2 text-center pb-2 text-violet-600 border-b-2 border-violet-600"
        >
          Register
        </Link>
      </div>

      {/* HEADING */}
      <div className="mb-4">
        <h1 className="text-xl font-bold text-gray-900">Create an Account</h1>
        <p className="text-xs text-gray-500 mt-1">
          Join us and start shopping today
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmitData)} className="space-y-3">
        {/* FIRST NAME & LAST NAME (2 Columns) */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <div className="relative">
              <User
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="First Name"
                {...register("firstName")}
                className="w-full border rounded-lg py-1.5 pl-10 pr-3 text-sm outline-none focus:border-violet-500"
              />
            </div>
            {errors.firstName && (
              <p className="text-red-500 text-xs mt-0.5">
                {errors.firstName.message}
              </p>
            )}
          </div>

          <div>
            <div className="relative">
              <User
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Last Name"
                {...register("lastName")}
                className="w-full border rounded-lg py-1.5 pl-10 pr-3 text-sm outline-none focus:border-violet-500"
              />
            </div>
            {errors.lastName && (
              <p className="text-red-500 text-xs mt-0.5">
                {errors.lastName.message}
              </p>
            )}
          </div>
        </div>

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
              className="w-full border rounded-lg py-1.5 pl-10 pr-3 text-sm outline-none focus:border-violet-500"
            />
          </div>
          {errors.email && (
            <p className="text-red-500 text-xs mt-0.5">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* MOBILE */}
        <div>
          <div className="relative">
            <Phone
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Enter Mobile Number"
              {...register("phone")}
              className="w-full border rounded-lg py-1.5 pl-10 pr-3 text-sm outline-none focus:border-violet-500"
            />
          </div>
          {errors.phone && (
            <p className="text-red-500 text-xs mt-0.5">
              {errors.phone.message}
            </p>
          )}
        </div>

        {/* ADDRESS */}
        <div>
          <div className="relative">
            <MapPin
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Enter Address"
              {...register("address")}
              className="w-full border rounded-lg py-1.5 pl-10 pr-3 text-sm outline-none focus:border-violet-500"
            />
          </div>
          {errors.address && (
            <p className="text-red-500 text-xs mt-0.5">
              {errors.address.message}
            </p>
          )}
        </div>

        {/* PASSWORD & CONFIRM PASSWORD (2 Columns) */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <div className="relative">
              <Lock
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                {...register("password")}
                className="w-full border rounded-lg py-1.5 pl-10 pr-8 text-sm outline-none focus:border-violet-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-xs mt-0.5">
                {errors.password.message}
              </p>
            )}
          </div>

          <div>
            <div className="relative">
              <Lock
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Confirm"
                {...register("confirmPassword")}
                className="w-full border rounded-lg py-1.5 pl-10 pr-8 text-sm outline-none focus:border-violet-500"
              />
            </div>
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs mt-0.5">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
        </div>

        {/* TERMS */}
        <label className="flex items-center gap-2 text-xs text-gray-500">
          <input type="checkbox" className="accent-violet-600 rounded" />
          <span>I agree to Terms & Conditions</span>
        </label>

        {/* BUTTON */}
        <Button type="submit" className="py-2 text-sm">
          CREATE ACCOUNT
        </Button>
      </form>

      <p className="text-center mt-3 text-xs text-gray-600">
        Already have an account?{" "}
        <Link to="/login" className="text-violet-600 font-medium">
          Login
        </Link>
      </p>
    </AuthLayout>
  );
}

export default Register;
