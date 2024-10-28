import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Importa Link de react-router-dom
import './WelcomeScreen.css';
import iconoUnimayor from './assets/Icono-Blanco.png';
import galery from './assets/library-with-books.jpg';

const WelcomeScreen = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  // Arreglo de imágenes para el carrusel
  const images = [
    { src: galery },
    { src: galery },
    { src: galery },
  ];

  // Cambiar de imagen cada 3 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <>
      <div className="welcome-container">
        {/* Fondo blanco */}
        <div className="white-background">
          {/* Botones de inicio de sesión y registro */}
          <div className="auth-buttons">
            <Link to="/signin">
              <button className="auth-btn">Iniciar Sesión</button>
            </Link>
            <Link to="/signup">
              <button className="auth-btn">Registrarse</button>
            </Link>
          </div>
        </div>

        {/* Figura azul */}
        <div className="welcomeblue-rectangle">
          {/* Logo */}
          <img src={iconoUnimayor} alt="Logo" className="welcomelogo" />

          {/* Textos */}
          <h1 className="welcometext-1">Tienda de Libros Unimayor</h1>
          <h2 className="welcometext-2">¿Buscas tu próximo libro favorito?</h2>
          <h3 className="welcometext-3">¡Haz click aquí para explorar nuestras últimas novedades!</h3>

          {/* Botón de explorar */}
          <Link to="/signin">
            <button className="explore-btn">Explorar</button>
          </Link>
        </div>
      </div>

      <div className="carousel-container">
        {images.map((image, index) => {
          // Determina las clases para cada imagen según su posición
          let className = '';
          if (index === activeIndex) {
            className = 'front'; // Imagen al frente
          } else if (index === (activeIndex + 1) % images.length) {
            className = 'middle'; // Imagen en el medio
          } else {
            className = 'back'; // Imagen al fondo
          }

          return (
            <img
              key={index}
              src={image.src}
              alt="Carrusel"
              className={`carousel-image ${className}`}
            />
          );
        })}
      </div>
    </>
  );
};

export default WelcomeScreen;
