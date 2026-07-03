const { Router } = require('express');
const controller = require('../controllers/history.controller');
const { idParam } = require('../utils/validators');

const router = Router();

router.get('/', controller.getAll);
router.get('/:id', idParam, controller.getById);
router.get('/:id/pdf', idParam, controller.getPdf);
router.delete('/:id', idParam, controller.delete);

module.exports = router;
