import React, { useContext } from 'react';
import { Navbar, Nav, Container, Button, NavDropdown } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaUser, FaSignOutAlt } from 'react-icons/fa';
import AuthContext from '../../context/AuthContext';

const AppNavbar = ({ brandText = "Tikets", showLogout = true }) => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  // Détermine les liens de menu en fonction du rôle de l'utilisateur
  const getNavLinks = () => {
    if (!user) return [];

    const links = [];
    
    switch (user.role) {
      case 'admin':
        links.push(
          { to: '/admin/AdminDashboard', label: 'Dashboard' },
          { to: '/admin/AdminDashboard/GestionUsers', label: 'Utilisateurs' },
          { to: '/admin/AdminDashboard/GestionAbonnement', label: 'Abonnements' },
          { to: '/series/GestionSeries', label: 'Séries' }
        );
        break;
      case 'orthophoniste':
        links.push(
          { to: '/ortho/OrthoDashboard', label: 'Dashboard' },
          { to: '/ortho/OrthoDashboard/GestionEnfants', label: 'Patients' },
          { to: '/series/GestionSeries', label: 'Séries' }
        );
        break;
      case 'parent':
        links.push(
          { to: '/home', label: 'Accueil' }
        );
        break;
      default:
        break;
    }

    return links;
  };

  const navLinks = getNavLinks();
  const isActive = (path) => location.pathname === path;

  return (
    <Navbar bg="light" expand="lg" className="shadow-sm mb-3">
      <Container>
        <Navbar.Brand as={Link} to={user ? getHomeByRole() : '/'}>
          {brandText}
        </Navbar.Brand>
        
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        
        <Navbar.Collapse id="basic-navbar-nav">
          {user && navLinks.length > 0 && (
            <Nav className="me-auto">
              {navLinks.map((link, index) => (
                <Nav.Link 
                  key={index} 
                  as={Link} 
                  to={link.to}
                  active={isActive(link.to)}
                >
                  {link.label}
                </Nav.Link>
              ))}
            </Nav>
          )}
          
          {user && (
            <Nav>
              <NavDropdown 
                title={
                  <span>
                    <FaUser className="me-1" />
                    {`${user.prenom || ''} ${user.nom || ''}`}
                  </span>
                } 
                id="user-dropdown"
              >
                <NavDropdown.Item disabled>
                  Rôle: {user.role}
                </NavDropdown.Item>
                <NavDropdown.Divider />
                {showLogout && (
                  <NavDropdown.Item onClick={handleLogout}>
                    <FaSignOutAlt className="me-1" /> Déconnexion
                  </NavDropdown.Item>
                )}
              </NavDropdown>
            </Nav>
          )}
          
          {!user && showLogout && (
            <Button 
              variant="outline-primary" 
              onClick={() => navigate('/login')}
            >
              Connexion
            </Button>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );

  function getHomeByRole() {
    if (!user) return '/';
    
    switch (user.role) {
      case 'admin': return '/admin/AdminDashboard';
      case 'orthophoniste': return '/ortho/OrthoDashboard';
      default: return '/home';
    }
  }
};

export default AppNavbar;