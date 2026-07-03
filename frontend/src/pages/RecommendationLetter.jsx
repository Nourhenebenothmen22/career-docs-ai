import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { ClipboardIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import RecommendationForm from '../components/forms/RecommendationForm';
import PreviewPanel from '../components/preview/PreviewPanel';
import GeneratingOverlay from '../components/ui/GeneratingOverlay';
import Button from '../components/ui/Button';
import { useFormState } from '../hooks/useFormState';
import { recommendationApi } from '../services/api';
import { validateRecommendation, parseSkills } from '../utils/validators';
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

  const handleGenerate = useCallback(async () => {
    const errs = validateRecommendation(formData, t);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setGenerating(true);
    setResult(null);
    setErrors({});
    try {
      const payload = { ...formData, skillsObserved: parseSkills(formData.skillsObserved) };
      const res = await recommendationApi.generate(payload);
      setResult(res.data);
      addToast('Letter generated successfully!', 'success');
    } catch (e) {
      setErrors({ api: e.message || t('common.error') });
      addToast('Generation failed. Please try again.', 'error');
    } finally {
      setGenerating(false);
    }
  }, [formData, t, setGenerating, setErrors, addToast]);

  const handleDownloadPdf = useCallback(async () => {
    try {
      const payload = { ...formData, skillsObserved: parseSkills(formData.skillsObserved) };
      await recommendationApi.downloadPdf(payload);
      addToast('PDF downloaded successfully!', 'success');
    } catch {
      addToast('PDF download unavailable — Chromium not installed.', 'error');
    }
  }, [formData, addToast]);

  const handleCopy = useCallback(async () => {
    if (result?.letterText) {
      await navigator.clipboard.writeText(result.letterText);
      setCopied(true);
      addToast(t('recommendation.copied'), 'success');
      setTimeout(() => setCopied(false), 2000);
    }
  }, [result, t, addToast]);

  const handleReset = useCallback(() => { reset(); setResult(null); }, [reset]);

  return (
    <>
      <GeneratingOverlay visible={generating} message={t('recommendation.generating')} />
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
