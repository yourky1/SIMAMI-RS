import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export const DEMO_USERS = [
  { id: 'USR-001', nama: 'Admin Sistem', email: 'admin@permatamedika.co.id', password: 'admin123', role: 'Administrator', unit: 'Manajemen Aset' },
  { id: 'USR-002', nama: 'Siti Rahayu, AMK', email: 'siti@permatamedika.co.id', password: 'petugas123', role: 'Petugas Bangsal', unit: 'Bangsal Mawar' },
  { id: 'USR-003', nama: 'Hendra Wijaya', email: 'hendra@permatamedika.co.id', password: 'teknisi123', role: 'Teknisi', unit: 'Elektromedis' },
];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('simami_user');
    return saved ? JSON.parse(saved) : null;
  });

  const login = (email, password) => {
    const found = DEMO_USERS.find(u => u.email === email && u.password === password);
    if (found) {
      const { password: _, ...userData } = found;
      setUser(userData);
      localStorage.setItem('simami_user', JSON.stringify(userData));
      return { success: true };
    }
    return { success: false, message: 'Email atau password salah.' };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('simami_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
