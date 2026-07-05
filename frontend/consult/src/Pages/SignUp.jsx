import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import "./auth.css";
import { signupApi } from "../api/authApi";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';


function SignUp() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    name: "",
    phone:"",
    password: "",
    confirmPassword: "",
  });
  
  const [showPassword, setShowPassword] = useState(false);
  
  const [errors, setErrors] = useState({});
  
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); 

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

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
  
  const handlePhoneChange = (e) => {

  const value = e.target.value.replace(/\D/g, "");

  setForm({...form,[e.target.name]: value.slice(0, 10), });

  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    let newErrors = {};

    if (!form.email.trim()) newErrors.email = "Email is required.";
    if (!form.name.trim()) newErrors.name = "Name is required.";
    if (!form.phone.trim()) newErrors.phone = "Phone number is required."
    if (!form.password.trim()) newErrors.password = "Password is required.";
    if (!form.confirmPassword.trim()) newErrors.confirm = "Confirm password is required.";
    

    if (form.password) {
      const passwordErrors = validatePassword(form.password);
      newErrors = { ...newErrors, ...passwordErrors };
    }

    if(form.phone){
        if(!/^\d{10}$/.test(form.phone)){
          newErrors.phone = "Phone number must contain exactly 10 digits.";
        }
    }

    if (form.password && form.confirmPassword && form.password !== form.confirmPassword) {
      newErrors.match = "Passwords do not match";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    try {await signupApi({
        email: form.email,
        name: form.name,
        phone:form.phone,
        password: form.password,
      });

      toast.success("Account created successfully ");
      navigate("/login");

    } catch (err) {
      toast.error(
        err.response?.data?.message || "Signup failed"
      );
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Sign Up</h2>

        <form onSubmit={handleSubmit}>
          <input
            className="auth-input"
            type="email"
            placeholder="Enter email"
            name="email"
            value = {form.email}
            onChange={handleChange}
          />
          {errors.email && <p className="auth-error">{errors.email}</p>}
           
           <input
              className="auth-input"
              type="text"
              placeholder="Enter name"
              name="name"
              value= {form.name}
              onChange={handleChange}
            />
          {errors.name && <p className="auth-error">{errors.name}</p>}
          
          <input
              className="auth-input"
              type="text"
              placeholder="Enter Phone Number"
              name="phone"
              value={form.phone}
              onChange={handlePhoneChange}
            />
          {errors.phone && <p className="auth-error">{errors.phone}</p>}
          
          <div className="password-field">
          <input
            className="auth-input"
            type={showPassword ? "text" : "password"}
            placeholder="Enter password"
            name="password"
            value={form.password}
            onChange={handleChange}
          />

          <span
            className="eye-icon"
            onClick={() => setShowPassword(!showPassword)}
          >
          <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} size="sm"/>
          </span>
          </div>
          {errors.password && <p className="auth-error">{errors.password}</p>}

          {Object.values(errors)
            .filter(
              (msg) =>
                msg &&
                ![
                  errors.email,
                  errors.phone,
                  errors.password,
                  errors.confirm,
                  errors.match,
                ].includes(msg)
            )
            .map((msg, i) => (
              <p key={i} className="auth-error">{msg}</p>
            ))}

          <div className="password-field"> 
          <input
            className="auth-input"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
          />
          <span
            className="eye-icon"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
          <FontAwesomeIcon icon={showConfirmPassword ? faEye : faEyeSlash} size="sm"/>
          </span>
          </div>
          {errors.confirm && <p className="auth-error">{errors.confirm}</p>}
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