import React from "react";
import { Form, Card, Button, Badge } from "react-bootstrap";
import { FaUpload, FaPencilAlt } from "react-icons/fa";

const StepTwo = ({ formData, setFormData, handleFileChange }) => {
  return (
    <>
      <h4 className="mb-3">
        Image dessin <Badge bg="primary">Type: DESSIN</Badge>
      </h4>
      <p className="text-muted">
        Téléchargez une image illustrative ou un dessin représentant l'objet ou le concept.
      </p>
      
      <Form.Group className="mb-3">
        <Form.Label>
          <FaPencilAlt className="me-2" /> 
          Sélectionnez une image de type dessin *
        </Form.Label>
        <div className="d-flex flex-column align-items-center">
          {formData.dessinPreview ? (
            <Card className="mb-3" style={{ width: '300px' }}>
              <div className="position-relative">
                <Badge 
                  bg="info" 
                  className="position-absolute top-0 start-0 m-2"
                >
                  DESSIN
                </Badge>
                <Card.Img 
                  variant="top" 
                  src={formData.dessinPreview} 
                  style={{ maxHeight: '200px', objectFit: 'contain' }} 
                />
              </div>
              <Card.Body className="text-center">
                <Button 
                  variant="outline-danger" 
                  onClick={() => setFormData({
                    ...formData, 
                    dessinFile: null, 
                    dessinPreview: null
                  })}
                >
                  Supprimer
                </Button>
              </Card.Body>
            </Card>
          ) : (
            <div className="upload-box p-5 border rounded text-center mb-3 border-primary" style={{ borderStyle: 'dashed' }}>
              <FaUpload size={40} className="mb-3 text-secondary" />
              <p>Glissez-déposez votre image de type DESSIN ici ou cliquez pour parcourir</p>
              <small className="text-muted">Illustrations, dessins, schémas...</small>
            </div>
          )}
          
          <Form.Control
            type="file"
            accept="image/*"
            onChange={(e) => handleFileChange(e, "dessin")}
            className={formData.dessinPreview ? "d-none" : ""}
          />
        </div>
        <Form.Text className="text-muted">
          Format recommandé: JPG ou PNG, résolution minimale 800x600
        </Form.Text>
      </Form.Group>
    </>
  );
};

export default StepTwo;