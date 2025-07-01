import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import AppNavbar from "./components/common/Navbar";
import ProtectedRoute from "./routes/ProtectedRoute";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Welcome from "./pages/Welcome";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import OrthoDashboard from "./pages/Ortho/OrthoDashboard";
import GestionUsers from "./pages/Admin/GestionUsers";
import GestionAbonnements from "./pages/Admin/GestionAbonnements";
import GestionSeries from "./pages/Series/GestionSeries";
import GestionEnfants from "./pages/Ortho/GestionEnfants";
import ParentDashboard from "./pages/Parent/ParentDashboard";
import ActivateAccount from "./pages/Parent/ActivateAccount";
import EnfantSeries from "./pages/Parent/EnfantSeries";

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppNavbar brandText="Cartes Animées" />
        <Routes>
          {/* ROUTES NON PROTEGES */}
          <Route path="/login" element={<Login />} />
          <Route path="/Welcome" element={<Welcome />} />
          <Route path="/activate/:token" element={<ActivateAccount />} />

          {/* ROUTES PROTEGES ACCESSIBLES A TOUS LES UTILISATEURS */}
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          {/* ADMIN ROUTES */}
          <Route
            path="/admin/AdminDashboard"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/AdminDashboard/GestionUsers"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <GestionUsers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/AdminDashboard/GestionAbonnement"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <GestionAbonnements />
              </ProtectedRoute>
            }
          />
          {/* ORTHO ROUTES */}
          <Route
            path="/ortho/OrthoDashboard"
            element={
              <ProtectedRoute allowedRoles={["orthophoniste"]}>
                <OrthoDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ortho/OrthoDashboard/GestionEnfants"
            element={
              <ProtectedRoute allowedRoles={["orthophoniste"]}>
                <GestionEnfants />
              </ProtectedRoute>
            }
          />
          {/* SERIES - accessible par admin et orthophoniste */}
          <Route
            path="/series/GestionSeries"
            element={
              <ProtectedRoute allowedRoles={["admin", "orthophoniste"]}>
                <GestionSeries />
              </ProtectedRoute>
            }
          />
          {/* PARENT ROUTE */}
          <Route
            path="/parent/ParentDashboard"
            element={
              <ProtectedRoute allowedRoles={["parent"]}>
                <ParentDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/parent/enfant/:enfantId/series"
            element={
              <ProtectedRoute>
                <EnfantSeries />
              </ProtectedRoute>
            }
          />

          {/* Redirection par défaut */}
          <Route path="*" element={<Navigate to="/Welcome" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
