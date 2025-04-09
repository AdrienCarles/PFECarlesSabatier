import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Table, Button, Modal, Form, Alert } from "react-bootstrap";
import AuthContext from "../../context/AuthContext";
import axiosInstance from "../../api/axiosConfig";

const GestionUsers = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    USR_nom: "",
    USR_prenom: "",
    USR_email: "",
    USR_pass: "", // Ajout du champ mot de passe
    USR_role: "parent", // Valeur par défaut valide
    USR_telephone: "",
    USR_statut: "actif",
  });

  useEffect(() => {
    axiosInstance
      .get("/usr")
      .then((response) => setUsers(response.data))
      .catch((error) => {
        console.error("Erreur lors du chargement des utilisateurs", error);
        setError("Impossible de charger les utilisateurs");
      });
  }, []);

  const handleDelete = (id) => {
    if (window.confirm("Voulez-vous vraiment supprimer cet utilisateur ?")) {
      axiosInstance
        .delete(`/usr/${id}`)
        .then(() => {
          setUsers(users.filter((user) => user.USR_id !== id));
        })
        .catch((error) => {
          console.error("Erreur lors de la suppression", error);
          if (error.response && error.response.data && error.response.data.message) {
            setError(error.response.data.message);
          } else {
            setError("Erreur lors de la suppression de l'utilisateur");
          }
        });
    }
  };

  const handleShow = () => setShowModal(true);

  const handleClose = () => {
    setShowModal(false);
    setError("");
    // Réinitialiser avec les noms de champs corrects
    setFormData({
      USR_nom: "",
      USR_prenom: "",
      USR_email: "",
      USR_pass: "",
      USR_role: "parent",
      USR_telephone: "",
      USR_statut: "actif",
    });
  };

  console.log(users);
  console.log(formData);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axiosInstance.post("/usr", formData);
      const newUser = response.data;

      setUsers([...users, newUser]);
      alert("Utilisateur ajouté avec succès !");
      handleClose();
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
    <Container className="gestion-users">
      {/* Bouton de déconnexion */}
      <div className="d-flex justify-content-end my-3">
        <Button variant="danger" onClick={logout}>
          Déconnexion
        </Button>
      </div>

      <h1 className="text-center mb-4">Gestion des utilisateurs</h1>

      {/* Boutons d'action */}
      <div className="d-flex justify-content-between mb-3">
        <Button variant="primary" onClick={handleShow}>
          Ajouter un utilisateur
        </Button>
        <Button
          variant="secondary"
          onClick={() => navigate("/admin/AdminDashboard")}
        >
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
              <td>
                {user.USR_nom} {user.USR_prenom}
              </td>
              <td>{user.USR_email}</td>
              <td>{user.USR_role}</td>
              <td>{user.USR_telephone}</td>
              <td>
                <Button variant="warning" size="sm" className="me-2">
                  Modifier
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDelete(user.USR_id)}
                >
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
          {error && <Alert variant="danger">{error}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Nom :</Form.Label>
              <Form.Control
                type="text"
                name="USR_nom" // Nom de champ correct
                value={formData.USR_nom}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Prénom :</Form.Label>
              <Form.Control
                type="text"
                name="USR_prenom" // Nom de champ correct
                value={formData.USR_prenom}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Adresse mail :</Form.Label>
              <Form.Control
                type="email"
                name="USR_email" // Nom de champ correct
                value={formData.USR_email}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Mot de passe :</Form.Label>
              <Form.Control
                type="password"
                name="USR_pass" // Champ mot de passe requis
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
                name="USR_telephone" // Nom de champ correct
                value={formData.USR_telephone}
                onChange={handleChange}
                placeholder="Format: 0612345678"
                pattern="[0-9]{10,15}" // Validation du format selon le backend
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Rôle :</Form.Label>
              <Form.Select
                name="USR_role" // Nom de champ correct
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
    </Container>
  );
};

export default GestionUsers;
