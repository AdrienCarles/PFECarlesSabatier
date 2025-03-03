import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Table, Button, Modal, Form } from "react-bootstrap";
import AuthContext from "../../context/AuthContext";
import axios from "axios";

const GestionUsers = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false); // Gère l'affichage de la modale
  const [formData, setFormData] = useState({
    name: "",
    prenom: "",
    email: "",
    role: "Choix",
    phone: "",
  });

  useEffect(() => {
    axios.get("http://localhost:5000/api/users") // Modifier l'URL selon ton backend
      .then((response) => setUsers(response.data))
      .catch((error) => console.error("Erreur lors du chargement des utilisateurs", error));
  }, []);

  const handleDelete = (id) => {
    if (window.confirm("Voulez-vous vraiment supprimer cet utilisateur ?")) {
      axios.delete(`http://localhost:5000/api/users/${id}`)
        .then(() => setUsers(users.filter(user => user.id !== id)))
        .catch((error) => console.error("Erreur lors de la suppression", error));
    }
  };

  const handleShow = () => setShowModal(true);
  const handleClose = () => {
    setShowModal(false);
    setFormData({ name: "", prenom: "", email: "", role: "Choix", phone: "" });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.role === "Choix") {
      alert("Veuillez sélectionner un rôle.");
      return;
    }
  
    try {
      const response = await axios.post("http://localhost:5000/api/users", formData);
      const newUser = response.data; // Récupérer les données du nouvel utilisateur ajouté
  
      setUsers([...users, newUser]); // Mettre à jour le tableau sans rechargement
      alert("Utilisateur ajouté avec succès !");
      handleClose(); // Fermer la modale après l'ajout
    } catch (error) {
      console.error("Erreur lors de l'ajout de l'utilisateur", error);
    }
  };
  

  return (
    <Container className="gestion-users">
      {/* Bouton de déconnexion */}
      <div className="d-flex justify-content-end my-3">
        <Button variant="danger" onClick={logout}>Déconnexion</Button>
      </div>

      <h1 className="text-center mb-4">Gestion des utilisateurs</h1>

      {/* Boutons d'action */}
      <div className="d-flex justify-content-between mb-3">
        <Button variant="primary" onClick={handleShow}>
          Ajouter un utilisateur
        </Button>
        <Button variant="secondary" onClick={() => navigate("/admin/AdminDashboard")}>
          Retour au dashboard
        </Button>
      </div>

      {/* Tableau des utilisateurs */}
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Utilisateur</th>
            <th>Email</th>
            <th>Rôle</th>
            <th>Numéro de tel</th>
            <th>Modification / Suppression</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={index}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>{user.phone}</td>
              <td>
                <Button variant="warning" size="sm" className="me-2">
                  Modifier
                </Button>
                <Button variant="danger" size="sm" onClick={() => handleDelete(user.id)}>
                  Supprimer
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* MODALE AJOUT UTILISATEUR */}
      <Modal show={showModal} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Ajouter un utilisateur</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Nom :</Form.Label>
              <Form.Control type="text" name="name" value={formData.name} onChange={handleChange} required />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Prénom :</Form.Label>
              <Form.Control type="text" name="prenom" value={formData.prenom} onChange={handleChange} required />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Adresse mail :</Form.Label>
              <Form.Control type="email" name="email" value={formData.email} onChange={handleChange} required />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Rôle :</Form.Label>
              <Form.Select name="role" value={formData.role} onChange={handleChange} required>
                <option>Choix</option>
                <option>Administrateur</option>
                <option>Orthophoniste</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Numéro de téléphone :</Form.Label>
              <Form.Control type="text" name="phone" value={formData.phone} onChange={handleChange} required />
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100">
              Ajouter l'utilisateur
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default GestionUsers;
