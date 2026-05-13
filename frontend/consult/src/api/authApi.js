import axiosClient, { refreshClient } from "./axiosClient";

/*
=============================
LOGIN
=============================
*/

export const loginApi = async (data) => {
  const response = await axiosClient.post("/auth/login", data);

  const { accessToken, refreshToken } = response.data.data;

  localStorage.setItem("accessToken", accessToken);
  localStorage.setItem("refreshToken", refreshToken);

  return response.data;
};
/*
=============================
REFRESH TOKEN
=============================
*/

export const refreshTokenApi = async () => {

  /*
  =============================
  GET CURRENT REFRESH TOKEN
  =============================
  */

  const refreshToken = localStorage.getItem("refreshToken");

  if (!refreshToken) {
    throw new Error("No refresh token found");
  }

  /*
  =============================
  CALL REFRESH ENDPOINT
  IMPORTANT:
  Use refreshClient
  (NO INTERCEPTORS)
  =============================
  */

  const response = await refreshClient.post(
    "/auth/refresh",
    { refreshToken }
  );

  /*
  =============================
  EXTRACT ROTATED TOKENS
  =============================
  */

  const {
    accessToken,
    refreshToken: newRefreshToken
  } = response.data.data;

  /*
  =============================
  STORE NEW TOKENS
  =============================
  */

  localStorage.setItem(
    "accessToken",
    accessToken
  );

  localStorage.setItem(
    "refreshToken",
    newRefreshToken
  );

  /*
  =============================
  RETURN FULL DATA
  =============================
  */

  return response.data.data;
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
VERIFY OTP
=============================
*/

export const verifyOtpApi = async (email, otp) => {
  const response = await axiosClient.post("/auth/verify-otp", {
    email,
    otp,
  });

  return response.data;
};

/*
=============================
RESEND OTP
=============================
*/

export const resendOtpApi = async (email) => {
  const response = await axiosClient.post("/auth/resend-otp", {
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