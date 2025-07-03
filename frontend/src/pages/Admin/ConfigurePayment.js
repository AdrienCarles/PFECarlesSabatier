import React, { useState, useEffect } from 'react';
import { Modal, Form, Button, Spinner } from 'react-bootstrap';
import { FaCog, FaEuroSign } from 'react-icons/fa';
import axiosInstance from '../../api/axiosConfig';

const ConfigurePayment = ({ 
  show, 
  onHide, 
  orthophoniste, 
  onConfigSaved,
  onError 
}) => {
  const [configData, setConfigData] = useState({
    CONFIG_paiement_obligatoire: false,
    CONFIG_prix_par_enfant: 9.99
  });
  const [saving, setSaving] = useState(false);

  // Mettre à jour les données quand l'orthophoniste change
  useEffect(() => {
    if (orthophoniste) {
      setConfigData({
        CONFIG_paiement_obligatoire: orthophoniste.config?.CONFIG_paiement_obligatoire || false,
        CONFIG_prix_par_enfant: orthophoniste.config?.CONFIG_prix_par_enfant || 9.99
      });
    }
  }, [orthophoniste]);

  const handleSave = async () => {
    if (!orthophoniste) return;

    setSaving(true);
    try {
      const response = await axiosInstance.put(
        `/usr/${orthophoniste.USR_id}/config`, 
        configData
      );
      
      // Informer le parent du succès
      onConfigSaved(orthophoniste.USR_id, configData);
      
      // Fermer la modal
      onHide();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      onError('Erreur lors de la sauvegarde de la configuration');
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    // Réinitialiser les données si on annule
    if (orthophoniste) {
      setConfigData({
        CONFIG_paiement_obligatoire: orthophoniste.config?.CONFIG_paiement_obligatoire || false,
        CONFIG_prix_par_enfant: orthophoniste.config?.CONFIG_prix_par_enfant || 9.99
      });
    }
    onHide();
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          <FaCog className="me-2" />
          Configuration Paiement - {orthophoniste?.USR_prenom} {orthophoniste?.USR_nom}
        </Modal.Title>
      </Modal.Header>
      
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Check
              type="switch"
              id="paiement-obligatoire"
              label="Paiement obligatoire pour cet orthophoniste"
              checked={configData.CONFIG_paiement_obligatoire}
              onChange={(e) => setConfigData({
                ...configData,
                CONFIG_paiement_obligatoire: e.target.checked
              })}
            />
            <Form.Text className="text-muted">
              Si activé, les parents devront payer pour que leurs enfants accèdent aux séries de cet orthophoniste.
            </Form.Text>
          </Form.Group>

          {configData.CONFIG_paiement_obligatoire && (
            <Form.Group className="mb-3">
              <Form.Label>Prix par enfant (€)</Form.Label>
              <div className="input-group">
                <span className="input-group-text">
                  <FaEuroSign />
                </span>
                <Form.Control
                  type="number"
                  step="0.01"
                  min="0"
                  value={configData.CONFIG_prix_par_enfant}
                  onChange={(e) => setConfigData({
                    ...configData,
                    CONFIG_prix_par_enfant: parseFloat(e.target.value) || 0
                  })}
                  placeholder="9.99"
                />
              </div>
              <Form.Text className="text-muted">
                Prix mensuel par enfant pour accéder aux séries de cet orthophoniste.
              </Form.Text>
            </Form.Group>
          )}
        </Form>
      </Modal.Body>
      
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Annuler
        </Button>
        <Button 
          variant="primary" 
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? (
            <>
              <Spinner animation="border" size="sm" className="me-2" />
              Sauvegarde...
            </>
          ) : (
            'Sauvegarder'
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ConfigurePayment;