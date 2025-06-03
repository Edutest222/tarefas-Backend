import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const [rows] = await db.query('SELECT * FROM observacoes');
      res.status(200).json(rows);
    } catch (err) {
      console.error('Erro ao buscar notas:', err);
      res.status(500).send('Erro ao buscar notas');
    }
  } else if (req.method === 'POST') {
    const { texto } = req.body;
    try {
      const [result] = await db.query(
        'INSERT INTO observacoes (texto) VALUES (?)',
        [texto]
      );
      res.status(201).json({ id: result.insertId, texto });
    } catch (err) {
      console.error('Erro ao adicionar nota:', err);
      res.status(500).send('Erro ao adicionar nota');
    }
  } else {
    res.status(405).send('Método não permitido');
  }
}
