import React, { useEffect, useState, useContext } from "react";
import { Container, Row, Col, Card, Spinner, Alert } from "react-bootstrap";
import { FaChild } from "react-icons/fa";
import AuthContext from "../../context/AuthContext";
import axiosInstance from "../../api/axiosConfig";
import { useNavigate } from "react-router-dom";
import './ParentDashboard.css';

const ParentDashboard = () => {
    const { user } = useContext(AuthContext);
    const [enfants, setEnfants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();

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
        // Redirige vers la page des animations de l'enfant
        navigate(`/parent/enfant/${enfant.ENFA_id}/animations`);
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
                    <span>Aucun enfant trouvé.</span>
                </div>
            ) : (
                <Row xs={1} sm={2} md={2} lg={3} xl={4} className="g-3">
                    {enfants.map((enfant) => (
                        <Col key={enfant.ENFA_id}>
                            <Card
                                className="h-100 text-center shadow-sm hover-effect w-100"
                                onClick={() => handleEnfantClick(enfant)}
                                style={{
                                    cursor: "pointer",
                                    transition: "transform 0.2s ease-in-out"
                                }}
                            >
                                <Card.Body>
                                    <div className="mb-3">
                                        <FaChild size={50} className="text-primary" />
                                    </div>
                                    <Card.Title className="mb-2">
                                        {enfant.ENFA_prenom} {enfant.ENFA_nom}
                                    </Card.Title>
                                    <Card.Text className="text-muted">
                                        <small>
                                            {enfant.ENFA_dateNaissance && (
                                                <span>
                                                    Né(e) le : {new Date(enfant.ENFA_dateNaissance).toLocaleDateString('fr-FR')}
                                                    <br />
                                                </span>
                                            )}
                                            {enfant.ENFA_classe && (
                                                <span>Classe : {enfant.ENFA_classe}</span>
                                            )}
                                        </small>
                                    </Card.Text>
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