import { useMutation, useQuery } from "@tanstack/react-query";
import {
  CreateStore,
  AddProduct,
  GetCategory,
  AddProductMedia,
  GetProducts,
} from "./vendorApi";
export const useCreateStore = () => {
  return useMutation({
    mutationFn: CreateStore,
    onSuccess: (data) => {
      console.log("Store Created  successfully:", data);
    },
    onError: (error) => {
      console.error("STATUS:", error.response?.status);
      console.error("BACKEND ERROR:", error.response?.data);
      console.error("FULL ERROR:", error);
    },
  });
};
export const useAddProduct = () => {
  return useMutation({
    mutationFn: AddProduct,
    onSuccess: (data) => {
      console.log("Product Add successfully:", data);
    },
    onError: (error) => {
      console.error("STATUS:", error.response?.status);
      console.error("BACKEND ERROR:", error.response?.data);
      console.error("FULL ERROR:", error);
    },
  });
};
export const useGetCategory = () => {
  return useQuery({ queryKey: ["categories"], queryFn: () => GetCategory({}) });
};
export const useAddProductImage = () => {
  return useMutation({
    mutationFn: ({ productId, data }) => {
      return AddProductMedia(productId, data);
    },

    onSuccess: (data) => {
      console.log("Product Media Added successfully:", data);
    },
    onError: (error) => {
      console.error("STATUS:", error.response?.status);
      console.error("BACKEND ERROR:", error.response?.data);
      console.error("FULL ERROR:", error);
    },
  });
};
export const useGetProducts = (page, limit) => {
  return useQuery({
    queryKey: ["vendor-products", page, limit],
    queryFn: () => GetProducts({ page, limit }),
  });
};




