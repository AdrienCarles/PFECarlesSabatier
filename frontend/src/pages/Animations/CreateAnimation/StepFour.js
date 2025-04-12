import React from "react";
import { Form, Card, Button } from "react-bootstrap";
import { FaUpload } from "react-icons/fa";

const StepFour = ({ formData, setFormData, handleFileChange }) => {
  return (
    <>
      <h4 className="mb-3">Son de l'animation</h4>
      <Form.Group className="mb-3">
        <Form.Label>Sélectionnez un fichier audio *</Form.Label>
        <div className="d-flex flex-column align-items-center">
          {formData.audioName ? (
            <Card className="mb-3 w-100">
              <Card.Body className="text-center">
                <div className="mb-3">
                  <strong>Fichier audio sélectionné:</strong> {formData.audioName}
                </div>
                
                {formData.audioFile && (
                  <audio controls className="w-100 mb-3">
                    <source src={URL.createObjectURL(formData.audioFile)} />
                    Votre navigateur ne supporte pas l'élément audio.
                  </audio>
                )}
                
                <Button 
                  variant="outline-danger" 
                  onClick={() => setFormData({
                    ...formData, 
                    audioFile: null, 
                    audioName: ""
                  })}
                >
                  Supprimer
                </Button>
              </Card.Body>
            </Card>
          ) : (
            <div className="upload-box p-5 border rounded text-center mb-3 w-100">
              <FaUpload size={40} className="mb-3 text-secondary" />
              <p>Glissez-déposez votre fichier audio ici ou cliquez pour parcourir</p>
            </div>
          )}
          
          <Form.Control
            type="file"
            accept="audio/*"
            onChange={(e) => handleFileChange(e, "audio")}
            className={formData.audioName ? "d-none" : "w-100"}
          />
        </div>
        <Form.Text className="text-muted">
          Formats acceptés: MP3, WAV, OGG
        </Form.Text>
      </Form.Group>
    </>
  );
};

export default StepFour;