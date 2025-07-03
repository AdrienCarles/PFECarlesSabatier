import React, { useEffect, useState } from 'react';
import { Container, Alert, Spinner, Button } from 'react-bootstrap';
import { FaCheck, FaHome } from 'react-icons/fa';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axiosConfig';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [confirmed, setConfirmed] = useState(false);
  const [error, setError] = useState('');

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
        setConfirmed(true);
      } else {
        setError('Impossible de confirmer le paiement');
      }
    } catch (error) {
      console.error('Erreur confirmation paiement:', error);
      setError('Erreur lors de la confirmation du paiement');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" size="lg" />
        <p className="mt-3">Confirmation du paiement...</p>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <div className="text-center">
        {confirmed ? (
          <div>
            <FaCheck size={80} className="text-success mb-4" />
            <h2 className="text-success mb-3">Paiement réussi !</h2>
            <Alert variant="success">
              <h5>Abonnement activé avec succès</h5>
              <p className="mb-0">
                Votre enfant peut maintenant accéder aux exercices d'orthophonie.
              </p>
            </Alert>
          </div>
        ) : (
          <Alert variant="danger">
            <h5>Erreur de confirmation</h5>
            <p>{error}</p>
          </Alert>
        )}
        
        <Button 
          variant="primary" 
          size="lg" 
          onClick={() => navigate('/parent/ParentDashboard')}
          className="mt-3"
        >
          <FaHome className="me-2" />
          Retour au dashboard
        </Button>
      </div>
    </Container>
  );
};

export default PaymentSuccess;