import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  AddAddress,
  UpdateAddress,
  GetAddresses,
  DeleteAddress,
} from "./addressApi";

export const useAddresses = () => {
  const isLoggedIn = !!localStorage.getItem("accessToken");
  return useQuery({
    queryKey: ["addresses"],
    queryFn: GetAddresses,
    enabled: isLoggedIn,
  });
};

export const useAddAddress = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: AddAddress,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
    },
    onError: (error) => {
      console.error("ADDRESS ADD ERROR:", error.response?.data || error);
    },
  });
};

export const useUpdateAddress = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ addressId, payload }) => UpdateAddress(addressId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
    },
    onError: (error) => {
      console.error("ADDRESS UPDATE ERROR:", error.response?.data || error);
    },
  });
};

export const useDeleteAddress = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: DeleteAddress,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
    },
    onError: (error) => {
      console.error("ADDRESS DELETE ERROR:", error.response?.data || error);
    },
  });
};