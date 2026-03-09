import "./auth.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function VerifyOtp() {

  const navigate = useNavigate();

  const [otp, setOtp] = useState(["","","","","",""]);
  const [error, setError] = useState("");

  const handleChange = (element, index) => {

    if (isNaN(element.value)) return;

    let newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    if (element.nextSibling) {
      element.nextSibling.focus();
    }

  };

  const handleVerify = async () => {

    const code = otp.join("");

    if (code.length !== 6) {
      setError("Please enter complete OTP");
      return;
    }

    try {

      // verify otp API will go here

      navigate("/reset-password");

    } catch (err) {

      setError("Invalid OTP");

    }

  };

  return (
    <div className="auth-container">
      <div className="auth-card">

        <h2>Verify OTP</h2>

        <p style={{marginBottom:"20px",fontSize:"14px"}}>
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
                onChange={e => handleChange(e.target, index)}
              />
            );
          })}
        </div>

        {error && <p className="auth-error">{error}</p>}

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