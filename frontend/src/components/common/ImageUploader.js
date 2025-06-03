import React from 'react';
import { Form, Image } from 'react-bootstrap';
import useFileUpload from '../../hooks/useFileUpload';

/**
 * Composant de téléchargement d'image réutilisable
 */
const ImageUploader = ({
  label = "Image",
  currentImage = null,
  onFileSelected,
  isRequired = false,
  altText = "Image",
  validTypes = ["image/jpeg", "image/png"],
  maxSizeInMB = 5,
  setError
}) => {
  const {
    file,
    preview,
    error,
    handleFileChange,
    resetFile
  } = useFileUpload({
    validTypes,
    maxSizeInMB,
    onValidationError: (msg) => {
      if (setError) setError(msg);
    }
  });

  // Mettre à jour le composant parent lorsque le fichier change
  React.useEffect(() => {
    if (onFileSelected) {
      onFileSelected(file);
    }
  }, [file, onFileSelected]);

  return (
    <Form.Group className="mb-3">
      <Form.Label>{label} :</Form.Label>

      {/* Affichage de l'image actuelle */}
      {currentImage && !preview && (
        <div className="mb-3 text-center">
          <p>Image actuelle :</p>
          <Image
            src={currentImage}
            alt={altText}
            style={{ maxHeight: "200px", maxWidth: "100%" }}
            thumbnail
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/images/default-image.png";
            }}
          />
        </div>
      )}

      <Form.Control
        type="file"
        accept={validTypes.join(',')}
        onChange={handleFileChange}
        required={isRequired}
      />
      <Form.Text className="text-muted">
        Formats acceptés: {validTypes.map(type => type.split('/')[1].toUpperCase()).join(', ')}. 
        Taille max: {maxSizeInMB}MB.
        {currentImage && " Laissez vide pour conserver l'image actuelle."}
      </Form.Text>

      {/* Prévisualisation de la nouvelle image */}
      {preview && (
        <div className="text-center mb-3 mt-3">
          <p>Nouvelle image (aperçu) :</p>
          <Image
            src={preview}
            alt="Aperçu"
            style={{ maxHeight: "200px", maxWidth: "100%" }}
            thumbnail
          />
        </div>
      )}

      {/* Affichage de l'erreur */}
      {error && <div className="text-danger mt-2">{error}</div>}
    </Form.Group>
  );
};

export default ImageUploader;