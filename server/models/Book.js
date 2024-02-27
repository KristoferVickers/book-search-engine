const { Schema, model } = require('mongoose');

const bookSchema = new Schema({
  authors: {
    type: [String],
    required: true
  },
  description: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  bookId: {
    type: String,
    required: true,
    unique: true
  },
  image: {
    type: String
  },
  link: {
    type: String
  }
});

const Book = model('Book', bookSchema);

module.exports = Book;