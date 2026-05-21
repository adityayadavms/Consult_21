import { useNavigate } from "react-router-dom";
import "../Pages/consultation.css";

function PrivacyPolicy() {
  const navigate = useNavigate();

  return (
    <div className="consult-layout">
      <header className="consult-header">
        <div className="consult-header-inner">
          <button className="back-btn" onClick={() => navigate("/")}>
            ← Back
          </button>
          <div className="consult-logo">Consult21</div>
          <div />
        </div>
      </header>

      <main className="consult-content">
        <div className="consult-container">
          <div className="consult-card">
            <h1 className="consult-title">Privacy Policy</h1>
            <p style={{ color: "#9ca3af", marginBottom: "20px" }}>
              <strong>Effective Date:</strong> [Insert Date]
            </p>

            <div className="consult-section">
              <h3>1.1 Information We Collect</h3>
              <ul style={{ color: "#cbd5f5", marginLeft: "20px" }}>
                <li>Name, email address, phone number</li>
                <li>Payment details (processed securely via third-party gateways)</li>
                <li>User queries submitted for advice</li>
                <li>Device/browser data for analytics</li>
              </ul>
            </div>

            <div className="consult-section">
              <h3>1.2 How We Use Information</h3>
              <ul style={{ color: "#cbd5f5", marginLeft: "20px" }}>
                <li>To provide consultation services</li>
                <li>To improve user experience</li>
                <li>To process payments</li>
                <li>To communicate updates or support</li>
              </ul>
            </div>

            <div className="consult-section">
              <h3>1.3 Data Protection</h3>
              <p style={{ color: "#cbd5f5" }}>
                We implement appropriate security measures to safeguard your data. 
                However, no online platform can guarantee 100% security.
              </p>
            </div>

            <div className="consult-section">
              <h3>1.4 Third-Party Services</h3>
              <p style={{ color: "#cbd5f5" }}>
                We may use third-party tools (payment gateways, analytics tools) 
                which have their own privacy policies.
              </p>
            </div>

            <div className="consult-section">
              <h3>1.5 User Rights</h3>
              <ul style={{ color: "#cbd5f5", marginLeft: "20px" }}>
                <li>Access to your data</li>
                <li>Correction of inaccurate data</li>
                <li>Deletion of your data (subject to legal requirements)</li>
              </ul>
            </div>

            <div className="consult-section">
              <h3>1.6 Contact Information</h3>
              <p style={{ color: "#cbd5f5" }}>
                Email: support@consult21.in
              </p>
            </div>

            <div style={{ marginTop: "30px", paddingTop: "20px", borderTop: "1px solid #1f2937", color: "#6b7280", fontSize: "12px", textAlign: "center" }}>
              © 2026 Consult21. All Rights Reserved.<br />
              Operated by <strong>Sellosure OPC Private Limited</strong>.
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default PrivacyPolicy;