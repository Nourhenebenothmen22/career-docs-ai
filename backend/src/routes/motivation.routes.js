const { Router } = require('express');
const controller = require('../controllers/motivation.controller');
const { motivationValidation } = require('../utils/validators');
const { validate } = require('../middleware/errorHandler');

const router = Router();

router.post('/generate', motivationValidation, validate, controller.generate);
router.post('/download-pdf', motivationValidation, validate, controller.downloadPdf);

module.exports = router;
