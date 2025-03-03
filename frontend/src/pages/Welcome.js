import React from "react";
import { useNavigate } from "react-router-dom";
import { Container, Button } from "react-bootstrap";
import "../css/Welcome.css";

const Welcome = () => {
  const navigate = useNavigate();

  return (
    <Container className="welcome-container d-flex flex-column justify-content-center align-items-center vh-100 text-center">
      <div className="cloud-background">
        <h1 className="mb-4">Bienvenue sur l'application pour les enfants malentendants</h1>
        <Button variant="dark" size="lg" onClick={() => navigate("/login")}>
          Connexion
        </Button>
      </div>
    </Container>
  );
};

export default Welcome;
