import React from 'react';
import { Container, Alert, Button } from 'react-bootstrap';
import { FaTimes, FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const PaymentCancel = () => {
  const navigate = useNavigate();

  return (
    <Container className="py-5">
      <div className="text-center">
        <FaTimes size={80} className="text-warning mb-4" />
        <h2 className="text-warning mb-3">Paiement annulé</h2>
        
        <Alert variant="warning">
          <h5>Aucun paiement n'a été effectué</h5>
          <p className="mb-0">
            Vous pouvez retenter le paiement à tout moment depuis votre dashboard.
          </p>
        </Alert>
        
        <Button 
          variant="primary" 
          size="lg" 
          onClick={() => navigate('/parent/ParentDashboard')}
          className="mt-3"
        >
          <FaArrowLeft className="me-2" />
          Retour au dashboard
        </Button>
      </div>
    </Container>
  );
};

export default PaymentCancel;