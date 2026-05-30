import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { getHomePathByRole, useAuth } from "./context/AuthContext.jsx";
import AppLayout from "./layouts/AppLayout.jsx";
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Assets from "./pages/Assets.jsx";
import AssetForm from "./pages/AssetForm.jsx";
import AssetDetail from "./pages/AssetDetail.jsx";
import QRManager from "./pages/QRManager.jsx";
import ScanQR from "./pages/ScanQR.jsx";
import Mutations from "./pages/Mutations.jsx";
import Maintenance from "./pages/Maintenance.jsx";
import Reports from "./pages/Reports.jsx";
import Users from "./pages/Users.jsx";
import Profile from "./pages/Profile.jsx";
import Settings from "./pages/Settings.jsx";
import StaffPortal from "./pages/StaffPortal.jsx";
import Catalog from "./pages/Catalog.jsx";
import MyBorrows from "./pages/MyBorrows.jsx";
import Approvals from "./pages/Approvals.jsx";
import NotFound from "./pages/NotFound.jsx";

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

function RoleRoute({ allowedRoles, children }) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) return <Navigate to="/login" replace />;

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to={getHomePathByRole(user.role)} replace state={{ from: location.pathname }} />;
  }

  return children;
}

function LoginRedirect() {
  const { user } = useAuth();
  if (!user) return <Login />;
  return <Navigate to={getHomePathByRole(user.role)} replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginRedirect />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route
          index
          element={
            <RoleRoute allowedRoles={["Administrator"]}>
              <Dashboard />
            </RoleRoute>
          }
        />

        <Route
          path="portal"
          element={
            <RoleRoute allowedRoles={["Petugas Bangsal"]}>
              <StaffPortal />
            </RoleRoute>
          }
        />
        <Route
          path="catalog"
          element={
            <RoleRoute allowedRoles={["Petugas Bangsal"]}>
              <Catalog />
            </RoleRoute>
          }
        />
        <Route
          path="my-borrows"
          element={
            <RoleRoute allowedRoles={["Petugas Bangsal"]}>
              <MyBorrows />
            </RoleRoute>
          }
        />

        <Route
          path="approvals"
          element={
            <RoleRoute allowedRoles={["Administrator"]}>
              <Approvals />
            </RoleRoute>
          }
        />
        <Route
          path="assets"
          element={
            <RoleRoute allowedRoles={["Administrator"]}>
              <Assets />
            </RoleRoute>
          }
        />
        <Route
          path="assets/new"
          element={
            <RoleRoute allowedRoles={["Administrator"]}>
              <AssetForm />
            </RoleRoute>
          }
        />
        <Route
          path="assets/:assetId"
          element={
            <RoleRoute allowedRoles={["Administrator", "Teknisi"]}>
              <AssetDetail />
            </RoleRoute>
          }
        />
        <Route
          path="assets/:assetId/edit"
          element={
            <RoleRoute allowedRoles={["Administrator"]}>
              <AssetForm />
            </RoleRoute>
          }
        />
        <Route
          path="qr"
          element={
            <RoleRoute allowedRoles={["Administrator"]}>
              <QRManager />
            </RoleRoute>
          }
        />
        <Route
          path="mutations"
          element={
            <RoleRoute allowedRoles={["Administrator"]}>
              <Mutations />
            </RoleRoute>
          }
        />
        <Route
          path="reports"
          element={
            <RoleRoute allowedRoles={["Administrator"]}>
              <Reports />
            </RoleRoute>
          }
        />
        <Route
          path="users"
          element={
            <RoleRoute allowedRoles={["Administrator"]}>
              <Users />
            </RoleRoute>
          }
        />
        <Route
          path="settings"
          element={
            <RoleRoute allowedRoles={["Administrator"]}>
              <Settings />
            </RoleRoute>
          }
        />

        <Route
          path="maintenance"
          element={
            <RoleRoute allowedRoles={["Administrator", "Teknisi"]}>
              <Maintenance />
            </RoleRoute>
          }
        />

        <Route
          path="scan"
          element={
            <RoleRoute allowedRoles={["Administrator", "Petugas Bangsal", "Teknisi"]}>
              <ScanQR />
            </RoleRoute>
          }
        />

        <Route path="profile" element={<Profile />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
