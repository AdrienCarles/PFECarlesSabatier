import React from 'react';
import { Container, Alert, Button } from 'react-bootstrap';
import { FaTimes, FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const SubscriptionCancel = () => {
  const navigate = useNavigate();

  return (
    <Container className="py-4">
      <div className="text-center">
        <Alert variant="warning">
          <FaTimes size={50} className="mb-3" />
          <h4>Paiement annulé</h4>
          <p>Votre paiement a été annulé. Aucun montant n'a été débité.</p>
          <p>Vous pouvez réessayer à tout moment.</p>
          <Button 
            variant="primary" 
            onClick={() => navigate('/parent/abonnements')}
            className="mt-3"
          >
            <FaArrowLeft className="me-2" />
            Retour aux abonnements
          </Button>
        </Alert>
      </div>
    </Container>
  );
};

export default SubscriptionCancel;