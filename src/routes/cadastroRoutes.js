const express = require('express');
const router = express.Router();
const cadastroController = require('../controllers/cadastroCrontroller.js');

// Rota para criar um novo cadastro (POST)
router.post('/cadastro', cadastroController.createCadastro);

// Rota para obter todos os cadastros (GET)
router.get('/cadastro', cadastroController.getAllCadastros);

// Rota para obter um cadastro específico pelo ID (GET)
router.get('/cadastro/:id', cadastroController.getCadastroById);

// Rota para atualizar um cadastro pelo ID (PUT)
router.put('/cadastro/:id', cadastroController.updateCadastro);

// Rota para deletar um cadastro pelo ID (DELETE)
router.delete('/cadastro/:id', cadastroController.deleteCadastro);

module.exports = router;