import React, { useState, useEffect, useContext } from "react";
import {
  Modal,
  Button,
  Alert,
  Spinner,
  Row,
  Col,
  Card,
  Badge,
} from "react-bootstrap";
import axiosInstance from "../../api/axiosConfig";
import { FaPlus, FaEdit, FaTrash, FaEye, FaCheck } from "react-icons/fa";
import CreateAnimation from "./CreateAnimation";
import PreviewAnimation from "./PreviewAnimation";
import EditAnimation from "./EditAnimation";
import ValidateAnimation from "./ValidateAnimation";
import AuthContext from "../../context/AuthContext";
import "../../css/Animation.Gestion.css";

const AnimationGestion = ({ show, handleClose, serieId }) => {
  const { user } = useContext(AuthContext);
  const [animations, setAnimations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [serie, setSerie] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [viewMode, setViewMode] = useState({});
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [selectedAnimation, setSelectedAnimation] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingAnimation, setEditingAnimation] = useState(null);
  const [showValidateModal, setShowValidateModal] = useState(false);
  const [validatingAnimation, setValidatingAnimation] = useState(null);

  useEffect(() => {
    if (show && serieId) {
      loadAnimations();
    }
  }, [show, serieId]);

  useEffect(() => {
    if (animations.length > 0) {
      const initialViewMode = {};
      animations.forEach((animation) => {
        initialViewMode[animation.ANI_id] = "dessin";
      });
      setViewMode(initialViewMode);
    }
  }, [animations]);

  const loadAnimations = () => {
    setLoading(true);
    setError("");

    axiosInstance
      .get(`/ses/${serieId}`)
      .then((response) => {
        setSerie(response.data);

        if (
          response.data.animations &&
          Array.isArray(response.data.animations)
        ) {
          setAnimations(response.data.animations);
          setLoading(false);
        } else {
          return axiosInstance.get(`/ani/bySerie/${serieId}`);
        }
      })
      .then((animationsResponse) => {
        if (animationsResponse) {
          setAnimations(animationsResponse.data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erreur lors du chargement des animations:", err);
        setError(`Erreur lors du chargement des animations: ${err.message}`);
        setLoading(false);
      });
  };

  const addAnimation = (newAnimation) => {
    setAnimations([...animations, newAnimation]);
  };

  const handleCreateModal = () => {
    setShowCreateModal(true);
  };

  const handleCloseCreateModal = () => {
    setShowCreateModal(false);
  };

  const handlePreviewAnimation = (animation) => {
    setSelectedAnimation(animation);
    setShowPreviewModal(true);
  };

  const handleClosePreview = () => {
    setShowPreviewModal(false);
    setSelectedAnimation(null);
  };

  const handleEditAnimation = (animation) => {
    setEditingAnimation(animation);
    setShowEditModal(true);
  };

  const handleCloseEdit = () => {
    setShowEditModal(false);
    setEditingAnimation(null);
  };

  const handleValidateAnimation = (animation) => {
    setValidatingAnimation(animation);
    setShowValidateModal(true);
  };

  const handleCloseValidate = () => {
    setShowValidateModal(false);
    setValidatingAnimation(null);
  };

  const handleDeleteAnimation = (animationId) => {
    if (
      window.confirm("Êtes-vous sûr de vouloir supprimer cette animation ?")
    ) {
      axiosInstance
        .delete(`/ani/${animationId}`)
        .then(() => {
          setAnimations(
            animations.filter((anim) => anim.ANI_id !== animationId)
          );
          alert("Animation supprimée avec succès");
        })
        .catch((err) => {
          console.error("Erreur lors de la suppression:", err);
          setError(`Erreur lors de la suppression: ${err.message}`);
        });
    }
  };

  const updateAnimation = (updatedAnimation) => {
    setAnimations((prev) =>
      prev.map((anim) =>
        anim.ANI_id === updatedAnimation.ANI_id ? updatedAnimation : anim
      )
    );
  };

  return (
    <>
      <Modal
        show={show}
        onHide={handleClose}
        size="xl"
        backdrop="static"
        keyboard={false}
        className="animation-gestion-modal"
      >
        <Modal.Header closeButton className="bg-light">
          <Modal.Title>
            Gestion des animations {serie && `- ${serie.SES_titre}`}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-light">
          {loading ? (
            <div className="text-center p-5">
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Chargement...</span>
              </Spinner>
            </div>
          ) : error ? (
            <Alert variant="danger">{error}</Alert>
          ) : animations.length === 0 ? (
            <div className="text-center p-5">
              <div className="py-4">
                <h5 className="text-muted mb-3">Aucune animation disponible</h5>
                <p className="text-muted mb-4">
                  Commencez par créer votre première animation pour cette série.
                </p>
                <Button variant="primary" size="lg" onClick={handleCreateModal}>
                  <FaPlus className="me-2" /> Créer une animation
                </Button>
              </div>
            </div>
          ) : (
            <>
              {/* ZONE D'ACTIONS GÉNÉRALES */}
              <div className="general-actions p-3 mb-4">
                <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
                  <div className="d-flex align-items-center gap-2">
                    <h6 className="mb-0 text-muted">
                      {animations.length} animation
                      {animations.length > 1 ? "s" : ""} trouvée
                      {animations.length > 1 ? "s" : ""}
                    </h6>
                  </div>

                  <div className="d-flex gap-2">
                    <Button variant="primary" onClick={handleCreateModal}>
                      <FaPlus className="me-1" /> Ajouter une animation
                    </Button>
                  </div>
                </div>
              </div>

              {/* GRILLE DES ANIMATIONS */}
              <Row xs={1} sm={2} lg={3} xl={4} className="g-4">
                {animations.map((animation) => (
                  <Col key={animation.ANI_id}>
                    <Card className="h-100 animation-card">
                      {/* ZONE IMAGE AVEC CONTRÔLES OVERLAY */}
                      <div className="animation-image-container">
                        <Card.Img
                          src={`${process.env.REACT_APP_API_URL}${
                            viewMode[animation.ANI_id] === "reel"
                              ? animation.ANI_urlAnimation
                              : animation.ANI_urlAnimationDessin
                          }`}
                          alt={animation.ANI_titre}
                          className="animation-thumbnail"
                        />

                        {/* Overlay avec contrôles */}
                        <div className="position-absolute w-100 h-100 top-0 start-0">
                          {/* Badge de validation - Top Left */}
                          <Badge
                            bg={animation.ANI_valider ? "success" : "warning"}
                            className="position-absolute top-0 start-0 m-2 status-badge"
                          >
                            {animation.ANI_valider ? "Validé" : "En attente"}
                          </Badge>

                          {/* Badge du type d'image - Top Right */}
                          <Badge
                            bg={
                              viewMode[animation.ANI_id] === "reel"
                                ? "primary"
                                : "success"
                            }
                            className="position-absolute top-0 end-0 m-2 status-badge"
                          >
                            {viewMode[animation.ANI_id] === "reel"
                              ? "Réel"
                              : "Dessin"}
                          </Badge>

                          {/* Bouton de basculement - Bottom Center */}
                          <div className="position-absolute bottom-0 start-50 translate-middle-x mb-2">
                            <Button
                              variant="light"
                              size="sm"
                              className="view-toggle-btn"
                              onClick={() => {
                                setViewMode((prev) => ({
                                  ...prev,
                                  [animation.ANI_id]:
                                    prev[animation.ANI_id] === "reel"
                                      ? "dessin"
                                      : "reel",
                                }));
                              }}
                            >
                              {viewMode[animation.ANI_id] === "reel"
                                ? "Voir dessin"
                                : "Voir réel"}
                            </Button>
                          </div>
                        </div>
                      </div>

                      {/* INFORMATIONS DE L'ANIMATION */}
                      <Card.Body className="pb-2">
                        <Card.Title className="h6 mb-2 text-truncate">
                          {animation.ANI_titre || "Sans titre"}
                        </Card.Title>
                        {animation.ANI_description && (
                          <Card.Text
                            className="text-muted small mb-0"
                            style={{
                              display: "-webkit-box",
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                            }}
                          >
                            {animation.ANI_description}
                          </Card.Text>
                        )}
                      </Card.Body>

                      {/* ZONE D'ACTIONS */}
                      <Card.Footer className="bg-white border-top-0 pt-0">
                        <div className="d-flex justify-content-between align-items-center">
                          {/* Bouton de prévisualisation principal */}
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => handlePreviewAnimation(animation)}
                            className="flex-grow-1 me-2"
                          >
                            <FaEye className="me-1" />
                            Prévisualiser
                          </Button>

                          {/* Actions de gestion */}
                          <div className="d-flex gap-1">
                            {/* AJOUT : Bouton de validation pour les admins */}
                            {user && user.role === "admin" && (
                              <Button
                                variant={
                                  animation.ANI_valider
                                    ? "outline-success"
                                    : "outline-warning"
                                }
                                size="sm"
                                title={
                                  animation.ANI_valider
                                    ? "Modifier la validation"
                                    : "Valider l'animation"
                                }
                                onClick={() =>
                                  handleValidateAnimation(animation)
                                }
                              >
                                <FaCheck />
                              </Button>
                            )}

                            <Button
                              variant="outline-primary"
                              size="sm"
                              title="Modifier l'animation"
                              onClick={() => handleEditAnimation(animation)} // Fonction ajoutée
                            >
                              <FaEdit />
                            </Button>
                            <Button
                              variant="outline-danger"
                              size="sm"
                              title="Supprimer l'animation"
                              onClick={() =>
                                handleDeleteAnimation(animation.ANI_id)
                              }
                            >
                              <FaTrash />
                            </Button>
                          </div>
                        </div>
                      </Card.Footer>
                    </Card>
                  </Col>
                ))}
              </Row>
            </>
          )}
        </Modal.Body>
        <Modal.Footer className="bg-light">
          <Button variant="secondary" onClick={handleClose}>
            Fermer
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modale de création d'animation */}
      <CreateAnimation
        show={showCreateModal}
        handleClose={handleCloseCreateModal}
        serieId={serieId}
        addAnimation={addAnimation}
      />

      {/* Modale de prévisualisation d'animation */}
      <PreviewAnimation
        show={showPreviewModal}
        handleClose={handleClosePreview}
        animation={selectedAnimation}
      />

      {/* Modale d'édition d'animation */}
      <EditAnimation
        show={showEditModal}
        handleClose={handleCloseEdit}
        animation={editingAnimation}
        updateAnimation={updateAnimation}
      />

      {/* Modale de validation d'animation */}
      <ValidateAnimation
        show={showValidateModal}
        handleClose={handleCloseValidate}
        animation={validatingAnimation}
        updateAnimation={updateAnimation}
        sesTitre={serie ? serie.SES_titre : ""}
      />
    </>
  );
};

export default AnimationGestion;
