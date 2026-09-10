import React, { useState } from "react";
import AuthLayout from "../../components/auth/AuthLayout";
import { Link } from "react-router-dom";
import { User, Mail, Phone, MapPin, Lock, Eye, EyeOff } from "lucide-react";
import Button from "../../components/common/Button";
import authBanner from "../../assets/image copy 15.png";
import { zodResolver } from "@hookform/resolvers/zod";
import { venderSchema } from "../../validation/auth";
import {useForm} from "react-hook-form"
function VendorRegister() {
  const [showPassword, setShowPassword] = useState(false);
   const {
     register,
     handleSubmit,
     reset,
     formState: { errors },
   } = useForm({
     resolver: zodResolver(venderSchema),
   });
  return (
    <AuthLayout image={authBanner}>
      {/* TABS */}
      <div className="flex border-b mb-4 text-sm font-medium">
        <Link
          to="/vendor-register"
          className="w-1/2 text-center pb-2 text-violet-600 border-b-2 border-violet-600"
        >
          Vendor Register
        </Link>
      </div>

      {/* HEADING */}
      <div className="mb-4">
        <h1 className="text-xl font-bold text-gray-900">
          Create Vendor Account
        </h1>

        <p className="text-xs text-gray-500 mt-1">
          Join us and start selling your products today
        </p>
      </div>

      {/* FORM - DESIGN ONLY */}
      <form className="space-y-3">
        {/* FIRST NAME & LAST NAME */}
        <div className="grid grid-cols-2 gap-3">
          {/* FIRST NAME */}
          <div className="relative">
            <User
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              placeholder="First Name"
              className="w-full border border-violet-200 rounded-lg py-1.5 pl-10 pr-3 text-sm outline-none bg-white shadow-[0_2px_8px_rgba(139,92,246,0.12)] focus:border-violet-500 focus:shadow-[0_3px_10px_rgba(139,92,246,0.18)]"
            />
          </div>

          {/* LAST NAME */}
          <div className="relative">
            <User
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              placeholder="Last Name"
              className="w-full border border-violet-200 rounded-lg py-1.5 pl-10 pr-3 text-sm outline-none bg-white shadow-[0_2px_8px_rgba(139,92,246,0.12)] focus:border-violet-500 focus:shadow-[0_3px_10px_rgba(139,92,246,0.18)]"
            />
          </div>
        </div>

        {/* EMAIL */}
        <div className="relative">
          <Mail
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="email"
            placeholder="Enter Your Email"
            className="w-full border border-violet-200 rounded-lg py-1.5 pl-10 pr-3 text-sm outline-none bg-white shadow-[0_2px_8px_rgba(139,92,246,0.12)] focus:border-violet-500 focus:shadow-[0_3px_10px_rgba(139,92,246,0.18)]"
          />
        </div>

        {/* MOBILE */}
        <div className="relative">
          <Phone
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            placeholder="Enter Mobile Number"
            className="w-full border border-violet-200 rounded-lg py-1.5 pl-10 pr-3 text-sm outline-none bg-white shadow-[0_2px_8px_rgba(139,92,246,0.12)] focus:border-violet-500 focus:shadow-[0_3px_10px_rgba(139,92,246,0.18)]"
          />
        </div>

        {/* ADDRESS */}
        <div className="relative">
          <MapPin
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            placeholder="Enter Address"
            className="w-full border border-violet-200 rounded-lg py-1.5 pl-10 pr-3 text-sm outline-none bg-white shadow-[0_2px_8px_rgba(139,92,246,0.12)] focus:border-violet-500 focus:shadow-[0_3px_10px_rgba(139,92,246,0.18)]"
          />
        </div>

        {/* PASSWORD & CONFIRM PASSWORD */}
        <div className="grid grid-cols-2 gap-3">
          {/* PASSWORD */}
          <div className="relative">
            <Lock
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full border border-violet-200 rounded-lg py-1.5 pl-10 pr-8 text-sm outline-none bg-white shadow-[0_2px_8px_rgba(139,92,246,0.12)] focus:border-violet-500 focus:shadow-[0_3px_10px_rgba(139,92,246,0.18)]"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500"
            >
              {showPassword ? <Eye size={16} /> : <EyeOff size={16} />}
            </button>
          </div>

          {/* CONFIRM PASSWORD */}
          <div className="relative">
            <Lock
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type={showPassword ? "text" : "password"}
              placeholder="Confirm"
              className="w-full border border-violet-200 rounded-lg py-1.5 pl-10 pr-8 text-sm outline-none bg-white shadow-[0_2px_8px_rgba(139,92,246,0.12)] focus:border-violet-500 focus:shadow-[0_3px_10px_rgba(139,92,246,0.18)]"
            />
          </div>
        </div>

        {/* TERMS */}
        <label className="flex items-center gap-2 text-xs text-gray-500">
          <input type="checkbox" className="accent-violet-600 rounded" />

          <span>I agree to Terms & Conditions</span>
        </label>

        {/* BUTTON */}
        <Button type="button" className="py-2 text-sm">
          CREATE VENDOR ACCOUNT
        </Button>
      </form>

      {/* LOGIN */}
      <p className="text-center mt-3 text-xs text-gray-600">
        Already have an account?{" "}
        <Link to="/login" className="text-violet-600 font-medium">
          Login
        </Link>
      </p>
    </AuthLayout>
  );
}

export default VendorRegister;
