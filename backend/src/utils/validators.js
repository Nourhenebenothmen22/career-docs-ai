const { body, param, query } = require('express-validator');

const motivationValidation = [
  body('fullName').trim().notEmpty().withMessage('Full name is required'),
  body('email').trim().isEmail().withMessage('Valid email is required'),
  body('phone').trim().notEmpty().withMessage('Phone number is required'),
  body('jobTitle').trim().notEmpty().withMessage('Job title is required'),
  body('companyName').trim().notEmpty().withMessage('Company name is required'),
  body('skills').isArray({ min: 1 }).withMessage('At least one skill is required'),
  body('skills.*').trim().notEmpty().withMessage('Skills must not be empty'),
  body('experienceLevel').isIn(['junior', 'mid', 'senior']).withMessage('Experience level must be junior, mid, or senior'),
  body('language').isIn(['FR', 'EN']).withMessage('Language must be FR or EN'),
];

const recommendationValidation = [
  body('recommenderName').trim().notEmpty().withMessage('Recommender name is required'),
  body('recommenderRole').trim().notEmpty().withMessage('Recommender role is required'),
  body('candidateName').trim().notEmpty().withMessage('Candidate name is required'),
  body('candidateRole').trim().notEmpty().withMessage('Candidate role is required'),
  body('relationshipToCandidate').trim().notEmpty().withMessage('Relationship to candidate is required'),
  body('companyName').trim().notEmpty().withMessage('Company name is required'),
  body('durationWorkedTogether').trim().notEmpty().withMessage('Duration worked together is required'),
  body('skillsObserved').isArray({ min: 1 }).withMessage('At least one observed skill is required'),
  body('skillsObserved.*').trim().notEmpty().withMessage('Skills must not be empty'),
  body('performanceLevel').isIn(['excellent', 'very good', 'good']).withMessage('Performance level must be excellent, very good, or good'),
  body('language').optional().isIn(['FR', 'EN']).withMessage('Language must be FR or EN'),
];

const idParam = [
  param('id').isMongoId().withMessage('Invalid document ID'),
];

module.exports = { motivationValidation, recommendationValidation, idParam };
