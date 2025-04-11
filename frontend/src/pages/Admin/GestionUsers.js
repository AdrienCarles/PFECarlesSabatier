import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Table, Button, Alert } from "react-bootstrap";
import axiosInstance from "../../api/axiosConfig";
import CreateUser from "./UserGestion/CreateUser";
import EditUser from "./UserGestion/EditUser";

const GestionUsers = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [error, setError] = useState("");

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
          if (
            error.response.data.message
          ) {
            setError(error.response.data.message);
          } else {
            setError("Erreur lors de la suppression de l'utilisateur");
          }
        });
    }
  };

  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  const handleEditShow = (userId) => {
    setSelectedUserId(userId);
    setShowEditModal(true);
  };

  const handleEditClose = () => {
    setShowEditModal(false);
    setSelectedUserId(null);
  };

  // Fonction pour ajouter un nouvel utilisateur à la liste
  const addUser = (newUser) => {
    setUsers([...users, newUser]);
  };

  // Fonction pour mettre à jour l'utilisateur dans la liste
  const updateUser = (updatedUser) => {
    setUsers(
      users.map((user) =>
        user.USR_id === updatedUser.USR_id ? updatedUser : user
      )
    );
  };

  return (
    <Container className="gestion-users">
      <h1 className="text-center mb-4">Gestion des utilisateurs</h1>

      {/* Message d'erreur */}
      {error && (
        <Alert variant="danger" className="mb-3">
          {error}
        </Alert>
      )}

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
                <Button
                  variant="warning"
                  size="sm"
                  className="me-2"
                  onClick={() => handleEditShow(user.USR_id)}
                >
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

      {/* Composant modal de création d'utilisateur */}
      <CreateUser
        show={showModal}
        handleClose={handleClose}
        addUser={addUser}
      />
      {/* Composant modal de modification d'utilisateur */}
      <EditUser
        show={showEditModal}
        handleClose={handleEditClose}
        updateUser={updateUser}
        userId={selectedUserId}
      />
    </Container>
  );
};

export default GestionUsers;
