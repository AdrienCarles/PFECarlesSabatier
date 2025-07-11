import React, { useState, useEffect } from "react";
import { Container, Alert, Badge } from "react-bootstrap";
import { FaUsers } from "react-icons/fa";
import axiosInstance from "../../api/axiosConfig";
import CreateUser from "./UserGestion/CreateUser";
import EditUser from "./UserGestion/EditUser";
import ConfigurePayment from "./ConfigurePayment";
import ReturnButton from "../../components/button/ReturnButton";
import AddButton from "../../components/button/AddButton";
import GenericTable from "../../components/common/GenericTable";
import { useTableActions } from "../../hooks/useTableActions";

const GestionUsers = () => {
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [error, setError] = useState("");

  // États pour la configuration des paiements
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [selectedOrtho, setSelectedOrtho] = useState(null);

  const { createEditAction, createDeleteAction, createConfigAction } =
    useTableActions();

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = () => {
    console.log("Chargement des utilisateurs...");
    axiosInstance
      .get("/usr")
      .then((response) => {
        console.log("Utilisateurs reçus avec configs:", response.data);

        // Fonction de tri par rôle
        const sortUsersByRole = (users) => {
          const roleOrder = {
            admin: 1,
            orthophoniste: 2,
            parent: 3,
          };

          return users.sort((a, b) => {
            const orderA = roleOrder[a.USR_role] || 4;
            const orderB = roleOrder[b.USR_role] || 4;
            // Tri principal par rôle
            if (orderA !== orderB) {
              return orderA - orderB;
            }
            // Tri secondaire par nom si même rôle
            return `${a.USR_nom} ${a.USR_prenom}`.localeCompare(
              `${b.USR_nom} ${b.USR_prenom}`
            );
          });
        };

        const sortedUsers = sortUsersByRole(response.data);
        setUsers(sortedUsers);
      })
      .catch((error) => {
        console.error("Erreur lors du chargement des utilisateurs", error);
        setError("Impossible de charger les utilisateurs");
      });
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
    loadUsers();
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

  // Configuration des colonnes pour le tableau
  const columns = [
    {
      header: "Utilisateur",
      render: (user) => `${user.USR_nom} ${user.USR_prenom}`,
    },
    {
      header: "Email",
      field: "USR_email",
    },
    {
      header: "Rôle",
      render: (user) => (
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
      ),
    },
    {
      header: "Numéro de tel",
      field: "USR_telephone",
    },
    {
      header: "Configuration Paiement",
      render: (user) => {
        if (user.USR_role === "orthophoniste") {
          const isPayant = user.config?.CONFIG_paiement_obligatoire;
          const prix = user.config?.CONFIG_prix_par_enfant || 9.99;

          return (
            <div className="d-flex align-items-center gap-2">
              <Badge
                bg={isPayant ? "success" : "secondary"}
                className="d-flex align-items-center gap-1"
              >
                {isPayant ? (
                  <>
                    Payant
                    <span className="ms-1">{prix}€</span>
                  </>
                ) : (
                  "Gratuit"
                )}
              </Badge>
            </div>
          );
        }
        return <span className="text-muted">-</span>;
      },
    },
  ];

  // Configuration des actions
  const actions = [
    createEditAction((user) => handleEditShow(user.USR_id), "Modifier"),
    createConfigAction(
      (user) => handleConfigShow(user),
      "Configurer les paiements",
      (user) => user.USR_role === "orthophoniste"
    ),
    createDeleteAction((user) => handleDelete(user.USR_id), "Supprimer"),
  ];

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

      {/* Boutons d'action */}
      <div className="d-flex justify-content-between mb-3">
        <AddButton onClick={handleShow} label="Ajouter un utilisateur" />
        <ReturnButton to="/admin/AdminDashboard" label="Retour au dashboard" />
      </div>

      {/* Tableau générique */}
      <GenericTable
        title="Liste des utilisateurs"
        icon={FaUsers}
        data={users}
        columns={columns}
        actions={actions}
        emptyMessage="Aucun utilisateur trouvé"
        emptyIcon={FaUsers}
        keyField="USR_id"
      />

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
