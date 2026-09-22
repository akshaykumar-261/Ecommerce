import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AddToWishlist, GetWishlist, RemoveFromWishlist } from "./wishlistApi";

export const useWishlist = () => {
  const isLoggedIn = !!localStorage.getItem("accessToken");
  return useQuery({
    queryKey: ["wishlist"],
    queryFn: GetWishlist,
    enabled: isLoggedIn,
  });
};

export const useAddToWishlist = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: AddToWishlist,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
    },
    onError: (error) => {
      console.error("WISHLIST ADD ERROR:", error.response?.data || error);
    },
  });
};

export const useRemoveFromWishlist = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: RemoveFromWishlist,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
    },
    onError: (error) => {
      console.error("WISHLIST REMOVE ERROR:", error.response?.data || error);
    },
  });
};
