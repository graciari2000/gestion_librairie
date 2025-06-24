import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import {
  Book,
  Calendar,
  DollarSign,
  User,
  CheckCircle,
  AlertCircle,
  ArrowLeft
} from 'lucide-react';

interface BookData {
  _id: string;
  title: string;
  author: string;
  isbn: string;
  category: string;
  description: string;
  coverImage: string;
  totalCopies: number;
  availableCopies: number;
  dailyFee: number;
  publishedYear: number;
  addedBy: {
    name: string;
  };
}

const BookDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user, token } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [book, setBook] = useState<BookData | null>(null);
  const [loading, setLoading] = useState(true);
  const [borrowing, setBorrowing] = useState(false);
  const [days, setDays] = useState(7);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchBook();
  }, [id]);

  const fetchBook = async () => {
    try {
      const response = await fetch(`/api/books/${id}`);
      if (response.ok) {
        const data = await response.json();
        setBook(data);
      }
    } catch (error) {
      console.error('Error fetching book:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBorrow = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    setBorrowing(true);
    setMessage('');

    try {
      const response = await fetch('/api/borrowings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ bookId: id, days }),
      });

      if (response.ok) {
        setMessage(t('book.success_message'));
        fetchBook(); // Refresh book data
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      } else {
        const error = await response.json();
        setMessage(error.message);
      }
    } catch (error) {
      setMessage('Failed to borrow book. Please try again.');
    } finally {
      setBorrowing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">{t('book.not_found')}</h2>
          <button
            onClick={() => navigate('/books')}
            className="text-[#06402B] hover:text-emerald-700 font-medium"
          >
            {t('book.back_to_books')}
          </button>
        </div>
      </div>
    );
  }

  const totalCost = days * book.dailyFee;

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => navigate('/books')}
          className="flex items-center text-gray-600 hover:text-[#06402B] transition-colors mb-6"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          {t('book.back_to_books')}
        </button>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            {/* Book Cover */}
            <div className="space-y-6">
              <div className="aspect-[3/4] rounded-xl overflow-hidden shadow-lg">
                <img
                  src={book.coverImage}
                  alt={book.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center text-gray-600 mb-1">
                    <Book className="h-4 w-4 mr-2" />
                    <span>{t('book.available_copies')}</span>
                  </div>
                  <div className="font-semibold text-lg">
                    {book.availableCopies} / {book.totalCopies}
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center text-gray-600 mb-1">
                    <DollarSign className="h-4 w-4 mr-2" />
                    <span>{t('book.daily_rate')}</span>
                  </div>
                  <div className="font-semibold text-lg text-green-600">
                    ${book.dailyFee}
                  </div>
                </div>
              </div>
            </div>

            {/* Book Details */}
            <div className="space-y-6">
              <div>
                <h1 className="text-4xl font-bold text-gray-800 mb-3">{book.title}</h1>
                <p className="text-xl text-gray-600 mb-4">by {book.author}</p>

                <div className="flex flex-wrap gap-4 mb-6">
                  <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-sm font-medium">
                    {t(`category.${book.category.toLowerCase().replace('-', '_')}`)}
                  </span>
                  <div className="flex items-center text-gray-600">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>{book.publishedYear}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <User className="h-4 w-4 mr-1" />
                    <span>{t('book.added_by')} {book.addedBy.name}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">{t('book.description')}</h3>
                <p className="text-gray-600 leading-relaxed">{book.description}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-2">{t('book.isbn')}: {book.isbn}</p>
              </div>

              {/* Borrowing Section */}
              {book.availableCopies > 0 ? (
                <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-6 rounded-xl border border-emerald-100">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">{t('book.borrow_title')}</h3>

                  <div className="space-y-4">
                    <div>
                      <label htmlFor="days" className="block text-sm font-medium text-gray-700 mb-2">
                        {t('book.borrowing_period')}
                      </label>
                      <input
                        id="days"
                        type="number"
                        min="1"
                        max="30"
                        value={days}
                        onChange={(e) => setDays(parseInt(e.target.value))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      />
                    </div>

                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-600">{t('book.daily_rate')}:</span>
                        <span className="font-medium">${book.dailyFee}</span>
                      </div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-600">{t('book.borrowing_period').split(' ')[0]}:</span>
                        <span className="font-medium">{days}</span>
                      </div>
                      <div className="flex justify-between items-center text-lg font-bold text-[#06402B] border-t pt-2">
                        <span>{t('book.total_cost')}:</span>
                        <span>${totalCost.toFixed(2)}</span>
                      </div>
                    </div>

                    {message && (
                      <div className={`p-4 rounded-lg flex items-center space-x-2 ${message.includes('success')
                        ? 'bg-green-50 border border-green-200 text-green-700'
                        : 'bg-red-50 border border-red-200 text-red-700'
                        }`}>
                        {message.includes('success') ? (
                          <CheckCircle className="h-5 w-5" />
                        ) : (
                          <AlertCircle className="h-5 w-5" />
                        )}
                        <span>{message}</span>
                      </div>
                    )}

                    <button
                      onClick={handleBorrow}
                      disabled={borrowing || !user}
                      className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-3 rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-all duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {borrowing ? (
                        <div className="flex items-center justify-center space-x-2">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                          <span>{t('book.processing')}</span>
                        </div>
                      ) : user ? (
                        t('book.borrow_book')
                      ) : (
                        t('book.login_to_borrow')
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-red-50 border border-red-200 p-6 rounded-xl">
                  <div className="flex items-center space-x-2 text-red-700">
                    <AlertCircle className="h-5 w-5" />
                    <span className="font-medium">{t('book.unavailable')}</span>
                  </div>
                  <p className="text-red-600 mt-2">{t('book.unavailable_desc')}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetails;