import React, { useState, useEffect } from 'react';
import { Container, Table, Form, Button, Alert, Card, Badge, Spinner } from 'react-bootstrap';
import { FaCog, FaUsers, FaEuroSign, FaSave } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axiosConfig';

const OrthophonisteConfig = () => {
  const navigate = useNavigate();
  const [orthophonistes, setOrthophonistes] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(null);

  useEffect(() => {
    loadOrthophonistes();
  }, []);

  const loadOrthophonistes = async () => {
    try {
      // Adapter selon votre API existante pour récupérer les orthophonistes
      const response = await axiosInstance.get('/usr?role=orthophoniste');
      setOrthophonistes(response.data);
    } catch (error) {
      setError('Erreur lors du chargement des orthophonistes');
    } finally {
      setLoading(false);
    }
  };

  const updateConfig = async (orthophonisteId, config) => {
    setSaving(orthophonisteId);
    try {
      await axiosInstance.put(`/usr/${orthophonisteId}/config`, config);
      
      // Mettre à jour l'état local
      setOrthophonistes(prev =>
        prev.map(ortho =>
          ortho.USR_id === orthophonisteId
            ? { ...ortho, config: { ...ortho.config, ...config } }
            : ortho
        )
      );
      
      setError('');
    } catch (error) {
      setError('Erreur lors de la mise à jour');
    } finally {
      setSaving(null);
    }
  };

  if (loading) {
    return (
      <Container className="py-4 text-center">
        <Spinner animation="border" />
        <p className="mt-2">Chargement...</p>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1">
            <FaCog className="me-2" />
            Configuration des Orthophonistes
          </h2>
          <p className="text-muted mb-0">
            Configurez les paramètres de paiement pour chaque orthophoniste
          </p>
        </div>
        <Button variant="secondary" onClick={() => navigate('/admin/AdminDashboard')}>
          Retour au dashboard
        </Button>
      </div>
      
      {error && <Alert variant="danger">{error}</Alert>}

      <Card>
        <Card.Header className="bg-primary text-white">
          <h5 className="mb-0">
            <FaUsers className="me-2" />
            Liste des Orthophonistes ({orthophonistes.length})
          </h5>
        </Card.Header>
        <Card.Body className="p-0">
          <Table striped hover responsive className="mb-0">
            <thead className="table-light">
              <tr>
                <th>Orthophoniste</th>
                <th>Email</th>
                <th>Paiement obligatoire</th>
                <th>Prix par enfant (€)</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orthophonistes.map(ortho => (
                <OrthophonisteRow 
                  key={ortho.USR_id} 
                  orthophoniste={ortho}
                  onUpdate={updateConfig}
                  saving={saving === ortho.USR_id}
                />
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </Container>
  );
};

const OrthophonisteRow = ({ orthophoniste, onUpdate, saving }) => {
  const [config, setConfig] = useState({
    paiementObligatoire: orthophoniste.config?.CONFIG_paiement_obligatoire || false,
    prixParEnfant: orthophoniste.config?.CONFIG_prix_par_enfant || 9.99
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(orthophoniste.USR_id, {
      CONFIG_paiement_obligatoire: config.paiementObligatoire,
      CONFIG_prix_par_enfant: config.prixParEnfant
    });
  };

  return (
    <tr>
      <td>
        <div>
          <strong>{orthophoniste.USR_prenom} {orthophoniste.USR_nom}</strong>
          <div className="small text-muted">ID: {orthophoniste.USR_id}</div>
        </div>
      </td>
      <td>
        <span className="text-break">{orthophoniste.USR_email}</span>
      </td>
      <td>
        <Form.Check
          type="switch"
          checked={config.paiementObligatoire}
          onChange={(e) => setConfig({
            ...config,
            paiementObligatoire: e.target.checked
          })}
          label={config.paiementObligatoire ? 'Payant' : 'Gratuit'}
        />
      </td>
      <td>
        <div className="d-flex align-items-center">
          <FaEuroSign className="text-muted me-1" />
          <Form.Control
            type="number"
            step="0.01"
            min="0"
            value={config.prixParEnfant}
            onChange={(e) => setConfig({
              ...config,
              prixParEnfant: parseFloat(e.target.value) || 0
            })}
            style={{ width: '100px' }}
            disabled={!config.paiementObligatoire}
          />
        </div>
      </td>
      <td>
        <Button
          variant="success"
          size="sm"
          onClick={handleSubmit}
          disabled={saving}
        >
          {saving ? (
            <Spinner animation="border" size="sm" />
          ) : (
            <>
              <FaSave className="me-1" />
              Sauvegarder
            </>
          )}
        </Button>
      </td>
    </tr>
  );
};

export default OrthophonisteConfig;