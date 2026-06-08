// src/api/consultationApi.js

import axiosClient from "./axiosClient";

// =====================================
// QUICK CONSULTATION - Create Consultation
// =====================================
export const createQuickConsultationApi = async (data) => {
  const response = await axiosClient.post(
    "/quick-consultation/create-order",
    data
  );
  
  // Response wrapper: ApiResponseDto<QuickConsultationResponseDto>
  // data = { consultationId, message }
  return response.data.data;
};

// =====================================
// FULL CONSULTATION - Submit Form
// =====================================
export const submitConsultationApi = async (data) => {
  const response = await axiosClient.post(
    "/consultations",
    data
  );
  
  // Response wrapper: ApiResponseDto<SubmitConsultationResponseDto>
  // data = { consultationId, message }
  return response.data.data;
};

// =====================================
// CREATE CASHFREE PAYMENT ORDER
// =====================================
/**
 * Create payment order for a consultation
 * @param {number} consultationId - ID from consultation creation
 * @param {string} idempotencyKey - UUID to prevent duplicate orders
 * @returns {Promise<{orderId: string, paymentSessionId: string}>}
 */
export const createPaymentOrderApi = async (consultationId, idempotencyKey) => {
  const response = await axiosClient.post(
    "/payments/create-order",
    { consultationId },
    {
      headers: {
        "Idempotency-Key": idempotencyKey,
      },
    }
  );
  
  // Response wrapper: ApiResponseDto<CreateOrderResponseDto>
  // data = { orderId, paymentSessionId }
  return response.data.data;
};

// =====================================
// CHECK PAYMENT STATUS (for redirect page)
// =====================================
/**
 * Check payment status after Cashfree redirect
 * @param {string} orderId - Internal order ID or Cashfree order ID
 * @returns {Promise<{success: boolean, message: string, status?: string}>}
 */
export const checkPaymentStatusApi = async (orderId) => {
  // Option 1: If your backend has a status endpoint
  try {
    const response = await axiosClient.get(`/payments/status/${orderId}`);
    return response.data.data;
  } catch (error) {
    // Option 2: If no status endpoint, we can check via consultation
    // The webhook would have updated the payment status
    console.error("Failed to check payment status:", error);
    throw error;
  }
};

// =====================================
// GET PAYMENT ORDER DETAILS
// =====================================
/**
 * Get payment order details by consultation ID
 * @param {number} consultationId 
 * @returns {Promise<object>}
 */
export const getPaymentOrderApi = async (consultationId) => {
  const response = await axiosClient.get(`/payments/consultation/${consultationId}`);
  return response.data.data;
};

// =====================================
// CHECK PAYMENT STATUS VIA CONSULTATION
// =====================================
/**
 * Check if payment was successful by fetching consultation status
 * @param {number} consultationId 
 * @returns {Promise<{success: boolean, message: string, isPaid: boolean}>}
 */
export const checkConsultationPaymentStatus = async (consultationId) => {
  try {
    // You may need to add a GET endpoint in your backend
    // GET /consultations/{consultationId}/payment-status
    const response = await axiosClient.get(`/consultations/${consultationId}/payment-status`);
    return {
      success: true,
      isPaid: response.data.data?.isPaid || false,
      message: response.data.message,
    };
  } catch (error) {
    // If endpoint doesn't exist, user can check "My Questions" page
    console.error("Payment status check failed:", error);
    return {
      success: false,
      isPaid: false,
      message: "Unable to verify payment status. Please check My Questions page.",
    };
  }
};