const { body, param, query } = require('express-validator');
const { EXPERIENCE_LEVELS, PERFORMANCE_LEVELS, LANGUAGES } = require('./constants');

const motivationValidation = [
  body('fullName').trim().notEmpty().withMessage('Full name is required'),
  body('email').trim().isEmail().withMessage('Valid email is required'),
  body('phone').trim().notEmpty().withMessage('Phone number is required'),
  body('jobTitle').trim().notEmpty().withMessage('Job title is required'),
  body('companyName').trim().notEmpty().withMessage('Company name is required'),
  body('skills').isArray({ min: 1 }).withMessage('At least one skill is required'),
  body('skills.*').trim().notEmpty().withMessage('Each skill must not be empty'),
  body('experienceLevel').isIn(EXPERIENCE_LEVELS).withMessage(`Experience level must be ${EXPERIENCE_LEVELS.join(', ')}`),
  body('language').isIn(LANGUAGES).withMessage(`Language must be ${LANGUAGES.join(' or ')}`),
  body('clubs').optional().isArray(),
  body('clubs.*.clubName').optional({ values: 'falsy' }).trim().notEmpty(),
  body('clubs.*.role').optional({ values: 'falsy' }).isIn(['member', 'coordinator', 'president', 'vicePresident', 'organizer']),
  body('clubs.*.duration').optional().trim(),
  body('clubs.*.responsibilities').optional().trim(),
  body('id').optional().isMongoId().withMessage('Invalid document ID'),
];

const recommendationValidation = [
  body('recommenderName').trim().notEmpty().withMessage('Recommender name is required'),
  body('recommenderRole').trim().notEmpty().withMessage('Recommender role is required'),
  body('candidateName').trim().notEmpty().withMessage('Candidate name is required'),
  body('candidateRole').trim().notEmpty().withMessage('Candidate role is required'),
  body('relationshipToCandidate').trim().notEmpty().withMessage('Relationship is required'),
  body('companyName').trim().notEmpty().withMessage('Company name is required'),
  body('durationWorkedTogether').trim().notEmpty().withMessage('Duration is required'),
  body('skillsObserved').optional().isArray(),
  body('skillsObserved.*').optional().trim(),

  // New Collaboration Context fields
  body('projectName').optional().trim(),
  body('projectType').optional().trim(),
  body('teamSize').optional().trim(),
  body('workMode').optional().trim(),
  
  // Key achievements & soft skills
  body('keyAchievements').optional().trim(),
  body('communicationEvidence').optional().trim(),
  body('problemSolvingEvidence').optional().trim(),
  body('ownershipEvidence').optional().trim(),
  body('language').optional().trim(),
  body('id').optional().isMongoId().withMessage('Invalid document ID'),
];

const historyPagination = [
  query('page').optional().isInt({ min: 1 }).toInt().withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).toInt().withMessage('Limit must be between 1 and 100'),
];

const idParam = [
  param('id').isMongoId().withMessage('Invalid document ID'),
];

module.exports = { motivationValidation, recommendationValidation, historyPagination, idParam };
