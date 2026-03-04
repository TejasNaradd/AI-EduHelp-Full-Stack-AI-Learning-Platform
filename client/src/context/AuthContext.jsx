import { createContext, useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import api from "../api/axios";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(undefined);

  const fetchUser = async () => {
    try {
      const res = await api.get("/user/me");
      setUser(res.data.data);
    } catch (err) {
      // ignore 401 because it just means user is not logged in
      if (err.response?.status !== 401) {
        console.error(err);
      }
      setUser(null);
    }
  };

const location = useLocation()

useEffect(() => {
  const publicRoutes = ["/", "/login", "/register"];

  if (!publicRoutes.includes(location.pathname)) {
    fetchUser();
  } else {
    setUser(null);
  }
}, [location.pathname]);

  return (
    <AuthContext.Provider value={{ user, setUser, fetchUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);