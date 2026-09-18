import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  GetAdminProfile,
  UpdateAdminProfile,
  GetAdminDashboard,
  GetAdminVendors,
  GetAdminVendorDashboard,
  VendorAction,
  GetVendorStoreDetails,
  GetAdminUsers,
  UpdateUserStatus,
  GetAdminProducts,
  UpdateProductStatus,
  GetAdminCategories,
  CreateAdminCategory,
  UpdateAdminCategory,
  DeleteAdminCategory,
  GetAdminOrders,
  GetAdminPayouts,
  GetAdminPayoutSummary,
  GetAdminCommission,
  UpdateAdminCommission,
  GetProductsByCategoryId,
  GetProductsByCategoryAndRating,
} from "./adminApi";

/*
 * React Query wrappers for the admin panel.
 * Read hooks use keyed queries so pages can invalidate precisely after mutations.
 */

// ---- Profile ----------------------------------------------------------------

export const useAdminProfile = () => {
  return useQuery({ queryKey: ["admin-profile"], queryFn: GetAdminProfile });
};

export const useUpdateAdminProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: UpdateAdminProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-profile"] });
    },
    onError: (error) => {
      console.error("Admin profile update failed:", error.response?.data);
    },
  });
};

// ---- Dashboard ----------------------------------------------------------------

export const useAdminDashboard = () => {
  return useQuery({
    queryKey: ["admin-dashboard"],
    queryFn: GetAdminDashboard,
  });
};

// ---- Vendors ----------------------------------------------------------------

export const useAdminVendors = (page, limit, search, status) => {
  return useQuery({
    queryKey: ["admin-vendors", page, limit, search, status],
    queryFn: () => GetAdminVendors({ page, limit, search, status }),
  });
};

export const useAdminVendorDashboard = (vendorId) => {
  return useQuery({
    queryKey: ["admin-vendor-dashboard", vendorId],
    queryFn: () => GetAdminVendorDashboard(vendorId),
    enabled: Boolean(vendorId),
  });
};

export const useVendorStoreDetails = (vendorId, search) => {
  return useQuery({
    queryKey: ["admin-vendor-store", vendorId, search],
    queryFn: () => GetVendorStoreDetails(vendorId, search),
    enabled: Boolean(vendorId),
  });
};

export const useVendorAction = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ vendorId, action }) => VendorAction(vendorId, action),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-vendors"] });
      queryClient.invalidateQueries({ queryKey: ["admin-dashboard"] });
    },
    onError: (error) => {
      console.error("Vendor action failed:", error.response?.data);
    },
  });
};

// ---- Customers ----------------------------------------------------------------

export const useAdminUsers = (page, limit, search, status) => {
  return useQuery({
    queryKey: ["admin-users", page, limit, search, status],
    queryFn: () => GetAdminUsers({ page, limit, search, status }),
  });
};

export const useUpdateUserStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, isActive }) => UpdateUserStatus(userId, isActive),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      queryClient.invalidateQueries({ queryKey: ["admin-dashboard"] });
    },
    onError: (error) => {
      console.error("User status update failed:", error.response?.data);
    },
  });
};

// ---- Products ----------------------------------------------------------------

export const useAdminProducts = (page, limit, search, categoryId, vendorId, status) => {
  return useQuery({
    queryKey: ["admin-products", page, limit, search, categoryId, vendorId, status],
    queryFn: () =>
      GetAdminProducts({
        page,
        limit,
        search,
        category_id: categoryId,
        vendor_id: vendorId,
        status,
      }),
  });
};

export const useUpdateProductStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ productId, status }) => UpdateProductStatus(productId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      queryClient.invalidateQueries({ queryKey: ["admin-dashboard"] });
    },
    onError: (error) => {
      console.error("Product status update failed:", error.response?.data);
    },
  });
};

// ---- Categories ----------------------------------------------------------------

export const useAdminCategories = (search, status) => {
  return useQuery({
    queryKey: ["admin-categories", search, status],
    queryFn: () => GetAdminCategories({ search, status }),
  });
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: CreateAdminCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
      queryClient.invalidateQueries({ queryKey: ["admin-dashboard"] });
    },
    onError: (error) => {
      console.error("Category create failed:", error.response?.data);
    },
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ categoryId, data }) => UpdateAdminCategory(categoryId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
    },
    onError: (error) => {
      console.error("Category update failed:", error.response?.data);
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: DeleteAdminCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
      queryClient.invalidateQueries({ queryKey: ["admin-dashboard"] });
    },
    onError: (error) => {
      console.error("Category delete failed:", error.response?.data);
    },
  });
};

// ---- Orders ----------------------------------------------------------------

export const useAdminOrders = (page, limit, status, search) => {
  return useQuery({
    queryKey: ["admin-orders", page, limit, status, search],
    queryFn: () => GetAdminOrders({ page, limit, status, search }),
  });
};

// ---- Payouts ----------------------------------------------------------------

export const useAdminPayouts = (page, limit, status, vendorId) => {
  return useQuery({
    queryKey: ["admin-payouts", page, limit, status, vendorId],
    queryFn: () => GetAdminPayouts({ page, limit, status, vendor_id: vendorId }),
  });
};

export const useAdminPayoutSummary = () => {
  return useQuery({
    queryKey: ["admin-payout-summary"],
    queryFn: GetAdminPayoutSummary,
  });
};

// ---- Settings ----------------------------------------------------------------

export const useAdminCommission = () => {
  return useQuery({
    queryKey: ["admin-commission"],
    queryFn: GetAdminCommission,
  });
};

export const useUpdateCommission = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: UpdateAdminCommission,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-commission"] });
    },
    onError: (error) => {
      console.error("Commission update failed:", error.response?.data);
    },
  });
};

// ---- Category Products ----------------------------------------------------------------

export const useProductsByCategoryId = (categoryId, page, limit, search) => {
  return useQuery({
    queryKey: ["admin-category-products", categoryId, page, limit, search],
    queryFn: () => GetProductsByCategoryId(categoryId, { page, limit, search }),
    enabled: Boolean(categoryId),
  });
};

export const useProductsByCategoryAndRating = (categoryId, page, limit, rating, search) => {
  return useQuery({
    queryKey: ["admin-category-rating-products", categoryId, page, limit, rating, search],
    queryFn: () => GetProductsByCategoryAndRating(categoryId, { page, limit, rating, search }),
    enabled: Boolean(categoryId),
  });
};