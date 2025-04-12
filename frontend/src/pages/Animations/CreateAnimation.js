import React, { useState, useEffect, useContext } from "react";
import { Modal, Button, Form, Alert, Spinner } from "react-bootstrap";
import axiosInstance from "../../api/axiosConfig";
import AuthContext from "../../context/AuthContext";

// Composants d'étapes importés
import ProgressSteps from "./CreateAnimation/ProgressSteps";
import StepOne from "./CreateAnimation/StepOne";
import StepTwo from "./CreateAnimation/StepTwo";
import StepThree from "./CreateAnimation/StepThree";
import StepFour from "./CreateAnimation/StepFour";
import FormNavigation from "./CreateAnimation/FormNavigation";

const CreateAnimation = ({ show, handleClose, serieId, addAnimation }) => {
  const { user } = useContext(AuthContext);
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // État du formulaire
  const [formData, setFormData] = useState({
    // Étape 1: Généralités
    ANI_titre: "",
    ANI_description: "",
    ANI_type: "standard",

    // Étape 2: Image dessin
    dessinFile: null,
    dessinPreview: null,
    dessinType: "dessin", // Explicitement indiquer le type

    // Étape 3: Image réelle
    imageReelleFile: null,
    imageReellePreview: null,
    imageReelleType: "reel", // Explicitement indiquer le type

    // Étape 4: Son
    audioFile: null,
    audioName: "",

    // Champs requis pour l'API
    SES_id: serieId,
    USR_creator_id: user?.id || null,
  });

  // Reset le formulaire quand la modale est ouverte/fermée
  useEffect(() => {
    if (show) {
      setFormData({
        ...formData,
        SES_id: serieId,
        USR_creator_id: user?.id || null,
      });
      setCurrentStep(1);
      setError("");
      setSuccess(false);
    }
  }, [show, serieId, user]);

  // Gestion des changements de champs textuels
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Gestion des fichiers uploadés
  const handleFileChange = (e, fileType) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (fileType === "dessin") {
        setFormData({
          ...formData,
          dessinFile: file,
          dessinPreview: reader.result,
          dessinType: "dessin",
        });
      } else if (fileType === "imageReelle") {
        setFormData({
          ...formData,
          imageReelleFile: file,
          imageReellePreview: reader.result,
          imageReelleType: "reel", 
        });
      } else if (fileType === "audio") {
        setFormData({
          ...formData,
          audioFile: file,
          audioName: file.name,
        });
      }
    };
    reader.readAsDataURL(file);
  };

  // Navigation entre les étapes
  const nextStep = () => {
    if (validateCurrentStep()) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  // Validation de l'étape actuelle
  const validateCurrentStep = () => {
    setError("");

    if (currentStep === 1) {
      if (!formData.ANI_titre.trim()) {
        setError("Le titre est requis");
        return false;
      }
    } else if (currentStep === 2) {
      if (!formData.dessinFile) {
        setError("Vous devez uploader une image de type dessin");
        return false;
      }
    } else if (currentStep === 3) {
      if (!formData.imageReelleFile) {
        setError("Vous devez uploader une image réelle");
        return false;
      }
    } else if (currentStep === 4) {
      if (!formData.audioFile) {
        setError("Vous devez sélectionner un fichier audio");
        return false;
      }
    }

    return true;
  };

  // Soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateCurrentStep()) return;

    setLoading(true);
    setError("");

    try {
      // Créer un FormData pour l'upload des fichiers
      const formDataToSend = new FormData();
      formDataToSend.append("ANI_titre", formData.ANI_titre);
      formDataToSend.append("ANI_description", formData.ANI_description);
      formDataToSend.append("ANI_type", formData.ANI_type);
      formDataToSend.append("SES_id", formData.SES_id);
      formDataToSend.append("USR_creator_id", formData.USR_creator_id);
      formDataToSend.append("dessinImage", formData.dessinFile);
      formDataToSend.append("dessinType", formData.dessinType);
      formDataToSend.append("imageReelle", formData.imageReelleFile);
      formDataToSend.append("imageReelleType", formData.imageReelleType);
      formDataToSend.append("audioFile", formData.audioFile);
      console.log("FormData:", formDataToSend); // Debugging line
      // Appel API pour créer l'animation
      const response = await axiosInstance.post("/ani", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Ajouter la nouvelle animation à la liste locale
      if (addAnimation && typeof addAnimation === "function") {
        addAnimation(response.data);
      }

      setSuccess(true);
      setTimeout(() => {
        handleClose();
      }, 2000);
    } catch (err) {
      console.error("Erreur lors de la création de l'animation:", err);
      setError(
        err.response?.data?.message ||
          "Une erreur est survenue lors de la création de l'animation"
      );
    } finally {
      setLoading(false);
    }
  };

  // Rendu du contenu de l'étape actuelle
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <StepOne formData={formData} handleChange={handleChange} />;
      case 2:
        return (
          <StepTwo
            formData={formData}
            setFormData={setFormData}
            handleFileChange={handleFileChange}
          />
        );
      case 3:
        return (
          <StepThree
            formData={formData}
            setFormData={setFormData}
            handleFileChange={handleFileChange}
          />
        );
      case 4:
        return (
          <StepFour
            formData={formData}
            setFormData={setFormData}
            handleFileChange={handleFileChange}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Modal
      show={show}
      onHide={handleClose}
      size="lg"
      backdrop="static"
      keyboard={false}
    >
      <Modal.Header closeButton>
        <Modal.Title>Création d'une nouvelle animation</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {loading && (
          <div className="text-center mb-4">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Chargement...</span>
            </Spinner>
            <p className="mt-2">Création de l'animation en cours...</p>
          </div>
        )}

        {success ? (
          <Alert variant="success">
            L'animation a été créée avec succès ! Redirection...
          </Alert>
        ) : (
          <Form onSubmit={(e) => e.preventDefault()}>
            <ProgressSteps currentStep={currentStep} />

            {error && <Alert variant="danger">{error}</Alert>}

            {renderStepContent()}

            {!loading && (
              <FormNavigation
                currentStep={currentStep}
                prevStep={prevStep}
                nextStep={nextStep}
                handleSubmit={handleSubmit}
                loading={loading}
              />
            )}
          </Form>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default CreateAnimation;
