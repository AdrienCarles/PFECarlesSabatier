import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Table, Button, Form, Image } from "react-bootstrap";
import AuthContext from "../../context/AuthContext";
import axiosInstance from "../../api/axiosConfig";
import CreateSerie from "./SeriesGestion/CreateSerie";

const GestionSeries = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [series, setSeries] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    axiosInstance
      .get("/ses")
      .then((response) => setSeries(response.data))
      .catch((error) => {
        setError("Impossible de charger les séries");
      });
  }, []);

  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  // Fonction pour ajouter une nouvelle série à la liste
  const addSerie = (newSerie) => {
    setSeries([...series, newSerie]);
  };
  console.log(series);
  return (
    <Container className="gestion-series">
      {/* Bouton de déconnexion */}
      <div className="d-flex justify-content-end my-3">
        <Button variant="danger" onClick={logout}>
          Déconnexion
        </Button>
      </div>

      <h1 className="text-center mb-4">Gestion des séries</h1>

      {/* Boutons d'action */}
      <div className="d-flex justify-content-between mb-3">
        <Button variant="primary" onClick={handleShow}>
          Ajouter une série
        </Button>
        <Button
          variant="secondary"
          onClick={() => navigate("/admin/AdminDashboard")}
        >
          Retour au dashboard
        </Button>
      </div>

      {/* Tableau des séries */}
      <Table striped bordered hover>
        <colgroup>
          <col style={{ width: "auto", minWidth: "70px", maxWidth: "70px" }} />
          <col />
          <col />
          <col />
        </colgroup>
        <thead>
          <tr>
            <th style={{ width: "70px" }}></th>
            <th>Nom</th>
            <th>Descriptions</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {series.map((serie) => (
            <tr key={serie.SES_id}>
              <td className="text-center">
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
              </td>
              <td>{serie.SES_titre}</td>
              <td>{serie.SES_description}</td>
              <td>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Composant modal de création de la série */}
      <CreateSerie
        show={showModal}
        handleClose={handleClose}
        addSerie={addSerie}
      />
    </Container>
  );
};

export default GestionSeries;
