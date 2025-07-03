import React from "react";
import { Modal, Button, Alert, Spinner } from "react-bootstrap";
import { FaChild, FaCreditCard, FaCheck, FaLock } from "react-icons/fa";

const PaymentSummaryModal = ({
  show,
  onHide,
  enfant,
  paymentInfo,
  onSubscribe,
  processing,
}) => {
  if (!enfant || !paymentInfo) {
    return (
      <Modal show={show} onHide={onHide} centered>
        <Modal.Body className="text-center py-4">
          <Spinner animation="border" />
          <p className="mt-2">Chargement des informations...</p>
        </Modal.Body>
      </Modal>
    );
  }

  return (
    <Modal show={show} onHide={onHide} centered size="md">
      <Modal.Header closeButton>
        <Modal.Title>
          <FaCreditCard className="me-2" />
          {paymentInfo.required ? "Paiement requis" : "Abonnement gratuit"}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <div className="text-center mb-4">
          <FaChild size={60} className="text-primary mb-3" />
          <h5>
            {enfant.ENFA_prenom} {enfant.ENFA_nom}
          </h5>
          <p className="text-muted">
            Orthophoniste : {paymentInfo.orthophoniste?.USR_prenom}{" "}
            {paymentInfo.orthophoniste?.USR_nom}
          </p>
        </div>

        {paymentInfo.required ? (
          <div>
            <Alert variant="info">
              <h6>
                <FaLock className="me-2" />
                Abonnement payant requis
              </h6>
              <p className="mb-2">
                L'orthophoniste de {enfant.ENFA_prenom} exige un abonnement
                payant pour accéder aux exercices.
              </p>
            </Alert>

            <div className="bg-light p-3 rounded mb-3">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span>
                  <strong>Prix mensuel :</strong>
                </span>
                <span className="h5 text-success mb-0">
                  {paymentInfo.prix}€
                </span>
              </div>
              <small className="text-muted">
                Accès illimité aux exercices pendant 1 mois
              </small>
            </div>

            <div className="text-center">
              {process.env.NODE_ENV === "development" ? (
                <Alert variant="warning" className="small">
                  <strong>Mode développement :</strong>
                  <br />
                  Vous serez redirigé vers une page de test Stripe.
                  <br />
                  Utilisez la carte test : 4242 4242 4242 4242
                </Alert>
              ) : (
                <p className="small text-muted mb-3">
                  <FaLock className="me-1" />
                  Vous serez redirigé vers notre plateforme de paiement
                  sécurisée
                </p>
              )}
            </div>
          </div>
        ) : (
          <Alert variant="success">
            <h6>
              <FaCheck className="me-2" />
              Abonnement gratuit
            </h6>
            <p className="mb-0">
              L'orthophoniste de {enfant.ENFA_prenom} propose un accès gratuit
              aux exercices. L'abonnement sera activé immédiatement.
            </p>
          </Alert>
        )}
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onHide} disabled={processing}>
          Annuler
        </Button>
        <Button
          variant={paymentInfo.required ? "success" : "primary"}
          onClick={onSubscribe}
          disabled={processing}
        >
          {processing ? (
            <>
              <Spinner animation="border" size="sm" className="me-2" />
              Traitement...
            </>
          ) : paymentInfo.required ? (
            <>
              <FaCreditCard className="me-2" />
              Procéder au paiement ({paymentInfo.prix}€)
            </>
          ) : (
            <>
              <FaCheck className="me-2" />
              Activer l'abonnement gratuit
            </>
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default PaymentSummaryModal;
