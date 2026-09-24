import axiosInstance from "./axiosInstance";

export const PlaceOrder = async (addressId) => {
  const response = await axiosInstance.post("/order/placeOrder", {
    address_id: addressId,
  });
  return response.data;
};

export const ConfirmPayment = async ({ paymentIntentId, paymentMethodId }) => {
  const response = await axiosInstance.post("/order/payment-confirm", {
    paymentIntentId,
    payment_method_id: paymentMethodId,
  });
  return response.data;
};

export const GetMyOrders = async () => {
  const response = await axiosInstance.get("/order/getOrders");
  return response.data;
};

export const GetOrderById = async (orderId) => {
  const response = await axiosInstance.get(`/order/getOrderById/${orderId}`);
  return response.data;
};

export const CancelOrder = async (orderId) => {
  const response = await axiosInstance.post(`/order/cancelOrder/${orderId}`);
  return response.data;
};