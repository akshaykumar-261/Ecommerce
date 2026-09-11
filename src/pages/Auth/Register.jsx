import React, { useState } from "react";
import AuthLayout from "../../components/auth/AuthLayout";
import { Link } from "react-router-dom";
import { User, Mail, Phone, MapPin, Lock, Eye, EyeOff } from "lucide-react";
import Button from "../../components/common/Button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "../../validation/auth";
import authBanner from "../../assets/image.png";
import { useRegister } from "../../api/useAuth";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const { mutate:createUser } = useRegister();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const onSubmitData = (data) => {
    const { confirmPassword, ...payload } = data;
    createUser(payload, {
      onSuccess: () => {
        toast.success("Account Created Successfully!");
        reset();
        navigate("/otpVerify");
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || "Registeration Failed");
      },
    });
    reset();
  };

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

      <form
        className="space-y-3"
        onSubmit={handleSubmit(onSubmitData, (errors) => {
          console.log("VALIDATION ERRORS:", errors);
        })}
      >
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
              {...register("name")}
              className="w-full border border-violet-200 rounded-lg py-1.5 pl-10 pr-3 text-sm outline-none bg-white shadow-[0_2px_8px_rgba(139,92,246,0.12)] focus:border-violet-500 focus:shadow-[0_3px_10px_rgba(139,92,246,0.18)]"
            />
          </div>
          {errors.name && (
            <p className="text-red-500 text-xs mt-0.5">{errors.name.message}</p>
          )}
          {/* LAST NAME */}
          <div className="relative">
            <User
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              {...register("lastname")}
              placeholder="Last Name"
              className="w-full border border-violet-200 rounded-lg py-1.5 pl-10 pr-3 text-sm outline-none bg-white shadow-[0_2px_8px_rgba(139,92,246,0.12)] focus:border-violet-500 focus:shadow-[0_3px_10px_rgba(139,92,246,0.18)]"
            />
          </div>
          {errors.lastname && (
            <p className="text-red-500 text-xs mt-0.5">
              {errors.lastname.message}
            </p>
          )}
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
            {...register("email")}
            className="w-full border border-violet-200 rounded-lg py-1.5 pl-10 pr-3 text-sm outline-none bg-white shadow-[0_2px_8px_rgba(139,92,246,0.12)] focus:border-violet-500 focus:shadow-[0_3px_10px_rgba(139,92,246,0.18)]"
          />
        </div>
        {errors.email && (
          <p className="text-red-500 text-xs mt-0.5">{errors.email.message}</p>
        )}
        {/* MOBILE */}
        <div className="relative">
          <Phone
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            placeholder="Enter Mobile Number"
            {...register("phoneNo")}
            className="w-full border border-violet-200 rounded-lg py-1.5 pl-10 pr-3 text-sm outline-none bg-white shadow-[0_2px_8px_rgba(139,92,246,0.12)] focus:border-violet-500 focus:shadow-[0_3px_10px_rgba(139,92,246,0.18)]"
          />
        </div>
        {errors.phoneNo && (
          <p className="text-red-500 text-xs mt-0.5">
            {errors.phoneNo.message}
          </p>
        )}
        {/* ADDRESS */}
        <div className="relative">
          <MapPin
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            placeholder="Enter Address"
            {...register("address")}
            className="w-full border border-violet-200 rounded-lg py-1.5 pl-10 pr-3 text-sm outline-none bg-white shadow-[0_2px_8px_rgba(139,92,246,0.12)] focus:border-violet-500 focus:shadow-[0_3px_10px_rgba(139,92,246,0.18)]"
          />
        </div>
        {errors.address && (
          <p className="text-red-500 text-xs mt-0.5">
            {errors.address.message}
          </p>
        )}
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
              {...register("password")}
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
          {errors.password && (
            <p className="text-red-500 text-xs mt-0.5">
              {errors.password.message}
            </p>
          )}

          {/* CONFIRM PASSWORD */}
          <div className="relative">
            <Lock
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type={showPassword ? "text" : "password"}
              placeholder="Confirm"
              {...register("confirmPassword")}
              className="w-full border border-violet-200 rounded-lg py-1.5 pl-10 pr-8 text-sm outline-none bg-white shadow-[0_2px_8px_rgba(139,92,246,0.12)] focus:border-violet-500 focus:shadow-[0_3px_10px_rgba(139,92,246,0.18)]"
            />
          </div>
          {errors.confirmPassword && (
            <p className="text-red-500 text-xs mt-0.5">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        {/* TERMS */}
        <label className="flex items-center gap-2 text-xs text-gray-500">
          <input type="checkbox" className="accent-violet-600 rounded" />

          <span>I agree to Terms & Conditions</span>
        </label>

        {/* BUTTON */}
        <Button type="submit" className="py-2 text-sm">
          CREATE VENDOR ACCOUNT
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
