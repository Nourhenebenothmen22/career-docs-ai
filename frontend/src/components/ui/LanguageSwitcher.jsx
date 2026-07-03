import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { CheckIcon } from '@heroicons/react/24/outline';

const FlagUS = () => (
  <svg className="h-4 w-4 shrink-0 rounded-sm" viewBox="0 0 640 480" aria-hidden="true">
    <path fill="#bd3d44" d="M0 0h640v480H0" />
    <path stroke="#fff" strokeWidth="37" d="M0 55.3h640M0 129.4h640M0 203.6h640M0 277.7h640M0 351.9h640M0 426h640" />
    <path fill="#192f5d" d="M0 0h364.8v258.5H0" />
    <marker id="us-flag-star" markerWidth="4" markerHeight="4" refX="2" refY="2">
      <path fill="#fff" d="M2 0l.6 1.9 2-.1L3.2 3l1.3 1.5-1.9.3.2 2L2 5.6l-.8 1.4.2-2-1.9-.3L.8 3l-1.4-1.2 2 .1z" />
    </marker>
    <use href="#us-flag-star" x="18.2" y="12.9" />
    <use href="#us-flag-star" x="54.7" y="12.9" />
    <use href="#us-flag-star" x="91.2" y="12.9" />
    <use href="#us-flag-star" x="127.8" y="12.9" />
    <use href="#us-flag-star" x="164.3" y="12.9" />
    <use href="#us-flag-star" x="200.8" y="12.9" />
    <use href="#us-flag-star" x="237.3" y="12.9" />
    <use href="#us-flag-star" x="273.8" y="12.9" />
    <use href="#us-flag-star" x="310.3" y="12.9" />
    <use href="#us-flag-star" x="346.8" y="12.9" />
    <use href="#us-flag-star" x="36.5" y="38.8" />
    <use href="#us-flag-star" x="73" y="38.8" />
    <use href="#us-flag-star" x="109.5" y="38.8" />
    <use href="#us-flag-star" x="146" y="38.8" />
    <use href="#us-flag-star" x="182.5" y="38.8" />
    <use href="#us-flag-star" x="219" y="38.8" />
    <use href="#us-flag-star" x="255.5" y="38.8" />
    <use href="#us-flag-star" x="292" y="38.8" />
    <use href="#us-flag-star" x="328.5" y="38.8" />
    <use href="#us-flag-star" x="18.2" y="64.7" />
    <use href="#us-flag-star" x="54.7" y="64.7" />
    <use href="#us-flag-star" x="91.2" y="64.7" />
    <use href="#us-flag-star" x="127.8" y="64.7" />
    <use href="#us-flag-star" x="164.3" y="64.7" />
    <use href="#us-flag-star" x="200.8" y="64.7" />
    <use href="#us-flag-star" x="237.3" y="64.7" />
    <use href="#us-flag-star" x="273.8" y="64.7" />
    <use href="#us-flag-star" x="310.3" y="64.7" />
    <use href="#us-flag-star" x="346.8" y="64.7" />
    <use href="#us-flag-star" x="36.5" y="90.6" />
    <use href="#us-flag-star" x="73" y="90.6" />
    <use href="#us-flag-star" x="109.5" y="90.6" />
    <use href="#us-flag-star" x="146" y="90.6" />
    <use href="#us-flag-star" x="182.5" y="90.6" />
    <use href="#us-flag-star" x="219" y="90.6" />
    <use href="#us-flag-star" x="255.5" y="90.6" />
    <use href="#us-flag-star" x="292" y="90.6" />
    <use href="#us-flag-star" x="328.5" y="90.6" />
    <use href="#us-flag-star" x="18.2" y="116.5" />
    <use href="#us-flag-star" x="54.7" y="116.5" />
    <use href="#us-flag-star" x="91.2" y="116.5" />
    <use href="#us-flag-star" x="127.8" y="116.5" />
    <use href="#us-flag-star" x="164.3" y="116.5" />
    <use href="#us-flag-star" x="200.8" y="116.5" />
    <use href="#us-flag-star" x="237.3" y="116.5" />
    <use href="#us-flag-star" x="273.8" y="116.5" />
    <use href="#us-flag-star" x="310.3" y="116.5" />
    <use href="#us-flag-star" x="346.8" y="116.5" />
    <use href="#us-flag-star" x="36.5" y="142.4" />
    <use href="#us-flag-star" x="73" y="142.4" />
    <use href="#us-flag-star" x="109.5" y="142.4" />
    <use href="#us-flag-star" x="146" y="142.4" />
    <use href="#us-flag-star" x="182.5" y="142.4" />
    <use href="#us-flag-star" x="219" y="142.4" />
    <use href="#us-flag-star" x="255.5" y="142.4" />
    <use href="#us-flag-star" x="292" y="142.4" />
    <use href="#us-flag-star" x="328.5" y="142.4" />
    <use href="#us-flag-star" x="18.2" y="168.3" />
    <use href="#us-flag-star" x="54.7" y="168.3" />
    <use href="#us-flag-star" x="91.2" y="168.3" />
    <use href="#us-flag-star" x="127.8" y="168.3" />
    <use href="#us-flag-star" x="164.3" y="168.3" />
    <use href="#us-flag-star" x="200.8" y="168.3" />
    <use href="#us-flag-star" x="237.3" y="168.3" />
    <use href="#us-flag-star" x="273.8" y="168.3" />
    <use href="#us-flag-star" x="310.3" y="168.3" />
    <use href="#us-flag-star" x="346.8" y="168.3" />
  </svg>
);

const FlagFR = () => (
  <svg className="h-4 w-4 shrink-0 rounded-sm" viewBox="0 0 640 480" aria-hidden="true">
    <g fillRule="evenodd" strokeWidth="1pt">
      <path fill="#fff" d="M0 0h640v480H0" />
      <path fill="#00267f" d="M0 0h213.3v480H0" />
      <path fill="#f31830" d="M426.7 0H640v480H426.7" />
    </g>
  </svg>
);

const FlagSA = () => (
  <svg className="h-4 w-4 shrink-0 rounded-sm" viewBox="0 0 640 480" aria-hidden="true">
    <path fill="#006c35" d="M0 0h640v480H0" />
    <path fill="#fff" d="M105.5 157.2c-3.2-7.2-8-14.8-15.3-18.5-8.3-4.2-19.2-4.7-28.2-1.7-7.6 2.5-14.5 8.7-14.2 17.1.3 8 6 14.7 12.7 18.6 20.3 12 44.8 16.2 65 27.2 27.6 15.2 49.7 39.5 60.6 69.2 4.5 12.3 7 25.3 5 38.4-.2 1.7 2.6 1.3 2.8-.3 3-18-2.7-35.5-12-50.5-9.5-15.2-23.3-28-39.8-36-13.8-6.7-29.8-10-43.7-17.8-7.8-4.4-14.5-10-18-18.3-1.6-4.2 1.6-2.3 3-1.4 20.8 13.6 46 19.4 71 21 16.7 1 33.4-.3 50-3.4 1.6-.3 1.2-2.8-.4-2.5-18.4 2.8-37.5 3.8-55.8 0-10.7-2.2-19.8-8.6-28.3-15.4-4-3.2-6.6-8.4-4.3-13.7 2.2-4.8 7-8 11.8-9.2 11-3 24.6-3.3 34.2-9 5.2-3 9.2-8 10.2-14.2.8-5.4-1.5-12-5.3-15.8-7.2-7.2-19.6-8.8-29.2-5.3-10.2 3.7-16 14-18.2 24.5-.5 2.6 3.5 2 3.8-.5m252.3-30.8c-5.2-8-13.8-14.3-23.3-14.8-8.4-.5-17 3.5-21.8 10.6-4.4 6.5-5.4 14.5-4.2 22.3 1.3 8.4 6.2 15.5 12.8 20.3 15 11 33.8 14.2 50.2 22.6 18.5 9.5 32 27 38 47 1.6 5.5 2.8 11.2 2.4 17-.2 2.5 3.6 2.3 3.8 0 2-18.3-2.8-35.8-12.6-51-10.3-15.8-25.3-29-43.5-36.5-11.3-4.6-25.3-5.5-35.3-13.2-6-4.5-9.6-11.8-8.5-19.7.8-5.5 4.7-10 9-13 8.6-6 20.3-7.5 30-2.8 8 3.8 12.8 11.4 16 19.5.7 2 3.8 1.3 3.3-.4m96.3 105.8c-9.2-3.8-18.7-5.8-28.3-7.8-22.7-4.6-46-7.5-68-16-11-4.2-21.4-10.8-28.7-20.8-3.2-4.4-5-10.3-3-15.8 2-5.3 6.2-9.4 11-12.2 10.3-6 22.7-7.7 34.5-6 9.6 1.4 20.6 5.7 29 11.8 5.8 4.2 11.5 10 13.8 17.2.8 2.4 3.8 1.7 3.5-.3-1.5-12.3-10-24-22.3-28-13.3-4.3-33 1-42 12-9.2 11-10.2 26-3.3 38 6.6 11.3 17.8 18.5 29.8 23.2 23 9 49.2 12 70.7 24.5 16 9.4 28 25 31.2 44.2.4 2.5 3.7 2 3.5-.3-2-23.3-16.7-43.7-37.2-54.7" />
    <path fill="#fff" d="M384.4 235c-2.4 0-8.6 1.2-10.8 2.3-2.2 1-5.7 3.2-6.8 5.2-1.6 3.2-1 7.5.3 10.7 1.7 4.4 5.4 7.4 9.5 9.2 5.4 2.3 12 2.6 17.2-.6 4-2.5 6.7-6.8 7.3-11.7.5-3.8-.5-8-3.8-10.5-2.4-1.8-7.2-4.6-12.9-4.6" />
  </svg>
);

const languages = [
  { code: 'en', label: 'English', flag: <FlagUS /> },
  { code: 'fr', label: 'Français', flag: <FlagFR /> },
  { code: 'ar', label: 'العربية', flag: <FlagSA /> },
];

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
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
    <div className="relative flex items-center" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label="Select language"
        className={`flex items-center gap-2 rounded-button border bg-white px-3 py-2 text-caption font-medium text-gray-700 shadow-button transition-all duration-200 hover:border-gray-300 ${open ? 'border-primary-300 ring-2 ring-primary-500/20' : 'border-gray-200'}`}
      >
        {current.flag}
        <span className="hidden sm:inline">{current.label}</span>
        <svg className={`h-3.5 w-3.5 text-gray-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div
          className={`absolute top-full z-50 mt-1 w-44 rounded-card border border-gray-200 bg-white py-1 shadow-xl ${isRtl ? 'left-0' : 'right-0'}`}
          role="listbox"
          aria-label="Select language"
        >
          {languages.map(lang => {
            const active = i18n.language === lang.code;
            return (
              <button
                key={lang.code}
                onClick={() => switchLanguage(lang.code)}
                role="option"
                aria-selected={active}
                className={`flex w-full items-center gap-3 px-4 py-2.5 text-caption transition-colors ${active ? 'bg-primary-50 text-primary-700 font-semibold' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
              >
                {lang.flag}
                <span className="flex-1 text-left">{lang.label}</span>
                {active && <CheckIcon className="h-4 w-4 text-primary-600" aria-hidden="true" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
