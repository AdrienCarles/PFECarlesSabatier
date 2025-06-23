import React, { useState, useEffect, useContext } from "react";
import { Modal, Button, Table, Form, Alert, Spinner } from "react-bootstrap";
import { FaSave, FaTimes } from "react-icons/fa";
import axiosInstance from "../../api/axiosConfig";
import AuthContext from "../../context/AuthContext";

const GestionSeriesEnfant = ({
  show,
  handleClose,
  enfant,
  onSeriesUpdated,
}) => {
  const { user } = useContext(AuthContext);
  const [series, setSeries] = useState([]);
  const [selectedSeries, setSelectedSeries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    if (show && enfant) {
      loadData();
    }
  }, [show, enfant]);

  const loadData = async () => {
    setLoading(true);
    try {
      // Charger toutes les séries actives et les séries assignées à l'enfant
      const [allSeriesRes, assignedSeriesRes] = await Promise.all([
        axiosInstance.get("/ses/actives"),
        axiosInstance.get(`/ses/enfant/${enfant.ENFA_id}`),
      ]);

      setSeries(allSeriesRes.data);
      // Extraire les IDs des séries assignées
      const assignedIds = assignedSeriesRes.data.map((serie) => serie.SES_id);
      setSelectedSeries(assignedIds);

      setError("");
    } catch (err) {
      console.error("Erreur lors du chargement:", err);
      setError(`Erreur: ${err.response?.data?.message || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSerieToggle = async (serieId) => {
    if (selectedSeries.includes(serieId)) {
      setSelectedSeries((prev) => prev.filter((id) => id !== serieId));
    } else {
      setSelectedSeries((prev) => [...prev, serieId]);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await axiosInstance.put(`/ses/enfant/${enfant.ENFA_id}`, {
        seriesIds: selectedSeries,
        parentId: enfant.USR_parent_id,
      });

      setShowToast(true);

      if (onSeriesUpdated) {
        onSeriesUpdated();
      }

      setTimeout(() => {
        handleClose();
      }, 1500);
    } catch (err) {
      console.error("Erreur lors de la sauvegarde:", err);
      setError(
        `Erreur lors de la sauvegarde: ${
          err.response?.data?.message || err.message
        }`
      );
    } finally {
      setSaving(false);
    }
  };

  const handleModalClose = () => {
    setError("");
    setShowToast(false);
    setSelectedSeries([]);
    handleClose();
  };

    return (
        <Modal show={show} onHide={handleModalClose} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>
                    Gérer les séries pour {enfant?.ENFA_prenom} {enfant?.ENFA_nom}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {loading ? (
                    <div className="text-center py-4">
                        <Spinner animation="border" />
                        <p className="mt-2">Chargement des séries...</p>
                    </div>
                ) : error ? (
                    <Alert variant="danger">{error}</Alert>
                ) : series.length === 0 ? (
                    <Alert variant="info">Aucune série active disponible</Alert>
                ) : (
                    <>
                        <div className="mb-3">
                            <small className="text-muted">
                                Sélectionnez les séries auxquelles {enfant?.ENFA_prenom} aura accès
                            </small>
                        </div>
                        <Table responsive hover>
                            <thead>
                                <tr>
                                    <th>Série</th>
                                    <th>Thème</th>
                                    <th>Description</th>
                                    <th className="text-center">Accès</th>
                                </tr>
                            </thead>
                            <tbody>
                                {series.map(serie => (
                                    <tr key={serie.SES_id}>
                                        <td>
                                            <div className="d-flex align-items-center">
                                                {serie.SES_icone && (
                                                    <img 
                                                        src={`${process.env.REACT_APP_API_URL}${serie.SES_icone}`}
                                                        alt={serie.SES_titre}
                                                        style={{ width: '40px', height: '40px', marginRight: '10px' }}
                                                        className="rounded"
                                                    />
                                                )}
                                                <strong>{serie.SES_titre}</strong>
                                            </div>
                                        </td>
                                        <td>
                                            <span className="badge bg-secondary">{serie.SES_theme}</span>
                                        </td>
                                        <td>
                                            <small>{serie.SES_description || 'Pas de description'}</small>
                                        </td>
                                        <td className="text-center">
                                            <Form.Check
                                                type="switch"
                                                checked={selectedSeries.includes(serie.SES_id)}
                                                onChange={() => handleSerieToggle(serie.SES_id)}
                                                label=""
                                                className="d-inline-block"
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                        
                        {showToast && (
                            <Alert variant="success" className="mt-3">
                                ✅ Séries mises à jour avec succès !
                            </Alert>
                        )}
                    </>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleModalClose}>
                    <FaTimes className="me-2" />
                    Annuler
                </Button>
                <Button 
                    variant="primary" 
                    onClick={handleSave}
                    disabled={saving || loading}
                >
                    {saving ? (
                        <>
                            <Spinner size="sm" className="me-2" />
                            Sauvegarde...
                        </>
                    ) : (
                        <>
                            <FaSave className="me-2" />
                            Sauvegarder ({selectedSeries.length} séries)
                        </>
                    )}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default GestionSeriesEnfant;
