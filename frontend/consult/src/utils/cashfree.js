// src/utils/cashfree.js

/**
 * Cashfree Payment Gateway Integration - Hosted Checkout
 * 
 * This is the SIMPLIFIED approach:
 * - Cashfree handles all payment UI in a popup/redirect
 * - No need to create individual card components
 * - Just pass paymentSessionId and let Cashfree do the rest
 */

let cashfreeInstance = null;

/**
 * Load Cashfree SDK dynamically
 * @returns {Promise<boolean>}
 */
export const loadCashfreeSDK = () => {
  return new Promise((resolve) => {
    // Check if already loaded
    if (window.Cashfree) {
      console.log("Cashfree SDK already loaded");
      resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://sdk.cashfree.com/js/v3/cashfree.js";
    script.onload = () => {
      console.log("Cashfree SDK loaded successfully");
      resolve(true);
    };
    script.onerror = (error) => {
      console.error("Failed to load Cashfree SDK:", error);
      resolve(false);
    };
    document.body.appendChild(script);
  });
};

/**
 * Initialize Cashfree instance
 * @returns {object|null} Cashfree instance
 */
export const initCashfree = () => {
  if (!window.Cashfree) {
    console.error("Cashfree SDK not loaded. Call loadCashfreeSDK first.");
    return null;
  }
  
  if (!cashfreeInstance) {
    const mode = import.meta.env.VITE_CASHFREE_ENVIRONMENT || "sandbox";
    cashfreeInstance = window.Cashfree({ mode });
    console.log(`Cashfree initialized in ${mode} mode`);
  }
  
  return cashfreeInstance;
};

/**
 * Open Cashfree hosted checkout
 * This is the SIMPLE method - Cashfree handles all the UI
 * 
 * @param {object} params
 * @param {string} params.paymentSessionId - Session ID from backend (/payments/create-order)
 * @param {string} params.returnUrl - URL to redirect after payment (e.g., /payment-status?orderId=xxx)
 * @returns {Promise<object>} Payment result
 */
export const openHostedCheckout = async ({ paymentSessionId, returnUrl }) => {
  try {
    // Step 1: Ensure SDK is loaded
    const loaded = await loadCashfreeSDK();
    if (!loaded) {
      throw new Error("Failed to load Cashfree SDK. Please check your internet connection.");
    }

    // Step 2: Initialize Cashfree instance
    const cashfree = initCashfree();
    if (!cashfree) {
      throw new Error("Failed to initialize Cashfree. Please refresh and try again.");
    }

    // Step 3: Open hosted checkout
    // Cashfree handles all payment UI in a popup/redirect
    const result = await cashfree.checkout({
      paymentSessionId: paymentSessionId,
      returnUrl: returnUrl,
    });

    // Step 4: Handle result
    if (result.error) {
      console.error("Cashfree payment error:", result.error);
      return {
        success: false,
        error: result.error.message || "Payment failed. Please try again.",
      };
    }

    // Payment initiated successfully
    // Note: Actual payment confirmation happens via webhook
    return {
      success: true,
      redirect: !!result.redirect,
      paymentDetails: result.paymentDetails || null,
    };
    
  } catch (error) {
    console.error("Cashfree checkout error:", error);
    return {
      success: false,
      error: error.message || "Something went wrong. Please try again.",
    };
  }
};

/**
 * Quick helper for one-click payment initiation
 * Combines SDK loading, initialization, and checkout in one call
 * 
 * @param {string} paymentSessionId - From backend
 * @param {string} orderId - Your internal order ID (for return URL)
 * @returns {Promise<object>}
 */
export const initiateCashfreePayment = async (paymentSessionId, orderId) => {
  const returnUrl = `${window.location.origin}/payment-status?orderId=${orderId}`;
  
  return await openHostedCheckout({
    paymentSessionId,
    returnUrl,
  });
};

export default {
  loadCashfreeSDK,
  initCashfree,
  openHostedCheckout,
  initiateCashfreePayment,
};