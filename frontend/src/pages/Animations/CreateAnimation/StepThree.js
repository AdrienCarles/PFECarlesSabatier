import React from "react";
import { Form, Card, Button, Badge } from "react-bootstrap";
import { FaUpload, FaCamera } from "react-icons/fa";

const StepThree = ({ formData, setFormData, handleFileChange }) => {
  return (
    <>
      <h4 className="mb-3">
        Image réelle <Badge bg="success">Type: RÉEL</Badge>
      </h4>
      <p className="text-muted">
        Téléchargez une photo réelle représentant l'objet ou le concept de l'animation.
      </p>
      
      <Form.Group className="mb-3">
        <Form.Label>
          <FaCamera className="me-2" />
          Sélectionnez une image réelle *
        </Form.Label>
        <div className="d-flex flex-column align-items-center">
          {formData.imageReellePreview ? (
            <Card className="mb-3" style={{ width: '300px' }}>
              <div className="position-relative">
                <Badge 
                  bg="success" 
                  className="position-absolute top-0 start-0 m-2"
                >
                  RÉEL
                </Badge>
                <Card.Img 
                  variant="top" 
                  src={formData.imageReellePreview} 
                  style={{ maxHeight: '200px', objectFit: 'contain' }}
                />
              </div>
              <Card.Body className="text-center">
                <Button 
                  variant="outline-danger" 
                  onClick={() => setFormData({
                    ...formData, 
                    imageReelleFile: null, 
                    imageReellePreview: null
                  })}
                >
                  Supprimer
                </Button>
              </Card.Body>
            </Card>
          ) : (
            <div className="upload-box p-5 border rounded text-center mb-3 border-success" style={{ borderStyle: 'dashed' }}>
              <FaUpload size={40} className="mb-3 text-secondary" />
              <p>Glissez-déposez votre image RÉELLE ici ou cliquez pour parcourir</p>
              <small className="text-muted">Photos, images de la vie réelle...</small>
            </div>
          )}
          
          <Form.Control
            type="file"
            accept="image/*"
            onChange={(e) => handleFileChange(e, "imageReelle")}
            className={formData.imageReellePreview ? "d-none" : ""}
          />
        </div>
        <Form.Text className="text-muted">
          Format recommandé: JPG ou PNG, résolution minimale 800x600. Idéalement une photo réelle.
        </Form.Text>
      </Form.Group>
    </>
  );
};

export default StepThree;