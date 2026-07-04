const { Router } = require('express');
const controller = require('../controllers/recommendation.controller');
const { recommendationValidation } = require('../utils/validators');
const { validate } = require('../middleware/errorHandler');

const authMiddleware = require('../middleware/auth.middleware');

const router = Router();

router.use(authMiddleware);

router.post('/generate', recommendationValidation, validate, controller.generate);
router.post('/download-pdf', recommendationValidation, validate, controller.downloadPdf);
router.post('/stream', recommendationValidation, validate, controller.generateStream);

module.exports = router;
