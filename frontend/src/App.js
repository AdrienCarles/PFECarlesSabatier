import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
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


function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    {/* ROUTES NON PROTEGES */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/Welcome" element={<Welcome />} />
                    {/* ROUTES PROTEGES */}
                    <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
                    {/* ADMIN */}
                    <Route path="/admin/AdminDashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
                    <Route path="/admin/AdminDashboard/GestionUsers" element={<ProtectedRoute><GestionUsers /></ProtectedRoute>} />
                    <Route path="/admin/AdminDashboard/GestionAbonnement" element={<ProtectedRoute><GestionAbonnements /></ProtectedRoute>} />
                    {/* ORTHO */}
                    <Route path="/ortho/OrthoDashboard" element={<ProtectedRoute><OrthoDashboard /></ProtectedRoute>} />
                    <Route path="/ortho/OrthoDashboard/GestionEnfants" element={<ProtectedRoute><GestionEnfants /></ProtectedRoute>} />
                    {/* PARENT */}
                    {/* SERIES */}
                    <Route path="/series/GestionSeries" element={<ProtectedRoute><GestionSeries /></ProtectedRoute>} />
                    {/* Redirection par défaut */}
                    <Route path="*" element={<Navigate to="/Welcome" />} /> 
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;