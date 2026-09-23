import axiosInstance from "./axiosInstance";

export const AddAddress = async (payload) => {
  const response = await axiosInstance.post("/address/add-address", payload);
  return response.data;
};

export const UpdateAddress = async (addressId, payload) => {
  const response = await axiosInstance.put(
    `/address/upadte-address/${addressId}`,
    payload,
  );
  return response.data;
};

export const GetAddresses = async () => {
  const response = await axiosInstance.get("/address/get-address");
  return response.data;
};

export const DeleteAddress = async (addressId) => {
  const response = await axiosInstance.delete(
    `/address/deleteAddress/${addressId}`,
  );
  return response.data;
};