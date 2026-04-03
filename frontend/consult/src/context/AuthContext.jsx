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
  CHECK TOKEN ON APP LOAD
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

          setIsLoggedIn(true);
          setUser(userData);

        } catch (error) {

          if (error.response?.status === 401) {
            logoutApi();
            setIsLoggedIn(false);
            setUser(null);
          }

        } finally {
          setLoading(false);
        }

      };

      initAuth();
    }, []);

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
  LOGIN FUNCTION
  =====================================
  */

  const login = async (email, password) => {
  try {

    await loginApi({ email, password });

    const userData = await getCurrentUserApi();

    setIsLoggedIn(true);
    setUser(userData);

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
  LOGOUT FUNCTION
  =====================================
  */

  const logout = () => {

    logoutApi();

    setIsLoggedIn(false);
    setUser(null);

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
        user,
        login,
        logout,
        loading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}