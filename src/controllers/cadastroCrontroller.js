const pool = require('../config/db');

const colunasCadastro = [
  'ecc', 'esposa_nome', 'esposa_nome_completo', 'esposa_dt_nasc', 'esposa_profissao', 
  'esposa_email', 'esposa_celular', 'esposa_identidade', 'esposa_orgao', 'esposa_cpf', 
  'esposa_saude', 'esposa_medicamento', 'esposa_diabetico', 'esposa_vegetariano', 
  'esposa_problema_saude', 'esposa_religiao', 'esposo_nome', 'esposo_nome_completo', 
  'esposo_dt_nasc', 'esposo_profissao', 'esposo_email', 'esposo_celular', 
  'esposo_identidade', 'esposo_orgao', 'esposo_cpf', 'esposo_saude', 
  'esposo_medicamento', 'esposo_diabetico', 'esposo_vegetariano', 'esposo_problema_saude', 
  'esposo_religiao', 'endereco', 'bairro', 'cep', 'cidade', 'tel_residencial', 
  'dt_casamento', 'responsavel', 'padrinho', 'casal', 'ativo', 'separado', 'guara', 
  'esposo_falecido', 'esposa_falecida'
];

// Criar um novo cadastro
exports.createCadastro = async (req, res) => {
  try {
    const novoCadastro = {};
    const valores = [];

    colunasCadastro.forEach(coluna => {
      if (req.body[coluna] !== undefined) {
        novoCadastro[coluna] = req.body[coluna];
      } else {
        // Você pode definir valores padrão ou tratar campos obrigatórios aqui
        // Por exemplo, para booleanos, pode ser false (0) se não vier
        if (['esposa_diabetico', 'esposa_vegetariano', 'esposo_diabetico', 'esposo_vegetariano', 'ativo', 'separado', 'guara', 'esposo_falecido', 'esposa_falecida'].includes(coluna)) {
            novoCadastro[coluna] = req.body[coluna] === true || req.body[coluna] === 1 ? 1 : 0;
        } else {
            novoCadastro[coluna] = null; // Ou algum valor padrão
        }
      }
    });
    
    const colunasParaInserir = Object.keys(novoCadastro);
    const placeholders = colunasParaInserir.map(() => '?').join(', ');
    const valoresParaInserir = colunasParaInserir.map(col => novoCadastro[col]);

    const sql = `INSERT INTO cadastro (${colunasParaInserir.join(', ')}) VALUES (${placeholders})`;
    
    const [result] = await pool.query(sql, valoresParaInserir);
    res.status(201).json({ id: result.insertId, ...novoCadastro });
  } catch (error) {
    console.error('Erro ao criar cadastro:', error);
    res.status(500).json({ message: 'Erro interno do servidor', error: error.message });
  }
};

// Obter todos os cadastros
exports.getAllCadastros = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM cadastro');
    res.status(200).json(rows);
  } catch (error) {
    console.error('Erro ao buscar cadastros:', error);
    res.status(500).json({ message: 'Erro interno do servidor', error: error.message });
  }
};

// Obter um cadastro pelo ID
exports.getCadastroById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query('SELECT * FROM cadastro WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Cadastro não encontrado' });
    }
    res.status(200).json(rows[0]);
  } catch (error) {
    console.error('Erro ao buscar cadastro por ID:', error);
    res.status(500).json({ message: 'Erro interno do servidor', error: error.message });
  }
};

// Atualizar um cadastro
exports.updateCadastro = async (req, res) => {
  try {
    const { id } = req.params;
    const camposParaAtualizar = {};

    colunasCadastro.forEach(coluna => {
      if (req.body[coluna] !== undefined) {
        // Tratar booleanos explicitamente se necessário
        if (['esposa_diabetico', 'esposa_vegetariano', 'esposo_diabetico', 'esposo_vegetariano', 'ativo', 'separado', 'guara', 'esposo_falecido', 'esposa_falecida'].includes(coluna)) {
            camposParaAtualizar[coluna] = req.body[coluna] === true || req.body[coluna] === 1 ? 1 : 0;
        } else {
            camposParaAtualizar[coluna] = req.body[coluna];
        }
      }
    });

    if (Object.keys(camposParaAtualizar).length === 0) {
      return res.status(400).json({ message: 'Nenhum campo para atualizar fornecido.' });
    }

    const setClause = Object.keys(camposParaAtualizar)
      .map(key => `${key} = ?`)
      .join(', ');
    const valores = [...Object.values(camposParaAtualizar), id];

    const sql = `UPDATE cadastro SET ${setClause} WHERE id = ?`;
    
    const [result] = await pool.query(sql, valores);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Cadastro não encontrado para atualização' });
    }
    
    // Buscar o registro atualizado para retornar
    const [updatedRows] = await pool.query('SELECT * FROM cadastro WHERE id = ?', [id]);
    res.status(200).json(updatedRows[0]);

  } catch (error) {
    console.error('Erro ao atualizar cadastro:', error);
    res.status(500).json({ message: 'Erro interno do servidor', error: error.message });
  }
};

// Deletar um cadastro
exports.deleteCadastro = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query('DELETE FROM cadastro WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Cadastro não encontrado para exclusão' });
    }
    res.status(200).json({ message: 'Cadastro deletado com sucesso' }); // Ou 204 No Content
  } catch (error) {
    console.error('Erro ao deletar cadastro:', error);
    res.status(500).json({ message: 'Erro interno do servidor', error: error.message });
  }
};

// Helper para converter valores para o formato do banco (opcional, mas pode ser útil)
// Por exemplo, datas e booleanos. O driver mysql2 geralmente lida bem com isso.
// Para datas, envie no formato 'YYYY-MM-DD' ou 'YYYY-MM-DD HH:MM:SS' ou um objeto Date do JavaScript.
// Para booleanos, true/false ou 1/0.

/*
Exemplo de como você pode tratar os dados de entrada para o CREATE:

exports.createCadastro = async (req, res) => {
  try {
    const {
      ecc, esposa_nome, esposa_nome_completo, esposa_dt_nasc, esposa_profissao, 
      esposa_email, esposa_celular, esposa_identidade, esposa_orgao, esposa_cpf, 
      esposa_saude, esposa_medicamento, esposa_diabetico, esposa_vegetariano, 
      esposa_problema_saude, esposa_religiao, esposo_nome, esposo_nome_completo, 
      esposo_dt_nasc, esposo_profissao, esposo_email, esposo_celular, 
      esposo_identidade, esposo_orgao, esposo_cpf, esposo_saude, 
      esposo_medicamento, esposo_diabetico, esposo_vegetariano, esposo_problema_saude, 
      esposo_religiao, endereco, bairro, cep, cidade, tel_residencial, 
      dt_casamento, responsavel, padrinho, casal, ativo, separado, guara, 
      esposo_falecido, esposa_falecida
    } = req.body;

    // Validação básica (exemplo, adicione mais conforme necessário)
    if (!esposa_nome || !esposo_nome) {
      return res.status(400).json({ message: 'Nome da esposa e esposo são obrigatórios.' });
    }

    const dadosCadastro = [
      ecc, esposa_nome, esposa_nome_completo, esposa_dt_nasc, esposa_profissao, 
      esposa_email, esposa_celular, esposa_identidade, esposa_orgao, esposa_cpf, 
      esposa_saude, esposa_medicamento, esposa_diabetico ? 1:0, esposa_vegetariano ? 1:0, 
      esposa_problema_saude, esposa_religiao, esposo_nome, esposo_nome_completo, 
      esposo_dt_nasc, esposo_profissao, esposo_email, esposo_celular, 
      esposo_identidade, esposo_orgao, esposo_cpf, esposo_saude, 
      esposo_medicamento, esposo_diabetico ? 1:0, esposo_vegetariano ? 1:0, esposo_problema_saude, 
      esposo_religiao, endereco, bairro, cep, cidade, tel_residencial, 
      dt_casamento, responsavel, padrinho, casal, ativo ? 1:0, separado ? 1:0, guara ? 1:0, 
      esposo_falecido ? 1:0, esposa_falecida ? 1:0
    ];

    const colunasString = colunasCadastro.join(', ');
    const placeholders = colunasCadastro.map(() => '?').join(', ');

    const sql = `INSERT INTO cadastro (${colunasString}) VALUES (${placeholders})`;
    
    const [result] = await pool.query(sql, dadosCadastro);
    res.status(201).json({ id: result.insertId, ...req.body });

  } catch (error) {
    console.error('Erro ao criar cadastro:', error);
    res.status(500).json({ message: 'Erro interno do servidor', error: error.message });
  }
};
*/