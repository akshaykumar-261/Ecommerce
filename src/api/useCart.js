import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  AddToCart,
  MergeGuestCart,
  GetCartItems,
  UpdateCartItemQuantity,
  GetCartCount,
  RemoveFromCart,
} from "./cartApi";
import {
  addToGuestCart,
  clearGuestCart,
  getGuestCart,
  getGuestCartCount,
  isProductInGuestCart,
  removeFromGuestCart,
  subscribeGuestCart,
  updateGuestCartQuantity,
} from "./guestCart";

const isLoggedIn = () => Boolean(localStorage.getItem("accessToken"));

export const useGuestCart = () => {
  const [items, setItems] = useState(() => getGuestCart());

  useEffect(() => subscribeGuestCart(() => setItems(getGuestCart())), []);

  return {
    items,
    count: items.reduce((sum, i) => sum + Number(i.quantity || 0), 0),
  };
};

export const useGuestCartCount = () => {
  const [count, setCount] = useState(() => getGuestCartCount());

  useEffect(
    () =>
      subscribeGuestCart(() => setCount(getGuestCartCount())),
    [],
  );

  return count;
};

export const useIsInGuestCart = (productId) => {
  const { items } = useGuestCart();
  return items.some((i) => Number(i.product_id) === Number(productId));
};

export const useCart = () => {
  const loggedIn = isLoggedIn();
  return useQuery({
    queryKey: ["cart"],
    queryFn: GetCartItems,
    enabled: loggedIn,
  });
};

export const useCartCount = () => {
  const loggedIn = isLoggedIn();
  const serverCount = useQuery({
    queryKey: ["cart-count"],
    queryFn: GetCartCount,
    enabled: loggedIn,
  });
  const guestCount = useGuestCartCount();

  return {
    ...serverCount,
    data: loggedIn
      ? serverCount.data
      : { data: { count: guestCount }, isGuest: true },
  };
};

export const useAddToCart = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ product, product_id, quantity = 1 }) => {
      if (!isLoggedIn()) {
        const payload = product || { id: product_id, quantity: 0 };
        addToGuestCart(payload, quantity);
        return {
          message: "Added to cart. Login to save it permanently.",
          guest: true,
        };
      }
      return AddToCart({
        product_id: Number(product_id ?? product?.id),
        quantity,
      });
    },
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
    mutationFn: ({ cartItemId, product_id, quantity }) => {
      if (!isLoggedIn()) {
        updateGuestCartQuantity(product_id, quantity);
        return Promise.resolve({ message: "Cart updated" });
      }
      return UpdateCartItemQuantity(cartItemId, quantity);
    },
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
    mutationFn: (productId) => {
      if (!isLoggedIn()) {
        removeFromGuestCart(productId);
        return Promise.resolve({ message: "Item removed from cart" });
      }
      return RemoveFromCart(productId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      queryClient.invalidateQueries({ queryKey: ["cart-count"] });
    },
    onError: (error) => {
      console.error("CART REMOVE ERROR:", error.response?.data || error);
    },
  });
};

export const useMergeGuestCart = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const guestItems = getGuestCart();
      if (!guestItems.length) return { merged: [], skipped: [] };

      const res = await MergeGuestCart(
        guestItems.map((i) => ({
          product_id: Number(i.product_id),
          quantity: Number(i.quantity),
        })),
      );
      clearGuestCart();
      return res?.data || { merged: [], skipped: [] };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      queryClient.invalidateQueries({ queryKey: ["cart-count"] });
    },
  });
};

export { isProductInGuestCart };
