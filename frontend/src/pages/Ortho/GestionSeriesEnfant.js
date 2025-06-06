import React, { useState, useEffect } from 'react';
import { Modal, Button, Table, Form, Alert, Spinner } from 'react-bootstrap';
import { FaPlus, FaTrash } from 'react-icons/fa';
import axiosInstance from '../../api/axiosConfig';

const GestionSeriesEnfant = ({ show, handleClose, enfant }) => {
    const [series, setSeries] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [selectedSeries, setSelectedSeries] = useState([]);

    useEffect(() => {
        if (show && enfant) {
            loadSeries();
        }
    }, [show, enfant]);

    const loadSeries = async () => {
        setLoading(true);
        try {
            // Charger toutes les séries disponibles
            const [allSeriesRes, assignedSeriesRes] = await Promise.all([
                axiosInstance.get('/ses'),
                axiosInstance.get(`/enfa/${enfant.ENFA_id}/series`)
            ]);

            setSeries(allSeriesRes.data);
            const assignedSeriesIds = assignedSeriesRes.data.map(s => s.SES_id);
            setSelectedSeries(assignedSeriesIds);
            setError('');
        } catch (err) {
            console.error("Erreur lors du chargement des séries:", err);
            setError("Impossible de charger les séries");
        } finally {
            setLoading(false);
        }
    };

    const handleSerieToggle = async (serieId) => {
        try {
            if (selectedSeries.includes(serieId)) {
                // Retirer la série
                await axiosInstance.delete(`/enfa/${enfant.ENFA_id}/series/${serieId}`);
                setSelectedSeries(prev => prev.filter(id => id !== serieId));
            } else {
                // Ajouter la série
                await axiosInstance.post(`/enfa/${enfant.ENFA_id}/series`, { SES_id: serieId });
                setSelectedSeries(prev => [...prev, serieId]);
            }
        } catch (err) {
            setError("Erreur lors de la modification des séries");
        }
    };

    return (
        <Modal show={show} onHide={handleClose} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Gérer les séries pour {enfant?.ENFA_prenom} {enfant?.ENFA_nom}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {loading ? (
                    <div className="text-center py-4">
                        <Spinner animation="border" />
                    </div>
                ) : error ? (
                    <Alert variant="danger">{error}</Alert>
                ) : (
                    <Table responsive>
                        <thead>
                            <tr>
                                <th>Série</th>
                                <th>Description</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {series.map(serie => (
                                <tr key={serie.SES_id}>
                                    <td>{serie.SES_titre}</td>
                                    <td>{serie.SES_description}</td>
                                    <td>
                                        <Form.Check
                                            type="switch"
                                            checked={selectedSeries.includes(serie.SES_id)}
                                            onChange={() => handleSerieToggle(serie.SES_id)}
                                            label={selectedSeries.includes(serie.SES_id) ? "Assignée" : "Non assignée"}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                )}
            </Modal.Body>
        </Modal>
    );
};

export default GestionSeriesEnfant;