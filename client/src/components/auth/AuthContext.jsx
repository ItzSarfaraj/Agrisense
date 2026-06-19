import React, { createContext, useState, useEffect } from "react";
import api from "../../api/axios";

export const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Derived State
  const isAuthenticated = !!user;

  useEffect(() => {
    if (user) return;

    const accessToken = localStorage.getItem("token");

    if (!accessToken) {
      setLoading(false);
      return;
    }

    const fetchUser = async () => {
      try {
        const response = await api.get("/auth/profile");

        setUser(response.data.user);
      } catch (error) {
        console.error("User not authenticated", error);
        clearUser();
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  // Update User State
  const updateUser = (userData) => {
    setUser(userData);
  };

  // Logout User
  const clearUser = () => {
    setUser(null);
    localStorage.removeItem("token");
  };

  //Login User
  const login = async (email, password) => {
  const response = await api.post(
    "/auth/login",
    {
      email,
      password,
    }
  );

  const data = response.data;

  localStorage.setItem("token", data.token);

  setUser(data.user);

  return data;
};

//Register User
const register = async (name, email, password) => {
  const response = await api.post("/auth/register",
    {
      name,
      email,
      password,
    }
  );

  const data = response.data;

  localStorage.setItem("token", data.token);

  setUser(data.user);

  return data;
};

//logout
const logout = () => {
  clearUser();
};

  return (
    <UserContext.Provider
      value={{
        user,
        loading,
        isAuthenticated,
        login,
        register,
        logout,
        updateUser,
        clearUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;