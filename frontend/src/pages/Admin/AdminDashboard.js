import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Card, Row, Col } from "react-bootstrap";
import { FaUsers, FaCreditCard, FaBook } from "react-icons/fa";
import AuthContext from "../../context/AuthContext";
import "../../css/AdminDashboard.css";

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  return (
    <div className="admin-dashboard d-flex flex-column justify-content-center align-items-center">
      <Container className="text-center d-flex flex-column justify-content-center align-items-center">
        <h1 className="mb-4 fw-bold">
          Bienvenue Administrateur {user?.nom} {user?.prenom}
        </h1>

        <Row className="justify-content-center w-100">
          <Col xs={12} sm={6} md={4} className="d-flex justify-content-center">
            <Card
              className="text-center shadow-lg border-0 p-4 hover-card"
              onClick={() => navigate("/admin/AdminDashboard/GestionUsers")}
            >
              <Card.Body>
                <FaUsers size={40} className="mb-2 text-primary" />
                <h5 className="fw-bold">Gestion des utilisateurs</h5>
              </Card.Body>
            </Card>
          </Col>
          <Col xs={12} sm={6} md={4} className="d-flex justify-content-center">
            <Card
              className="text-center shadow-lg border-0 p-4 hover-card"
              onClick={() =>
                navigate("/admin/AdminDashboard/GestionAbonnement")
              }
            >
              <Card.Body>
                <FaCreditCard size={40} className="mb-2 text-success" />
                <h5 className="fw-bold">Gestion des abonnements</h5>
              </Card.Body>
            </Card>
          </Col>
          <Col xs={12} sm={6} md={4} className="d-flex justify-content-center">
            <Card
              className="text-center shadow-lg border-0 p-4 hover-card"
              onClick={() => navigate("/series/GestionSeries")}
            >
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

export default AdminDashboard;
