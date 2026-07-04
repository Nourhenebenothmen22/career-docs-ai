const { Router } = require('express');
const controller = require('../controllers/history.controller');
const { idParam, historyPagination } = require('../utils/validators');
const { validate } = require('../middleware/errorHandler');
const authMiddleware = require('../middleware/auth.middleware');

const router = Router();

// Apply authMiddleware to all routes in history router
router.use(authMiddleware);

router.get('/', historyPagination, validate, controller.getAll);
router.get('/:id', idParam, validate, controller.getById);
router.get('/:id/pdf', idParam, validate, controller.getPdf);
router.delete('/:id', idParam, validate, controller.delete);

module.exports = router;
