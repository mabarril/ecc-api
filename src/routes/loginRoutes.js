const express = require('express');
const router = express.Router();
const loginController = require('../controllers/loginController.js');

// Rota para criar um novo cadastro (POST)
router.post('/login', loginController.login);
router.post('/logout', loginController.logout);

module.exports = router;