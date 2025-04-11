import React, { useState, useEffect } from "react";
import { Modal, Form, Button, Alert } from "react-bootstrap";
import axiosInstance from "../../../api/axiosConfig";
import ImageUploader from "../../../components/common/ImageUploader";
import fileService from "../../../services/fileService";


const EditSerie = ({ show, handleClose, updateSerie, serieId }) => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [serieData, setSerieData] = useState("");
  const [formData, setFormData] = useState({
    SES_titre: "",
    SES_theme: "",
    SES_description: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [currentImage, setCurrentImage] = useState(null);

  // Charger les données de la serie lorsque le modal s'ouvre
  useEffect(() => {
    if (show && serieId) {
      setLoading(true);
      axiosInstance
        .get(`/ses/${serieId}`)
        .then((response) => {
          const serieData = response.data;
          setSerieData(serieData);
          setFormData({
            SES_titre: serieData.SES_titre || "",
            SES_theme: serieData.SES_theme || "",
            SES_description: serieData.SES_description || "",
          });

          if (serieData.SES_icone) {
            setCurrentImage(
              `${process.env.REACT_APP_API_URL}${serieData.SES_icone}`
            );
          }

          setLoading(false);
        })
        .catch((error) => {
          console.error("Erreur lors du chargement:", error);
          setError("Impossible de charger les données de la série");
          setLoading(false);
        });
    }
  }, [show, serieId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setError("");
    setImageFile(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // Utilisation du service pour gérer la requête avec fichiers
      const response = await fileService.putWithFiles(
        `/ses/${serieId}`,
        formData,
        { SES_icone: imageFile }
      );

      const updatedSerie = response.data;
      updateSerie(updatedSerie);

      resetForm();
      handleClose();
      alert("Série modifiée avec succès !");
    } catch (error) {
      console.error("Erreur lors de la modification de la série", error);
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError("Erreur lors de la modification de la série");
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
        <Modal.Title>Modifier la serie {serieData.SES_titre}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        {loading ? (
          <p>Chargement des données...</p>
        ) : (
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
                required
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

            <ImageUploader
              label="Icône de la Série"
              currentImage={currentImage}
              onFileSelected={setImageFile}
              altText={serieData.SES_titre}
              setError={setError}
            />

            <Button variant="primary" type="submit" className="w-100">
              Enregistrer les modifications
            </Button>
          </Form>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default EditSerie;
