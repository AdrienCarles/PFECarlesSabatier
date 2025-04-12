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

      <Form.Group className="mb-3">
        <Form.Label>Description</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          name="ANI_description"
          value={formData.ANI_description}
          onChange={handleChange}
        />
      </Form.Group>
    </>
  );
};

export default StepOne;