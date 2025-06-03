import React, { useState, useEffect, useRef } from "react";
import {
  Modal,
  Button,
  Form,
  Alert,
  Spinner,
  Row,
  Col,
  Card,
} from "react-bootstrap";
import axiosInstance from "../../api/axiosConfig";
import AudioSelector from "../../components/common/AudioSelector";
import {
  FaSave,
  FaImage,
  FaMusic,
  FaPlay,
  FaPause,
  FaStop,
} from "react-icons/fa";

const EditAnimation = ({ show, handleClose, animation, updateAnimation }) => {
  const [formData, setFormData] = useState({
    ANI_titre: "",
    ANI_description: "",
    ANI_type: "",
  });
  const [files, setFiles] = useState({
    dessinImage: null,
    imageReelle: null,
    audioFile: null,
  });
  const [filePreviews, setFilePreviews] = useState({
    dessinImage: null,
    imageReelle: null,
    audioFile: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [previewMode, setPreviewMode] = useState("dessin");
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [audioCurrentTime, setAudioCurrentTime] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);
  const [newAudioFile, setNewAudioFile] = useState(null);
  const [newAudioName, setNewAudioName] = useState("");
  const [audioSelectorKey, setAudioSelectorKey] = useState(0);

  const audioRef = useRef(null);

  // Initialiser le formulaire avec les données de l'animation
  useEffect(() => {
    if (animation) {
      setFormData({
        ANI_titre: animation.ANI_titre || "",
        ANI_description: animation.ANI_description || "",
        ANI_type: animation.ANI_type || "",
      });
      setPreviewMode("dessin");
    }
  }, [animation]);

  // Reset du formulaire à la fermeture
  useEffect(() => {
    if (!show) {
      setFormData({
        ANI_titre: "",
        ANI_description: "",
        ANI_type: "",
      });
      setFiles({
        dessinImage: null,
        imageReelle: null,
        audioFile: null,
      });
      setFilePreviews({
        dessinImage: null,
        imageReelle: null,
        audioFile: null,
      });
      setNewAudioFile(null);
      setNewAudioName("");
      setError("");
      setPreviewMode("dessin");
      stopAudio();

      // SOLUTION : Forcer le re-render de l'AudioSelector
      setAudioSelectorKey((prev) => prev + 1);
    }
  }, [show]);

  // Fonctions de gestion audio
  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsAudioPlaying(false);
    setAudioCurrentTime(0);
  };

  const toggleAudio = async () => {
    if (audioRef.current) {
      try {
        if (isAudioPlaying) {
          audioRef.current.pause();
          setIsAudioPlaying(false);
        } else {
          await audioRef.current.play();
          setIsAudioPlaying(true);
        }
      } catch (error) {
        console.error("Erreur lecture audio:", error);
      }
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

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const { name } = e.target;
    const file = e.target.files[0];

    setFiles((prev) => ({
      ...prev,
      [name]: file,
    }));

    // Créer une prévisualisation
    if (file) {
      if (name === "audioFile") {
        // Pour l'audio, on stocke juste le nom du fichier
        setFilePreviews((prev) => ({
          ...prev,
          [name]: {
            name: file.name,
            size: file.size,
            type: file.type,
          },
        }));
      } else {
        // Pour les images, créer une URL de prévisualisation
        const reader = new FileReader();
        reader.onload = (event) => {
          setFilePreviews((prev) => ({
            ...prev,
            [name]: event.target.result,
          }));
        };
        reader.readAsDataURL(file);
      }
    } else {
      // Supprimer la prévisualisation si aucun fichier
      setFilePreviews((prev) => ({
        ...prev,
        [name]: null,
      }));
    }
  };

  const removeFilePreview = (fieldName) => {
    setFiles((prev) => ({
      ...prev,
      [fieldName]: null,
    }));
    setFilePreviews((prev) => ({
      ...prev,
      [fieldName]: null,
    }));

    // Reset l'input file
    const fileInput = document.querySelector(`input[name="${fieldName}"]`);
    if (fileInput) {
      fileInput.value = "";
    }
  };

  const handleNewAudioChange = (file, fileName) => {
    setNewAudioFile(file);
    setNewAudioName(fileName);

    // Mettre à jour aussi l'état files pour l'envoi
    setFiles((prev) => ({
      ...prev,
      audioFile: file,
    }));
  };

  const handleNewAudioRemove = () => {
    setNewAudioFile(null);
    setNewAudioName("");

    // Nettoyer aussi l'état files
    setFiles((prev) => ({
      ...prev,
      audioFile: null,
    }));
  };

  const validateForm = () => {
    if (!formData.ANI_titre.trim()) {
      setError("Le titre est obligatoire");
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
      const updateData = new FormData();

      // Ajouter les données texte (même si inchangées pour le titre)
      updateData.append("ANI_titre", formData.ANI_titre);
      if (formData.ANI_description) {
        updateData.append("ANI_description", formData.ANI_description);
      }
      if (formData.ANI_type) {
        updateData.append("ANI_type", formData.ANI_type);
      }

      // Ajouter l'ID de la série pour que le middleware puisse fonctionner
      updateData.append("SES_id", animation.SES_id);

      // Ajouter les nouveaux fichiers s'ils sont présents
      if (files.dessinImage) {
        updateData.append("dessinImage", files.dessinImage);
      }
      if (files.imageReelle) {
        updateData.append("imageReelle", files.imageReelle);
      }
      if (files.audioFile) {
        updateData.append("audioFile", files.audioFile);
      }

      console.log("Données envoyées:", {
        titre: formData.ANI_titre,
        description: formData.ANI_description,
        hasDessin: !!files.dessinImage,
        hasImageReelle: !!files.imageReelle,
        hasAudio: !!files.audioFile,
      });

      const response = await axiosInstance.put(
        `/ani/${animation.ANI_id}`,
        updateData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Mettre à jour l'animation dans le composant parent
      updateAnimation(response.data);

      // Fermer la modale
      handleClose();
    } catch (err) {
      console.error("Erreur lors de la modification:", err);
      setError(
        err.response?.data?.message ||
          "Erreur lors de la modification de l'animation"
      );
    } finally {
      setLoading(false);
    }
  };

  const togglePreview = () => {
    setPreviewMode((prev) => (prev === "dessin" ? "reel" : "dessin"));
  };

  if (!animation) {
    return null;
  }

  return (
    <Modal
      show={show}
      onHide={handleClose}
      size="xl"
      backdrop="static"
      className="animation-gestion-modal"
    >
      <Modal.Header closeButton className="bg-primary text-white">
        <Modal.Title>
          <FaSave className="me-2" />
          Modifier l'animation : {animation.ANI_titre}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Row>
            {/* Colonne gauche - Prévisualisation */}
            <Col md={3}>
              <Card className="mb-3">
                <Card.Header className="d-flex justify-content-between align-items-center">
                  <span>Prévisualisation actuelle</span>
                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={togglePreview}
                  >
                    {previewMode === "dessin" ? "Voir réel" : "Voir dessin"}
                  </Button>
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
                      style={{ height: "200px", objectFit: "contain" }}
                    />
                  </div>

                  {/* Section audio */}
                  {animation.ANI_urlAudio && (
                    <div className="p-3">
                      {/* Contrôles audio */}
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

                      {/* Barre de progression */}
                      <div className="mb-2">
                        <div className="progress" style={{ height: "6px" }}>
                          <div
                            className="progress-bar bg-primary"
                            role="progressbar"
                            style={{
                              width:
                                audioDuration > 0
                                  ? `${
                                      (audioCurrentTime / audioDuration) * 100
                                    }%`
                                  : "0%",
                            }}
                          ></div>
                        </div>
                      </div>

                      {/* Temps */}
                      <div className="d-flex justify-content-between text-muted small">
                        <span>{formatTime(audioCurrentTime)}</span>
                        <span>{formatTime(audioDuration)}</span>
                      </div>

                      {/* Element audio caché */}
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

            {/* Colonne droite - Formulaire */}
            <Col md={4}>
              {/* Informations de base */}
              <Card className="mb-3">
                <Card.Header>Informations</Card.Header>
                <Card.Body>
                  <Form.Group className="mb-3">
                    <Form.Label>Titre *</Form.Label>
                    <Form.Control
                      type="text"
                      name="ANI_titre"
                      value={formData.ANI_titre}
                      onChange={handleInputChange}
                      placeholder="Titre de l'animation"
                      required
                    />
                  </Form.Group>
                </Card.Body>
              </Card>
            </Col>
            <Col md={5}>
              {/* Nouveaux fichiers */}
              <Card className="mb-3">
                <Card.Header>
                  <FaImage className="me-2" />
                  Remplacer les images (optionnel)
                </Card.Header>
                <Card.Body>
                  {/* Nouveau dessin */}
                  <Form.Group className="mb-3">
                    <Form.Label>Nouveau dessin</Form.Label>
                    <Form.Control
                      type="file"
                      name="dessinImage"
                      onChange={handleFileChange}
                      accept="image/*"
                    />
                    <Form.Text className="text-muted">
                      Laissez vide pour conserver l'image actuelle
                    </Form.Text>

                    {/* Prévisualisation du nouveau dessin */}
                    {filePreviews.dessinImage && (
                      <div className="mt-2">
                        <div className="position-relative d-inline-block">
                          <img
                            src={filePreviews.dessinImage}
                            alt="Prévisualisation nouveau dessin"
                            className="img-thumbnail"
                            style={{ maxHeight: "100px", maxWidth: "150px" }}
                          />
                          <Button
                            variant="danger"
                            size="sm"
                            className="position-absolute top-0 end-0 rounded-circle d-flex align-items-center justify-content-center"
                            style={{
                              transform: "translate(50%, -50%)",
                              width: "24px",
                              height: "24px",
                              padding: "0",
                              fontSize: "12px",
                              lineHeight: "1",
                            }}
                            onClick={() => removeFilePreview("dessinImage")}
                          >
                            ×
                          </Button>
                        </div>
                        <div className="small text-muted mt-1">
                          Nouveau fichier sélectionné
                        </div>
                      </div>
                    )}
                  </Form.Group>

                  {/* Nouvelle image réelle */}
                  <Form.Group className="mb-3">
                    <Form.Label>Nouvelle image réelle</Form.Label>
                    <Form.Control
                      type="file"
                      name="imageReelle"
                      onChange={handleFileChange}
                      accept="image/*"
                    />
                    <Form.Text className="text-muted">
                      Laissez vide pour conserver l'image actuelle
                    </Form.Text>

                    {/* Prévisualisation de la nouvelle image réelle */}
                    {filePreviews.imageReelle && (
                      <div className="mt-2">
                        <div className="position-relative d-inline-block">
                          <img
                            src={filePreviews.imageReelle}
                            alt="Prévisualisation"
                            className="img-thumbnail"
                            style={{ maxHeight: "100px", maxWidth: "150px" }}
                          />
                          <Button
                            variant="danger"
                            size="sm"
                            className="position-absolute top-0 end-0 rounded-circle d-flex align-items-center justify-content-center"
                            style={{
                              transform: "translate(50%, -50%)",
                              width: "24px",
                              height: "24px",
                              padding: "0",
                              fontSize: "12px",
                              lineHeight: "1",
                            }}
                            onClick={() => removeFilePreview("imageReelle")}
                          >
                            ×
                          </Button>
                        </div>
                        <div className="small text-muted mt-1">
                          Nouveau fichier sélectionné
                        </div>
                      </div>
                    )}
                  </Form.Group>
                </Card.Body>
              </Card>
            </Col>
            <Col md={12}>
              {/* Section audio avec le sous-composant */}
              <Card className="mb-3">
                <Card.Header>
                  <FaMusic className="me-2" />
                  Remplacer l'audio (optionnel)
                </Card.Header>
                <Card.Body>
                  {/* Sélecteur audio */}
                  <AudioSelector
                    key={audioSelectorKey}
                    audioFile={newAudioFile}
                    audioName={newAudioName}
                    onFileChange={handleNewAudioChange}
                    onFileRemove={handleNewAudioRemove}
                    showHelp={true}
                    label=""
                  />

                  <Form.Text className="text-muted">
                    Laissez vide pour conserver l'audio actuel
                  </Form.Text>
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
        <Button variant="primary" onClick={handleSubmit} disabled={loading}>
          {loading ? (
            <>
              <Spinner animation="border" size="sm" className="me-2" />
              Modification...
            </>
          ) : (
            <>
              <FaSave className="me-2" />
              Sauvegarder
            </>
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditAnimation;
