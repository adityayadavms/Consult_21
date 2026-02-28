import { Routes, Route } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";
import AuthLayout from "./layouts/AuthLayout";

import HeroSection from "./components/HeroSection";
import Services from "./components/Services";
import About from "./components/About";
import HowItWorks from "./components/HowItWorks";
import Footer from "./components/Footer";

import Login from "./Pages/Login";
import Signup from "./Pages/SignUp";

import services from "./data/services.json";

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

    </Routes>
  );
}

export default App;
