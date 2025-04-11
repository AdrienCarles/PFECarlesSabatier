import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Button, Card, Row, Col } from "react-bootstrap";
import { FaUserMd, FaCreditCard, FaBook } from "react-icons/fa"; // Icônes adaptées
import AuthContext from "../../context/AuthContext";
import "../../css/OrthoDashboard.css"; 

const OrthoDashboard = () => {
  const { logout, user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/"); // Redirection vers Welcome après la déconnexion
  };

  return (
    <div className="ortho-dashboard">
      <div className="position-absolute top-0 end-0 m-3">
        <Button variant="danger" size="lg" onClick={handleLogout}>
          Déconnexion
        </Button>
      </div>

      {/* Conteneur centré */}
      <Container className="dashboard-content text-center">
        <h1 className="mb-4 fw-bold">Bienvenue orthophoniste {user?.nom} {user?.prenom}</h1>

        <Row className="justify-content-center w-100">
          <Col xs={12} sm={6} md={4} className="d-flex justify-content-center">
            <Card className="text-center shadow-lg border-0 p-4 hover-card" onClick={() => navigate("/ortho/OrthoDashboard/GestionEnfants")}>
              <Card.Body>
                <FaUserMd size={40} className="mb-2 text-primary" />
                <h5 className="fw-bold">Gestion des patients</h5>
              </Card.Body>
            </Card>
          </Col>
          <Col xs={12} sm={6} md={4} className="d-flex justify-content-center">
            <Card className="text-center shadow-lg border-0 p-4 hover-card" onClick={() => navigate("/ortho/subscriptions")}>
              <Card.Body>
                <FaCreditCard size={40} className="mb-2 text-success" />
                <h5 className="fw-bold">Gestion des abonnements</h5>
              </Card.Body>
            </Card>
          </Col>
          <Col xs={12} sm={6} md={4} className="d-flex justify-content-center">
            <Card className="text-center shadow-lg border-0 p-4 hover-card" onClick={() => navigate("/series/GestionSeries")}>
              <Card.Body>
                <FaBook size={40} className="mb-2 text-warning" />
                <h5 className="fw-bold">Gestion des séries</h5>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default OrthoDashboard;
