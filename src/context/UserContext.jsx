import React, { createContext, useEffect, useState } from "react";
import { getToken, logout } from "@/services/authService";
import { jwtDecode } from "jwt-decode";


export const UserContext = createContext();

const decodeToken = (token) => {
  try {
    return jwtDecode(token);
  } catch (error) {
    console.error("Invalid token:", error);
    return null;
  }
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = getToken();
    if (token) {
      loginUser(token);
    }
  }, []);

  const loginUser = (token) => {
    const userData = decodeToken(token);
    if (userData) {
      // token payload shape may vary; prefer userData.user if present, otherwise use full payload
      setUser(userData.user || userData);
    } else {
      logout();
    }
  };

  const logoutUser = () => {
    logout();
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, loginUser, logoutUser }}>
      {children}
    </UserContext.Provider>
  );
};
