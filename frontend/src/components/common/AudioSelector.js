import React, { useRef, useEffect, useState } from "react";
import { Form, Card, Button, Alert } from "react-bootstrap";
import {
  FaUpload,
  FaPlay,
  FaPause,
  FaStop,
  FaSave,
  FaTrash,
  FaVolumeUp,
} from "react-icons/fa";
import WaveSurfer from "wavesurfer.js";
import RegionsPlugin from "wavesurfer.js/dist/plugins/regions.js";

const AudioSelector = ({
  audioFile,
  audioName,
  onFileChange,
  onFileRemove,
  showHelp = true,
  className = "",
  label = "Sélectionnez un fichier audio *",
}) => {
  const waveformRef = useRef(null);
  const wavesurferRef = useRef(null);
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPlayingSelection, setIsPlayingSelection] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [selectionStart, setSelectionStart] = useState(null);
  const [activeRegion, setActiveRegion] = useState(null);
  const [showTrimAlert, setShowTrimAlert] = useState(false);
  const [showHelpMode, setShowHelpMode] = useState(false);
  const [audioTrimmed, setAudioTrimmed] = useState(false);
  const selectionTimeoutRef = useRef(null);

  // Effet pour créer et détruire l'instance WaveSurfer
  useEffect(() => {
    if (audioFile && waveformRef.current) {
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
        fillParent: true,
        minPxPerSec: 1,
        hideScrollbar: true,
        autoCenter: false,
        scrollParent: false,
      });

      // Ajouter le plugin Regions
      try {
        wavesurfer.registerPlugin(RegionsPlugin.create());
      } catch (err) {
        console.warn("Erreur lors de l'initialisation du plugin Regions:", err);
      }

      // Charger le fichier audio
      const audioURL = URL.createObjectURL(audioFile);
      wavesurfer.load(audioURL);

      // Événements
      wavesurfer.on("ready", () => {
        setDuration(Math.round(wavesurfer.getDuration() * 10) / 10);
        wavesurfer.zoom(1);
      });

      wavesurfer.on("click", (e) => {
        try {
          const clickTime = wavesurfer.getCurrentTime();
          setCurrentTime(Math.round(clickTime * 10) / 10);
          setSelectionStart(clickTime);

          if (wavesurfer.regions) {
            if (typeof wavesurfer.regions.clear === "function") {
              wavesurfer.regions.clear();
            } else if (wavesurfer.regions.list) {
              Object.values(wavesurfer.regions.list).forEach((region) => {
                if (typeof region.remove === "function") {
                  region.remove();
                }
              });
            }

            const segmentEnd = Math.min(
              clickTime + 3,
              wavesurfer.getDuration()
            );
            const region = wavesurfer.regions.add({
              start: clickTime,
              end: segmentEnd,
              color: "rgba(255, 105, 105, 0.2)",
              drag: false,
              resize: false,
            });

            setActiveRegion(region);
          } else {
            setActiveRegion({
              start: clickTime,
              end: Math.min(clickTime + 3, wavesurfer.getDuration()),
            });
          }

          // Ne pas démarrer la lecture automatiquement après la sélection
          setShowTrimAlert(true);
        } catch (error) {
          console.error("Erreur lors du clic sur la forme d'onde:", error);
        }
      });

      wavesurfer.on("audioprocess", () => {
        if (!isPlayingSelection) {
          setCurrentTime(Math.round(wavesurfer.getCurrentTime() * 10) / 10);
        }
      });

      wavesurfer.on("play", () => {
        if (!isPlayingSelection) {
          setIsPlaying(true);
        }
      });

      wavesurfer.on("pause", () => {
        if (!isPlayingSelection) {
          setIsPlaying(false);
        }
      });

      wavesurfer.on("finish", () => {
        setIsPlaying(false);
        setIsPlayingSelection(false);
      });

      wavesurferRef.current = wavesurfer;

      return () => {
        URL.revokeObjectURL(audioURL);
        if (wavesurferRef.current) {
          wavesurferRef.current.destroy();
        }
        if (selectionTimeoutRef.current) {
          clearTimeout(selectionTimeoutRef.current);
        }
      };
    }
  }, [audioFile]);

  // Fonctions de contrôle
  const handlePlayPause = () => {
    if (wavesurferRef.current) {
      // Arrêter la lecture de sélection si elle est en cours
      if (isPlayingSelection) {
        handleStopSelection();
      }
      wavesurferRef.current.playPause();
    }
  };

  const handleStop = () => {
    if (wavesurferRef.current) {
      // Arrêter la lecture de sélection si elle est en cours
      if (isPlayingSelection) {
        handleStopSelection();
      }
      wavesurferRef.current.stop();
    }
  };

  // Nouvelle fonction pour lire uniquement la sélection
  const handlePlaySelection = () => {
    if (!wavesurferRef.current || !activeRegion) return;

    try {
      const startTime = activeRegion.start;
      const endTime = activeRegion.end;

      // Arrêter toute lecture en cours
      wavesurferRef.current.stop();

      setIsPlayingSelection(true);
      setIsPlaying(false);

      // Démarrer la lecture à partir du début de la sélection
      wavesurferRef.current.play(startTime);

      // Programmer l'arrêt à la fin de la sélection (3 secondes)
      selectionTimeoutRef.current = setTimeout(() => {
        if (wavesurferRef.current) {
          wavesurferRef.current.pause();
          // Retourner au début de la sélection au lieu de la position précédente
          wavesurferRef.current.seekTo(
            startTime / wavesurferRef.current.getDuration()
          );
          // Mettre à jour le temps affiché
          setCurrentTime(Math.round(startTime * 10) / 10);
        }
        setIsPlayingSelection(false);
      }, (endTime - startTime) * 1000);
    } catch (error) {
      console.error("Erreur lors de la lecture de la sélection:", error);
      setIsPlayingSelection(false);
    }
  };

  // Fonction pour arrêter la lecture de sélection
  const handleStopSelection = () => {
    if (selectionTimeoutRef.current) {
      clearTimeout(selectionTimeoutRef.current);
      selectionTimeoutRef.current = null;
    }
    setIsPlayingSelection(false);

    if (wavesurferRef.current && activeRegion) {
      wavesurferRef.current.pause();
      // Retourner au début de la sélection
      const startTime = activeRegion.start;
      wavesurferRef.current.seekTo(
        startTime / wavesurferRef.current.getDuration()
      );
      setCurrentTime(Math.round(startTime * 10) / 10);
    }
  };

  // Fonction pour extraire le segment audio
  const handleExtractSegment = async () => {
    if (!activeRegion || !audioFile) return;

    // Arrêter toute lecture en cours
    if (isPlayingSelection) {
      handleStopSelection();
    }

    try {
      const startTime = activeRegion.start;
      const endTime = activeRegion.end;

      const audioContext = new (window.AudioContext ||
        window.webkitAudioContext)();
      const audioData = await fetch(URL.createObjectURL(audioFile))
        .then((response) => response.arrayBuffer())
        .then((arrayBuffer) => audioContext.decodeAudioData(arrayBuffer));

      const sampleRate = audioData.sampleRate;
      const startSample = Math.floor(startTime * sampleRate);
      const endSample = Math.min(
        Math.floor(endTime * sampleRate),
        audioData.length
      );
      const frameCount = endSample - startSample;

      const segmentBuffer = audioContext.createBuffer(
        audioData.numberOfChannels,
        frameCount,
        sampleRate
      );

      for (let channel = 0; channel < audioData.numberOfChannels; channel++) {
        const sourceData = audioData.getChannelData(channel);
        const segmentData = segmentBuffer.getChannelData(channel);
        for (let i = 0; i < frameCount; i++) {
          segmentData[i] = sourceData[startSample + i];
        }
      }

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
      const wavBlob = bufferToWave(renderedBuffer, renderedBuffer.length);

      const trimmedFile = new File([wavBlob], `trimmed_${audioName}`, {
        type: "audio/wav",
      });

      // Notifier le parent du nouveau fichier
      onFileChange(trimmedFile, `trimmed_${audioName}`);

      setShowTrimAlert(false);
      setAudioTrimmed(true);

      if (wavesurferRef.current) {
        wavesurferRef.current.destroy();
        wavesurferRef.current = null;
      }
    } catch (error) {
      console.error("Erreur lors de l'extraction du segment audio:", error);
    }
  };

  // Fonction pour gérer la suppression du fichier
  const handleRemoveFile = () => {
    if (selectionTimeoutRef.current) {
      clearTimeout(selectionTimeoutRef.current);
    }

    if (wavesurferRef.current) {
      wavesurferRef.current.destroy();
      wavesurferRef.current = null;
    }

    setIsPlaying(false);
    setIsPlayingSelection(false);
    setCurrentTime(0);
    setDuration(0);
    setActiveRegion(null);
    setShowTrimAlert(false);
    setAudioTrimmed(false);

    if (onFileRemove) {
      onFileRemove();
    }
  };

  // Fonction pour gérer la sélection de fichier
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file && onFileChange) {
      onFileChange(file, file.name);
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

    setUint32(0x46464952);
    setUint32(length - 8);
    setUint32(0x45564157);
    setUint32(0x20746d66);
    setUint32(16);
    setUint16(1);
    setUint16(numOfChan);
    setUint32(abuffer.sampleRate);
    setUint32(abuffer.sampleRate * 2 * numOfChan);
    setUint16(numOfChan * 2);
    setUint16(16);
    setUint32(0x61746164);
    setUint32(length - pos - 4);

    for (let i = 0; i < abuffer.length; i++) {
      for (let channel = 0; channel < numOfChan; channel++) {
        let sample = Math.max(
          -1,
          Math.min(1, abuffer.getChannelData(channel)[i])
        );
        sample = sample < 0 ? sample * 0x8000 : sample * 0x7fff;
        view.setInt16(pos, sample, true);
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

  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className={className}>
      <Form.Group className="mb-3">
        <Form.Label>{label}</Form.Label>
        <div className="d-flex flex-column align-items-center">
          {audioName ? (
            <Card className="mb-3 w-100">
              <Card.Body className="text-center">
                {showHelp && (
                  <div className="d-flex justify-content-end mb-2">
                    <Button
                      variant="link"
                      className="text-muted p-0"
                      onClick={() => setShowHelpMode(!showHelpMode)}
                    >
                      {showHelpMode ? "Masquer l'aide" : "Besoin d'aide ?"}
                    </Button>
                  </div>
                )}

                <div className="mb-3">
                  <strong>Fichier audio sélectionné:</strong> {audioName}
                  {audioTrimmed && (
                    <span className="badge bg-success ms-2">Formaté</span>
                  )}
                </div>

                {showHelp && showHelpMode && (
                  <Alert variant="secondary" className="mb-3">
                    <h6 className="mb-2">Guide pas à pas :</h6>
                    <p className="mb-1">
                      <strong>1.</strong> Cliquez sur la forme d'onde bleue pour
                      sélectionner le début de votre extrait audio.
                    </p>
                    <p className="mb-1">
                      <strong>2.</strong> Une zone rouge apparaît pour indiquer
                      les 3 secondes sélectionnées.
                    </p>
                    <p className="mb-1">
                      <strong>3.</strong> Utilisez "Lire la sélection" pour
                      écouter uniquement les 3 secondes choisies.
                    </p>
                    <p className="mb-1">
                      <strong>4.</strong> Si satisfait, cliquez sur "Extraire ce
                      segment" pour finaliser.
                    </p>
                    <p className="mb-0">
                      <strong>Astuce :</strong> La lecture complète avec
                      Play/Pause reste disponible pour naviguer dans tout le
                      fichier.
                    </p>
                  </Alert>
                )}

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

                <div className="d-flex justify-content-between mb-3">
                  <small className="text-muted">
                    {formatTime(currentTime)}
                  </small>
                  <small className="text-muted">{formatTime(duration)}</small>
                </div>

                {showTrimAlert && (
                  <Alert variant="info" className="mb-3">
                    <div className="text-center">
                      <strong>📍 Sélection :</strong> 3 secondes à partir de{" "}
                      <strong>{formatTime(selectionStart)}</strong> jusqu'à{" "}
                      <strong>
                        {formatTime(Math.min(selectionStart + 3, duration))}
                      </strong>
                      <br />
                      <small className="text-muted">
                        Utilisez "Lire la sélection" pour écouter uniquement
                        cette partie
                      </small>
                    </div>
                  </Alert>
                )}

                <div className="d-flex flex-wrap justify-content-center gap-2 mb-3">
                  {/* Lecture complète */}
                  <Button
                    variant={isPlaying ? "outline-warning" : "outline-primary"}
                    size="sm"
                    onClick={handlePlayPause}
                    disabled={isPlayingSelection}
                  >
                    {isPlaying ? <FaPause /> : <FaPlay />}
                    {isPlaying ? " Pause" : " Lecture"}
                  </Button>

                  {/* Stop général */}
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    onClick={handleStop}
                    disabled={!isPlaying && !isPlayingSelection}
                  >
                    <FaStop /> Stop
                  </Button>

                  {/* Lecture de la sélection */}
                  {showTrimAlert && (
                    <Button
                      variant={isPlayingSelection ? "warning" : "info"}
                      size="sm"
                      onClick={
                        isPlayingSelection
                          ? handleStopSelection
                          : handlePlaySelection
                      }
                      disabled={isPlaying}
                    >
                      {isPlayingSelection ? (
                        <>
                          <FaPause className="me-1" /> Arrêter sélection
                        </>
                      ) : (
                        <>
                          <FaVolumeUp className="me-1" /> Lire la sélection
                        </>
                      )}
                    </Button>
                  )}

                  {/* Extraire le segment */}
                  {showTrimAlert && (
                    <Button
                      variant="success"
                      size="sm"
                      onClick={handleExtractSegment}
                      disabled={isPlaying || isPlayingSelection}
                    >
                      <FaSave className="me-1" /> Extraire ce segment
                    </Button>
                  )}

                  {/* Supprimer */}
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={handleRemoveFile}
                    disabled={isPlaying || isPlayingSelection}
                  >
                    <FaTrash /> Supprimer
                  </Button>
                </div>

                {audioFile && (
                  <audio ref={audioRef} style={{ display: "none" }}>
                    <source src={URL.createObjectURL(audioFile)} />
                  </audio>
                )}
              </Card.Body>
            </Card>
          ) : (
            <div
              className="upload-box p-4 border rounded text-center mb-3 w-100"
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
            onChange={handleFileSelect}
            className="d-none"
          />
        </div>
        <Form.Text className="text-muted">
          Formats acceptés: MP3, WAV, OGG | Cliquez sur la forme d'onde pour
          sélectionner 3 secondes • Utilisez "Lire la sélection" pour tester
          votre choix
        </Form.Text>
      </Form.Group>
    </div>
  );
};

export default AudioSelector;
