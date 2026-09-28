import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { GetAllProducts, GetHeroBanner } from "./productApi";

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