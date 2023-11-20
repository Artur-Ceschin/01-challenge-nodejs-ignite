import { Database } from "../database.js";

const database = new Database()

export function getTaskById(req, res, next) {
  const { id } = req.params;
  const task = database.getTaskById('tasks', id);

  if (!task) {
    return res.writeHead(404).end(JSON.stringify({ message: 'Task not found' }));
  }

  next();
}
