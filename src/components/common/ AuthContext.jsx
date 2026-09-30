import { createContext, useContext, useEffect, useState } from "react";

/*
 * Guards for the multi-step registration and password-reset flows.
 *
 * The forgot-password flags are mirrored into sessionStorage because they are
 * read by ProtectedRoute to decide which step a user may open. In plain React
 * state they are lost on refresh, so reloading the verify-OTP or set-password
 * screen threw the user back to the start of the flow. sessionStorage (not
 * localStorage) keeps the state for a refresh and drops it when the tab closes,
 * which is the right lifetime for a short-lived password reset.
 */
const FORGOT_EMAIL_KEY = "auth.forgotPasswordEmail";
const FORGOT_OTP_KEY = "auth.forgotPasswordOtpVerified";

const readSession = (key) => {
  if (typeof window === "undefined") return null;
  try {
    return window.sessionStorage.getItem(key);
  } catch {
    return null;
  }
};

const writeSession = (key, value) => {
  if (typeof window === "undefined") return;
  try {
    if (value) {
      window.sessionStorage.setItem(key, value);
    } else {
      window.sessionStorage.removeItem(key);
    }
  } catch {
    // Private mode or a full quota must not break the flow.
  }
};

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [registrationCompleted, setRegistrationCompleted] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [businessDetailsCompleted, setBusinessDetailsCompleted] =
    useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState(
    () => readSession(FORGOT_EMAIL_KEY) || "",
  );
  const [forgotPasswordOtpVerified, setForgotPasswordOtpVerified] = useState(
    () => readSession(FORGOT_OTP_KEY) === "true",
  );

  useEffect(() => {
    writeSession(FORGOT_EMAIL_KEY, forgotPasswordEmail);
  }, [forgotPasswordEmail]);

  useEffect(() => {
    writeSession(FORGOT_OTP_KEY, forgotPasswordOtpVerified ? "true" : "");
  }, [forgotPasswordOtpVerified]);

  // Called once the reset finishes so a later visit cannot re-enter the
  // set-password step on the strength of a stale sessionStorage flag.
  const clearForgotPasswordFlow = () => {
    setForgotPasswordEmail("");
    setForgotPasswordOtpVerified(false);
  };

  return (
    <AuthContext.Provider
      value={{
        registrationCompleted,
        setRegistrationCompleted,
        otpVerified,
        setOtpVerified,
        businessDetailsCompleted,
        setBusinessDetailsCompleted,
        forgotPasswordEmail,
        setForgotPasswordEmail,
        forgotPasswordOtpVerified,
        setForgotPasswordOtpVerified,
        clearForgotPasswordFlow,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// The context and its consumer hook live together on purpose: every page
// already imports { useAuth } from this path, and splitting the hook out would
// mean touching every consumer for a fast-refresh lint preference.
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  return useContext(AuthContext);
};
