import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { Search, Filter, Book, Calendar, DollarSign, AlertTriangle, RefreshCw } from 'lucide-react';
import { API_BASE_URL } from '../config';

interface Book {
  _id: string;
  title: string;
  author: {
    name: string;
    _id: string;
  };
  genre: string;
  description: string;
  image: string;
  availableCopies: number;
  totalCopies: number;
  dailyFee: number;
  publishedYear: number;
  price: number;
  stock: number;
}

const Books: React.FC = () => {
  const { t } = useLanguage();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [genre, setgenre] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [retryCount, setRetryCount] = useState(0);

  const genres = [
    { key: 'All', label: t('books.all_genres') },
    { key: 'Fiction', label: t('genre.fiction') },
    { key: 'Dystopian', label: t('genre.dystopian') },
    { key: 'Classic', label: t('genre.classic') },
    { key: 'Fantasy', label: t('genre.fantasy') },
    { key: 'Historical Fiction', label: t('genre.historical_fiction') },
    { key: 'Memoir', label: t('genre.memoir') },
    { key: 'Young Adult', label: t('genre.young_adult') },
    { key: 'Gothic Fiction', label: t('genre.gothic_fiction') },
    { key: 'Philosophical Fiction', label: t('genre.philosophical_fiction') }
  ];

  const fetchBooks = async (signal?: AbortSignal) => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '12',
        ...(search && { search }),
        ...(genre !== 'All' && { genre: genre })
      });

      const response = await fetch(`${API_BASE_URL}/api/books?${params}`, {
        signal,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache'
        }
      });

      if (!response.ok) {
        if (response.status === 503) {
          // Verify backend health
          const healthResponse = await fetch(`${API_BASE_URL}/api/health`);
          if (!healthResponse.ok) {
            throw new Error(t('books.backend_unavailable'));
          }
          throw new Error(t('books.service_unavailable'));
        }
        throw new Error(`${t('books.fetch_error')} (Status: ${response.status})`);
      }

      const data = await response.json();
      if (!data.books) throw new Error(t('books.invalid_response'));

      setBooks(data.books);
      setTotalPages(data.totalPages || 1);

      // Cache successful response
      localStorage.setItem('cachedBooks', JSON.stringify(data.books));
  } catch (err: unknown) {
      if (!(err instanceof DOMException && err.name === 'AbortError')) {
        console.error('Fetch error:', err);
        const message = err instanceof Error ? err.message : t('books.fetch_error');
        setError(message);

        // Fallback to cached data if available
        const cachedBooks = localStorage.getItem('cachedBooks');
        if (cachedBooks) {
          try {
            setBooks(JSON.parse(cachedBooks));
          } catch (e) {
            console.error('Error parsing cached books:', e);
          }
        }
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    fetchBooks(controller.signal).finally(() => {
      clearTimeout(timeoutId);
    });

    return () => {
      controller.abort();
      clearTimeout(timeoutId);
    };
  }, [search, genre, currentPage, t, retryCount]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">{t('books.title')}</h1>
          <p className="text-gray-600 text-lg">{t('books.subtitle')}</p>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
          <div className="flex flex-col lg:flex-row gap-4">
            <form onSubmit={handleSearch} className="flex-1">
              <div className="relative">
                <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={t('books.search_placeholder')}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                />
              </div>
            </form>

            <div className="lg:w-64">
              <div className="relative">
                <Filter className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <select
                  value={genre}
                  onChange={(e) => {
                    setgenre(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all appearance-none bg-white"
                >
                  {genres.map((cat) => (
                    <option key={cat.key} value={cat.key}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-amber-50 border-l-4 border-amber-400 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-5 w-5 text-amber-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-amber-800">
                  {error.includes('503') ? t('books.service_unavailable') : error}
                </h3>
                <div className="mt-2 text-sm text-amber-700">
                  <p>{t('books.retry_suggestion')}</p>
                  <button
                    onClick={handleRetry}
                    disabled={loading}
                    className="mt-2 inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-amber-700 bg-amber-100 hover:bg-amber-200 focus:outline-none"
                  >
                    <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                    {t('books.retry_button')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Books Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-lg overflow-hidden animate-pulse">
                <div className="h-64 bg-gray-300"></div>
                <div className="p-6">
                  <div className="h-4 bg-gray-300 rounded mb-2"></div>
                  <div className="h-3 bg-gray-300 rounded mb-4"></div>
                  <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {books.map((book) => (
              <Link
                key={book._id}
                to={`/books/${book._id}`}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100"
              >
                <div className="h-64 overflow-hidden">
                  <img
                    src={book.image}
                    alt={book.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/placeholder-book.jpg';
                    }}
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-lg text-gray-800 mb-2 line-clamp-2">{book.title}</h3>
                  <p className="text-gray-600 mb-3">{book.author.name}</p>

                  <div className="flex items-center justify-between mb-3">
                    <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-sm font-medium">
                      {book.genre}
                    </span>
                    <div className="flex items-center text-gray-600">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span className="text-sm">{book.publishedYear}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-green-600">
                      <DollarSign className="h-4 w-4" />
                      <span className="font-semibold">${book.dailyFee.toFixed(2)} {t('books.per_day')}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Book className="h-4 w-4 mr-1" />
                      <span className="text-sm">
                        {book.availableCopies}/{book.totalCopies} {t('books.available')}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-12">
            <div className="flex space-x-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {t('books.previous')}
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-4 py-2 rounded-lg transition-colors ${currentPage === page
                      ? 'bg-emerald-600 text-white'
                      : 'border border-gray-300 hover:bg-gray-50'
                    }`}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {t('books.next')}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Books;