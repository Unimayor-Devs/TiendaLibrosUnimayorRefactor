import React, { useState } from 'react';
import { addBook } from '../../../services/bookService';
import { assignInvBookId } from '../../../services/inventoryServices';
import { useNavigate } from 'react-router-dom';
import './EditBookScreen.css';
import Navbar from '../../../components/Navbar';


const AddBookScreen = () => {
  const navigate = useNavigate();
  const [bookData, setBookData] = useState({
    title: '',
    author: '',
    type: '',
    value: '',
    description: '',
    imageUrl: '',
    invCantStock: '',
    invBookId: '',      // Nuevo campo ID del libro
    invStatus: '',      // Nuevo campo Estado
    invDateAdd: new Date().toISOString().slice(0, 10)  // Fecha actual por defecto
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;
  
    if (name === 'value') {
      // Remover cualquier carácter que no sea un dígito numérico o un punto
      newValue = newValue.replace(/[^\d.]/g, '');
      
      // Permitir solo un punto decimal
      const decimalCount = (newValue.match(/\./g) || []).length;
      if (decimalCount > 1) {
        newValue = newValue.slice(0, -1); // Eliminar el último carácter si hay más de un punto decimal
      }
    }
  
    // Guardar el valor directamente en invStatus si es el campo de estado
    setBookData({ ...bookData, [name]: newValue });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Generar un invBookId único para el tipo de libro
      const invBookId = await assignInvBookId(bookData.type);
      const numericValue = parseFloat(bookData.value.replace(/[^\d.]/g, ''));
  
      // Agregar el libro utilizando ambos servicios
      await addBook({ ...bookData, invBookId, value: numericValue });
      alert('Libro agregado exitosamente');
  
      // Reiniciar el formulario
      setBookData({
        title: '',
        author: '',
        type: '',
        value: '',
        description: '',
        imageUrl: '',
        invCantStock: '',
        invBookId: '',
        invStatus: '',
        invDateAdd: new Date().toISOString().slice(0, 10)
      });
      navigate('/books');
    } catch (error) {
      console.error('Error al agregar el libro:', error);
      alert('Hubo un error al agregar el libro. Por favor, inténtalo de nuevo.');
    }
  };
  
  const handleCancel = () => {
    navigate('/books');
  };    

  return (
    <div>
      <Navbar />
        <div className="edit-book-screen">
          <h1 className="title">Agregar Libro</h1>
          <form className="edit-book-form" onSubmit={handleSubmit}>
            {/* Primera fila */}
            <div className="form-row">
              <div className="form-group">
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={bookData.title}
                  onChange={handleChange}
                  placeholder="Título *"  
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="text"
                  id="author"
                  name="author"
                  value={bookData.author}
                  onChange={handleChange}
                  placeholder="Autor *"  
                  required
                />
              </div>
            </div>
      
            {/* Segunda fila */}
            <div className="form-row">
              <div className="form-group">
                <input
                  type="text"
                  id="type"
                  name="type"
                  value={bookData.type}
                  onChange={handleChange}
                  placeholder="Categoría *"  
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="text"
                  id="value"
                  name="value"
                  value={bookData.value}
                  onChange={handleChange}
                  placeholder="Valor *"  
                  required
                />
              </div>
            </div>
      
            {/* Tercera fila */}
            <div className="form-row">
              <div className="form-group">
                <input
                  type="number"
                  id="invCantStock"
                  name="invCantStock"
                  value={bookData.invCantStock}
                  onChange={handleChange}
                  placeholder="Cantidad en Stock *"  
                  required
                />
              </div>
              <div className="form-group">
              <select
                id="invStatus"
                name="invStatus"  // Cambia el nombre a invStatus
                value={bookData.invStatus}
                onChange={handleChange}
                required
              >
                <option value="" disabled>Estado *</option>  
                <option value="Disponible">Disponible</option>
                <option value="No disponible">No Disponible</option>
              </select>
            </div>
            </div>
      
            {/* Sinopsis */}
            <div className="form-group">
              <textarea
                id="description"
                name="description"
                value={bookData.description}
                onChange={handleChange}
                placeholder="Sinopsis *"  
                required
              />
            </div>
      
            {/* URL de la imagen */}
            <div className="form-group">
              <input
                type="text"
                id="imageUrl"
                name="imageUrl"
                value={bookData.imageUrl}
                onChange={handleChange}
                placeholder="URL de la Imagen de Portada *"  
                required
              />
            </div>
      
            {/* Botones de acción */}
            <div className="form-actions">
              <button type="submit" className="submit-button">Agregar</button>
              <button type="button" className="cancel-button" onClick={handleCancel}>
                Cancelar
              </button>
            </div>
          </form>
        </div>
    </div>
  );    
};

export default AddBookScreen;
