import { createContext, useContext, useState } from "react";

/*
=================================
CREATE CONTEXT
=================================
*/

const ResetPasswordContext = createContext();

/*
=================================
PROVIDER
=================================
*/

export function ResetPasswordProvider({ children }) {

  const [email, setEmail] = useState(null);
  const [otp, setOtp] = useState(null);

  /*
  Clear state after password reset
  */

  const clearResetState = () => {
    setEmail(null);
    setOtp(null);
  };

  return (
    <ResetPasswordContext.Provider
      value={{
        email,
        setEmail,
        otp,
        setOtp,
        clearResetState
      }}
    >
      {children}
    </ResetPasswordContext.Provider>
  );
}

/*
=================================
CUSTOM HOOK
=================================
*/

export function useResetPassword() {
  return useContext(ResetPasswordContext);
}