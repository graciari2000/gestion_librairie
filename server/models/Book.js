import mongoose from 'mongoose';

const genres = ['Dystopian', 'Fiction', 'Classic', 'Memoir', 'Young Adult', 'Gothic Fiction', 'Fantasy', 'Historical Fiction', 'Philosophical Fiction'];

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  author: {
    type: String,
    required: true,
    trim: true
  },
  isbn: {
    type: String,
    required: true,
    unique: true
  },
  genre: {
    type: String,
    enum: genres,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  coverImage: {
    type: String,
    default: 'https://images.pexels.com/photos/159866/books-book-pages-read-literature-159866.jpeg'
  },
  totalCopies: {
    type: Number,
    required: true,
    min: 1
  },
  availableCopies: {
    type: Number,
    required: true,
    min: 0
  },
  dailyFee: {
    type: Number,
    required: true,
    min: 0
  },
  publishedYear: {
    type: Number,
    required: true
  },
}, {
  timestamps: true
});

export default mongoose.model('Book', bookSchema);