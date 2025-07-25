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
  modalSize = "xl",
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
    
    if (redirectOnClose) {
      if (typeof redirectOnClose === 'string') {
        if (navigate) {
          navigate(redirectOnClose);
        } else {
          window.location.href = redirectOnClose;
        }
      } else if (typeof redirectOnClose === 'function') {
        redirectOnClose();
      }
    }
    
    if (onClose) {
      onClose();
    }
  };

  if (!animation) return null;

  const audioPlaying = typeof isAudioPlaying === "boolean" ? isAudioPlaying : localAudioPlaying;

  return (
    <Modal
      show={show}
      onHide={handleClose}
      centered
      backdrop={backdrop}
      size={modalSize}
      contentClassName={`bg-gradient rounded-4 shadow-lg border-0 ${modalClassName}`}
      dialogClassName="modal-dialog-centered modal-fullscreen-md-down"
      style={{ zIndex }}
      className={`animation-modal ${className}`}
    >
     <Modal.Body className="p-0 position-relative overflow-hidden">
        <div 
          className="position-absolute w-100 h-100"
          style={{
            background: `linear-gradient(135deg, 
              ${currentView === "reel" ? "#e3f2fd 0%, #bbdefb 50%, #90caf9 100%" : "#e8f5e8 0%, #c8e6c9 50%, #a5d6a7 100%"})`,
            transition: "background 0.5s ease"
          }}
        />

        <Button
          variant="light"
          size="sm"
          className="rounded-circle position-absolute shadow-sm border-0 d-flex align-items-center justify-content-center"
          style={{ 
            top: 15, 
            right: 15, 
            width: 40, 
            height: 40, 
            zIndex: 10,
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            transition: 'all 0.3s ease',
            fontSize: '14px'
          }}
          onClick={handleClose}
          aria-label="Fermer"
          disabled={audioPlaying}
          title={audioPlaying ? "Attendez la fin du son" : "Fermer"}
          onMouseEnter={(e) => {
            e.target.style.transform = 'scale(1.1)';
            e.target.style.backgroundColor = 'rgba(255, 99, 99, 0.9)';
            e.target.style.color = 'white';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'scale(1)';
            e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
            e.target.style.color = '#6c757d';
          }}
        >
          <FaTimes />
        </Button>

        <div className="position-relative h-100">
          <div className="d-block d-md-none p-3">
            {showCounter && typeof currentIndex === "number" && typeof totalCount === "number" && (
              <div className="text-center mb-3">
                <span className="badge bg-white text-primary px-3 py-2 rounded-pill shadow-sm" style={{ fontSize: '14px', fontWeight: 'bold' }}>
                  {currentIndex + 1} / {totalCount}
                </span>
              </div>
            )}

            <div className="mb-3">
              <div
                className="position-relative d-flex justify-content-center align-items-center w-100 user-select-none"
                onClick={showAudioControl ? handleImageClick : undefined}
                style={{
                  background: "rgba(255, 255, 255, 0.2)",
                  borderRadius: 20,
                  padding: 12,
                  minHeight: 250,
                  backdropFilter: "blur(10px)",
                  border: "2px solid rgba(255, 255, 255, 0.3)",
                  cursor: (animation?.ANI_urlAudio && showAudioControl) ? 'pointer' : 'default',
                  transition: 'all 0.3s ease'
                }}
              >
                <img
                  src={`${process.env.REACT_APP_API_URL}${currentView === "reel"
                    ? animation.ANI_urlAnimation
                    : animation.ANI_urlAnimationDessin
                    }`}
                  alt={currentView === "reel" ? "Image réelle" : "Dessin"}
                  className="img-fluid"
                  style={{
                    maxWidth: '100%',
                    maxHeight: '40vh',
                    borderRadius: 16,
                    boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
                    transition: 'transform 0.3s ease'
                  }}
                  onLoad={(e) => {
                    e.target.style.animation = 'bounceIn 0.6s ease-out';
                  }}
                />
              </div>
            </div>

            {(showImageControls || showAudioControl) && (
              <Row className="justify-content-center mb-3 g-2">
                {showImageControls && (
                  <>
                    <Col xs="auto">
                      <Button
                        variant={currentView === "reel" ? "primary" : "light"}
                        size="lg"
                        className={`rounded-circle shadow-sm border-0 ${currentView === "reel" ? "active-btn" : ""}`}
                        style={{ 
                          width: 60, 
                          height: 60, 
                          fontSize: 20,
                          transition: "all 0.3s ease",
                          backgroundColor: currentView === "reel" ? "#2196f3" : "rgba(255, 255, 255, 0.9)"
                        }}
                        onClick={() => setCurrentView("reel")}
                        aria-label="Voir la photo réelle"
                      >
                        <FaImage />
                      </Button>
                    </Col>
                    <Col xs="auto">
                      <Button
                        variant={currentView === "dessin" ? "success" : "light"}
                        size="lg"
                        className={`rounded-circle shadow-sm border-0 ${currentView === "dessin" ? "active-btn" : ""}`}
                        style={{ 
                          width: 60, 
                          height: 60, 
                          fontSize: 20,
                          transition: "all 0.3s ease",
                          backgroundColor: currentView === "dessin" ? "#4caf50" : "rgba(255, 255, 255, 0.9)"
                        }}
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
                      className="rounded-circle shadow-sm border-0"
                      style={{ 
                        width: 60, 
                        height: 60, 
                        fontSize: 20,
                        transition: "all 0.3s ease",
                        backgroundColor: audioPlaying ? "#ff9800" : "#00bcd4"
                      }}
                      onClick={handleImageClick}
                      aria-label="Écouter le son"
                      disabled={audioPlaying}
                    >
                      <FaVolumeUp className={audioPlaying ? "audio-pulse" : ""} />
                    </Button>
                  </Col>
                )}
              </Row>
            )}

            {showNavigation && (
              <Row className="justify-content-between align-items-center px-2">
                <Col xs="auto">
                  <Button
                    variant="light"
                    onClick={onPrev}
                    disabled={!canPrev || audioPlaying}
                    className="rounded-circle shadow-sm border-0 d-flex align-items-center justify-content-center nav-btn"
                    style={{ 
                      width: 45, 
                      height: 45, 
                      fontSize: 16,
                      backgroundColor: 'rgba(255, 255, 255, 0.8)',
                      opacity: canPrev ? 1 : 0.3
                    }}
                    aria-label="Précédent"
                  >
                    <FaChevronLeft />
                  </Button>
                </Col>
                <Col xs="auto">
                  <Button
                    variant="light"
                    onClick={onNext}
                    disabled={!canNext || audioPlaying}
                    className="rounded-circle shadow-sm border-0 d-flex align-items-center justify-content-center nav-btn"
                    style={{ 
                      width: 45, 
                      height: 45, 
                      fontSize: 16,
                      backgroundColor: 'rgba(255, 255, 255, 0.8)',
                      opacity: canNext ? 1 : 0.3
                    }}
                    aria-label="Suivant"
                  >
                    <FaChevronRight />
                  </Button>
                </Col>
              </Row>
            )}
          </div>

          <div className="d-none d-md-flex h-100 align-items-center position-relative">
            {showNavigation && (
              <>
                <Button
                  variant="light"
                  onClick={onPrev}
                  disabled={!canPrev || audioPlaying}
                  className="position-absolute rounded-circle shadow-sm border-0 nav-btn-desktop"
                  style={{ 
                    left: 20, 
                    top: '50%', 
                    transform: 'translateY(-50%)',
                    width: 50, 
                    height: 50, 
                    fontSize: 18,
                    backgroundColor: 'rgba(255, 255, 255, 0.7)',
                    backdropFilter: 'blur(10px)',
                    opacity: canPrev ? 0.8 : 0.3,
                    zIndex: 5,
                    transition: 'all 0.3s ease'
                  }}
                  aria-label="Précédent"
                  onMouseEnter={(e) => {
                    if (canPrev) e.target.style.opacity = '1';
                  }}
                  onMouseLeave={(e) => {
                    if (canPrev) e.target.style.opacity = '0.8';
                  }}
                >
                  <FaChevronLeft />
                </Button>

                <Button
                  variant="light"
                  onClick={onNext}
                  disabled={!canNext || audioPlaying}
                  className="position-absolute rounded-circle shadow-sm border-0 nav-btn-desktop"
                  style={{ 
                    right: 20, 
                    top: '50%', 
                    transform: 'translateY(-50%)',
                    width: 50, 
                    height: 50, 
                    fontSize: 18,
                    backgroundColor: 'rgba(255, 255, 255, 0.7)',
                    backdropFilter: 'blur(10px)',
                    opacity: canNext ? 0.8 : 0.3,
                    zIndex: 5,
                    transition: 'all 0.3s ease'
                  }}
                  aria-label="Suivant"
                  onMouseEnter={(e) => {
                    if (canNext) e.target.style.opacity = '1';
                  }}
                  onMouseLeave={(e) => {
                    if (canNext) e.target.style.opacity = '0.8';
                  }}
                >
                  <FaChevronRight />
                </Button>
              </>
            )}

            <div className="flex-grow-1 px-5 py-4 text-center">
              {showCounter && typeof currentIndex === "number" && typeof totalCount === "number" && (
                <div className="mb-3">
                  <span className="badge bg-white text-primary px-4 py-2 rounded-pill shadow-sm" style={{ fontSize: '16px', fontWeight: 'bold' }}>
                    {currentIndex + 1} / {totalCount}
                  </span>
                </div>
              )}

              <div className="mb-4">
                <div
                  className="position-relative d-inline-block user-select-none"
                  onClick={showAudioControl ? handleImageClick : undefined}
                  style={{
                    background: "rgba(255, 255, 255, 0.2)",
                    borderRadius: 24,
                    padding: 20,
                    backdropFilter: "blur(15px)",
                    border: "3px solid rgba(255, 255, 255, 0.3)",
                    cursor: (animation?.ANI_urlAudio && showAudioControl) ? 'pointer' : 'default',
                    transition: 'all 0.3s ease',
                    boxShadow: "0 16px 64px rgba(0,0,0,0.1)"
                  }}
                >
                  <img
                    src={`${process.env.REACT_APP_API_URL}${currentView === "reel"
                      ? animation.ANI_urlAnimation
                      : animation.ANI_urlAnimationDessin
                      }`}
                    alt={currentView === "reel" ? "Image réelle" : "Dessin"}
                    className="img-fluid"
                    style={{
                      maxWidth: '100%',
                      maxHeight: '60vh',
                      borderRadius: 20,
                      boxShadow: "0 12px 40px rgba(0,0,0,0.2)",
                      transition: 'all 0.3s ease'
                    }}
                    onLoad={(e) => {
                      e.target.style.animation = 'zoomIn 0.8s ease-out';
                    }}
                  />
                </div>
              </div>

              {(showImageControls || showAudioControl) && (
                <Row className="justify-content-center g-3">
                  {showImageControls && (
                    <>
                      <Col xs="auto">
                        <Button
                          variant={currentView === "reel" ? "primary" : "light"}
                          size="lg"
                          className={`rounded-circle shadow border-0 control-btn ${currentView === "reel" ? "active-btn" : ""}`}
                          style={{ 
                            width: 80, 
                            height: 80, 
                            fontSize: 28,
                            transition: "all 0.3s ease",
                            backgroundColor: currentView === "reel" ? "#2196f3" : "rgba(255, 255, 255, 0.9)"
                          }}
                          onClick={() => setCurrentView("reel")}
                          aria-label="Voir la photo réelle"
                        >
                          <FaImage />
                        </Button>
                      </Col>
                      <Col xs="auto">
                        <Button
                          variant={currentView === "dessin" ? "success" : "light"}
                          size="lg"
                          className={`rounded-circle shadow border-0 control-btn ${currentView === "dessin" ? "active-btn" : ""}`}
                          style={{ 
                            width: 80, 
                            height: 80, 
                            fontSize: 28,
                            transition: "all 0.3s ease",
                            backgroundColor: currentView === "dessin" ? "#4caf50" : "rgba(255, 255, 255, 0.9)"
                          }}
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
                        className="rounded-circle shadow border-0 control-btn"
                        style={{ 
                          width: 80, 
                          height: 80, 
                          fontSize: 28,
                          transition: "all 0.3s ease",
                          backgroundColor: audioPlaying ? "#ff9800" : "#00bcd4"
                        }}
                        onClick={handleImageClick}
                        aria-label="Écouter le son"
                        disabled={audioPlaying}
                      >
                        <FaVolumeUp className={audioPlaying ? "audio-pulse" : ""} />
                      </Button>
                    </Col>
                  )}
                </Row>
              )}

              {showTypeIndicator && (
                <div className="mt-3">
                  <span className={`badge rounded-pill px-4 py-2 ${currentView === "reel" ? "bg-primary" : "bg-success"}`} style={{ fontSize: '14px' }}>
                    {currentView === "reel" ? "Photo réelle" : "Dessin"}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {animation.ANI_urlAudio && showAudioControl && (
          <audio
            ref={audioRef}
            src={`${process.env.REACT_APP_API_URL}${animation.ANI_urlAudio}`}
            onEnded={handleAudioEnded}
          />
        )}

        <style>
          {`
          .animation-modal .modal-content {
            border: none !important;
            overflow: hidden;
          }
          
          .active-btn {
            transform: scale(1.1) !important;
            box-shadow: 0 0 0 4px rgba(255, 255, 255, 0.5) !important;
          }
          
          .control-btn:hover {
            transform: scale(1.05) !important;
          }
          
          .nav-btn:hover {
            transform: scale(1.1) !important;
          }
          
          .nav-btn-desktop:hover {
            transform: translateY(-50%) scale(1.1) !important;
          }
          
          .audio-pulse {
            animation: pulse 1s infinite;
          }
          
          @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.1); }
            100% { transform: scale(1); }
          }
          
          @keyframes bounceIn {
            0% { transform: scale(0.3); opacity: 0; }
            50% { transform: scale(1.05); }
            70% { transform: scale(0.9); }
            100% { transform: scale(1); opacity: 1; }
          }
          
          @keyframes zoomIn {
            0% { transform: scale(0.8); opacity: 0; }
            100% { transform: scale(1); opacity: 1; }
          }
          
          @media (max-width: 768px) {
            .modal-fullscreen-md-down .modal-dialog {
              margin: 0;
              width: 100vw;
              height: 100vh;
              max-width: none;
            }
            
            .modal-fullscreen-md-down .modal-content {
              height: 100vh;
              border-radius: 0 !important;
            }
          }
          `}
        </style>
      </Modal.Body>
    </Modal>
  );
};

export default PreviewAnimation;