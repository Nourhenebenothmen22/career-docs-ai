import { useTranslation } from 'react-i18next';
import Input, { Textarea } from '../ui/Input';
import Button from '../ui/Button';
import { SparklesIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

export default function RecommendationForm({ formData, updateField, errors, onGenerate, onReset, loading }) {
  const { t } = useTranslation();

  return (
    <div className="space-y-8">
      {/* 1. Recommender Information */}
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

      {/* 2. Candidate Information */}
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
        </div>
      </div>

      {/* 3. Collaboration Context */}
      <div className="rounded-card border bg-white p-6 shadow-card sm:p-8">
        <div className="mb-6">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-button bg-primary-100">
              <span className="text-caption font-bold text-primary-600" aria-hidden="true">3</span>
            </div>
            <div>
              <h3 className="text-subheading text-gray-900">{t('recommendation.collaborationContext') || 'Relation avec le Candidat'}</h3>
              <p className="text-small text-gray-500">{t('recommendation.collaborationContextDesc') || 'Describe the project details and team size'}</p>
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              label={t('recommendation.projectName') || 'Project Name'}
              error={errors.projectName}
              placeholder="e.g. Enterprise E-Commerce Redesign"
              value={formData.projectName || ''}
              onChange={e => updateField('projectName', e.target.value)}
            />
            <Input
              label={t('recommendation.projectType') || 'Project Type'}
              error={errors.projectType}
              placeholder="e.g. SaaS Portal / Web Application / REST API"
              value={formData.projectType || ''}
              onChange={e => updateField('projectType', e.target.value)}
            />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              label={t('recommendation.teamSize') || 'Team Size'}
              error={errors.teamSize}
              placeholder="e.g. 5 developers"
              value={formData.teamSize || ''}
              onChange={e => updateField('teamSize', e.target.value)}
            />
            <Input
              label={t('recommendation.workMode') || 'Work Mode'}
              error={errors.workMode}
              placeholder="e.g. Remote, Collaborative co-developer"
              value={formData.workMode || ''}
              onChange={e => updateField('workMode', e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* 4. Skills & Key Achievements */}
      <div className="rounded-card border bg-white p-6 shadow-card sm:p-8">
        <div className="mb-6">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-button bg-primary-100">
              <span className="text-caption font-bold text-primary-600" aria-hidden="true">4</span>
            </div>
            <div>
              <h3 className="text-subheading text-gray-900">{t('recommendation.skillsAndAchievements') || 'Compétences Observées'}</h3>
              <p className="text-small text-gray-500">{t('recommendation.skillsAndAchievementsDesc') || 'List academic/professional skills and major achievements'}</p>
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <Input
            label={t('recommendation.skillsObserved') || 'Observed Skills'}
            error={errors.skillsObserved}
            placeholder={t('recommendation.skillsObservedPlaceholder') || 'e.g. Leadership, Problem-solving, Python'}
            value={formData.skillsObserved || ''}
            onChange={e => updateField('skillsObserved', e.target.value)}
          />
          <Textarea
            label={t('recommendation.keyAchievements') || 'Key Achievements'}
            error={errors.keyAchievements}
            placeholder="e.g. Led payment gateway integration and dashboard charting modules..."
            value={formData.keyAchievements || ''}
            onChange={e => updateField('keyAchievements', e.target.value)}
          />
        </div>
      </div>

      {/* 5. Evidence-Based Soft Skills */}
      <div className="rounded-card border bg-white p-6 shadow-card sm:p-8">
        <div className="mb-6">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-button bg-primary-100">
              <span className="text-caption font-bold text-primary-600" aria-hidden="true">5</span>
            </div>
            <div>
              <h3 className="text-subheading text-gray-900">{t('recommendation.softSkills') || 'Soft Skills'}</h3>
              <p className="text-small text-gray-500">{t('recommendation.softSkillsDesc') || 'State concrete examples demonstrating leadership or collaboration'}</p>
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <Textarea
            label={t('recommendation.communicationEvidence') || 'Communication Evidence'}
            error={errors.communicationEvidence}
            placeholder="e.g. Created thorough API wiki in Swagger and mentored two junior developers..."
            value={formData.communicationEvidence || ''}
            onChange={e => updateField('communicationEvidence', e.target.value)}
          />
          <Textarea
            label={t('recommendation.problemSolvingEvidence') || 'Problem Solving Evidence'}
            error={errors.problemSolvingEvidence}
            placeholder="e.g. Restructured data indices independently during production downtime..."
            value={formData.problemSolvingEvidence || ''}
            onChange={e => updateField('problemSolvingEvidence', e.target.value)}
          />
          <Textarea
            label={t('recommendation.ownershipEvidence') || 'Ownership Evidence'}
            error={errors.ownershipEvidence}
            placeholder="e.g. Acted as primary owner for CI/CD workflow automation..."
            value={formData.ownershipEvidence || ''}
            onChange={e => updateField('ownershipEvidence', e.target.value)}
          />
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
