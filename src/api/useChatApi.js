import { useQuery } from "@tanstack/react-query";
import { GetConversations, GetMessages, GetChatVendors, GetChatAdmin } from "./chatApi";

export const useConversations = () => {
  return useQuery({
    queryKey: ["conversations"],
    queryFn: GetConversations,
    refetchInterval: 10000,
  });
};

export const useMessages = (room, enabled = false) => {
  return useQuery({
    queryKey: ["messages", room],
    queryFn: () => GetMessages(room),
    enabled,
    refetchInterval: false,
  });
};

export const useChatVendors = () => {
  return useQuery({
    queryKey: ["chat-vendors"],
    queryFn: GetChatVendors,
  });
};

export const useChatAdmin = () => {
  return useQuery({
    queryKey: ["chat-admin"],
    queryFn: GetChatAdmin,
  });
};
