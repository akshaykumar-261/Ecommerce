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
import { useAuth } from "../../components/common/ AuthContext";
import toast from "react-hot-toast";
import authFieldClass from "../../components/auth/authFieldClass";
import AuthFieldError from "../../components/auth/AuthFieldError";

function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const { mutate: createUser } = useRegister();
  const { setRegistrationCompleted } = useAuth();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    mode: "onTouched",
  });

  const onSubmitData = (data) => {
    const payload = { ...data };
    delete payload.confirmPassword;
    createUser(payload, {
      onSuccess: () => {
        toast.success("Account Created Successfully!");
        setRegistrationCompleted(true);
        reset();
        navigate("/otpVerify");
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || "Registeration Failed");
      },
    });
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

      <form className="space-y-4" onSubmit={handleSubmit(onSubmitData)} noValidate>
        {/* FIRST NAME & LAST NAME */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <div className="relative">
              <User
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="First Name"
                {...register("name")}
                className={authFieldClass()}
                aria-invalid={!!errors.name}
              />
            </div>
            <AuthFieldError message={errors.name?.message} />
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
                {...register("lastname")}
                className={authFieldClass()}
                aria-invalid={!!errors.lastname}
              />
            </div>
            <AuthFieldError message={errors.lastname?.message} />
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
              className={authFieldClass()}
              aria-invalid={!!errors.email}
            />
          </div>
          <AuthFieldError message={errors.email?.message} />
        </div>

        {/* MOBILE */}
        <div>
          <div className="relative">
            <Phone
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="tel"
              inputMode="numeric"
              maxLength={10}
              placeholder="Enter Mobile Number"
              {...register("phoneNo")}
              className={authFieldClass()}
              aria-invalid={!!errors.phoneNo}
            />
          </div>
          <AuthFieldError message={errors.phoneNo?.message} />
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
              className={authFieldClass()}
              aria-invalid={!!errors.address}
            />
          </div>
          <AuthFieldError message={errors.address?.message} />
        </div>

        {/* PASSWORD & CONFIRM PASSWORD */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
                className={authFieldClass("pr-10")}
                aria-invalid={!!errors.password}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 transition hover:text-violet-600"
              >
                {showPassword ? <Eye size={16} /> : <EyeOff size={16} />}
              </button>
            </div>
            <AuthFieldError message={errors.password?.message} />
          </div>

          <div>
            <div className="relative">
              <Lock
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Confirm Password"
                {...register("confirmPassword")}
                className={authFieldClass("pr-10")}
                aria-invalid={!!errors.confirmPassword}
              />
            </div>
            <AuthFieldError message={errors.confirmPassword?.message} />
          </div>
        </div>

        <Button type="submit" className="py-2 text-sm">
          REGISTER
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
