import { createContext, useState, useEffect } from "react";
import axiosInstance from "../api/axiosConfig"; // Utilisez votre instance configurée

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    
    // Vérifiez si un token existe au chargement initial
    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        if (token) {
            // Si un token existe, vérifiez s'il est valide
            axiosInstance.get("/auth/self")
                .then(response => {
                    setUser(response.data);
                    setLoading(false);
                })
                .catch(() => {
                    localStorage.removeItem("accessToken"); // Supprimez le token invalide
                    setUser(null);
                    setLoading(false);
                });
        } else {
            // Pas de token, donc l'utilisateur n'est pas connecté
            setLoading(false);
        }
    }, []);


    const login = async (email, password) => {
        try {
          const loginResponse = await axiosInstance.post("/auth/login", { email, password });
          
          // Vérifiez que la réponse contient bien un token
          if (!loginResponse.data.token) {
            console.error("Le serveur n'a pas renvoyé de token");
            return false;
          }
          
          // Sauvegardez le token dans localStorage
          localStorage.setItem("accessToken", loginResponse.data.token);
          
          // Configuration de l'en-tête pour les requêtes futures
          axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${loginResponse.data.token}`;
          
          // Récupérez les informations utilisateur
          const userResponse = await axiosInstance.get("/auth/self");
          setUser(userResponse.data);
          return true;
        } catch (error) {
          console.error("Erreur de connexion", error);
          return false;
        }
      };

    const logout = async () => {
        try {
            await axiosInstance.post("/auth/logout");
            localStorage.removeItem("accessToken");
            setUser(null);
        } catch (error) {
            console.error("Erreur lors de la déconnexion", error);
            // Déconnexion locale même en cas d'erreur
            localStorage.removeItem("accessToken");
            setUser(null);
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;