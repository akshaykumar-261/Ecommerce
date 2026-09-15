import { createContext, useContext, useState } from "react";
const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
  const [registrationCompleted, setRegistrationCompleted] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [businessDetailsCompleted, setBusinessDetailsCompleted] =
    useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  const [forgotPasswordOtpVerified, setForgotPasswordOtpVerified] =
    useState(false);
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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
export const useAuth = () => {
  return useContext(AuthContext);
};
