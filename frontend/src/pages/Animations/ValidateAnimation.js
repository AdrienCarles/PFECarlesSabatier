import React, { useState, useEffect } from "react";
import {
  Modal,
  Button,
  Form,
  Alert,
  Spinner,
  Row,
  Col,
  Card,
  Badge,
} from "react-bootstrap";
import axiosInstance from "../../api/axiosConfig";
import { FaCheck, FaTimes, FaPlay, FaPause, FaStop } from "react-icons/fa";

const ValidateAnimation = ({
  show,
  handleClose,
  animation,
  updateAnimation,
  sesTitre,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [validationData, setValidationData] = useState({
    ANI_valider: false,
    commentaire: "",
  });

  const [previewMode, setPreviewMode] = useState("dessin");
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [audioCurrentTime, setAudioCurrentTime] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);
  const audioRef = React.useRef(null);

  // Initialiser le formulaire avec les données de l'animation
  useEffect(() => {
    if (animation && show) {
      setValidationData({
        ANI_valider: animation.ANI_valider || false,
        commentaire: animation.ANI_description || "", // Utiliser ANI_description
      });
      setPreviewMode("dessin");
      setError("");
      stopAudio();
    }
  }, [animation, show]);

  // Reset du formulaire à la fermeture
  useEffect(() => {
    if (!show) {
      setValidationData({
        ANI_valider: false,
        commentaire: "",
      });
      setError("");
      setPreviewMode("dessin");
      stopAudio();
    }
  }, [show]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setValidationData({
      ...validationData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const validateForm = () => {
    if (!validationData.ANI_valider && !validationData.commentaire.trim()) {
      setError("Veuillez ajouter un commentaire si vous refusez la validation.");
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
    setError("");

    try {
      const response = await axiosInstance.put(
        `/ani/${animation.ANI_id}/validate`,
        {
          ANI_valider: validationData.ANI_valider,
          ANI_description: validationData.commentaire, // Envoyer comme ANI_description
        }
      );

      // Mettre à jour l'animation dans le composant parent
      updateAnimation(response.data);

      // Fermer la modale
      handleClose();
    } catch (err) {
      console.error("Erreur lors de la validation:", err);
      setError(
        err.response?.data?.message ||
          "Erreur lors de la validation de l'animation"
      );
    } finally {
      setLoading(false);
    }
  };

  // Fonctions audio
  const toggleAudio = () => {
    if (audioRef.current) {
      if (isAudioPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
    }
  };

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsAudioPlaying(false);
      setAudioCurrentTime(0);
    }
  };

  const handleAudioTimeUpdate = () => {
    if (audioRef.current) {
      setAudioCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleAudioLoadedMetadata = () => {
    if (audioRef.current) {
      setAudioDuration(audioRef.current.duration);
    }
  };

  const handleAudioEnded = () => {
    setIsAudioPlaying(false);
    setAudioCurrentTime(0);
  };

  const togglePreview = () => {
    setPreviewMode(previewMode === "dessin" ? "reel" : "dessin");
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (!animation) return null;

  return (
    <Modal
      show={show}
      onHide={handleClose}
      size="xl"
      backdrop="static"
      className="animation-validation-modal"
    >
      <Modal.Header closeButton className="bg-warning text-dark">
        <Modal.Title>
          <FaCheck className="me-2" />
          Validation de l'animation : {animation.ANI_titre}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Row>
            {/* Prévisualisation */}
            <Col md={6}>
              <Card className="mb-3">
                <Card.Header className="d-flex justify-content-between align-items-center">
                  <span>Prévisualisation</span>
                  <div className="d-flex gap-2 align-items-center">
                    <Badge 
                      bg={animation.ANI_valider ? "success" : "warning"}
                      className="me-2"
                    >
                      {animation.ANI_valider ? "Validé" : "En attente"}
                    </Badge>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={togglePreview}
                    >
                      {previewMode === "dessin" ? "Voir réel" : "Voir dessin"}
                    </Button>
                  </div>
                </Card.Header>
                <Card.Body className="p-0">
                  <div className="position-relative">
                    <img
                      src={`${process.env.REACT_APP_API_URL}${
                        previewMode === "reel"
                          ? animation.ANI_urlAnimation
                          : animation.ANI_urlAnimationDessin
                      }`}
                      alt={
                        previewMode === "reel"
                          ? "Animation réelle"
                          : "Dessin de l'animation"
                      }
                      className="img-fluid w-100"
                      style={{ height: "300px", objectFit: "contain" }}
                    />
                  </div>

                  {/* Audio player - code inchangé */}
                  {animation.ANI_urlAudio && (
                    <div className="p-3">
                      <h6 className="mb-3">Audio de l'animation</h6>
                      <div className="d-flex align-items-center justify-content-center gap-2 mb-3">
                        <Button
                          variant={isAudioPlaying ? "warning" : "success"}
                          size="sm"
                          onClick={toggleAudio}
                          className="rounded-circle"
                          style={{ width: "40px", height: "40px" }}
                        >
                          {isAudioPlaying ? <FaPause /> : <FaPlay />}
                        </Button>
                        <Button
                          variant="outline-secondary"
                          size="sm"
                          onClick={stopAudio}
                          className="rounded-circle"
                          style={{ width: "40px", height: "40px" }}
                        >
                          <FaStop />
                        </Button>
                      </div>

                      <div className="mb-2">
                        <div className="progress" style={{ height: "6px" }}>
                          <div
                            className="progress-bar bg-primary"
                            role="progressbar"
                            style={{
                              width:
                                audioDuration > 0
                                  ? `${(audioCurrentTime / audioDuration) * 100}%`
                                  : "0%",
                            }}
                          ></div>
                        </div>
                      </div>

                      <div className="d-flex justify-content-between text-muted small">
                        <span>{formatTime(audioCurrentTime)}</span>
                        <span>{formatTime(audioDuration)}</span>
                      </div>

                      <audio
                        ref={audioRef}
                        src={`${process.env.REACT_APP_API_URL}${animation.ANI_urlAudio}`}
                        onTimeUpdate={handleAudioTimeUpdate}
                        onLoadedMetadata={handleAudioLoadedMetadata}
                        onEnded={handleAudioEnded}
                        preload="metadata"
                      />
                    </div>
                  )}
                </Card.Body>
              </Card>
            </Col>

            {/* Informations et validation */}
            <Col md={6}>
              <Card className="mb-3">
                <Card.Header>Informations de l'animation</Card.Header>
                <Card.Body>
                  <div className="mb-3">
                    <strong>Titre :</strong> {animation.ANI_titre}
                  </div>
                  
                  {/* MODIFICATION : Affichage contextuel de la description */}
                  {animation.ANI_description && (
                    <div className="mb-3">
                      <strong>
                        {animation.ANI_valider ? "Description :" : "Commentaire de validation :"}
                      </strong>
                      <div className="p-2 bg-light rounded mt-1">
                        {animation.ANI_description}
                      </div>
                    </div>
                  )}
                  
                  <div className="mb-3">
                    <strong>Créé par :</strong> {
                      animation.createur 
                        ? `${animation.createur.USR_nom || ''} ${animation.createur.USR_prenom || ''}`.trim() || 'Non renseigné'
                        : 'Information non disponible'
                    }
                  </div>
                  <div className="mb-3">
                    <strong>Série :</strong> {sesTitre}
                  </div>
                </Card.Body>
              </Card>

              <Card className="mb-3">
                <Card.Header>Validation</Card.Header>
                <Card.Body>
                  <Form.Group className="mb-3">
                    <Form.Check
                      type="checkbox"
                      id="validation-checkbox"
                      name="ANI_valider"
                      checked={validationData.ANI_valider}
                      onChange={handleInputChange}
                      label={
                        <span className={validationData.ANI_valider ? "text-success fw-bold" : "text-warning"}>
                          {validationData.ANI_valider ? "Valider cette animation" : "Animation en attente de validation"}
                        </span>
                      }
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>
                      {validationData.ANI_valider ? "Description" : "Commentaire de refus"}
                      {!validationData.ANI_valider && <span className="text-danger"> *</span>}
                    </Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={4}
                      name="commentaire"
                      value={validationData.commentaire}
                      onChange={handleInputChange}
                      placeholder={
                        validationData.ANI_valider
                          ? "Description optionnelle de l'animation..."
                          : "Expliquez pourquoi cette animation n'est pas validée..."
                      }
                    />
                    {validationData.ANI_valider ? (
                      <Form.Text className="text-muted">
                        Vous pouvez ajouter ou modifier la description de l'animation.
                      </Form.Text>
                    ) : (
                      <Form.Text className="text-muted">
                        Un commentaire est obligatoire si vous refusez la validation.
                      </Form.Text>
                    )}
                  </Form.Group>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Form>
      </Modal.Body>

      <Modal.Footer className="bg-light">
        <Button variant="secondary" onClick={handleClose} disabled={loading}>
          Annuler
        </Button>
        <Button 
          variant={validationData.ANI_valider ? "success" : "warning"} 
          onClick={handleSubmit} 
          disabled={loading}
        >
          {loading ? (
            <>
              <Spinner animation="border" size="sm" className="me-2" />
              Traitement...
            </>
          ) : (
            <>
              {validationData.ANI_valider ? (
                <><FaCheck className="me-2" />Valider</>
              ) : (
                <><FaTimes className="me-2" />Refuser</>
              )}
            </>
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ValidateAnimation;