import React, { useState, useEffect, useContext } from "react";
import {
  Container,
  Table,
  Button,
  Image,
  OverlayTrigger,
  Tooltip,
  Form,
  InputGroup,
  Badge,
  Row,
  Col,
  Card,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../context/AuthContext";
import {
  FaTrashAlt,
  FaEdit,
  FaCheckCircle,
  FaFilter,
  FaPlus,
  FaArrowLeft,
  FaBookOpen,
} from "react-icons/fa";
import { HiMiniSquaresPlus } from "react-icons/hi2";
import axiosInstance from "../../api/axiosConfig";
import StatusBadge from "../../components/common/StatusBadge";
import CreateSerie from "./SeriesGestion/CreateSerie";
import EditSerie from "./SeriesGestion/EditSerie";
import ValiderSerie from "./SeriesGestion/ValiderSerie";
import AnimationGestion from "../Animations/AnimationGestion";

const GestionSeries = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [series, setSeries] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showValidModal, setShowValidModal] = useState(false);
  const [showAnimationModal, setShowAnimationModal] = useState(false);
  const [selectedSerieId, setSelectedSerieId] = useState(null);
  const [statusFilter, setStatusFilter] = useState("tous");
  const [filteredSeries, setFilteredSeries] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    axiosInstance
      .get("/ses")
      .then((response) => {
        setSeries(response.data);
        setFilteredSeries(response.data);
      })
      .catch((error) => {
        setError("Impossible de charger les séries");
      });
  }, []);

  useEffect(() => {
    if (statusFilter === "tous") {
      setFilteredSeries(series);
    } else {
      setFilteredSeries(series.filter(serie => serie.SES_statut === statusFilter));
    }
  }, [series, statusFilter]);

  const handleFilterChange = (e) => {
    const selectedStatus = e.target.value;
    setStatusFilter(selectedStatus);

    if (selectedStatus === "tous") {
      setFilteredSeries(series);
    } else {
      setFilteredSeries(
        series.filter((serie) => serie.SES_statut === selectedStatus)
      );
    }
  };

  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  const handleEditShow = (serieId) => {
    setSelectedSerieId(serieId);
    setShowEditModal(true);
  };

  const handleEditClose = () => {
    setShowEditModal(false);
    setSelectedSerieId(null);
  };

  const handleValidShow = (serieId) => {
    setSelectedSerieId(serieId);
    setShowValidModal(true);
  };

  const handleValidClose = () => {
    setShowValidModal(false);
    setSelectedSerieId(null);
  };

  const handleAnimationShow = (serieId) => {
    setSelectedSerieId(serieId);
    setShowAnimationModal(true);
  };

  const handleAnimationClose = () => {
    setShowAnimationModal(false);
    setSelectedSerieId(null);
  };

  const addSerie = (newSerie) => {
    if (newSerie && newSerie.SES_id) {
      setSeries(prevSeries => [...prevSeries, newSerie]);
    } else {
      console.error("Tentative d'ajout d'une série invalide:", newSerie);
    }
  };

  const updateSerie = (updatedSerie) => {
    if (!updatedSerie || !updatedSerie.SES_id) {
      console.error("Série invalide pour la mise à jour:", updatedSerie);
      return;
    }

    setSeries(prevSeries =>
      prevSeries.map(serie =>
        serie.SES_id === updatedSerie.SES_id ? updatedSerie : serie
      )
    );
  };

  const handleDeleteSerie = (serieId) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette série ?")) {
      axiosInstance
        .delete(`/ses/${serieId}`)
        .then(() => {
          setSeries(prevSeries => prevSeries.filter(serie => serie.SES_id !== serieId));
          alert("Série supprimée avec succès");
        })
        .catch((error) => {
          console.error("Erreur lors de la suppression:", error);
          alert("Une erreur est survenue lors de la suppression");
        });
    }
  };

  return (
    <Container className="gestion-series">
      {/* Bouton retour responsive */}
      <Row className="align-items-center mb-3">
        <Col xs="12" md="auto" className="mb-2 mb-md-0">
          <Button
            variant="outline-secondary"
            onClick={() => navigate("/ortho/OrthoDashboard")}
            className="d-flex align-items-center"
          >
            <FaArrowLeft className="me-2" />
            Retour au dashboard
          </Button>
        </Col>
        <Col>
          <h1 className="text-center mb-0">Gestion des séries</h1>
        </Col>
      </Row>

      {/* Partie d'action */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4">
        <div className="d-flex align-items-center mb-2 mb-md-0">
          <InputGroup style={{ width: "300px" }}>
            <InputGroup.Text>
              <FaFilter />
            </InputGroup.Text>
            <Form.Select
              value={statusFilter}
              onChange={handleFilterChange}
              aria-label="Filtrer par statut"
            >
              <option value="tous">Tous les statuts</option>
              <option value="actif">Actif</option>
              <option value="inactif">Inactif</option>
              <option value="en_attente">En attente</option>
            </Form.Select>
          </InputGroup>

          <Badge bg="info" className="ms-2">
            {filteredSeries.length} série(s)
          </Badge>
        </div>

        <Button variant="primary" onClick={handleShow}>
          <FaPlus className="me-1" /> Ajouter une série
        </Button>
      </div>

      {/* Tableau sous forme de Card */}
      <Card className="shadow-sm">
        <Card.Header className="bg-primary text-white py-2">
          <div className="d-flex justify-content-between align-items-center">
            <h6 className="mb-0">
              <FaBookOpen className="me-2" />
              Liste des séries ({filteredSeries.length})
            </h6>
          </div>
        </Card.Header>
        <Card.Body className="p-0">
          <Table responsive hover className="mb-0 align-middle">
            <thead className="table-light">
              <tr>
                <th style={{ width: "70px" }}></th>
                <th>Nom</th>
                <th>Description</th>
                <th>Statut</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSeries.map((serie) => (
                <tr key={serie.SES_id}>
                  <td className="text-center">
                    <Image
                      src={`${process.env.REACT_APP_API_URL}${serie.SES_icone || "/images/default-series-icon.png"
                        }`}
                      alt={serie.SES_titre}
                      style={{
                        width: "50px",
                        height: "50px",
                        objectFit: "contain",
                      }}
                    />
                  </td>
                  <td>
                    <div className="fw-semibold text-primary">
                      {serie.SES_titre}
                    </div>
                  </td>
                  <td>
                    <small className="text-muted">{serie.SES_description}</small>
                  </td>
                  <td className="text-center">
                    <StatusBadge status={serie.SES_statut} />
                  </td>
                  <td className="text-center">
                    <OverlayTrigger
                      placement="top"
                      overlay={
                        <Tooltip id={`tooltip-edit-${serie.SES_id}`}>
                          Modifier
                        </Tooltip>
                      }
                    >
                      <Button
                        variant="outline-primary"
                        size="sm"
                        className="me-1"
                        onClick={() => handleEditShow(serie.SES_id)}
                      >
                        <FaEdit />
                      </Button>
                    </OverlayTrigger>
                    {user && user.role === "admin" && (
                      <OverlayTrigger
                        placement="top"
                        overlay={
                          <Tooltip id={`tooltip-validate-${serie.SES_id}`}>
                            Valider la série
                          </Tooltip>
                        }
                      >
                        <Button
                          variant="outline-success"
                          size="sm"
                          className="me-1"
                          onClick={() => handleValidShow(serie.SES_id)}
                        >
                          <FaCheckCircle />
                        </Button>
                      </OverlayTrigger>
                    )}
                    {user &&
                      (user.role === "admin" || user.role === "orthophoniste") && (
                        <OverlayTrigger
                          placement="top"
                          overlay={
                            <Tooltip id={`tooltip-animation-${serie.SES_id}`}>
                              Gestion des animations
                            </Tooltip>
                          }
                        >
                          <Button
                            variant="outline-info"
                            size="sm"
                            className="me-1"
                            onClick={() => handleAnimationShow(serie.SES_id)}
                          >
                            <HiMiniSquaresPlus />
                          </Button>
                        </OverlayTrigger>
                      )}
                    {user && user.role === "admin" && (
                      <OverlayTrigger
                        placement="top"
                        overlay={
                          <Tooltip id={`tooltip-delete-${serie.SES_id}`}>
                            Supprimer
                          </Tooltip>
                        }
                      >
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleDeleteSerie(serie.SES_id)}
                        >
                          <FaTrashAlt />
                        </Button>
                      </OverlayTrigger>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          {filteredSeries.length === 0 && (
            <div className="text-center py-4 text-muted">
              <FaBookOpen size={40} className="mb-3" />
              <div>Aucune série trouvée</div>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Modals inchangés */}
      <CreateSerie
        show={showModal}
        handleClose={handleClose}
        addSerie={addSerie}
      />

      <EditSerie
        show={showEditModal}
        handleClose={handleEditClose}
        updateSerie={updateSerie}
        serieId={selectedSerieId}
      />

      <ValiderSerie
        show={showValidModal}
        handleClose={handleValidClose}
        updateSerie={updateSerie}
        serieId={selectedSerieId}
      />

      <AnimationGestion
        show={showAnimationModal}
        handleClose={handleAnimationClose}
        serieId={selectedSerieId}
      />
    </Container>
  );
};

export default GestionSeries;