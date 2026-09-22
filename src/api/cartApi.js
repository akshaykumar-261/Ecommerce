import axiosInstance from "./axiosInstance";

export const AddToCart = async (payload) => {
  const response = await axiosInstance.post("/cart/add-to-cart", payload);
  return response.data;
};

export const GetCartItems = async () => {
  const response = await axiosInstance.get("/cart/get-cart-items");
  return response.data;
};

export const UpdateCartItemQuantity = async (cartItemId, quantity) => {
  const response = await axiosInstance.put(
    `/cart/update-quantity/${cartItemId}`,
    { quantity },
  );
  return response.data;
};

export const GetCartCount = async () => {
  const response = await axiosInstance.get("/cart/get-cart-count");
  return response.data;
};

export const RemoveFromCart = async (productId) => {
  const response = await axiosInstance.delete(
    `/cart/remove-product/${productId}`,
  );
  return response.data;
};