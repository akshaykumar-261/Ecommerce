import { useState } from "react";
import { LockKeyhole } from "lucide-react";
import AuthLayout from "../../components/auth/AuthLayout";
import authBanner from "../../assets/image copy 13.png";
import leftArrow from "../../assets/left-arrow.png";
import Button from "../../components/common/Button";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../components/common/ AuthContext";
import toast from "react-hot-toast";
import OtpInput from "../../components/common/OtpInput";
import {
  useOtpVerifyForgotPassword,
  useOtpResendForgotPassword,
} from "../../api/useAuth";
function OtpVerifyForgotPassword() {
  const { forgotPasswordEmail, setForgotPasswordOtpVerified } = useAuth();
  const { mutate: otpResendForgotPassword } = useOtpResendForgotPassword();
  const navigate = useNavigate();
  const { mutate: otpVerifyForgotPassword } = useOtpVerifyForgotPassword();
  const [otp, setOtp] = useState("");
  const {
    register,
    setValue,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // The six boxes are one value, so the form holds a single field instead of
  // otp1..otp6. Reading six optional fields used to submit "12undefined456"
  // whenever a box was left empty.
  register("otp", {
    required: "Enter the 6-digit code",
    pattern: { value: /^\d{6}$/, message: "Enter all 6 digits" },
  });

  const handleOtpChange = (next) => {
    setOtp(next);
    setValue("otp", next);
  };

  const maskedEmail = (email) => {
    if (!email) return "";
    const [name, domain] = email.split("@");
    if (name.length <= 2) {
      return `${name[0]}***@${domain}`;
    }
    return `${name.slice(0, 2)}***@${domain}`;
  };
  const onSubmitData = (data) => {
    otpVerifyForgotPassword(
      { otp: data.otp },
      {
        onSuccess: () => {
          setForgotPasswordOtpVerified(true);
          toast.success("OTP Verify Successfully!");
          setOtp("");
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
      <Link
        to="/forgot-password"
        className="absolute left-5 top-5 flex w-fit items-center gap-2 text-xs font-medium text-gray-600 transition hover:text-violet-600 md:right-8 md:top-6"
      >
        <img src={leftArrow} alt="" aria-hidden="true" className="h-4 w-4" />
        Back
      </Link>

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
          {maskedEmail(forgotPasswordEmail)}
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmitData)} className="mt-7">
        {/* OTP */}
        <OtpInput value={otp} onChange={handleOtpChange} hasError={!!errors.otp} />
        {errors.otp && (
          <p className="mt-2 text-xs text-red-500">{errors.otp.message}</p>
        )}

        {/* Resend OTP */}
        <button
          type="button"
          onClick={handleResendOtp}
          className="mt-4 text-sm text-violet-600"
        >
          Resend OTP
        </button>

        {/* Verify Button */}
        <Button type="submit" className="py-2 mt-6 text-sm">
          VERIFY OTP
        </Button>
      </form>
    </AuthLayout>
  );
}

export default OtpVerifyForgotPassword;
