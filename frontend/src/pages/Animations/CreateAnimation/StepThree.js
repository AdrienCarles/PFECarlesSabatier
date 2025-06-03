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
        Téléchargez une photo réelle représentant l'objet ou le concept de
        l'animation.
      </p>

      <Form.Group className="mb-3">
        <Form.Label>
          <FaCamera className="me-2" />
          Sélectionnez une image réelle *
        </Form.Label>
        <div className="d-flex flex-column align-items-center">
          {formData.imageReellePreview ? (
            <Card className="mb-3" style={{ width: "300px" }}>
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
                  style={{ maxHeight: "200px", objectFit: "contain" }}
                />
              </div>
              <Card.Body className="text-center">
                <Button
                  variant="outline-danger"
                  onClick={() =>
                    setFormData({
                      ...formData,
                      imageReelleFile: null,
                      imageReellePreview: null,
                    })
                  }
                >
                  Supprimer
                </Button>
              </Card.Body>
            </Card>
          ) : (
            <div className="text-center mb-3">
              <Button 
                variant="success" 
                className="mb-2"
                onClick={() => document.getElementById('imageReelleInput').click()}
              >
                <FaUpload className="me-2" />
                Choisir une image RÉELLE
              </Button>
              <div>
                <small className="text-muted">
                  Photos, images de la vie réelle...
                </small>
              </div>
            </div>
          )}

          <Form.Control
            id="imageReelleInput"
            type="file"
            accept="image/*"
            onChange={(e) => handleFileChange(e, "imageReelle")}
            className="d-none"
          />
        </div>
        <Form.Text>
          <div className="mt-2 p-2 border border-warning bg-light rounded">
            <div className="d-flex align-items-center">
              <div className="me-2 text-warning">
                <i className="fas fa-info-circle fa-lg"></i>
              </div>
              <div>
                <p className="mb-1 fw-bold text-dark">
                  Formats acceptés:{" "}
                  <span className="text-primary">JPG, JPEG, PNG, SVG, GIF, WebP</span>
                </p>
                <p className="mb-0 fw-bold text-dark">
                  Taille maximale: <span className="text-danger">10 Mo</span>
                </p>
              </div>
            </div>
          </div>
        </Form.Text>
      </Form.Group>
    </>
  );
};

export default StepThree;