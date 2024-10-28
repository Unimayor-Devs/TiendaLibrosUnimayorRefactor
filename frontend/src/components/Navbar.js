import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAuth, signOut } from 'firebase/auth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faUser, faBook, faBoxes, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import './Navbar.css';
import logo from '../pages/Public/assets/Icono-Blanco.png';
import { AuthContext } from '../context/AuthContext';
import { useLocation } from 'react-router-dom';


const Navbar = () => {
  const auth = getAuth();
  const navigate = useNavigate();
  const location = useLocation();  // Hook para obtener la ubicación actual
  const { user, userRole } = useContext(AuthContext); // Usa el contexto de autenticación

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      console.log('Usuario cerró sesión exitosamente');
      navigate('/');
    } catch (error) {
      console.error('Error al cerrar sesión:', error.message);
    }
  };

  // Función para verificar si la ruta actual coincide con la ruta del enlace
  const isActive = (pathname) => location.pathname === pathname;

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <img src={logo} alt="Logo" />
      </div>
      <div className="navbar-items">
        <Link to="/home" className={`navbar-item ${isActive('/home') ? 'active' : ''}`}>
          <FontAwesomeIcon icon={faHome} />
          Inicio
        </Link>
        <Link to="/users" className={`navbar-item ${isActive('/users') ? 'active' : ''}`}>
          <FontAwesomeIcon icon={faUser} />
          Usuario
        </Link>
        <Link to="/books" className={`navbar-item ${isActive('/books') ? 'active' : ''}`}>
          <FontAwesomeIcon icon={faBook} />
          Libros
        </Link>
        
        {
          /*
          <Link to="/inventory" className={`navbar-item ${isActive('/inventory') ? 'active' : ''}`}>
            <FontAwesomeIcon icon={faBoxes} />
            Inventari o
          </Link>
          */
        }
        <a onClick={handleSignOut} className="navbar-item">
          <FontAwesomeIcon icon={faSignOutAlt} />
          Salir
        </a>
      </div>
    </nav>
  );
};

export default Navbar;
