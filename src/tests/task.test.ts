import request from 'supertest';
import express from 'express';
import {
  createTask,
  getTaskById,
  deleteTask,
  updateTask,
  getAllTasks,
} from '../controllers/task.controller';
import {
  createTaskValidation,
  validate,
} from '../middleware/task-validation.middleware';
import { tasks } from '../data-storage';

const app = express();
app.use(express.json());

app.post('/api/task', createTaskValidation, validate, createTask);
app.get('/api/task/:id', getTaskById);
app.delete('/api/task/:id', deleteTask);
app.put('/api/task/:id', updateTask);
app.get('/api/task', getAllTasks);

describe('Create Task Route', () => {
  it('should create a new task', async () => {
    const newTaskData = {
      title: 'Task Title',
      description: 'Task Description',
      dueDate: '2025-12-31',
      category: 'Test',
    };

    const response = await request(app).post('/api/task').send(newTaskData);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.title).toBe(newTaskData.title);
    expect(response.body.description).toBe(newTaskData.description);
    expect(response.body.dueDate).toBe(newTaskData.dueDate);
    expect(response.body.category).toBe(newTaskData.category);
    expect(response.body.status).toBe('Pending');
  });

  it('should return a 404 status for a non-existing assigned user', async () => {
    const newTaskData = {
      title: 'Task Title',
      description: 'Task Description',
      dueDate: '2023-12-31',
      category: 'Test',
      assignedTo: 'nonExistingUser',
    };

    const response = await request(app).post('/api/task').send(newTaskData);
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty(
      'message',
      'Assigned user does not exist'
    );
  });

  it('should return a 400 is dueDate is not in future', async () => {
    const newTaskData = {
      title: 'Task Title',
      description: 'Task Description',
      dueDate: '2020-12-31',
      category: 'Test',
      assignedTo: 'nonExistingUser',
    };

    const response = await request(app).post('/api/task').send(newTaskData);
    expect(response.status).toBe(400);
  });
});

describe('Get Task By ID Route', () => {
  it('should return a task when a valid ID is provided', async () => {
    const taskId = tasks[0].id;
    const response = await request(app).get(`/api/task/${taskId}`);
    expect(response.body).toHaveProperty('title');
    expect(response.body).toHaveProperty('status');
  });

  it('should return a 404 error when an invalid ID is provided', async () => {
    const taskId = 'invalidId';
    const response = await request(app).get(`/api/task/${taskId}`);
    expect(response.status).toBe(404);
    expect(response.body).toMatchObject({ message: 'Task not found' });
  });
});

describe('Delete Task By ID Route', () => {
  it('should delete a task when a valid ID is provided', async () => {
    await request(app).post('/api/task').send({
      title: 'Task Title',
      description: 'Task Description',
      dueDate: '2025-12-31',
      category: 'Test',
    });
    const taskId = tasks[0].id;
    const response = await request(app).delete(`/api/task/${taskId}`);
    expect(response.status).toBe(200);
  });

  it('should return a 404 error when an invalid ID is provided', async () => {
    const taskId = 'invalidId';
    const response = await request(app).delete(`/api/task/${taskId}`);
    expect(response.status).toBe(404);
    expect(response.body).toMatchObject({ message: 'Task not found' });
  });
});

describe('Update Task By ID Route', () => {
  it('should update a task when a valid ID is provided', async () => {
    await request(app).post('/api/task').send({
      title: 'Task Title',
      description: 'Task Description',
      dueDate: '2025-12-31',
      category: 'Test',
    });
    const taskId = tasks[0].id;
    const response = await request(app).put(`/api/task/${taskId}`).send({
      title: 'New task title',
    });
    expect(response.body.title).toBe('New task title');
  });

  it('should return a 404 error when an invalid ID is provided', async () => {
    const taskId = 'invalidId';
    const response = await request(app).put(`/api/task/${taskId}`);
    expect(response.status).toBe(404);
    expect(response.body).toMatchObject({ message: 'Task not found' });
  });

  it('should return a 404 when assigned user doesnt exist', async () => {
    await request(app).post('/api/task').send({
      title: 'Task Title',
      description: 'Task Description',
      dueDate: '2025-12-31',
      category: 'Test',
    });
    const taskId = tasks[0].id;
    const response = await request(app)
      .put(`/api/task/${taskId}`)
      .send({ assignedTo: 'invalidUser' });
    expect(response.status).toBe(404);
    expect(response.body).toMatchObject({
      message: 'Assigned user does not exist',
    });
  });
});

describe('Get all tasks Route', () => {
  it('should successfully return tasks', async () => {
    await request(app).post('/api/task').send({
      title: 'Task Title',
      description: 'Task Description',
      dueDate: '2025-12-31',
      category: 'Test',
    });
    await request(app).get('/api/task');
    const response = await request(app).get(`/api/task`).send();
    expect(response.body.totalTasks).toBeGreaterThan(0);
  });

  it('should filter by category', async () => {
    tasks.slice(0, tasks.length);
    await request(app).post('/api/task').send({
      title: 'Task Title',
      description: 'Task Description',
      dueDate: '2025-12-31',
      category: 'CAT-1',
    });
    await request(app).post('/api/task').send({
      title: 'Task Title',
      description: 'Task Description',
      dueDate: '2025-12-31',
      category: 'CAT-2',
    });
    const response = await request(app).get(`/api/task`).query({
      page: 1,
      limit: 10,
      category: 'CAT-1',
    });
    expect(response.body.totalTasks).toBe(1);
    expect(response.body.tasks[0].category).toBe('CAT-1');
  });
});
