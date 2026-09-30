import { useState } from "react";
import AuthLayout from "../../components/auth/AuthLayout";
import authBanner from "../../assets/image copy 13.png";
import Button from "../../components/common/Button";
import { LockKeyhole } from "lucide-react";
import { useForm } from "react-hook-form";
import { useOtpVerifyUser, useOtpResendUser } from "../../api/useAuth";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "../../components/common/ AuthContext";
import OtpInput from "../../components/common/OtpInput";
function OtpVerify() {
  const navigate = useNavigate();
  const { setOtpVerified } = useAuth();
  const { mutate: otpVerifyUser } = useOtpVerifyUser();
  const [otp, setOtp] = useState("");
  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { mutate: otpResendUser } = useOtpResendUser();

  register("otp", {
    required: "Enter the 6-digit code",
    pattern: { value: /^\d{6}$/, message: "Enter all 6 digits" },
  });

  const handleOtpChange = (next) => {
    setOtp(next);
    setValue("otp", next);
  };

  const onSubmitData = (data) => {
    otpVerifyUser(
      { otp: data.otp },
      {
        onSuccess: () => {
          const accessToken = localStorage.getItem("accessToken");
          if (!accessToken) {
            toast.error("Access token not found");
             return;
          }
          const decodedToken = jwtDecode(accessToken);
          const roleId = decodedToken.role_Id;
          setOtpVerified(true);
          if (roleId === 2) {
            navigate("/bussinessAccountVendor");
          } else if (roleId === 3) {
            navigate("/home");
          } else {
            toast.error("Invalid user role");
            navigate("/login");
          }
        },
        onError: (error) => {
          toast.error(error.response?.data?.message || "Otp Verify Failed!!");
        },
      },
    );
  };
  const handleResendOtp = () => {
    otpResendUser(
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

export default OtpVerify;
