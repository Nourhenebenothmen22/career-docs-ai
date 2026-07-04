const { Router } = require('express');
const controller = require('../controllers/motivation.controller');
const { motivationValidation } = require('../utils/validators');
const { validate } = require('../middleware/errorHandler');

const optionalAuth = require('../middleware/optionalAuth.middleware');

const router = Router();

router.post('/generate', optionalAuth, motivationValidation, validate, controller.generate);
router.post('/download-pdf', optionalAuth, motivationValidation, validate, controller.downloadPdf);
router.post('/stream', optionalAuth, motivationValidation, validate, controller.generateStream);

module.exports = router;
