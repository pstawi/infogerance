import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./Pages/HomePage";
import AdminPage from "./Pages/AdminPage";
import ClientsPage from "./Pages/ClientsPage";
import ContactsPage from "./Pages/ContactsPage";
import TicketsPage from "./Pages/TicketsPage";
import TicketDetailPage from "./Pages/TicketDetailPage";
import LoginPage from "./Pages/LoginPage";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";

function RequireAuth({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<HomePage />} />
            <Route path="/tickets" element={<RequireAuth><TicketsPage /></RequireAuth>} />
            <Route path="/tickets/:id" element={<RequireAuth><TicketDetailPage /></RequireAuth>} />
            <Route path="/admin" element={<RequireAuth><AdminPage /></RequireAuth>} />
            <Route path="/clients" element={<RequireAuth><ClientsPage /></RequireAuth>} />
            <Route path="/contacts" element={<RequireAuth><ContactsPage /></RequireAuth>} />
          </Routes>
        </Router>
      </ToastProvider>
    </AuthProvider>
  );
}