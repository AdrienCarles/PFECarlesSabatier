import { useContext } from "react";
import AuthContext from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Home = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login"); // Redirige vers login après la déconnexion
    };

    return (
        <div>
            <h2>Bienvenue {user?.email}</h2>
            <button onClick={handleLogout}>Se déconnecter</button>
        </div>
    );
};

export default Home;
