import { useState } from 'react';
import { SparklesIcon, ArrowDownTrayIcon, ClipboardIcon } from '@heroicons/react/24/outline';
import FormCard from '../components/FormCard';
import PreviewPanel from '../components/PreviewPanel';
import LoadingOverlay from '../components/LoadingOverlay';
import { useFormState } from '../hooks/useFormState';
import { motivationApi } from '../services/api';

const initialForm = {
  fullName: '',
  email: '',
  phone: '',
  linkedin: '',
  jobTitle: '',
  companyName: '',
  skills: '',
  experienceLevel: 'mid',
  language: 'EN',
};

export default function MotivationLetter() {
  const { formData, updateField, errors, setErrors, reset } = useFormState('motivation-form', initialForm);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const validate = () => {
    const errs = {};
    if (!formData.fullName.trim()) errs.fullName = 'Required';
    if (!formData.email.trim()) errs.email = 'Required';
    if (!formData.phone.trim()) errs.phone = 'Required';
    if (!formData.jobTitle.trim()) errs.jobTitle = 'Required';
    if (!formData.companyName.trim()) errs.companyName = 'Required';
    if (!formData.skills.trim()) errs.skills = 'Required';
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
        skills: formData.skills.split(',').map(s => s.trim()).filter(Boolean),
        linkedin: formData.linkedin || undefined,
      };
      const res = await motivationApi.generate(payload);
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
        skills: formData.skills.split(',').map(s => s.trim()).filter(Boolean),
      };
      await motivationApi.downloadPdf(payload);
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
      <LoadingOverlay visible={loading} message="Generating your motivation letter..." />
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Motivation Letter Generator</h1>
        <p className="mt-1 text-sm text-gray-500">
          Fill in your details below and generate a professional cover letter.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-6">
          <FormCard title="Personal Information" description="Your contact details">
            <div>
              <label className="label">Full Name *</label>
              <input className={inputClass('fullName')} placeholder="e.g. John Doe" value={formData.fullName} onChange={e => updateField('fullName', e.target.value)} />
              {errors.fullName && <p className="mt-1 text-xs text-red-500">{errors.fullName}</p>}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Email *</label>
                <input className={inputClass('email')} type="email" placeholder="john@example.com" value={formData.email} onChange={e => updateField('email', e.target.value)} />
                {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
              </div>
              <div>
                <label className="label">Phone *</label>
                <input className={inputClass('phone')} placeholder="+1 234 567 890" value={formData.phone} onChange={e => updateField('phone', e.target.value)} />
                {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
              </div>
            </div>
            <div>
              <label className="label">LinkedIn (optional)</label>
              <input className="input-field" placeholder="https://linkedin.com/in/..." value={formData.linkedin} onChange={e => updateField('linkedin', e.target.value)} />
            </div>
          </FormCard>

          <FormCard title="Job Details" description="Information about the position">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Job Title *</label>
                <input className={inputClass('jobTitle')} placeholder="e.g. Frontend Developer" value={formData.jobTitle} onChange={e => updateField('jobTitle', e.target.value)} />
                {errors.jobTitle && <p className="mt-1 text-xs text-red-500">{errors.jobTitle}</p>}
              </div>
              <div>
                <label className="label">Company Name *</label>
                <input className={inputClass('companyName')} placeholder="e.g. Acme Corp" value={formData.companyName} onChange={e => updateField('companyName', e.target.value)} />
                {errors.companyName && <p className="mt-1 text-xs text-red-500">{errors.companyName}</p>}
              </div>
            </div>
            <div>
              <label className="label">Skills (comma-separated) *</label>
              <input className={inputClass('skills')} placeholder="e.g. JavaScript, React, Node.js" value={formData.skills} onChange={e => updateField('skills', e.target.value)} />
              {errors.skills && <p className="mt-1 text-xs text-red-500">{errors.skills}</p>}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Experience Level</label>
                <select className="input-field" value={formData.experienceLevel} onChange={e => updateField('experienceLevel', e.target.value)}>
                  <option value="junior">Junior</option>
                  <option value="mid">Mid-Level</option>
                  <option value="senior">Senior</option>
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
          <PreviewPanel htmlContent={result?.htmlContent} letterText={result?.letterText} type="motivation" />
        </div>
      </div>
    </div>
  );
}
