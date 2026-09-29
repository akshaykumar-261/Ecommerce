import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import {
  GetAllProducts,
  GetHeroBanner,
  GetProductsByCategory,
} from "./productApi";

export const useAllProducts = (limit = 12) => {
  return useInfiniteQuery({
    queryKey: ["all-products", limit],
    queryFn: ({ pageParam = 1 }) => GetAllProducts({ page: pageParam, limit }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const data = lastPage?.data?.products;
      const currentPage = data?.currentPage || 1;
      const totalPages = data?.totalPages || 1;
      return currentPage < totalPages ? currentPage + 1 : undefined;
    },
  });
};

export const useHeroBanner = () => {
  return useQuery({
    queryKey: ["hero-banner"],
    queryFn: GetHeroBanner,
    retry: false,
    // Banner is cacheable content, not per-user state
    staleTime: 5 * 60 * 1000,
  });
};

const EMPTY_CATEGORY_RESULT = {
  data: { products: { data: [], totalPages: 1, currentPage: 1, totalRecords: 0 } },
};

/**
 * Public products in a category, used for the related products strip on the
 * product detail page. The endpoint 404s when a category has no products, so
 * that case is folded into an empty result instead of surfacing as an error.
 */
export const useRelatedProducts = (categoryId, limit = 5) => {
  return useQuery({
    queryKey: ["related-products", categoryId, limit],
    queryFn: async () => {
      try {
        return await GetProductsByCategory(categoryId, { page: 1, limit });
      } catch (error) {
        if (error.response?.status === 404) return EMPTY_CATEGORY_RESULT;
        throw error;
      }
    },
    enabled: !!categoryId,
  });
};
