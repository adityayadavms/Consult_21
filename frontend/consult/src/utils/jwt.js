import { jwtDecode } from "jwt-decode";

/*
=====================================
DECODE JWT
=====================================
*/

export const decodeToken = (token) => {

  try {
    return jwtDecode(token);
  }

  catch {
    return null;
  }

};

/*
=====================================
GET TOKEN EXPIRY (ms)
=====================================
*/

export const getTokenExpiry = (token) => {

  const decoded = decodeToken(token);

  if (!decoded?.exp) {
    return null;
  }

  return decoded.exp * 1000;
};

/*
=====================================
CHECK IF TOKEN EXPIRED
=====================================
*/

export const isTokenExpired = (token) => {

  const expiry = getTokenExpiry(token);

  if (!expiry) {
    return true;
  }

  return Date.now() >= expiry;
};

/*
=====================================
CALCULATE REFRESH TIME
Refresh 1 minute before expiry
=====================================
*/

export const getRefreshTimeout = (token) => {

  const expiry = getTokenExpiry(token);

  if (!expiry) {
    return 0;
  }

  /*
  refresh 1 min before expiry
  */

  const refreshTime =
    expiry - Date.now() - 60000;

  return Math.max(refreshTime, 0);
};