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
        Téléchargez une image illustrative ou un dessin représentant l'objet ou
        le concept.
      </p>

      <Form.Group className="mb-3">
        <Form.Label>
          <FaPencilAlt className="me-2" />
          Sélectionnez une image de type dessin *
        </Form.Label>
        <div className="d-flex flex-column align-items-center">
          {formData.dessinPreview ? (
            <Card className="mb-3" style={{ width: "300px" }}>
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
                  style={{ maxHeight: "200px", objectFit: "contain" }}
                />
              </div>
              <Card.Body className="text-center">
                <Button
                  variant="outline-danger"
                  onClick={() =>
                    setFormData({
                      ...formData,
                      dessinFile: null,
                      dessinPreview: null,
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
                variant="primary" 
                className="mb-2"
                onClick={() => document.getElementById('dessinFileInput').click()}
              >
                <FaUpload className="me-2" />
                Choisir une image de type DESSIN
              </Button>
            </div>
          )}

          <Form.Control
            id="dessinFileInput"
            type="file"
            accept="image/*"
            onChange={(e) => handleFileChange(e, "dessin")}
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

export default StepTwo;