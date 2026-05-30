import { createContext, useContext, useMemo, useState } from "react";

const AuthContext = createContext(null);

const demoUsers = [
  {
    id: "USR-001",
    name: "Akhmad Husni Assidiqi",
    email: "admin.simami@permata-medika.id",
    password: "password",
    role: "Administrator",
    unit: "Manajemen Aset"
  },
  {
    id: "USR-002",
    name: "Siti Aminah",
    email: "siti@permata-medika.id",
    password: "password",
    role: "Petugas Bangsal",
    unit: "Bangsal Mawar"
  },
  {
    id: "USR-003",
    name: "Budi Santoso",
    email: "budi@permata-medika.id",
    password: "password",
    role: "Teknisi",
    unit: "Elektromedis"
  }
];

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

  function login({ email, password }) {
    const account = demoUsers.find((item) => item.email === email && item.password === password);

    if (!account) {
      throw new Error("Email atau password salah. Gunakan akun demo yang tersedia.");
    }

    const { password: _, ...safeUser } = account;
    localStorage.setItem("simami_token", "demo-token");
    localStorage.setItem("simami_user", JSON.stringify(safeUser));
    setUser(safeUser);
  }

  function logout() {
    localStorage.removeItem("simami_token");
    localStorage.removeItem("simami_user");
    setUser(null);
  }

  const value = useMemo(() => ({ user, login, logout, demoUsers }), [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
