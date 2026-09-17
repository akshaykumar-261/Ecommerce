import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

// Request Interceptor: Access Token Lagayein
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

/*
 * Refresh Token se naya Access Token generate karein.
 * (Raw axios use kiya hai taaki ye response interceptor khud par retreat na ho)
 */
const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem("refreshToken");
  if (!refreshToken) {
    throw new Error("No refresh token available");
  }

  const response = await axios.post(
    `${import.meta.env.VITE_API_BASE_URL}/users/refresh-token`,
    { refreshToken }, // Body me bhi bhej rahe hain (backed header read karta hai)
    {
      headers: {
        Authorization: `Bearer ${refreshToken}`, // Backend isi header se token padhta hai
      },
    },
  );

  const newAccessToken =
    response.data?.data?.accessToken || response.data?.accessToken;

  if (!newAccessToken) {
    throw new Error("Failed to generate new access token");
  }

  localStorage.setItem("accessToken", newAccessToken);
  return newAccessToken;
};

/*
 * Single-flight refresh: Ek saath multiple API 401 fail hon,
 * toh refresh sirf ek baar chalega aur baaki sab new token wait karke retry karenge.
 */
let refreshPromise = null;

const clearSessionAndRedirect = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  if (!window.location.pathname.startsWith("/login")) {
    window.location.href = "/login";
  }
};

// Response Interceptor: Auto Refresh Token Handling
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Direct Auth Flow Endpoints par 401 aaye toh direct reject karein, Refresh Trigger Na Karein
    const authEndpoints = [
      "/users/login",
      "/users/forgot-password",
      "/users/verify-forgotOtp",
      "/users/resend-otp-forgotPassword",
      "/users/reset-password",
    ];
    const isAuthRoute = authEndpoints.some((url) =>
      originalRequest?.url?.includes(url),
    );

    // Sirf 401 par refresh karein; already retried ho toh loop na bane
    if (
      error.response?.status !== 401 ||
      isAuthRoute ||
      originalRequest?._retry
    ) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) {
        return Promise.reject(error);
      }

      // Agar refresh pehle se chal raha hai toh usi result ka wait karein
      if (!refreshPromise) {
        refreshPromise = refreshAccessToken().finally(() => {
          refreshPromise = null;
        });
      }

      const newAccessToken = await refreshPromise;

      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
      return axiosInstance(originalRequest);
    } catch (refreshError) {
      // Agar Refresh Token bhi expire ho jaye toh clean logout
      clearSessionAndRedirect();
      return Promise.reject(refreshError);
    }
  },
);

export default axiosInstance;