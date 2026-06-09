import { useState, useRef, useEffect } from "react";
import toast from "react-hot-toast";
import { verifyPhoneUpdateApi, resendPhoneOtpApi } from "../api/userApi";

function OtpModal({ onClose, onSuccess, phone }) {

  /*
  ===============================
  OTP STATE (ARRAY)
  ===============================
  */
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);

  const [loading, setLoading] = useState(false);

  /*
  ===============================
  RESEND TIMER
  ===============================
  */
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  /*
  ===============================
  AUTO FOCUS FIRST INPUT
  ===============================
  */
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  /*
  ===============================
  TIMER LOGIC
  ===============================
  */
  useEffect(() => {

    if (timer === 0) {
      setCanResend(true);
      return;
    }

    const interval = setInterval(() => {
      setTimer(prev => prev - 1);
    }, 1000);

    return () => clearInterval(interval);

  }, [timer]);

  /*
  ===============================
  HANDLE INPUT
  ===============================
  */
  const handleChange = (value, index) => {

    if (isNaN(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;

    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  /*
  ===============================
  BACKSPACE HANDLING
  ===============================
  */
  const handleKeyDown = (e, index) => {

    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  /*
  ===============================
  VERIFY OTP
  ===============================
  */
  const handleVerify = async () => {

    const code = otp.join("");

    if (code.length !== 6) {
      toast.error("Enter complete OTP");
      return;
    }

    try {

      setLoading(true);

      const updatedUser = await verifyPhoneUpdateApi(code);

      toast.success("Phone updated successfully");

      onSuccess(updatedUser);
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

  /*
  ===============================
  RESEND OTP
  ===============================
  */
      const handleResend = async () => {

      if (!canResend) return;

      try {

        setResendLoading(true);

        await resendPhoneOtpApi(); //  correct endpoint

        toast.success("OTP resent");

        setTimer(30);
        setCanResend(false);

      } catch {

        toast.error("Failed to resend OTP");

      } finally {
        setResendLoading(false);
      }
    };

  /*
  ===============================
  MASK PHONE
  ===============================
  */
  const maskPhone = (phone) => {
    if (!phone) return "";
    return phone.slice(0, 2) + "******" + phone.slice(-2);
  };

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>

        <h3>Verify OTP</h3>

        <p style={{ marginBottom: "15px", fontSize: "14px" }}>
          OTP sent to {maskPhone(phone)}
        </p>

        {/* OTP INPUTS */}
        <div className="otp-container">

          {otp.map((digit, index) => (

            <input
              key={index}
              maxLength="1"
              value={digit}
              ref={(el) => (inputRefs.current[index] = el)}
              onChange={(e) => handleChange(e.target.value, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className="otp-input"
            />

          ))}

        </div>

        {/* ACTION BUTTONS */}
        <div style={{ display: "flex", gap: "10px", marginTop: "15px" }}>

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

        {/* RESEND */}
        <p className="otp-resend" style={{ marginTop: "10px" }}>

          {canResend ? (

            <span onClick={handleResend}>
              {resendLoading ? "Resending..." : "Resend OTP"}
            </span>

          ) : (

            <span>Resend in {timer}s</span>

          )}

        </p>

      </div>
    </div>
  );
}

/* STYLES */
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
  width: "320px"
};

export default OtpModal;