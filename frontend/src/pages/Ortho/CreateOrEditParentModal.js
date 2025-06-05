import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Alert, Row, Col } from "react-bootstrap";
import { FaUser, FaSave } from "react-icons/fa";
import axiosInstance from "../../api/axiosConfig";

const CreateOrEditParentModal = ({
  show,
  handleClose,
  onParentSaved,
  editMode = false,
  parentToEdit = null,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    USR_nom: "",
    USR_prenom: "",
    USR_email: "",
    USR_telephone: "",
  });

  useEffect(() => {
    if (editMode && parentToEdit) {
      setFormData({
        USR_nom: parentToEdit.USR_nom || "",
        USR_prenom: parentToEdit.USR_prenom || "",
        USR_email: parentToEdit.USR_email || "",
        USR_telephone: parentToEdit.USR_telephone || "",
      });
    } else {
      resetForm();
    }
  }, [editMode, parentToEdit, show]);

  const resetForm = () => {
    setFormData({
      USR_nom: "",
      USR_prenom: "",
      USR_email: "",
      USR_telephone: "",
    });
    setError("");
  };

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const validate = () => {
    const { USR_nom, USR_prenom, USR_email } = formData;
    if (!USR_nom || !USR_prenom || !USR_email) {
      setError("Tous les champs obligatoires doivent être remplis.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      let response;
      if (editMode && parentToEdit?.USR_id) {
        response = await axiosInstance.put(`/usr/${parentToEdit.USR_id}`, formData);
      } else {
        response = await axiosInstance.post(`/usr`, formData);
      }

      onParentSaved?.(response.data);
      handleClose();
    } catch (err) {
      console.error("Erreur sauvegarde parent :", err);
      setError("Erreur lors de la sauvegarde du parent.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>
          <FaUser className="me-2" />
          {editMode ? "Modifier le parent" : "Ajouter un parent"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Nom *</Form.Label>
                <Form.Control
                  name="USR_nom"
                  value={formData.USR_nom}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Prénom *</Form.Label>
                <Form.Control
                  name="USR_prenom"
                  value={formData.USR_prenom}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>Email *</Form.Label>
            <Form.Control
              type="email"
              name="USR_email"
              value={formData.USR_email}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label>Téléphone</Form.Label>
            <Form.Control
              name="USR_telephone"
              value={formData.USR_telephone}
              onChange={handleChange}
            />
          </Form.Group>

          <div className="d-flex justify-content-end gap-2">
            <Button variant="secondary" onClick={handleClose}>
              Annuler
            </Button>
            <Button type="submit" variant="success" disabled={loading}>
              {loading ? "Enregistrement..." : (
                <>
                  <FaSave className="me-2" />
                  {editMode ? "Mettre à jour" : "Créer"}
                </>
              )}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default CreateOrEditParentModal;
