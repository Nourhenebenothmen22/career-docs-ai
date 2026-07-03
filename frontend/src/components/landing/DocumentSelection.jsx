import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { DocumentTextIcon, UserGroupIcon, ArrowRightIcon } from '@heroicons/react/24/outline';

export default function DocumentSelection() {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';

  const documents = [
    {
      id: 'motivation',
      icon: DocumentTextIcon,
      title: t('landing.docMotTitle'),
      description: t('landing.docMotDesc'),
      buttonText: t('landing.docMotBtn'),
      link: '/motivation-letter',
    },
    {
      id: 'recommendation',
      icon: UserGroupIcon,
      title: t('landing.docRecTitle'),
      description: t('landing.docRecDesc'),
      buttonText: t('landing.docRecBtn'),
      link: '/recommendation-letter',
    },
  ];

  return (
    <section className="relative bg-white px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-block rounded-badge bg-primary-50 px-4 py-1.5 text-small font-semibold uppercase tracking-wider text-primary-700">
            {t('landing.docSelectionBadge')}
          </span>
          <h2 className="mt-4 text-heading tracking-tight text-gray-900 sm:text-4xl">
            {t('landing.docSelectionTitle')}
          </h2>
          <p className="mt-3 text-body text-gray-500">
            {t('landing.docSelectionDesc')}
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-2">
          {documents.map((doc, index) => {
            const Icon = doc.icon;
            return (
              <div
                key={doc.id}
                className="group relative flex flex-col rounded-card border border-gray-200 bg-white p-8 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover animate-fade-in-up"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="absolute inset-0 rounded-card bg-gradient-to-br from-primary-500/3 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <div className="absolute -inset-px rounded-card bg-gradient-to-br from-primary-500/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" style={{ zIndex: -1 }} />

                <div className="flex h-16 w-16 items-center justify-center rounded-card bg-primary-50 text-primary-600 shadow-card transition-all duration-300 group-hover:scale-110 group-hover:shadow-md">
                  <Icon className="h-8 w-8" aria-hidden="true" />
                </div>

                <h3 className="mt-6 text-2xl font-bold text-gray-900">{doc.title}</h3>
                <p className="mt-3 flex-1 text-body leading-relaxed text-gray-500">
                  {doc.description}
                </p>

                <div className="mt-8">
                  <Link
                    to={doc.link}
                    className={`inline-flex w-full items-center justify-center gap-2 rounded-card bg-primary-600 px-6 py-3.5 text-caption font-semibold text-white shadow-md transition-all duration-300 hover:bg-primary-700 hover:shadow-lg active:scale-[0.98]`}
                  >
                    {doc.buttonText}
                    <ArrowRightIcon className={`h-4 w-4 transition-transform group-hover:translate-x-0.5 ${isRtl ? 'mirror' : ''}`} aria-hidden="true" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
