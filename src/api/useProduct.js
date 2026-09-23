import { useInfiniteQuery } from "@tanstack/react-query";
import { GetAllProducts } from "./productApi";

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