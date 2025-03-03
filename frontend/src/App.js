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
import GestionSeries from "./pages/Admin/GestionSeries";


function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/home" element={<Home />} />
                    <Route path="/Welcome" element={<Welcome />} />
                    <Route path="*" element={<Navigate to="/Welcome" />} /> {/* Redirection par défaut */}
                    {/* ADMIN */}
                    <Route path="/admin/AdminDashboard" element={<AdminDashboard />} />
                    <Route path="/admin/AdminDashboard/GestionUsers" element={<GestionUsers />} />
                    <Route path="/admin/AdminDashboard/GestionAbonnement" element={<GestionAbonnements />} />
                    <Route path="/admin/AdminDashboard/GestionSeries" element={<GestionSeries />} />


                    {/* ORTHO */}
                    <Route path="/ortho/OrthoDashboard" element={<OrthoDashboard />} />
                    {/* PARENT */}

                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;