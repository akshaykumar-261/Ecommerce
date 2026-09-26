import axiosInstance from "./axiosInstance";

export const CreateReview = async (payload) => {
  const response = await axiosInstance.post("/users/create-review", payload);
  return response.data;
};

export const GetMyReview = async (productId) => {
  const response = await axiosInstance.get(`/users/get-myReview/${productId}`);
  return response.data;
};

export const GetProductReviews = async (productId) => {
  const response = await axiosInstance.get(
    `/users/get-allReviewsProduct/${productId}`,
  );
  return response.data;
};

export const UpdateReview = async (reviewId, payload) => {
  const response = await axiosInstance.put(
    `/users/update-review/${reviewId}`,
    payload,
  );
  return response.data;
};

export const DeleteReview = async (reviewId) => {
  const response = await axiosInstance.delete(
    `/users/deleteReview/${reviewId}`,
  );
  return response.data;
};
