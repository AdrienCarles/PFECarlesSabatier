
import React, { useState, useEffect, useContext } from "react";
import { Container, Table, Button, Modal, Form, Alert } from "react-bootstrap";
import AuthContext from "../../context/AuthContext";
import axiosInstance from "../../api/axiosConfig";

const GestionEnfants = () => {
  const { logout, user } = useContext(AuthContext); // user = orthophoniste connecté
  const [enfants, setEnfants] = useState([]);
  const [parents, setParents] = useState([]);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [createdParent, setCreatedParent] = useState(null);

  console.log("user", user);
  // Formulaire parent
  const [parentData, setParentData] = useState({
    USR_nom: "",
    USR_prenom: "",
    USR_email: "",
    USR_pass: "",
    USR_telephone: "",
    USR_role: "parent",
    USR_statut: "actif"
  });

  // Formulaire enfant
  const [childData, setChildData] = useState({
    ENFA_nom: "",
    ENFA_prenom: "",
    ENFA_dateNaissance: "",
    ENFA_niveauAudition: "leger",
    ENFA_dateDebutSuivi: "",
    ENFA_notesSuivi: "",
  });


  useEffect(() => {
    if (!user || !user.USR_id) return;

    axiosInstance
      .get(`/enfa/orthophoniste/${user.USR_id}`)
      .then((res) => setEnfants(res.data))
      .catch((err) => {
        console.error("❌ Erreur chargement enfants :", err);
        setError("Erreur lors du chargement des enfants.");
      });
  
    axiosInstance
      .get("/usr?role=parent")
      .then((res) => setParents(res.data))
      .catch(() => setError("Erreur lors du chargement des parents."));
  }, [user]);
  
  const handleShow = () => {
    setShowModal(true);
    setCreatedParent(null);
  };

  const handleClose = () => {
    setShowModal(false);
    setParentData({
      USR_nom: "",
      USR_prenom: "",
      USR_email: "",
      USR_pass: "",
      USR_telephone: "",
      USR_role: "parent",
      USR_statut: "actif"
    });
    setChildData({
      ENFA_nom: "",
      ENFA_prenom: "",
      ENFA_dateNaissance: "",
      ENFA_niveauAudition: "leger",
      ENFA_dateDebutSuivi: "",
      ENFA_notesSuivi: "",
    });
    setError("");
    setCreatedParent(null);
  };

  const handleParentChange = (e) =>
    setParentData({ ...parentData, [e.target.name]: e.target.value });

  const handleChildChange = (e) =>
    setChildData({ ...childData, [e.target.name]: e.target.value });

  const handleParentSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await axiosInstance.post("/usr", parentData);
      const parent = response.data;
      setCreatedParent(parent);
      setParents((prev) => [...prev, parent]);
    } catch (error) {
      console.error("Erreur création parent", error);
      setError("Erreur lors de la création du parent.");
    }
  };
console.log("👤 Données user utilisées pour l'enfant :", user);

  const handleChildSubmit = async (e) => {
  e.preventDefault();
  setError("");
  try {
    const enfantToSend = {
      ...childData,
      ENFA_dateCreation: new Date(),
      USR_parent_id: createdParent.USR_id,
      USR_orthophoniste_id: user.id, 
    };

    await axiosInstance.post("/enfa", enfantToSend);

    // Recharge les enfants et parents à jour
    const [childrenRes, parentsRes] = await Promise.all([
      axiosInstance.get(`/enfa/orthophoniste/${user.id}`),
      axiosInstance.get("/usr?role=parent")
    ]);

    setEnfants(childrenRes.data);
    setParents(parentsRes.data);
    handleClose();
  } catch (error) {
    console.error("Erreur création enfant", error);
    setError("Erreur lors de la création de l'enfant.");
  }
};


  const handleDelete = (id) => {
    if (window.confirm("Supprimer cet enfant ?")) {
      axiosInstance
        .delete(`/enfa/${id}`)
        .then(() => setEnfants(enfants.filter((e) => e.ENFA_id !== id)))
        .catch(() => setError("Erreur lors de la suppression."));
    }
  };

  return (
    <Container className="gestion-enfants">
      <div className="d-flex justify-content-end my-3">
        <Button variant="danger" onClick={logout}>Déconnexion</Button>
      </div>

      <h2 className="text-center mb-4">Gestion des enfants suivis</h2>

      <div className="d-flex justify-content-between mb-3">
        <Button variant="primary" onClick={handleShow}>Créer un parent + enfant</Button>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Nom</th>
            <th>Prénom</th>
            <th>Date de naissance</th>
            <th>Niveau audition</th>
            <th>Parent</th>
            <th>Date début suivi</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {enfants.map((enfant, idx) => {
            const parent = parents.find(p => p.USR_id === enfant.USR_parent_id);
            return (
              <tr key={idx}>
                <td>{enfant.ENFA_nom}</td>
                <td>{enfant.ENFA_prenom}</td>
                <td>{new Date(enfant.ENFA_dateNaissance).toLocaleDateString()}</td>
                <td>{enfant.ENFA_niveauAudition}</td>
                <td>{parent ? `${parent.USR_nom} ${parent.USR_prenom}` : "-"}</td>
                <td>{new Date(enfant.ENFA_dateDebutSuivi).toLocaleDateString()}</td>
                <td> 
                  <Button variant="danger" size="sm" onClick={() => handleDelete(enfant.ENFA_id)}>Supprimer</Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={handleClose} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {createdParent ? "Créer un enfant pour le parent" : "Créer un parent"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}

          {!createdParent ? (
            <Form onSubmit={handleParentSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Nom :</Form.Label>
                <Form.Control type="text" name="USR_nom" value={parentData.USR_nom} onChange={handleParentChange} required />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Prénom :</Form.Label>
                <Form.Control type="text" name="USR_prenom" value={parentData.USR_prenom} onChange={handleParentChange} required />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Email :</Form.Label>
                <Form.Control type="email" name="USR_email" value={parentData.USR_email} onChange={handleParentChange} required />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Mot de passe :</Form.Label>
                <Form.Control type="password" name="USR_pass" value={parentData.USR_pass} onChange={handleParentChange} required />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Téléphone :</Form.Label>
                <Form.Control type="text" name="USR_telephone" value={parentData.USR_telephone} onChange={handleParentChange} />
              </Form.Group>

              <Button type="submit" variant="primary" className="w-100">Créer le parent</Button>
            </Form>
          ) : (
            <Form onSubmit={handleChildSubmit}>
              <Alert variant="success">✅ Parent créé : {createdParent.USR_nom} {createdParent.USR_prenom}</Alert>

              <Form.Group className="mb-3">
                <Form.Label>Nom de l’enfant :</Form.Label>
                <Form.Control type="text" name="ENFA_nom" value={childData.ENFA_nom} onChange={handleChildChange} required />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Prénom :</Form.Label>
                <Form.Control type="text" name="ENFA_prenom" value={childData.ENFA_prenom} onChange={handleChildChange} required />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Date de naissance :</Form.Label>
                <Form.Control type="date" name="ENFA_dateNaissance" value={childData.ENFA_dateNaissance} onChange={handleChildChange} required />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Niveau d’audition :</Form.Label>
                <Form.Select name="ENFA_niveauAudition" value={childData.ENFA_niveauAudition} onChange={handleChildChange}>
                  <option value="leger">Léger</option>
                  <option value="modere">Modéré</option>
                  <option value="severe">Sévère</option>
                  <option value="profond">Profond</option>
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Date début de suivi :</Form.Label>
                <Form.Control type="date" name="ENFA_dateDebutSuivi" value={childData.ENFA_dateDebutSuivi} onChange={handleChildChange} required />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Notes :</Form.Label>
                <Form.Control as="textarea" name="ENFA_notesSuivi" value={childData.ENFA_notesSuivi} onChange={handleChildChange} />
              </Form.Group>

              <Button type="submit" variant="success" className="w-100">Créer l’enfant</Button>
            </Form>
          )}
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default GestionEnfants;
