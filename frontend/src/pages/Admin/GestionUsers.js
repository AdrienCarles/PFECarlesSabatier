import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Table,
  Button,
  Alert,
  Badge,
  Card,
  Row,
  Col
} from "react-bootstrap";
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
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [selectedOrtho, setSelectedOrtho] = useState(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = () => {
    axiosInstance
      .get("/usr")
      .then((response) => {
        loadOrthophonistesConfigs(response.data);
      })
      .catch((error) => {
        console.error("Erreur lors du chargement des utilisateurs", error);
        setError("Impossible de charger les utilisateurs");
      });
  };

  const loadOrthophonistesConfigs = async (usersData) => {
    const usersWithConfigs = await Promise.all(
      usersData.map(async (user) => {
        if (user.USR_role === "orthophoniste") {
          try {
            const configRes = await axiosInstance.get(`/usr/${user.USR_id}/config`);
            return { ...user, config: configRes.data };
          } catch (error) {
            return {
              ...user,
              config: {
                CONFIG_paiement_obligatoire: false,
                CONFIG_prix_par_enfant: 9.99,
              },
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

  const handleConfigShow = (user) => {
    setSelectedOrtho(user);
    setShowConfigModal(true);
  };

  const handleConfigClose = () => {
    setShowConfigModal(false);
    setSelectedOrtho(null);
  };

  const handleConfigSaved = (orthophonisteId, newConfigData) => {
    setUsers(users.map(user =>
      user.USR_id === orthophonisteId
        ? { ...user, config: newConfigData }
        : user
    ));
    setError("");
  };

  const handleConfigError = (errorMessage) => {
    setError(errorMessage);
  };

  const addUser = (newUser) => {
    setUsers([...users, newUser]);
  };

  const updateUser = (updatedUser) => {
    setUsers(
      users.map((user) =>
        user.USR_id === updatedUser.USR_id ? updatedUser : user
      )
    );
  };

  return (
    <Container className="gestion-users">
      {/* Bouton retour et titre */}
      <Row className="align-items-center mb-3">
        <Col xs="12" md="auto" className="mb-2 mb-md-0">
          <Button
            variant="outline-secondary"
            onClick={() => navigate("/admin/AdminDashboard")}
            className="d-flex align-items-center"
          >
            Retour au dashboard
          </Button>
        </Col>
        <Col>
          <h1 className="text-center mb-0">Gestion des utilisateurs</h1>
        </Col>
      </Row>

      {/* Message d'erreur */}
      {error && (
        <Alert variant="danger" className="mb-3">
          {error}
        </Alert>
      )}

      {/* Bouton d'ajout */}
      <div className="d-flex justify-content-end mb-3">
        <Button variant="primary" onClick={handleShow}>
          Ajouter un utilisateur
        </Button>
      </div>

      {/* Tableau dans une Card */}
      <Card className="shadow-sm">
        <Card.Header className="bg-primary text-white py-2">
          <div className="d-flex justify-content-between align-items-center">
            <h6 className="mb-0">
              Liste des utilisateurs
              <Badge bg="light" text="dark" className="ms-2">
                {users.length}
              </Badge>
            </h6>
          </div>
        </Card.Header>
        <Card.Body className="p-0">
          <Table responsive hover className="mb-0 align-middle">
            <thead className="table-light">
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
                      bg={
                        user.USR_role === "admin"
                          ? "danger"
                          : user.USR_role === "orthophoniste"
                          ? "warning"
                          : "primary"
                      }
                    >
                      {user.USR_role}
                    </Badge>
                  </td>
                  <td>{user.USR_telephone}</td>
                  <td>
                    {user.USR_role === "orthophoniste" ? (
                      <div>
                        <Badge
                          bg={
                            user.config?.CONFIG_paiement_obligatoire
                              ? "success"
                              : "secondary"
                          }
                          className="mb-1"
                        >
                          {user.config?.CONFIG_paiement_obligatoire
                            ? "Payant"
                            : "Gratuit"}
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

                      {user.USR_role === "orthophoniste" && (
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
          {users.length === 0 && (
            <div className="text-center py-4 text-muted">
              <div>Aucun utilisateur trouvé</div>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Modals */}
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