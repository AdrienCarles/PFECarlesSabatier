import React, { useState, useEffect } from "react";
import {
  Modal,
  Button,
  Alert,
  Spinner,
  Row,
  Col,
  Card,
  Badge,
  Form,
} from "react-bootstrap";
import axiosInstance from "../../api/axiosConfig";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaPlay,
  FaPause,
  FaVolumeMute,
  FaVolumeUp,
  FaFilter,
} from "react-icons/fa";
import CreateAnimation from "./CreateAnimation";

const AnimationGestion = ({ show, handleClose, serieId }) => {
  const [animations, setAnimations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [serie, setSerie] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [currentAudio, setCurrentAudio] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [viewMode, setViewMode] = useState({});
  const audioRef = React.useRef(null);

  useEffect(() => {
    if (show && serieId) {
      loadAnimations();
    }
  }, [show, serieId]);

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

  const handleAddAnimation = () => {
    setShowCreateModal(true);
  };

  const handleCloseCreateModal = () => {
    setShowCreateModal(false);
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
          // Si l'audio en cours de lecture est supprimé, arrêter la lecture
          if (currentAudio === animationId) {
            setCurrentAudio(null);
            setIsPlaying(false);
            if (audioRef.current) {
              audioRef.current.pause();
            }
          }
          alert("Animation supprimée avec succès");
        })
        .catch((err) => {
          console.error("Erreur lors de la suppression:", err);
          setError(`Erreur lors de la suppression: ${err.message}`);
        });
    }
  };

  const toggleAudio = (animationId, audioUrl) => {
    // Si c'est déjà l'audio en cours
    if (currentAudio === animationId) {
      if (isPlaying) {
        // Pause
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        // Play
        audioRef.current.play();
        setIsPlaying(true);
      }
    } else {
      // Nouvel audio
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setCurrentAudio(animationId);
      setIsPlaying(true);

      // Utiliser un petit délai pour s'assurer que le nouvel audio est chargé
      setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.play().catch((err) => {
            console.error("Erreur lors de la lecture audio:", err);
          });
        }
      }, 100);
    }
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
  };

  // Filtrage des animations
  const filteredAnimations = animations.filter((animation) => {
    const matchesSearch =
      animation.ANI_titre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      animation.ANI_description?.toLowerCase().includes(
        searchTerm.toLowerCase()
      );

    const matchesType =
      filterType === "all" || animation.ANI_type === filterType;

    return matchesSearch && matchesType;
  });

  // Récupérer les types uniques d'animation pour le filtre
  const animationTypes = [
    ...new Set(animations.filter((a) => a.ANI_type).map((a) => a.ANI_type)),
  ];

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
          {/* Audio Player caché */}
          <audio
            ref={audioRef}
            src={
              currentAudio
                ? `${process.env.REACT_APP_API_URL}${
                    animations.find((a) => a.ANI_id === currentAudio)
                      ?.ANI_urlAudio
                  }`
                : ""
            }
            onEnded={handleAudioEnded}
          />

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
              <p className="mb-4">
                Aucune animation disponible pour cette série.
              </p>
              <Button variant="primary" onClick={handleAddAnimation}>
                <FaPlus className="me-1" /> Ajouter une animation
              </Button>
            </div>
          ) : (
            <>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <Button variant="primary" onClick={handleAddAnimation}>
                  <FaPlus className="me-1" /> Ajouter une animation
                </Button>
              </div>

              {/* Affichage en grille avec des cartes */}
              <Row xs={1} md={2} lg={3} className="g-4">
                {filteredAnimations.map((animation) => (
                  <Col key={animation.ANI_id}>
                    <Card className="h-100 animation-card">
                      <div className="position-relative animation-image-container">
                        <Card.Img
                          variant="top"
                          src={`${process.env.REACT_APP_API_URL}${
                            viewMode[animation.ANI_id] === "reel"
                              ? animation.ANI_urlAnimation // Image réelle
                              : animation.ANI_urlAnimationDessin // Dessin par défaut
                          }`}
                          alt={animation.ANI_titre}
                          className="animation-thumbnail"
                          style={{ height: "160px", objectFit: "cover" }}
                        />

                        {/* Bouton pour basculer entre dessin/image réelle */}
                        <Button
                          variant="light"
                          size="sm"
                          className="position-absolute bottom-0 end-0 m-2"
                          onClick={() => {
                            setViewMode((prev) => ({
                              ...prev,
                              [animation.ANI_id]:
                                prev[animation.ANI_id] === "reel"
                                  ? "dessin"
                                  : "reel",
                            }));
                          }}
                          title={
                            viewMode[animation.ANI_id] === "reel"
                              ? "Voir le dessin"
                              : "Voir l'image réelle"
                          }
                        >
                          {viewMode[animation.ANI_id] === "reel"
                            ? "Dessin"
                            : "Réel"}
                        </Button>

                        <Badge
                          bg={
                            viewMode[animation.ANI_id] === "reel"
                              ? "primary"
                              : "success"
                          }
                          className="position-absolute bottom-0 start-0 m-2"
                        >
                          {viewMode[animation.ANI_id] === "reel"
                            ? "Image réelle"
                            : "Dessin"}
                        </Badge>

                        <Badge
                          bg={animation.ANI_valider ? "success" : "warning"}
                          className="position-absolute top-0 end-0 m-2"
                        >
                          {animation.ANI_valider ? "Validé" : "En attente"}
                        </Badge>
                      </div>
                      <Card.Body>
                        <Card.Title>
                          {animation.ANI_titre || "Sans titre"}
                        </Card.Title>
                        <Card.Text className="text-muted small">
                          {animation.ANI_description || "Pas de description"}
                        </Card.Text>
                      </Card.Body>
                      <Card.Footer className="d-flex justify-content-between align-items-center bg-white">
                        <div>
                          {animation.ANI_urlAudio && (
                            <Button
                              variant={
                                currentAudio === animation.ANI_id && isPlaying
                                  ? "success"
                                  : "outline-success"
                              }
                              size="sm"
                              onClick={() =>
                                toggleAudio(
                                  animation.ANI_id,
                                  animation.ANI_urlAudio
                                )
                              }
                              className="me-1"
                            >
                              {currentAudio === animation.ANI_id &&
                              isPlaying ? (
                                <FaPause />
                              ) : (
                                <FaPlay />
                              )}
                            </Button>
                          )}
                        </div>
                        <div>
                          <Button
                            variant="outline-primary"
                            size="sm"
                            className="me-1"
                            // onClick={() => handleEditAnimation(animation.ANI_id)}
                          >
                            <FaEdit />
                          </Button>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() =>
                              handleDeleteAnimation(animation.ANI_id)
                            }
                          >
                            <FaTrash />
                          </Button>
                        </div>
                      </Card.Footer>
                    </Card>
                  </Col>
                ))}
              </Row>

              {/* Message si aucun résultat après filtrage */}
              {filteredAnimations.length === 0 && (
                <div className="text-center p-4">
                  <p className="text-muted">
                    Aucune animation ne correspond à votre recherche
                  </p>
                </div>
              )}
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
    </>
  );
};

export default AnimationGestion;
