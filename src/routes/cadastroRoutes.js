const express = require('express');
const router = express.Router();
const cadastroController = require('../controllers/cadastroCrontroller.js');
const verifyJWT = require('../config/util.js');

// Rota para criar um novo cadastro (POST)
router.post('/cadastro', verifyJWT, cadastroController.createCadastro);

// Rota para obter todos os cadastros (GET)
router.get('/cadastro', verifyJWT, cadastroController.getAllCadastros);

// Rota para obter um cadastro específico pelo ID (GET)
router.get('/cadastro/:id', verifyJWT, cadastroController.getCadastroById);

// Rota para atualizar um cadastro pelo ID (PUT)
router.put('/cadastro/:id', verifyJWT, cadastroController.updateCadastro);

// Rota para deletar um cadastro pelo ID (DELETE)
router.delete('/cadastro/:id', verifyJWT, cadastroController.deleteCadastro);

module.exports = router;