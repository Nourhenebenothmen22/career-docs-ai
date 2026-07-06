import { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ArrowLeftIcon, LightBulbIcon, DocumentTextIcon, CheckCircleIcon,
} from '@heroicons/react/24/outline';
import RecommendationForm from '../components/forms/RecommendationForm';
import PreviewModal from '../components/preview/PreviewModal';
import LanguageSwitcher from '../components/ui/LanguageSwitcher';
import { useFormState } from '../hooks/useFormState';
import { recommendationApi } from '../services/api';
import { validateRecommendation, parseSkills } from '../utils/validators';
import useAppStore from '../store/useAppStore';

const initialForm = {
  recommenderName: '', recommenderRole: '', candidateName: '', candidateRole: '',
  relationshipToCandidate: '', companyName: '', durationWorkedTogether: '',
  skillsObserved: '', keyAchievements: '',
  projectName: '', projectType: '', teamSize: '', workMode: '',
  communicationEvidence: '', problemSolvingEvidence: '', ownershipEvidence: '',
};

const requiredFields = [
  'recommenderName', 'recommenderRole', 'candidateName', 'candidateRole',
  'relationshipToCandidate', 'companyName', 'durationWorkedTogether',
];

export default function RecommendationLetter() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const isRtl = i18n.language === 'ar';
  const { formData, updateField, errors, setErrors, reset } = useFormState('recommendation-form', initialForm);
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
    const errs = validateRecommendation(formData, t);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      addToast(t('toast.fillRequired'), 'warning');
      return;
    }
    setGenerating(true);
    setErrors({});
    try {
      const payload = {
        ...formData,
        language: i18n.language.toUpperCase(),
        skillsObserved: parseSkills(formData.skillsObserved || ''),
      };
      const res = await recommendationApi.generate(payload);
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
  }, [formData, t, i18n, setGenerating, setErrors, addToast]);

  const handleDownloadPdf = useCallback(async () => {
    try {
      const payload = {
        ...formData,
        id: result?.id,
        language: i18n.language.toUpperCase(),
        skillsObserved: parseSkills(formData.skillsObserved || ''),
      };
      await recommendationApi.downloadPdf(payload);
      addToast(t('toast.pdfDownloaded'), 'success');
    } catch {
      addToast(t('toast.pdfUnavailable'), 'error');
    }
  }, [formData, result, i18n, t, addToast]);

  const handleReset = useCallback(() => { reset(); setResult(null); }, [reset]);

  const handleGenerateAgain = useCallback(() => {
    setModalOpen(false);
    setResult(null);
  }, []);

  const handleCloseModal = useCallback(() => {
    setModalOpen(false);
  }, []);

  const tipKeys = ['tip1', 'tip2', 'tip3', 'tip4', 'tip5', 'tip6'];

  return (
    <div className="bg-gray-50" dir={isRtl ? 'rtl' : 'ltr'}>

      {/* Progress Bar */}
      <div className="border-b bg-white">
        <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <div className="flex items-center justify-between text-small text-gray-500">
                <span className="font-medium text-gray-700">{t('recommendation.formCompletion')}</span>
                <span>{progress}%</span>
              </div>
              <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-gray-100" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100} aria-label={t('recommendation.formCompletion')}>
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
              <h1 className="text-heading text-gray-900">{t('recommendation.title')}</h1>
              <p className="mt-1 text-caption text-gray-500">{t('recommendation.subtitle')}</p>
            </div>
            <RecommendationForm
              formData={formData}
              updateField={updateField}
              errors={errors}
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
                  <h3 className="text-caption font-semibold text-gray-900">{t('recommendation.tipsTitle')}</h3>
                </div>
                <ul className="space-y-3">
                  {tipKeys.map(key => (
                    <li key={key} className="flex items-start gap-2.5">
                      <CheckCircleIcon className="mt-0.5 h-4 w-4 shrink-0 text-primary-500" aria-hidden="true" />
                      <span className="text-caption leading-relaxed text-gray-600">{t(`recommendation.${key}`)}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 rounded-card border bg-white p-6 shadow-card">
                <h3 className="text-caption font-semibold text-gray-900">{t('recommendation.expectTitle')}</h3>
                <p className="mt-2 text-caption leading-relaxed text-gray-500">
                  {t('recommendation.expectDesc')}
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
        type="recommendation"
        downloadPdf={handleDownloadPdf}
        onGenerateAgain={handleGenerateAgain}
      />
    </div>
  );
}
