import "./auth.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { resetPasswordApi } from "../api/authApi";
import { useResetPassword } from "../context/ResetPasswordContext";

/*
=================================
PASSWORD STRENGTH CALCULATOR
=================================
*/

function calculatePasswordStrength(password) {

  let score = 0;

  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 2) return "Weak";
  if (score <= 4) return "Medium";
  return "Strong";
}

function ResetPassword() {

  const navigate = useNavigate();
  const { email, otp, clearResetState } = useResetPassword();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [strength, setStrength] = useState("");

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

    if (strength === "Weak") {
      setError("Password is too weak");
      return;
    }

    setLoading(true);
    setError("");

    try {

      await resetPasswordApi(email, otp, password);

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

  /*
  =================================
  PASSWORD INPUT HANDLER
  =================================
  */

  const handlePasswordChange = (e) => {

    const value = e.target.value;

    setPassword(value);
    setStrength(calculatePasswordStrength(value));
    setError("");

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
          onChange={handlePasswordChange}
        />

        {password && (
          <p
            className="password-strength"
            style={{
              color:
                strength === "Weak"
                  ? "red"
                  : strength === "Medium"
                  ? "orange"
                  : "green"
            }}
          >
            Strength: <strong>{strength}</strong>
          </p>
        )}

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
          disabled={loading || strength === "Weak"}
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>

      </div>
    </div>
  );
}

export default ResetPassword;