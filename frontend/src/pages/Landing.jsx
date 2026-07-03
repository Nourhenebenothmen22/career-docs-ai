import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  DocumentTextIcon, AcademicCapIcon, ShieldCheckIcon,
  ArrowRightIcon, SparklesIcon, CheckCircleIcon,
} from '@heroicons/react/24/outline';
import Button from '../components/ui/Button';
import Newsletter from '../components/layout/Newsletter';

const features = (t) => [
  {
    icon: DocumentTextIcon,
    title: t('landing.feature1Title'),
    desc: t('landing.feature1Desc'),
  },
  {
    icon: AcademicCapIcon,
    title: t('landing.feature2Title'),
    desc: t('landing.feature2Desc'),
  },
  {
    icon: ShieldCheckIcon,
    title: t('landing.feature3Title'),
    desc: t('landing.feature3Desc'),
  },
];

const benefits = [
  'No prompt writing required',
  'HR-compliant formatting',
  'A4 PDF export ready',
  'Multi-language support',
];

export default function Landing() {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';

  return (
    <div className="min-h-screen bg-white" dir={isRtl ? 'rtl' : 'ltr'}>
      <header className="relative border-b border-gray-100 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-600 shadow-sm">
              <DocumentTextIcon className="h-5 w-5 text-white" />
            </div>
            <span className="text-base font-bold text-gray-900">{t('app.name')}</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link to="/dashboard">
              <Button variant="primary" size="sm">
                {t('landing.getStarted')}
                <ArrowRightIcon className={`h-4 w-4 ${isRtl ? 'rotate-180' : ''}`} />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-blue-50">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMwMDAiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMSIvPjwvZz48L2c+PC9zdmc+')] opacity-40" />
        <div className="relative mx-auto max-w-6xl px-4 pb-28 pt-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-primary-200 bg-primary-50/80 px-4 py-1.5 text-sm font-medium text-primary-700">
              <SparklesIcon className="h-4 w-4" />
              {t('landing.badge')}
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
              {t('landing.heroTitle')}
              <span className="mt-3 block bg-gradient-to-r from-primary-600 via-primary-500 to-blue-500 bg-clip-text text-transparent">
                {t('landing.heroTitleAccent')}
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-3xl text-lg leading-relaxed text-gray-600">
              {t('app.description')}
            </p>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              {benefits.map(b => (
                <span key={b} className="inline-flex items-center gap-1.5 rounded-full bg-white/80 px-3.5 py-1.5 text-xs font-medium text-gray-600 shadow-sm border border-gray-100">
                  <CheckCircleIcon className="h-3.5 w-3.5 text-primary-500" />
                  {b}
                </span>
              ))}
            </div>

            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link to="/dashboard">
                <Button size="lg" className="shadow-lg shadow-primary-500/25">
                  {t('dashboard.startCreating')}
                  <ArrowRightIcon className={`h-5 w-5 ${isRtl ? 'rotate-180' : ''}`} />
                </Button>
              </Link>
              <Link to="/motivation-letter">
                <Button variant="secondary" size="lg">
                  {t('landing.seeHowItWorks')}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-gray-100 bg-white px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Everything you need for professional HR documents
            </h2>
            <p className="mt-4 text-lg text-gray-500">
              Our AI-powered platform handles the writing so you can focus on what matters.
            </p>
          </div>

          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features(t).map((feature, i) => (
              <div
                key={feature.title}
                className="group relative rounded-2xl border border-gray-200 bg-white p-8 shadow-sm transition-all hover:border-primary-200 hover:shadow-lg hover:-translate-y-0.5"
              >
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-50 to-blue-50 text-primary-600 shadow-sm transition-all group-hover:from-primary-100 group-hover:to-blue-100 group-hover:shadow-md">
                  <feature.icon className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">{feature.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-gray-500">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-br from-primary-600 to-primary-800 px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">{t('landing.ctaTitle')}</h2>
          <p className="mt-4 text-lg text-primary-100">{t('landing.ctaDesc')}</p>
          <div className="mt-10">
            <Link to="/dashboard">
              <Button
                variant="secondary"
                size="lg"
                className="!bg-white !text-primary-700 shadow-lg shadow-black/10 hover:!bg-primary-50"
              >
                {t('dashboard.startCreating')}
                <ArrowRightIcon className={`h-5 w-5 ${isRtl ? 'rotate-180' : ''}`} />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Newsletter />

      <footer className="border-t border-gray-100 bg-white px-4 py-8 text-center text-sm text-gray-400">
        &copy; {new Date().getFullYear()} {t('app.name')}. {t('footer.rights')}
      </footer>
    </div>
  );
}
