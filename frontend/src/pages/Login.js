import React, { useState, useContext } from "react";
import AuthContext from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "../css/Login.css"; // Import du CSS

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const result = await login(email, password);

    if (result.success) {
      // Redirection basée sur le rôle
      if (result.userRole === "admin") {
        navigate("/admin/AdminDashboard");
      } else if (result.userRole === "orthophoniste") {
        navigate("/ortho/OrthoDashboard");
      } else if (result.userRole === "parent") {
        navigate("/parent/ParentDashboard");
      } else {
        navigate("/home");
      }
    } else {
      setError("Identifiants incorrects");
    }
  };


  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Connexion</h2>
        <form onSubmit={handleSubmit}>
          <label>Email :</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="Entrez votre email" />

          <label>Mot de passe :</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="Entrez votre mot de passe" />

          <button type="submit">Se connecter</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
