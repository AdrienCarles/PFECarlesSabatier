import React, { useState, useEffect } from "react";
import { Modal, Button, Table, Alert, Spinner } from "react-bootstrap";
import axiosInstance from "../../api/axiosConfig";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";

const AnimationGestion = ({ show, handleClose, serieId }) => {
  const [animations, setAnimations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [serie, setSerie] = useState(null);

  useEffect(() => {
    if (show && serieId) {
      setLoading(true);
      setError("");

      // Récupérer les détails de la série, y compris ses animations
      axiosInstance
        .get(`/ses/${serieId}`)
        .then((response) => {
          setSerie(response.data);

          // Si la série contient un tableau d'animations, utilisez-le
          if (
            response.data.animations &&
            Array.isArray(response.data.animations)
          ) {
            setAnimations(response.data.animations);
          } else {
            // Sinon, faites une requête spécifique pour les animations de cette série
            return axiosInstance.get(`/ses/${serieId}/animations`);
          }
        })
        .then((animationsResponse) => {
          if (animationsResponse) {
            setAnimations(animationsResponse.data);
          }
          setLoading(false);
        })
        .catch((err) => {
          console.error("Erreur lors du chargement des animations:", err);
          setError(`Erreur lors du chargement des animations: ${err.message}`);
          setLoading(false);
        });
    }
  }, [show, serieId]);

  const handleAddAnimation = () => {
    // Implémenter la navigation vers la page d'ajout d'animation avec le serieId en paramètre
    // ou ouvrir une modale d'ajout d'animation
    console.log(`Ajouter une animation à la série ${serieId}`);
    // Cette fonction pourrait être implémentée plus tard
  };

  const handleEditAnimation = (animationId) => {
    // Implémenter l'édition d'une animation
    console.log(`Éditer l'animation ${animationId}`);
    // Cette fonction pourrait être implémentée plus tard
  };

  const handleDeleteAnimation = (animationId) => {
    if (
      window.confirm("Êtes-vous sûr de vouloir supprimer cette animation ?")
    ) {
      axiosInstance
        .delete(`/animations/${animationId}`)
        .then(() => {
          setAnimations(
            animations.filter((anim) => anim.ANI_id !== animationId)
          );
          alert("Animation supprimée avec succès");
        })
        .catch((err) => {
          console.error("Erreur lors de la suppression:", err);
          setError(`Erreur lors de la suppression: ${err.message}`);
        });
    }
  };

  return (
    <Modal
      show={show}
      onHide={handleClose}
      size="xl"
      backdrop="static"
      keyboard={false}
    >
      <Modal.Header closeButton>
        <Modal.Title>
          Gestion des animations {serie && `- ${serie.SES_titre}`}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {loading ? (
          <div className="text-center">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Chargement...</span>
            </Spinner>
          </div>
        ) : error ? (
          <Alert variant="danger">{error}</Alert>
        ) : animations.length === 0 ? (
          <div className="text-center">
            <p>Aucune animation disponible pour cette série.</p>
            <Button variant="primary" onClick={handleAddAnimation}>
              <FaPlus className="me-1" /> Ajouter une animation
            </Button>
          </div>
        ) : (
          <>
            <div className="mb-3">
              <Button variant="primary" onClick={handleAddAnimation}>
                <FaPlus className="me-1" /> Ajouter une animation
              </Button>
            </div>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Titre</th>
                  <th>Description</th>
                  <th>Statut</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {animations.map((animation) => (
                  <tr key={animation.ANI_id}>
                    <td>{animation.ANI_titre || "Sans titre"}</td>
                    <td>{animation.ANI_description || "Pas de description"}</td>
                    <td>{animation.ANI_statut || "inconnu"}</td>
                    <td>
                      <Button
                        variant="outline-primary"
                        size="sm"
                        className="me-1"
                        onClick={() => handleEditAnimation(animation.ANI_id)}
                      >
                        <FaEdit />
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleDeleteAnimation(animation.ANI_id)}
                      >
                        <FaTrash />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Fermer
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AnimationGestion;
