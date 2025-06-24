import express from 'express';
import Borrowing from '../models/Borrowing.js';
import Book from '../models/Book.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Borrow a book
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { bookId, days = 7 } = req.body;

    const book = await Book.findById(bookId);
    if (!book || book.availableCopies <= 0) {
      return res.status(400).json({ message: 'Book not available' });
    }

    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + days);

    const borrowing = new Borrowing({
      user: req.user.userId,
      book: bookId,
      dueDate,
      dailyFee: book.dailyFee
    });

    await borrowing.save();

    // Update book availability
    book.availableCopies -= 1;
    await book.save();

    await borrowing.populate(['user', 'book']);

    res.status(201).json(borrowing);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user's borrowings
router.get('/my-borrowings', authenticateToken, async (req, res) => {
  try {
    const borrowings = await Borrowing.find({ user: req.user.userId })
      .populate('book')
      .sort({ createdAt: -1 });

    // Calculate current fees
    borrowings.forEach(borrowing => {
      if (borrowing.status !== 'returned') {
        borrowing.calculateTotalFee();
      }
    });

    res.json(borrowings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Return a book
router.put('/:id/return', authenticateToken, async (req, res) => {
  try {
    const borrowing = await Borrowing.findById(req.params.id).populate('book');
    
    if (!borrowing || borrowing.user.toString() !== req.user.userId) {
      return res.status(404).json({ message: 'Borrowing not found' });
    }

    if (borrowing.status === 'returned') {
      return res.status(400).json({ message: 'Book already returned' });
    }

    borrowing.returnDate = new Date();
    borrowing.status = 'returned';
    borrowing.calculateTotalFee();

    await borrowing.save();

    // Update book availability
    const book = await Book.findById(borrowing.book._id);
    book.availableCopies += 1;
    await book.save();

    res.json(borrowing);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all borrowings (admin)
router.get('/all', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const borrowings = await Borrowing.find()
      .populate(['user', 'book'])
      .sort({ createdAt: -1 });

    res.json(borrowings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;