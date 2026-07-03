import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Bars3Icon, CheckIcon } from '@heroicons/react/24/outline';
import useAppStore from '../../store/useAppStore';

const languages = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'ar', label: 'العربية', flag: '🇸🇦' },
];

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const setSidebarOpen = useAppStore(s => s.setSidebarOpen);
  const sidebarOpen = useAppStore(s => s.sidebarOpen);
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const isRtl = i18n.language === 'ar';
  const current = languages.find(l => l.code === i18n.language) || languages[0];

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const switchLanguage = (code) => {
    i18n.changeLanguage(code);
    localStorage.setItem('lang', code);
    document.documentElement.dir = code === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = code;
    setOpen(false);
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-gray-200 bg-white/80 px-4 sm:px-6 backdrop-blur-md">
      <div className="flex items-center gap-3">
        {!sidebarOpen && (
          <button
            onClick={() => setSidebarOpen(true)}
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
          >
            <Bars3Icon className="h-5 w-5" />
          </button>
        )}
      </div>

      <div className="relative flex items-center" ref={ref}>
        <button
          onClick={() => setOpen(!open)}
          className={`flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm transition-all hover:border-gray-300 hover:shadow ${open ? 'border-primary-300 ring-2 ring-primary-500/20' : ''}`}
        >
          <span className="text-base leading-none">{current.flag}</span>
          <span className="hidden sm:inline">{current.label}</span>
          <svg className={`h-4 w-4 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {open && (
          <div className={`absolute top-full mt-1 w-48 rounded-xl border border-gray-200 bg-white py-1 shadow-xl z-50 ${isRtl ? 'left-0' : 'right-0'}`}>
            {languages.map(lang => {
              const active = i18n.language === lang.code;
              return (
                <button
                  key={lang.code}
                  onClick={() => switchLanguage(lang.code)}
                  className={`flex w-full items-center gap-3 px-4 py-2.5 text-sm transition-colors ${active ? 'bg-primary-50 text-primary-700 font-semibold' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
                >
                  <span className="text-base leading-none">{lang.flag}</span>
                  <span className="flex-1 text-left">{lang.label}</span>
                  {active && <CheckIcon className="h-4 w-4 text-primary-600" />}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </header>
  );
}
