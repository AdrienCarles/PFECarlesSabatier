import React, { useState } from "react";
import { Modal, Form, Button, Alert } from "react-bootstrap";
import ImageUploader from "../../../components/common/ImageUploader";
import fileService from "../../../services/fileService";

const CreateSerie = ({ show, handleClose, addSerie }) => {
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    SES_titre: "",
    SES_theme: "",
    SES_description: "",
    SES_statut: "en_attente",
  });
  const [imageFile, setImageFile] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setFormData({
      SES_titre: "",
      SES_theme: "",
      SES_description: "",
      SES_statut: "en_attente",
    });
    setImageFile(null);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!imageFile) {
      setError("Une image est requise pour créer une série");
      return;
    }

    try {
      const response = await fileService.postWithFiles(
        "/ses", 
        formData, 
        { SES_icone: imageFile }
      );
      
      const newSerie = response.data;
      addSerie(newSerie);
      
      resetForm();
      handleClose();
      alert("Série ajoutée avec succès !");
    } catch (error) {
      console.error("Erreur lors de l'ajout d'une série", error);
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError("Erreur lors de l'ajout d'une série");
      }
    }
  };

  return (
    <Modal
      show={show}
      onHide={() => {
        resetForm();
        handleClose();
      }}
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>Ajouter une Série</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Titre de la série :</Form.Label>
            <Form.Control
              type="text"
              name="SES_titre"
              value={formData.SES_titre}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Thème de la série (Optionnel) :</Form.Label>
            <Form.Control
              type="text"
              name="SES_theme"
              value={formData.SES_theme}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Description :</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="SES_description"
              value={formData.SES_description}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <ImageUploader
            label="Icône de la Série"
            onFileSelected={setImageFile}
            isRequired={true}
            setError={setError}
          />

          <Button variant="primary" type="submit" className="w-100">
            Créer la série
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default CreateSerie;