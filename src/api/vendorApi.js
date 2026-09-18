import axiosInstance from "./axiosInstance";
export const CreateStore = async (data) => {
  const response = await axiosInstance.post("/venders/create-store", data);
  return response.data;
};
export const AddProduct = async (data) => {
  const response = await axiosInstance.post("/venders/add-product", data);
  return response.data;
};
export const GetCategory = async (data) => {
  const response = await axiosInstance.get("/admin/get-categories", data);
  return response.data;
};
export const GetProducts = async ({ page = 1, limit = 10 }) => {
  const response = await axiosInstance.get(
    `/venders/get-products?page=${page}&limit=${limit}`,
  );
  return response.data;
};
export const UpdateProduct = async (productId, data) => {
  const respponse = await axiosInstance.put(
    `/venders/update-product-details/${productId}`,
    data,
  );
  return respponse.data;
};
export const AddProductMedia = async (productId, data) => {
  const response = await axiosInstance.post(
    `/venders/products-media/${productId}`,
    data,
  );
  return response.data;
};
export const DeleteProductMedia = async (mediaId) => {
  const response = await axiosInstance.delete(
    `/venders/product-media-delete/${mediaId}`,
  );
  return response.data;
};
export const DeleteProduct = async (productId) => {
  const response = await axiosInstance.delete(
    `/venders/deleteProduct/${productId}`,
  );
  return response.data;
};
export const GetVenderDashboard = async () => {
  const response = await axiosInstance.get(`/venders/get-product-dashboard`);
  return response.data;
};
export const ChangeProductStatus = async (productId, status) => {
  const response = await axiosInstance.patch(
    `/venders/change-product-status/${productId}`,
    { status },
  );
  return response.data;
};
export const GetStore = async () => {
  const response = await axiosInstance.get(`/venders/get-store`);
  return response.data;
};
export const UpdateStore = async (data) => {
  const response = await axiosInstance.put(`/venders/update-store`, data);
  return response.data;
};
export const DeleteStore = async () => {
  const response = await axiosInstance.delete(`/venders/delete-store`);
  return response.data;
};

export const GetVendorProfile = async () => {
  const response = await axiosInstance.get(`/venders/getVendor-Profile`);
  return response.data;
};

export const UpdateVendorProfile = async (data) => {
  const response = await axiosInstance.put(`/venders/updateVendor-Profile`, data);
  return response.data;
};

export const GetOrders = async ({ page = 1, limit = 10, status, search }) => {
  const params = new URLSearchParams({ page, limit });
  if (status) params.append("status", status);
  if (search) params.append("search", search);
  const response = await axiosInstance.get(`/venders/orders?${params.toString()}`);
  return response.data;
};

export const UpdateOrderStatus = async (orderId, status) => {
  const response = await axiosInstance.patch(`/venders/Updateorders-status/${orderId}`, { status });
  return response.data;
};

export const GetPayouts = async ({ status } = {}) => {
  const params = status && status !== "all" ? `?status=${status}` : "";
  const response = await axiosInstance.get(`/venders/payouts${params}`);
  return response.data;
};

export const GetProductById = async (productId) => {
  const response = await axiosInstance.get(`/venders/get-productById/${productId}`);
  return response.data;
};

export const SetPrimaryImage = async (mediaId) => {
  const response = await axiosInstance.post(`/venders/setPrimary-image/${mediaId}`);
  return response.data;
};

export const UpdateProductQuantity = async (productId, quantity) => {
  const response = await axiosInstance.patch(`/venders/products-quantity/${productId}`, { quantity });
  return response.data;
};

export const GetOutOfStockProducts = async ({ page = 1, limit = 10, search } = {}) => {
  const params = new URLSearchParams({ page, limit });
  if (search) params.append("search", search);
  const response = await axiosInstance.get(`/venders/outOf-Stock-Product?${params.toString()}`);
  return response.data;
};

export const GetLowStockProducts = async ({ page = 1, limit = 10, search } = {}) => {
  const params = new URLSearchParams({ page, limit });
  if (search) params.append("search", search);
  const response = await axiosInstance.get(`/venders/products/low-stock?${params.toString()}`);
  return response.data;
};