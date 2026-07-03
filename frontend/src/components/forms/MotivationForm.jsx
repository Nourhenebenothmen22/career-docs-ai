import { useTranslation } from 'react-i18next';
import Input, { Select } from '../ui/Input';
import Button from '../ui/Button';
import { SparklesIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import ClubsSection from './ClubsSection';

export default function MotivationForm({ formData, updateField, errors, clubErrors, onGenerate, onReset, loading }) {
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
    <div className="space-y-8">
      {/* Personal Information */}
      <div className="rounded-card border bg-white p-6 shadow-card sm:p-8">
        <div className="mb-6">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-button bg-primary-100">
              <span className="text-caption font-bold text-primary-600" aria-hidden="true">1</span>
            </div>
            <div>
              <h3 className="text-subheading text-gray-900">{t('motivation.personalInfo')}</h3>
              <p className="text-small text-gray-500">{t('motivation.personalInfoDesc')}</p>
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <Input
            label={t('motivation.fullName')}
            required
            error={errors.fullName}
            placeholder={t('motivation.fullNamePlaceholder')}
            value={formData.fullName}
            onChange={e => updateField('fullName', e.target.value)}
          />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              label={t('motivation.email')}
              type="email"
              required
              error={errors.email}
              placeholder={t('motivation.emailPlaceholder')}
              value={formData.email}
              onChange={e => updateField('email', e.target.value)}
            />
            <Input
              label={t('motivation.phone')}
              required
              error={errors.phone}
              placeholder={t('motivation.phonePlaceholder')}
              value={formData.phone}
              onChange={e => updateField('phone', e.target.value)}
            />
          </div>
          <Input
            label={t('motivation.linkedin')}
            placeholder={t('motivation.linkedinPlaceholder')}
            value={formData.linkedin}
            onChange={e => updateField('linkedin', e.target.value)}
          />
        </div>
      </div>

      {/* Job Details */}
      <div className="rounded-card border bg-white p-6 shadow-card sm:p-8">
        <div className="mb-6">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-button bg-primary-100">
              <span className="text-caption font-bold text-primary-600" aria-hidden="true">2</span>
            </div>
            <div>
              <h3 className="text-subheading text-gray-900">{t('motivation.jobDetails')}</h3>
              <p className="text-small text-gray-500">{t('motivation.jobDetailsDesc')}</p>
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              label={t('motivation.jobTitle')}
              required
              error={errors.jobTitle}
              placeholder={t('motivation.jobTitlePlaceholder')}
              value={formData.jobTitle}
              onChange={e => updateField('jobTitle', e.target.value)}
            />
            <Input
              label={t('motivation.companyName')}
              required
              error={errors.companyName}
              placeholder={t('motivation.companyNamePlaceholder')}
              value={formData.companyName}
              onChange={e => updateField('companyName', e.target.value)}
            />
          </div>
          <Input
            label={t('motivation.skills')}
            required
            error={errors.skills}
            placeholder={t('motivation.skillsPlaceholder')}
            value={formData.skills}
            onChange={e => updateField('skills', e.target.value)}
          />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Select label={t('motivation.experienceLevel')} options={expLevelOptions} value={formData.experienceLevel} onChange={e => updateField('experienceLevel', e.target.value)} />
            <Select label={t('motivation.language')} options={langOptions} value={formData.language} onChange={e => updateField('language', e.target.value)} />
          </div>
        </div>
      </div>

      {/* Clubs, Leadership & Organizations */}
      <ClubsSection formData={formData} updateField={updateField} clubErrors={clubErrors} />

      {/* API Error */}
      {errors.api && (
        <div className="rounded-card border border-red-200 bg-red-50 px-5 py-3.5 text-caption text-red-700" role="alert">
          {errors.api}
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-wrap gap-3">
        <Button onClick={onGenerate} loading={loading} icon={<SparklesIcon />} size="lg">
          {t('motivation.generate')}
        </Button>
        <Button variant="secondary" onClick={onReset} icon={<ArrowPathIcon />} size="lg">
          {t('motivation.reset')}
        </Button>
      </div>
    </div>
  );
}
