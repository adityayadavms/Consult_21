import { useNavigate } from "react-router-dom";
import "../Pages/consultation.css";

function TermsConditions() {
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
            <h1 className="consult-title">Terms & Conditions</h1>
            <p style={{ color: "#9ca3af", marginBottom: "20px" }}>
              <strong>Effective Date:</strong> [Insert Date]
            </p>

            <div className="consult-section">
              <h3>2.1 Service Nature</h3>
              <p style={{ color: "#cbd5f5" }}>
                Consult21 provides general advice related to life decisions, career guidance, 
                relationships, and education. This advice is based on experience and general knowledge.
              </p>
            </div>

            <div className="consult-section">
              <h3>2.2 No Professional Liability</h3>
              <ul style={{ color: "#cbd5f5", marginLeft: "20px" }}>
                <li>Advice is for informational purposes only</li>
                <li>We are not liable for decisions made</li>
                <li>Users should consult licensed professionals where needed</li>
              </ul>
            </div>

            <div className="consult-section">
              <h3>2.3 User Responsibility</h3>
              <ul style={{ color: "#cbd5f5", marginLeft: "20px" }}>
                <li>Provide accurate information</li>
                <li>Do not misuse the platform</li>
                <li>Avoid illegal or harmful queries</li>
              </ul>
            </div>

            <div className="consult-section">
              <h3>2.4 Payments</h3>
              <ul style={{ color: "#cbd5f5", marginLeft: "20px" }}>
                <li>All payments must be made upfront (₹21 + GST)</li>
                <li>Payments are processed via secure gateways</li>
              </ul>
            </div>

            <div className="consult-section">
              <h3>2.5 Intellectual Property</h3>
              <p style={{ color: "#cbd5f5" }}>
                All content belongs to Consult21 and cannot be reused without permission.
              </p>
            </div>

            <div className="consult-section">
              <h3>2.6 Account Suspension</h3>
              <p style={{ color: "#cbd5f5" }}>
                We reserve the right to suspend users or reject inappropriate queries.
              </p>
            </div>

            <div className="consult-section">
              <h3>Disclaimer</h3>
              <ul style={{ color: "#cbd5f5", marginLeft: "20px" }}>
                <li>No guarantee of outcomes</li>
                <li>Advice is subjective</li>
                <li>Not a substitute for professionals</li>
              </ul>
            </div>

            <div className="consult-section">
              <h3>Updates</h3>
              <p style={{ color: "#cbd5f5" }}>
                Policies may be updated anytime. Continued use means acceptance.
              </p>
            </div>

            <div className="consult-section">
              <h3>Contact Information</h3>
              <p style={{ color: "#cbd5f5" }}>
                Email: support@consult21.in<br />
                Location: India
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

export default TermsConditions;