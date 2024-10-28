import React, { useState, useEffect } from 'react';
import { getBookById, editBook, getBooksByType } from '../../../services/bookService';
import { assignInvBookId, editBookAndInventory } from '../../../services/inventoryServices';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../../../components/Navbar';
import './EditBookScreen.css';

const EditBookScreen = () => {
  const { bookId } = useParams(); // Obtener el ID del libro de los parámetros de la URL
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
    invDateAdd: ''      // Nuevo campo de última actualización
  });

  useEffect(() => {
    // Función para obtener la información del libro por su ID al cargar el componente
    const fetchBookData = async () => {
      try {
        const book = await getBookById(bookId); // Obtener información del libro por su ID
        setBookData(book); // Actualizar el estado con la información del libro
      } catch (error) {
        console.error('Error fetching book data:', error);
      }
    };

    fetchBookData();
  }, [bookId]); // Ejecutar efecto cuando cambie el ID

  const handleChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;

    if (name === 'value') {
      // Remover caracteres no numéricos excepto punto decimal
      newValue = String(newValue).replace(/[^\d.]/g, '');

      const decimalCount = (newValue.match(/\./g) || []).length;
      if (decimalCount > 1) {
        newValue = newValue.slice(0, -1);
      }
    }

    setBookData({ ...bookData, [name]: newValue });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const confirmEdit = window.confirm('¿Está seguro de editar este libro?');
    if (confirmEdit) {
      try {
        // Verificar cuántos libros existen con el mismo tipo
        const booksOfType = await getBooksByType(bookData.type);
  
        // Si hay más de un libro con el mismo tipo, se genera un nuevo invBookId
        let invBookId = bookData.invBookId; // Usa el invBookId actual por defecto
        if (booksOfType.length > 1) {
          invBookId = await assignInvBookId(bookData.type);
        }
  
        // Remover caracteres no numéricos excepto punto decimal
        const numericValue = parseFloat(String(bookData.value).replace(/[^\d.]/g, ''));
  
        // Actualizar invDateAdd con la fecha actual
        const currentDate = new Date().toISOString().slice(0, 10);
  
        // Llamada a editBookAndInventory para actualizar el libro en la base de datos
        await editBookAndInventory(bookId, {
          ...bookData,
          invBookId,
          value: numericValue,
          invDateAdd: currentDate
        });
        
        alert('Libro editado exitosamente');
        navigate('/books');
      } catch (error) {
        console.error('Error al editar el libro:', error);
        alert('Hubo un error al editar el libro. Por favor, inténtalo de nuevo.');
      }
    }
  };  

  const handleCancel = () => {
    navigate('/books');
  };

  return (
    <div>
      <Navbar />
        <div className="edit-book-screen">
          <h1 className="title">Editar Libro</h1>
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
                  name="invStatus"
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
              <button type="submit" className="submit-button">Guardar Cambios</button>
              <button type="button" className="cancel-button" onClick={handleCancel}>
                Cancelar
              </button>
            </div>
          </form>
        </div>
    </div>
  );    
};

export default EditBookScreen;
