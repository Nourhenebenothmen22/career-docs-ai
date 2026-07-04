const { Router } = require('express');
const controller = require('../controllers/auth.controller');

const router = Router();

router.post('/register', controller.register);
router.post('/login', controller.login);
router.post('/refresh', controller.refresh);
router.post('/logout', controller.logout);
router.post('/oauth', controller.oauthLogin);

module.exports = router;
