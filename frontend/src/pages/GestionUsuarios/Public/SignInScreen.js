import React, { useState } from 'react';
import { getAuth, signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaArrowLeft  } from 'react-icons/fa'; // Importa los iconos de Font Awesome
import iconoUnimayor from '../../Public/assets/Icono-Blanco.png';
import './SignInScreen.css'; // Importa tu archivo de estilos CSS
import galery from '../../Public/assets/library-with-books.jpg';

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
    <div className="signin-container">
      <div className="blue-rectangle">
      <button
          className="back-button"
          onClick={() => navigate(-1)}
          aria-label="Volver a la página anterior"
        >
          <FaArrowLeft />
          <span className="back-text">Volver</span>
        </button>
        <div className="logo-text">
          <img src={iconoUnimayor} alt="Logo" className="logo" />
          <div className="text-container">
            <div className="site-name">Tienda de Libros Unimayor</div>
            <div className="sign-in-text">Iniciar Sesión</div>
          </div>
        </div>
        {/* Imagen agregada */}
        <img src={galery} alt="Imagen" className="decorative-image" />
      </div>
      <div className="form-container">
        {showForgotPassword ? (
          <form onSubmit={handleResetPassword} className="signin-form">
            <div className="input-group">
              <FaEnvelope className="input-icon" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
                className="input-field"
              />
            </div>
            {error && <p className="error-message">{error}</p>}
            <button type="submit" className="submit-button">Reestablecer Contraseña</button>
          </form>
        ) : (
          <form onSubmit={handleSignIn} className="signin-form">
            <div className="input-group">
              <FaEnvelope className="input-icon" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
                className="input-field"
              />
            </div>
            <div className="input-group">
              <FaLock className="input-icon" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Contraseña"
                required
                className="input-field"
              />
              {showPassword ? (
                <FaEyeSlash className="toggle-password" onClick={togglePasswordVisibility} />
              ) : (
                <FaEye className="toggle-password" onClick={togglePasswordVisibility} />
              )}
            </div>
            {error && <p className="error-message">{error}</p>}
            <button type="submit" className="submit-button">Iniciar Sesión</button>
            <div className="forgot-password-link">
              <a href="#" onClick={handleShowForgotPassword}>Olvidé mi contraseña</a>
            </div>
          </form>
        )}
      </div>
    </div>
  );  
};

export default SignInScreen;