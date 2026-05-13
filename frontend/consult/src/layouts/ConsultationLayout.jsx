import { useNavigate } from "react-router-dom";
import "../Pages/consultation.css";

function ConsultationLayout({ children }) {
  const navigate = useNavigate();

  return (
    <div className="consult-layout">

      {/* HEADER */}
      <header className="consult-header">

        <div className="consult-header-inner">

          {/* LEFT — BACK BUTTON */}
          <button
            className="back-btn"
            onClick={() => navigate("/")}
          >
            ← Back
          </button>

          {/* LOGO */}
          <div className="consult-logo">
            Consult21
          </div>

          {/* RIGHT (EMPTY / OPTIONAL PROFILE) */}
          <div />

        </div>

      </header>

      {/* CONTENT */}
      <main className="consult-content">
        {children}
      </main>

    </div>
  );
}

export default ConsultationLayout;