import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Spinner,
  Alert,
} from "react-bootstrap";
import axiosInstance from "../../api/axiosConfig";
import { FaPlay } from "react-icons/fa";
import PreviewAnimation from "../Animations/PreviewAnimation";
import ReturnButton from "../../components/button/ReturnButton";

const EnfantSeries = () => {
  const { enfantId } = useParams();
  const navigate = useNavigate();
  const [enfant, setEnfant] = useState(null);
  const [series, setSeries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentSerie, setCurrentSerie] = useState(null);
  const [animations, setAnimations] = useState([]);
  const [currentAnimationIndex, setCurrentAnimationIndex] = useState(0);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const enfantRes = await axiosInstance.get(`/enfa/${enfantId}`);
        setEnfant(enfantRes.data);

        const seriesRes = await axiosInstance.get(`/enfa/${enfantId}/series`);
        setSeries(seriesRes.data);
        setError("");
      } catch (err) {
        setError("Erreur lors du chargement des séries.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [enfantId]);

  // Quand on clique sur une série, on charge ses animations
  const handleSerieClick = async (serie) => {
    setCurrentSerie(serie);
    setCurrentAnimationIndex(0);
    setLoading(true);

    try {
      const res = await axiosInstance.get(`/ses/${serie.SES_id}/animations`);
      setAnimations(res.data);
      setError("");
    } catch (err) {
      setAnimations([]);
      setError("Erreur lors du chargement des animations");
    } finally {
      setLoading(false);
    }
  };

  // Navigation animations
  const goToPrevAnimation = () => {
    setCurrentAnimationIndex((prev) => (prev > 0 ? prev - 1 : prev));
  };
  const goToNextAnimation = () => {
    setCurrentAnimationIndex((prev) =>
      prev < animations.length - 1 ? prev + 1 : prev
    );
  };

  return (
    <Container className="py-4">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-3 gap-2">
        <h2 className="mb-2 mb-md-0 fs-5 fs-md-4 fs-lg-2 text-truncate">
          Séries de{" "}
          <span className="d-sm-inline">
            {enfant ? `${enfant.ENFA_prenom} ${enfant.ENFA_nom}` : "l'enfant"}
          </span>
        </h2>
        <ReturnButton
          to=""
          label="Retour au dashboard"
          className="btn-sm w-100 w-md-auto flex-shrink-0"
        />
      </div>

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" />
        </div>
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : series.length === 0 ? (
        <div className="text-center text-muted py-5">
          Aucune série associée à cet enfant.
        </div>
      ) : (
        <>
          <Row xs={1} md={2} lg={3} className="g-4 mt-3">
            {series.map((serie) => (
              <Col key={serie.SES_id}>
                <Card
                  className={`h-100 shadow-sm hover-effect ${
                    currentSerie && currentSerie.SES_id === serie.SES_id
                      ? "border-primary"
                      : ""
                  }`}
                  style={{ cursor: "pointer" }}
                  onClick={() => handleSerieClick(serie)}
                >
                  {serie.SES_icone && (
                    <div
                      className="d-flex justify-content-center align-items-center"
                      style={{ height: 180 }}
                    >
                      <img
                        src={`${process.env.REACT_APP_API_URL}${serie.SES_icone}`}
                        alt={serie.SES_titre}
                        style={{
                          maxHeight: 160,
                          maxWidth: "90%",
                          objectFit: "cover",
                          borderRadius: 12,
                        }}
                      />
                    </div>
                  )}
                  <Card.Body className="d-flex flex-column">
                    <Card.Title>{serie.SES_titre}</Card.Title>
                    <Card.Text>{serie.SES_description}</Card.Text>
                    <Button
                      variant={
                        currentSerie && currentSerie.SES_id === serie.SES_id
                          ? "primary"
                          : "outline-primary"
                      }
                      className="mt-auto"
                    >
                      <FaPlay className="me-2" /> Voir les animations
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>

          {currentSerie && (
            <PreviewAnimation
              animation={animations[currentAnimationIndex]}
              show={!!currentSerie}
              onClose={() => setCurrentSerie(null)}
              showNavigation={true}
              onPrev={goToPrevAnimation}
              onNext={goToNextAnimation}
              canPrev={currentAnimationIndex > 0}
              canNext={currentAnimationIndex < animations.length - 1}
              currentIndex={currentAnimationIndex}
              totalCount={animations.length}
              setParentAudioPlaying={setIsAudioPlaying}
              isAudioPlaying={isAudioPlaying}
              redirectOnClose={null} // Pas de redirection, juste fermer
              backdrop="static"
              zIndex={1050}
            />
          )}
        </>
      )}
    </Container>
  );
};

export default EnfantSeries;
