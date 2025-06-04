import { createContext, useState, useEffect } from "react";
import axiosInstance from "../api/axiosConfig";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkUserStatus = async () => {
    try {
      const response = await axiosInstance.get("/auth/self");
      setUser(response.data);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const refreshToken = async () => {
    try {
      await axiosInstance.post("/auth/refresh-token");
      await checkUserStatus();
      return true;
    } catch (error) {
      console.error(
        "Échec du rafraîchissement du token",
        error.response || error
      );
      return false;
    }
  };

  useEffect(() => {
    const publicPaths = ["/welcome", "/login", "/activate"];

    const isPublicPage = publicPaths.some((path) =>
      window.location.pathname.toLowerCase().includes(path.toLowerCase())
    );

    if (!isPublicPage) {
      checkUserStatus();
    } else {
      setLoading(false);
    }

    let intervalId;
    if (user) {
      intervalId = setInterval(refreshToken, 10 * 60 * 1000);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axiosInstance.post("/auth/login", {
        email,
        password,
      });

      await checkUserStatus();

      return {
        success: true,
        userRole: response.data.user.role,
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
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        loading,
        refreshToken,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
