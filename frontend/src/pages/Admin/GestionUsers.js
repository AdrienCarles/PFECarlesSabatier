import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Table, Button, Alert, Badge } from "react-bootstrap";
import { FaCog, FaEuroSign } from "react-icons/fa";
import axiosInstance from "../../api/axiosConfig";
import CreateUser from "./UserGestion/CreateUser";
import EditUser from "./UserGestion/EditUser";
import ConfigurePayment from "./ConfigurePayment";

const GestionUsers = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [error, setError] = useState("");
  
  // États pour la configuration des paiements
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [selectedOrtho, setSelectedOrtho] = useState(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = () => {
    axiosInstance
      .get("/usr")
      .then((response) => {
        // Charger les configurations pour les orthophonistes
        loadOrthophonistesConfigs(response.data);
      })
      .catch((error) => {
        console.error("Erreur lors du chargement des utilisateurs", error);
        setError("Impossible de charger les utilisateurs");
      });
  };

  const loadOrthophonistesConfigs = async (usersData) => {
    // Charger la config pour chaque orthophoniste
    const usersWithConfigs = await Promise.all(
      usersData.map(async (user) => {
        if (user.USR_role === 'orthophoniste') {
          try {
            const configRes = await axiosInstance.get(`/usr/${user.USR_id}/config`);
            return { ...user, config: configRes.data };
          } catch (error) {
            // Pas de config trouvée, utiliser les valeurs par défaut
            return { 
              ...user, 
              config: { 
                CONFIG_paiement_obligatoire: false, 
                CONFIG_prix_par_enfant: 9.99 
              } 
            };
          }
        }
        return user;
      })
    );
    
    setUsers(usersWithConfigs);
  };

  const handleDelete = (id) => {
    if (window.confirm("Voulez-vous vraiment supprimer cet utilisateur ?")) {
      axiosInstance
        .delete(`/usr/${id}`)
        .then(() => {
          setUsers(users.filter((user) => user.USR_id !== id));
        })
        .catch((error) => {
          console.error("Erreur lors de la suppression", error);
          if (error.response?.data?.message) {
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

  // Fonctions pour la configuration des paiements
  const handleConfigShow = (user) => {
    setSelectedOrtho(user);
    setShowConfigModal(true);
  };

  const handleConfigClose = () => {
    setShowConfigModal(false);
    setSelectedOrtho(null);
  };

  const handleConfigSaved = (orthophonisteId, newConfigData) => {
    // Mettre à jour l'état local
    setUsers(users.map(user => 
      user.USR_id === orthophonisteId 
        ? { ...user, config: newConfigData }
        : user
    ));
    
    setError(""); // Effacer les erreurs précédentes
  };

  const handleConfigError = (errorMessage) => {
    setError(errorMessage);
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
            <th>Configuration Paiement</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={index}>
              <td>
                {user.USR_nom} {user.USR_prenom}
              </td>
              <td>{user.USR_email}</td>
              <td>
                <Badge 
                  bg={user.USR_role === 'admin' ? 'danger' : 
                      user.USR_role === 'orthophoniste' ? 'warning' : 'primary'}
                >
                  {user.USR_role}
                </Badge>
              </td>
              <td>{user.USR_telephone}</td>
              <td>
                {user.USR_role === 'orthophoniste' ? (
                  <div>
                    <Badge 
                      bg={user.config?.CONFIG_paiement_obligatoire ? 'success' : 'secondary'}
                      className="mb-1"
                    >
                      {user.config?.CONFIG_paiement_obligatoire ? 'Payant' : 'Gratuit'}
                    </Badge>
                    {user.config?.CONFIG_paiement_obligatoire && (
                      <div className="small text-muted">
                        <FaEuroSign className="me-1" />
                        {user.config?.CONFIG_prix_par_enfant || 9.99}€/enfant
                      </div>
                    )}
                  </div>
                ) : (
                  <span className="text-muted">-</span>
                )}
              </td>
              <td>
                <div className="d-flex gap-1 flex-wrap">
                  <Button
                    variant="warning"
                    size="sm"
                    onClick={() => handleEditShow(user.USR_id)}
                  >
                    Modifier
                  </Button>
                  
                  {user.USR_role === 'orthophoniste' && (
                    <Button
                      variant="info"
                      size="sm"
                      onClick={() => handleConfigShow(user)}
                      title="Configurer les paiements"
                    >
                      <FaCog />
                    </Button>
                  )}
                  
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(user.USR_id)}
                  >
                    Supprimer
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Composants modaux */}
      <CreateUser
        show={showModal}
        handleClose={handleClose}
        addUser={addUser}
      />
      
      <EditUser
        show={showEditModal}
        handleClose={handleEditClose}
        updateUser={updateUser}
        userId={selectedUserId}
      />
      
      {/* Modal de configuration des paiements */}
      <ConfigurePayment
        show={showConfigModal}
        onHide={handleConfigClose}
        orthophoniste={selectedOrtho}
        onConfigSaved={handleConfigSaved}
        onError={handleConfigError}
      />
    </Container>
  );
};

export default GestionUsers;