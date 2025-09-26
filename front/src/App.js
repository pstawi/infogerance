import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./Pages/HomePage";
import AdminPage from "./Pages/AdminPage";
import ClientsPage from "./Pages/ClientsPage";
import ContactsPage from "./Pages/ContactsPage";
import TicketsPage from "./Pages/TicketsPage";
import TicketDetailPage from "./Pages/TicketDetailPage";
import ProfilePage from "./Pages/ProfilePage";
import LoginPage from "./Pages/LoginPage";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";
import TopBar from "./components/TopBar";
import ChangePasswordModal from "./components/ChangePasswordModal";
import { useState } from "react";
import { useToast } from "./context/ToastContext";
import { changePassword } from "./Services/authService";

function RequireAuth({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

function RequireCollaborateur({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  const roles = Array.isArray(user?.roles) ? user.roles : [];
  const allowed = new Set(["ROLE_ADMIN", "ROLE_MANAGER", "ROLE_COLLABORATEUR"]);
  const isAllowed = roles.some((r) => allowed.has(r));
  if (!isAllowed) return <Navigate to="/tickets" replace />;
  return children;
}

function WithTopBar({ children }) {
  const [openChangePassword, setOpenChangePassword] = useState(false);
  const { showToast } = useToast();

  const handleChangePassword = async ({ currentPassword, newPassword }) => {
    try {
      await changePassword(currentPassword, newPassword);
      showToast("Mot de passe mis à jour", { severity: 'success' });
    } catch (e) {
      const message = e?.response?.data?.message || "Échec du changement de mot de passe";
      showToast(message, { severity: 'error' });
      throw e;
    }
  };

  return (
    <>
      <TopBar onOpenChangePassword={() => setOpenChangePassword(true)} />
      {children}
      <ChangePasswordModal
        open={openChangePassword}
        onClose={() => setOpenChangePassword(false)}
        onSubmit={handleChangePassword}
      />
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<HomePage />} />
            <Route path="/profile" element={<RequireAuth><WithTopBar><ProfilePage /></WithTopBar></RequireAuth>} />
            <Route path="/tickets" element={<RequireAuth><WithTopBar><TicketsPage /></WithTopBar></RequireAuth>} />
            <Route path="/tickets/:id" element={<RequireAuth><WithTopBar><TicketDetailPage /></WithTopBar></RequireAuth>} />
            <Route path="/admin" element={<RequireAuth><RequireCollaborateur><WithTopBar><AdminPage /></WithTopBar></RequireCollaborateur></RequireAuth>} />
            <Route path="/clients" element={<RequireAuth><RequireCollaborateur><WithTopBar><ClientsPage /></WithTopBar></RequireCollaborateur></RequireAuth>} />
            <Route path="/contacts" element={<RequireAuth><RequireCollaborateur><WithTopBar><ContactsPage /></WithTopBar></RequireCollaborateur></RequireAuth>} />
          </Routes>
        </Router>
      </ToastProvider>
    </AuthProvider>
  );
}