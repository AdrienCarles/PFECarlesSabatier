import { useContext } from "react";
import { Navigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import { Spinner } from "react-bootstrap";

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
    const { user, loading } = useContext(AuthContext);

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Chargement...</span>
                </Spinner>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" />;
    }
    
    if (!allowedRoles || allowedRoles.length === 0) {
        return children;
    }
    
    if (allowedRoles.includes(user.role)) {
        return children;
    }
    
    switch (user.role) {
        case 'admin':
            return <Navigate to="/admin/AdminDashboard" />;
        case 'orthophoniste':
            return <Navigate to="/ortho/OrthoDashboard" />;
        case 'parent':
        default:
            return <Navigate to="/home" />;
    }
};

export default ProtectedRoute;