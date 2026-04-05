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


/*
=====================================
SUBMIT PROPER CONSULTATION
=====================================
*/
export const submitConsultationApi = async (data) => {
  const response = await axiosClient.post(
    "/consultations",
    data
  );

  return response.data;
};

/*
=====================================
CREATE PAYMENT ORDER
=====================================
*/
export const createPaymentOrderApi = async (consultationId) => {
  const response = await axiosClient.post(
    "/payments/create-order",
    { consultationId }
  );

  return response.data;
};