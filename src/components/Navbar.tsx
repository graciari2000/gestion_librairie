import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { BookOpen, User, LogOut } from 'lucide-react';
import LanguageSelector from './LanguageSelector';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <BookOpen className="h-8 w-8 text-[#06402B]" />
            <span className="text-xl font-bold bg-gradient-to-r from-[#06402B] to-[#0B6E4F] bg-clip-text text-transparent">
              BookVault
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/books"
              className="text-gray-700 hover:text-[#06402B] transition-colors font-medium"
            >
              {t('nav.browse_books')}
            </Link>
            {user && (
              <Link
                to="/dashboard"
                className="text-gray-700 hover:text-[#06402B] transition-colors font-medium"
              >
                {t('nav.my_books')}
              </Link>
            )}
            {user?.role === 'admin' && (
              <Link
                to="/admin"
                className="text-gray-700 hover:text-[#06402B] transition-colors font-medium"
              >
                {t('nav.admin_panel')}
              </Link>
            )}
          </div>

          <div className="flex items-center space-x-4">
            <LanguageSelector />
            {user ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <User className="h-5 w-5 text-gray-600" />
                  <span className="text-gray-700 font-medium">{user.name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 text-gray-600 hover:text-red-600 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span>{t('nav.logout')}</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-[#06402B] transition-colors font-medium"
                >
                  {t('nav.login')}
                </Link>
                <Link
                  to="/register"
                  className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-4 py-2 rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-all duration-200 font-medium"
                >
                  {t('nav.signup')}
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;