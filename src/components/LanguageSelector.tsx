import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Globe } from 'lucide-react';

const LanguageSelector: React.FC = () => {
<<<<<<< HEAD
    const { language, setLanguage, t } = useLanguage();

    const languages = [
        { code: 'en', name: 'English', flag: '🇺🇸' },
        { code: 'fr', name: 'Français', flag: '🇫🇷' }
    ];

    return (
        <div className="relative group">
            <button className="flex items-center space-x-2 text-gray-700 hover:text-[#06402B] transition-colors">
                <Globe className="h-5 w-5" />
                <span className="hidden md:inline">{t('common.language')}</span>
                <span className="text-lg">{languages.find(l => l.code === language)?.flag}</span>
            </button>

            <div className="absolute right-0 top-full mt-2 bg-white rounded-lg shadow-lg border border-gray-200 py-2 min-w-[150px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                {languages.map((lang) => (
                    <button
                        key={lang.code}
                        onClick={() => setLanguage(lang.code as 'en' | 'fr')}
                        className={`w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors flex items-center space-x-3 ${language === lang.code ? 'bg-emerald-50 text-[#06402B]' : 'text-gray-700'
                            }`}
                    >
                        <span className="text-lg">{lang.flag}</span>
                        <span>{lang.name}</span>
                    </button>
                ))}
            </div>
        </div>
    );
=======
  const { language, setLanguage, t } = useLanguage();

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' }
  ];

  return (
    <div className="relative group">
      <button className="flex items-center space-x-2 text-gray-700 hover:text-[#06402B] transition-colors">
        <Globe className="h-5 w-5" />
        <span className="hidden md:inline">{t('common.language')}</span>
        <span className="text-lg">{languages.find(l => l.code === language)?.flag}</span>
      </button>
      
      <div className="absolute right-0 top-full mt-2 bg-white rounded-lg shadow-lg border border-gray-200 py-2 min-w-[150px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => setLanguage(lang.code as 'en' | 'fr')}
            className={`w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors flex items-center space-x-3 ${
              language === lang.code ? 'bg-emerald-50 text-[#06402B]' : 'text-gray-700'
            }`}
          >
            <span className="text-lg">{lang.flag}</span>
            <span>{lang.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
>>>>>>> dfd1c293eded44ad85555bda85466495188c6f64
};

export default LanguageSelector;