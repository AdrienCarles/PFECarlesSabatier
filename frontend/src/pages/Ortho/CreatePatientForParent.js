import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Alert, Row, Col } from "react-bootstrap";
import { FaUserPlus, FaBaby } from "react-icons/fa";
import axiosInstance from "../../api/axiosConfig";

const CreatePatientForParent = ({
  show,
  handleClose,
  onChildCreated,
  orthophonisteId,
  selectedParent,
  parents,
  editMode = false,
  patientToEdit = null
}) => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [availableParents, setAvailableParents] = useState([]);

  // États du formulaire enfant
  const [childData, setChildData] = useState({
    ENFA_nom: "",
    ENFA_prenom: "",
    ENFA_dateNaissance: "",
    ENFA_niveauAudition: "leger",
    ENFA_dateDebutSuivi: "",
    ENFA_notesSuivi: "",
    USR_parent_id: selectedParent?.USR_id || "",
  });

  // Utilitaire pour convertir une date en yyyy-MM-dd (format pour les champs <input type="date">)
  const formatDateInput = (dateString) => {
    if (!dateString) return "";
    const d = new Date(dateString);
    return d.toISOString().split("T")[0];
  };


  // Charger la liste des parents si pas fournie
  useEffect(() => {
    if (show && !selectedParent) {
      loadParents();
    }
  }, [show]);

  // Mettre à jour le parent sélectionné
  useEffect(() => {
    if (selectedParent) {
      setChildData(prev => ({
        ...prev,
        USR_parent_id: selectedParent.USR_id
      }));
    }
  }, [selectedParent]);

  useEffect(() => {
    if (editMode && patientToEdit) {
      setChildData({
        ENFA_nom: patientToEdit.ENFA_nom || "",
        ENFA_prenom: patientToEdit.ENFA_prenom || "",
        ENFA_dateNaissance: formatDateInput(patientToEdit.ENFA_dateNaissance),
        ENFA_niveauAudition: patientToEdit.ENFA_niveauAudition || "leger",
        ENFA_dateDebutSuivi: formatDateInput(patientToEdit.ENFA_dateDebutSuivi),
        ENFA_notesSuivi: patientToEdit.ENFA_notesSuivi || "",
        USR_parent_id: patientToEdit.USR_parent_id || selectedParent?.id || ""
      });
    }
  }, [editMode, patientToEdit, selectedParent]);

useEffect(() => {
  if (show && !editMode) {
    setChildData({
      ENFA_nom: "",
      ENFA_prenom: "",
      ENFA_dateNaissance: "",
      ENFA_niveauAudition: "leger",
      ENFA_dateDebutSuivi: "",
      ENFA_notesSuivi: "",
      USR_parent_id: selectedParent?.USR_id || "",
    });
  }
}, [show, editMode, selectedParent]);

  const loadParents = async () => {
    try {
      const response = await axiosInstance.get(`/enfa/parents/${orthophonisteId}`);
      setAvailableParents(response.data);
    } catch (err) {
      console.error("Erreur chargement parents:", err);
      setError("Erreur lors du chargement des parents.");
    }
  };

  // Réinitialiser le formulaire
  const resetForm = () => {
    setChildData({
      ENFA_nom: "",
      ENFA_prenom: "",
      ENFA_dateNaissance: "",
      ENFA_niveauAudition: "leger",
      ENFA_dateDebutSuivi: "",
      ENFA_notesSuivi: "",
      USR_parent_id: selectedParent?.USR_id || "",
    });
    setError("");
  };

  // Gestionnaire de fermeture
  const handleModalClose = () => {
    resetForm();
    handleClose();
  };

  // Gestionnaires de changement
  const handleChildChange = (e) =>
    setChildData({ ...childData, [e.target.name]: e.target.value });

  // Validation du formulaire
  const validateForm = () => {
    if (
      !childData.ENFA_nom ||
      !childData.ENFA_prenom ||
      !childData.ENFA_dateNaissance ||
      !childData.ENFA_dateDebutSuivi ||
      !childData.USR_parent_id
    ) {
      setError("Veuillez remplir tous les champs obligatoires.");
      return false;
    }

    return true;
  };

  // Soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      let response; // ✅ déclaration ici
      const enfantToSend = {
        ...childData,
        USR_orthophoniste_id: orthophonisteId,
      };

      if (editMode && patientToEdit?.ENFA_id) {
        // 🔁 Mise à jour d’un enfant existant
        response = await axiosInstance.put(`/enfa/${patientToEdit.ENFA_id}`, enfantToSend);
      } else {
        // ➕ Création d’un nouvel enfant
        enfantToSend.ENFA_dateCreation = new Date();
        response = await axiosInstance.post("/enfa", enfantToSend);
      }

      if (onChildCreated) {
        onChildCreated(response.data);
      }

      handleModalClose();
    } catch (error) {
      console.error("Erreur création enfant:", error);
      setError(
        error.response?.data?.message ||
        "Erreur lors de la création de l'enfant."
      );
    } finally {
      setLoading(false);
    }
  };

  const parentsList = parents || availableParents;

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
          {editMode
            ? "Modifier les informations de l'enfant"
            : `Ajouter un enfant${selectedParent ? ` à ${selectedParent.USR_prenom} ${selectedParent.USR_nom}` : ""}`
          }
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}

        <Form onSubmit={handleSubmit}>
          {/* Sélection du parent (si pas pré-sélectionné) */}
          {!selectedParent && (
            <div className="mb-4">
              <h6 className="text-primary mb-3">
                👤 Sélection du parent
              </h6>
              <Form.Group className="mb-3">
                <Form.Label>Parent responsable *</Form.Label>
                <Form.Select
                  name="USR_parent_id"
                  value={childData.USR_parent_id}
                  onChange={handleChildChange}
                  required
                >
                  <option value="">Choisir un parent...</option>
                  {parentsList.map((parent) => (
                    <option key={parent.USR_id} value={parent.USR_id}>
                      {parent.USR_prenom} {parent.USR_nom} - {parent.USR_email}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </div>
          )}

          {/* Informations de l'enfant */}
          <div className="mb-4">
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
              variant="success"
              size="lg"
              disabled={loading}
              className="flex-grow-1"
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" />
                  {editMode ? "Mise à jour en cours..." : "Création en cours..."}
                </>
              ) : (
                <>
                  <FaBaby className="me-2" />
                  {editMode ? "Mettre à jour" : "Créer l'Enfant"}
                </>
              )}

            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};


export default CreatePatientForParent;