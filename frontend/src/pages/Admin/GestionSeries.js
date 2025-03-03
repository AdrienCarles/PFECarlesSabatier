import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Table, Button, Form } from "react-bootstrap";
import AuthContext from "../../context/AuthContext";
import axios from "axios";

const GestionSeries = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [series, setSeries] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/series")
      .then((response) => setSeries(response.data))
      .catch((error) => console.error("Erreur lors du chargement des séries", error));
  }, []);

  const handleStatusChange = (id, newStatus) => {
    axios.put(`http://localhost:5000/api/series/${id}`, { status: newStatus })
      .then(() => {
        setSeries(series.map(s => s.id === id ? { ...s, status: newStatus } : s));
      })
      .catch(error => console.error("Erreur lors de la mise à jour du statut", error));
  };

  return (
    <Container className="gestion-series">
      {/* Bouton de déconnexion */}
      <div className="d-flex justify-content-end my-3">
        <Button variant="danger" onClick={logout}>Déconnexion</Button>
      </div>

      <h1 className="text-center mb-4">Gestion des séries</h1>

      {/* Bouton retour dashboard */}
      <div className="d-flex justify-content-end mb-3">
        <Button variant="secondary" onClick={() => navigate("/admin/AdminDashboard")}>Retour au dashboard</Button>
      </div>

      {/* Tableau des séries */}
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Série</th>
            <th>Créée par</th>
            <th>Accès à la série</th>
            <th>Statut</th>
          </tr>
        </thead>
        <tbody>
          {series.map((serie) => (
            <tr key={serie.id}>
              <td>{serie.name}</td>
              <td>{serie.createdBy}</td>
              <td>
                <Button variant="info" size="sm" onClick={() => navigate(`/admin/series/${serie.id}`)}>
                  Accès
                </Button>
              </td>
              <td>
                <Form.Select
                  value={serie.status}
                  onChange={(e) => handleStatusChange(serie.id, e.target.value)}
                >
                  <option value="En attente">En attente</option>
                  <option value="Validé">Validé</option>
                  <option value="Rejeté">Rejeté</option>
                </Form.Select>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default GestionSeries;
