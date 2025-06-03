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
  const { id } = req.query;

  if (req.method === 'DELETE') {
    try {
      await db.query('DELETE FROM observacoes WHERE id = ?', [id]);
      res.status(204).end();
    } catch (err) {
      console.error('Erro ao deletar nota:', err);
      res.status(500).send('Erro ao deletar nota');
    }
  } else {
    res.status(405).send('Método não permitido');
  }
}
