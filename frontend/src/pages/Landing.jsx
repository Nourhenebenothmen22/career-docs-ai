import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  SparklesIcon, CheckCircleIcon, ArrowRightIcon,
  DocumentTextIcon, ShieldCheckIcon, BoltIcon,
  PencilSquareIcon, ArrowDownTrayIcon, ChevronDownIcon,
  StarIcon, ClockIcon, LanguageIcon,
} from '@heroicons/react/24/outline';
import Button from '../components/ui/Button';
import LanguageSwitcher from '../components/ui/LanguageSwitcher';
import DocumentSelection from '../components/landing/DocumentSelection';
import Newsletter from '../components/layout/Newsletter';
import Footer from '../components/layout/Footer';

function FaqAccordion() {
  const { t } = useTranslation();
  const [openIndex, setOpenIndex] = useState(null);

  const faqItems = [
    { q: t('landing.faqQ1'), a: t('landing.faqA1') },
    { q: t('landing.faqQ2'), a: t('landing.faqA2') },
    { q: t('landing.faqQ3'), a: t('landing.faqA3') },
    { q: t('landing.faqQ4'), a: t('landing.faqA4') },
    { q: t('landing.faqQ5'), a: t('landing.faqA5') },
  ];

  return (
    <div className="mx-auto max-w-3xl space-y-3">
      {faqItems.map((faq, i) => (
        <div
          key={i}
          className="overflow-hidden rounded-card border bg-white transition-all duration-200"
        >
          <button
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
            aria-expanded={openIndex === i}
            aria-controls={`faq-answer-${i}`}
            className="flex w-full items-center justify-between px-6 py-5 text-left transition-colors hover:bg-gray-50/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary-500"
          >
            <span className="text-caption font-semibold text-gray-900 pr-4">{faq.q}</span>
            <ChevronDownIcon
              className={`h-5 w-5 shrink-0 text-gray-400 transition-transform duration-200 ${openIndex === i ? 'rotate-180' : ''}`}
              aria-hidden="true"
            />
          </button>
          <div
            id={`faq-answer-${i}`}
            role="region"
            className={`overflow-hidden transition-all duration-300 ease-in-out ${openIndex === i ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
          >
            <p className="border-t px-6 py-4 text-caption leading-relaxed text-gray-500">
              {faq.a}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Landing() {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';

  const benefits = [
    t('landing.benefitNoPrompt'),
    t('landing.benefitHrCompliant'),
    t('landing.benefitPdfExport'),
    t('landing.benefitMultiLang'),
  ];

  const features = [
    {
      icon: SparklesIcon,
      title: t('landing.feature1Title'),
      desc: t('landing.feature1Desc'),
    },
    {
      icon: ShieldCheckIcon,
      title: t('landing.feature2Title'),
      desc: t('landing.feature2Desc'),
    },
    {
      icon: BoltIcon,
      title: t('landing.feature3Title'),
      desc: t('landing.feature3Desc'),
    },
  ];

  const steps = [
    { icon: DocumentTextIcon, title: t('landing.step1Title'), desc: t('landing.step1Desc') },
    { icon: PencilSquareIcon, title: t('landing.step2Title'), desc: t('landing.step2Desc') },
    { icon: SparklesIcon, title: t('landing.step3Title'), desc: t('landing.step3Desc') },
    { icon: ArrowDownTrayIcon, title: t('landing.step4Title'), desc: t('landing.step4Desc') },
  ];

  const stats = [
    { icon: StarIcon, count: '4.9', label: t('landing.statRating') },
    { icon: DocumentTextIcon, count: '10K+', label: t('landing.statDocs') },
    { icon: ClockIcon, count: '< 30s', label: t('landing.statTime') },
    { icon: LanguageIcon, count: '3', label: t('landing.statLangs') },
  ];

  return (
    <div className="min-h-screen bg-white" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Navbar */}
      <header className="sticky top-0 z-40 border-b bg-white/80 backdrop-blur-lg">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-3">
            <img src="/logo-risalatech.png" alt="RISALATECH" className="h-8 w-auto" />
            <span className="text-caption font-bold text-gray-900">{t('app.name')}</span>
          </Link>
          <div className="flex items-center gap-4">
            <nav className="hidden items-center gap-6 md:flex" aria-label="Main navigation">
              <a href="#features" className="text-caption font-medium text-gray-600 transition-colors hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded">
                {t('nav.features')}
              </a>
              <a href="#how-it-works" className="text-caption font-medium text-gray-600 transition-colors hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded">
                {t('nav.howItWorks')}
              </a>
              <a href="#faq" className="text-caption font-medium text-gray-600 transition-colors hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded">
                {t('nav.faq')}
              </a>
            </nav>
            <LanguageSwitcher />
            <Link to="/motivation-letter">
              <Button variant="primary" size="sm">
                {t('nav.getStarted')}
                <ArrowRightIcon className={`h-4 w-4 ${isRtl ? 'mirror' : ''}`} aria-hidden="true" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-50/80 via-white to-primary-50/40">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary-100/30 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMwMDAiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMSIvPjwvZz48L2c+PC9zdmc+')] opacity-40" />

        <div className="relative mx-auto max-w-7xl px-4 pb-28 pt-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-6 animate-fade-in-down">
              <img src="/logo-risalatech.png" alt="RISALATECH" className="mx-auto h-12 w-auto" />
            </div>
            <div className="mb-8 inline-flex animate-fade-in-down items-center gap-2 rounded-badge border border-primary-200 bg-primary-50/80 px-4 py-1.5 text-caption font-medium text-primary-700 shadow-sm">
              <SparklesIcon className="h-4 w-4" aria-hidden="true" />
              {t('landing.heroBadge')}
            </div>

            <h1 className="animate-fade-in-up text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl lg:text-display">
              {t('landing.heroTitle')}
              <span className="mt-3 block bg-gradient-to-r from-primary-600 via-primary-500 to-primary-400 bg-clip-text text-transparent">
                {t('landing.heroTitleAccent')}
              </span>
            </h1>

            <p className="animate-fade-in-up mx-auto mt-6 max-w-3xl text-body leading-relaxed text-gray-600 animate-delay-100">
              {t('landing.heroDesc')}
            </p>

            <div className="animate-fade-in-up mt-8 flex flex-wrap items-center justify-center gap-2 animate-delay-100">
              {benefits.map(b => (
                <span key={b} className="inline-flex items-center gap-1.5 rounded-badge bg-white/80 px-3.5 py-1.5 text-small font-medium text-gray-600 shadow-sm border">
                  <CheckCircleIcon className="h-3.5 w-3.5 text-primary-500" aria-hidden="true" />
                  {b}
                </span>
              ))}
            </div>

            <div className="animate-fade-in-up mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row animate-delay-200">
              <Link to="/motivation-letter">
                <Button size="lg" className="shadow-lg shadow-primary-500/25">
                  {t('landing.createMotivation')}
                  <ArrowRightIcon className={`h-5 w-5 ${isRtl ? 'mirror' : ''}`} aria-hidden="true" />
                </Button>
              </Link>
              <Link to="/recommendation-letter">
                <Button variant="secondary" size="lg">
                  {t('landing.createRecommendation')}
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="animate-fade-in-up mx-auto mt-16 grid max-w-3xl grid-cols-2 gap-4 sm:grid-cols-4 animate-delay-300">
            {stats.map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className="rounded-card border border-gray-100 bg-white/60 px-4 py-4 text-center backdrop-blur-sm">
                  <Icon className="mx-auto h-5 w-5 text-primary-500" aria-hidden="true" />
                  <p className="mt-1.5 text-lg font-bold text-gray-900">{item.count}</p>
                  <p className="text-small text-gray-500">{item.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Document Selection */}
      <DocumentSelection />

      {/* Features */}
      <section id="features" className="border-t bg-gray-50/50 px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-block rounded-badge bg-primary-50 px-4 py-1.5 text-small font-semibold uppercase tracking-wider text-primary-700">
              {t('landing.featuresBadge')}
            </span>
            <h2 className="mt-4 text-heading tracking-tight text-gray-900 sm:text-4xl">
              {t('landing.featuresTitle')}
            </h2>
            <p className="mt-3 text-body text-gray-500">
              {t('landing.featuresDesc')}
            </p>
          </div>

          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="group relative rounded-card border border-gray-200 bg-white p-8 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-primary-200 hover:shadow-card-hover"
                >
                  <div className="absolute inset-0 rounded-card bg-gradient-to-br from-primary-50/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <div className="relative mb-5 flex h-14 w-14 items-center justify-center rounded-card bg-primary-50 text-primary-600 shadow-card transition-all duration-300 group-hover:scale-110 group-hover:shadow-md">
                    <Icon className="h-7 w-7" aria-hidden="true" />
                  </div>
                  <h3 className="relative text-subheading text-gray-900">{feature.title}</h3>
                  <p className="relative mt-3 text-caption leading-relaxed text-gray-500">{feature.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="bg-white px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-block rounded-badge bg-primary-50 px-4 py-1.5 text-small font-semibold uppercase tracking-wider text-primary-700">
              {t('landing.howItWorksBadge')}
            </span>
            <h2 className="mt-4 text-heading tracking-tight text-gray-900 sm:text-4xl">
              {t('landing.howItWorksTitle')}
            </h2>
            <p className="mt-3 text-body text-gray-500">
              {t('landing.howItWorksDesc')}
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-4">
            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <div key={step.title} className="relative text-center">
                  {i < steps.length - 1 && (
                    <div className="absolute left-[60%] top-12 hidden h-px w-[80%] border-t-2 border-dashed border-primary-200 md:block" aria-hidden="true" />
                  )}
                  <div className="relative mx-auto flex h-20 w-20 items-center justify-center rounded-card bg-primary-50 shadow-card transition-all duration-300 hover:shadow-md hover:scale-105">
                    <Icon className="h-9 w-9 text-primary-600" aria-hidden="true" />
                  </div>
                  <span className="mt-4 inline-block rounded-badge bg-primary-50 px-3 py-0.5 text-small font-semibold text-primary-700">
                    {t('common.step')} {i + 1}
                  </span>
                  <h3 className="mt-3 text-subheading text-gray-900">{step.title}</h3>
                  <p className="mt-2 text-caption leading-relaxed text-gray-500">{step.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="border-t bg-gray-50/50 px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-block rounded-badge bg-primary-50 px-4 py-1.5 text-small font-semibold uppercase tracking-wider text-primary-700">
              {t('landing.faqBadge')}
            </span>
            <h2 className="mt-4 text-heading tracking-tight text-gray-900 sm:text-4xl">
              {t('landing.faqTitle')}
            </h2>
            <p className="mt-3 text-body text-gray-500">
              {t('landing.faqDesc')}
            </p>
          </div>

          <div className="mt-12">
            <FaqAccordion />
          </div>

          <div className="mt-12 text-center">
            <p className="text-caption text-gray-500">
              {t('landing.faqContact')}{' '}
              <a href="mailto:benothmennourhen8@gmail.com" className="font-medium text-primary-600 hover:text-primary-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded">
                {t('landing.faqContactLink')}
              </a>
            </p>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <Newsletter />

      {/* Footer */}
      <Footer />
    </div>
  );
}
