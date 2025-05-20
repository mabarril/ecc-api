const jwt = require('jsonwebtoken');
require("dotenv-safe").config();


exports.login = async (req, res) => {
    //esse teste abaixo deve ser feito no seu banco de dados
    if(req.body.user === 'marcelo' && req.body.password === '123'){
      console.log('Login OK');
      const id = 1; //esse id viria do banco de dados
      const token = jwt.sign({ id }, process.env.SECRET, {
        expiresIn: 300 // expires in 5min
      });
      return res.json({ auth: true, token: token });
    }
    
    res.status(500).json({message: 'Login inválido!'});
}

 
exports.logout = async function(req, res) {
    res.json({ auth: false, token: null });
}