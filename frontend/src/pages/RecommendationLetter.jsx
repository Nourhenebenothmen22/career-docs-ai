import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ClipboardIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import RecommendationForm from '../components/forms/RecommendationForm';
import PreviewPanel from '../components/preview/PreviewPanel';
import Button from '../components/ui/Button';
import { useFormState } from '../hooks/useFormState';
import { recommendationApi } from '../services/api';
import useAppStore from '../store/useAppStore';

const initialForm = {
  recommenderName: '', recommenderRole: '', candidateName: '', candidateRole: '',
  relationshipToCandidate: '', companyName: '', durationWorkedTogether: '',
  skillsObserved: '', performanceLevel: 'excellent', language: 'EN',
};

export default function RecommendationLetter() {
  const { t } = useTranslation();
  const { formData, updateField, errors, setErrors, reset } = useFormState('recommendation-form', initialForm);
  const [result, setResult] = useState(null);
  const [copied, setCopied] = useState(false);
  const generating = useAppStore(s => s.generating);
  const setGenerating = useAppStore(s => s.setGenerating);
  const addToast = useAppStore(s => s.addToast);

  const validate = () => {
    const errs = {};
    ['recommenderName', 'recommenderRole', 'candidateName', 'candidateRole',
     'relationshipToCandidate', 'companyName', 'durationWorkedTogether', 'skillsObserved'].forEach(f => {
      if (!formData[f].trim()) errs[f] = t('recommendation.required');
    });
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleGenerate = async () => {
    if (!validate()) return;
    setGenerating(true);
    setResult(null);
    try {
      const payload = {
        ...formData,
        skillsObserved: formData.skillsObserved.split(',').map(s => s.trim()).filter(Boolean),
      };
      const res = await recommendationApi.generate(payload);
      setResult(res.data);
      addToast('Letter generated successfully!', 'success');
    } catch (e) {
      setErrors({ api: e.response?.data?.message || t('common.error') });
      addToast('Generation failed. Please try again.', 'error');
    } finally {
      setGenerating(false);
    }
  };

  const handleDownloadPdf = async () => {
    try {
      const payload = {
        ...formData,
        skillsObserved: formData.skillsObserved.split(',').map(s => s.trim()).filter(Boolean),
      };
      await recommendationApi.downloadPdf(payload);
      addToast('PDF downloaded successfully!', 'success');
    } catch {
      addToast('PDF download unavailable — Chromium not installed.', 'error');
    }
  };

  const handleCopy = async () => {
    if (result?.letterText) {
      await navigator.clipboard.writeText(result.letterText);
      setCopied(true);
      addToast(t('recommendation.copied'), 'success');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleReset = () => { reset(); setResult(null); };

  return (
    <>
      {generating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-xl">
            <div className="flex flex-col items-center gap-4">
              <div className="relative h-12 w-12">
                <div className="absolute inset-0 animate-ping rounded-full bg-primary-400 opacity-30" />
                <div className="absolute inset-0 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600" />
              </div>
              <p className="text-sm font-medium text-gray-600">{t('recommendation.generating')}</p>
            </div>
          </div>
        </div>
      )}

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">{t('recommendation.title')}</h1>
          <p className="mt-1 text-sm text-gray-500">{t('recommendation.subtitle')}</p>
        </div>

        <div className="grid gap-8 xl:grid-cols-2">
          <div>
            <RecommendationForm
              formData={formData}
              updateField={updateField}
              errors={errors}
              onGenerate={handleGenerate}
              onReset={handleReset}
              loading={generating}
            />
          </div>

          <div>
            {result && (
              <div className="mb-4 flex flex-wrap gap-2">
                <Button variant="secondary" size="sm" onClick={handleCopy} icon={<ClipboardIcon />}>
                  {copied ? t('recommendation.copied') : t('recommendation.copy')}
                </Button>
                <Button size="sm" onClick={handleDownloadPdf} icon={<ArrowDownTrayIcon />}>
                  {t('recommendation.downloadPdf')}
                </Button>
              </div>
            )}
            <PreviewPanel htmlContent={result?.htmlContent} letterText={result?.letterText} type="recommendation" />
          </div>
        </div>
      </div>
    </>
  );
}
