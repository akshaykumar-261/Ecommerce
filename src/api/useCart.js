import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  AddToCart,
  GetCartItems,
  UpdateCartItemQuantity,
  GetCartCount,
  RemoveFromCart,
} from "./cartApi";

export const useCart = () => {
  const isLoggedIn = !!localStorage.getItem("accessToken");
  return useQuery({
    queryKey: ["cart"],
    queryFn: GetCartItems,
    enabled: isLoggedIn,
  });
};

export const useCartCount = () => {
  const isLoggedIn = !!localStorage.getItem("accessToken");
  return useQuery({
    queryKey: ["cart-count"],
    queryFn: GetCartCount,
    enabled: isLoggedIn,
  });
};

export const useAddToCart = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: AddToCart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      queryClient.invalidateQueries({ queryKey: ["cart-count"] });
    },
    onError: (error) => {
      console.error("CART ADD ERROR:", error.response?.data || error);
    },
  });
};

export const useUpdateCartQuantity = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ cartItemId, quantity }) =>
      UpdateCartItemQuantity(cartItemId, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      queryClient.invalidateQueries({ queryKey: ["cart-count"] });
    },
    onError: (error) => {
      console.error("CART UPDATE ERROR:", error.response?.data || error);
    },
  });
};

export const useRemoveFromCart = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: RemoveFromCart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      queryClient.invalidateQueries({ queryKey: ["cart-count"] });
    },
    onError: (error) => {
      console.error("CART REMOVE ERROR:", error.response?.data || error);
    },
  });
};