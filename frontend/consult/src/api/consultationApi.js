import axiosClient from "./axiosClient";

/*
=====================================
QUICK CONSULTATION - CREATE ORDER
=====================================
*/

export const createQuickConsultationApi = async (data) => {
  const response = await axiosClient.post(
    "/quick-consultation/create-order",
    data
  );

  return response.data;
};

/*
=====================================
VERIFY PAYMENT
=====================================
*/

export const verifyPaymentApi = async (data) => {
  const response = await axiosClient.post(
    "/payments/verify",
    data
  );

  return response.data;
};