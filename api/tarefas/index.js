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
      const [rows] = await db.query('SELECT * FROM tarefas');
      res.status(200).json(rows);
    } catch (err) {
      console.error('Erro ao buscar tarefas:', err);
      res.status(500).send('Erro ao buscar tarefas');
    }
  } else if (req.method === 'POST') {
    const { id, nome, descricao, periodicidade, dataInicio, dataPrevisao, status, comentarios } = req.body;
    try {
      const [result] = await db.query(
        'INSERT INTO tarefas (id, nome, descricao, periodicidade, dataInicio, dataPrevisao, status, comentarios) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [id, nome, descricao, periodicidade, dataInicio, dataPrevisao, status, comentarios]
      );
      res.status(201).json({ id: result.insertId, ...req.body });
    } catch (err) {
      console.error('Erro ao adicionar tarefa:', err);
      res.status(500).send('Erro ao adicionar tarefa');
    }
  } else {
    res.status(405).send('Método não permitido');
  }
}
