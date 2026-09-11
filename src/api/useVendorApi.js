import { useMutation } from "@tanstack/react-query";
import { CreateStore } from "./vendorApi";
export const useCreateStore = () => {
  return useMutation({
    mutationFn: CreateStore,
    onSuccess: (data) => {
      console.log("User registered successfully:", data);
    },
    onError: (error) => {
      console.error("STATUS:", error.response?.status);
      console.error("BACKEND ERROR:", error.response?.data);
      console.error("FULL ERROR:", error);
    },
  });
};
