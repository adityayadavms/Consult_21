import "./auth.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { forgotPasswordApi } from "../api/authApi";

function ForgotPassword() {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  /*
  ===============================
  HANDLE SUBMIT
  ===============================
  */

  const handleSubmit = async () => {

    if (!email) {
      setError("Email is required");
      return;
    }

    setLoading(true);
    setError("");

    try {

      await forgotPasswordApi(email);

      /*
      Store email temporarily
      Used for OTP verification step
      */

      sessionStorage.setItem("resetEmail", email);

      navigate("/verify-otp");

    } catch (err) {

      setError(
        err.response?.data?.message ||
        "Failed to send OTP"
      );

    } finally {
      setLoading(false);
    }

  };

  return (
    <div className="auth-container">
      <div className="auth-card">

        <h2>Forgot Password</h2>

        <p style={{marginBottom:"20px",fontSize:"14px"}}>
          Enter your registered email.  
          We will send you an OTP to reset your password.
        </p>

        <input
          className="auth-input"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
        />

        {error && (
          <p className="auth-error">{error}</p>
        )}

        <button
          className="auth-btn"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Sending OTP..." : "Send OTP"}
        </button>

        <p className="auth-link">
          Remember your password?{" "}
          <span onClick={()=>navigate("/login")}>
            Login
          </span>
        </p>

      </div>
    </div>
  );
}

export default ForgotPassword;