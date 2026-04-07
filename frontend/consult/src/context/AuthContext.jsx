import { createContext, useState, useEffect } from "react";
import { loginApi, logoutApi } from "../api/authApi";
import { getCurrentUserApi } from "../api/userApi";

export const AuthContext = createContext();

export function AuthProvider({ children }) {

  /*
  =====================================
  AUTH STATE
  =====================================
  */
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  /*
  =====================================
  INIT AUTH (APP LOAD)
  =====================================
  */
  useEffect(() => {

    const initAuth = async () => {

      const token = localStorage.getItem("accessToken");

      if (!token) {
        setLoading(false);
        return;
      }

      try {

        const userData = await getCurrentUserApi();

        setUser(userData);
        setIsLoggedIn(true);

      } catch (error) {

        // token invalid / expired
        logoutApi();

        setUser(null);
        setIsLoggedIn(false);

      } finally {
        setLoading(false);
      }

    };

    initAuth();

  }, []);

  /*
  =====================================
  SYNC LOGOUT ACROSS TABS
  =====================================
  */
  useEffect(() => {

    const syncLogout = (event) => {

      if (event.key === "accessToken" && !event.newValue) {
        setIsLoggedIn(false);
        setUser(null);
      }

    };

    window.addEventListener("storage", syncLogout);

    return () => {
      window.removeEventListener("storage", syncLogout);
    };

  }, []);

  /*
  =====================================
  LOGIN
  =====================================
  */
  const login = async (email, password) => {

    try {

      await loginApi({ email, password });

      const userData = await getCurrentUserApi();

      setUser(userData);
      setIsLoggedIn(true);

      return { success: true };

    } catch (error) {

      logoutApi();

      return {
        success: false,
        message:
          error.response?.data?.message || "Login failed"
      };

    }

  };

  /*
  =====================================
  LOGOUT
  =====================================
  */
  const logout = () => {

    logoutApi();

    setUser(null);
    setIsLoggedIn(false);

  };

  /*
  =====================================
  UPDATE USER (IMPORTANT)
  =====================================
  */
  const updateUser = (data) => {
    setUser(data);
  };

  /*
  =====================================
  PROVIDER
  =====================================
  */
  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        user,
        login,
        logout,
        updateUser,
        loading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}