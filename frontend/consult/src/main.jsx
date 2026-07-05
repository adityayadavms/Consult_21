import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from "react-router-dom";
import './index.css'
import App from './App.jsx'
import { AuthProvider } from "./context/AuthContext";
import { ResetPasswordProvider } from "./context/ResetPasswordContext.jsx";
import { Toaster } from "react-hot-toast";
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ResetPasswordProvider>
           <Toaster
              position="top-right"
              reverseOrder={false}
              toastOptions={{
                style: {
                  background: "#111827",
                  color: "#fff",
                  border: "1px solid rgba(255,255,255,0.1)"
                }
              }}                      
            />
          <App />
        </ResetPasswordProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
