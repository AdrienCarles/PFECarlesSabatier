import React, { useRef, useEffect, useState } from "react";
import { Form, Card, Button, Alert } from "react-bootstrap";
import {
  FaUpload,
  FaPlay,
  FaPause,
  FaStop,
  FaSave,
} from "react-icons/fa";
import WaveSurfer from "wavesurfer.js";
import RegionsPlugin from "wavesurfer.js/dist/plugins/regions.js";

const StepFour = ({ formData, setFormData, handleFileChange }) => {
  const waveformRef = useRef(null);
  const wavesurferRef = useRef(null);
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [selectionStart, setSelectionStart] = useState(null);
  const [activeRegion, setActiveRegion] = useState(null);
  const [showTrimAlert, setShowTrimAlert] = useState(false);
  const [showHelpMode, setShowHelpMode] = useState(false);

  // Effet pour créer et détruire l'instance WaveSurfer
  useEffect(() => {
    // Ne créer la visualisation que si un fichier audio est présent
    if (formData.audioFile && waveformRef.current) {
      // Détruire l'instance précédente si elle existe
      if (wavesurferRef.current) {
        wavesurferRef.current.destroy();
      }

      // Créer une nouvelle instance WaveSurfer
      const wavesurfer = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: "#4F709C",
        progressColor: "#213555",
        cursorColor: "#FF6969",
        barWidth: 2,
        barGap: 1,
        barRadius: 2,
        height: 80,
        responsive: true,
        normalize: true,
        interact: true,
        fillParent: true, // Forcer l'adaptation à la taille du conteneur
        minPxPerSec: 1, // Comprimer au maximum la forme d'onde
        hideScrollbar: true, // Cacher la barre de défilement
        autoCenter: false, // Désactiver le centrage auto
        scrollParent: false, // Désactiver le défilement
      });

      // Ajouter le plugin Regions après la création
      try {
        wavesurfer.registerPlugin(RegionsPlugin.create());
      } catch (err) {
        console.warn("Erreur lors de l'initialisation du plugin Regions:", err);
      }

      // Charger le fichier audio
      const audioURL = URL.createObjectURL(formData.audioFile);
      wavesurfer.load(audioURL);

      // Événement: quand la forme d'onde est prête
      wavesurfer.on("ready", () => {
        // Définir la durée de l'audio
        setDuration(Math.round(wavesurfer.getDuration() * 10) / 10);

        // Ajuster la vue pour voir l'ensemble de la forme d'onde
        wavesurfer.zoom(1);
      });

      // Événement: quand l'utilisateur clique sur la forme d'onde
      wavesurfer.on("click", (e) => {
        try {
          const clickTime = wavesurfer.getCurrentTime();
          setCurrentTime(Math.round(clickTime * 10) / 10);
          setSelectionStart(clickTime);

          // Vérifier que regions existe
          if (wavesurfer.regions) {
            // Supprimer les régions précédentes
            if (typeof wavesurfer.regions.clear === "function") {
              wavesurfer.regions.clear();
            } else if (wavesurfer.regions.list) {
              Object.values(wavesurfer.regions.list).forEach((region) => {
                if (typeof region.remove === "function") {
                  region.remove();
                }
              });
            }

            // Calculer la fin du segment
            const segmentEnd = Math.min(
              clickTime + 3,
              wavesurfer.getDuration()
            );

            // Créer une nouvelle région
            const region = wavesurfer.regions.add({
              start: clickTime,
              end: segmentEnd,
              color: "rgba(255, 105, 105, 0.2)",
              drag: false,
              resize: false,
            });

            setActiveRegion(region);
          } else {
            // Fallback si regions n'est pas disponible
            setActiveRegion({
              start: clickTime,
              end: Math.min(clickTime + 3, wavesurfer.getDuration()),
            });
          }

          // Lecture depuis ce point
          if (isPlaying) {
            wavesurfer.play(clickTime);
          }

          // Afficher l'alerte
          setShowTrimAlert(true);
        } catch (error) {
          console.error("Erreur lors du clic sur la forme d'onde:", error);
        }
      });

      // Événement: mise à jour lors de la lecture
      wavesurfer.on("audioprocess", () => {
        setCurrentTime(Math.round(wavesurfer.getCurrentTime() * 10) / 10);
      });

      // Événements: lecture/pause
      wavesurfer.on("play", () => setIsPlaying(true));
      wavesurfer.on("pause", () => setIsPlaying(false));
      wavesurfer.on("finish", () => setIsPlaying(false));

      // Stocker l'instance dans la ref
      wavesurferRef.current = wavesurfer;

      // Nettoyer l'URL lors du démontage
      return () => {
        URL.revokeObjectURL(audioURL);
        if (wavesurferRef.current) {
          wavesurferRef.current.destroy();
        }
      };
    }
  }, [formData.audioFile]);

  // Fonctions de contrôle
  const handlePlayPause = () => {
    if (wavesurferRef.current) {
      wavesurferRef.current.playPause();
    }
  };

  const handleStop = () => {
    if (wavesurferRef.current) {
      wavesurferRef.current.stop();
    }
  };

  // Fonction pour extraire le segment audio sélectionné
  const handleExtractSegment = async () => {
    if (!activeRegion || !formData.audioFile) return;

    try {
      // Créer un élément audio pour la lecture du fichier
      const audio = new Audio();
      audio.src = URL.createObjectURL(formData.audioFile);

      // Obtenir les temps de début et fin en secondes
      const startTime = activeRegion.start;
      const endTime = activeRegion.end;

      // Utiliser l'API Web Audio pour extraire le segment
      const audioContext = new (window.AudioContext ||
        window.webkitAudioContext)();
      const audioData = await fetch(URL.createObjectURL(formData.audioFile))
        .then((response) => response.arrayBuffer())
        .then((arrayBuffer) => audioContext.decodeAudioData(arrayBuffer));

      // Calculer les positions d'échantillons
      const sampleRate = audioData.sampleRate;
      const startSample = Math.floor(startTime * sampleRate);
      const endSample = Math.min(
        Math.floor(endTime * sampleRate),
        audioData.length
      );
      const frameCount = endSample - startSample;

      // Créer un nouveau buffer pour le segment
      const segmentBuffer = audioContext.createBuffer(
        audioData.numberOfChannels,
        frameCount,
        sampleRate
      );

      // Copier les données audio du segment
      for (let channel = 0; channel < audioData.numberOfChannels; channel++) {
        const sourceData = audioData.getChannelData(channel);
        const segmentData = segmentBuffer.getChannelData(channel);
        for (let i = 0; i < frameCount; i++) {
          segmentData[i] = sourceData[startSample + i];
        }
      }

      // Convertir le segment en fichier WAV
      const offlineContext = new OfflineAudioContext(
        segmentBuffer.numberOfChannels,
        segmentBuffer.length,
        segmentBuffer.sampleRate
      );

      const source = offlineContext.createBufferSource();
      source.buffer = segmentBuffer;
      source.connect(offlineContext.destination);
      source.start(0);

      const renderedBuffer = await offlineContext.startRendering();

      // Convertir le buffer en WAV
      const wavBlob = bufferToWave(renderedBuffer, renderedBuffer.length);

      // Créer un fichier à partir du blob
      const trimmedFile = new File([wavBlob], `trimmed_${formData.audioName}`, {
        type: "audio/wav",
      });

      // Mise à jour du formulaire avec le nouveau fichier audio
      setFormData({
        ...formData,
        audioFile: trimmedFile,
        audioName: `trimmed_${formData.audioName}`,
        audioTrimmed: true,
        audioStartTime: startTime,
        audioEndTime: endTime,
      });

      // Masquer l'alerte
      setShowTrimAlert(false);

      // Réinitialiser le lecteur avec le nouveau fichier audio
      if (wavesurferRef.current) {
        wavesurferRef.current.destroy();
        wavesurferRef.current = null;
      }

      // L'effet useEffect se déclenchera à nouveau avec le nouveau fichier
    } catch (error) {
      console.error("Erreur lors de l'extraction du segment audio:", error);
    }
  };

  // Convertir un buffer audio en fichier WAV
  function bufferToWave(abuffer, len) {
    const numOfChan = abuffer.numberOfChannels;
    const length = len * numOfChan * 2 + 44;
    const buffer = new ArrayBuffer(length);
    const view = new DataView(buffer);
    let offset = 0;
    let pos = 0;

    // Write WAVE header
    setUint32(0x46464952); // "RIFF"
    setUint32(length - 8); // file length - 8
    setUint32(0x45564157); // "WAVE"

    setUint32(0x20746d66); // "fmt " chunk
    setUint32(16); // length = 16
    setUint16(1); // PCM
    setUint16(numOfChan);
    setUint32(abuffer.sampleRate);
    setUint32(abuffer.sampleRate * 2 * numOfChan); // avg. bytes/sec
    setUint16(numOfChan * 2); // block-align
    setUint16(16); // 16-bit

    setUint32(0x61746164); // "data" chunk
    setUint32(length - pos - 4); // chunk length

    // Write interleaved data
    for (let i = 0; i < abuffer.length; i++) {
      for (let channel = 0; channel < numOfChan; channel++) {
        // interleave channels
        let sample = Math.max(
          -1,
          Math.min(1, abuffer.getChannelData(channel)[i])
        ); // clamp
        sample = sample < 0 ? sample * 0x8000 : sample * 0x7fff; // scale to 16-bit signed int
        view.setInt16(pos, sample, true); // write 16-bit sample
        pos += 2;
      }
    }

    function setUint16(data) {
      view.setUint16(pos, data, true);
      pos += 2;
    }

    function setUint32(data) {
      view.setUint32(pos, data, true);
      pos += 4;
    }

    return new Blob([buffer], { type: "audio/wav" });
  }

  // Formater le temps (mm:ss)
  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <>
      <h4 className="mb-3">Son de l'animation</h4>
      <Form.Group className="mb-3">
        <Form.Label>Sélectionnez un fichier audio *</Form.Label>
        <div className="d-flex flex-column align-items-center">
          {formData.audioName ? (
            <Card className="mb-3 w-100">
              <Card.Body className="text-center">
                {/* Bouton d'aide */}
                <div className="d-flex justify-content-end mb-2">
                  <Button
                    variant="link"
                    className="text-muted p-0"
                    onClick={() => setShowHelpMode(!showHelpMode)}
                  >
                    {showHelpMode ? "Masquer l'aide" : "Besoin d'aide ?"}
                  </Button>
                </div>

                <div className="mb-3">
                  <strong>Fichier audio sélectionné:</strong>{" "}
                  {formData.audioName}
                  {formData.audioTrimmed && (
                    <span className="badge bg-success ms-2">Formaté</span>
                  )}
                </div>

                {/* Mode d'aide détaillé (visible si showHelpMode est true) */}
                {showHelpMode && (
                  <Alert variant="secondary" className="mb-3">
                    <h6 className="mb-2">Guide pas à pas :</h6>
                    <p className="mb-1">
                      Cliquez sur la forme d'onde bleue pour sélectionner le
                      début de votre extrait audio.
                    </p>
                    <p className="mb-1">
                      Seules les 3 secondes suivant votre sélection seront
                      utilisées.
                    </p>
                    <p className="mb-1">
                      Utilisez les boutons Play/Pause pour vérifier votre
                      sélection.
                    </p>
                    <p className="mb-0">
                      Cliquez sur "Extraire ce segment" quand vous êtes
                      satisfait.
                    </p>
                  </Alert>
                )}

                {/* Conteneur pour la visualisation de l'onde sonore */}
                <div
                  ref={waveformRef}
                  className="w-100 mb-2 audio-waveform"
                  style={{
                    minHeight: "80px",
                    background: "#f8f9fa",
                    borderRadius: "4px",
                    cursor: "pointer",
                    overflow: "hidden",
                  }}
                ></div>

                {/* Affichage du temps */}
                <div className="d-flex justify-content-between mb-3">
                  <small className="text-muted">
                    {formatTime(currentTime)}
                  </small>
                  <small className="text-muted">{formatTime(duration)}</small>
                </div>

                {/* Information sur le segment sélectionné */}
                {showTrimAlert && (
                  <Alert variant="info" className="mb-3">
                    <div className="text-center">
                      <strong>3 secondes</strong> sélectionnées à partir de{" "}
                      <strong>{formatTime(selectionStart)}</strong> jusqu'à{" "}
                      <strong>
                        {formatTime(Math.min(selectionStart + 3, duration))}
                      </strong>
                    </div>
                  </Alert>
                )}

                {/* ZONE CENTRALISÉE DES BOUTONS */}
                <div className="d-flex flex-wrap justify-content-center gap-3 mb-3">
                  {/* Boutons de contrôle lecture */}
                  <Button
                    variant={isPlaying ? "outline-warning" : "outline-primary"}
                    onClick={handlePlayPause}
                  >
                    {isPlaying ? <FaPause /> : <FaPlay />}
                    {isPlaying ? " Pause" : " Lecture"}
                  </Button>

                  <Button variant="outline-secondary" onClick={handleStop}>
                    <FaStop /> Stop
                  </Button>

                  {/* Bouton d'extraction - visible uniquement si une sélection est active */}
                  {showTrimAlert && (
                    <Button variant="success" onClick={handleExtractSegment}>
                      <FaSave className="me-1" /> Extraire ce segment
                    </Button>
                  )}

                  {/* Bouton de suppression */}
                  <Button
                    variant="outline-danger"
                    onClick={() => {
                      // Nettoyer la visualisation
                      if (wavesurferRef.current) {
                        wavesurferRef.current.destroy();
                        wavesurferRef.current = null;
                      }

                      // Mettre à jour l'état
                      setFormData({
                        ...formData,
                        audioFile: null,
                        audioName: "",
                        audioTrimmed: false,
                        audioStartTime: null,
                        audioEndTime: null,
                      });

                      // Réinitialiser les états
                      setIsPlaying(false);
                      setCurrentTime(0);
                      setDuration(0);
                      setActiveRegion(null);
                      setShowTrimAlert(false);
                    }}
                  >
                    Supprimer
                  </Button>
                </div>

                {/* Audio element (invisible mais utilisé pour la compatibilité) */}
                {formData.audioFile && (
                  <audio ref={audioRef} style={{ display: "none" }}>
                    <source src={URL.createObjectURL(formData.audioFile)} />
                  </audio>
                )}
              </Card.Body>
            </Card>
          ) : (
            <div
              className="upload-box p-5 border rounded text-center mb-3 w-100"
              style={{
                cursor: "pointer",
                background: "#f8f9fa",
                transition: "all 0.2s ease",
              }}
              onClick={() => document.getElementById("audioFileInput").click()}
            >
              <FaUpload size={40} className="mb-3 text-secondary" />
              <p>
                Glissez-déposez votre fichier audio ici ou cliquez pour
                parcourir
              </p>
            </div>
          )}

          <Form.Control
            id="audioFileInput"
            type="file"
            accept="audio/*"
            onChange={(e) => handleFileChange(e, "audio")}
            className="d-none"
          />
        </div>
        <Form.Text className="text-muted">
          Formats acceptés: MP3, WAV, OGG | Cliquez sur la forme d'onde pour
          créer un extrait de 3 secondes
        </Form.Text>
      </Form.Group>
    </>
  );
};

export default StepFour;
