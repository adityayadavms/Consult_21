import "./auth.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { resetPasswordApi } from "../api/passwordApi";
import { useResetPassword } from "../context/ResetPasswordContext";

function ResetPassword() {

  const navigate = useNavigate();

  const { email, otp, clearResetState } = useResetPassword();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  /*
  =================================
  PROTECT ROUTE
  =================================
  */

  useEffect(() => {

    if (!email || !otp) {
      navigate("/forgot-password");
    }

  }, [email, otp, navigate]);

  /*
  =================================
  HANDLE RESET PASSWORD
  =================================
  */

  const handleReset = async () => {

    if (!password || !confirmPassword) {
      setError("All fields are required");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    setError("");

    try {

      await resetPasswordApi(email, otp, password);

      /*
      Clear reset flow state
      */

      clearResetState();

      navigate("/login");

    } catch (err) {

      setError(
        err.response?.data?.message ||
        "Failed to reset password"
      );

    } finally {
      setLoading(false);
    }

  };

  return (
    <div className="auth-container">
      <div className="auth-card">

        <h2>Reset Password</h2>

        <p style={{ marginBottom: "20px", fontSize: "14px" }}>
          Enter your new password.
        </p>

        <input
          type="password"
          className="auth-input"
          placeholder="New password"
          value={password}
          onChange={(e)=>setPassword(e.target.value)}
        />

        <input
          type="password"
          className="auth-input"
          placeholder="Confirm password"
          value={confirmPassword}
          onChange={(e)=>setConfirmPassword(e.target.value)}
        />

        {error && (
          <p className="auth-error">{error}</p>
        )}

        <button
          className="auth-btn"
          onClick={handleReset}
          disabled={loading}
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>

      </div>
    </div>
  );
}

export default ResetPassword;