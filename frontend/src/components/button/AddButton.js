import React from "react";
import { Button } from "react-bootstrap";
import { FaPlus } from "react-icons/fa";

const AddButton = ({ 
  onClick,
  label = "Ajouter",
  variant = "outline-primary",
  size = "md",
  className = "",
  icon: IconComponent = FaPlus,
  showIcon = true,
  disabled = false,
  ...otherProps
}) => {
  return (
    <Button
      variant={variant}
      size={size}
      onClick={onClick}
      className={className}
      disabled={disabled}
      {...otherProps}
    >
      {showIcon && IconComponent && <IconComponent className="me-1" />}
      {label}
    </Button>
  );
};

export default AddButton;