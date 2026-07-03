import { useTranslation } from 'react-i18next';
import { GlobeAltIcon, Bars3Icon } from '@heroicons/react/24/outline';
import useAppStore from '../../store/useAppStore';

const languages = [
  { code: 'en', label: 'EN', dir: 'ltr' },
  { code: 'fr', label: 'FR', dir: 'ltr' },
  { code: 'ar', label: 'AR', dir: 'rtl' },
];

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const setSidebarOpen = useAppStore(s => s.setSidebarOpen);
  const sidebarOpen = useAppStore(s => s.sidebarOpen);

  const switchLanguage = (code) => {
    i18n.changeLanguage(code);
    localStorage.setItem('lang', code);
    document.documentElement.dir = code === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = code;
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-gray-200 bg-white/80 px-4 sm:px-6 backdrop-blur-md">
      <div className="flex items-center gap-3">
        {!sidebarOpen && (
          <button
            onClick={() => setSidebarOpen(true)}
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
          >
            <Bars3Icon className="h-5 w-5" />
          </button>
        )}
      </div>

      <div className="flex items-center gap-2">
        <div className="flex overflow-hidden rounded-lg border border-gray-200 bg-gray-50 p-0.5">
          {languages.map(lang => (
            <button
              key={lang.code}
              onClick={() => switchLanguage(lang.code)}
              className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-all ${
                i18n.language === lang.code
                  ? 'bg-white text-primary-600 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {lang.label}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}
