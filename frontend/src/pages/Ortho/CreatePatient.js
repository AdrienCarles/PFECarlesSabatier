import React, { useState } from "react";
import { Modal, Button, Form, Alert, Row, Col } from "react-bootstrap";
import { FaUserPlus, FaBaby } from "react-icons/fa";
import axiosInstance from "../../api/axiosConfig";

const CreatePatient = ({
  show,
  handleClose,
  onPatientCreated,
  orthophonisteId,
}) => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // États du formulaire parent (sans mot de passe)
  const [parentData, setParentData] = useState({
    USR_nom: "",
    USR_prenom: "",
    USR_email: "",
    USR_telephone: "",
  });

  // États du formulaire enfant
  const [childData, setChildData] = useState({
    ENFA_nom: "",
    ENFA_prenom: "",
    ENFA_dateNaissance: "",
    ENFA_niveauAudition: "leger",
    ENFA_dateDebutSuivi: "",
    ENFA_notesSuivi: "",
  });

  // Réinitialiser le formulaire
  const resetForm = () => {
    setParentData({
      USR_nom: "",
      USR_prenom: "",
      USR_email: "",
      USR_telephone: "",
    });
    setChildData({
      ENFA_nom: "",
      ENFA_prenom: "",
      ENFA_dateNaissance: "",
      ENFA_niveauAudition: "leger",
      ENFA_dateDebutSuivi: "",
      ENFA_notesSuivi: "",
    });
    setError("");
  };

  // Gestionnaire de fermeture
  const handleModalClose = () => {
    resetForm();
    handleClose();
  };

  // Gestionnaires de changement
  const handleParentChange = (e) =>
    setParentData({ ...parentData, [e.target.name]: e.target.value });

  const handleChildChange = (e) =>
    setChildData({ ...childData, [e.target.name]: e.target.value });

  // Validation du formulaire
  const validateForm = () => {
    // Validation parent
    if (
      !parentData.USR_nom ||
      !parentData.USR_prenom ||
      !parentData.USR_email
    ) {
      setError("Veuillez remplir tous les champs obligatoires du parent.");
      return false;
    }

    // Validation enfant
    if (
      !childData.ENFA_nom ||
      !childData.ENFA_prenom ||
      !childData.ENFA_dateNaissance ||
      !childData.ENFA_dateDebutSuivi
    ) {
      setError("Veuillez remplir tous les champs obligatoires de l'enfant.");
      return false;
    }

    // Validation email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(parentData.USR_email)) {
      setError("Veuillez saisir un email valide.");
      return false;
    }

    return true;
  };

  // Soumission du formulaire complet
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError("");
    
    try {
      const response = await axiosInstance.post("/usr/patient-complet", {
        parentData,
        childData,
        orthophonisteId,
      });

      if (onPatientCreated) {
        onPatientCreated(response.data.enfant);
      }

      handleModalClose();
    } catch (error) {
      console.error("Erreur création patient complet:", error);
      setError(
        error.response?.data?.message ||
          "Erreur lors de la création du patient."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      show={show}
      onHide={handleModalClose}
      centered
      size="lg"
      backdrop="static"
    >
      <Modal.Header closeButton className="bg-light">
        <Modal.Title>
          <FaUserPlus className="me-2" />
          Créer un nouveau patient
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}

        <Form onSubmit={handleSubmit}>
          {/* Informations du parent */}
          <div className="mb-4">
            <h6 className="text-primary mb-3">
              👤 Informations du parent responsable
            </h6>
            <div className="border-bottom mb-3"></div>
          </div>

          <Alert variant="info" className="mb-4">
            <small>
              📧 <strong>Activation par email :</strong> Le parent recevra un
              email d'activation pour configurer son mot de passe et accéder à
              son compte.
            </small>
          </Alert>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Nom *</Form.Label>
                <Form.Control
                  type="text"
                  name="USR_nom"
                  value={parentData.USR_nom}
                  onChange={handleParentChange}
                  required
                  placeholder="Nom du parent"
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Prénom *</Form.Label>
                <Form.Control
                  type="text"
                  name="USR_prenom"
                  value={parentData.USR_prenom}
                  onChange={handleParentChange}
                  required
                  placeholder="Prénom du parent"
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={8}>
              <Form.Group className="mb-3">
                <Form.Label>Email *</Form.Label>
                <Form.Control
                  type="email"
                  name="USR_email"
                  value={parentData.USR_email}
                  onChange={handleParentChange}
                  required
                  placeholder="email@exemple.com"
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Téléphone</Form.Label>
                <Form.Control
                  type="tel"
                  name="USR_telephone"
                  value={parentData.USR_telephone}
                  onChange={handleParentChange}
                  placeholder="06 12 34 56 78"
                />
              </Form.Group>
            </Col>
          </Row>

          {/* Informations de l'enfant */}
          <div className="mb-4 mt-4">
            <h6 className="text-success mb-3">🧒 Informations du patient</h6>
            <div className="border-bottom mb-3"></div>
          </div>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Nom de l'enfant *</Form.Label>
                <Form.Control
                  type="text"
                  name="ENFA_nom"
                  value={childData.ENFA_nom}
                  onChange={handleChildChange}
                  required
                  placeholder="Nom de l'enfant"
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Prénom *</Form.Label>
                <Form.Control
                  type="text"
                  name="ENFA_prenom"
                  value={childData.ENFA_prenom}
                  onChange={handleChildChange}
                  required
                  placeholder="Prénom de l'enfant"
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Date de naissance *</Form.Label>
                <Form.Control
                  type="date"
                  name="ENFA_dateNaissance"
                  value={childData.ENFA_dateNaissance}
                  onChange={handleChildChange}
                  required
                  max={new Date().toISOString().split("T")[0]}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Niveau d'audition *</Form.Label>
                <Form.Select
                  name="ENFA_niveauAudition"
                  value={childData.ENFA_niveauAudition}
                  onChange={handleChildChange}
                  required
                >
                  <option value="leger">Léger</option>
                  <option value="modere">Modéré</option>
                  <option value="severe">Sévère</option>
                  <option value="profond">Profond</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>Date début de suivi *</Form.Label>
            <Form.Control
              type="date"
              name="ENFA_dateDebutSuivi"
              value={childData.ENFA_dateDebutSuivi}
              onChange={handleChildChange}
              required
              max={new Date().toISOString().split("T")[0]}
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label>Notes de suivi</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="ENFA_notesSuivi"
              value={childData.ENFA_notesSuivi}
              onChange={handleChildChange}
              placeholder="Notes sur le suivi du patient..."
              maxLength={500}
            />
            <Form.Text className="text-muted">
              {childData.ENFA_notesSuivi.length}/500 caractères
            </Form.Text>
          </Form.Group>

          <div className="d-flex gap-2">
            <Button
              variant="outline-secondary"
              onClick={handleModalClose}
              disabled={loading}
              className="flex-shrink-0"
            >
              Annuler
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={loading}
              className="flex-grow-1"
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" />
                  Création en cours...
                </>
              ) : (
                <>
                  <FaBaby className="me-2" />
                  Créer le Patient
                </>
              )}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default CreatePatient;
