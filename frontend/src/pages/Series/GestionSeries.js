import React, { useState, useEffect, useContext } from "react";
import {
  Container,
  Image,
  Form,
  InputGroup,
  Badge,
  Row,
  Col,
} from "react-bootstrap";
import AuthContext from "../../context/AuthContext";
import { FaFilter, FaBookOpen } from "react-icons/fa";
import axiosInstance from "../../api/axiosConfig";
import StatusBadge from "../../components/common/StatusBadge";
import GenericTable from "../../components/common/GenericTable";
import ReturnButton from "../../components/button/ReturnButton";
import AddButton from "../../components/button/AddButton";
import { useTableActions } from "../../hooks/useTableActions";
import CreateSerie from "./SeriesGestion/CreateSerie";
import EditSerie from "./SeriesGestion/EditSerie";
import ValiderSerie from "./SeriesGestion/ValiderSerie";
import AnimationGestion from "../Animations/AnimationGestion";

const GestionSeries = () => {
  const { user } = useContext(AuthContext);
  const [series, setSeries] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showValidModal, setShowValidModal] = useState(false);
  const [showAnimationModal, setShowAnimationModal] = useState(false);
  const [selectedSerieId, setSelectedSerieId] = useState(null);
  const [statusFilter, setStatusFilter] = useState("tous");
  const [filteredSeries, setFilteredSeries] = useState([]);

  const {
    createEditAction,
    createDeleteAction,
    createValidateAction,
    createAnimationAction,
  } = useTableActions();

  useEffect(() => {
    axiosInstance
      .get("/ses")
      .then((response) => {
        setSeries(response.data);
        setFilteredSeries(response.data);
      })
      .catch((error) => {
        console.error("Impossible de charger les séries:", error);
      });
  }, []);

  useEffect(() => {
    if (statusFilter === "tous") {
      setFilteredSeries(series);
    } else {
      setFilteredSeries(
        series.filter((serie) => serie.SES_statut === statusFilter)
      );
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
      setSeries((prevSeries) => [...prevSeries, newSerie]);
    } else {
      console.error("Tentative d'ajout d'une série invalide:", newSerie);
    }
  };

  const updateSerie = (updatedSerie) => {
    if (!updatedSerie || !updatedSerie.SES_id) {
      console.error("Série invalide pour la mise à jour:", updatedSerie);
      return;
    }

    setSeries((prevSeries) =>
      prevSeries.map((serie) =>
        serie.SES_id === updatedSerie.SES_id ? updatedSerie : serie
      )
    );
  };

  const handleDeleteSerie = (serieId) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette série ?")) {
      axiosInstance
        .delete(`/ses/${serieId}`)
        .then(() => {
          setSeries((prevSeries) =>
            prevSeries.filter((serie) => serie.SES_id !== serieId)
          );
          alert("Série supprimée avec succès");
        })
        .catch((error) => {
          console.error("Erreur lors de la suppression:", error);
          alert("Une erreur est survenue lors de la suppression");
        });
    }
  };

  // Configuration des colonnes pour le tableau
  const columns = [
    {
      header: "",
      width: "70px",
      cellClassName: "text-center",
      render: (serie) => (
        <Image
          src={`${process.env.REACT_APP_API_URL}${
            serie.SES_icone || "/images/default-series-icon.png"
          }`}
          alt={serie.SES_titre}
          style={{
            width: "50px",
            height: "50px",
            objectFit: "contain",
          }}
        />
      ),
    },
    {
      header: "Nom",
      render: (serie) => (
        <div className="fw-semibold text-primary">{serie.SES_titre}</div>
      ),
    },
    {
      header: "Description",
      render: (serie) => (
        <small className="text-muted">{serie.SES_description}</small>
      ),
    },
    {
      header: "Statut",
      cellClassName: "text-center",
      render: (serie) => <StatusBadge status={serie.SES_statut} />,
    },
  ];

  // Configuration des actions pour les séries
  const actions = [
    createEditAction((serie) => handleEditShow(serie.SES_id), "Modifier"),
    createValidateAction(
      (serie) => handleValidShow(serie.SES_id),
      "Valider la série",
      () => user && user.role === "admin"
    ),
    createAnimationAction(
      (serie) => handleAnimationShow(serie.SES_id),
      "Gestion des animations",
      () => user && (user.role === "admin" || user.role === "orthophoniste")
    ),
    createDeleteAction(
      (serie) => handleDeleteSerie(serie.SES_id),
      "Supprimer",
      () => user && user.role === "admin"
    ),
  ];

  return (
    <Container className="gestion-series">
      <Row className="align-items-center mb-3">
        <ReturnButton to="/ortho/OrthoDashboard" label="Retour au dashboard" />
        <Col>
          <h1 className="text-center mb-0">Gestion des séries</h1>
        </Col>
      </Row>

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

        <AddButton onClick={handleShow} label="Ajouter une série" />
      </div>

      {/* Tableau générique */}
      <GenericTable
        title="Liste des séries"
        icon={FaBookOpen}
        data={filteredSeries}
        columns={columns}
        actions={actions}
        emptyMessage="Aucune série trouvée"
        emptyIcon={FaBookOpen}
        keyField="SES_id"
      />

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
