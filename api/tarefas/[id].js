import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import isEqual from 'lodash.isequal';

dotenv.config();

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === 'PUT') {
    try {
      const [results] = await db.query('SELECT id,nome,descricao,periodicidade,dataInicio,dataPrevisao,status,comentarios FROM tarefas WHERE id = ?', [id]);
      const tarefaExistente = results[0];

      if (!tarefaExistente) {
        return res.status(404).send('Tarefa não encontrada');
      }

      // Converter datas para ISO
      tarefaExistente.dataInicio = tarefaExistente.dataInicio.toISOString();
      tarefaExistente.dataPrevisao = tarefaExistente.dataPrevisao.toISOString();

      const novosDados = req.body;

      if (isEqual(novosDados, tarefaExistente)) {
        console.log("Dados iguais, não é necessário atualizar.");
        return res.status(304).send('Dados iguais, não é necessário atualizar.');
      }

      await db.query(
        'UPDATE tarefas SET nome = ?, descricao = ?, periodicidade = ?, dataInicio = ?, dataPrevisao = ?, comentarios = ? WHERE id = ?',
        [
          novosDados.nome,
          novosDados.descricao,
          novosDados.periodicidade,
          novosDados.dataInicio,
          novosDados.dataPrevisao,
          novosDados.comentarios,
          id
        ]
      );

      res.status(200).json({ id, ...novosDados });
    } catch (err) {
      console.error('Erro ao atualizar tarefa:', err);
      res.status(500).send('Erro ao atualizar tarefa');
    }
  } else if (req.method === 'DELETE') {
    try {
      await db.query('DELETE FROM tarefas WHERE id = ?', [id]);
      res.status(204).end();
    } catch (err) {
      console.error('Erro ao deletar tarefa:', err);
      res.status(500).send('Erro ao deletar tarefa');
    }
  } else if (req.method === 'PATCH') {
    try {
      const { status } = req.body;
      await db.query('UPDATE tarefas SET status = ? WHERE id = ?', [status, id]);
      res.status(204).end();
    } catch (err) {
      console.error('Erro ao atualizar status da tarefa:', err);
      res.status(500).send('Erro ao atualizar status da tarefa');
    }
  } else {
    res.status(405).send('Método não permitido');
  }
}
