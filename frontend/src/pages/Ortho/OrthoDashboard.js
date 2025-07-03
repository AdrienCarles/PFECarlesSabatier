import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Card, Row, Col } from "react-bootstrap";
import { FaUserMd, FaBook } from "react-icons/fa";
import AuthContext from "../../context/AuthContext";
import "../../css/OrthoDashboard.css";

const OrthoDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <div className="ortho-dashboard">
      <Container className="dashboard-content text-center">
        <h1 className="mb-4 fw-bold">
          Bienvenue orthophoniste {user?.nom} {user?.prenom}
        </h1>
        <Row className="justify-content-center w-100 g-4">
          <Col xs={12} sm={6} md={5} className="d-flex justify-content-center">
            <Card
              className="text-center shadow-lg border-0 p-4 hover-card"
              onClick={() => navigate("/ortho/OrthoDashboard/GestionEnfants")}
              style={{ cursor: "pointer", minWidth: 220, maxWidth: 340, width: "100%" }}
            >
              <Card.Body>
                <FaUserMd size={40} className="mb-2 text-primary" />
                <h5 className="fw-bold">Gestion des patients</h5>
              </Card.Body>
            </Card>
          </Col>
          <Col xs={12} sm={6} md={5} className="d-flex justify-content-center">
            <Card
              className="text-center shadow-lg border-0 p-4 hover-card"
              onClick={() => navigate("/series/GestionSeries")}
              style={{ cursor: "pointer", minWidth: 220, maxWidth: 340, width: "100%" }}
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

export default OrthoDashboard;