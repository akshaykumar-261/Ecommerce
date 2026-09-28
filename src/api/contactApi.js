import axiosInstance from "./axiosInstance";

export const SendContactMessage = async (payload) => {
  const response = await axiosInstance.post("/contact/send-message", payload);
  return response.data;
};

export const GetContactMessages = async ({
  page = 1,
  limit = 10,
  search = "",
  status = "",
} = {}) => {
  const response = await axiosInstance.get("/contact/get-all-messages", {
    params: { page, limit, search, status },
  });
  return response.data;
};

export const GetContactMessageCounts = async () => {
  const response = await axiosInstance.get("/contact/message-counts");
  return response.data;
};

export const GetContactMessageById = async (id) => {
  const response = await axiosInstance.get(`/contact/get-message/${id}`);
  return response.data;
};

export const ReplyContactMessage = async (id, payload) => {
  const response = await axiosInstance.post(`/contact/reply/${id}`, payload);
  return response.data;
};

export const UpdateContactMessageStatus = async (id, status) => {
  const response = await axiosInstance.patch(`/contact/update-status/${id}`, {
    status,
  });
  return response.data;
};

export const DeleteContactMessage = async (id) => {
  const response = await axiosInstance.delete(`/contact/delete-message/${id}`);
  return response.data;
};
