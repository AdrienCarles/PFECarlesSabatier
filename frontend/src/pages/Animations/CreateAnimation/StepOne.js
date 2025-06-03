import React from "react";
import { Form } from "react-bootstrap";

const StepOne = ({ formData, handleChange }) => {
  return (
    <>
      <h4 className="mb-3">Informations générales</h4>
      <Form.Group className="mb-3">
        <Form.Label>Titre de l'animation *</Form.Label>
        <Form.Control
          type="text"
          name="ANI_titre"
          value={formData.ANI_titre}
          onChange={handleChange}
          required
        />
      </Form.Group>
    </>
  );
};

export default StepOne;