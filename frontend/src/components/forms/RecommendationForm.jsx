import { useTranslation } from 'react-i18next';
import Input, { Select } from '../ui/Input';
import Button from '../ui/Button';
import Card from '../ui/Card';
import { SparklesIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

export default function RecommendationForm({ formData, updateField, errors, onGenerate, onReset, loading }) {
  const { t } = useTranslation();

  const perfOptions = [
    { value: 'excellent', label: t('recommendation.excellent') },
    { value: 'very good', label: t('recommendation.veryGood') },
    { value: 'good', label: t('recommendation.good') },
  ];

  const langOptions = [
    { value: 'EN', label: 'English' },
    { value: 'FR', label: 'Français' },
  ];

  return (
    <div className="space-y-6">
      <Card title={t('recommendation.recommenderInfo')} description={t('recommendation.recommenderInfoDesc')}>
        <div className="grid grid-cols-2 gap-4">
          <Input label={t('recommendation.recommenderName')} required error={errors.recommenderName} placeholder="e.g. Jane Smith" value={formData.recommenderName} onChange={e => updateField('recommenderName', e.target.value)} />
          <Input label={t('recommendation.recommenderRole')} required error={errors.recommenderRole} placeholder="e.g. Engineering Manager" value={formData.recommenderRole} onChange={e => updateField('recommenderRole', e.target.value)} />
        </div>
        <Input label={t('recommendation.companyName')} required error={errors.companyName} placeholder="e.g. Acme Corp" value={formData.companyName} onChange={e => updateField('companyName', e.target.value)} />
      </Card>

      <Card title={t('recommendation.candidateInfo')} description={t('recommendation.candidateInfoDesc')}>
        <div className="grid grid-cols-2 gap-4">
          <Input label={t('recommendation.candidateName')} required error={errors.candidateName} placeholder="e.g. John Doe" value={formData.candidateName} onChange={e => updateField('candidateName', e.target.value)} />
          <Input label={t('recommendation.candidateRole')} required error={errors.candidateRole} placeholder="e.g. Senior Developer" value={formData.candidateRole} onChange={e => updateField('candidateRole', e.target.value)} />
        </div>
        <Input label={t('recommendation.relationship')} required error={errors.relationshipToCandidate} placeholder="e.g. Direct Supervisor" value={formData.relationshipToCandidate} onChange={e => updateField('relationshipToCandidate', e.target.value)} />
        <Input label={t('recommendation.duration')} required error={errors.durationWorkedTogether} placeholder="e.g. 3 years" value={formData.durationWorkedTogether} onChange={e => updateField('durationWorkedTogether', e.target.value)} />
        <Input label={t('recommendation.skillsObserved')} required error={errors.skillsObserved} placeholder="e.g. Leadership, Problem-solving, Python" value={formData.skillsObserved} onChange={e => updateField('skillsObserved', e.target.value)} />
        <div className="grid grid-cols-2 gap-4">
          <Select label={t('recommendation.performanceLevel')} options={perfOptions} value={formData.performanceLevel} onChange={e => updateField('performanceLevel', e.target.value)} />
          <Select label={t('recommendation.language')} options={langOptions} value={formData.language} onChange={e => updateField('language', e.target.value)} />
        </div>
      </Card>

      {errors.api && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{errors.api}</div>
      )}

      <div className="flex flex-wrap gap-3">
        <Button onClick={onGenerate} loading={loading} icon={<SparklesIcon />}>
          {t('recommendation.generate')}
        </Button>
        <Button variant="secondary" onClick={onReset} icon={<ArrowPathIcon />}>
          {t('recommendation.reset')}
        </Button>
      </div>
    </div>
  );
}
