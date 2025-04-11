import { useContext } from "react";
import { Navigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import { Spinner } from "react-bootstrap"; // Assurez-vous d'importer Spinner

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useContext(AuthContext);

    console.log("ProtectedRoute - loading:", loading, "user:", user);

    if (loading) {
        // Afficher un indicateur de chargement pendant la vérification de l'utilisateur
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Chargement...</span>
                </Spinner>
            </div>
        );
    }

    return user ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
