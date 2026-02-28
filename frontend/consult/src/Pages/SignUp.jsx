import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./auth.css";

function SignUp() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});

  /* =========================
     HANDLE INPUT CHANGE
  ========================= */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /* =========================
     PASSWORD VALIDATION FUNCTION
  ========================= */
  const validatePassword = (password) => {
    const error = {};

    if (!/[A-Z]/.test(password))
      error.upper = "At least one uppercase letter required";

    if (!/[a-z]/.test(password))
      error.lower = "At least one lowercase letter required";

    if (!/[0-9]/.test(password))
      error.number = "At least one number required";

    if (!/[!@#$%^&*()_+]/.test(password))
      error.special = "At least one special character required";

    return error;
  };

  /* =========================
     FORM SUBMIT
  ========================= */
  const handleSubmit = (e) => {
    e.preventDefault();

    let newErrors = {};

    /* ---------- REQUIRED FIELD CHECK ---------- */

    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    }

    if (!form.password.trim()) {
      newErrors.password = "Password is required";
    }

    if (!form.confirmPassword.trim()) {
      newErrors.confirm = "Confirm password is required";
    }

    /* ---------- PASSWORD RULES ---------- */

    if (form.password) {
      const passwordErrors = validatePassword(form.password);
      newErrors = { ...newErrors, ...passwordErrors };
    }

    /* ---------- PASSWORD MATCH ---------- */

    if (
      form.password &&
      form.confirmPassword &&
      form.password !== form.confirmPassword
    ) {
      newErrors.match = "Passwords do not match";
    }

    setErrors(newErrors);

    /* ---------- SUCCESS ---------- */

    if (Object.keys(newErrors).length === 0) {
      alert("Signup Successful 🎉");
      navigate("/login");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Sign Up</h2>

        <form onSubmit={handleSubmit}>
          {/* EMAIL */}
          <input
            className="auth-input"
            type="email"
            placeholder="Enter email"
            name="email"
            onChange={handleChange}
          />
          {errors.email && <p className="auth-error">{errors.email}</p>}

          {/* PASSWORD */}
          <input
            className="auth-input"
            type="password"
            placeholder="Enter password"
            name="password"
            onChange={handleChange}
          />
          {errors.password && <p className="auth-error">{errors.password}</p>}

          {/* PASSWORD RULE ERRORS */}
          {Object.values(errors)
            .filter(
              (msg) =>
                msg &&
                ![
                  errors.email,
                  errors.password,
                  errors.confirm,
                  errors.match,
                ].includes(msg)
            )
            .map((msg, i) => (
              <p key={i} className="auth-error">
                {msg}
              </p>
            ))}

          {/* CONFIRM PASSWORD */}
          <input
            className="auth-input"
            type="password"
            placeholder="Confirm password"
            name="confirmPassword"
            onChange={handleChange}
          />
          {errors.confirm && (
            <p className="auth-error">{errors.confirm}</p>
          )}

          {errors.match && <p className="auth-error">{errors.match}</p>}

          <button className="auth-btn">Create Account</button>
        </form>

        <p className="auth-link">
          Already have an account?
          <span onClick={() => navigate("/login")}> Login</span>
        </p>
      </div>
    </div>
  );
}

export default SignUp;
