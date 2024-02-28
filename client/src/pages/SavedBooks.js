import React from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { REMOVE_BOOK } from './utils/mutations';
import { GET_ME } from './utils/queries';
import Auth from './utils/auth';

const SavedBooks = () => {
  const { loading, data } = useQuery(GET_ME);
  const userData = data?.me || {};

  const [removeBook] = useMutation(REMOVE_BOOK);

  const handleRemoveBook = async (bookId) => {
    try {
      const { data } = await removeBook({
        variables: { bookId },
      });

      if (!data) {
        throw new Error('Something went wrong!');
      }

      window.location.reload();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className='container'>
      <h2 className='heading'>Your Saved Books</h2>
      {userData.savedBooks?.length ? (
        userData.savedBooks.map((book) => (
          <div key={book.bookId} className='book-card'>
            <img className='book-img' src={book.image} alt={`The cover for ${book.title}`} />
            <div className='book-details'>
              <h3 className='book-title'>{book.title}</h3>
              <p className='book-author'>{book.authors.join(', ')}</p>
              <p className='book-description'>{book.description}</p>
              <a className='book-link' href={book.link} target='_blank' rel='noreferrer'>
                See More
              </a>
              <button className='btn btn-danger' onClick={() => handleRemoveBook(book.bookId)}>
                Remove Book
              </button>
            </div>
          </div>
        ))
      ) : (
        <h3>No books saved!</h3>
      )}
    </div>
  );
};

export default SavedBooks;