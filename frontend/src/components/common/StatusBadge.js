import React from "react";
import { Badge, OverlayTrigger, Tooltip } from "react-bootstrap";
import { FaCheckCircle, FaTimesCircle, FaClock } from "react-icons/fa";

const StatusBadge = ({ status }) => {
  const getStatusConfig = (status) => {
    switch (status) {
      case "actif":
        return {
          variant: "success",
          icon: <FaCheckCircle className="me-1" />,
          label: "Actif",
        };
      case "inactif":
        return {
          variant: "danger",
          icon: <FaTimesCircle className="me-1" />,
          label: "Inactif",
        };
      case "en_attente":
        return {
          variant: "warning",
          icon: <FaClock className="me-1" />,
          label: "En attente",
        };
      default:
        return {
          variant: "secondary",
          icon: null,
          label: status || "Inconnu",
        };
    }
  };

  const { variant, icon, label } = getStatusConfig(status);

  const getStatusDescription = (status) => {
    switch (status) {
      case "actif":
        return "Cette série est active et disponible pour tous les utilisateurs approuvés.";
      case "inactif":
        return "Cette série est actuellement désactivée et n'est pas accessible aux utilisateurs.";
      case "en_attente":
        return "Cette série est en attente de validation par un administrateur.";
      default:
        return "Statut inconnu.";
    }
  };

  return (
    <OverlayTrigger
      placement="top"
      overlay={
        <Tooltip id={`tooltip-status-${status}`}>
          {getStatusDescription(status)}
        </Tooltip>
      }
    >
      <Badge
        bg={variant}
        className="d-flex align-items-center py-2 px-3"
        style={{ fontSize: "0.85rem", fontWeight: "500" }}
      >
        {icon} {label}
      </Badge>
    </OverlayTrigger>
  );
};

export default StatusBadge;
