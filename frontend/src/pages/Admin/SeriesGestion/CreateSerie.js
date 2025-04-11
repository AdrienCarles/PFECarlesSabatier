import React, { useState } from "react";
import { Modal, Form, Button, Alert, Image } from "react-bootstrap";
import axiosInstance from "../../../api/axiosConfig";

const CreateSerie = ({ show, handleClose, addSerie }) => {
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    SES_titre: "",
    SES_theme: "",
    SES_description: "",
    SES_statut: "en_attente",
  });

  // État séparé pour le fichier image
  const [imageFile, setImageFile] = useState(null);
  // État pour prévisualiser l'image
  const [imagePreview, setImagePreview] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Gestion du changement de fichier image
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Vérifications de base pour le fichier
    const validImageTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/svg+xml",
    ];
    if (!validImageTypes.includes(file.type)) {
      setError("Format d'image non supporté. Utilisez JPG, PNG, GIF ou SVG.");
      return;
    }

    // Limite de taille (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("L'image est trop volumineuse (max 5MB)");
      return;
    }

    // Stocker le fichier pour l'envoi
    setImageFile(file);

    // Créer une URL de prévisualisation
    const previewURL = URL.createObjectURL(file);
    setImagePreview(previewURL);

    setError("");
  };

  const resetForm = () => {
    setFormData({
      SES_titre: "",
      SES_theme: "",
      SES_description: "",
      SES_statut: "en_attente",
    });
    setImageFile(null);
    setImagePreview(null);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // Créer un FormData pour envoyer les données + le fichier
      const formDataToSend = new FormData();
      
      // Ajouter les champs de texte
      Object.keys(formData).forEach(key => {
        formDataToSend.append(key, formData[key]);
      });
      
      // Ajouter le fichier image s'il existe
      if (imageFile) {
        formDataToSend.append('SES_icone', imageFile);
      }
      
      // Envoyer la requête avec le bon header Content-Type
      const response = await axiosInstance.post("/ses", formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
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
            <Form.Label>Thème de la série (Optionnel):</Form.Label>
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
              type="text"
              name="SES_description"
              value={formData.SES_description}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Icône de la Série :</Form.Label>
            <Form.Control
              type="file"
              accept="image/jpeg, image/png, image/gif, image/svg+xml"
              onChange={handleFileChange}
              required
            />
            <Form.Text className="text-muted">
              Formats acceptés: JPG, PNG, GIF, SVG. Taille max: 5MB
            </Form.Text>
          </Form.Group>

          {/* Prévisualisation de l'image */}
          {imagePreview && (
            <div className="text-center mb-3">
              <p>Aperçu:</p>
              <Image 
                src={imagePreview} 
                alt="Aperçu" 
                style={{ maxHeight: '200px', maxWidth: '100%' }} 
                thumbnail 
              />
            </div>
          )}

          <Button variant="primary" type="submit" className="w-100">
            Créer la série
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default CreateSerie;
