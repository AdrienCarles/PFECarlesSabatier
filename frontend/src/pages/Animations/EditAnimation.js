import React, { useState, useEffect } from "react";
import {
  Modal,
  Button,
  Form,
  Alert,
  Spinner,
  Row,
  Col,
  Card,
  Badge,
} from "react-bootstrap";
import axiosInstance from "../../api/axiosConfig";
import { FaSave, FaTimes, FaImage, FaMusic } from "react-icons/fa";

const EditAnimation = ({ show, handleClose, animation, updateAnimation }) => {
  const [formData, setFormData] = useState({
    ANI_titre: "",
    ANI_description: "",
    ANI_type: "",
  });
  const [files, setFiles] = useState({
    dessinImage: null,
    imageReelle: null,
    audioFile: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [previewMode, setPreviewMode] = useState("dessin");

  // Initialiser le formulaire avec les données de l'animation
  useEffect(() => {
    if (animation) {
      setFormData({
        ANI_titre: animation.ANI_titre || "",
        ANI_description: animation.ANI_description || "",
        ANI_type: animation.ANI_type || "",
      });
      setPreviewMode("dessin");
    }
  }, [animation]);

  // Reset du formulaire à la fermeture
  useEffect(() => {
    if (!show) {
      setFormData({
        ANI_titre: "",
        ANI_description: "",
        ANI_type: "",
      });
      setFiles({
        dessinImage: null,
        imageReelle: null,
        audioFile: null,
      });
      setError("");
      setPreviewMode("dessin");
    }
  }, [show]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const { name } = e.target;
    const file = e.target.files[0];
    setFiles((prev) => ({
      ...prev,
      [name]: file,
    }));
  };

  const validateForm = () => {
    if (!formData.ANI_titre.trim()) {
      setError("Le titre est obligatoire");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      const updateData = new FormData();

      // Ajouter les données texte
      Object.keys(formData).forEach((key) => {
        if (formData[key]) {
          updateData.append(key, formData[key]);
        }
      });

      // Ajouter les nouveaux fichiers s'ils sont présents
      if (files.dessinImage) {
        updateData.append("dessinImage", files.dessinImage);
      }
      if (files.imageReelle) {
        updateData.append("imageReelle", files.imageReelle);
      }
      if (files.audioFile) {
        updateData.append("audioFile", files.audioFile);
      }

      const response = await axiosInstance.put(
        `/ani/${animation.ANI_id}`,
        updateData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Mettre à jour l'animation dans le composant parent
      updateAnimation(response.data);

      // Fermer la modale
      handleClose();
    } catch (err) {
      console.error("Erreur lors de la modification:", err);
      setError(
        err.response?.data?.message ||
          "Erreur lors de la modification de l'animation"
      );
    } finally {
      setLoading(false);
    }
  };

  const togglePreview = () => {
    setPreviewMode((prev) => (prev === "dessin" ? "reel" : "dessin"));
  };

  if (!animation) {
    return null;
  }

  return (
    <Modal
      show={show}
      onHide={handleClose}
      size="xl"
      backdrop="static"
      className="animation-gestion-modal"
    >
      <Modal.Header closeButton className="bg-primary text-white">
        <Modal.Title>
          <FaSave className="me-2" />
          Modifier l'animation : {animation.ANI_titre}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Row>
            {/* Colonne gauche - Prévisualisation */}
            <Col md={4}>
              <Card className="mb-3">
                <Card.Header className="d-flex justify-content-between align-items-center">
                  <span>Prévisualisation actuelle</span>
                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={togglePreview}
                  >
                    {previewMode === "dessin" ? "Voir réel" : "Voir dessin"}
                  </Button>
                </Card.Header>
                <Card.Body className="p-0">
                  <div className="position-relative">
                    <img
                      src={`${process.env.REACT_APP_API_URL}${
                        previewMode === "reel"
                          ? animation.ANI_urlAnimation
                          : animation.ANI_urlAnimationDessin
                      }`}
                      alt={previewMode === "reel" ? "Image réelle" : "Dessin"}
                      className="img-fluid w-100"
                      style={{ height: "200px", objectFit: "contain" }}
                    />
                    <Badge
                      bg={previewMode === "reel" ? "primary" : "success"}
                      className="position-absolute top-0 end-0 m-2"
                    >
                      {previewMode === "reel" ? "Réel" : "Dessin"}
                    </Badge>
                  </div>
                </Card.Body>
              </Card>

              {/* Indicateur audio */}
              {animation.ANI_urlAudio && (
                <Card className="mb-3">
                  <Card.Body className="py-2">
                    <div className="d-flex align-items-center text-muted">
                      <FaMusic className="me-2" />
                      <small>Audio actuel disponible</small>
                    </div>
                  </Card.Body>
                </Card>
              )}
            </Col>

            {/* Colonne droite - Formulaire */}
            <Col md={4}>
              {/* Informations de base */}
              <Card className="mb-3">
                <Card.Header>Informations</Card.Header>
                <Card.Body>
                  <Form.Group className="mb-3">
                    <Form.Label>Titre *</Form.Label>
                    <Form.Control
                      type="text"
                      name="ANI_titre"
                      value={formData.ANI_titre}
                      onChange={handleInputChange}
                      placeholder="Titre de l'animation"
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
                      onChange={handleInputChange}
                      placeholder="Description de l'animation"
                    />
                  </Form.Group>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              {/* Nouveaux fichiers */}
              <Card className="mb-3">
                <Card.Header>
                  <FaImage className="me-2" />
                  Remplacer les images (optionnel)
                </Card.Header>
                <Card.Body>
                  <Form.Group className="mb-3">
                    <Form.Label>Nouveau dessin</Form.Label>
                    <Form.Control
                      type="file"
                      name="dessinImage"
                      onChange={handleFileChange}
                      accept="image/*"
                    />
                    <Form.Text className="text-muted">
                      Laissez vide pour conserver l'image actuelle
                    </Form.Text>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Nouvelle image réelle</Form.Label>
                    <Form.Control
                      type="file"
                      name="imageReelle"
                      onChange={handleFileChange}
                      accept="image/*"
                    />
                    <Form.Text className="text-muted">
                      Laissez vide pour conserver l'image actuelle
                    </Form.Text>
                  </Form.Group>
                </Card.Body>
              </Card>
            </Col>
            <Col md={12}>
              {/* Nouveaux fichiers */}
              <Card className="mb-3">
                <Card.Header>
                  <FaImage className="me-2" />
                  Remplacer l'audio (optionnel)
                </Card.Header>
                <Card.Body>
                  <Form.Group className="mb-0">
                    <Form.Label>Nouvel audio</Form.Label>
                    <Form.Control
                      type="file"
                      name="audioFile"
                      onChange={handleFileChange}
                      accept="audio/*"
                    />
                    <Form.Text className="text-muted">
                      Laissez vide pour conserver l'audio actuel
                    </Form.Text>
                  </Form.Group>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Form>
      </Modal.Body>

      <Modal.Footer className="bg-light">
        <Button variant="secondary" onClick={handleClose} disabled={loading}>
          Annuler
        </Button>
        <Button variant="primary" onClick={handleSubmit} disabled={loading}>
          {loading ? (
            <>
              <Spinner animation="border" size="sm" className="me-2" />
              Modification...
            </>
          ) : (
            <>
              <FaSave className="me-2" />
              Sauvegarder
            </>
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditAnimation;
