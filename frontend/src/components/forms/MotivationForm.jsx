import { useTranslation } from 'react-i18next';
import Input, { Select } from '../ui/Input';
import Button from '../ui/Button';
import Card from '../ui/Card';
import { SparklesIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

export default function MotivationForm({ formData, updateField, errors, onGenerate, onReset, loading }) {
  const { t } = useTranslation();

  const expLevelOptions = [
    { value: 'junior', label: t('motivation.junior') },
    { value: 'mid', label: t('motivation.mid') },
    { value: 'senior', label: t('motivation.senior') },
  ];

  const langOptions = [
    { value: 'EN', label: 'English' },
    { value: 'FR', label: 'Français' },
  ];

  return (
    <div className="space-y-6">
      <Card title={t('motivation.personalInfo')} description={t('motivation.personalInfoDesc')}>
        <Input label={t('motivation.fullName')} required error={errors.fullName} placeholder="e.g. John Doe" value={formData.fullName} onChange={e => updateField('fullName', e.target.value)} />
        <div className="grid grid-cols-2 gap-4">
          <Input label={t('motivation.email')} type="email" required error={errors.email} placeholder="john@example.com" value={formData.email} onChange={e => updateField('email', e.target.value)} />
          <Input label={t('motivation.phone')} required error={errors.phone} placeholder="+1 234 567 890" value={formData.phone} onChange={e => updateField('phone', e.target.value)} />
        </div>
        <Input label={t('motivation.linkedin')} placeholder="https://linkedin.com/in/..." value={formData.linkedin} onChange={e => updateField('linkedin', e.target.value)} />
      </Card>

      <Card title={t('motivation.jobDetails')} description={t('motivation.jobDetailsDesc')}>
        <div className="grid grid-cols-2 gap-4">
          <Input label={t('motivation.jobTitle')} required error={errors.jobTitle} placeholder="e.g. Frontend Developer" value={formData.jobTitle} onChange={e => updateField('jobTitle', e.target.value)} />
          <Input label={t('motivation.companyName')} required error={errors.companyName} placeholder="e.g. Acme Corp" value={formData.companyName} onChange={e => updateField('companyName', e.target.value)} />
        </div>
        <Input label={t('motivation.skills')} required error={errors.skills} placeholder="e.g. JavaScript, React, Node.js" value={formData.skills} onChange={e => updateField('skills', e.target.value)} />
        <div className="grid grid-cols-2 gap-4">
          <Select label={t('motivation.experienceLevel')} options={expLevelOptions} value={formData.experienceLevel} onChange={e => updateField('experienceLevel', e.target.value)} />
          <Select label={t('motivation.language')} options={langOptions} value={formData.language} onChange={e => updateField('language', e.target.value)} />
        </div>
      </Card>

      {errors.api && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{errors.api}</div>
      )}

      <div className="flex flex-wrap gap-3">
        <Button onClick={onGenerate} loading={loading} icon={<SparklesIcon />}>
          {t('motivation.generate')}
        </Button>
        <Button variant="secondary" onClick={onReset} icon={<ArrowPathIcon />}>
          {t('motivation.reset')}
        </Button>
      </div>
    </div>
  );
}
