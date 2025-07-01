import React, { useState, useRef, useEffect } from "react";
import { Button } from "react-bootstrap";
import { FaVolumeUp, FaImage, FaPaintBrush, FaTimes } from "react-icons/fa";

const PreviewAnimation = ({ animation, onClose, setParentAudioPlaying }) => {
  const [currentView, setCurrentView] = useState("dessin");
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    setCurrentView("dessin");
    setIsAudioPlaying(false);
    if (setParentAudioPlaying) setParentAudioPlaying(false);
    return () => {
      stopAudio();
    };
    // eslint-disable-next-line
  }, [animation]);

  useEffect(() => {
    if (setParentAudioPlaying) setParentAudioPlaying(isAudioPlaying);
    // eslint-disable-next-line
  }, [isAudioPlaying]);

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsAudioPlaying(false);
    if (setParentAudioPlaying) setParentAudioPlaying(false);
  };

  const handleImageClick = async () => {
    if (animation?.ANI_urlAudio && audioRef.current) {
      try {
        if (!isAudioPlaying) {
          audioRef.current.currentTime = 0;
          await audioRef.current.play();
          setIsAudioPlaying(true);
          if (setParentAudioPlaying) setParentAudioPlaying(true);
        }
        // Si déjà en train de jouer, ne rien faire !
      } catch (error) {
        // ignore
      }
    }
  };

  const handleAudioEnded = () => {
    setIsAudioPlaying(false);
    if (setParentAudioPlaying) setParentAudioPlaying(false);
  };

  if (!animation) return null;

  return (
    <div className="bg-white rounded-4 shadow position-relative p-0" style={{ overflow: "hidden" }}>
      {/* Bouton croix */}
      {onClose && (
        <Button
          variant="outline-danger"
          size="sm"
          className="rounded-circle position-absolute"
          style={{ top: 10, right: 10, width: 36, height: 36, zIndex: 3 }}
          onClick={onClose}
          aria-label="Fermer"
        >
          <FaTimes />
        </Button>
      )}

      {/* Image + audio */}
      <div
        className="position-relative d-flex justify-content-center align-items-center mb-4"
        onClick={handleImageClick}
        style={{
          background: "linear-gradient(135deg, #f8fafc 60%, #e3f0ff 100%)",
          borderRadius: 24,
          padding: 16,
          minHeight: 250,
          boxShadow: "0 4px 24px rgba(0,0,0,0.07)",
          cursor: animation?.ANI_urlAudio ? 'pointer' : 'default',
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
            maxWidth: '85vw',
            maxHeight: '60vh',
            borderRadius: 16,
            boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
            transition: 'opacity 0.4s, transform 0.4s'
          }}
        />
      </div>

      {/* Audio caché */}
      {animation.ANI_urlAudio && (
        <audio
          ref={audioRef}
          src={`${process.env.REACT_APP_API_URL}${animation.ANI_urlAudio}`}
          onEnded={handleAudioEnded}
        />
      )}

      {/* Contrôles visuels */}
      <div className="d-flex justify-content-center gap-3 my-3">
        <Button
          variant={currentView === "reel" ? "primary" : "outline-primary"}
          size="lg"
          className={`rounded-circle shadow ${currentView === "reel" ? "scale-btn" : ""}`}
          style={{ width: 70, height: 70, fontSize: 28, transition: "transform 0.2s" }}
          onClick={() => setCurrentView("reel")}
          aria-label="Voir la photo réelle"
        >
          <FaImage />
        </Button>
        <Button
          variant={currentView === "dessin" ? "success" : "outline-success"}
          size="lg"
          className={`rounded-circle shadow ${currentView === "dessin" ? "scale-btn" : ""}`}
          style={{ width: 70, height: 70, fontSize: 28, transition: "transform 0.2s" }}
          onClick={() => setCurrentView("dessin")}
          aria-label="Voir le dessin"
        >
          <FaPaintBrush />
        </Button>
        {animation.ANI_urlAudio && (
          <Button
            variant={isAudioPlaying ? "warning" : "info"}
            size="lg"
            className="rounded-circle shadow"
            style={{ width: 70, height: 70, fontSize: 28, transition: "transform 0.2s" }}
            onClick={handleImageClick}
            aria-label="Écouter le son"
            disabled={isAudioPlaying}
          >
            <FaVolumeUp className={isAudioPlaying ? "pulse" : ""} />
          </Button>
        )}
      </div>
      <div className="text-center mt-2 mb-2">
        <span className={`badge rounded-pill px-3 py-2 ${currentView === "reel" ? "bg-primary" : "bg-success"}`}>
          {currentView === "reel" ? "Photo réelle" : "Dessin"}
        </span>
      </div>
      {animation.ANI_description && (
        <div className="mt-2 px-3">
          <p className="text-muted mb-0" style={{ fontSize: '0.95rem' }}>
            {animation.ANI_description}
          </p>
        </div>
      )}
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
    </div>
  );
};

export default PreviewAnimation;