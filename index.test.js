const request = require('supertest');
const app = require('./index');

describe('Task API', () => {
  beforeEach(() => {
    app.locals.tasks = [];
    app.locals.nextId = 1;
  });

  test('GET /tasks returns an empty array initially', async () => {
    const response = await request(app).get('/tasks');

    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  test('POST /tasks successfully creates a task and returns status 201', async () => {
    const response = await request(app)
      .post('/tasks')
      .send({ title: 'Write tests' });

    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      id: 1,
      title: 'Write tests',
      completed: false,
    });
  });

  test('POST /tasks returns 400 when title is missing', async () => {
    const response = await request(app)
      .post('/tasks')
      .send({});

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
  });

  test('DELETE /tasks/:id successfully deletes an existing task', async () => {
    const createResponse = await request(app)
      .post('/tasks')
      .send({ title: 'Delete me' });

    const taskId = createResponse.body.id;

    const deleteResponse = await request(app).delete(`/tasks/${taskId}`);

    expect(deleteResponse.status).toBe(200);
    expect(deleteResponse.body).toHaveProperty('message', 'Task deleted');
    expect(deleteResponse.body.task).toMatchObject({
      id: taskId,
      title: 'Delete me',
      completed: false,
    });
  });

  test('DELETE /tasks/:id returns 404 for a non-existent task', async () => {
    const response = await request(app).delete('/tasks/999');

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('error', 'Task not found');
  });
});
