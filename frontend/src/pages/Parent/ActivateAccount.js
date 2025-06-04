import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Card,
  Form,
  Button,
  Alert,
  Spinner,
  Row,
  Col,
} from 'react-bootstrap';
import { FaKey, FaEye, FaEyeSlash, FaCheck } from 'react-icons/fa';
import axiosInstance from '../../api/axiosConfig';

const ActivateAccount = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [validating, setValidating] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    validateToken();
  }, [token]);

  const validateToken = async () => {
    setValidating(true);
    try {
      await axiosInstance.get(`/usr/validate-token/${token}`);
      setTokenValid(true);
    } catch (error) {
      setError(
        error.response?.data?.message || 
        "Token d'activation invalide ou expiré"
      );
      setTokenValid(false);
    } finally {
      setValidating(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(''); // Clear error when user starts typing
  };

  const validateForm = () => {
    if (!formData.newPassword) {
      setError('Veuillez saisir un mot de passe');
      return false;
    }

    if (formData.newPassword.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      return false;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axiosInstance.post(`/usr/activate/${token}`, {
        newPassword: formData.newPassword,
      });

      setSuccess(response.data.message);
      
      // Redirection vers la page de connexion après 3 secondes
      setTimeout(() => {
        navigate('/login', { 
          state: { 
            message: 'Compte activé avec succès ! Vous pouvez maintenant vous connecter.' 
          }
        });
      }, 3000);

    } catch (error) {
      setError(
        error.response?.data?.message || 
        "Erreur lors de l'activation du compte"
      );
    } finally {
      setLoading(false);
    }
  };

  const getPasswordStrength = (password) => {
    if (password.length === 0) return { strength: 0, text: '', color: '' };
    if (password.length < 6) return { strength: 25, text: 'Trop court', color: 'danger' };
    if (password.length < 8) return { strength: 50, text: 'Faible', color: 'warning' };
    if (password.length < 12) return { strength: 75, text: 'Moyen', color: 'info' };
    return { strength: 100, text: 'Fort', color: 'success' };
  };

  const passwordStrength = getPasswordStrength(formData.newPassword);

  if (validating) {
    return (
      <Container className="d-flex justify-content-center align-items-center min-vh-100">
        <Card className="shadow-lg" style={{ maxWidth: '400px', width: '100%' }}>
          <Card.Body className="text-center p-5">
            <Spinner animation="border" variant="primary" className="mb-3" />
            <h5>Validation du lien d'activation...</h5>
            <p className="text-muted">Veuillez patienter</p>
          </Card.Body>
        </Card>
      </Container>
    );
  }

  if (!tokenValid) {
    return (
      <Container className="d-flex justify-content-center align-items-center min-vh-100">
        <Card className="shadow-lg" style={{ maxWidth: '500px', width: '100%' }}>
          <Card.Body className="text-center p-5">
            <div className="text-danger mb-3">
              <FaKey size={50} />
            </div>
            <h4 className="text-danger mb-3">Lien invalide</h4>
            <Alert variant="danger">
              {error}
            </Alert>
            <p className="text-muted mb-4">
              Le lien d'activation est peut-être expiré ou déjà utilisé.
            </p>
            <Button 
              variant="primary" 
              onClick={() => navigate('/login')}
            >
              Retour à la connexion
            </Button>
          </Card.Body>
        </Card>
      </Container>
    );
  }

  if (success) {
    return (
      <Container className="d-flex justify-content-center align-items-center min-vh-100">
        <Card className="shadow-lg" style={{ maxWidth: '500px', width: '100%' }}>
          <Card.Body className="text-center p-5">
            <div className="text-success mb-3">
              <FaCheck size={50} />
            </div>
            <h4 className="text-success mb-3">Compte activé !</h4>
            <Alert variant="success">
              {success}
            </Alert>
            <p className="text-muted">
              Redirection automatique vers la page de connexion...
            </p>
            <Spinner animation="border" size="sm" variant="success" />
          </Card.Body>
        </Card>
      </Container>
    );
  }

  return (
    <Container className="d-flex justify-content-center align-items-center min-vh-100">
      <Row className="w-100 justify-content-center">
        <Col md={6} lg={5}>
          <Card className="shadow-lg">
            <Card.Header className="bg-primary text-white text-center py-4">
              <h3 className="mb-0">
                <FaKey className="me-2" />
                Activation de votre compte
              </h3>
            </Card.Header>
            
            <Card.Body className="p-4">
              <div className="text-center mb-4">
                <p className="text-muted">
                  Créez votre mot de passe pour accéder à votre espace parent
                </p>
              </div>

              {error && (
                <Alert variant="danger" className="mb-4">
                  {error}
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Nouveau mot de passe *</Form.Label>
                  <div className="position-relative">
                    <Form.Control
                      type={showPassword ? 'text' : 'password'}
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleInputChange}
                      placeholder="Saisissez votre mot de passe"
                      required
                      minLength={6}
                    />
                    <Button
                      variant="link"
                      className="position-absolute end-0 top-50 translate-middle-y border-0 text-muted"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{ zIndex: 10 }}
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </Button>
                  </div>
                  
                  {/* Indicateur de force du mot de passe */}
                  {formData.newPassword && (
                    <div className="mt-2">
                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <small className="text-muted">Force du mot de passe</small>
                        <small className={`text-${passwordStrength.color}`}>
                          {passwordStrength.text}
                        </small>
                      </div>
                      <div className="progress" style={{ height: '4px' }}>
                        <div
                          className={`progress-bar bg-${passwordStrength.color}`}
                          style={{ width: `${passwordStrength.strength}%` }}
                        />
                      </div>
                    </div>
                  )}
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>Confirmer le mot de passe *</Form.Label>
                  <div className="position-relative">
                    <Form.Control
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      placeholder="Confirmez votre mot de passe"
                      required
                    />
                    <Button
                      variant="link"
                      className="position-absolute end-0 top-50 translate-middle-y border-0 text-muted"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      style={{ zIndex: 10 }}
                    >
                      {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                    </Button>
                  </div>
                  
                  {/* Indicateur de correspondance */}
                  {formData.confirmPassword && (
                    <div className="mt-1">
                      {formData.newPassword === formData.confirmPassword ? (
                        <small className="text-success">
                          <FaCheck className="me-1" />
                          Les mots de passe correspondent
                        </small>
                      ) : (
                        <small className="text-danger">
                          Les mots de passe ne correspondent pas
                        </small>
                      )}
                    </div>
                  )}
                </Form.Group>

                <div className="mb-4">
                  <small className="text-muted">
                    <strong>Recommandations :</strong>
                    <ul className="mt-2 mb-0">
                      <li>Au moins 6 caractères</li>
                      <li>Mélangez lettres, chiffres et symboles</li>
                      <li>Évitez les mots de passe trop simples</li>
                    </ul>
                  </small>
                </div>

                <div className="d-grid">
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    disabled={loading || !formData.newPassword || !formData.confirmPassword}
                  >
                    {loading ? (
                      <>
                        <Spinner animation="border" size="sm" className="me-2" />
                        Activation en cours...
                      </>
                    ) : (
                      <>
                        <FaKey className="me-2" />
                        Activer mon compte
                      </>
                    )}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ActivateAccount;