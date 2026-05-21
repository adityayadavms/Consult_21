import { createContext, useState, useEffect,useRef } from "react";
import { loginApi, logoutApi,refreshTokenApi } from "../api/authApi";
import { getCurrentUserApi } from "../api/userApi";
import {getRefreshTimeout} from "../utils/jwt";

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
  const refreshTimerRef = useRef(null);

      /*
      =====================================
      CLEAR REFRESH TIMER
      =====================================
      */

    const clearRefreshTimer = () => {

      if (refreshTimerRef.current) {
        clearTimeout(refreshTimerRef.current);
      }

    };
    /*
    =====================================
    START SILENT REFRESH TIMER
    =====================================
    */

    const startRefreshTimer = (accessToken) => {

      clearRefreshTimer();

      const timeout =
        getRefreshTimeout(accessToken);

      /*
      token already expired
      */

      if (timeout <= 0) {
        return;
      }

      refreshTimerRef.current = setTimeout(
        async () => {

          try {

            /*
            =============================
            SILENT REFRESH
            =============================
            */

            const data =
              await refreshTokenApi();

            /*
            =============================
            RESTART TIMER
            =============================
            */

            startRefreshTimer(
              data.accessToken
            );

          }

          catch {

            /*
            =============================
            REFRESH FAILED
            =============================
            */

            logout();

          }

        },

        timeout
      );

    };

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
        startRefreshTimer(token);

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

      const authData =
        await loginApi({ email, password });

      startRefreshTimer(
        authData.accessToken
      );

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
    clearRefreshTimer();
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
  CLEANUP TIMER
  =====================================
  */

    useEffect(() => {

      return () => {
        clearRefreshTimer();
      };

    }, []);
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