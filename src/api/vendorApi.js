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