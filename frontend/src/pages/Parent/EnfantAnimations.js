import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Button, Spinner, Alert } from "react-bootstrap";
import axiosInstance from "../../api/axiosConfig";
import { FaArrowLeft, FaPlay } from "react-icons/fa";
import PreviewAnimation from "../Animations/PreviewAnimation";

const EnfantAnimations = () => {
    const { enfantId } = useParams();
    const navigate = useNavigate();
    const [enfant, setEnfant] = useState(null);
    const [animations, setAnimations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [previewAnimation, setPreviewAnimation] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Récupère les infos de l'enfant (optionnel)
                const enfantRes = await axiosInstance.get(`/enfa/${enfantId}`);
                setEnfant(enfantRes.data);

                // Récupère les animations associées
                const aniRes = await axiosInstance.get(`/enfa/${enfantId}/animations`);
                setAnimations(aniRes.data);
                setError("");
            } catch (err) {
                setError("Erreur lors du chargement des animations.");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [enfantId]);

    return (
        <Container className="py-4">
            <Button variant="link" onClick={() => navigate(-1)} className="mb-3">
                <FaArrowLeft /> Retour
            </Button>
            <h2>
                Animations de {enfant ? `${enfant.ENFA_prenom} ${enfant.ENFA_nom}` : "l'enfant"}
            </h2>
            {loading ? (
                <div className="text-center py-5">
                    <Spinner animation="border" />
                </div>
            ) : error ? (
                <Alert variant="danger">{error}</Alert>
            ) : animations.length === 0 ? (
                <div className="text-center text-muted py-5">
                    Aucune animation associée à cet enfant.
                </div>
            ) : (
                <Row xs={1} md={2} lg={3} className="g-4 mt-3">
                    {animations.map((ani) => (
                        <Col key={ani.ANI_id}>
                            <Card className="h-100 shadow-sm">
                                {ani.serie && ani.serie.SES_icone ? (
                                    <div className="d-flex justify-content-center align-items-center" style={{ height: 180 }}>
                                        <img
                                            src={`${process.env.REACT_APP_API_URL}${ani.serie.SES_icone}`}
                                            alt={`Icône de la série ${ani.serie.SES_titre}`}
                                            style={{ maxHeight: 160, maxWidth: "90%", objectFit: "cover", borderRadius: 12 }}
                                        />
                                    </div>
                                ) : (
                                    <div className="d-flex justify-content-center align-items-center" style={{ height: 180 }}>
                                        <FaPlay size={60} className="text-primary" />
                                    </div>
                                )}
                                <Card.Body className="d-flex flex-column">
                                    <Card.Title>{ani.ANI_titre}</Card.Title>
                                    <Card.Text>{ani.ANI_description}</Card.Text>
                                    <Button
                                        variant="primary"
                                        className="mt-auto"
                                        onClick={() => setPreviewAnimation(ani)}
                                    >
                                        <FaPlay className="me-2" />
                                        Prévisualiser
                                    </Button>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            )}

            {/* Modale de prévisualisation */}
            <PreviewAnimation
                show={!!previewAnimation}
                handleClose={() => setPreviewAnimation(null)}
                animation={previewAnimation}
            />
        </Container>
    );
};

export default EnfantAnimations;