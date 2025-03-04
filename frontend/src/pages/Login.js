import { useState, useContext } from "react";
import AuthContext from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "../css/Login.css"; // Import du CSS

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(email, password);
    navigate("/home"); // Redirection après connexion
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
