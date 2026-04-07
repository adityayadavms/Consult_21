import axiosClient from "./axiosClient";

/*
=====================================
GET CURRENT USER
=====================================
*/
export const getCurrentUserApi = async () => {
  const res = await axiosClient.get("/users/me"); 
  return res.data.data;
};

/*
=====================================
UPDATE PROFILE (NAME ONLY)
=====================================
*/
export const updateProfileApi = async (data) => {
  const res = await axiosClient.put("/users/update-profile", data);
  return res.data.data;
};

/*
=====================================
REQUEST PHONE UPDATE (SEND OTP)
=====================================
*/
export const requestPhoneUpdateApi = async (phone) => {
  const res = await axiosClient.post("/users/request-phone-update", { phone });
  return res.data.message;
};

/*
=====================================
VERIFY PHONE UPDATE (OTP)
=====================================
*/
export const verifyPhoneUpdateApi = async (otp) => {
  const res = await axiosClient.post("/users/verify-phone-update", { otp });
  return res.data.data;
};

/*
=====================================
RESEND OTP
=====================================
*/
export const resendPhoneOtpApi = async () => {
  const res = await axiosClient.post("/users/resend-phone-otp");
  return res.data.message;
};