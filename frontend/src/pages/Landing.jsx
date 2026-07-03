import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { DocumentTextIcon, AcademicCapIcon, ShieldCheckIcon, ArrowRightIcon, SparklesIcon } from '@heroicons/react/24/outline';
import Button from '../components/ui/Button';

const features = (t) => [
  { icon: DocumentTextIcon, title: t('landing.feature1Title'), desc: t('landing.feature1Desc') },
  { icon: AcademicCapIcon, title: t('landing.feature2Title'), desc: t('landing.feature2Desc') },
  { icon: ShieldCheckIcon, title: t('landing.feature3Title'), desc: t('landing.feature3Desc') },
];

export default function Landing() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-white">
      <header className="relative border-b border-gray-100">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-600 shadow-sm">
              <DocumentTextIcon className="h-5 w-5 text-white" />
            </div>
            <span className="text-base font-bold text-gray-900">{t('app.name')}</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/dashboard">
              <Button variant="primary" size="sm">
                {t('landing.getStarted')}
                <ArrowRightIcon className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-blue-50" />
        <div className="relative mx-auto max-w-5xl px-4 pb-24 pt-16 text-center sm:px-6 lg:px-8">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary-200 bg-primary-50 px-4 py-1.5 text-sm font-medium text-primary-700">
            <SparklesIcon className="h-4 w-4" />
            AI-Powered Document Generation
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
            {t('landing.heroTitle')}
            <span className="mt-2 block bg-gradient-to-r from-primary-600 to-blue-500 bg-clip-text text-transparent">
              {t('landing.heroTitleAccent')}
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
            {t('app.description')}
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link to="/dashboard">
              <Button size="lg">
                {t('dashboard.startCreating')}
                <ArrowRightIcon className="h-5 w-5" />
              </Button>
            </Link>
            <Link to="/motivation-letter">
              <Button variant="secondary" size="lg">
                {t('landing.seeHowItWorks')}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="border-t border-gray-100 bg-white px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-center text-3xl font-bold text-gray-900">
            Everything you need for professional HR documents
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-gray-500">
            {t('app.description')}
          </p>
          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features(t).map(feature => (
              <div key={feature.title} className="group rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:border-primary-200 hover:shadow-md">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 text-primary-600 transition-colors group-hover:bg-primary-100">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{feature.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-500">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-br from-primary-600 to-primary-800 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold text-white">{t('landing.ctaTitle')}</h2>
          <p className="mt-4 text-lg text-primary-100">{t('landing.ctaDesc')}</p>
          <div className="mt-8">
            <Link to="/dashboard">
              <Button variant="secondary" size="lg" className="!bg-white !text-primary-700 hover:!bg-primary-50">
                {t('dashboard.startCreating')}
                <ArrowRightIcon className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-gray-100 bg-white px-4 py-8 text-center text-sm text-gray-400">
        &copy; {new Date().getFullYear()} {t('app.name')}. {t('footer.rights')}
      </footer>
    </div>
  );
}
