import { useState } from 'react';
import { SparklesIcon, ArrowDownTrayIcon, ClipboardIcon } from '@heroicons/react/24/outline';
import FormCard from '../components/FormCard';
import PreviewPanel from '../components/PreviewPanel';
import LoadingOverlay from '../components/LoadingOverlay';
import { useFormState } from '../hooks/useFormState';
import { recommendationApi } from '../services/api';

const initialForm = {
  recommenderName: '',
  recommenderRole: '',
  candidateName: '',
  candidateRole: '',
  relationshipToCandidate: '',
  companyName: '',
  durationWorkedTogether: '',
  skillsObserved: '',
  performanceLevel: 'excellent',
  language: 'EN',
};

export default function RecommendationLetter() {
  const { formData, updateField, errors, setErrors, reset } = useFormState('recommendation-form', initialForm);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const validate = () => {
    const errs = {};
    const required = ['recommenderName', 'recommenderRole', 'candidateName', 'candidateRole', 'relationshipToCandidate', 'companyName', 'durationWorkedTogether', 'skillsObserved'];
    required.forEach(f => { if (!formData[f].trim()) errs[f] = 'Required'; });
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleGenerate = async () => {
    if (!validate()) return;
    setLoading(true);
    setResult(null);
    try {
      const payload = {
        ...formData,
        skillsObserved: formData.skillsObserved.split(',').map(s => s.trim()).filter(Boolean),
      };
      const res = await recommendationApi.generate(payload);
      setResult(res.data);
    } catch (e) {
      setErrors({ api: e.response?.data?.message || 'Generation failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPdf = async () => {
    try {
      const payload = {
        ...formData,
        skillsObserved: formData.skillsObserved.split(',').map(s => s.trim()).filter(Boolean),
      };
      await recommendationApi.downloadPdf(payload);
    } catch (e) {
      setErrors({ api: 'PDF download failed' });
    }
  };

  const handleCopy = async () => {
    if (result?.letterText) {
      await navigator.clipboard.writeText(result.letterText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const inputClass = (field) =>
    `input-field ${errors[field] ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' : ''}`;

  return (
    <div className="page-container">
      <LoadingOverlay visible={loading} message="Generating your recommendation letter..." />
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Recommendation Letter Generator</h1>
        <p className="mt-1 text-sm text-gray-500">
          Create a professional recommendation letter for a colleague or team member.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-6">
          <FormCard title="Recommender Information" description="Your details as the person writing the recommendation">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Your Name *</label>
                <input className={inputClass('recommenderName')} placeholder="e.g. Jane Smith" value={formData.recommenderName} onChange={e => updateField('recommenderName', e.target.value)} />
                {errors.recommenderName && <p className="mt-1 text-xs text-red-500">{errors.recommenderName}</p>}
              </div>
              <div>
                <label className="label">Your Role *</label>
                <input className={inputClass('recommenderRole')} placeholder="e.g. Engineering Manager" value={formData.recommenderRole} onChange={e => updateField('recommenderRole', e.target.value)} />
                {errors.recommenderRole && <p className="mt-1 text-xs text-red-500">{errors.recommenderRole}</p>}
              </div>
            </div>
            <div>
              <label className="label">Company Name *</label>
              <input className={inputClass('companyName')} placeholder="e.g. Acme Corp" value={formData.companyName} onChange={e => updateField('companyName', e.target.value)} />
              {errors.companyName && <p className="mt-1 text-xs text-red-500">{errors.companyName}</p>}
            </div>
          </FormCard>

          <FormCard title="Candidate Information" description="Details about the person being recommended">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Candidate Name *</label>
                <input className={inputClass('candidateName')} placeholder="e.g. John Doe" value={formData.candidateName} onChange={e => updateField('candidateName', e.target.value)} />
                {errors.candidateName && <p className="mt-1 text-xs text-red-500">{errors.candidateName}</p>}
              </div>
              <div>
                <label className="label">Candidate Role *</label>
                <input className={inputClass('candidateRole')} placeholder="e.g. Senior Developer" value={formData.candidateRole} onChange={e => updateField('candidateRole', e.target.value)} />
                {errors.candidateRole && <p className="mt-1 text-xs text-red-500">{errors.candidateRole}</p>}
              </div>
            </div>
            <div>
              <label className="label">Relationship to Candidate *</label>
              <input className={inputClass('relationshipToCandidate')} placeholder="e.g. Direct Supervisor, Team Lead" value={formData.relationshipToCandidate} onChange={e => updateField('relationshipToCandidate', e.target.value)} />
              {errors.relationshipToCandidate && <p className="mt-1 text-xs text-red-500">{errors.relationshipToCandidate}</p>}
            </div>
            <div>
              <label className="label">Duration Worked Together *</label>
              <input className={inputClass('durationWorkedTogether')} placeholder="e.g. 3 years" value={formData.durationWorkedTogether} onChange={e => updateField('durationWorkedTogether', e.target.value)} />
              {errors.durationWorkedTogether && <p className="mt-1 text-xs text-red-500">{errors.durationWorkedTogether}</p>}
            </div>
            <div>
              <label className="label">Skills Observed (comma-separated) *</label>
              <input className={inputClass('skillsObserved')} placeholder="e.g. Leadership, Problem-solving, Python" value={formData.skillsObserved} onChange={e => updateField('skillsObserved', e.target.value)} />
              {errors.skillsObserved && <p className="mt-1 text-xs text-red-500">{errors.skillsObserved}</p>}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Performance Level</label>
                <select className="input-field" value={formData.performanceLevel} onChange={e => updateField('performanceLevel', e.target.value)}>
                  <option value="excellent">Excellent</option>
                  <option value="very good">Very Good</option>
                  <option value="good">Good</option>
                </select>
              </div>
              <div>
                <label className="label">Language</label>
                <select className="input-field" value={formData.language} onChange={e => updateField('language', e.target.value)}>
                  <option value="EN">English</option>
                  <option value="FR">French</option>
                </select>
              </div>
            </div>
          </FormCard>

          {errors.api && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {errors.api}
            </div>
          )}

          <div className="flex flex-wrap gap-3">
            <button onClick={handleGenerate} className="btn-primary">
              <SparklesIcon className="h-4 w-4" />
              Generate Letter
            </button>
            <button onClick={() => { reset(); setResult(null); }} className="btn-secondary">
              Reset
            </button>
          </div>
        </div>

        <div>
          {result && (
            <div className="mb-4 flex flex-wrap gap-2">
              <button onClick={handleCopy} className="btn-secondary text-sm">
                <ClipboardIcon className="h-4 w-4" />
                {copied ? 'Copied!' : 'Copy Text'}
              </button>
              <button onClick={handleDownloadPdf} className="btn-primary text-sm">
                <ArrowDownTrayIcon className="h-4 w-4" />
                Download PDF
              </button>
            </div>
          )}
          <PreviewPanel htmlContent={result?.htmlContent} letterText={result?.letterText} type="recommendation" />
        </div>
      </div>
    </div>
  );
}
