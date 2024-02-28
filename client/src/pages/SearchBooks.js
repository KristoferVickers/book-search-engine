import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { SAVE_BOOK } from './utils/mutations';
import { searchGoogleBooks } from './utils/API';
import Auth from './client/utils/auth';

const SearchBooks = () => {
  const [searchedBooks, setSearchedBooks] = useState([]);
  const [searchInput, setSearchInput] = useState('');

  const [saveBook] = useMutation(SAVE_BOOK);

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    if (!searchInput) {
      return false;
    }

    try {
      const response = await searchGoogleBooks(searchInput);

      if (!response.ok) {
        throw new Error('Failed to get response from Google Books API');
      }

      const { items } = await response.json();

      const bookData = items.map((book) => ({
        bookId: book.id,
        authors: book.volumeInfo.authors || ['No author to display'],
        title: book.volumeInfo.title,
        description: book.volumeInfo.description,
        image: book.volumeInfo.imageLinks?.thumbnail || '',
        link: book.volumeInfo.previewLink,
      }));

      setSearchedBooks(bookData);
    } catch (err) {
      console.error(err);
    }

    setSearchInput('');
  };

  const handleSaveBook = async (bookId) => {
    const bookToSave = searchedBooks.find((book) => book.bookId === bookId);

    if (!bookToSave) {
      return false;
    }

    try {
      await saveBook({
        variables: { bookData: { ...bookToSave } },
      });

      const updatedBooks = searchedBooks.filter((book) => book.bookId !== bookId);
      setSearchedBooks(updatedBooks);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className='container'>
      <h2 className='heading'>Search for Books</h2>
      <form className='form-container' onSubmit={handleFormSubmit}>
        <input
          className='form-input'
          placeholder='Search for a book...'
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
        <button className='form-submit' type='submit'>
          Search
        </button>
      </form>
      <div>
        {searchedBooks.map((book) => (
          <div key={book.bookId} className='book-card'>
            <img className='book-img' src={book.image} alt={`The cover for ${book.title}`} />
            <div className='book-details'>
              <h3 className='book-title'>{book.title}</h3>
              <p className='book-author'>{book.authors.join(', ')}</p>
              <p className='book-description'>{book.description}</p>
              <a className='book-link' href={book.link} target='_blank' rel='noreferrer'>
                See More
              </a>
              {Auth.loggedIn() && (
                <button className='btn' onClick={() => handleSaveBook(book.bookId)}>
                  Save Book
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchBooks;