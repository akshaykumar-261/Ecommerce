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
export const AddProductMedia = async (productId, data) => {
  const response = await axiosInstance.post(
    `/venders/products-media/${productId}`,
    data,
  );
  return response.data;
};
export const GetProducts = async ({ page = 1, limit = 10 }) => {
  const response = await axiosInstance.get(
    `/venders/get-products?page=${page}&limit=${limit}`
  );
  return response.data;
};

