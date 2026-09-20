const express = require('express');

const app = express();

app.locals.tasks = [];
app.locals.nextId = 1;

app.use(express.json());

app.get('/tasks', (req, res) => {
  res.json(app.locals.tasks);
});

app.post('/tasks', (req, res) => {
  const { title } = req.body || {};

  if (!title || typeof title !== 'string' || title.trim() === '') {
    return res.status(400).json({ error: 'Title is required' });
  }

  const newTask = {
    id: app.locals.nextId++,
    title: title.trim(),
    completed: false,
  };

  app.locals.tasks.push(newTask);
  return res.status(201).json(newTask);
});

app.delete('/tasks/:id', (req, res) => {
  const taskId = Number(req.params.id);
  const taskIndex = app.locals.tasks.findIndex((task) => task.id === taskId);

  if (taskIndex === -1) {
    return res.status(404).json({ error: 'Task not found' });
  }

  const [deletedTask] = app.locals.tasks.splice(taskIndex, 1);
  return res.status(200).json({ message: 'Task deleted', task: deletedTask });
});

module.exports = app;
