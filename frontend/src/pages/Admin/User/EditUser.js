import React, { useState, useEffect } from "react";
import { Modal, Form, Button, Alert } from "react-bootstrap";
import axiosInstance from "../../../api/axiosConfig";

const EditUser = ({ show, handleClose, updateUser, userId }) => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    USR_nom: "",
    USR_prenom: "",
    USR_email: "",
    USR_role: "parent",
    USR_telephone: "",
    USR_statut: "actif",
  });

  // Charger les données de l'utilisateur lorsque le modal s'ouvre
  useEffect(() => {
    if (show && userId) {

      setLoading(true);
      axiosInstance
        .get(`/usr/${userId}`)
        .then((response) => {
          const userData = response.data;
          console.log("userId:", response);
          setFormData({
            USR_nom: userData.USR_nom || "",
            USR_prenom: userData.USR_prenom || "",
            USR_email: userData.USR_email || "",
            USR_role: userData.USR_role || "parent",
            USR_telephone: userData.USR_telephone || "",
            USR_statut: userData.USR_statut || "actif",
          });
          setLoading(false);
        })
        .catch((error) => {
          console.error("Erreur lors du chargement de l'utilisateur", error);
          setError("Impossible de charger les données de l'utilisateur");
          setLoading(false);
        });
    }
  }, [show, userId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axiosInstance.put(`/usr/${userId}`, formData);
      const updatedUser = response.data;
      
      updateUser(updatedUser);
      
      handleClose();
      alert("Utilisateur modifié avec succès !");
    } catch (error) {
      console.error("Erreur lors de la modification de l'utilisateur", error);
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setError(error.response.data.message);
      } else {
        setError("Erreur lors de la modification de l'utilisateur");
      }
    }
  };

  return (
    <Modal show={show} onHide={() => { resetForm(); handleClose(); }} centered>
      <Modal.Header closeButton>
        <Modal.Title>Modifier un utilisateur</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        {loading ? (
          <p>Chargement des données...</p>
        ) : (
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
              Enregistrer les modifications
            </Button>
          </Form>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default EditUser;