import React from "react";
import AudioSelector from "../../../components/common/AudioSelector";

const StepFour = ({ formData, setFormData, handleFileChange }) => {
  const handleAudioChange = (file, fileName) => {
    setFormData({
      ...formData,
      audioFile: file,
      audioName: fileName,
    });
  };

  const handleAudioRemove = () => {
    setFormData({
      ...formData,
      audioFile: null,
      audioName: "",
      audioTrimmed: false,
      audioStartTime: null,
      audioEndTime: null,
    });
  };

  return (
    <>
      <h4 className="mb-3">Son de l'animation</h4>
      <AudioSelector
        audioFile={formData.audioFile}
        audioName={formData.audioName}
        onFileChange={handleAudioChange}
        onFileRemove={handleAudioRemove}
        showHelp={true}
        label="Sélectionnez un fichier audio *"
      />
    </>
  );
};

export default StepFour;