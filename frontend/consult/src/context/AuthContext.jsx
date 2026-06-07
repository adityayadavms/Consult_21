import { createContext, useState, useEffect,useRef } from "react";
import { loginApi, logoutApi,refreshTokenApi } from "../api/authApi";
import { getCurrentUserApi } from "../api/userApi";
import {getRefreshTimeout,getRemainingTime} from "../utils/jwt";
import {retryQueuedRequests} from "../utils/networkRecovery";

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

        clearTimeout(
            refreshTimerRef.current
        );

        refreshTimerRef.current = null;
    }


    };
    
    /*
    =====================================
    START SILENT REFRESH TIMER
    =====================================
    */

    const startRefreshTimer = (accessToken) => {

      clearRefreshTimer();

      const timeout = getRefreshTimeout(accessToken);

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
RECOVER SESSION AFTER TAB RETURNS
=====================================
*/

const recoverSession = async () => {

    const token = localStorage.getItem( "accessToken");

    if (!token) {
        return;
    }

    /*
    remaining time
    */

    const remaining =getRemainingTime(token);

    /*
    refresh if less than 2 min
    */

    if (remaining < 120000) {

        try {

            const response = await refreshTokenApi();

            startRefreshTimer(response.accessToken);

        }

        catch {

            logout();

        }

    }

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
HANDLE TAB VISIBILITY
=====================================
*/

useEffect(() => {

    const handleVisibility = () => {

        if (!document.hidden) {

            recoverSession();

            retryQueuedRequests();

        }

    };

    const handleFocus = () => {

        recoverSession();

        retryQueuedRequests();

    };

    document.addEventListener(
        "visibilitychange",
        handleVisibility
    );

    window.addEventListener(
        "focus",
        handleFocus
    );

    return () => {

        document.removeEventListener(
            "visibilitychange",
            handleVisibility
        );

        window.removeEventListener(
            "focus",
            handleFocus
        );

    };

}, []);

  /*
  =====================================
  LOGIN
  =====================================
  */
  const login = async (email, password) => {

    try {

      const authData = await loginApi({ email, password });

      startRefreshTimer(authData.accessToken);

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
    setLoading(false);

  };

  /*
=====================================
NETWORK RECOVERY
Retry queued requests when internet returns
=====================================
*/

useEffect(() => {

    const handleOnline = async () => {

        console.log(
            "Internet connection restored"
        );

        try {

            await retryQueuedRequests();

        }

        catch (error) {

            console.error(
                "Queue retry failed:",
                error
            );

        }

    };

    const handleOffline = () => {

        console.log(
            "Internet connection lost"
        );

    };

    window.addEventListener(
        "online",
        handleOnline
    );

    window.addEventListener(
        "offline",
        handleOffline
    );

    return () => {

        window.removeEventListener(
            "online",
            handleOnline
        );

        window.removeEventListener(
            "offline",
            handleOffline
        );

    };

}, []);

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