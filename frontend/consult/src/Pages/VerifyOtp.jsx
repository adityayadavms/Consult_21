import "./auth.css";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { verifyOtpApi } from "../api/passwordApi";

function VerifyOtp() {

  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email;

  const [otp, setOtp] = useState(["","","","","",""]);
  const [error, setError] = useState("");

  /*
  =================================
  PROTECT ROUTE
  =================================
  */

  useEffect(() => {
    if (!email) {
      navigate("/forgot-password");
    }
  }, [email, navigate]);

  /*
  =================================
  HANDLE OTP INPUT
  =================================
  */

  const handleChange = (element, index) => {

    if (isNaN(element.value)) return;

    const newOtp = [...otp];
    newOtp[index] = element.value;

    setOtp(newOtp);

    if (element.value && element.nextSibling) {
      element.nextSibling.focus();
    }

  };

  /*
  =================================
  VERIFY OTP
  =================================
  */

  const handleVerify = async () => {

    const code = otp.join("");

    if (code.length !== 6) {
      setError("Please enter complete OTP");
      return;
    }

    try {

      await verifyOtpApi(email, code);

      navigate("/reset-password", {
        state: {
          email,
          otp: code
        }
      });

    } catch (err) {

      setError(
        err.response?.data?.message ||
        "Invalid OTP"
      );

    }

  };

  return (
    <div className="auth-container">
      <div className="auth-card">

        <h2>Verify OTP</h2>

        <p style={{ marginBottom: "20px", fontSize: "14px" }}>
          Enter the 6-digit code sent to your email.
        </p>

        <div className="otp-container">

          {otp.map((data, index) => {

            return (
              <input
                key={index}
                type="text"
                maxLength="1"
                className="otp-input"
                value={data}
                onChange={(e) => handleChange(e.target, index)}
              />
            );

          })}

        </div>

        {error && (
          <p className="auth-error">{error}</p>
        )}

        <button
          className="auth-btn"
          onClick={handleVerify}
        >
          Verify OTP
        </button>

        <p className="otp-resend">
          Didn't receive the code? <span>Resend OTP</span>
        </p>

      </div>
    </div>
  );
}

export default VerifyOtp;