import logo from "../assets/logo.svg";
import { useNavigate } from "react-router-dom";
import { useContext, useState, useRef, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";

function Header() {

  const navigate = useNavigate();
  const { isLoggedIn, logout, user } = useContext(AuthContext);
  
  const [mobileOpen, setMobileOpen] = useState(false);

  const [open, setOpen] = useState(false);

  const dropdownRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate("/");
  };
  
 

  const getInitials = (name) => {
    if (!name) return "?";
    const names = name.split(" ");
    const initials = names.map(n => n[0]).join("");
    return initials.slice(0, 2).toUpperCase();
  };

  /*
  =================================
  CLOSE DROPDOWN WHEN CLICK OUTSIDE
  =================================
  */

  useEffect(() => {

    const handleClickOutside = (event) => {

      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setOpen(false);
      }

    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };

  }, []);

  return (
    <header className="site-header">

      <div className="container header-inner">

        {/* Logo */}
        <div
          className="logo"
          onClick={() => navigate("/")}
          style={{ cursor: "pointer" }}
        >
          <img src={logo} alt="Consult21 logo" />
        </div>

        {/* Navigation */}
        <nav className={`nav ${mobileOpen ? "open" : ""}`}>

          <a href="#home">Home</a>
          <a href="#about">About</a>
          <a href="#services">Services</a>

          <button
            className="btn-outline"
            onClick={() => navigate("/consult")}
          >
            Consult Now
          </button>
          
          <div
              className="hamburger"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              ☰
          </div>

          {!isLoggedIn ? (

            <button
              className="btn-login"
              onClick={() => navigate("/login")}
            >
              Login / Signup
            </button>

          ) : (

            <div className="profile-menu" ref={dropdownRef}>

                <div
                  className="profile-avatar"
                  onClick={() => setOpen(!open)}
                >
                  {getInitials(user?.name)}
                </div>

                <div className={`dropdown ${open ? "show" : ""}`}>

                    <p onClick={() => navigate("/profile")}>
                      My Profile
                    </p>

                    <p onClick={() => navigate("/questions")}>
                      My Questions
                    </p>

                    <p
                      className="logout"
                      onClick={handleLogout}
                    >
                      Logout
                    </p>

                  </div>

            </div>

          )}

        </nav>

      </div>

    </header>
  );
}

export default Header;