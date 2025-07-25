import React, { useEffect, useState, useContext } from "react";
import { Container, Row, Col, Button, Spinner, Alert } from "react-bootstrap";
import { FaChild, FaCreditCard } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../context/AuthContext";
import axiosInstance from "../../api/axiosConfig";
import EnfantCard from "../Parent/EnfantCard";
import PaymentSummaryModal from "../Parent/PaymentSummaryModal";
import AbonnementModal from "./AbonnementModal";
import stripePromise from "../../config/stripe";
import "../../css/ParentDashboard.css";

const ParentDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [enfants, setEnfants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showAbonnementModal, setShowAbonnementModal] = useState(false);
  const [selectedEnfant, setSelectedEnfant] = useState(null);
  const [paymentInfo, setPaymentInfo] = useState(null);
  const [processingPayment, setProcessingPayment] = useState(false);

  useEffect(() => {
    const fetchEnfants = async () => {
      try {
        const response = await axiosInstance.get(
          `/enfa/mes-enfants/${user.id}`
        );

        const enfantsWithStatus = await Promise.all(
          response.data.map(async (enfant) => {
            try {
              const statusRes = await axiosInstance.get(
                `/abm/check-status/${enfant.ENFA_id}`
              );
              return { ...enfant, subscriptionStatus: statusRes.data };
            } catch (error) {
              console.error(`Erreur statut enfant ${enfant.ENFA_id}:`, error);
              return {
                ...enfant,
                subscriptionStatus: { hasActiveSubscription: false },
              };
            }
          })
        );

        setEnfants(enfantsWithStatus);
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

  const handleEnfantClick = async (enfant) => {
    console.log("Enfant sélectionné :", enfant);

    if (enfant.subscriptionStatus?.hasActiveSubscription) {
      console.log("Accès autorisé - redirection vers les exercices");
      navigate(`/parent/enfant/${enfant.ENFA_id}/series`);
      return;
    }

    try {
      setSelectedEnfant(enfant);
      setShowPaymentModal(true);

      const paymentInfoRes = await axiosInstance.get(
        `/abm/check-payment-required/${enfant.ENFA_id}`
      );
      setPaymentInfo(paymentInfoRes.data);
    } catch (error) {
      console.error("Erreur vérification paiement:", error);
      setError("Erreur lors de la vérification des informations de paiement");
      setShowPaymentModal(false);
    }
  };

  const handleSubscribe = async () => {
    if (!selectedEnfant) return;

    setProcessingPayment(true);
    setError("");

    try {
      const response = await axiosInstance.post("/abm/create-subscription", {
        enfantId: selectedEnfant.ENFA_id,
      });

      if (response.data.success) {
        if (response.data.paymentRequired) {
          if (response.data.sessionUrl) {
            console.log("Redirection vers Stripe:", response.data.sessionUrl);
            window.location.href = response.data.sessionUrl;
            return;
          } else if (response.data.sessionId) {
            try {
              const stripe = await stripePromise;
              const { error } = await stripe.redirectToCheckout({
                sessionId: response.data.sessionId,
              });

              if (error) {
                console.error("Erreur redirection Stripe:", error);
                setError("Erreur lors de la redirection vers le paiement");
              }
            } catch (stripeError) {
              console.error("Erreur chargement Stripe:", stripeError);
              setError("Erreur lors du chargement du système de paiement");
            }
            return;
          }

          if (response.data.simulated) {
            setShowPaymentModal(false);
            setError("");
            window.location.reload();
          }
        } else {
          setShowPaymentModal(false);
          setError("");
          window.location.reload();
        }
      }
    } catch (error) {
      console.error("Erreur souscription:", error);
      setError(
        error.response?.data?.message ||
          "Erreur lors de la souscription à l'abonnement"
      );
    } finally {
      setProcessingPayment(false);
    }
  };

  const closePaymentModal = () => {
    setShowPaymentModal(false);
    setSelectedEnfant(null);
    setPaymentInfo(null);
  };

  return (
    <Container fluid className="py-4">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-2">
        <h2 className="mb-2 mb-md-0 fs-4 fs-md-2">Mes Enfants</h2>
        <Button
          variant="outline-primary"
          size="sm"
          className="d-flex align-items-center justify-content-center w-100 w-md-auto text-nowrap"
          style={{
            fontSize: window.innerWidth < 576 ? "0.75rem" : "0.85rem",
            padding:
              window.innerWidth < 576 ? "0.4rem 0.6rem" : "0.5rem 0.75rem",
          }}
          onClick={() => setShowAbonnementModal(true)}
        >
          <FaCreditCard
            className="me-1 me-md-2"
            style={{ fontSize: window.innerWidth < 576 ? "0.8rem" : "1rem" }}
          />
          <span className="d-none d-sm-inline">
            Informations sur mes abonnements
          </span>
          <span className="d-inline d-sm-none">Abonnements</span>
        </Button>
      </div>

      {error && (
        <Alert variant="danger" className="mb-4">
          {error}
        </Alert>
      )}

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" role="status" />
        </div>
      ) : enfants.length === 0 ? (
        <div className="text-center text-muted">
          <FaChild size={40} className="mb-3" />
          <p>Aucun enfant trouvé.</p>
        </div>
      ) : (
        <Row xs={1} sm={2} md={2} lg={3} xl={4} className="g-3">
          {enfants.map((enfant) => (
            <Col key={enfant.ENFA_id}>
              <EnfantCard
                enfant={enfant}
                onClick={() => handleEnfantClick(enfant)}
              />
            </Col>
          ))}
        </Row>
      )}

      {/* Modal récapitulative de paiement */}
      <PaymentSummaryModal
        show={showPaymentModal}
        onHide={closePaymentModal}
        enfant={selectedEnfant}
        paymentInfo={paymentInfo}
        onSubscribe={handleSubscribe}
        processing={processingPayment}
      />

      {/* Modale de gestion des abonnements */}
      <AbonnementModal
        show={showAbonnementModal}
        onHide={() => setShowAbonnementModal(false)}
        parentId={user?.id}
      />
    </Container>
  );
};

export default ParentDashboard;
