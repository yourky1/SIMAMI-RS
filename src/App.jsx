import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Pages
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import AsetPage from './pages/AsetPage';
import DetailAsetPage from './pages/DetailAsetPage';
import QRCodePage from './pages/QRCodePage';
import ScanPage from './pages/ScanPage';
import MutasiPage from './pages/MutasiPage';
import MaintenancePage from './pages/MaintenancePage';
import LaporanPage from './pages/LaporanPage';
import UserPage from './pages/UserPage';
import ProfilPage from './pages/ProfilPage';
import PengaturanPage from './pages/PengaturanPage';

function PrivateRoute({ children, adminOnly }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (adminOnly && user.role !== 'Administrator') return <Navigate to="/" replace />;
  return children;
}

function AppRoutes() {
  const { user } = useAuth();
  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/" replace /> : <LoginPage />} />
      <Route path="/" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
      <Route path="/aset" element={<PrivateRoute><AsetPage /></PrivateRoute>} />
      <Route path="/aset/:id" element={<PrivateRoute><DetailAsetPage /></PrivateRoute>} />
      <Route path="/qr-code" element={<PrivateRoute><QRCodePage /></PrivateRoute>} />
      <Route path="/scan" element={<PrivateRoute><ScanPage /></PrivateRoute>} />
      <Route path="/mutasi" element={<PrivateRoute><MutasiPage /></PrivateRoute>} />
      <Route path="/maintenance" element={<PrivateRoute><MaintenancePage /></PrivateRoute>} />
      <Route path="/laporan" element={<PrivateRoute><LaporanPage /></PrivateRoute>} />
      <Route path="/users" element={<PrivateRoute adminOnly><UserPage /></PrivateRoute>} />
      <Route path="/profil" element={<PrivateRoute><ProfilPage /></PrivateRoute>} />
      <Route path="/pengaturan" element={<PrivateRoute adminOnly><PengaturanPage /></PrivateRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
