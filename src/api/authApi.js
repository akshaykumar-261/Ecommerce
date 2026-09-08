import axiosInstance from "./axiosInstance";
export const RegisterUser = async (data) => {
    const response = await axiosInstance.post("/users/create", data);
    return response.data;
}