import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from "react-router-dom";
import './index.css'
import App from './App.jsx'
import { AuthProvider } from "./context/AuthContext";
import { ResetPasswordProvider } from "./context/ResetPasswordContext.jsx";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ResetPasswordProvider>
          <App />
        </ResetPasswordProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
