import { useNavigate } from "react-router-dom";
import "../Pages/consultation.css";

function RefundPolicy() {
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
            <h1 className="consult-title">Refund Policy</h1>
            <p style={{ color: "#9ca3af", marginBottom: "20px" }}>
              <strong>Effective Date:</strong> [Insert Date]
            </p>

            <div className="consult-section">
              <h3>3.1 General Rule</h3>
              <p style={{ color: "#cbd5f5" }}>
                All payments are non-refundable.
              </p>
            </div>

            <div className="consult-section">
              <h3>3.2 Exceptions</h3>
              <ul style={{ color: "#cbd5f5", marginLeft: "20px" }}>
                <li>Service not delivered</li>
                <li>Technical failure</li>
                <li>Duplicate payment</li>
              </ul>
            </div>

            <div className="consult-section">
              <h3>3.3 Processing Time</h3>
              <p style={{ color: "#cbd5f5" }}>
                Refunds processed within 5–7 business days.
              </p>
            </div>

            <div className="consult-section">
              <h3>3.4 No Refund Cases</h3>
              <ul style={{ color: "#cbd5f5", marginLeft: "20px" }}>
                <li>Dissatisfaction with advice</li>
                <li>Incomplete user information</li>
                <li>Change of mind</li>
              </ul>
            </div>

            <div className="consult-section">
              <h3>Contact Information</h3>
              <p style={{ color: "#cbd5f5" }}>
                For refund-related queries: support@consult21.in
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

export default RefundPolicy;