import axiosInstance from "./axiosInstance";

export const GetConversations = async () => {
  const response = await axiosInstance.get("/chat/conversations");
  return response.data;
};

export const GetMessages = async (room, page = 1, limit = 50) => {
  const response = await axiosInstance.get(
    `/chat/messages/${room}?page=${page}&limit=${limit}`,
  );
  return response.data;
};

export const GetChatVendors = async () => {
  const response = await axiosInstance.get("/chat/vendors");
  return response.data;
};

export const GetChatAdmin = async () => {
  const response = await axiosInstance.get("/chat/admin");
  return response.data;
};

export const DeleteMessages = async (room) => {
  const response = await axiosInstance.delete(`/chat/messages/${room}`);
  return response.data;
};

export const DeleteMessage = async (messageId) => {
  const response = await axiosInstance.delete(`/chat/message/${messageId}`);
  return response.data;
};
