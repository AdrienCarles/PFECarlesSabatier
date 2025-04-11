import { useState } from 'react';

const useFileUpload = ({
  validTypes = ["image/jpeg", "image/png", "image/gif", "image/svg+xml"],
  maxSizeInMB = 5,
  onValidationError = () => {}
}) => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    // Validation du type de fichier
    if (!validTypes.includes(selectedFile.type)) {
      const formattedTypes = validTypes.map(type => type.split('/')[1].toUpperCase()).join(', ');
      const errorMsg = `Format non supporté. Formats acceptés: ${formattedTypes}`;
      setError(errorMsg);
      onValidationError(errorMsg);
      return;
    }

    // Validation de la taille
    if (selectedFile.size > maxSizeInMB * 1024 * 1024) {
      const errorMsg = `Fichier trop volumineux (max ${maxSizeInMB}MB)`;
      setError(errorMsg);
      onValidationError(errorMsg);
      return;
    }

    // Stocker le fichier
    setFile(selectedFile);

    // Créer une URL pour la prévisualisation
    const previewURL = URL.createObjectURL(selectedFile);
    setPreview(previewURL);

    setError("");
  };

  /**
   * Réinitialise l'état du fichier
   */
  const resetFile = () => {
    if (preview && preview.startsWith("blob:")) {
      URL.revokeObjectURL(preview);
    }
    setFile(null);
    setPreview(null);
    setError("");
  };

  return {
    file,
    preview,
    error,
    handleFileChange,
    resetFile,
    setFile,
    setPreview
  };
};

export default useFileUpload;