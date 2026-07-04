const { Router } = require('express');
const controller = require('../controllers/gdpr.controller');
const authMiddleware = require('../middleware/auth.middleware');

const router = Router();

router.use(authMiddleware);

router.get('/export', controller.exportData);
router.delete('/delete', controller.deleteAccount);

module.exports = router;
