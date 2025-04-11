import { createContext, useState, useEffect } from "react";
import axiosInstance from "../api/axiosConfig";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        if (token) {
            axiosInstance.get("/auth/self")
                .then(response => {
                    setUser(response.data);
                    setLoading(false);
                })
                .catch(() => {
                    localStorage.removeItem("accessToken");
                    setUser(null);
                    setLoading(false);
                });
        } else {
            setLoading(false);
        }
    }, []);


    const login = async (email, password) => {
        try {
          const loginResponse = await axiosInstance.post("/auth/login", { email, password });
          
          if (!loginResponse.data.token) {
            console.error("Le serveur n'a pas renvoyé de token");
            return { success: false };
          }
          
          localStorage.setItem("accessToken", loginResponse.data.token);
          
          axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${loginResponse.data.token}`;
          
          const userResponse = await axiosInstance.get("/auth/self");
          setUser(userResponse.data);
          return { success: true, userRole: userResponse.data.role };
        } catch (error) {
          console.error("Erreur de connexion", error);
          return { success: false };
        }
    };

    const logout = async () => {
        try {
            await axiosInstance.post("/auth/logout");
            localStorage.removeItem("accessToken");
            setUser(null);
        } catch (error) {
            console.error("Erreur lors de la déconnexion", error);
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