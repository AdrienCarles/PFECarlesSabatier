import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Table, Button, Modal, Form } from "react-bootstrap";
import axios from "axios";

const GestionAbonnements = () => {
  const navigate = useNavigate();
  const [abonnements, setAbonnements] = useState([]);
  const [showModal, setShowModal] = useState(false); // Gère l'affichage de la modale
  const [formData, setFormData] = useState({
    user: "",
    abonnement: "",
    dateDebut: "",
    dateFin: "",
    prix: "",
    statut: "Actif",
  });

  useEffect(() => {
    axios.get("http://localhost:5000/api/abonnements")
      .then((response) => setAbonnements(response.data))
      .catch((error) => console.error("Erreur lors du chargement des abonnements", error));
  }, []);

  const handleDelete = (id) => {
    if (window.confirm("Voulez-vous vraiment supprimer cet abonnement ?")) {
      axios.delete(`http://localhost:5000/api/abonnements/${id}`)
        .then(() => setAbonnements(abonnements.filter(a => a.id !== id)))
        .catch((error) => console.error("Erreur lors de la suppression", error));
    }
  };

  const handleShow = () => setShowModal(true);
  const handleClose = () => {
    setShowModal(false);
    setFormData({ user: "", abonnement: "", dateDebut: "", dateFin: "", prix: "", statut: "Actif" });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/abonnements", formData);
      const newAbonnement = response.data;
      setAbonnements([...abonnements, newAbonnement]);
      alert("Abonnement ajouté avec succès !");
      handleClose();
    } catch (error) {
      console.error("Erreur lors de l'ajout de l'abonnement", error);
    }
  };

  return (
    <Container className="gestion-abonnements">
      <h1 className="text-center mb-4">Gestion des abonnements</h1>

      {/* Boutons d'action */}
      <div className="d-flex justify-content-between mb-3">
        <Button variant="primary" onClick={handleShow}>Ajouter un abonnement</Button>
        <Button variant="secondary" onClick={() => navigate("/admin/AdminDashboard")}>Retour au dashboard</Button>
      </div>

      {/* Tableau des abonnements */}
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Utilisateur</th>
            <th>Date de début</th>
            <th>Date de fin</th>
            <th>Prix</th>
            <th>Statut</th>
            <th>Modification / Suppression</th>
          </tr>
        </thead>
        <tbody>
          {abonnements.map((a, index) => (
            <tr key={index}>
              <td>{a.user}</td>
              <td>{a.abonnement}</td>
              <td>{a.dateDebut}</td>
              <td>{a.dateFin}</td>
              <td>{a.prix} €</td>
              <td>{a.statut}</td>
              <td>
                <Button variant="warning" size="sm" className="me-2">
                  Modifier
                </Button>
                <Button variant="danger" size="sm" onClick={() => handleDelete(a.id)}>
                  Supprimer
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* MODALE AJOUT ABONNEMENT */}
      <Modal show={showModal} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Ajouter un abonnement</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Utilisateur :</Form.Label>
              <Form.Control type="text" name="user" value={formData.user} onChange={handleChange} required />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Date de début :</Form.Label>
              <Form.Control type="date" name="dateDebut" value={formData.dateDebut} onChange={handleChange} required />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Date de fin :</Form.Label>
              <Form.Control type="date" name="dateFin" value={formData.dateFin} onChange={handleChange} required />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Prix :</Form.Label>
              <Form.Control type="number" name="prix" value={formData.prix} onChange={handleChange} required />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Statut :</Form.Label>
              <Form.Select name="statut" value={formData.statut} onChange={handleChange} required>
                <option>Actif</option>
                <option>Inactif</option>
              </Form.Select>
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100">
              Ajouter l'abonnement
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default GestionAbonnements;
