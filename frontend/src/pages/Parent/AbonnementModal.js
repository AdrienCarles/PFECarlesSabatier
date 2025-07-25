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
import { FaCreditCard, FaCalendar, FaEuroSign } from "react-icons/fa";
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
      console.log(`Chargement des enfants enrichis pour parent ${parentId}`);
      const response = await axiosInstance.get(`/enfa/mes-enfants/${parentId}`);
      
      console.log("Données enfants enrichies:", response.data);
      setEnfants(response.data);
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
    return `${price} €` || "Gratuit";
  };

  // Fonction pour obtenir le prix à afficher (prix abonnement actif ou prix orthophoniste)
  const getDisplayPrice = (enfant) => {
    if (enfant.affichage?.prix !== null && enfant.affichage?.prix !== undefined) {
      return enfant.affichage.prix;
    }
    return null;
  };

  // Fonction pour obtenir le prix configuré par l'orthophoniste
  const getOrthoPrix = (enfant) => {
    return enfant.paymentInfo?.prix || null;
  };

  // Fonction pour obtenir le statut avec variante Bootstrap
  const getStatusInfo = (enfant) => {
    const statut = enfant.affichage?.statut || enfant.subscriptionStatus?.statut || "Inconnu";
    
    switch (statut) {
      case "Abonné":
        return { text: "Abonné", variant: "success" };
      case "En attente de paiement":
        return { text: "En attente", variant: "warning" };
      case "Gratuit":
        return { text: "Gratuit", variant: "info" };
      default:
        return { text: "Inconnu", variant: "secondary" };
    }
  };

  // Fonction pour calculer le coût actuel mensuel
  const calculateCurrentMonthlyCost = () => {
    const total = enfants
      .filter(e => e.subscriptionStatus?.hasActiveSubscription)
      .reduce((total, e) => {
        const price = getDisplayPrice(e);
        return total + (typeof price === 'number' ? price : 0);
      }, 0);
    return Number(total).toFixed(2);
  };

  // Fonction pour calculer le coût potentiel
  const calculatePotentialCost = () => {
    const total = enfants
      .filter(e => e.paymentInfo?.required && !e.subscriptionStatus?.hasActiveSubscription)
      .reduce((total, e) => {
        const price = getOrthoPrix(e);
        return total + (typeof price === 'number' ? price : 0);
      }, 0);
    return Number(total).toFixed(2);
  };

  return (
    <Modal show={show} onHide={onHide} size="xl" centered backdrop="static">
      <Modal.Header closeButton className="bg-primary text-white">
        <Modal.Title className="d-flex align-items-center">
          <FaCreditCard className="me-2" />
          Informations des Abonnements
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
            <div className="d-md-none">
              {enfants.map((enfant) => {
                const statusInfo = getStatusInfo(enfant);
                const displayPrice = getDisplayPrice(enfant);
                const orthoPrix = getOrthoPrix(enfant);
                
                return (
                  <Card key={enfant.ENFA_id} className="mb-3 shadow-sm">
                    <Card.Header className="bg-light">
                      <div className="d-flex justify-content-between align-items-center">
                        <h6 className="mb-0">
                          {enfant.ENFA_prenom} {enfant.ENFA_nom}
                        </h6>
                        <Badge bg={statusInfo.variant}>
                          {statusInfo.text}
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
                          <small className="text-muted">Prix actuel:</small>
                          <div className="fw-bold text-primary">
                            {formatPrice(displayPrice)}
                          </div>
                        </Col>
                      </Row>

                      {/* Informations orthophoniste */}
                      {enfant.orthophoniste && (
                        <Row className="mt-2">
                          <Col xs={12}>
                            <small className="text-muted">Orthophoniste:</small>
                            <div className="small">
                              {enfant.orthophoniste.USR_prenom} {enfant.orthophoniste.USR_nom}
                            </div>
                          </Col>
                        </Row>
                      )}

                      {/* Prix configuré par l'orthophoniste */}
                      {orthoPrix && (
                        <Row className="mt-2">
                          <Col xs={12}>
                            <small className="text-muted">Tarif orthophoniste:</small>
                            <div className="text-warning fw-bold">
                              <FaEuroSign className="me-1" />
                              {orthoPrix}€/mois
                            </div>
                          </Col>
                        </Row>
                      )}

                      {/* Dates d'abonnement si actif */}
                      {enfant.affichage?.dateDebut && (
                        <Row className="mt-2">
                          <Col xs={6}>
                            <small className="text-muted">Début:</small>
                            <div className="small">
                              {formatDate(enfant.affichage.dateDebut)}
                            </div>
                          </Col>
                          <Col xs={6}>
                            <small className="text-muted">Fin:</small>
                            <div className="small">
                              {formatDate(enfant.affichage.dateFin)}
                            </div>
                          </Col>
                        </Row>
                      )}

                      {enfant.affichage?.modePaiement && (
                        <Row className="mt-2">
                          <Col xs={12}>
                            <small className="text-muted">Mode paiement:</small>
                            <div>
                              <Badge bg="info" className="small">
                                {enfant.affichage.modePaiement}
                              </Badge>
                            </div>
                          </Col>
                        </Row>
                      )}
                    </Card.Body>
                  </Card>
                );
              })}
            </div>

            <div className="d-none d-md-block">
              <Table striped bordered hover responsive>
                <thead className="table-primary">
                  <tr>
                    <th>Enfant</th>
                    <th>Âge</th>
                    <th>Orthophoniste</th>
                    <th>Statut</th>
                    <th>Prix actuel</th>
                    <th>Date début</th>
                    <th>Date fin</th>
                  </tr>
                </thead>
                <tbody>
                  {enfants.map((enfant) => {
                    const statusInfo = getStatusInfo(enfant);
                    const displayPrice = getDisplayPrice(enfant);
                    
                    return (
                      <tr key={enfant.ENFA_id}>
                        <td className="fw-bold">
                          {enfant.ENFA_prenom} {enfant.ENFA_nom}
                        </td>
                        <td>{enfant.ENFA_age} ans</td>
                        <td>
                          {enfant.orthophoniste ? (
                            <div className="small">
                              {enfant.orthophoniste.USR_prenom} {enfant.orthophoniste.USR_nom}
                            </div>
                          ) : (
                            <span className="text-muted">-</span>
                          )}
                        </td>
                        <td>
                          <Badge bg={statusInfo.variant}>
                            {statusInfo.text}
                          </Badge>
                        </td>
                        <td className="fw-bold text-primary">
                          <FaEuroSign className="me-1" />
                          {formatPrice(displayPrice)}
                        </td>
                        <td>
                          <FaCalendar className="me-1 text-muted" />
                          {formatDate(enfant.affichage?.dateDebut)}
                        </td>
                        <td>
                          <FaCalendar className="me-1 text-muted" />
                          {formatDate(enfant.affichage?.dateFin)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </div>

            {/* Résumé enrichi */}
            <div className="mt-4 p-3 bg-light rounded">
              <h6 className="mb-3">Résumé des Abonnements</h6>
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
                      {enfants.filter(e => e.subscriptionStatus?.hasActiveSubscription).length}
                    </div>
                    <small className="text-muted">Abonnements actifs</small>
                  </div>
                </Col>
                <Col md={4}>
                  <div className="text-center">
                    <div className="fs-4 fw-bold text-warning">
                      {enfants.filter(e => e.paymentInfo?.required && !e.subscriptionStatus?.hasActiveSubscription).length}
                    </div>
                    <small className="text-muted">En attente paiement</small>
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