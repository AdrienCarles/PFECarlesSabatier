import React from "react";
import { Button, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

const ReturnButton = ({ 
  to, 
  label = "Retour au dashboard",
  variant = "outline-secondary",
  className = "d-flex align-items-center",
  icon: IconComponent = FaArrowLeft,
  showIcon = true,
  colProps = { xs: "12", md: "auto", className: "mb-2 mb-md-0" }
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (to) {
      navigate(to);
    } else {
      // Si aucune destination n'est spécifiée, retourner à la page précédente
      navigate(-1);
    }
  };

  return (
    <Col {...colProps}>
      <Button
        variant={variant}
        onClick={handleClick}
        className={className}
      >
        {showIcon && IconComponent && <IconComponent className="me-2" />}
        {label}
      </Button>
    </Col>
  );
};

export default ReturnButton;