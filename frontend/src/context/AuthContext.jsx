import { createContext, useContext, useMemo, useState } from "react";
import { apiRequest } from "../lib/api.js";

const AuthContext = createContext(null);

export function getHomePathByRole(role) {
  if (role === "Administrator") return "/";
  if (role === "Teknisi") return "/maintenance";
  return "/portal";
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("simami_user");
    return saved ? JSON.parse(saved) : null;
  });

  async function login({ email, password }) {
    const result = await apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password })
    });

    const { token, user: loggedInUser } = result;

    localStorage.setItem("simami_token", token);
    localStorage.setItem("simami_user", JSON.stringify(loggedInUser));
    setUser(loggedInUser);
  }

  function logout() {
    localStorage.removeItem("simami_token");
    localStorage.removeItem("simami_user");
    setUser(null);
  }

  const value = useMemo(() => ({ user, login, logout }), [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
