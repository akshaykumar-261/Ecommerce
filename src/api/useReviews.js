import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  CreateReview,
  GetMyReview,
  GetProductReviews,
  UpdateReview,
  DeleteReview,
} from "./reviewApi";

const isLoggedIn = () => Boolean(localStorage.getItem("accessToken"));

export const useProductReviews = (productId) => {
  return useQuery({
    queryKey: ["product-reviews", productId],
    queryFn: () => GetProductReviews(productId),
    enabled: Boolean(productId) && isLoggedIn(),
  });
};

export const useMyReview = (productId) => {
  return useQuery({
    queryKey: ["my-review", productId],
    queryFn: async () => {
      try {
        return await GetMyReview(productId);
      } catch (error) {
        if (error.response?.status === 404) return { data: null };
        throw error;
      }
    },
    enabled: Boolean(productId) && isLoggedIn(),
  });
};

export const useCreateReview = (productId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload) =>
      CreateReview({ ...payload, product_id: Number(productId) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product-reviews", productId] });
      queryClient.invalidateQueries({ queryKey: ["my-review", productId] });
    },
  });
};

export const useUpdateReview = (productId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ reviewId, ...payload }) =>
      UpdateReview(reviewId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product-reviews", productId] });
      queryClient.invalidateQueries({ queryKey: ["my-review", productId] });
    },
  });
};

export const useDeleteReview = (productId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (reviewId) => DeleteReview(reviewId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product-reviews", productId] });
      queryClient.invalidateQueries({ queryKey: ["my-review", productId] });
    },
  });
};
