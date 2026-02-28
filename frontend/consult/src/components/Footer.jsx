function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        {/* LEFT SIDE */}
        <div className="footer-left">
          <small>© 2025 Consult21</small>

          <nav>
            <a href="#">Privacy Policy</a> ·{" "}
            <a href="#">Terms</a> ·{" "}
            <a href="#">Refund Policy</a>
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
