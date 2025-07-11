import React, { useState, useEffect } from "react";
import {
  Modal,
  Table,
  Button,
  Spinner,
  Alert,
  Badge,
  Card,
  Row,
  Col,
} from "react-bootstrap";
import { FaCreditCard, FaCalendar, FaEuroSign, FaTimes } from "react-icons/fa";
import axiosInstance from "../../api/axiosConfig";

const AbonnementModal = ({ show, onHide, parentId }) => {
  const [enfants, setEnfants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (show && parentId) {
      fetchAbonnements();
    }
  }, [show, parentId]);

  const fetchAbonnements = async () => {
    setLoading(true);
    setError("");
    try {
      console.log(`Chargement des enfants pour parent ${parentId}`);
      const response = await axiosInstance.get(`/enfa/mes-enfants/${parentId}`);

      const enfantsWithAbonnements = await Promise.all(
        response.data.map(async (enfant) => {
          try {
            // Récupérer le statut d'abonnement qui contient déjà l'objet abonnement
            const statusRes = await axiosInstance.get(
              `/abm/check-status/${enfant.ENFA_id}`
            );

            // Extraire les détails directement de la réponse statusRes
            let abonnementDetails = null;
            if (
              statusRes.data.hasActiveSubscription &&
              statusRes.data.abonnement
            ) {
              abonnementDetails = statusRes.data.abonnement;
            }

            return {
              ...enfant,
              subscriptionStatus: statusRes.data,
              abonnementDetails,
            };
          } catch (error) {
            console.error(`Erreur statut enfant ${enfant.ENFA_id}:`, error);
            return {
              ...enfant,
              subscriptionStatus: { hasActiveSubscription: false },
              abonnementDetails: null,
            };
          }
        })
      );

      console.log("Enfants avec abonnements:", enfantsWithAbonnements);
      setEnfants(enfantsWithAbonnements);
    } catch (err) {
      console.error("Erreur lors du chargement des abonnements:", err);
      setError("Impossible de charger les informations d'abonnements.");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("fr-FR");
  };

  const formatPrice = (price) => {
    if (price === null || price === undefined) return "Gratuit";
    return `${price}€`;
  };

  const getStatusVariant = (hasActive) => {
    return hasActive ? "success" : "warning";
  };

  const getStatusText = (hasActive) => {
    return hasActive ? "Actif" : "Inactif";
  };

  return (
    <Modal show={show} onHide={onHide} size="xl" centered backdrop="static">
      <Modal.Header closeButton className="bg-primary text-white">
        <Modal.Title className="d-flex align-items-center">
          <FaCreditCard className="me-2" />
          Gestion des Abonnements
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="p-4">
        {error && (
          <Alert variant="danger" className="mb-4">
            {error}
          </Alert>
        )}

        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" />
            <p className="mt-2 text-muted">Chargement des abonnements...</p>
          </div>
        ) : enfants.length === 0 ? (
          <div className="text-center text-muted py-5">
            <FaCreditCard size={40} className="mb-3" />
            <p>Aucun enfant trouvé.</p>
          </div>
        ) : (
          <>
            {/* Vue responsive pour mobile */}
            <div className="d-md-none">
              {enfants.map((enfant) => (
                <Card key={enfant.ENFA_id} className="mb-3 shadow-sm">
                  <Card.Header className="bg-light">
                    <div className="d-flex justify-content-between align-items-center">
                      <h6 className="mb-0">
                        {enfant.ENFA_prenom} {enfant.ENFA_nom}
                      </h6>
                      <Badge
                        bg={getStatusVariant(
                          enfant.subscriptionStatus?.hasActiveSubscription
                        )}
                      >
                        {getStatusText(
                          enfant.subscriptionStatus?.hasActiveSubscription
                        )}
                      </Badge>
                    </div>
                  </Card.Header>
                  <Card.Body>
                    <Row>
                      <Col xs={6}>
                        <small className="text-muted">Âge:</small>
                        <div>{enfant.ENFA_age} ans</div>
                      </Col>
                      <Col xs={6}>
                        <small className="text-muted">Prix:</small>
                        <div className="fw-bold text-primary">
                          {formatPrice(enfant.abonnementDetails?.ABM_prix)}
                        </div>
                      </Col>
                    </Row>
                    {enfant.abonnementDetails && (
                      <Row className="mt-2">
                        <Col xs={6}>
                          <small className="text-muted">Début:</small>
                          <div>
                            {formatDate(enfant.abonnementDetails.ABM_dateDebut)}
                          </div>
                        </Col>
                        <Col xs={6}>
                          <small className="text-muted">Fin:</small>
                          <div>
                            {formatDate(enfant.abonnementDetails.ABM_dateFin)}
                          </div>
                        </Col>
                      </Row>
                    )}
                  </Card.Body>
                </Card>
              ))}
            </div>

            {/* Vue tableau pour desktop */}
            <div className="d-none d-md-block">
              <Table striped bordered hover responsive>
                <thead className="table-primary">
                  <tr>
                    <th>Enfant</th>
                    <th>Âge</th>
                    <th>Statut</th>
                    <th>Prix</th>
                    <th>Date début</th>
                    <th>Date fin</th>
                  </tr>
                </thead>
                <tbody>
                  {enfants.map((enfant) => (
                    <tr key={enfant.ENFA_id}>
                      <td className="fw-bold">
                        {enfant.ENFA_prenom} {enfant.ENFA_nom}
                      </td>
                      <td>{enfant.ENFA_age} ans</td>
                      <td>
                        <Badge
                          bg={getStatusVariant(
                            enfant.subscriptionStatus?.hasActiveSubscription
                          )}
                        >
                          {getStatusText(
                            enfant.subscriptionStatus?.hasActiveSubscription
                          )}
                        </Badge>
                      </td>
                      <td className="fw-bold text-primary">
                        <FaEuroSign className="me-1" />
                        {formatPrice(enfant.abonnementDetails?.ABM_prix)}
                      </td>
                      <td>
                        <FaCalendar className="me-1 text-muted" />
                        {formatDate(enfant.abonnementDetails?.ABM_dateDebut)}
                      </td>
                      <td>
                        <FaCalendar className="me-1 text-muted" />
                        {formatDate(enfant.abonnementDetails?.ABM_dateFin)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>

            {/* Résumé */}
            <div className="mt-4 p-3 bg-light rounded">
              <h6 className="mb-2">Résumé</h6>
              <Row>
                <Col md={4}>
                  <div className="text-center">
                    <div className="fs-4 fw-bold text-primary">
                      {enfants.length}
                    </div>
                    <small className="text-muted">Enfants inscrits</small>
                  </div>
                </Col>
                <Col md={4}>
                  <div className="text-center">
                    <div className="fs-4 fw-bold text-success">
                      {
                        enfants.filter(
                          (e) => e.subscriptionStatus?.hasActiveSubscription
                        ).length
                      }
                    </div>
                    <small className="text-muted">Abonnements actifs</small>
                  </div>
                </Col>
                <Col md={4}>
                  <div className="text-center">
                    <div className="fs-4 fw-bold text-primary">
                      {enfants
                        .filter((e) => e.abonnementDetails?.ABM_prix)
                        .reduce(
                          (total, e) =>
                            total + (e.abonnementDetails.ABM_prix || 0),
                          0
                        )}
                      €
                    </div>
                    <small className="text-muted">Coût total mensuel</small>
                  </div>
                </Col>
              </Row>
            </div>
          </>
        )}
      </Modal.Body>

      <Modal.Footer className="bg-light">
        <Button variant="secondary" onClick={onHide}>
          Fermer
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AbonnementModal;
