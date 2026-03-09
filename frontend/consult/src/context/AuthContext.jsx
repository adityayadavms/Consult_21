import { createContext, useState, useEffect } from "react";
import { loginApi, logoutApi } from "../api/authApi";

export const AuthContext = createContext();

export function AuthProvider({ children }) {

  /*
  =====================================
  AUTH STATE
  =====================================
  */

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  /*
  =====================================
  CHECK TOKEN ON APP LOAD
  =====================================
  */

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    if (token) {
      setIsLoggedIn(true);
    }

    setLoading(false);
  }, []);

  /*
  =====================================
  LOGIN FUNCTION
  =====================================
  */

  const login = async (email, password) => {
    try {

      await loginApi({
        email,
        password
      });

      setIsLoggedIn(true);

      return {
        success: true
      };

    } catch (error) {

      return {
        success: false,
        message: error.response?.data?.message || "Login failed"
      };
    }
  };

  /*
  =====================================
  LOGOUT FUNCTION
  =====================================
  */

  const logout = () => {

    logoutApi();

    setIsLoggedIn(false);

  };

  /*
  =====================================
  CONTEXT PROVIDER
  =====================================
  */

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        login,
        logout,
        loading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}