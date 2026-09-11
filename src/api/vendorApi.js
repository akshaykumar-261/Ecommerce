import axiosInstance from "./axiosInstance";
export const CreateStore = async (data) => {
    const response = await axiosInstance.post("/venders/create-store", data);
    return response.data;
}