import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
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

// Response Interceptor: Auto Refresh Token Handling
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config; // fail api orignal request
    console.log("=========================>", originalRequest);
    // Direct Auth Flow Endpoints par 401 aaye toh direct reject karein, Refresh Trigger Na Karein
    const authEndpoints = [
      "/users/login",
      "/users/forgot-password",
      "/users/verify-forgotOtp",
      "/users/resend-otp-forgotPassword",
      "/users/reset-password",
    ];
    const isAuthRoute = authEndpoints.some((url) =>
      originalRequest.url?.includes(url),
    );
    if (isAuthRoute) {
      return Promise.reject(error);
    }
    // Un-authorized 401 Handle Karein
    if (error.response?.status === 401 ) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) {
          return Promise.reject(error);
        }

        // Axios POST with Body & Header support (Donot crash if backend expects either)
        const response = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/users/refresh-token`,
          { refreshToken: refreshToken }, // Body me Bheja
          {
            headers: {
              Authorization: `Bearer ${refreshToken}`, // Header me bhi safe bhej diya
            },
          },
        );

        // Flexible token extraction
        const newAccessToken =
          response.data?.data?.accessToken || response.data?.accessToken;

        if (newAccessToken) {
          localStorage.setItem("accessToken", newAccessToken);
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return axiosInstance(originalRequest);
        }
      } catch (refreshError) {
        // Agar Refresh Token Expire ho jaye toh clean logout
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
