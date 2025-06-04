import { useEffect, useState } from 'react';
import axios from 'axios';

export default function ParentDashboard() {
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get('http://localhost:3000/api/parent/children', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => setChildren(res.data))
    .catch(() => setError('Erreur de chargement'))
    .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center mt-5"><div className="spinner-border" /></div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Mes enfants</h2>
      <div className="row">
        {children.map(child => (
          <div className="col-6 col-md-4 col-lg-3 mb-3" key={child.USR_id}>
            <button
              className="btn btn-primary w-100"
              onClick={() => alert(`ID enfant: ${child.USR_id}`)}
            >
              {child.USR_prenom}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
