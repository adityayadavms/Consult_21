import { Routes, Route } from "react-router-dom";
import MyQuestions from "./Pages/MyQuestions";
import MainLayout from "./layouts/MainLayout";
import AuthLayout from "./layouts/AuthLayout";
import ConsultationFormPage from "./Pages/ConsultationFormPage";
import HeroSection from "./components/HeroSection";
import Services from "./components/Services";
import About from "./components/About";
import HowItWorks from "./components/HowItWorks";
import Footer from "./components/Footer";
import VerifyOtp from "./Pages/VerifyOtp";
import Login from "./Pages/Login";
import Signup from "./Pages/SignUp";
import ForgotPassword from "./Pages/ForgotPassword";
import services from "./data/services.json";
import ProtectedRoute from "./routes/ProtectedRoutes";
import Profile from "./Pages/Profile";
import ConsultationLayout from "./layouts/ConsultationLayout";
import SimpleLayout from "./layouts/SimpleLayout";
import PrivacyPolicy from "./Pages/PrivacyPolicy";
import TermsConditions from "./Pages/TermsConditions";
import RefundPolicy from "./Pages/RefundPolicy";
import PaymentStatus from "./Pages/PaymentStatus";
import ResetPassword from "./Pages/ResetPassword";

function HomePage() {
  return (
    <>
      <HeroSection services={services} />
      <Services services={services} />
      <About />
      <HowItWorks />
      <Footer />
    </>
  );
}

function App() {
  return (
    <Routes>

      {/* HOME PAGE WITH HEADER */}
      <Route
        path="/"
        element={
          <MainLayout>
            <HomePage />
          </MainLayout>
        }
      />

      {/* AUTH PAGES WITHOUT HEADER */}
      <Route
        path="/login"
        element={
          <AuthLayout>
            <Login />
          </AuthLayout>
        }
      />

      <Route
        path="/signup"
        element={
          <AuthLayout>
            <Signup />
          </AuthLayout>
        }
      />

      <Route
        path="/forgot-password"
        element={
        <AuthLayout>
          <ForgotPassword />
        </AuthLayout>
        }
      />

      <Route
      path="/verify-otp"
      element={
        <AuthLayout>
          <VerifyOtp />
        </AuthLayout>
      }
      />

      <Route
          path="/reset-password"
          element={
            <AuthLayout>
              <ResetPassword />
            </AuthLayout>
          }
        />
      
      <Route
        path="/questions"
        element={
          <ProtectedRoute>
            
              <MyQuestions />
            
          </ProtectedRoute>
        }
      />

          <Route
        path="/consult/:categoryId"
        element={
          <ProtectedRoute>
            <ConsultationLayout>
              <ConsultationFormPage />
            </ConsultationLayout>
          </ProtectedRoute>
        }
      />
      
      
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            
              <Profile />
            
          </ProtectedRoute>
        }
      />

      <Route 
      path="/payment-status" e
      lement={
      <PaymentStatus />
      } 
      />

      <Route 
      path="/privacy-policy" 
      element={<PrivacyPolicy />} 
      />

      <Route 
      path="/terms" 
      element={<TermsConditions />} 
      />

      <Route 
      path="/refund-policy" 
      element={<RefundPolicy />} 
      />

    </Routes>
  );
}

export default App;
