import axiosInstance from "./axiosInstance";

export const AddToWishlist = async (productId) => {
  const response = await axiosInstance.post(`/users/addWishlist-Product/${productId}`);
  return response.data;
};

export const GetWishlist = async () => {
  const response = await axiosInstance.get("/users/get-wishList");
  return response.data;
};

export const RemoveFromWishlist = async (productId) => {
  const response = await axiosInstance.delete(`/users/remove-wishlist/${productId}`);
  return response.data;
};
