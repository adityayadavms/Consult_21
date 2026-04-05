import "./auth.css";
import toast from "react-hot-toast";
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

  const handleLogin = async () => {

    setLoading(true);
    setError("");

    const result = await login(email, password);

    setLoading(false);

    if (result.success) {

      toast.success("Login successful ");
      navigate("/");

    } else {

      setError(result.message);
      toast.error(result.message);

    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">

        <h2>Login</h2>

        <input
          className="auth-input"
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

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

        {error && <p className="auth-error">{error}</p>}

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

        <button
          className="auth-btn"
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

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