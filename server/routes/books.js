import express from 'express';
import Book from '../models/Book.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get all books
router.get('/', async (req, res) => {
  try {
    const { search, category, page = 1, limit = 12 } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { author: { $regex: search, $options: 'i' } }
      ];
    }

    if (category && category !== 'All') {
      query.category = category;
    }

    const books = await Book.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('addedBy', 'name')
      .sort({ createdAt: -1 });

    const total = await Book.countDocuments(query);

    res.json({
      books,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single book
router.get('/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id).populate('addedBy', 'name');
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.json(book);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add new book (admin only)
router.post('/', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const book = new Book({
      ...req.body,
      addedBy: req.user.userId,
      availableCopies: req.body.totalCopies
    });

    await book.save();
    await book.populate('addedBy', 'name');

    res.status(201).json(book);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update book (admin only)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const book = await Book.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate('addedBy', 'name');

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    res.json(book);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete book (admin only)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    res.json({ message: 'Book deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;