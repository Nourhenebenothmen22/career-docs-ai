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
];

const recommendationValidation = [
  body('recommenderName').trim().notEmpty().withMessage('Recommender name is required'),
  body('recommenderRole').trim().notEmpty().withMessage('Recommender role is required'),
  body('candidateName').trim().notEmpty().withMessage('Candidate name is required'),
  body('candidateRole').trim().notEmpty().withMessage('Candidate role is required'),
  body('relationshipToCandidate').trim().notEmpty().withMessage('Relationship is required'),
  body('companyName').trim().notEmpty().withMessage('Company name is required'),
  body('durationWorkedTogether').trim().notEmpty().withMessage('Duration is required'),
  body('skillsObserved').isArray({ min: 1 }).withMessage('At least one skill is required'),
  body('skillsObserved.*').trim().notEmpty().withMessage('Each skill must not be empty'),
  body('performanceLevel').isIn(PERFORMANCE_LEVELS).withMessage(`Performance level must be ${PERFORMANCE_LEVELS.join(', ')}`),
  body('language').optional().isIn(LANGUAGES).withMessage(`Language must be ${LANGUAGES.join(' or ')}`),
];

const historyPagination = [
  query('page').optional().isInt({ min: 1 }).toInt().withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).toInt().withMessage('Limit must be between 1 and 100'),
];

const idParam = [
  param('id').isMongoId().withMessage('Invalid document ID'),
];

module.exports = { motivationValidation, recommendationValidation, historyPagination, idParam };
