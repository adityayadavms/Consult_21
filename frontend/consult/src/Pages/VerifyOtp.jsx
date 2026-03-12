import "./auth.css";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { verifyOtpApi, resendOtpApi } from "../api/authApi";
import { useResetPassword } from "../context/ResetPasswordContext";

const MAX_ATTEMPTS = 5;
const LOCK_DURATION = 60;

function VerifyOtp() {

  const navigate = useNavigate();
  const { email, setOtp } = useResetPassword();

  const [otp, setOtpInput] = useState(["","","","","",""]);
  const [error, setError] = useState("");

  const [attempts, setAttempts] = useState(0);
  const [locked, setLocked] = useState(false);
  const [lockTimer, setLockTimer] = useState(0);

  const [loading, setLoading] = useState(false);

  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  const inputRefs = useRef([]);

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
  AUTO FOCUS FIRST INPUT
  =================================
  */

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  /*
  =================================
  RESEND TIMER
  =================================
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
  =================================
  LOCK TIMER (OTP RATE LIMIT)
  =================================
  */

  useEffect(() => {

    if (!locked) return;

    const interval = setInterval(() => {
      setLockTimer(prev => {

        if (prev <= 1) {
          clearInterval(interval);
          setLocked(false);
          setAttempts(0);
          return 0;
        }

        return prev - 1;

      });
    }, 1000);

    return () => clearInterval(interval);

  }, [locked]);

  /*
  =================================
  HANDLE OTP INPUT
  =================================
  */

  const handleChange = (element, index) => {

    if (isNaN(element.value)) return;

    const newOtp = [...otp];
    newOtp[index] = element.value;

    setOtpInput(newOtp);

    if (element.value && index < 5) {
      inputRefs.current[index + 1].focus();
    }

  };

  /*
  =================================
  BACKSPACE NAVIGATION
  =================================
  */

  const handleKeyDown = (e, index) => {

    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }

  };

  /*
  =================================
  PASTE OTP SUPPORT
  =================================
  */

  const handlePaste = (e) => {

    const paste = e.clipboardData.getData("text").trim();

    if (!/^\d{6}$/.test(paste)) return;

    const digits = paste.split("");

    setOtpInput(digits);

    digits.forEach((digit, index) => {
      inputRefs.current[index].value = digit;
    });

  };

  /*
  =================================
  VERIFY OTP
  =================================
  */

  const handleVerify = async () => {

    if (locked) return;

    const code = otp.join("");

    if (code.length !== 6) {
      setError("Please enter complete OTP");
      return;
    }

    setLoading(true);
    setError("");

    try {

      await verifyOtpApi(email, code);

      setOtp(code);

      navigate("/reset-password");

    } catch (err) {

      setError(
        err.response?.data?.message ||
        "Invalid OTP"
      );

      const newAttempts = attempts + 1;
      setAttempts(newAttempts);

      if (newAttempts >= MAX_ATTEMPTS) {
        setLocked(true);
        setLockTimer(LOCK_DURATION);
      }

    } finally {

      setLoading(false);

    }

  };

  /*
  =================================
  RESEND OTP
  =================================
  */

  const handleResend = async () => {

    if (!canResend) return;

    try {

      setResendLoading(true);

      await resendOtpApi(email);

      setTimer(60);
      setCanResend(false);

    } catch {

      setError("Failed to resend OTP");

    } finally {

      setResendLoading(false);

    }

  };

  return (
    <div className="auth-container">
      <div className="auth-card">

        <h2>Verify OTP</h2>

        <p style={{ marginBottom: "20px", fontSize: "14px" }}>
          Enter the 6-digit code sent to your email.
        </p>

        <div className="otp-container" onPaste={handlePaste}>

          {otp.map((data, index) => (

            <input
              key={index}
              type="text"
              maxLength="1"
              className="otp-input"
              value={data}
              ref={(el) => (inputRefs.current[index] = el)}
              onChange={(e) => handleChange(e.target, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              disabled={locked}
            />

          ))}

        </div>

        {error && (
          <p className="auth-error">{error}</p>
        )}

        {locked && (
          <p className="auth-error">
            Too many attempts. Try again in {lockTimer}s
          </p>
        )}

        <button
          className="auth-btn"
          onClick={handleVerify}
          disabled={locked || loading || otp.join("").length !== 6}
        >
          {loading ? "Verifying..." : "Verify OTP"}
        </button>

        <p className="otp-resend">

          {canResend ? (

            <span
              onClick={handleResend}
              style={{ cursor: "pointer", color: "#2563eb" }}
            >
              {resendLoading ? "Resending..." : "Resend OTP"}
            </span>

          ) : (

            <span>
              Resend in {timer}s
            </span>

          )}

        </p>

      </div>
    </div>
  );
}

export default VerifyOtp;