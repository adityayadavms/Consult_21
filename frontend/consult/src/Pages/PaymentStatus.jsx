// src/Pages/PaymentStatus.jsx

import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { checkPaymentStatusApi } from "../api/consultationApi";

function PaymentStatus() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("loading"); // loading, success, failed
  const [message, setMessage] = useState("");

  // Get order IDs from URL params
  const orderId = searchParams.get("orderId");        
  const cashfreeOrderId = searchParams.get("order_id"); // Cashfree's order ID

  useEffect(() => {
    const checkPayment = async () => {
      const orderToCheck = orderId || cashfreeOrderId;
      
      if (!orderToCheck) {
        setStatus("failed");
        setMessage("No order information found");
        return;
      }

      try {
        // This API should work WITHOUT authentication
        // Backend will validate using the order ID only
        const result = await checkPaymentStatusApi(orderToCheck);
        
        if (result.success) {
          setStatus("success");
          setMessage("Payment successful! Your consultation has been submitted.");
          toast.success("Payment successful!");
        } else {
          setStatus("failed");
          setMessage(result.message || "Payment verification failed");
          toast.error("Payment verification failed");
        }
      } catch (error) {
        setStatus("failed");
        setMessage(error.response?.data?.message || "Failed to verify payment status");
        toast.error("Failed to verify payment");
      }
    };

    checkPayment();
  }, [orderId, cashfreeOrderId]);

  // Loading state
  if (status === "loading") {
    return (
      <div className="auth-container">
        <div className="auth-card" style={{ textAlign: "center" }}>
          <h2>Verifying Payment...</h2>
          <p>Please wait while we confirm your payment.</p>
          <div className="loading-spinner" style={{ marginTop: "20px" }}>⏳</div>
        </div>
      </div>
    );
  }

  // Success/Failure state
  return (
    <div className="auth-container">
      <div className="auth-card" style={{ textAlign: "center" }}>
        <h2 style={{ color: status === "success" ? "#10b981" : "#ef4444" }}>
          {status === "success" ? "✓ Payment Successful!" : "✗ Payment Failed"}
        </h2>
        
        <p style={{ marginBottom: "20px", color: "#cbd5f5" }}>{message}</p>
        
        <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
          {status === "success" ? (
            <>
              <button
                className="btn-primary"
                onClick={() => {
                  // Try to go to questions, but handle if not logged in
                  const token = localStorage.getItem("accessToken");
                  if (token) {
                    navigate("/questions");
                  } else {
                    navigate("/login");
                  }
                }}
              >
                View My Questions
              </button>
              <button
                className="btn-ghost"
                onClick={() => navigate("/")}
              >
                Go Home
              </button>
            </>
          ) : (
            <>
              <button
                className="btn-primary"
                onClick={() => navigate(-1)}
              >
                Try Again
              </button>
              <button
                className="btn-ghost"
                onClick={() => navigate("/")}
              >
                Go Home
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default PaymentStatus;