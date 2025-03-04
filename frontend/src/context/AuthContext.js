import { createContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    
    useEffect(() => {
        axios.get("http://localhost:5000/api/auth/self", { withCredentials: true })
            .then(response => setUser(response.data))
            .catch(() => setUser(null));
    }, []);

    const login = async (email, password) => {
        try {
            await axios.post("http://localhost:5000/api/auth/login", { email, password }, { withCredentials: true });
            const res = await axios.get("http://localhost:5000/api/auth/self", { withCredentials: true });
            setUser(res.data);
        } catch (error) {
            console.error("Erreur de connexion", error);
        }
    };

    const logout = async () => {
        try {
            await axios.post("http://localhost:5000/api/auth/logout", {}, { withCredentials: true });
            setUser(null);
        } catch (error) {
            console.error("Erreur lors de la déconnexion", error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
