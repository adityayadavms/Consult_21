import { Link } from "react-router-dom";  
function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        {/* LEFT SIDE */}
        <div className="footer-left">
          <small>© 2025 Consult21</small>

          <nav>
           <Link to="/privacy-policy">Privacy Policy</Link> ·{" "}
            <Link to="/terms">Terms</Link> ·{" "}
            <Link to="/refund-policy">Refund Policy</Link>
          </nav>
        </div>

        {/* RIGHT SIDE */}
        <div className="footer-right">
          <p>For support, contact:</p>
          <p>Email- support@consult21.in</p>
          <p>Mobile No.- +91-8017842478</p>
          <p>Kolkata, India</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
