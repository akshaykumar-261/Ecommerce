import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  GetContactMessages,
  GetContactMessageCounts,
  GetContactMessageById,
  ReplyContactMessage,
  UpdateContactMessageStatus,
  DeleteContactMessage,
} from "./contactApi";

/*
 * React Query wrappers for the contact-message inbox. Mutations invalidate the
 * whole "admin-contact-*" family so counts, the table and the open thread all
 * stay in sync without any manual refetch plumbing.
 */

export const useContactMessages = (page, limit, search, status) => {
  return useQuery({
    queryKey: ["admin-contact-messages", page, limit, search, status],
    queryFn: () => GetContactMessages({ page, limit, search, status }),
  });
};

export const useContactMessageCounts = () => {
  return useQuery({
    queryKey: ["admin-contact-counts"],
    queryFn: GetContactMessageCounts,
  });
};

export const useContactMessageById = (id) => {
  return useQuery({
    queryKey: ["admin-contact-message", id],
    queryFn: () => GetContactMessageById(id),
    enabled: Boolean(id),
  });
};

export const useReplyContactMessage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reply }) => ReplyContactMessage(id, { reply }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-contact-messages"] });
      queryClient.invalidateQueries({ queryKey: ["admin-contact-counts"] });
      queryClient.invalidateQueries({ queryKey: ["admin-contact-message"] });
    },
  });
};

export const useUpdateContactMessageStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }) => UpdateContactMessageStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-contact-messages"] });
      queryClient.invalidateQueries({ queryKey: ["admin-contact-counts"] });
      queryClient.invalidateQueries({ queryKey: ["admin-contact-message"] });
    },
  });
};

export const useDeleteContactMessage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => DeleteContactMessage(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-contact-messages"] });
      queryClient.invalidateQueries({ queryKey: ["admin-contact-counts"] });
    },
  });
};
