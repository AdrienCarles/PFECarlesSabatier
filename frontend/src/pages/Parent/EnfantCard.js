import React from "react";
import { Card, Badge } from "react-bootstrap";
import { FaChild, FaCheck, FaTimes } from "react-icons/fa";

const EnfantCard = ({ enfant, onClick }) => {
  const hasActiveSubscription =
    enfant.subscriptionStatus?.hasActiveSubscription;

  return (
    <Card
      className="h-100 text-center shadow-sm hover-effect w-100"
      onClick={onClick}
      style={{
        cursor: "pointer",
        transition: "transform 0.2s ease-in-out",
        border: hasActiveSubscription
          ? "2px solid #198754"
          : "1px solid #dee2e6",
      }}
    >
      <Card.Body>
        <div className="mb-3 position-relative">
          <FaChild size={50} className="text-primary" />
          {hasActiveSubscription && (
            <Badge
              bg="success"
              className="position-absolute top-0 end-0"
              style={{ transform: "translate(25%, -25%)" }}
            >
              <FaCheck />
            </Badge>
          )}
        </div>
        <Card.Title className="mb-2">
          {enfant.ENFA_prenom} {enfant.ENFA_nom}
        </Card.Title>
        <Card.Text className="text-muted">
          <small>
            {enfant.ENFA_dateNaissance && (
              <div>
                Né(e) le :{" "}
                {new Date(enfant.ENFA_dateNaissance).toLocaleDateString(
                  "fr-FR"
                )}
              </div>
            )}
            {enfant.orthophoniste && (
              <div>
                <strong>Orthophoniste :</strong>
                <br />
                {enfant.orthophoniste.USR_prenom} {enfant.orthophoniste.USR_nom}
              </div>
            )}
          </small>
        </Card.Text>

        {/* Indicateur de statut */}
        <div className="mt-2">
          {hasActiveSubscription ? (
            <Badge bg="success" className="p-2">
              <FaCheck className="me-1" />
              Abonnement actif
            </Badge>
          ) : (
            <Badge bg="warning" className="p-2">
              <FaTimes className="me-1" />
              Accès limité
            </Badge>
          )}
        </div>
      </Card.Body>
    </Card>
  );
};

export default EnfantCard;