import { createContext, useState, useEffect } from "react";
import axiosInstance from "../api/axiosConfig";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    
    // Fonction pour vérifier si l'utilisateur est connecté
    const checkUserStatus = async () => {
        try {
            const response = await axiosInstance.get("/auth/self");
            setUser(response.data);
        } catch (error) {
            console.log("Erreur lors de la vérification de l'utilisateur:", error.response || error);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    // Fonction pour rafraîchir le token
    const refreshToken = async () => {
        try {
            console.log("Tentative de rafraîchissement du token");
            await axiosInstance.post("/auth/refresh-token");
            console.log("Token rafraîchi avec succès");
            await checkUserStatus(); // Vérifier à nouveau le statut après rafraîchissement
            return true;
        } catch (error) {
            console.error("Échec du rafraîchissement du token", error.response || error);
            return false;
        }
    };
    
    useEffect(() => {
        console.log("AuthContext initialisé");
        checkUserStatus();
        
        // Configurer un intervalle pour rafraîchir le token toutes les 10 minutes
        const intervalId = setInterval(() => {
            refreshToken();
        }, 10 * 60 * 1000);
        
        return () => clearInterval(intervalId);
    }, []);

    const login = async (email, password) => {
        try {
            console.log("Tentative de connexion pour:", email);
            const response = await axiosInstance.post("/auth/login", { email, password });
            
            console.log("Réponse de connexion:", response.data);
            
            // Vérifie immédiatement les infos utilisateur après la connexion
            await checkUserStatus();
            
            return { 
                success: true, 
                userRole: response.data.user.role 
            };
        } catch (error) {
            console.error("Erreur de connexion", error.response || error);
            return { success: false };
        }
    };

    const logout = async () => {
        try {
            await axiosInstance.post("/auth/logout");
            setUser(null);
        } catch (error) {
            console.error("Erreur lors de la déconnexion", error.response || error);
            setUser(null);
        }
    };

    return (
        <AuthContext.Provider value={{ 
            user, 
            login, 
            logout, 
            loading, 
            refreshToken,
            isAuthenticated: !!user // Ajouter un raccourci pratique
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;