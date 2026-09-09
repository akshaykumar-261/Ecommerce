import React from "react";
import { LockKeyhole } from "lucide-react";
import AuthLayout from "../../components/auth/AuthLayout";
import authBanner from "../../assets/image copy 13.png";
import Button from "../../components/common/Button";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  useOtpVerifyForgotPassword,
  useOtpResendForgotPassword,
} from "../../api/useAuth";
function OtpVerifyForgotPassword() {
   const handleNumberChange = (e) => {
     e.target.value = e.target.value.replace(/[^0-9]/g, "");
   };
    const { mutate: otpResendForgotPassword } = useOtpResendForgotPassword();
  const navigate = useNavigate();
  const { mutate: otpVerifyForgotPassword } = useOtpVerifyForgotPassword();
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm();
   const onSubmitData = (data) => {
     const otp =
       data.otp1 + data.otp2 + data.otp3 + data.otp4 + data.otp5 + data.otp6;
     otpVerifyForgotPassword(
       { otp },
       {
         onSuccess: () => {
           toast.success("OTP Verify Successfully!");
           reset();
           navigate("/resetPassword");
         },
         onError: (error) => {
           toast.error(error.response?.data?.message || "Otp Verify Failed!!");
         },
       },
     );
   };
    const handleResendOtp = () => {
      otpResendForgotPassword(
        {},
        {
          onSuccess: (data) => {
            toast.success(data.message || "OTP sent successfully!");
          },

          onError: (error) => {
            toast.error(error.response?.data?.message || "OTP resend failed!");
          },
        },
      );
    };
  return (
    <AuthLayout image={authBanner}>
      {/* Icon */}
      <div>
        <LockKeyhole size={35} className="mt-10 text-violet-600" />
      </div>

      {/* Heading */}
      <div className="mt-5">
        <h1 className="text-2xl font-bold text-gray-900">Verify Your OTP</h1>

        <p className="text-gray-500 mt-2 text-sm">
          We've sent a 6-digit code to
          <br />
          ak****@gmail.com
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmitData)} className="mt-7">
        {/* OTP */}
        <div className="flex gap-2">
          <input
            type="text"
            inputMode="numeric"
            maxLength="1"
            onChange={handleNumberChange}
            {...register("otp1")}
            className="
              w-11 h-11
              border
              border-violet-600
              rounded-lg
              text-center
              text-lg
              outline-none
              focus:border-violet-500
            "
          />

          <input
            type="text"
            maxLength="1"
            inputMode="numeric"
            onChange={handleNumberChange}
            {...register("otp2")}
            className="
              w-11 h-11
              border
              border-gray-300
              rounded-lg
              text-center
              text-lg
              outline-none
              focus:border-violet-500
            "
          />

          <input
            type="text"
            maxLength="1"
            inputMode="numeric"
            onChange={handleNumberChange}
            {...register("otp3")}
            className="
              w-11 h-11
              border
              border-gray-300
              rounded-lg
              text-center
              text-lg
              outline-none
              focus:border-violet-500
            "
          />

          <input
            type="text"
            maxLength="1"
            inputMode="numeric"
            {...register("otp4")}
            className="
              w-11 h-11
              border
              border-gray-300
              rounded-lg
              text-center
              text-lg
              outline-none
              focus:border-violet-500
            "
          />

          <input
            type="text"
            maxLength="1"
            inputMode="numeric"
            onChange={handleNumberChange}
            {...register("otp5")}
            className="
              w-11 h-11
              border
              border-gray-300
              rounded-lg
              text-center
              text-lg
              outline-none
              focus:border-violet-500
            "
          />

          <input
            type="text"
            maxLength="1"
            inputMode="numeric"
            onChange={handleNumberChange}
            {...register("otp6")}
            className="
              w-11 h-11
              border
              border-gray-300
              rounded-lg
              text-center
              text-lg
              outline-none
              focus:border-violet-500
            "
          />
        </div>

        {/* Resend OTP */}
        <button
          type="button"
          onClick={handleResendOtp}
          className="text-sm text-violet-600"
        >
          Resend OTP
        </button>

        {/* Verify Button */}
        <Button type="submit" className="py-2 mt-6 text-sm">
          VERIFY OTP
        </Button>
      </form>

      {/* Back */}
      <Link
        to="/forgot-password"
        className="inline-block mt-7 text-sm text-violet-600"
      >
        ← Back
      </Link>
    </AuthLayout>
  );
}

export default OtpVerifyForgotPassword;
