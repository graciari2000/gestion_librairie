import express from 'express';
import Borrowing from '../models/Borrowing.js';
import Book from '../models/Book.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Borrow a book
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { bookId, days = 7 } = req.body;
    const userId = req.user.userId;

    // Validate input
    if (!bookId || !days || days < 1 || days > 30) {
      return res.status(400).json({
        message: 'Invalid request. Please provide valid bookId and days (1-30)'
      });
    }

    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    if (book.availableCopies <= 0) {
      return res.status(400).json({ message: 'No available copies of this book' });
    }

    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + parseInt(days));

    const borrowing = new Borrowing({
      user: userId,
      book: bookId,
      borrowDate: new Date(),
      dueDate,
      dailyFee: book.dailyFee,
      status: 'borrowed'
    });

    await borrowing.save();

    // Update book availability
    book.availableCopies -= 1;
    await book.save();

    // Populate the response
    const populatedBorrowing = await Borrowing.findById(borrowing._id)
      .populate('user', 'name email')
      .populate('book', 'title author');

    res.status(201).json({
      message: 'Book borrowed successfully',
      borrowing: populatedBorrowing
    });

  } catch (error) {
    console.error('Borrowing error:', error);
    res.status(500).json({
      message: 'Failed to process borrowing',
      error: error.message
    });
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