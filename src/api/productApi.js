import axiosInstance from "./axiosInstance";

export const GetProductsByCategory = async (categoryId, { page = 1, limit = 12, search = "" } = {}) => {
  const params = new URLSearchParams({ page, limit });
  if (search) params.append("search", search);
  const response = await axiosInstance.get(
    `/products/category/${categoryId}?${params.toString()}`
  );
  return response.data;
};

export const GetProductById = async (productId) => {
  const response = await axiosInstance.get(`/products/${productId}`);
  return response.data;
};

export const SearchProducts = async (query, { page = 1, limit = 12 } = {}) => {
  const params = new URLSearchParams({ q: query, page, limit });
  const response = await axiosInstance.get(
    `/products/search?${params.toString()}`
  );
  return response.data;
};

export const GetTopRatedProducts = async ({ minRating = 3, limit = 20 } = {}) => {
  const params = new URLSearchParams({ minRating, limit });
  const response = await axiosInstance.get(
    `/users/top-rated-products?${params.toString()}`
  );
  return response.data;
};

export const GetProductsByCategoryGroup = async (categoryIds, { page = 1, limit = 12 } = {}) => {
  const params = new URLSearchParams({ page, limit });
  categoryIds.forEach((id) => params.append("categoryIds", id));
  const response = await axiosInstance.get(
    `/products/category-group?${params.toString()}`
  );
  return response.data;
};
