import { collection, getDocs, doc, updateDoc,  getDoc} from 'firebase/firestore';
import { firebaseFirestore } from './FirebaseService';

// Función para consultar todos los libros
export const getAllBooks = async () => {
  try {
    const booksCollectionRef = collection(firebaseFirestore, 'books');
    const booksQuerySnapshot = await getDocs(booksCollectionRef);
    const books = [];
    booksQuerySnapshot.forEach((doc) => {
      books.push({ id: doc.id, ...doc.data() });
    });
    return books;
  } catch (error) {
    console.error('Error al consultar todos los libros:', error);
    throw error;
  }
};

// Función para editar un libro y actualizar su inventario
export const editBookAndInventory = async (bookId, updatedBookData) => {
    try {
      const bookDocRef = doc(firebaseFirestore, 'books', bookId);
      await updateDoc(bookDocRef, updatedBookData);
      console.log('Libro editado con éxito');
    } catch (error) {
      console.error('Error al editar el libro:', error);
      throw error;
    }
  };

// Función para obtener un libro específico por su ID
export const getBookById = async (bookId) => {
  try {
    const bookDocRef = doc(firebaseFirestore, 'books', bookId);
    const bookDocSnap = await getDoc(bookDocRef);

    if (bookDocSnap.exists()) {
      return {
        id: bookDocSnap.id,
        ...bookDocSnap.data()
      };
    } else {
      throw new Error(`Book with ID ${bookId} not found.`);
    }
  } catch (error) {
    console.error('Error fetching book:', error);
    throw error;
  }
};

// Función para obtener un libro específico por su invID
export const getBookByInvId = async (invId) => {
  try {
    const booksCollectionRef = collection(firebaseFirestore, 'books');
    const booksQuerySnapshot = await getDocs(booksCollectionRef);
    let book = null;
    booksQuerySnapshot.forEach((doc) => {
      const bookData = doc.data();
      if (bookData.invID === invId) {
        book = { id: doc.id, ...bookData };
      }
    });
    return book;
  } catch (error) {
    console.error('Error fetching book by invID:', error);
    throw error;
  }
};

// Función para consultar todos los libros con el mismo tipo de libro
export const getBooksByType = async (bookType) => {
    try {
      const booksCollectionRef = collection(firebaseFirestore, 'books');
      const booksQuerySnapshot = await getDocs(booksCollectionRef);
      const filteredBooks = [];
      booksQuerySnapshot.forEach((doc) => {
        const bookData = doc.data();
        if (bookData.type === bookType) {
          filteredBooks.push({ id: doc.id, ...bookData });
        }
      });
      return filteredBooks;
    } catch (error) {
      console.error('Error al consultar los libros por tipo:', error);
      throw error;
    }
  };
  
  // Función para asignar un invBookId basado en el tipo de libro y la cantidad existente
  export const assignInvBookId = async (bookType, currentBookId = null, currentInvBookId = null) => {
    try {
      // Obtener todos los libros del tipo solicitado
      const filteredBooks = await getBooksByType(bookType);
      
      // Si solo hay un libro y es el actual, mantenemos su invBookId
      if (filteredBooks.length === 1 && filteredBooks[0].id === currentBookId) {
        return currentInvBookId || `${bookType.substring(0, 3).toUpperCase()}-1`;
      }

      // Si el `currentInvBookId` ya existe en los libros filtrados, no generamos uno nuevo
      if (currentInvBookId && filteredBooks.some(book => book.invBookId === currentInvBookId && book.id === currentBookId)) {
        return currentInvBookId;
      }

      // Filtrar los invBookIds de otros libros del mismo tipo, excluyendo el actual
      const existingInvIds = filteredBooks
        .filter(book => book.invBookId && book.id !== currentBookId)
        .map(book => book.invBookId);

      // Define el prefijo basado en el tipo de libro
      const typePrefix = bookType.substring(0, 3).toUpperCase();
      let invBookId = `${typePrefix}-1`; // Valor por defecto si es el primer libro de este tipo

      // Si hay otros libros del mismo tipo
      if (existingInvIds.length > 0) {
        // Obtener todos los números actuales en los invBookIds de ese tipo
        const existingNumbers = existingInvIds.map(id => {
          const parts = id.split('-');
          return parts.length > 1 && !isNaN(parts[1]) ? parseInt(parts[1], 10) : 0;
        });

        // Encontrar el menor número faltante en la secuencia, comenzando desde 1
        let nextNumber = 1;
        while (existingNumbers.includes(nextNumber)) {
          nextNumber++;
        }

        // Asigna el ID con el siguiente número disponible en secuencia
        invBookId = `${typePrefix}-${nextNumber}`;
      }

      // Retorna el `currentInvBookId` si no cambió el tipo de libro, o el nuevo invBookId generado
      return currentInvBookId || invBookId;
    } catch (error) {
      console.error('Error al asignar invBookId:', error);
      throw error;
    }
  };

  
