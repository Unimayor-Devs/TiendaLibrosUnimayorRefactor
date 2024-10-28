import React, { useState, useEffect } from 'react';
import {
  getAuth,
  createUserWithEmailAndPassword,
  sendEmailVerification
} from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { getFirestore, collection, getDocs, setDoc, doc } from 'firebase/firestore';
import {
  FaLock,
  FaEye,
  FaEyeSlash,
  FaUserCircle,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaArrowLeft
} from 'react-icons/fa';
import logo from '../../Public/assets/Icono-Blanco.png';
import galery from '../../Public/assets/library-with-books.jpg';
import './SignInScreen.css'; // Importa tu archivo de estilos CSS

const SignUpScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [city, setCity] = useState('');
  const [department, setDepartment] = useState('');
  const [error, setError] = useState(null);
  const [departmentsList, setDepartmentsList] = useState([]);
  const [showPassword, setShowPassword] = useState(false);

  const auth = getAuth();
  const navigate = useNavigate();
  const db = getFirestore();

  const validatePassword = (password) => {
    const errors = {};

    if (password.length < 8) {
      errors.lengthError = 'La contraseña debe tener al menos 8 caracteres.';
    }
    if (!/[a-z]/.test(password)) {
      errors.lowercaseError = 'Debe contener al menos una letra minúscula.';
    }
    if (!/[A-Z]/.test(password)) {
      errors.uppercaseError = 'Debe contener al menos una letra mayúscula.';
    }
    if (!/\d/.test(password)) {
      errors.numberError = 'Debe contener al menos un número.';
    }
    if (!/[^a-zA-Z0-9]/.test(password)) {
      errors.specialCharError = 'Debe contener al menos un carácter especial.';
    }
    if (/\s/.test(password)) {
      errors.spaceError = 'No debe contener espacios.';
    }

    return errors;
  };

  const fetchDepartments = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'departments'));
      const departments = querySnapshot.docs.map((doc) => doc.data().depName);
      setDepartmentsList(departments);
    } catch (error) {
      console.error('Error al obtener departamentos:', error.message);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleSignUp = async (e) => {
    e.preventDefault();

    /*
    if (phoneNumber.length !== 10) {
      setError('El número de teléfono debe tener exactamente 10 dígitos.');
      return;
    }
    */

    if (password !== passwordConfirmation) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    const passwordErrors = validatePassword(password);

    if (Object.keys(passwordErrors).length > 0) {
      setError(Object.values(passwordErrors).join(' '));
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await sendEmailVerification(user);

      await setDoc(doc(db, 'users', user.uid), {
        userId: user.uid,
        firstName,
        lastName,
        email,
        phoneNumber,
        city,
        department
      });

      navigate('/home');
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        setError('El correo electrónico ya está en uso.');
      } else {
        setError('Error al registrar usuario. Por favor, inténtalo de nuevo.');
      }
    }
  };

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
            <h2>Registro</h2>
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
          {"" ? (
            <form onSubmit={""}>
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
                    value={firstName}
                    placeholder="Primer Nombre" 
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                  />

                  <input 
                    type="text" 
                    value={email}
                    placeholder="Correo electrónico" 
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />

                  <input 
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    placeholder="Contraseña" 
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />

                  <input 
                    type={showPassword ? 'text' : 'password'}
                    value={passwordConfirmation}
                    placeholder="Confirmar contraseña"
                    onChange={(e) => setPasswordConfirmation(e.target.value)}
                    required
                  />
                  <button onClick={handleSignUp} type="submit">Registrarse</button>
                </form>
              )}
      
              <div className="form-links-signup">
                {"" ? null : (
                  <>
                    <a href="signin">¿Ya tienes una cuenta?</a>
                  </>
                )}
              </div>
              <div className="form-links-signup">
                {"" ? null : (
                  <>
                    <a href="signin">Inicia Sesión</a>
                  </>
                )}
              </div>

            {error && <p className="error-message">{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default SignUpScreen;
