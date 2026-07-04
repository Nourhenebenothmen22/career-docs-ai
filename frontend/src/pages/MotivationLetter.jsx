import { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ArrowLeftIcon, LightBulbIcon, DocumentTextIcon, CheckCircleIcon,
} from '@heroicons/react/24/outline';
import MotivationForm from '../components/forms/MotivationForm';
import PreviewModal from '../components/preview/PreviewModal';
import LanguageSwitcher from '../components/ui/LanguageSwitcher';
import { useFormState } from '../hooks/useFormState';
import { motivationApi } from '../services/api';
import { validateMotivation, parseSkills } from '../utils/validators';
import useAppStore from '../store/useAppStore';

const initialForm = {
  fullName: '', email: '', phone: '', linkedin: '',
  jobTitle: '', companyName: '', skills: '',
  experienceLevel: 'mid', language: 'EN',
  clubs: [],
};

const requiredFields = ['fullName', 'email', 'phone', 'jobTitle', 'companyName', 'skills'];

export default function MotivationLetter() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const isRtl = i18n.language === 'ar';
  const { formData, updateField, errors, setErrors, reset } = useFormState('motivation-form', initialForm);
  const [clubErrors, setClubErrors] = useState({});
  const [result, setResult] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const generating = useAppStore(s => s.generating);
  const setGenerating = useAppStore(s => s.setGenerating);
  const addToast = useAppStore(s => s.addToast);
  const user = useAppStore(s => s.user);

  const progress = useMemo(() => {
    const filled = requiredFields.filter(f => formData[f]?.trim()).length;
    return Math.round((filled / requiredFields.length) * 100);
  }, [formData]);

  const handleGenerate = useCallback(async () => {
    const errs = validateMotivation(formData, t);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      addToast(t('toast.fillRequired'), 'warning');
      return;
    }
    const clubErrs = {};
    (formData.clubs || []).forEach((club, i) => {
      const ce = {};
      if (!club.clubName?.trim()) ce.clubName = t('motivation.clubNameRequired');
      if (!club.role) ce.role = t('motivation.roleRequired');
      if (Object.keys(ce).length > 0) clubErrs[i] = ce;
    });
    if (Object.keys(clubErrs).length > 0) {
      setClubErrors(clubErrs);
      addToast(t('toast.fillRequired'), 'warning');
      return;
    }
    setGenerating(true);
    setErrors({});
    setClubErrors({});
    try {
      const payload = {
        ...formData,
        skills: parseSkills(formData.skills),
        linkedin: formData.linkedin || undefined,
        clubs: (formData.clubs || []).filter(c => c.clubName?.trim() || c.role),
      };
      const res = await motivationApi.generate(payload);
      setResult(res.data);
      setModalOpen(true);
      addToast(t('toast.generatedSuccess'), 'success');
    } catch (e) {
      const msg = e.message || t('common.error');
      setErrors({ api: msg });
      addToast(msg, 'error');
    } finally {
      setGenerating(false);
    }
  }, [formData, t, setGenerating, setErrors, addToast]);

  const handleDownloadPdf = useCallback(async () => {
    try {
      const payload = {
        ...formData,
        skills: parseSkills(formData.skills),
        clubs: (formData.clubs || []).filter(c => c.clubName?.trim() || c.role),
      };
      await motivationApi.downloadPdf(payload);
      addToast(t('toast.pdfDownloaded'), 'success');
    } catch {
      addToast(t('toast.pdfUnavailable'), 'error');
    }
  }, [formData, addToast]);

  const handleReset = useCallback(() => { reset(); setResult(null); setClubErrors({}); }, [reset]);

  const handleGenerateAgain = useCallback(() => {
    setModalOpen(false);
    setResult(null);
  }, []);

  const handleCloseModal = useCallback(() => {
    setModalOpen(false);
  }, []);

  const tipKeys = ['tip1', 'tip2', 'tip3', 'tip4', 'tip5', 'tip6'];

  return (
    <div className="min-h-screen bg-gray-50" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Header */}
      {!user && (
        <header className="sticky top-0 z-30 border-b bg-white/80 backdrop-blur-lg">
          <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/')}
                className="flex h-9 w-9 items-center justify-center rounded-button text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
                aria-label={t('common.back')}
              >
                <ArrowLeftIcon className="h-5 w-5" aria-hidden="true" />
              </button>
              <div className="flex items-center gap-3">
                <img src="/logo-risalatech.png" alt="RISALATECH" className="h-8 w-auto" />
                <span className="text-caption font-bold text-gray-900">{t('app.name')}</span>
                <span className="mx-2 text-gray-300" aria-hidden="true">/</span>
                <span className="text-caption font-medium text-gray-500">{t('motivation.title')}</span>
              </div>
            </div>
            <LanguageSwitcher />
          </div>
        </header>
      )}

      {/* Progress Bar */}
      <div className="border-b bg-white">
        <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <div className="flex items-center justify-between text-small text-gray-500">
                <span className="font-medium text-gray-700">{t('motivation.formCompletion')}</span>
                <span>{progress}%</span>
              </div>
              <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-gray-100" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100} aria-label={t('motivation.formCompletion')}>
                <div
                  className="h-full rounded-full bg-primary-500 transition-all duration-500 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-5">
          {/* Left - Form */}
          <div className="lg:col-span-3">
            <div className="mb-6">
              <h1 className="text-heading text-gray-900">{t('motivation.title')}</h1>
              <p className="mt-1 text-caption text-gray-500">{t('motivation.subtitle')}</p>
            </div>
            <MotivationForm
              formData={formData}
              updateField={updateField}
              errors={errors}
              clubErrors={clubErrors}
              onGenerate={handleGenerate}
              onReset={handleReset}
              loading={generating}
            />
          </div>

          {/* Right - Tips */}
          <div className="lg:col-span-2">
            <div className="sticky top-24">
              <div className="rounded-card border border-primary-100 bg-gradient-to-br from-primary-50/80 to-primary-50/40 p-6 shadow-card">
                <div className="mb-4 flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-button bg-primary-100">
                    <LightBulbIcon className="h-5 w-5 text-primary-600" aria-hidden="true" />
                  </div>
                  <h3 className="text-caption font-semibold text-gray-900">{t('motivation.tipsTitle')}</h3>
                </div>
                <ul className="space-y-3">
                  {tipKeys.map(key => (
                    <li key={key} className="flex items-start gap-2.5">
                      <CheckCircleIcon className="mt-0.5 h-4 w-4 shrink-0 text-primary-500" aria-hidden="true" />
                      <span className="text-caption leading-relaxed text-gray-600">{t(`motivation.${key}`)}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 rounded-card border bg-white p-6 shadow-card">
                <h3 className="text-caption font-semibold text-gray-900">{t('motivation.expectTitle')}</h3>
                <p className="mt-2 text-caption leading-relaxed text-gray-500">
                  {t('motivation.expectDesc')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      <PreviewModal
        open={modalOpen}
        onClose={handleCloseModal}
        htmlContent={result?.htmlContent}
        letterText={result?.letterText}
        language={formData.language}
        type="motivation"
        downloadPdf={handleDownloadPdf}
        onGenerateAgain={handleGenerateAgain}
      />
    </div>
  );
}
