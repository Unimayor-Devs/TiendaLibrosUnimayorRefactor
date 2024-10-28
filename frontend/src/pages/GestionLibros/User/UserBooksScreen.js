import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllBooks, deleteBook } from '../../../services/bookService';
import Navbar from '../../../components/Navbar';
import './UserBookScreen.css';
import { AuthContext } from '../../../context/AuthContext'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faCartShopping, faPlus } from '@fortawesome/free-solid-svg-icons';

const UserBookScreen = () => {
  const navigate = useNavigate();
  const { userRole } = useContext(AuthContext);
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [filterCriteria, setFilterCriteria] = useState({
    type: '',
    author: '',
    status: '',
    minPrice: 0,
    maxPrice: 500000,
  });
  const [uniqueTypes, setUniqueTypes] = useState([]);
  const [uniqueAuthors, setUniqueAuthors] = useState([]);
  const [uniqueStatuses, setUniqueStatuses] = useState([]);
  const booksPerPage = 3;

  const formatCurrency = (value) => value ? `$ ${value.toLocaleString()}` : '$ 0';

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const booksData = await getAllBooks();
        setBooks(booksData);

        // Obtener valores únicos para los filtros
        const types = [...new Set(booksData.map(book => book.type))];
        const authors = [...new Set(booksData.map(book => book.author))];
        const statuses = [...new Set(booksData.map(book => book.invStatus))];
        
        setUniqueTypes(types);
        setUniqueAuthors(authors);
        setUniqueStatuses(statuses);
      } catch (error) {
        console.error('Error fetching books:', error);
      }
    };
    fetchBooks();
  }, []);

  const handleDeleteBook = async (bookId) => {
    if (window.confirm(`¿Estás seguro de que quieres borrar este libro?`)) {
      try {
        await deleteBook(bookId);
        setBooks(books.filter(book => book.id !== bookId));
        window.alert('Libro borrado exitosamente');
      } catch (error) {
        console.error('Error deleting book:', error);
      }
    }
  };

  const handleEditBook = (bookId) => navigate(`/books/${bookId}/edit`);

  const handleSearch = (e) => setSearchTerm(e.target.value);

  // Manejadores de cambio para filtros
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilterCriteria({ ...filterCriteria, [name]: value });
  };

  const applyFilters = () => {
    setShowFilters(false);
    setCurrentPage(1);
  };

  // Filtrado de libros
  const filteredBooks = books.filter(book => 
    (book.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
     book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
     book.type.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (filterCriteria.type ? book.type === filterCriteria.type : true) &&
    (filterCriteria.author ? book.author === filterCriteria.author : true) &&
    (filterCriteria.status ? book.invStatus === filterCriteria.status : true) &&
    (book.value >= filterCriteria.minPrice && book.value <= filterCriteria.maxPrice)
  );

  const sortedBooks = filteredBooks.slice().sort((a, b) => a.title.localeCompare(b.title));

  const totalPages = Math.ceil(sortedBooks.length / booksPerPage);
  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = sortedBooks.slice(indexOfFirstBook, indexOfLastBook);

  return (
    <div className="user-book-screen">
      <Navbar />
      <div className="book-container">
        <h1 className="titleAdd">Libros</h1>
        <div className="search-filter">
          <input
            type="text"
            placeholder="Buscar"
            value={searchTerm}
            onChange={handleSearch}
            className="search-bar"
          />
          
          <button className="filter-button" onClick={() => setShowFilters(!showFilters)}>
            Filtrar
          </button>

          {userRole === 'admin' && (
            <button className="add-button" onClick={() => navigate('/books/add')}>
              Agregar <FontAwesomeIcon icon={faPlus} />
            </button>
          )}
        </div>

        {showFilters && (
  <div className="filter-panel">
    {/* Fila de selección de filtros: Tipo, Autor, Estado */}
    <div className="filter-row">
      <div>
        <label>Tipo:</label>
        <select name="type" value={filterCriteria.type} onChange={handleFilterChange}>
          <option value="">Todos</option>
          {uniqueTypes.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>
      <div>
        <label>Autor:</label>
        <select name="author" value={filterCriteria.author} onChange={handleFilterChange}>
          <option value="">Todos</option>
          {uniqueAuthors.map(author => (
            <option key={author} value={author}>{author}</option>
          ))}
        </select>
      </div>
      <div>
        <label>Estado:</label>
        <select name="status" value={filterCriteria.status} onChange={handleFilterChange}>
          <option value="">Todos</option>
          {uniqueStatuses.map(status => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>
      </div>
    </div>

    <div className="filter-row range-slider">
  <label>Rango de Precio:</label>
  <div className="price-range-container">
    <input
      type="range"
      name="minPrice"
      min="0"
      max="500000"
      step="1000"
      value={filterCriteria.minPrice}
      onChange={handleFilterChange}
      className="range-input min"
    />
    <input
      type="range"
      name="maxPrice"
      min="0"
      max="500000"
      step="1000"
      value={filterCriteria.maxPrice}
      onChange={handleFilterChange}
      className="range-input max"
    />
    <div className="price-values">
      <span className="price-label">{formatCurrency(filterCriteria.minPrice)}</span>
      <span className="price-label">{formatCurrency(filterCriteria.maxPrice)}</span>
    </div>
  </div>
</div>



    { /*<button onClick={applyFilters}>Aplicar filtros</button> */}
  </div>
)}


        <div className="book-grid">
          {currentBooks.map((book) => (
            <div className="book-card" key={book.id}>
              <div className="book-row">
                <div className="book-image">
                  <img src={book.imageUrl} alt={book.title} className="book-cover" />
                </div>
                <div className="book-details">
                  <h3 className="book-title">{book.title}</h3>
                  {userRole === 'admin' && (
                    <>
                      <p><strong>ID:</strong> {book.invBookId}</p>
                    </>
                  )}
                  <p><strong>Tipo:</strong> {book.type}</p>
                  <p><strong>Autor:</strong> {book.author}</p>
                  <p><strong>Valor:</strong> {formatCurrency(book.value)}</p>
                  <p><strong>Cantidad:</strong> {parseInt(book.invCantStock, 10) || '0'}</p>
                  {userRole === 'admin' && (
                    <>
                      <p><strong>Estado:</strong> {book.invStatus}</p>
                      <p><strong>Actualización:</strong> {book.invDateAdd}</p>
                    </>
                  )}
                </div>
              </div>
              <p className="book-synopsis"><strong>Sinopsis:</strong></p>
              <p className="book-synopsis-description">{book.description}</p>

              {userRole === 'admin' ? (
                <div className="admin-buttons">
                  <button className="icon-button" onClick={() => handleEditBook(book.id)}>
                    <FontAwesomeIcon icon={faEdit} />
                  </button>
                  <button className="icon-button" onClick={() => handleDeleteBook(book.id)}>
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </div>
              ) : (
                <button className="buy-button">
                  Comprar <FontAwesomeIcon icon={faCartShopping} />
                </button>
              )}
            </div>
          ))}
        </div>

        <div className="pagination">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              onClick={() => setCurrentPage(index + 1)}
              className={`pagination-button ${currentPage === index + 1 ? 'active' : ''}`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserBookScreen;
