import React, { useState, useRef, useEffect } from "react";
import { Modal, Button, Badge } from "react-bootstrap";
import { FaVolumeUp, FaTimes } from "react-icons/fa";

const PreviewAnimation = ({ show, handleClose, animation }) => {
  const [currentView, setCurrentView] = useState("dessin");
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);

  const audioRef = useRef(null);

  // Reset lors de l'ouverture/fermeture
  useEffect(() => {
    if (show) {
      setTimeout(() => {
        const parentOverlay = document.createElement("div");
        parentOverlay.className = "preview-parent-overlay";
        parentOverlay.id = "preview-parent-overlay";
        parentOverlay.style.zIndex = "1045";
        
        document.body.appendChild(parentOverlay);
        document.body.classList.add("preview-active");
      }, 50);

      setCurrentView("dessin");
      setIsAudioPlaying(false);
    } else {
      const parentOverlay = document.getElementById("preview-parent-overlay");
      if (parentOverlay) {
        parentOverlay.remove();
      }
      document.body.classList.remove("preview-active");
      stopAudio();
    }
  }, [show]);

  // Nettoyage lors du démontage
  useEffect(() => {
    return () => {
      const parentOverlay = document.getElementById("preview-parent-overlay");
      if (parentOverlay) {
        parentOverlay.remove();
      }
      document.body.classList.remove("preview-active");
      stopAudio();
    };
  }, []);

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsAudioPlaying(false);
  };

  const toggleView = () => {
    setCurrentView((prev) => (prev === "dessin" ? "reel" : "dessin"));
  };

  const handleImageClick = async () => {
    if (animation?.ANI_urlAudio && audioRef.current) {
      try {
        if (isAudioPlaying) {
          audioRef.current.pause();
          setIsAudioPlaying(false);
        } else {
          audioRef.current.currentTime = 0;
          await audioRef.current.play();
          setIsAudioPlaying(true);
        }
      } catch (error) {
        console.error("Erreur lecture audio:", error);
      }
    }
  };

  const handleAudioEnded = () => {
    setIsAudioPlaying(false);
  };

  const handleModalClose = () => {
    stopAudio();
    handleClose();
  };

  if (!animation) {
    return null;
  }

  return (
    <Modal
      show={show}
      onHide={handleModalClose}
      centered
      backdrop={false}
      style={{ zIndex: 1060 }}
      dialogClassName="preview-modal-custom"
    >
      {/* Header avec classes Bootstrap */}
      <Modal.Header className="border-0 bg-white px-3 py-2">
        <Modal.Title className="h6 mb-0 me-auto">
          {animation.ANI_titre}
        </Modal.Title>
        <Button
          variant="outline-secondary"
          size="sm"
          onClick={handleModalClose}
          className="rounded-circle p-1"
          style={{ width: '32px', height: '32px' }}
        >
          <FaTimes size={12} />
        </Button>
      </Modal.Header>

      {/* Body sans padding */}
      <Modal.Body className="p-0 bg-white">
        {/* Conteneur d'image avec Bootstrap */}
        <div 
          className="position-relative d-flex justify-content-center align-items-center bg-white"
          onClick={handleImageClick}
          style={{ 
            cursor: animation?.ANI_urlAudio ? 'pointer' : 'default',
            overflow: 'hidden'
          }}
        >
          <img
            src={`${process.env.REACT_APP_API_URL}${
              currentView === "reel"
                ? animation.ANI_urlAnimation
                : animation.ANI_urlAnimationDessin
            }`}
            alt={currentView === "reel" ? "Image réelle" : "Dessin"}
            className="img-fluid"
            style={{ 
              maxWidth: '85vw',
              maxHeight: '70vh',
              objectFit: 'contain',
              transition: 'all 0.3s ease'
            }}
          />

          {/* Badge audio avec Bootstrap */}
          {animation.ANI_urlAudio && (
            <div className="position-absolute bottom-0 start-50 translate-middle-x mb-2">
              <Badge
                bg={isAudioPlaying ? "primary" : "dark"}
                className="px-2 py-1 rounded-pill"
                style={{ 
                  backdropFilter: 'blur(5px)',
                  fontSize: '0.7rem'
                }}
              >
                <FaVolumeUp size={10} className={isAudioPlaying ? "pulse" : ""} />
                {isAudioPlaying ? " ▶" : " ♪"}
              </Badge>
            </div>
          )}
        </div>

        {/* Audio caché */}
        {animation.ANI_urlAudio && (
          <audio
            ref={audioRef}
            src={`${process.env.REACT_APP_API_URL}${animation.ANI_urlAudio}`}
            onEnded={handleAudioEnded}
          />
        )}

        {/* Section des contrôles compacte */}
        <div className="px-3 py-2 bg-white border-top">
          {/* Bouton de basculement compact */}
          <div className="d-flex justify-content-center">
            <Button
              variant="outline-primary"
              size="sm"
              onClick={toggleView}
              className="rounded-pill px-3 py-1"
              style={{ 
                transition: 'all 0.3s ease',
                fontSize: '0.8rem'
              }}
            >
              {currentView === "reel" ? "Dessin" : "Réel"}
            </Button>
          </div>

          {/* Description compacte */}
          {animation.ANI_description && (
            <div className="mt-2">
              <p className="text-muted mb-0" style={{ fontSize: '0.75rem' }}>
                {animation.ANI_description}
              </p>
            </div>
          )}
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default PreviewAnimation;