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

export const requestPhoneUpdateApi = async (phone) => {
  const res = await axiosClient.post("/users/request-phone-update", { phone });
  return res.data;
};

export const verifyPhoneUpdateApi = async (otp) => {
  const res = await axiosClient.post("/users/verify-phone-update", { otp });
  return res.data;
};