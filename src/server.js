const app = require('./app');
require("dotenv-safe").config();
const jwt = require('jsonwebtoken');
// A porta é lida do .env, com um fallback para 3000
const PORT = process.env.API_PORT || 21187;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log(`Acesse em http://localhost:${PORT}`);
});
