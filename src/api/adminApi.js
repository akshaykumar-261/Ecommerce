import axiosInstance from "./axiosInstance";

// ---------------------------------------------------------------------------
// Admin API — every function hits a route mounted at /admin and is guarded by
// `authorize` + `checkRole("Super Admin")` on the backend.
// ---------------------------------------------------------------------------

// ---- Auth / profile -------------------------------------------------------

export const GetAdminProfile = async () => {
  const response = await axiosInstance.get("/admin/admin-profile");
  return response.data;
};

export const UpdateAdminProfile = async (formData) => {
  const response = await axiosInstance.put("/admin/update-profile", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

// ---- Dashboard ------------------------------------------------------------

export const GetAdminDashboard = async () => {
  const response = await axiosInstance.get("/admin/dashboard");
  return response.data;
};

// ---- Vendors --------------------------------------------------------------

export const GetAdminVendors = async ({ page = 1, limit = 10, search = "", status } = {}) => {
  const response = await axiosInstance.get("/admin/get-all-venders", {
    params: { page, limit, search, status },
  });
  return response.data;
};

export const GetAdminVendorDashboard = async (vendorId) => {
  const response = await axiosInstance.get(`/admin/vender/dashBoard/${vendorId}`);
  return response.data;
};

export const VendorAction = async (vendorId, action) => {
  const response = await axiosInstance.patch(`/admin/vendor/action/${vendorId}`, {
    action,
  });
  return response.data;
};

export const GetVendorStoreDetails = async (vendorId, search = "") => {
  const response = await axiosInstance.get(`/admin/vendor/store/${vendorId}`, {
    params: { search },
  });
  return response.data;
};

// ---- Customers ------------------------------------------------------------

export const GetAdminUsers = async ({ page = 1, limit = 10, search = "", status } = {}) => {
  const response = await axiosInstance.get("/admin/users", {
    params: { page, limit, search, status },
  });
  return response.data;
};

export const UpdateUserStatus = async (userId, isActive) => {
  const response = await axiosInstance.patch(`/admin/users/${userId}/status`, {
    is_active: isActive,
  });
  return response.data;
};

// ---- Products ---------------------------------------------------------------

export const GetAdminProducts = async ({
  page = 1,
  limit = 10,
  search = "",
  category_id,
  vendor_id,
  status,
} = {}) => {
  const response = await axiosInstance.get("/admin/products", {
    params: { page, limit, search, category_id, vendor_id, status },
  });
  return response.data;
};

export const UpdateProductStatus = async (productId, status) => {
  const response = await axiosInstance.patch(`/admin/products/${productId}/status`, {
    status,
  });
  return response.data;
};

// ---- Categories -------------------------------------------------------------

export const GetAdminCategories = async ({ search = "", status } = {}) => {
  const response = await axiosInstance.get("/admin/get-categories", {
    params: { search, status },
  });
  return response.data;
};

export const CreateAdminCategory = async (data) => {
  const response = await axiosInstance.post("/admin/get-category", data);
  return response.data;
};

export const UpdateAdminCategory = async (categoryId, data) => {
  const response = await axiosInstance.put(`/admin/update-category/${categoryId}`, data);
  return response.data;
};

export const DeleteAdminCategory = async (categoryId) => {
  const response = await axiosInstance.delete(`/admin/delete-category/${categoryId}`);
  return response.data;
};

// ---- Orders -----------------------------------------------------------------

export const GetAdminOrders = async ({ page = 1, limit = 10, status, search = "" } = {}) => {
  const response = await axiosInstance.get("/admin/admin/orders", {
    params: { page, limit, status, search },
  });
  return response.data;
};

// ---- Payouts ----------------------------------------------------------------

export const GetAdminPayouts = async ({ page = 1, limit = 10, status, vendor_id } = {}) => {
  const response = await axiosInstance.get("/admin/vendor-payouts", {
    params: { page, limit, status, vendor_id },
  });
  return response.data;
};

export const GetAdminPayoutSummary = async () => {
  const response = await axiosInstance.get("/admin/vendor-payouts/summary");
  return response.data;
};

// ---- Category Products -----------------------------------------------------

export const GetProductsByCategoryId = async (categoryId, { page = 1, limit = 10, search = "" } = {}) => {
  const response = await axiosInstance.get(`/admin/getProductByCategoryId/${categoryId}`, {
    params: { page, limit, search },
  });
  return response.data;
};

export const GetProductsByCategoryAndRating = async (categoryId, { page = 1, limit = 10, rating, search = "" } = {}) => {
  const response = await axiosInstance.get(`/admin/productByRating/${categoryId}`, {
    params: { page, limit, rating, search },
  });
  return response.data;
};

// ---- Settings ----------------------------------------------------------------

export const GetAdminCommission = async () => {
  const response = await axiosInstance.get("/admin/get-commision");
  return response.data;
};

export const UpdateAdminCommission = async (data) => {
  const response = await axiosInstance.put("/admin/change-commision", data);
  return response.data;
};