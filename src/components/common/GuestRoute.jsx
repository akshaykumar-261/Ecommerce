import { Navigate } from "react-router-dom";

const GuestRoute = ({ children }) => {
  const token = localStorage.getItem("accessToken");

  if (token) {
    return <Navigate to="/home" replace />;
  }

  return children;
};

export default GuestRoute;