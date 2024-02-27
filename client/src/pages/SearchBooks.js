import React from 'react';
import SearchForm from '../components/SearchForm';
import BookList from '../components/BookList';

const SearchBooks = () => {
  return (
    <div>
      <SearchForm />
      <BookList />
    </div>
  );
}

export default SearchBooks;