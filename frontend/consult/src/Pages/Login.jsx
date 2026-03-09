import "./auth.css";
import { useNavigate } from "react-router-dom";
import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

function Login() {

  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [showPassword, setShowPassword] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  /*
  ================================
  HANDLE LOGIN
  ================================
  */

  const handleLogin = async () => {

    setLoading(true);
    setError("");

    const result = await login(email, password);

    setLoading(false);

    if (result.success) {

      navigate("/");

    } else {

      setError(result.message);

    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">

        <h2>Login</h2>

        {/* EMAIL */}
        <input
          className="auth-input"
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* PASSWORD */}
        <div className="password-field">

          <input
            className="auth-input"
            type={showPassword ? "text" : "password"}
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <span
            className="eye-icon"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? "🙈" : "👁"}
          </span>

        </div>

        {/* ERROR MESSAGE */}
        {error && <p className="auth-error">{error}</p>}

        {/* FORGOT PASSWORD */}
        <p
          style={{
            fontSize: "13px",
            marginBottom: "10px",
            cursor: "pointer",
            color: "#ff6a00"
          }}
          onClick={() => navigate("/forgot-password")}
        >
          Forgot Password?
        </p>

        {/* LOGIN BUTTON */}
        <button
          className="auth-btn"
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {/* SIGNUP */}
        <p className="auth-link">
          New user?{" "}
          <span onClick={() => navigate("/signup")}>
            Sign up
          </span>
        </p>

      </div>
    </div>
  );
}

export default Login;