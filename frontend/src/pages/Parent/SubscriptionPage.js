import React, { useState, useEffect, useContext } from 'react';
import { Container, Card, Button, Alert, Badge, Spinner, Row, Col } from 'react-bootstrap';
import { FaCreditCard, FaCheck, FaTimes, FaChild, FaEuroSign, FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import axiosInstance from '../../api/axiosConfig';

const SubscriptionPage = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [enfants, setEnfants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [subscribing, setSubscribing] = useState(null);

  useEffect(() => {
    if (user?.id) {
      loadEnfants();
    }
  }, [user]);

  const loadEnfants = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/enfa/mes-enfants/${user.id}`);
      
      const enfantsWithStatus = await Promise.all(
        response.data.map(async (enfant) => {
          try {
            const statusRes = await axiosInstance.get(`/abm/check-status/${enfant.ENFA_id}`);
            return { ...enfant, subscriptionStatus: statusRes.data };
          } catch (error) {
            console.error(`Erreur statut enfant ${enfant.ENFA_id}:`, error);
            return { ...enfant, subscriptionStatus: { hasActiveSubscription: false } };
          }
        })
      );
      
      setEnfants(enfantsWithStatus);
      setError('');
    } catch (error) {
      console.error('Erreur chargement enfants:', error);
      setError('Erreur lors du chargement des enfants');
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async (enfantId) => {
    setSubscribing(enfantId);
    setError('');
    
    try {
      console.log('Création abonnement pour enfant:', enfantId);
      
      const response = await axiosInstance.post('/abm/create-subscription', {
        enfantId
      });

      console.log('Réponse serveur:', response.data);

      if (response.data.success) {
        if (response.data.paymentRequired) {
          if (response.data.simulated) {
            setError(''); 
            await loadEnfants();
          } else if (response.data.sessionUrl) {
            console.log('Redirection vers Stripe:', response.data.sessionUrl);
            window.location.href = response.data.sessionUrl;
            return;
          }
        } else {
          setError(''); 
          await loadEnfants();
        }
      }
    } catch (error) {
      console.error('Erreur souscription:', error);
      setError(
        error.response?.data?.message || 
        'Erreur lors de la souscription à l\'abonnement'
      );
    } finally {
      setSubscribing(null);
    }
  };

  if (loading) {
    return (
      <Container className="py-4 text-center">
        <Spinner animation="border" />
        <p className="mt-2">Chargement des abonnements...</p>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1">
            <FaCreditCard className="me-2" />
            Mes Abonnements
          </h2>
          <p className="text-muted mb-0">
            Gérez les abonnements de vos enfants pour accéder aux exercices
          </p>
        </div>
        <Button 
          variant="secondary" 
          onClick={() => navigate('/parent/ParentDashboard')}
        >
          <FaArrowLeft className="me-2" />
          Retour
        </Button>
      </div>
      
      {error && (
        <Alert variant="danger" className="mb-4">
          {error}
        </Alert>
      )}

      {enfants.length === 0 ? (
        <Alert variant="info">
          <FaChild className="me-2" />
          Aucun enfant trouvé. Contactez votre orthophoniste pour ajouter un enfant.
        </Alert>
      ) : (
        <Row>
          {enfants.map(enfant => (
            <Col key={enfant.ENFA_id} md={6} lg={4} className="mb-4">
              <EnfantSubscriptionCard
                enfant={enfant}
                onSubscribe={handleSubscribe}
                subscribing={subscribing === enfant.ENFA_id}
              />
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

const EnfantSubscriptionCard = ({ enfant, onSubscribe, subscribing }) => {
  const status = enfant.subscriptionStatus;
  const hasActiveSubscription = status?.hasActiveSubscription;

  return (
    <Card className="h-100 shadow-sm">
      <Card.Header className="bg-light">
        <h5 className="mb-0">
          <FaChild className="me-2 text-primary" />
          {enfant.ENFA_prenom} {enfant.ENFA_nom}
        </h5>
      </Card.Header>
      
      <Card.Body className="d-flex flex-column">
        <div className="mb-3">
          <SubscriptionStatus status={status} />
        </div>
        
        <div className="mb-3">
          <small className="text-muted">
            <strong>Orthophoniste:</strong><br />
            {enfant.orthophoniste?.USR_prenom} {enfant.orthophoniste?.USR_nom}
          </small>
        </div>
        
        {status?.abonnement && (
          <div className="mb-3">
            <small className="text-muted">
              <div><strong>Prix:</strong> {status.abonnement.ABM_prix}€</div>
              <div><strong>Mode:</strong> {status.abonnement.ABM_mode_paiement}</div>
              {status.abonnement.ABM_dateFin && (
                <div><strong>Expire le:</strong> {new Date(status.abonnement.ABM_dateFin).toLocaleDateString('fr-FR')}</div>
              )}
            </small>
          </div>
        )}
        
        <div className="mt-auto">
          {!hasActiveSubscription && (
            <Button
              variant="primary"
              onClick={() => onSubscribe(enfant.ENFA_id)}
              disabled={subscribing}
              className="w-100"
            >
              {subscribing ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Traitement...
                </>
              ) : (
                <>
                  <FaCreditCard className="me-2" />
                  S'abonner
                </>
              )}
            </Button>
          )}
          
          {hasActiveSubscription && (
            <Button variant="success" disabled className="w-100">
              <FaCheck className="me-2" />
              Abonnement actif
            </Button>
          )}
        </div>
      </Card.Body>
    </Card>
  );
};

const SubscriptionStatus = ({ status }) => {
  if (!status) {
    return (
      <div className="text-center">
        <Spinner animation="border" size="sm" />
        <div className="small text-muted">Vérification...</div>
      </div>
    );
  }

  if (status.hasActiveSubscription) {
    return (
      <Badge bg="success" className="p-2">
        <FaCheck className="me-1" />
        Abonnement actif
      </Badge>
    );
  }

  if (status.isExpired) {
    return (
      <Badge bg="warning" className="p-2">
        <FaTimes className="me-1" />
        Abonnement expiré
      </Badge>
    );
  }

  return (
    <Badge bg="secondary" className="p-2">
      <FaTimes className="me-1" />
      Pas d'abonnement
    </Badge>
  );
};

export default SubscriptionPage;