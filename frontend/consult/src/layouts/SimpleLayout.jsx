// src/layouts/SimpleLayout.jsx

import { useNavigate } from "react-router-dom";
import "../Pages/consultation.css";

function SimpleLayout({ children, title, showBack = true }) {
  const navigate = useNavigate();

  return (
    <div className="consult-layout">
      {/* HEADER */}
      <header className="consult-header">
        <div className="consult-header-inner">
          {/* LEFT — BACK BUTTON */}
          {showBack && (
            <button
              className="back-btn"
              onClick={() => navigate(-1)}
            >
              ← Back
            </button>
          )}
          
          {!showBack && <div />}

          {/* LOGO CENTERED */}
          <div className="consult-logo">
            Consult21
          </div>

          {/* RIGHT — EMPTY FOR BALANCE */}
          <div />
        </div>
      </header>

      {/* CONTENT */}
      <main className="consult-content">
        {title && (
          <div className="consult-container" style={{ paddingBottom: "0" }}>
            <h1 className="consult-title" style={{ marginBottom: "10px" }}>
              {title}
            </h1>
          </div>
        )}
        {children}
      </main>
    </div>
  );
}

export default SimpleLayout;