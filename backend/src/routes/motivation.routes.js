const { Router } = require('express');
const controller = require('../controllers/motivation.controller');
const { motivationValidation } = require('../utils/validators');
const { validate } = require('../middleware/errorHandler');

const authMiddleware = require('../middleware/auth.middleware');

const router = Router();

router.use(authMiddleware);

router.post('/generate', motivationValidation, validate, controller.generate);
router.post('/download-pdf', motivationValidation, validate, controller.downloadPdf);
router.post('/stream', motivationValidation, validate, controller.generateStream);

module.exports = router;
