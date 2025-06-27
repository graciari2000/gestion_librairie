import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  Book, 
  Users, 
  Plus, 
  Edit, 
  Trash2,
  Calendar
} from 'lucide-react';

interface Book {
  _id: string;
  title: string;
  author: string;
  isbn: string;
  genre: string;
  description: string;
  coverImage: string;
  totalCopies: number;
  availableCopies: number;
  dailyFee: number;
  publishedYear: number;
}

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  membershipDate: string;
  totalFees: number;
  isActive: boolean;
}

interface Borrowing {
  _id: string;
  user: {
    name: string;
    email: string;
  };
  book: {
    title: string;
    author: string;
  };
  borrowDate: string;
  dueDate: string;
  returnDate?: string;
  totalFee: number;
  status: string;
}

const AdminPanel: React.FC = () => {
  const { token } = useAuth();
  const [activeTab, setActiveTab] = useState('books');
  const [books, setBooks] = useState<Book[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [borrowings, setBorrowings] = useState<Borrowing[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddBook, setShowAddBook] = useState(false);

  const [newBook, setNewBook] = useState({
    title: '',
    author: '',
    isbn: '',
    genre: 'Fiction',
    description: '',
    coverImage: 'https://images.pexels.com/photos/159866/books-book-pages-read-literature-159866.jpeg',
    totalCopies: 1,
    dailyFee: 0.50,
    publishedYear: ''
  });

  // Update genres to match those in seedBooks.js
  const genres = ['Dystopian', 'Fiction', 'Classic', 'Memoir', 'Young Adult', 'Gothic Fiction', 'Fantasy', 'Historical Fiction', 'Philosophical Fiction'];

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'books') {
        const response = await fetch('/api/books');
        const data = await response.json();
        setBooks(data.books);
      } else if (activeTab === 'users') {
        const response = await fetch('/api/users', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await response.json();
        setUsers(data);
      } else if (activeTab === 'borrowings') {
        const response = await fetch('/api/borrowings/all', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await response.json();
        setBorrowings(data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddBook = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/books', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(newBook)
      });

      if (response.ok) {
        setShowAddBook(false);
        setNewBook({
          title: '',
          author: '',
          isbn: '',
          genre: 'Fiction',
          description: '',
          coverImage: 'https://images.pexels.com/photos/159866/books-book-pages-read-literature-159866.jpeg',
          totalCopies: 1,
          dailyFee: 0.50,
          publishedYear: ''
        });
        fetchData();
      }
    } catch (error) {
      console.error('Error adding book:', error);
    }
  };

  const handleDeleteBook = async (bookId: string) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      try {
        const response = await fetch(`/api/books/${bookId}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.ok) {
          fetchData();
        }
      } catch (error) {
        console.error('Error deleting book:', error);
      }
    }
  };

  const tabs = [
    { id: 'books', name: 'Books', icon: Book },
    { id: 'users', name: 'Users', icon: Users },
    { id: 'borrowings', name: 'Borrowings', icon: Calendar }
  ];

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Admin Panel</h1>
          <p className="text-gray-600">Manage your library system</p>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-lg border border-gray-100 mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 py-4 border-b-2 font-medium transition-colors ${
                      activeTab === tab.id
                        ? 'border-emerald-500 text-[#06402B]'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{tab.name}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="p-6">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
              </div>
            ) : (
              <>
                {/* Books Tab */}
                {activeTab === 'books' && (
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-2xl font-bold text-gray-800">Books Management</h2>
                      <button
                        onClick={() => setShowAddBook(true)}
                        className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-4 py-2 rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-all duration-200 font-medium flex items-center space-x-2"
                      >
                        <Plus className="h-4 w-4" />
                        <span>Add Book</span>
                      </button>
                    </div>

                    {showAddBook && (
                      <div className="bg-gray-50 p-6 rounded-lg mb-6 border border-gray-200">
                        <h3 className="text-lg font-semibold mb-4">Add New Book</h3>
                        <form onSubmit={handleAddBook} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <input
                            type="text"
                            placeholder="Title"
                            value={newBook.title}
                            onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
                            required
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                          />
                          <input
                            type="text"
                            placeholder="Author"
                            value={newBook.author}
                            onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
                            required
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                          />
                          <input
                            type="text"
                            placeholder="ISBN"
                            value={newBook.isbn}
                            onChange={(e) => setNewBook({ ...newBook, isbn: e.target.value })}
                            required
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                          />
                          <select
                            value={newBook.genre}
                            onChange={(e) => setNewBook({ ...newBook, genre: e.target.value })}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                          >
                            {genres.map((cat) => (
                              <option key={cat} value={cat}>{cat}</option>
                            ))}
                          </select>
                          <input
                            type="number"
                            placeholder="Total Copies"
                            value={newBook.totalCopies}
                            onChange={(e) => setNewBook({ ...newBook, totalCopies: parseInt(e.target.value) })}
                            required
                            min="1"
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                          />
                          <input
                            type="number"
                            placeholder="Daily Fee"
                            value={newBook.dailyFee}
                            onChange={(e) => setNewBook({ ...newBook, dailyFee: parseFloat(e.target.value) })}
                            required
                            min="0"
                            step="0.01"
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                          />
                          <input
                            type="number"
                            placeholder="Published Year"
                            value={newBook.publishedYear}
                            onChange={(e) => setNewBook({ ...newBook, publishedYear: parseInt(e.target.value).toString() })}
                            required
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                          />
                          <input
                            type="url"
                            placeholder="Cover Image URL"
                            value={newBook.coverImage}
                            onChange={(e) => setNewBook({ ...newBook, coverImage: e.target.value })}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                          />
                          <textarea
                            placeholder="Description"
                            value={newBook.description}
                            onChange={(e) => setNewBook({ ...newBook, description: e.target.value })}
                            required
                            rows={3}
                            className="md:col-span-2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                          />
                          <div className="md:col-span-2 flex space-x-4">
                            <button
                              type="submit"
                              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
                            >
                              Add Book
                            </button>
                            <button
                              type="button"
                              onClick={() => setShowAddBook(false)}
                              className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        </form>
                      </div>
                    )}

                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="text-left py-3 px-4 font-semibold text-gray-700">Book</th>
                            <th className="text-left py-3 px-4 font-semibold text-gray-700">genre</th>
                            <th className="text-left py-3 px-4 font-semibold text-gray-700">Copies</th>
                            <th className="text-left py-3 px-4 font-semibold text-gray-700">Daily fee</th>
                            <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {books.map((book) => (
                            <tr key={book._id} className="hover:bg-gray-50">
                              <td className="py-3 px-4">
                                <div className="flex items-center space-x-3">
                                  <img
                                    src={book.coverImage}
                                    alt={book.title}
                                    className="w-10 h-12 object-cover rounded"
                                  />
                                  <div>
                                    <div className="font-medium text-gray-800">{book.title}</div>
                                    <div className="text-sm text-gray-600">{book.author}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="py-3 px-4">
                                <span className="bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full text-xs font-medium">
                                  {book.genre}
                                </span>
                              </td>
                              <td className="py-3 px-4">
                                <span className="text-gray-800">
                                  {book.availableCopies} / {book.totalCopies}
                                </span>
                              </td>
                              <td className="py-3 px-4 text-green-600 font-semibold">
                                ${book.dailyFee}
                              </td>
                              <td className="py-3 px-4">
                                <div className="flex space-x-2">
                                  <button className="text-[#06402B] hover:text-emerald-800 transition-colors">
                                    <Edit className="h-4 w-4" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteBook(book._id)}
                                    className="text-red-600 hover:text-red-800 transition-colors"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Users Tab */}
                {activeTab === 'users' && (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Users Management</h2>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="text-left py-3 px-4 font-semibold text-gray-700">User</th>
                            <th className="text-left py-3 px-4 font-semibold text-gray-700">Role</th>
                            <th className="text-left py-3 px-4 font-semibold text-gray-700">Member Since</th>
                            <th className="text-left py-3 px-4 font-semibold text-gray-700">Total Fees</th>
                            <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {users.map((user) => (
                            <tr key={user._id} className="hover:bg-gray-50">
                              <td className="py-3 px-4">
                                <div>
                                  <div className="font-medium text-gray-800">{user.name}</div>
                                  <div className="text-sm text-gray-600">{user.email}</div>
                                </div>
                              </td>
                              <td className="py-3 px-4">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  user.role === 'admin' 
                                    ? 'bg-teal-100 text-teal-800'
                                    : 'bg-gray-100 text-gray-800'
                                }`}>
                                  {user.role}
                                </span>
                              </td>
                              <td className="py-3 px-4 text-gray-600">
                                {new Date(user.membershipDate).toLocaleDateString()}
                              </td>
                              <td className="py-3 px-4 text-green-600 font-semibold">
                                ${user.totalFees.toFixed(2)}
                              </td>
                              <td className="py-3 px-4">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  user.isActive 
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-red-100 text-red-800'
                                }`}>
                                  {user.isActive ? 'Active' : 'Inactive'}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Borrowings Tab */}
                {activeTab === 'borrowings' && (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Borrowings Management</h2>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="text-left py-3 px-4 font-semibold text-gray-700">User</th>
                            <th className="text-left py-3 px-4 font-semibold text-gray-700">Book</th>
                            <th className="text-left py-3 px-4 font-semibold text-gray-700">Borrowed</th>
                            <th className="text-left py-3 px-4 font-semibold text-gray-700">Due</th>
                            <th className="text-left py-3 px-4 font-semibold text-gray-700">Returned</th>
                            <th className="text-left py-3 px-4 font-semibold text-gray-700">Fee</th>
                            <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {borrowings.map((borrowing) => (
                            <tr key={borrowing._id} className="hover:bg-gray-50">
                              <td className="py-3 px-4">
                                <div>
                                  <div className="font-medium text-gray-800">{borrowing.user.name}</div>
                                  <div className="text-sm text-gray-600">{borrowing.user.email}</div>
                                </div>
                              </td>
                              <td className="py-3 px-4">
                                <div>
                                  <div className="font-medium text-gray-800">{borrowing.book.title}</div>
                                  <div className="text-sm text-gray-600">{borrowing.book.author}</div>
                                </div>
                              </td>
                              <td className="py-3 px-4 text-gray-600">
                                {new Date(borrowing.borrowDate).toLocaleDateString()}
                              </td>
                              <td className="py-3 px-4 text-gray-600">
                                {new Date(borrowing.dueDate).toLocaleDateString()}
                              </td>
                              <td className="py-3 px-4 text-gray-600">
                                {borrowing.returnDate 
                                  ? new Date(borrowing.returnDate).toLocaleDateString()
                                  : '-'
                                }
                              </td>
                              <td className="py-3 px-4 text-green-600 font-semibold">
                                ${borrowing.totalFee.toFixed(2)}
                              </td>
                              <td className="py-3 px-4">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  borrowing.status === 'returned'
                                    ? 'bg-green-100 text-green-800'
                                    : borrowing.status === 'overdue'
                                    ? 'bg-red-100 text-red-800'
                                    : 'bg-emerald-100 text-emerald-800'
                                }`}>
                                  {borrowing.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;