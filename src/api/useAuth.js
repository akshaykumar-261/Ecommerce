import { useMutation,useQuery,useQueryClient} from "@tanstack/react-query";
import {
  RegisterUser,
  LoginUser,
  ForgotPassword,
  OtpVerifyUser,
  OtpResendUser,
  OtpVerifyForgotPassword,
  OtpResendForgotPassword,
  ResetOtp,
  VenderRegister,
  VenderOnboardingLink,
  VenderStripeDetail,
  GetUser,
  UpdateUser,
  LogoutUser
} from "./authApi";
import { getGuestCart, clearGuestCart } from "./guestCart";
import { MergeGuestCart } from "./cartApi";

const mergeGuestCartOnAuth = async () => {
  const guestItems = getGuestCart();
  if (!guestItems.length) return null;
  try {
    const response = await MergeGuestCart(
      guestItems.map((i) => ({
        product_id: Number(i.product_id),
        quantity: Number(i.quantity),
      })),
    );
    clearGuestCart();
    return response?.data || { merged: [], skipped: [] };
  } catch (error) {
    console.error("GUEST CART MERGE ERROR:", error.response?.data || error);
    return null;
  }
};
export const useRegister = () => {
  return useMutation({
    mutationFn: RegisterUser,
    onSuccess: async (data) => {
      const { accessToken, refreshToken } = data.data;
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      await mergeGuestCartOnAuth();
      console.log("User registered successfully:", data);
    },
    onError: (error) => {
      console.error("STATUS:", error.response?.status);
      console.error("BACKEND ERROR:", error.response?.data);
      console.error("FULL ERROR:", error);
    },
  });
};
export const useLogin = () => {
  return useMutation({
    mutationFn: LoginUser,
    onSuccess: async (data) => {
      const { accessToken, refreshToken } = data.data;
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      await mergeGuestCartOnAuth();
      console.log("User registered successfully:", data);
    },
    onError: (error) => {
      console.error("STATUS:", error.response?.status);
      console.error("BACKEND ERROR:", error.response?.data);
      console.error("FULL ERROR:", error);
    },
  });
};
export const useForgetPassword = () => {
  return useMutation({
    mutationFn: ForgotPassword,
    onSuccess: (data) => {
      const { accessToken, refreshToken } = data.data;
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      console.log("User registered successfully:", data);
    },
    onError: (error) => {
      console.error("STATUS:", error.response?.status);
      console.error("BACKEND ERROR:", error.response?.data);
      console.error("FULL ERROR:", error);
    },
  });
};
export const useOtpVerifyUser = () => {
  return useMutation({
    mutationFn: OtpVerifyUser,
    onSuccess: (data) => {
      console.log("User registered successfully:", data);
    },
    onError: (error) => {
      console.error("STATUS:", error.response?.status);
      console.error("BACKEND ERROR:", error.response?.data);
      console.error("FULL ERROR:", error);
    },
  });
};
export const useOtpResendUser = () => {
  return useMutation({
    mutationFn: OtpResendUser,
    onSuccess: async (data) => {
      const { accessToken, refreshToken } = data.data;
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      await mergeGuestCartOnAuth();
      console.log("User registered successfully:", data);
    },
    onError: (error) => {
      console.error("STATUS:", error.response?.status);
      console.error("BACKEND ERROR:", error.response?.data);
      console.error("FULL ERROR:", error);
    },
  });
};
export const useOtpVerifyForgotPassword = () => {
  return useMutation({
    mutationFn: OtpVerifyForgotPassword,
    onSuccess: (data) => {
      const { accessToken, refreshToken } = data.data;
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      console.log("User registered successfully:", data);
    },
    onError: (error) => {
      console.error("STATUS:", error.response?.status);
      console.error("BAVenderOnboardingLinkCKEND ERROR:", error.response?.data);
      console.error("FULL ERROR:", error);
    },
  });
};
export const useOtpResendForgotPassword = () => {
  return useMutation({
    mutationFn: OtpResendForgotPassword,
    onSuccess: async (data) => {
      const { accessToken, refreshToken } = data.data;
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      await mergeGuestCartOnAuth();
      console.log("User registered successfully:", data);
    },
    onError: (error) => {
      console.error("STATUS:", error.response?.status);
      console.error("BACKEND ERROR:", error.response?.data);
      console.error("FULL ERROR:", error);
    },
  });
};
export const useResetOtp = () => {
  return useMutation({
    mutationFn: ResetOtp,
    onSuccess: (data) => {
      console.log("User registered successfully:", data);
    },
    onError: (error) => {
      console.error("STATUS:", error.response?.status);
      console.error("BACKEND ERROR:", error.response?.data);
      console.error("FULL ERROR:", error);
    },
  });
};
export const useVenderRegister = () => {
  return useMutation({
    mutationFn: VenderRegister,
    onSuccess: (data) => {
      const { accessToken, refreshToken } = data.data;
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      console.log("User registered successfully:", data);
    },
    onError: (error) => {
      console.error("STATUS:", error.response?.status);
      console.error("BACKEND ERROR:", error.response?.data);
      console.error("FULL ERROR:", error);
    },
  });
};
export const useVenderOnboarding = () => {
  return useMutation({
    mutationFn: VenderOnboardingLink,
    onSuccess: (data) => {
      console.log("User registered successfully:", data);
    },
    onError: (error) => {
      console.error("STATUS:", error.response?.status);
      console.error("BACKEND ERROR:", error.response?.data);
      console.error("FULL ERROR:", error);
    },
  });
};
export const useVenderStripeDetail = () => {
  return useQuery({
    queryKey: ["stripe-account-status"],
    queryFn: VenderStripeDetail,
  });
};
export const useGetUser = () => {
  return useQuery({
    queryKey: ["user"],
    queryFn: GetUser,
  });
};
export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: UpdateUser,
    onSuccess: (data) => {
      console.log("User updated successfully:", data);
      queryClient.invalidateQueries({
        queryKey: ["user"],
      });
    },
    onError: (error) => {
      console.error("STATUS:", error.response?.status);
      console.error("BACKEND ERROR:", error.response?.data);
      console.error("FULL ERROR:", error);
    },
  });
};
export const useLogout = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: LogoutUser,
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ["user"] });
    },
    onError: (error) => {
      console.error("STATUS:", error.response?.status);
      console.error("BACKEND ERROR:", error.response?.data);
      console.error("FULL ERROR:", error);
    },
  });
};


