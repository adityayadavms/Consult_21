import "./auth.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { forgotPasswordApi } from "../api/passwordApi";

function ForgotPassword() {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  /*
  ==============================
  HANDLE SUBMIT
  ==============================
  */

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (!email) {
      setError("Email is required");
      return;
    }

    try {

      setLoading(true);
      setError("");

      await forgotPasswordApi(email);

      /*
      ====================================
      PASS EMAIL TO VERIFY OTP PAGE
      ====================================
      */

      navigate("/verify-otp", {
        state: { email }
      });

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

        <p style={{ marginBottom: "20px", fontSize: "14px" }}>
          Enter your registered email to receive an OTP.
        </p>

        <form onSubmit={handleSubmit}>

          <input
            className="auth-input"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {error && <p className="auth-error">{error}</p>}

          <button
            className="auth-btn"
            disabled={loading}
          >
            {loading ? "Sending OTP..." : "Send OTP"}
          </button>

        </form>

      </div>
    </div>
  );
}

export default ForgotPassword;