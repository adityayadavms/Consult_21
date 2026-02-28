import "./auth.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";


function Login() {
  const navigate = useNavigate();
 const { login } = useContext(AuthContext);

  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Login</h2>

        <input
          className="auth-input"
          type="email"
          placeholder="Enter email"
        />

        {/* PASSWORD FIELD WITH EYE */}
        <div className="password-field">
          <input
            className="auth-input"
            type={showPassword ? "text" : "password"}
            placeholder="Enter password"
          />

          <span
            className="eye-icon"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? "🙈" : "👁"}
          </span>
        </div>

        <button
          className="auth-btn"
          onClick={() => {
          login();
          navigate("/");
            }}
         > 
          Login
        </button>


        <p className="auth-link">
          New user? <span onClick={() => navigate("/signup")}>Sign up</span>
        </p>
      </div>
    </div>
  );
}

export default Login;
