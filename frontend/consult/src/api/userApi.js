import axiosClient from "./axiosClient";

export const getCurrentUserApi = async() =>{
    const response = await axiosClient.get("/auth/me");
    return response.data;
};