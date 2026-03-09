import axiosClient from "./axiosClient";

/*
=============================
LOGIN
=============================
*/

export const loginApi = async (data) => {
  const response = await axiosClient.post("/auth/login", data);

  const { accessToken, refreshToken } = response.data;

  localStorage.setItem("accessToken", accessToken);
  localStorage.setItem("refreshToken", refreshToken);

  return response.data;
};

/*
=============================
SIGNUP
=============================
*/

export const signupApi = async (data) => {
  const response = await axiosClient.post("/auth/signup", data);
  return response.data;
};

/*
=============================
FORGOT PASSWORD
=============================
*/

export const forgotPasswordApi = async (email) => {
  const response = await axiosClient.post("/auth/forgot-password", {
    email,
  });

  return response.data;
};

/*
=============================
RESET PASSWORD
=============================
*/

export const resetPasswordApi = async (data) => {
  const response = await axiosClient.post("/auth/reset-password", data);
  return response.data;
};

/*
=============================
LOGOUT
=============================
*/

export const logoutApi = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
};