import React, { useEffect, useState, useContext } from "react";
import { Container, Row, Col, Card, Button, Spinner, Alert } from "react-bootstrap";
import { FaChild } from "react-icons/fa";
import AuthContext from "../../context/AuthContext";
import axiosInstance from "../../api/axiosConfig";

const ParentDashboard = () => {
  const { user } = useContext(AuthContext);
  const [enfants, setEnfants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEnfants = async () => {
      try {
        const response = await axiosInstance.get(`/enfa/mes-enfants/${user.id}`);
        setEnfants(response.data);
      } catch (err) {
        console.error("Erreur lors du chargement des enfants :", err);
        setError("Impossible de charger les enfants.");
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchEnfants();
    }
  }, [user]);

  const handleEnfantClick = (enfant) => {
    // Rediriger vers la page de l'enfant ou effectuer une action
    console.log("Enfant sélectionné :", enfant);
  };

  return (
    <Container fluid className="py-4">
      <h2 className="mb-4">👨‍👩‍👧‍👦 Mes Enfants</h2>

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" role="status" />
        </div>
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : enfants.length === 0 ? (
        <div className="text-center text-muted">
          <FaChild size={40} className="mb-3" />
          <p>Aucun enfant trouvé.</p>
        </div>
      ) : (
        <Row xs={1} sm={2} md={3} lg={4} className="g-4">
          {enfants.map((enfant) => (
            <Col key={enfant.ENFA_id}>
              <Card
                className="h-100 text-center shadow-sm"
                onClick={() => handleEnfantClick(enfant)}
                style={{ cursor: "pointer" }}
              >
                <Card.Body>
                  <FaChild size={50} className="text-primary mb-3" />
                  <Card.Title className="mb-0">
                    {enfant.ENFA_prenom} {enfant.ENFA_nom}
                  </Card.Title>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default ParentDashboard;
