import React, { useState, useEffect, useContext } from "react";
import {
  Container,
  Card,
  Button,
  Alert,
  Badge,
  OverlayTrigger,
  Tooltip,
  Spinner,
  Nav,
  Dropdown,
  Table,
  Form,
  Row,
  Col
} from "react-bootstrap";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaBaby,
  FaUser,
  FaPhone,
  FaEnvelope,
  FaChild,
  FaUsers,
  FaUserPlus,
  FaChevronDown,
  FaChevronRight,
  FaBookOpen,
  FaUserCircle,
  FaChevronLeft
} from "react-icons/fa";
import AuthContext from "../../context/AuthContext";
import axiosInstance from "../../api/axiosConfig";
import CreatePatient from "./CreatePatient";
import CreatePatientForParent from "./CreatePatientForParent";
import CreateOrEditParentModal from "./CreateOrEditParentModal";
import { FaSearch } from "react-icons/fa";
import GestionSeriesEnfant from './GestionSeriesEnfant';
import { useNavigate } from "react-router-dom";

const GestionEnfants = () => {
  const { user } = useContext(AuthContext);
  const [enfants, setEnfants] = useState([]);
  const [parents, setParents] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showCreateChildModal, setShowCreateChildModal] = useState(false);
  const [selectedParent, setSelectedParent] = useState(null);
  const [viewMode, setViewMode] = useState("enfants");
  const [expandedParents, setExpandedParents] = useState(new Set());
  const [editMode, setEditMode] = useState(false);
  const [patientToEdit, setPatientToEdit] = useState(null);
  const [showParentModal, setShowParentModal] = useState(false);
  const [editParentMode, setEditParentMode] = useState(false);
  const [parentToEdit, setParentToEdit] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showSeriesModal, setShowSeriesModal] = useState(false);
  const [selectedEnfant, setSelectedEnfant] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (!user || !user.id) return;
    loadData();
  }, [user]);

  useEffect(() => {
    if (viewMode === "enfants") {
      loadEnfantsData();
    } else {
      loadParentsData();
    }
  }, [viewMode, enfants]);

  useEffect(() => {
    if (viewMode === "enfants") {
      setFilteredData(enfants);
    } else {
      setFilteredData(parents);
    }
  }, [enfants, parents, viewMode]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [enfantsRes, parentsRes] = await Promise.all([
        axiosInstance.get(`/enfa/enfants/${user.id}`),
        axiosInstance.get(`/enfa/parents/${user.id}`)
      ]);
      setEnfants(enfantsRes.data);
      setParents(parentsRes.data);
      setFilteredData(viewMode === "enfants" ? enfantsRes.data : parentsRes.data);
    } catch (err) {
      console.error("Erreur chargement données :", err);
      setError("Erreur lors du chargement des données.");
    } finally {
      setLoading(false);
    }
  };

  const loadEnfantsData = () => {
    setFilteredData(enfants);
  };

  const loadParentsData = async () => {
    try {
      const response = await axiosInstance.get(`/enfa/parents/${user.id}`);
      setParents(response.data);
      setFilteredData(response.data);
    } catch (err) {
      console.error("Erreur chargement parents :", err);
      setError("Erreur lors du chargement des parents.");
    }
  };

  const handleViewModeChange = (mode) => {
    setViewMode(mode);
    setExpandedParents(new Set());
  };

  const handleShowCreateModal = () => setShowCreateModal(true);
  const handleCloseCreateModal = () => setShowCreateModal(false);

  const handleShowCreateChildModal = (parent = null) => {
    setSelectedParent(parent);
    setShowCreateChildModal(true);
  };

  // Après une modification réussie
  const handleCloseCreateChildModal = () => {
    setShowCreateChildModal(false);
    setSelectedParent(null);
    setEditMode(false);
    setPatientToEdit(null);
    loadData(); // Recharge les données pour s'assurer de la cohérence
  };

  const handlePatientCreated = (newPatient) => {
    setEnfants((prev) => [...prev, newPatient]);
    setError("");
    loadData();
  };

  const updateChildInState = (updatedChild) => {
    // Mise à jour dans la liste des enfants
    setEnfants(prev =>
      prev.map(enfant =>
        enfant.ENFA_id === updatedChild.ENFA_id ? updatedChild : enfant
      )
    );

    // Mise à jour dans la liste des parents
    setParents(prev =>
      prev.map(parent => {
        if (parent.enfantsParent?.some(e => e.ENFA_id === updatedChild.ENFA_id)) {
          return {
            ...parent,
            enfantsParent: parent.enfantsParent.map(enfant =>
              enfant.ENFA_id === updatedChild.ENFA_id ? {
                ...enfant,
                ...updatedChild,
                ENFA_dateFinSuivi: updatedChild.ENFA_dateFinSuivi
              } : enfant
            )
          };
        }
        return parent;
      })
    );

    // Mettre à jour également filteredData
    setFilteredData(prev =>
      prev.map(item =>
        item.ENFA_id === updatedChild.ENFA_id ? updatedChild : item
      )
    );
  };

  const handleChildCreated = (newChild) => {
    updateChildInState(newChild);
    setError("");
  };

  const filterEnfants = (searchTerm) => {
    if (!searchTerm) return enfants;

    return enfants.filter(enfant => {
      const searchStr = searchTerm.toLowerCase();
      return (
        enfant.ENFA_nom.toLowerCase().includes(searchStr) ||
        enfant.ENFA_prenom.toLowerCase().includes(searchStr) ||
        enfant.parent?.USR_nom.toLowerCase().includes(searchStr) ||
        enfant.parent?.USR_prenom.toLowerCase().includes(searchStr) ||
        enfant.ENFA_niveauAudition.toLowerCase().includes(searchStr)
      );
    });
  };

  const handleDelete = (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce patient ?")) {
      axiosInstance
        .delete(`/enfa/${id}`)
        .then(() => {
          setEnfants(enfants.filter((e) => e.ENFA_id !== id));
          setError("");
          loadData();
        })
        .catch((err) => {
          console.error("Erreur suppression:", err);
          setError("Erreur lors de la suppression.");
        });
    }
  };

  const handleDeleteParent = async (parent) => {
    if (window.confirm(`Supprimer ${parent.USR_prenom} ${parent.USR_nom} ?\nTous ses enfants seront aussi supprimés.`)) {
      try {
        const response = await axiosInstance.delete(`/usr/${parent.USR_id}`);
        setParents(prev => prev.filter(p => p.USR_id !== parent.USR_id));
        setEnfants(prev => prev.filter(e => e.parent?.USR_id !== parent.USR_id));
        setError("");
      } catch (err) {
        console.error("Erreur suppression parent :", err.response?.data || err.message);
        setError("Erreur lors de la suppression du parent.");
      }
    }
  };

  const handleShowCreateParentModal = () => {
    setEditParentMode(false);
    setParentToEdit(null);
    setShowParentModal(true);
  };

  const handleShowEditParentModal = (parent) => {
    setEditParentMode(true);
    setParentToEdit(parent);
    setShowParentModal(true);
  };

  const handleCloseParentModal = () => {
    setShowParentModal(false);
    setEditParentMode(false);
    setParentToEdit(null);
  };

  const handleShowSeriesModal = (enfant) => {
    setSelectedEnfant(enfant);
    setShowSeriesModal(true);
  };

  const handleCloseSeriesModal = () => {
    setShowSeriesModal(false);
    setSelectedEnfant(null);
  };

  const toggleParentExpansion = (parentId) => {
    const newExpanded = new Set(expandedParents);
    if (newExpanded.has(parentId)) {
      newExpanded.delete(parentId);
    } else {
      newExpanded.add(parentId);
    }
    setExpandedParents(newExpanded);
  };

  const getNiveauBadgeVariant = (niveau) => {
    switch (niveau) {
      case "leger": return "success";
      case "modere": return "warning";
      case "severe": return "danger";
      case "profond": return "dark";
      default: return "secondary";
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("fr-FR");
  };

  const calculateAge = (dateNaissance) => {
    const today = new Date();
    const birthDate = new Date(dateNaissance);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const getDateFinSuiviStyle = (dateFinSuivi) => {
    if (!dateFinSuivi) return "text-muted";
    return new Date(dateFinSuivi) < new Date() ? "text-danger" : "text-success";
  };

  const renderEnfantsView = () => (
    <Card className="shadow-sm">
      <Card.Header className="bg-primary text-white py-2">
        <div className="d-flex justify-content-between align-items-center">
          <h6 className="mb-0">
            <FaChild className="me-2" />
            Liste des Patients ({filteredData.length})
          </h6>
        </div>
        <div className="mt-2">
          <div className="input-group">
            <span className="input-group-text bg-white">
              <FaSearch />
            </span>
            <Form.Control
              type="search"
              placeholder="Rechercher un patient..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setFilteredData(filterEnfants(e.target.value));
              }}
              className="border-start-0"
            />
          </div>
        </div>
      </Card.Header>
      <Card.Body className="p-0">
        <Table responsive hover className="mb-0">
          <thead className="table-light">
            <tr>
              <th>Patient</th>
              <th>Âge</th>
              <th>Niveau</th>
              <th>Parent</th>
              <th>Contact</th>
              <th>Suivi depuis</th>
              <th>Fin de suivi</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((enfant) => (
              <tr key={enfant.ENFA_id}>
                <td>
                  <div className="fw-semibold text-primary">
                    {enfant.ENFA_prenom} {enfant.ENFA_nom}
                  </div>
                  <small className="text-muted">
                    Né le {formatDate(enfant.ENFA_dateNaissance)}
                  </small>
                </td>
                <td>
                  <span className="fw-semibold">{calculateAge(enfant.ENFA_dateNaissance)} ans</span>
                </td>
                <td>
                  <Badge
                    bg={getNiveauBadgeVariant(enfant.ENFA_niveauAudition)}
                    className="text-capitalize"
                  >
                    {enfant.ENFA_niveauAudition}
                  </Badge>
                </td>
                <td>
                  {enfant.parent ? (
                    <div>
                      <div className="fw-semibold">
                        {enfant.parent.USR_prenom} {enfant.parent.USR_nom}
                      </div>
                    </div>
                  ) : (
                    <small className="text-muted">Non renseigné</small>
                  )}
                </td>
                <td>
                  {enfant.parent && (
                    <div>
                      {enfant.parent.USR_email && (
                        <div className="small">
                          <FaEnvelope className="me-1 text-muted" />
                          {enfant.parent.USR_email}
                        </div>
                      )}
                      {enfant.parent.USR_telephone && (
                        <div className="small">
                          <FaPhone className="me-1 text-muted" />
                          {enfant.parent.USR_telephone}
                        </div>
                      )}
                    </div>
                  )}
                </td>
                <td>
                  <small>{formatDate(enfant.ENFA_dateDebutSuivi)}</small>
                </td>
                <td>
                  {enfant.ENFA_dateFinSuivi ? (
                    <small className={getDateFinSuiviStyle(enfant.ENFA_dateFinSuivi)}>
                      {formatDate(enfant.ENFA_dateFinSuivi)}
                    </small>
                  ) : (
                    <small className="text-muted">En cours</small>
                  )}
                </td>
                <td>
                  <div className="d-flex gap-1 justify-content-center">
                    <OverlayTrigger overlay={<Tooltip>Modifier</Tooltip>}>
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => handleShowEditChildModal(enfant)}
                      >
                        <FaEdit />
                      </Button>
                    </OverlayTrigger>

                    <OverlayTrigger overlay={<Tooltip>Gérer les séries</Tooltip>}>
                      <Button
                        variant="outline-success"
                        size="sm"
                        onClick={() => handleShowSeriesModal(enfant)}
                      >
                        <FaBookOpen />
                      </Button>
                    </OverlayTrigger>

                    <OverlayTrigger overlay={<Tooltip>Supprimer</Tooltip>}>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleDelete(enfant.ENFA_id)}
                      >
                        <FaTrash />
                      </Button>
                    </OverlayTrigger>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        {filteredData.length === 0 && (
          <div className="text-center py-4 text-muted">
            <FaBaby size={40} className="mb-3" />
            <div>Aucun patient trouvé</div>
          </div>
        )}
      </Card.Body>
    </Card>
  );

  const renderParentsView = () => (
    <div className="space-y-3">
      {filteredData.map((parent) => (
        <Card key={parent.USR_id} className="shadow-sm">
          <Card.Header
            className="bg-success text-white py-2 cursor-pointer"
            onClick={() => toggleParentExpansion(parent.USR_id)}
            style={{ cursor: 'pointer' }}
          >
            <div className="d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-center">
                {expandedParents.has(parent.USR_id) ? (
                  <FaChevronDown className="me-2" />
                ) : (
                  <FaChevronRight className="me-2" />
                )}
                <FaUser className="me-2" />
                <span className="fw-bold">
                  {parent.USR_prenom} {parent.USR_nom}
                </span>
                <Badge bg="light" text="dark" className="ms-3">
                  {parent.enfantsParent ? parent.enfantsParent.length : 0} enfant(s)
                </Badge>
              </div>
              <div className="d-flex align-items-center gap-2">
                <div className="small">
                  {parent.USR_email && (
                    <div>
                      <FaEnvelope className="me-1" />
                      {parent.USR_email}
                    </div>
                  )}
                  {parent.USR_telephone && (
                    <div>
                      <FaPhone className="me-1" />
                      {parent.USR_telephone}
                    </div>
                  )}
                </div>
                <Dropdown onClick={(e) => e.stopPropagation()}>
                  <Dropdown.Toggle variant="light" size="sm">
                    <FaEdit />
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item key={`edit-${parent.USR_id}`} onClick={() => handleShowEditParentModal(parent)}>
                      <FaUser className="me-2" />
                      Modifier le parent
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
                {/* Supprimer parent - bouton séparé avec icône poubelle */}
                <OverlayTrigger overlay={<Tooltip>Supprimer le parent</Tooltip>} key={`trash-${parent.USR_id}`}>
                  <Button variant="light" size="sm" onClick={() => handleDeleteParent(parent)}>
                    <FaTrash className="text-danger" />
                  </Button>
                </OverlayTrigger>

                <Dropdown onClick={(e) => e.stopPropagation()}>
                  <Dropdown.Toggle variant="light" size="sm">
                    <FaPlus />
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item
                      onClick={() => {
                        setSelectedParent(parent);
                        setEditMode(false);
                        setPatientToEdit(null);
                        setShowCreateChildModal(true);
                      }}
                    >
                      <FaUserPlus className="me-2" />
                      Ajouter un enfant
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            </div>
          </Card.Header>

          {expandedParents.has(parent.USR_id) && (
            <Card.Body className="p-0">
              {parent.enfantsParent && parent.enfantsParent.length > 0 ? (
                <Table responsive className="mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Enfant</th>
                      <th>Âge</th>
                      <th>Niveau</th>
                      <th>Suivi depuis</th>
                      <th>Fin de suivi</th>
                      <th className="text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {parent.enfantsParent.map((enfant) => (
                      <tr key={enfant.ENFA_id}>
                        <td>
                          <div className="fw-semibold text-primary">
                            {enfant.ENFA_prenom} {enfant.ENFA_nom}
                          </div>
                          <small className="text-muted">
                            Né le {formatDate(enfant.ENFA_dateNaissance)}
                          </small>
                        </td>
                        <td>
                          <span className="fw-semibold">
                            {calculateAge(enfant.ENFA_dateNaissance)} ans
                          </span>
                        </td>
                        <td>
                          <Badge
                            bg={getNiveauBadgeVariant(enfant.ENFA_niveauAudition)}
                            className="text-capitalize"
                          >
                            {enfant.ENFA_niveauAudition}
                          </Badge>
                        </td>
                        <td>
                          <small>{formatDate(enfant.ENFA_dateDebutSuivi)}</small>
                        </td>
                        <td>
                          {enfant.ENFA_dateFinSuivi ? (
                            <small className={`${new Date(enfant.ENFA_dateFinSuivi) < new Date() ? 'text-danger' : 'text-success'}`}>
                              {formatDate(enfant.ENFA_dateFinSuivi)}
                            </small>
                          ) : (
                            <small className="text-muted">En cours</small>
                          )}
                        </td>
                        <td>
                          <div className="d-flex gap-1 justify-content-center">
                            <Button
                              variant="outline-primary"
                              size="sm"
                              title="Modifier"
                              onClick={() => handleShowEditChildModal(enfant)}
                            >
                              <FaEdit />
                            </Button>

                            <Button
                              variant="outline-danger"
                              size="sm"
                              title="Supprimer"
                              onClick={() => handleDelete(enfant.ENFA_id)}
                            >
                              <FaTrash />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <div className="text-center py-3 text-muted">
                  <FaChild size={30} className="mb-2" />
                  <div>Aucun enfant en suivi</div>
                  <Button
                    variant="outline-primary"
                    size="sm"
                    className="mt-2"
                    onClick={() => handleShowCreateChildModal(parent)}
                  >
                    <FaUserPlus className="me-1" />
                    Ajouter un enfant
                  </Button>
                </div>
              )}
            </Card.Body>
          )}
        </Card>
      ))}
      {filteredData.length === 0 && (
        <Card className="text-center py-5">
          <Card.Body>
            <FaUsers size={50} className="text-muted mb-3" />
            <h5 className="text-muted">Aucun parent trouvé</h5>
            <p className="text-muted">Aucun parent avec des enfants en suivi</p>
          </Card.Body>
        </Card>
      )}
    </div>
  );
  const handleShowEditChildModal = (enfant) => {
    setSelectedParent(enfant.parent);
    setPatientToEdit(enfant);
    setEditMode(true);
    setShowCreateChildModal(true);
  };

  return (
    <Container fluid className="px-4">
      {/* Bouton retour au dashboard */}
      <Row className="align-items-center mb-3">
        <Col xs="12" md="auto" className="mb-2 mb-md-0">
          <Button
            variant="outline-secondary"
            onClick={() => navigate("/ortho/OrthoDashboard")}
            className="d-flex align-items-center"
          >
            <FaChevronLeft className="me-2" />
            Retour au dashboard
          </Button>
        </Col>
      </Row>

      {/* Header avec navigation */}
      <div className="mb-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <h2 className="mb-1">Gestion des Patients</h2>
            <p className="text-muted mb-0">
              Gérez vos patients et leurs parents
            </p>
          </div>
          <Button variant="primary" onClick={handleShowCreateModal}>
            <FaPlus className="me-2" />
            Nouveau Patient
          </Button>
        </div>

        {/* Navigation entre les vues */}
        <Nav variant="pills" className="mb-3">
          <Nav.Item>
            <Nav.Link
              active={viewMode === "enfants"}
              onClick={() => handleViewModeChange("enfants")}
              className="d-flex align-items-center"
            >
              <FaChild className="me-2" />
              Vue par enfants
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link
              active={viewMode === "parents"}
              onClick={() => handleViewModeChange("parents")}
              className="d-flex align-items-center"
            >
              <FaUsers className="me-2" />
              Vue par parents
            </Nav.Link>
          </Nav.Item>
        </Nav>
      </div>

      {/* Messages d'erreur */}
      {error && (
        <Alert variant="danger" className="mb-4">
          {error}
        </Alert>
      )}

      {/* Contenu principal */}
      {loading ? (
        <div className="text-center p-5">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Chargement...</span>
          </Spinner>
        </div>
      ) : (
        <>
          {viewMode === "enfants" ? renderEnfantsView() : renderParentsView()}
        </>
      )}

      {/* Modales */}
      <CreatePatient
        show={showCreateModal}
        handleClose={handleCloseCreateModal}
        onPatientCreated={handlePatientCreated}
        orthophonisteId={user?.id}
      />

      <CreatePatientForParent
        show={showCreateChildModal}
        handleClose={handleCloseCreateChildModal}
        onChildCreated={handleChildCreated}
        orthophonisteId={user?.id}
        selectedParent={selectedParent}
        parents={parents}
        editMode={editMode}
        patientToEdit={patientToEdit}
      />

      <CreateOrEditParentModal
        show={showParentModal}
        handleClose={handleCloseParentModal}
        onParentSaved={loadParentsData}
        editMode={editParentMode}
        parentToEdit={parentToEdit}
      />

      <GestionSeriesEnfant
        show={showSeriesModal}
        handleClose={handleCloseSeriesModal}
        enfant={selectedEnfant}
      />
    </Container>
  );
};

export default GestionEnfants;