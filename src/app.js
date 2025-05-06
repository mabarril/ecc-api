const express = require('express');
const dotenv = require('dotenv');
const cadastroRoutes = require('./routes/cadastroRoutes');

// Carrega variáveis de ambiente do arquivo .env
dotenv.config({ path: require('path').resolve(__dirname, '../.env') });

const app = express();

// Middleware para parsear JSON no corpo das requisições
app.use(express.json());

// Middleware para parsear dados de formulários URL-encoded
app.use(express.urlencoded({ extended: true }));

// Rotas da API
app.use('/api', cadastroRoutes); // Prefixo /api para todas as rotas de cadastro

app.get('/', (req, res) => res.send('API Cadastro Rodando!'));

module.exports = app;