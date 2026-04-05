import { useState } from "react";
import toast from "react-hot-toast";
import { verifyPhoneUpdateApi } from "../api/userApi";

function OtpModal({ onClose, onSuccess }) {

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {

    if (otp.length !== 6) {
      toast.error("Enter valid 6-digit OTP");
      return;
    }

    try {

      setLoading(true);

      const updatedUser = await verifyPhoneUpdateApi(otp);

      toast.success("Phone updated successfully");

      onSuccess(updatedUser); // update context
      onClose();

    } catch (err) {

      toast.error(
        err.response?.data?.message ||
        "Invalid OTP"
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>

        <h3>Verify OTP</h3>

        <input
          type="text"
          maxLength="6"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className="auth-input"
          placeholder="Enter OTP"
        />

        <div style={{ display: "flex", gap: "10px" }}>

          <button
            className="btn-primary"
            onClick={handleVerify}
            disabled={loading}
          >
            {loading ? "Verifying..." : "Verify"}
          </button>

          <button
            className="btn-ghost"
            onClick={onClose}
          >
            Cancel
          </button>

        </div>

      </div>
    </div>
  );
}

/* SIMPLE MODAL STYLES */
const overlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: "rgba(0,0,0,0.6)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000
};

const modalStyle = {
  background: "#111827",
  padding: "25px",
  borderRadius: "15px",
  width: "300px"
};

export default OtpModal;