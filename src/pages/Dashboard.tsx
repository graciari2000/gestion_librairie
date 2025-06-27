import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  Book,
  Calendar,
  DollarSign,
  Clock,
  CheckCircle,
  AlertTriangle,
  ArrowLeft
} from 'lucide-react';

interface Borrowing {
  _id: string;
  book?: {
    _id?: string;
    title?: string;
    author?: string;
    coverImage?: string;
  };
  borrowDate: string;
  dueDate: string;
  returnDate?: string;
  dailyFee: number;
  totalFee: number;
  lateFee: number;
  status: 'borrowed' | 'returned' | 'overdue';
  isPaid: boolean;
}

const Dashboard: React.FC = () => {
  const { user, token } = useAuth();
  const [borrowings, setBorrowings] = useState<Borrowing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [returning, setReturning] = useState<string | null>(null);

  const [returnErrors, setReturnErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchBorrowings();
  }, []);

  const fetchBorrowings = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/borrowings/my-borrowings', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch borrowings');
      }

      const data = await response.json();
      setBorrowings(data);
    } catch (error) {
      console.error('Error fetching borrowings:', error);
      setError(error instanceof Error ? error.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleReturn = async (borrowingId: string) => {
    setReturning(borrowingId);
    setReturnErrors(prev => ({ ...prev, [borrowingId]: '' }));

    try {
      const endpoint = `http://localhost:5003/api/borrowings/${borrowingId}/return`;
      console.log('Making request to:', endpoint); // Log the exact URL

      const response = await fetch(endpoint, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('Response status:', response.status); // Log the status code

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.log('Error response data:', errorData); // Log error details
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      fetchBorrowings();
    } catch (error) {
      console.error('Full error details:', {
        error,
        message: error.message,
        stack: error.stack
      });
      setReturnErrors(prev => ({
        ...prev,
        [borrowingId]: error.message
      }));
    } finally {
      setReturning(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'borrowed':
        return 'bg-emerald-100 text-emerald-800';
      case 'returned':
        return 'bg-green-100 text-green-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'borrowed':
        return <Clock className="h-4 w-4" />;
      case 'returned':
        return <CheckCircle className="h-4 w-4" />;
      case 'overdue':
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Book className="h-4 w-4" />;
    }
  };

  const activeBorrowings = borrowings.filter(b => b.status !== 'returned');
  const completedBorrowings = borrowings.filter(b => b.status === 'returned');
  const totalFees = borrowings.reduce((sum, b) => sum + (b.totalFee || 0), 0);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchBorrowings}
            className="bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">My Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user?.name}!</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-6 rounded-xl border border-emerald-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#06402B] font-medium">Active Borrowings</p>
                <p className="text-2xl font-bold text-emerald-800">{activeBorrowings.length}</p>
              </div>
              <Book className="h-8 w-8 text-[#06402B]" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 font-medium">Completed</p>
                <p className="text-2xl font-bold text-green-800">{completedBorrowings.length}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-teal-50 to-teal-100 p-6 rounded-xl border border-teal-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-teal-600 font-medium">Total Books</p>
                <p className="text-2xl font-bold text-teal-800">{borrowings.length}</p>
              </div>
              <Calendar className="h-8 w-8 text-teal-600" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-xl border border-orange-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-600 font-medium">Total Fees</p>
                <p className="text-2xl font-bold text-orange-800">${totalFees.toFixed(2)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-orange-600" />
            </div>
          </div>
        </div>

        {/* Active Borrowings */}
        {activeBorrowings.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Currently Borrowed Books</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {activeBorrowings.map((borrowing) => (
                <div
                  key={borrowing._id}
                  className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden"
                >
                  <div className="flex">
                    <div className="w-32 h-40 flex-shrink-0">
                      <img
                        src={borrowing?.book?.coverImage || '/default-book-cover.jpg'}
                        alt={borrowing?.book?.title || 'Book cover'}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/default-book-cover.jpg';
                        }}
                      />
                    </div>
                    <div className="flex-1 p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-bold text-lg text-gray-800 mb-1">
                            {borrowing?.book?.title || 'Unknown Title'}
                          </h3>
                          <p className="text-gray-600">{borrowing?.book?.author || 'Unknown Author'}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${getStatusColor(borrowing.status)}`}>
                          {getStatusIcon(borrowing.status)}
                          <span className="capitalize">{borrowing.status}</span>
                        </span>
                      </div>

                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Borrowed:</span>
                          <span>{new Date(borrowing.borrowDate).toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Due:</span>
                          <span className={new Date(borrowing.dueDate) < new Date() ? 'text-red-600 font-medium' : ''}>
                            {new Date(borrowing.dueDate).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Current Fee:</span>
                          <span className="font-semibold text-[#06402B]">
                            ${borrowing.totalFee.toFixed(2)}
                            {borrowing.lateFee > 0 && (
                              <span className="text-red-600 ml-1">
                                (+${borrowing.lateFee.toFixed(2)} late)
                              </span>
                            )}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleReturn(borrowing._id)}
                        disabled={returning === borrowing._id}
                        className="w-full bg-gradient-to-r from-green-600 to-teal-600 text-white py-2 rounded-lg hover:from-green-700 hover:to-teal-700 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {returning === borrowing._id ? (
                          <div className="flex items-center justify-center space-x-2">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            <span>Returning...</span>
                          </div>
                        ) : (
                          'Return Book'
                        )}
                      </button>
                      {returnErrors[borrowing._id] && (
                        <p className="text-red-500 text-sm mt-2">{returnErrors[borrowing._id]}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Borrowing History */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Borrowing History</h2>
          {borrowings.length === 0 ? (
            <div className="bg-white rounded-xl shadow-lg p-12 text-center border border-gray-100">
              <Book className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No Books Borrowed Yet</h3>
              <p className="text-gray-500 mb-6">Start exploring our collection to find your next great read!</p>
              <a
                href="/books"
                className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-3 rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-all duration-200 font-medium inline-block"
              >
                Browse Books
              </a>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left py-4 px-6 font-semibold text-gray-700">Book</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-700">Borrowed</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-700">Due</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-700">Returned</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-700">Status</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-700">Fee</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {borrowings.map((borrowing) => (
                      <tr key={borrowing._id} className="hover:bg-gray-50">
                        <td className="py-4 px-6">
                          <div className="flex items-center space-x-3">
                            <img
                              src={borrowing?.book?.coverImage || '/default-book-cover.jpg'}
                              alt={borrowing?.book?.title || 'Book cover'}
                              className="w-10 h-12 object-cover rounded"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = '/default-book-cover.jpg';
                              }}
                            />
                            <div>
                              <div className="font-medium text-gray-800">
                                {borrowing?.book?.title || 'Unknown Title'}
                              </div>
                              <div className="text-sm text-gray-600">
                                {borrowing?.book?.author || 'Unknown Author'}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-gray-600">
                          {new Date(borrowing.borrowDate).toLocaleDateString()}
                        </td>
                        <td className="py-4 px-6 text-gray-600">
                          {new Date(borrowing.dueDate).toLocaleDateString()}
                        </td>
                        <td className="py-4 px-6 text-gray-600">
                          {borrowing.returnDate
                            ? new Date(borrowing.returnDate).toLocaleDateString()
                            : '-'
                          }
                        </td>
                        <td className="py-4 px-6">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1 w-fit ${getStatusColor(borrowing.status)}`}>
                            {getStatusIcon(borrowing.status)}
                            <span className="capitalize">{borrowing.status}</span>
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <div className="font-semibold text-gray-800">
                            ${borrowing.totalFee.toFixed(2)}
                            {borrowing.lateFee > 0 && (
                              <div className="text-xs text-red-600">
                                +${borrowing.lateFee.toFixed(2)} late fee
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;