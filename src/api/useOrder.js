import { useMutation, useQuery } from "@tanstack/react-query";
import {
  PlaceOrder,
  ConfirmPayment,
  GetMyOrders,
  GetOrderById,
  CancelOrder,
  TrackOrder,
} from "./orderApi";

export const usePlaceOrder = () => {
  return useMutation({
    mutationFn: PlaceOrder,
  });
};

export const useConfirmPayment = () => {
  return useMutation({
    mutationFn: ConfirmPayment,
  });
};

export const useMyOrders = () => {
  return useQuery({
    queryKey: ["myOrders"],
    queryFn: GetMyOrders,
  });
};

export const useOrderById = (orderId) => {
  return useQuery({
    queryKey: ["order", orderId],
    queryFn: () => GetOrderById(orderId),
    enabled: !!orderId,
  });
};

export const useCancelOrder = () => {
  return useMutation({
    mutationFn: CancelOrder,
  });
};

export const useTrackOrder = (orderId) => {
  return useQuery({
    queryKey: ["trackOrder", orderId],
    queryFn: () => TrackOrder(orderId),
    enabled: !!orderId,
  });
};