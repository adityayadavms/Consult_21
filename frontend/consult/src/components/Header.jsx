import logo from "../assets/logo.svg";
import { useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";


function Header() {
  const navigate = useNavigate();
  const { isLoggedIn, logout } = useContext(AuthContext);
  const [open, setOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="container header-inner">
        {/* Logo */}
        <div className="logo">
          <img src={logo} alt="Consult21 logo" />
        </div>

        {/* Navigation */}
        <nav className="nav">
          <a href="#home">Home</a>
          <a href="#about">About</a>
          <a href="#services">Services</a>
          <a href="#consult" className="btn-outline">
            Consult Now
          </a>
          {!isLoggedIn ? (
          <a href="/login" className="btn-login">
                      Login / Signup
          </a>
         ) : (
        <div className="profile-menu">
        <div className="profile-icon" onClick={() => setOpen(!open)}>
        👤
        </div>

        {open && (
        <div className="dropdown">
        <p>Profile</p>
        <p>My Questions</p>
        <p className="logout" onClick={logout}>
          Logout
        </p>
      </div>
         )}
      </div>
         )}

          
        </nav>
      </div>
    </header>
  );
}

export default Header;