import React, { useState } from "react";
import { Modal, Form, Button, Alert } from "react-bootstrap";
import axiosInstance from "../../../api/axiosConfig";

const CreateUser = ({ show, handleClose, addUser }) => {
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    USR_nom: "",
    USR_prenom: "",
    USR_email: "",
    USR_pass: "",
    USR_role: "parent",
    USR_telephone: "",
    USR_statut: "actif",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setFormData({
      USR_nom: "",
      USR_prenom: "",
      USR_email: "",
      USR_pass: "",
      USR_role: "parent",
      USR_telephone: "",
      USR_statut: "actif",
    });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axiosInstance.post("/usr", formData);
      const newUser = response.data;
      
      // Appeler la fonction du composant parent pour ajouter l'utilisateur
      addUser(newUser);
      
      // Réinitialiser le formulaire et fermer la modal
      resetForm();
      handleClose();
      alert("Utilisateur ajouté avec succès !");
    } catch (error) {
      console.error("Erreur lors de l'ajout de l'utilisateur", error);
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setError(error.response.data.message);
      } else {
        setError("Erreur lors de l'ajout de l'utilisateur");
      }
    }
  };

  return (
    <Modal show={show} onHide={() => { resetForm(); handleClose(); }} centered>
      <Modal.Header closeButton>
        <Modal.Title>Ajouter un utilisateur</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Nom :</Form.Label>
            <Form.Control
              type="text"
              name="USR_nom"
              value={formData.USR_nom}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Prénom :</Form.Label>
            <Form.Control
              type="text"
              name="USR_prenom"
              value={formData.USR_prenom}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Adresse mail :</Form.Label>
            <Form.Control
              type="email"
              name="USR_email"
              value={formData.USR_email}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Mot de passe :</Form.Label>
            <Form.Control
              type="password"
              name="USR_pass"
              value={formData.USR_pass}
              onChange={handleChange}
              required
              minLength="8"
            />
            <Form.Text className="text-muted">Minimum 8 caractères</Form.Text>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Numéro de téléphone :</Form.Label>
            <Form.Control
              type="text"
              name="USR_telephone"
              value={formData.USR_telephone}
              onChange={handleChange}
              placeholder="Format: 0612345678"
              pattern="[0-9]{10,15}"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Rôle :</Form.Label>
            <Form.Select
              name="USR_role"
              value={formData.USR_role}
              onChange={handleChange}
              required
            >
              <option value="parent">Parent</option>
              <option value="orthophoniste">Orthophoniste</option>
              <option value="admin">Admin</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Statut :</Form.Label>
            <Form.Select
              name="USR_statut"
              value={formData.USR_statut}
              onChange={handleChange}
              required
            >
              <option value="actif">Actif</option>
              <option value="inactif">Inactif</option>
              <option value="suspendu">Suspendu</option>
            </Form.Select>
          </Form.Group>

          <Button variant="primary" type="submit" className="w-100">
            Ajouter l'utilisateur
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default CreateUser;