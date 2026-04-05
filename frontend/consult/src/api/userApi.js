import axiosClient from "./axiosClient";

export const getCurrentUserApi = async() =>{
    const response = await axiosClient.get("/auth/me");
    return response.data;
};


export const updateProfileApi = async (data) => {
  const response = await axiosClient.put(
    "/users/profile",
    data
  );

  return response.data;
};