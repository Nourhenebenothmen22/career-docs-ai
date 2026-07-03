import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PaperAirplaneIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

export default function Newsletter() {
  const { t, i18n } = useTranslation();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle');
  const isRtl = i18n.language === 'ar';

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) return;
    setStatus('loading');
    setTimeout(() => {
      setStatus('success');
      setEmail('');
      setTimeout(() => setStatus('idle'), 4000);
    }, 1200);
  };

  return (
    <section className="border-t bg-primary-50/60">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="text-heading text-gray-900">{t('newsletter.title')}</h2>
          <p className="mt-3 text-body text-gray-500">{t('newsletter.subtitle')}</p>

          <form onSubmit={handleSubmit} className="mt-8">
            {status === 'success' ? (
              <div className="flex items-center justify-center gap-2 rounded-card border border-green-200 bg-green-50 px-5 py-3 text-caption font-medium text-green-700">
                <CheckCircleIcon className="h-5 w-5 shrink-0" aria-hidden="true" />
                {t('newsletter.success')}
              </div>
            ) : (
              <div className="mx-auto flex max-w-md flex-col gap-3 sm:flex-row">
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder={t('newsletter.placeholder')}
                  aria-label={t('newsletter.placeholder')}
                  className={`flex-1 rounded-button border border-gray-300 bg-white px-4 py-2.5 text-caption text-gray-900 placeholder-gray-400 shadow-button transition-all focus-visible:border-primary-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/30 ${isRtl ? 'text-right' : ''}`}
                  required
                />
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="inline-flex items-center justify-center gap-2 rounded-button bg-primary-600 px-5 py-2.5 text-caption font-semibold text-white shadow-button transition-all hover:bg-primary-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:opacity-50"
                >
                  {status === 'loading' ? (
                    <svg className="h-4 w-4 animate-spinner" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                  ) : (
                    <PaperAirplaneIcon className="h-4 w-4" aria-hidden="true" />
                  )}
                  {t('newsletter.button')}
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}
