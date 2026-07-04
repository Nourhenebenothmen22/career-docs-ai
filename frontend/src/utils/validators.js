export function validateMotivation(formData, t) {
  const errs = {};
  const fields = ['fullName', 'email', 'phone', 'jobTitle', 'companyName', 'skills'];
  fields.forEach(f => {
    if (!formData[f]?.trim()) errs[f] = t('motivation.required');
  });
  if (formData.email?.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
    errs.email = t('motivation.invalidEmail');
  }
  return errs;
}

export function validateRecommendation(formData, t) {
  const errs = {};
  const fields = ['recommenderName', 'recommenderRole', 'candidateName', 'candidateRole',
    'relationshipToCandidate', 'companyName', 'durationWorkedTogether', 'skillsObserved'];
  fields.forEach(f => {
    if (!formData[f]?.trim()) errs[f] = t('recommendation.required');
  });
  return errs;
}

export function parseSkills(skills) {
  return skills.split(',').map(s => s.trim()).filter(Boolean);
}
