import mongoose from 'mongoose';

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
    required: true,
    enum: ['Fiction', 'Non-Fiction', 'Science', 'Technology', 'History', 'Biography', 'Mystery', 'Romance', 'Fantasy', 'Self-Help', 'Memoir']
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