import { useContext } from "react";
import { UserContext } from "../components/auth/AuthContext";

const useAuth = () => {
  return useContext(UserContext);
};

export default useAuth;