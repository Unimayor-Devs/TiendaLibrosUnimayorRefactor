import React, { useState } from 'react';
import { getAuth, signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaArrowLeft  } from 'react-icons/fa'; // Importa los iconos de Font Awesome
import logo from '../../Public/assets/Icono-Blanco.png';
import galery from '../../Public/assets/library-with-books.jpg';
import './SignInScreen.css'; // Importa tu archivo de estilos CSS

const SignInScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false); // Nuevo estado para mostrar/ocultar contraseña
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const auth = getAuth();
  const navigate = useNavigate();

  const handleForgotPassword = async () => {
    try {
      await sendPasswordResetEmail(auth, email);
      alert('Se ha enviado un correo electrónico para restablecer tu contraseña. Por favor, revisa tu bandeja de entrada.');
    } catch (error) {
      console.error('Error al enviar el correo electrónico de restablecimiento de contraseña:', error.message);
      setError('No se pudo enviar el correo electrónico de restablecimiento de contraseña. Por favor, inténtalo de nuevo.');
    }
  };

  const handleSignIn = async (e) => {
    e.preventDefault();

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      console.log('Usuario inició sesión:', user);
      navigate('/home');
    } catch (error) {
      console.error('Error al iniciar sesión:', error.message);
      setError('Credenciales inválidas. Por favor, inténtalo de nuevo.');
    }
  };

  const handleShowForgotPassword = () => {
    setShowForgotPassword(true);
    setError(null);
  };

  const handleReturnToSignIn = () => {
    setShowForgotPassword(false);
    setError(null);
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    try {
      await sendPasswordResetEmail(auth, email);
      alert('Se ha enviado un correo electrónico para restablecer tu contraseña. Por favor, revisa tu bandeja de entrada.');
      setShowForgotPassword(false);
    } catch (error) {
      console.error('Error al enviar el correo electrónico de restablecimiento de contraseña:', error.message);
      setError('No se pudo enviar el correo electrónico de restablecimiento de contraseña. Por favor, inténtalo de nuevo.');
    }
  };

  // Función para alternar la visibilidad de la contraseña
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="white-background">
      {/* Botón Volver */}
      <button
        className="back-button"
        onClick={() => navigate(-1)} // Navega hacia la página anterior
        aria-label="Volver a la página anterior"
      >
        <FaArrowLeft />
        <span className="back-text">Volver</span>
      </button>
  
      {/* Sección de la Izquierda */}
      <div className="left-section">
        {/* Figura Azul Independiente Pero queda atrás */}
        <div className="blue-rectangle"></div>
  
        {/* Logo y Textos Sobrepuestos sobre figura azul */}
        <div className="logo-container">
          <img src={logo} alt="Logo" className="logo" />
          <div className="text-container">
            <h3>Tienda de Libros Unimayor</h3>
            <h2>Iniciar Sesión</h2>
          </div>
        </div>
  
        {/* Imagen Sobrepuesta sobre figura azul */}
        <div className="image-container">
          <img src={galery} alt="Librería" className="library-image" />
        </div>
      </div>
  
      {/* Sección de la Derecha */}
      <div className="right-section">
        {/* Contenedor Formulario */}
        <div className="form-container">
          {showForgotPassword ? (
            <form onSubmit={handleResetPassword}>
              <div className="form-container input">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  required
                />
              </div>
              {error && <p className="error-message">{error}</p>}
              <button type="submit" className="form-container button">Reestablecer Contraseña</button>
            </form>          
              ) : (
                <form className="signin-form">
                  <input 
                    type="text" 
                    placeholder="Usuario o Correo electrónico" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)} 
                  />
                  <input 
                    type="password" 
                    placeholder="Contraseña" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)} 
                  />
                  <button onClick={handleSignIn} type="submit">Iniciar Sesión</button>
                </form>
              )}
      
              <div className="form-links">
                {showForgotPassword ? null : (
                  <>
                    <a href="#" onClick={() => setShowForgotPassword(true)}>Olvidé mi contraseña</a>
                    <a href="signup">Registrarse</a>
                  </>
                )}
          </div>
          {error && <p className="error-message">{error}</p>}
        </div>
      </div>
    </div>
  );       
};

export default SignInScreen;