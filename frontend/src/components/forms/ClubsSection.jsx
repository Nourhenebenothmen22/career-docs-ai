import { useTranslation } from 'react-i18next';
import Input, { Select } from '../ui/Input';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';

export default function ClubsSection({ formData, updateField, clubErrors }) {
  const { t } = useTranslation();
  const clubs = formData.clubs || [];

  const roleOptions = [
    { value: '', label: t('motivation.rolePlaceholder') },
    { value: 'member', label: t('motivation.member') },
    { value: 'coordinator', label: t('motivation.coordinator') },
    { value: 'president', label: t('motivation.president') },
    { value: 'vicePresident', label: t('motivation.vicePresident') },
    { value: 'organizer', label: t('motivation.organizer') },
  ];

  const addClub = () => {
    updateField('clubs', [...clubs, { clubName: '', role: '', duration: '', responsibilities: '' }]);
  };

  const removeClub = (index) => {
    updateField('clubs', clubs.filter((_, i) => i !== index));
  };

  const updateClub = (index, field, value) => {
    const updated = clubs.map((c, i) => i === index ? { ...c, [field]: value } : c);
    updateField('clubs', updated);
  };

  return (
    <div className="rounded-card border bg-white p-6 shadow-card sm:p-8">
      <div className="mb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-button bg-primary-100">
            <span className="text-caption font-bold text-primary-600" aria-hidden="true">3</span>
          </div>
          <div>
            <h3 className="text-subheading text-gray-900">{t('motivation.clubsSection')}</h3>
            <p className="text-small text-gray-500">{t('motivation.clubsSectionDesc')}</p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {clubs.map((club, index) => (
          <div
            key={index}
            className="rounded-card border border-gray-200 bg-gray-50/50 p-4 transition-all duration-200 animate-fade-in-up"
          >
            <div className="mb-3 flex items-center justify-between">
              <span className="text-small font-semibold text-gray-700">
                {t('common.step')} {index + 1}
              </span>
              <button
                type="button"
                onClick={() => removeClub(index)}
                className="flex items-center gap-1.5 rounded-button px-3 py-1.5 text-small font-medium text-red-600 transition-colors hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                aria-label={`${t('motivation.removeClub')} ${index + 1}`}
              >
                <TrashIcon className="h-4 w-4" aria-hidden="true" />
                {t('motivation.removeClub')}
              </button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Input
                  label={t('motivation.clubName')}
                  required
                  error={clubErrors?.[index]?.clubName}
                  placeholder={t('motivation.clubNamePlaceholder')}
                  value={club.clubName}
                  onChange={e => updateClub(index, 'clubName', e.target.value)}
                />
                <Select
                  label={t('motivation.role')}
                  required
                  error={clubErrors?.[index]?.role}
                  options={roleOptions}
                  value={club.role}
                  onChange={e => updateClub(index, 'role', e.target.value)}
                />
              </div>
              <Input
                label={t('motivation.duration')}
                placeholder={t('motivation.durationPlaceholder')}
                value={club.duration}
                onChange={e => updateClub(index, 'duration', e.target.value)}
              />
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={addClub}
          className="flex w-full items-center justify-center gap-2 rounded-button border-2 border-dashed border-gray-300 px-4 py-3.5 text-caption font-medium text-gray-500 transition-all duration-200 hover:border-primary-400 hover:text-primary-600 hover:bg-primary-50/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
        >
          <PlusIcon className="h-5 w-5" aria-hidden="true" />
          {t('motivation.addClub')}
        </button>
      </div>
    </div>
  );
}
