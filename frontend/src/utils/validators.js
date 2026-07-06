const PROHIBITED_PATTERNS = [
  /ignore\s+(all\s+)?previous/i,
  /\[INST\]/i,
  /\[\/INST\]/i,
  /<\/?s>/i,
  /system\s*:/i,
  /you\s+are\s+now/i,
  /forget\s+(everything|all)/i,
  /new\s+instructions/i
];

function checkPromptInjection(formData, errs, fieldsToCheck, t) {
  fieldsToCheck.forEach(f => {
    const val = formData[f];
    if (typeof val === 'string') {
      for (const pattern of PROHIBITED_PATTERNS) {
        if (pattern.test(val)) {
          errs[f] = t('common.prohibitedPattern') || 'Input contains prohibited prompt injection patterns';
          break;
        }
      }
    }
  });
}

export function validateMotivation(formData, t) {
  const errs = {};
  const fields = ['fullName', 'email', 'phone', 'jobTitle', 'companyName', 'skills'];
  fields.forEach(f => {
    if (!formData[f]?.trim()) errs[f] = t('motivation.required') || 'Required field';
  });
  if (formData.email?.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
    errs.email = t('motivation.invalidEmail') || 'Invalid email';
  }
  
  checkPromptInjection(formData, errs, ['fullName', 'jobTitle', 'companyName', 'skills'], t);
  return errs;
}

export function validateRecommendation(formData, t) {
  const errs = {};
  const fields = [
    'recommenderName', 'recommenderRole', 'candidateName', 'candidateRole',
    'relationshipToCandidate', 'companyName', 'durationWorkedTogether'
  ];
  fields.forEach(f => {
    if (!formData[f]?.trim()) errs[f] = t('recommendation.required') || 'Required field';
  });

  const injectionCheckFields = [
    'recommenderName', 'recommenderRole', 'candidateName', 'candidateRole',
    'relationshipToCandidate', 'companyName', 'durationWorkedTogether',
    'skillsObserved', 'projectName', 'projectType', 'teamSize', 'workMode',
    'keyAchievements', 'communicationEvidence', 'problemSolvingEvidence', 'ownershipEvidence'
  ];
  checkPromptInjection(formData, errs, injectionCheckFields, t);

  return errs;
}

export function parseSkills(skills) {
  if (typeof skills !== 'string') return [];
  return skills.split(/[,\n;]+/).map(s => s.trim()).filter(Boolean);
}
