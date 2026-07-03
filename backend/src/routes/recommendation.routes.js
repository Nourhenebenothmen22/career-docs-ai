const { Router } = require('express');
const controller = require('../controllers/recommendation.controller');
const { recommendationValidation } = require('../utils/validators');
const { validate } = require('../middleware/errorHandler');

const router = Router();

router.post('/generate', recommendationValidation, validate, controller.generate);
router.post('/download-pdf', recommendationValidation, validate, controller.downloadPdf);

module.exports = router;
