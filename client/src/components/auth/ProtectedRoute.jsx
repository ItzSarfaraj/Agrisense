import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "./AuthContext";
import LoadingSpinner from "../common/LoadingSpinner";
 

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } =
    useContext(UserContext);

  if (loading) {
    return <LoadingSpinner />;
  }

  return isAuthenticated
    ? children
    : <Navigate to="/login" />;
};

export default ProtectedRoute;