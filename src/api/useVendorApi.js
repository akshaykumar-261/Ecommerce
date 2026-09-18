import { useMutation, useQuery } from "@tanstack/react-query";
import {
  CreateStore,
  AddProduct,
  GetCategory,
  AddProductMedia,
  GetProducts,
  UpdateProduct,
  DeleteProductMedia,
  DeleteProduct,
  GetVenderDashboard,
  ChangeProductStatus,
  GetStore,
  UpdateStore,
  DeleteStore,
  GetVendorProfile,
  UpdateVendorProfile,
  GetOrders,
  UpdateOrderStatus,
  GetPayouts,
  GetProductById,
  SetPrimaryImage,
  UpdateProductQuantity,
  GetOutOfStockProducts,
  GetLowStockProducts,
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
export const useUpadteProduct = () => {
  return useMutation({
    mutationFn: ({ productId, data }) => {
      return UpdateProduct(productId, data);
    },
    onSuccess: (data) => {
      console.log("Product updated successfully:", data);
    },
    onError: (error) => {
      console.error("STATUS:", error.response?.status);
      console.error("BACKEND ERROR:", error.response?.data);
      console.error("FULL ERROR:", error);
    },
  });
};
export const useDeleteProductMedia = () => {
  return useMutation({
    mutationFn: (mediaId) => {
      return DeleteProductMedia(mediaId);
    },
    onSuccess: (data) => {
      console.log("Product Media Deleted successfully:", data);
    },
    onError: (error) => {
      console.error("STATUS:", error.response?.status);
      console.error("BACKEND ERROR:", error.response?.data);
      console.error("FULL ERROR:", error);
    },
  });
};
export const useDeleteProduct = () => {
  return useMutation({
    mutationFn: DeleteProduct,
    onSuccess: (data) => {
      console.log("Product deleted successfully:", data);
    },
    onError: (error) => {
      console.error("STATUS:", error.response?.status);
      console.error("BACKEND ERROR:", error.response?.data);
      console.error("FULL ERROR:", error);
    },
  });
};
export const useVenderDashboard = () => {
  return useQuery({
    queryKey: ["vendor-dashboard"],
    queryFn: GetVenderDashboard,
  });
};
export const useChangeProductStatus = () => {
  return useMutation({
    mutationFn: ({ productId, status }) =>
      ChangeProductStatus(productId, status),
    onSuccess: (data) => {
      console.log("Product status updated successfully:", data);
    },
    onError: (error) => {
      console.error("STATUS:", error.response?.status);
      console.error("BACKEND ERROR:", error.response?.data);
      console.error("FULL ERROR:", error);
    },
  });
};
export const useGetStore = () => {
  return useQuery({
    queryKey: ["vendor-store"],
    queryFn: GetStore,
  });
};
export const useUpdateStore = () => {
  return useMutation({
    mutationFn: UpdateStore,
    onSuccess: (data) => {
      console.log("Store updated successfully:", data);
    },
    onError: (error) => {
      console.error("STATUS:", error.response?.status);
      console.error("BACKEND ERROR:", error.response?.data);
      console.error("FULL ERROR:", error);
    },
  });
};
export const useDeleteStore = () => {
  return useMutation({
    mutationFn: DeleteStore,
    onSuccess: (data) => {
      console.log("Store deleted successfully:", data);
    },
    onError: (error) => {
      console.error("STATUS:", error.response?.status);
      console.error("BACKEND ERROR:", error.response?.data);
      console.error("FULL ERROR:", error);
    },
  });
};

export const useGetVendorProfile = () => {
  return useQuery({
    queryKey: ["vendor-profile"],
    queryFn: GetVendorProfile,
  });
};

export const useUpdateVendorProfile = () => {
  return useMutation({
    mutationFn: UpdateVendorProfile,
    onSuccess: (data) => {
      console.log("Vendor profile updated successfully:", data);
    },
    onError: (error) => {
      console.error("STATUS:", error.response?.status);
      console.error("BACKEND ERROR:", error.response?.data);
      console.error("FULL ERROR:", error);
    },
  });
};

export const useGetOrders = (page = 1, limit = 10, status, search) => {
  return useQuery({
    queryKey: ["vendor-orders", page, limit, status, search],
    queryFn: () => GetOrders({ page, limit, status, search }),
  });
};

export const useUpdateOrderStatus = () => {
  return useMutation({
    mutationFn: ({ orderId, status }) => UpdateOrderStatus(orderId, status),
    onSuccess: (data) => {
      console.log("Order status updated successfully:", data);
    },
    onError: (error) => {
      console.error("STATUS:", error.response?.status);
      console.error("BACKEND ERROR:", error.response?.data);
      console.error("FULL ERROR:", error);
    },
  });
};

export const useGetPayouts = (status) => {
  return useQuery({
    queryKey: ["vendor-payouts", status],
    queryFn: () => GetPayouts({ status }),
  });
};

export const useGetProductById = (productId) => {
  return useQuery({
    queryKey: ["vendor-product", productId],
    queryFn: () => GetProductById(productId),
    enabled: !!productId,
  });
};

export const useSetPrimaryImage = () => {
  return useMutation({
    mutationFn: SetPrimaryImage,
    onSuccess: (data) => {
      console.log("Primary image set successfully:", data);
    },
    onError: (error) => {
      console.error("STATUS:", error.response?.status);
      console.error("BACKEND ERROR:", error.response?.data);
      console.error("FULL ERROR:", error);
    },
  });
};

export const useUpdateProductQuantity = () => {
  return useMutation({
    mutationFn: ({ productId, quantity }) => UpdateProductQuantity(productId, quantity),
    onSuccess: (data) => {
      console.log("Product quantity updated successfully:", data);
    },
    onError: (error) => {
      console.error("STATUS:", error.response?.status);
      console.error("BACKEND ERROR:", error.response?.data);
      console.error("FULL ERROR:", error);
    },
  });
};

export const useGetOutOfStockProducts = (page = 1, limit = 10, search) => {
  return useQuery({
    queryKey: ["vendor-out-of-stock", page, limit, search],
    queryFn: () => GetOutOfStockProducts({ page, limit, search }),
  });
};

export const useGetLowStockProducts = (page = 1, limit = 10, search) => {
  return useQuery({
    queryKey: ["vendor-low-stock", page, limit, search],
    queryFn: () => GetLowStockProducts({ page, limit, search }),
  });
};
