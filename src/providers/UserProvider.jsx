import { GetUserClaims, RefreshToken } from "@/api/Auth";
import { getCookie, setCookie } from "@/helper/Cookie";
import React, { createContext, useContext, useEffect, useState } from "react";

const UserContext = createContext({
  loading: true,
  isLoggedIn: false,
  setIsLoggedIn: () => {},
  permissions: [],
});

export const useUserContext = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [permissions, setPermissions] = useState([]);

  const handleVerify = async () => {
    try {
      const refreshToken = getCookie("refreshToken");
      const token = getCookie("token");
      if (token) {
        // əgər token varsa
        setIsLoggedIn(true);
      } else if (refreshToken) {
        // əgər token yox refreshToken varsa
        const res = await RefreshToken(refreshToken);
        setCookie("token", res.token, res.expirationDate);
        setCookie(
          "refreshToken",
          res.refreshToken,
          res.refreshTokenExpirationDate
        );
        setIsLoggedIn(true);
      } else {
        // əgər token və refreshToken yoxdursa və ya sorğu zamanı qırılma olarsa
        setCookie("token", "", -1);
        setCookie("refreshToken", "", -1);
        setIsLoggedIn(false);
      }
    } catch (error) {
      console.log("Auth error:", error);
      setIsLoggedIn(false);
    }
  };

  const getPermissions = async () => {
    try {
      const res = await GetUserClaims();
      setPermissions(res.appClaims);
    } catch (error) {
      console.log("error at getPermissions", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      getPermissions();
    }
  }, [isLoggedIn]);

  useEffect(() => {
    handleVerify();
  }, []);

  return (
    <UserContext.Provider
      value={{ loading, isLoggedIn, setIsLoggedIn, permissions }}
    >
      {children}
    </UserContext.Provider>
  );
};
