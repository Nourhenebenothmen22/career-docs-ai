import { useTranslation } from 'react-i18next';
import Input, { Select } from '../ui/Input';
import Button from '../ui/Button';
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
    <div className="space-y-8">
      {/* Recommender Information */}
      <div className="rounded-card border bg-white p-6 shadow-card sm:p-8">
        <div className="mb-6">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-button bg-primary-100">
              <span className="text-caption font-bold text-primary-600" aria-hidden="true">1</span>
            </div>
            <div>
              <h3 className="text-subheading text-gray-900">{t('recommendation.recommenderInfo')}</h3>
              <p className="text-small text-gray-500">{t('recommendation.recommenderInfoDesc')}</p>
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              label={t('recommendation.recommenderName')}
              required
              error={errors.recommenderName}
              placeholder={t('recommendation.recommenderNamePlaceholder')}
              value={formData.recommenderName}
              onChange={e => updateField('recommenderName', e.target.value)}
            />
            <Input
              label={t('recommendation.recommenderRole')}
              required
              error={errors.recommenderRole}
              placeholder={t('recommendation.recommenderRolePlaceholder')}
              value={formData.recommenderRole}
              onChange={e => updateField('recommenderRole', e.target.value)}
            />
          </div>
          <Input
            label={t('recommendation.companyName')}
            required
            error={errors.companyName}
            placeholder={t('recommendation.companyNamePlaceholder')}
            value={formData.companyName}
            onChange={e => updateField('companyName', e.target.value)}
          />
        </div>
      </div>

      {/* Candidate Information */}
      <div className="rounded-card border bg-white p-6 shadow-card sm:p-8">
        <div className="mb-6">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-button bg-primary-100">
              <span className="text-caption font-bold text-primary-600" aria-hidden="true">2</span>
            </div>
            <div>
              <h3 className="text-subheading text-gray-900">{t('recommendation.candidateInfo')}</h3>
              <p className="text-small text-gray-500">{t('recommendation.candidateInfoDesc')}</p>
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              label={t('recommendation.candidateName')}
              required
              error={errors.candidateName}
              placeholder={t('recommendation.candidateNamePlaceholder')}
              value={formData.candidateName}
              onChange={e => updateField('candidateName', e.target.value)}
            />
            <Input
              label={t('recommendation.candidateRole')}
              required
              error={errors.candidateRole}
              placeholder={t('recommendation.candidateRolePlaceholder')}
              value={formData.candidateRole}
              onChange={e => updateField('candidateRole', e.target.value)}
            />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              label={t('recommendation.relationship')}
              required
              error={errors.relationshipToCandidate}
              placeholder={t('recommendation.relationshipPlaceholder')}
              value={formData.relationshipToCandidate}
              onChange={e => updateField('relationshipToCandidate', e.target.value)}
            />
            <Input
              label={t('recommendation.duration')}
              required
              error={errors.durationWorkedTogether}
              placeholder={t('recommendation.durationPlaceholder')}
              value={formData.durationWorkedTogether}
              onChange={e => updateField('durationWorkedTogether', e.target.value)}
            />
          </div>
          <Input
            label={t('recommendation.skillsObserved')}
            required
            error={errors.skillsObserved}
            placeholder={t('recommendation.skillsObservedPlaceholder')}
            value={formData.skillsObserved}
            onChange={e => updateField('skillsObserved', e.target.value)}
          />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Select label={t('recommendation.performanceLevel')} options={perfOptions} value={formData.performanceLevel} onChange={e => updateField('performanceLevel', e.target.value)} />
            <Select label={t('recommendation.language')} options={langOptions} value={formData.language} onChange={e => updateField('language', e.target.value)} />
          </div>
        </div>
      </div>

      {/* API Error */}
      {errors.api && (
        <div className="rounded-card border border-red-200 bg-red-50 px-5 py-3.5 text-caption text-red-700" role="alert">
          {errors.api}
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-wrap gap-3">
        <Button onClick={onGenerate} loading={loading} icon={<SparklesIcon />} size="lg">
          {t('recommendation.generate')}
        </Button>
        <Button variant="secondary" onClick={onReset} icon={<ArrowPathIcon />} size="lg">
          {t('recommendation.reset')}
        </Button>
      </div>
    </div>
  );
}
