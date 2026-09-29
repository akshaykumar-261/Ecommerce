import { useState } from "react";
import AuthLayout from "../../components/auth/AuthLayout";
import { Link } from "react-router-dom";
import { User, Mail, Phone, MapPin, Lock, Eye, EyeOff } from "lucide-react";
import Button from "../../components/common/Button";
import authBanner from "../../assets/image copy 15.png";
import { zodResolver } from "@hookform/resolvers/zod";
import { venderSchema } from "../../validation/auth";
import { useForm } from "react-hook-form";
import { useVenderRegister } from "../../api/useAuth";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../components/common/ AuthContext";
import authFieldClass from "../../components/auth/authFieldClass";
import AuthFieldError from "../../components/auth/AuthFieldError";
function VendorRegister() {
  const [showPassword, setShowPassword] = useState(false);
  const { setRegistrationCompleted } = useAuth();
  const { mutate: createVendor } = useVenderRegister();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(venderSchema),
  });
  const onSubmitData = (data) => {
    const { confirmPassword, ...payload } = data;
    createVendor(payload, {
      onSuccess: () => {
        toast.success("Vendor Account Created Successfully!");
        setRegistrationCompleted(true);
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
        <Link
          to="/vendorLogin"
          className="w-1/2 text-center pb-2 text-gray-500"
        >
          Login
        </Link>
        <Link
          to="/vendorRegister"
          className="w-1/2 text-center pb-2 text-violet-600 border-b-2 border-violet-600"
        >
          Register
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
      <form
        className="space-y-3"
        onSubmit={handleSubmit(onSubmitData, (errors) => {
          console.log("VALIDATION ERRORS:", errors);
        })}
      >
        {/* FIRST NAME & LAST NAME */}
        <div className="grid grid-cols-2 gap-3">
          {/* FIRST NAME */}
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
              />
            </div>
            <AuthFieldError message={errors.name?.message} />
          </div>
          {/* LAST NAME */}
          <div>
            <div className="relative">
              <User
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                {...register("lastname")}
                placeholder="Last Name"
                className={authFieldClass()}
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
              type="text"
              placeholder="Enter Mobile Number"
              {...register("phoneNo")}
              className={authFieldClass()}
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
            />
          </div>
          <AuthFieldError message={errors.address?.message} />
        </div>

        {/* PASSWORD & CONFIRM PASSWORD */}
        <div className="grid grid-cols-2 gap-3">
          {/* PASSWORD */}
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
                className={authFieldClass("pr-8")}
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {showPassword ? <Eye size={16} /> : <EyeOff size={16} />}
              </button>
            </div>
            <AuthFieldError message={errors.password?.message} />
          </div>

          {/* CONFIRM PASSWORD */}
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
                className={authFieldClass("pr-8")}
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {showPassword ? <Eye size={16} /> : <EyeOff size={16} />}
              </button>
            </div>
            <AuthFieldError message={errors.confirmPassword?.message} />
          </div>
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

      {/* LOGIN */}
      <p className="text-center mt-3 text-xs text-gray-600">
        Already have an account?{" "}
        <Link to="/vendorLogin" className="text-violet-600 font-medium">
          Login
        </Link>
      </p>
    </AuthLayout>
  );
}

export default VendorRegister;
