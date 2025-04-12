import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Alert } from "react-bootstrap";
import axiosInstance from "../../../api/axiosConfig";

const ValiderSerie = ({ show, handleClose, serieId, updateSerie }) => {
  const [serie, setSerie] = useState(null);
  const [validation, setValidation] = useState("valide");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (show && serieId) {
      setLoading(true);
      axiosInstance
        .get(`/ses/${serieId}`)
        .then((response) => {
          const serieData = response.data;
          console.log("Serie data:", serieData);
          setSerie(serieData);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error loading series details:", err);
          setError(
            `Erreur lors du chargement des détails de la série: ${err.message}`
          );
          setLoading(false);
        });
    }
  }, [show, serieId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
  
    axiosInstance
      .put(`/ses/${serieId}/valider`, {
        statut: validation,
      })
      .then((response) => {
        if (response.data && response.data.serie) {
          updateSerie(response.data.serie);
        }
        handleClose();
      })
      .catch((err) => {
        console.error("Erreur lors de la validation:", err);
        setError("Erreur lors de la validation de la série");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Validation de la série</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {loading ? (
          <p className="text-center">Chargement...</p>
        ) : error ? (
          <Alert variant="danger">{error}</Alert>
        ) : serie ? (
          <Form onSubmit={handleSubmit}>
            <div className="mb-3">
              <h5>{serie.SES_titre}</h5>
              <p>{serie.SES_description}</p>
            </div>

            <Form.Group className="mb-3">
              <Form.Label>Décision</Form.Label>
              <Form.Select
                value={validation}
                onChange={(e) => setValidation(e.target.value)}
                required
              >
                <option value="valide">Valider</option>
                <option value="refuse">Refuser</option>
              </Form.Select>
            </Form.Group>

            <div className="d-flex justify-content-end">
              <Button
                variant="secondary"
                onClick={handleClose}
                className="me-2"
              >
                Annuler
              </Button>
              <Button variant="primary" type="submit" disabled={loading}>
                {validation === "valide"
                  ? "Valider la série"
                  : "Refuser la série"}
              </Button>
            </div>
          </Form>
        ) : (
          <p>Données non disponibles</p>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default ValiderSerie;
