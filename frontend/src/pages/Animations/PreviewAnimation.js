import React, { useState, useRef, useEffect } from "react";
import { Button, Row, Col, Modal } from "react-bootstrap";
import { FaVolumeUp, FaImage, FaPaintBrush, FaTimes, FaChevronLeft, FaChevronRight } from "react-icons/fa";

const PreviewAnimation = ({
  // Props pour l'animation
  animation,
  
  // Props pour la gestion de la modale
  show = true,
  onClose,
  
  // Props pour la navigation
  showNavigation = true,
  onPrev,
  onNext,
  canPrev = false,
  canNext = false,
  currentIndex,
  totalCount,
  
  // Props pour l'audio
  setParentAudioPlaying,
  isAudioPlaying,
  
  // Props pour la redirection de fermeture
  redirectOnClose = null, // URL ou fonction de navigation
  navigate, // instance de useNavigate si needed
  
  // Props pour la personnalisation
  modalSize = "lg",
  zIndex = 2100,
  backdrop = "static",
  
  // Props pour les contrôles d'affichage
  showImageControls = true,
  showAudioControl = true,
  showTypeIndicator = true,
  showCounter = true,
  
  // Props pour le style
  className = "",
  modalClassName = "",
}) => {
  const [currentView, setCurrentView] = useState("dessin");
  const [localAudioPlaying, setLocalAudioPlaying] = useState(false);
  const audioRef = useRef(null);

  // Synchronise l'état audio local et parent
  useEffect(() => {
    setCurrentView("dessin");
    setLocalAudioPlaying(false);
    if (setParentAudioPlaying) setParentAudioPlaying(false);
    return () => {
      stopAudio();
    };
  }, [animation, setParentAudioPlaying]);

  useEffect(() => {
    if (setParentAudioPlaying) setParentAudioPlaying(localAudioPlaying);
  }, [localAudioPlaying, setParentAudioPlaying]);

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setLocalAudioPlaying(false);
    if (setParentAudioPlaying) setParentAudioPlaying(false);
  };

  const handleImageClick = async () => {
    if (animation?.ANI_urlAudio && audioRef.current && showAudioControl) {
      try {
        if (!localAudioPlaying) {
          audioRef.current.currentTime = 0;
          await audioRef.current.play();
          setLocalAudioPlaying(true);
          if (setParentAudioPlaying) setParentAudioPlaying(true);
        }
      } catch (error) {
        console.warn("Erreur lecture audio:", error);
      }
    }
  };

  const handleAudioEnded = () => {
    setLocalAudioPlaying(false);
    if (setParentAudioPlaying) setParentAudioPlaying(false);
  };

  const handleClose = () => {
    stopAudio();
    
    // Gestion de la redirection
    if (redirectOnClose) {
      if (typeof redirectOnClose === 'string') {
        // Si c'est une URL
        if (navigate) {
          navigate(redirectOnClose);
        } else {
          window.location.href = redirectOnClose;
        }
      } else if (typeof redirectOnClose === 'function') {
        // Si c'est une fonction
        redirectOnClose();
      }
    }
    
    // Appel du callback de fermeture
    if (onClose) {
      onClose();
    }
  };

  if (!animation) return null;

  // Utilise l'état audio global si fourni, sinon local
  const audioPlaying = typeof isAudioPlaying === "boolean" ? isAudioPlaying : localAudioPlaying;

  return (
    <Modal
      show={show}
      onHide={handleClose}
      centered
      backdrop={backdrop}
      size={modalSize}
      contentClassName={`bg-white rounded-4 shadow p-0 ${modalClassName}`}
      dialogClassName="modal-dialog-centered"
      style={{ zIndex }}
      className={className}
    >
      <Modal.Body className="p-0">
        {/* Bouton croix */}
        <Button
          variant="outline-danger"
          size="sm"
          className="rounded-circle position-absolute"
          style={{ top: 10, right: 10, width: 36, height: 36, zIndex: 3 }}
          onClick={handleClose}
          aria-label="Fermer"
          disabled={audioPlaying}
          title={audioPlaying ? "Attendez la fin du son" : "Fermer"}
        >
          <FaTimes />
        </Button>

        {/* Contenu avec ou sans navigation */}
        <div className={`d-flex align-items-center justify-content-center ${showNavigation ? '' : 'px-4'}`} style={{ minHeight: 320 }}>
          {/* Flèche précédent */}
          {showNavigation && (
            <Button
              variant="primary"
              onClick={onPrev}
              disabled={!canPrev || audioPlaying}
              className="rounded-circle d-flex align-items-center justify-content-center me-4"
              style={{ width: 56, height: 56, fontSize: 28, marginLeft: 16 }}
              aria-label="Précédent"
            >
              <FaChevronLeft />
            </Button>
          )}

          {/* Contenu central */}
          <div style={{ minWidth: 0, flex: 1 }}>
            {/* Image + audio */}
            <div
              className="position-relative d-flex justify-content-center align-items-center mb-4 w-100"
              onClick={showAudioControl ? handleImageClick : undefined}
              style={{
                background: "linear-gradient(135deg, #f8fafc 60%, #e3f0ff 100%)",
                borderRadius: 24,
                padding: 16,
                minHeight: 200,
                boxShadow: "0 4px 24px rgba(0,0,0,0.07)",
                cursor: (animation?.ANI_urlAudio && showAudioControl) ? 'pointer' : 'default',
                overflow: 'hidden'
              }}
            >
              <img
                src={`${process.env.REACT_APP_API_URL}${currentView === "reel"
                  ? animation.ANI_urlAnimation
                  : animation.ANI_urlAnimationDessin
                  }`}
                alt={currentView === "reel" ? "Image réelle" : "Dessin"}
                className="img-fluid preview-img-anim"
                style={{
                  maxWidth: '100%',
                  maxHeight: '45vh',
                  borderRadius: 16,
                  boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
                  transition: 'opacity 0.4s, transform 0.4s'
                }}
              />
            </div>

            {/* Audio caché */}
            {animation.ANI_urlAudio && showAudioControl && (
              <audio
                ref={audioRef}
                src={`${process.env.REACT_APP_API_URL}${animation.ANI_urlAudio}`}
                onEnded={handleAudioEnded}
              />
            )}

            {/* Contrôles visuels */}
            {(showImageControls || showAudioControl) && (
              <Row className="justify-content-center my-3">
                {showImageControls && (
                  <>
                    <Col xs="auto">
                      <Button
                        variant={currentView === "reel" ? "primary" : "outline-primary"}
                        size="lg"
                        className={`rounded-circle shadow ${currentView === "reel" ? "scale-btn" : ""}`}
                        style={{ width: 60, height: 60, fontSize: 24, transition: "transform 0.2s" }}
                        onClick={() => setCurrentView("reel")}
                        aria-label="Voir la photo réelle"
                      >
                        <FaImage />
                      </Button>
                    </Col>
                    <Col xs="auto">
                      <Button
                        variant={currentView === "dessin" ? "success" : "outline-success"}
                        size="lg"
                        className={`rounded-circle shadow ${currentView === "dessin" ? "scale-btn" : ""}`}
                        style={{ width: 60, height: 60, fontSize: 24, transition: "transform 0.2s" }}
                        onClick={() => setCurrentView("dessin")}
                        aria-label="Voir le dessin"
                      >
                        <FaPaintBrush />
                      </Button>
                    </Col>
                  </>
                )}
                {animation.ANI_urlAudio && showAudioControl && (
                  <Col xs="auto">
                    <Button
                      variant={audioPlaying ? "warning" : "info"}
                      size="lg"
                      className="rounded-circle shadow"
                      style={{ width: 60, height: 60, fontSize: 24, transition: "transform 0.2s" }}
                      onClick={handleImageClick}
                      aria-label="Écouter le son"
                      disabled={audioPlaying}
                    >
                      <FaVolumeUp className={audioPlaying ? "pulse" : ""} />
                    </Button>
                  </Col>
                )}
              </Row>
            )}

            {/* Compteur */}
            {showCounter && typeof currentIndex === "number" && typeof totalCount === "number" && (
              <div className="text-center text-secondary mb-2" style={{ fontWeight: 500 }}>
                <span>
                  {currentIndex + 1} / {totalCount}
                </span>
              </div>
            )}

            {/* Indicateur de type */}
            {showTypeIndicator && (
              <div className="text-center mt-2 mb-2">
                <span className={`badge rounded-pill px-3 py-2 ${currentView === "reel" ? "bg-primary" : "bg-success"}`}>
                  {currentView === "reel" ? "Photo réelle" : "Dessin"}
                </span>
              </div>
            )}
          </div>

          {/* Flèche suivant */}
          {showNavigation && (
            <Button
              variant="primary"
              onClick={onNext}
              disabled={!canNext || audioPlaying}
              className="rounded-circle d-flex align-items-center justify-content-center ms-4"
              style={{ width: 56, height: 56, fontSize: 28, marginRight: 16 }}
              aria-label="Suivant"
            >
              <FaChevronRight />
            </Button>
          )}
        </div>

        <style>
          {`
          .scale-btn {
            transform: scale(1.15);
            box-shadow: 0 0 0 4px #ffe066;
          }
          .preview-img-anim {
            transition: opacity 0.4s, transform 0.4s;
          }
          `}
        </style>
      </Modal.Body>
    </Modal>
  );
};

export default PreviewAnimation;