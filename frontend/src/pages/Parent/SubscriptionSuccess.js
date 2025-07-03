import React, { useEffect, useState, useContext } from 'react';
import { Container, Alert, Spinner, Button } from 'react-bootstrap';
import { FaCheck, FaArrowLeft } from 'react-icons/fa';
import { useSearchParams, useNavigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import axiosInstance from '../../api/axiosConfig';

const SubscriptionSuccess = () => {
  const { user } = useContext(AuthContext);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [abonnement, setAbonnement] = useState(null);

  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    if (sessionId) {
      confirmPayment(sessionId);
    } else {
      setError('ID de session manquant');
      setLoading(false);
    }
  }, [searchParams]);

  const confirmPayment = async (sessionId) => {
    try {
      const response = await axiosInstance.post('/abm/confirm-payment', {
        sessionId
      });

      if (response.data.success) {
        setAbonnement(response.data.abonnement);
      } else {
        setError('Erreur lors de la confirmation du paiement');
      }
    } catch (error) {
      console.error('Erreur confirmation:', error);
      setError(
        error.response?.data?.message || 
        'Erreur lors de la confirmation du paiement'
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container className="py-4 text-center">
        <Spinner animation="border" />
        <p className="mt-2">Confirmation du paiement...</p>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <div className="text-center">
        {error ? (
          <Alert variant="danger">
            <h4>Erreur</h4>
            <p>{error}</p>
            <Button 
              variant="primary" 
              onClick={() => navigate('/parent/abonnements')}
            >
              Retour aux abonnements
            </Button>
          </Alert>
        ) : (
          <Alert variant="success">
            <FaCheck size={50} className="mb-3" />
            <h4>Paiement confirmé !</h4>
            <p>Votre abonnement a été activé avec succès.</p>
            {abonnement && (
              <div className="mt-3">
                <p><strong>Prix:</strong> {abonnement.ABM_prix}€</p>
                <p><strong>Valide jusqu'au:</strong> {new Date(abonnement.ABM_dateFin).toLocaleDateString('fr-FR')}</p>
              </div>
            )}
            <Button 
              variant="primary" 
              onClick={() => navigate('/parent/abonnements')}
              className="mt-3"
            >
              <FaArrowLeft className="me-2" />
              Retour aux abonnements
            </Button>
          </Alert>
        )}
      </div>
    </Container>
  );
};

export default SubscriptionSuccess;