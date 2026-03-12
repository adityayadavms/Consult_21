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
  const [user, setUser] = useState(null);
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

      /*
      Restore basic user info
      (later we will fetch this from backend)
      */

      setUser({
        name: "User"
      });

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

      /*
      Store user info
      */

      setUser({
        name: email.split("@")[0],
        email
      });

      return {
        success: true
      };

    } catch (error) {

      return {
        success: false,
        message:
          error.response?.data?.message ||
          "Login failed"
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