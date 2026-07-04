const { Router } = require('express');
const controller = require('../controllers/recommendation.controller');
const { recommendationValidation } = require('../utils/validators');
const { validate } = require('../middleware/errorHandler');

const optionalAuth = require('../middleware/optionalAuth.middleware');

const router = Router();

router.post('/generate', optionalAuth, recommendationValidation, validate, controller.generate);
router.post('/download-pdf', optionalAuth, recommendationValidation, validate, controller.downloadPdf);
router.post('/stream', optionalAuth, recommendationValidation, validate, controller.generateStream);

module.exports = router;
