import { Request, Response } from 'express';
import { uuid } from 'uuidv4';
import Task from '../models/task.model';
import { tasks, users } from '../data-storage';

const validateToAssign = (res: Response, username: string) => {
  const existingUser = users.find((user) => user.username === username);
  if (!existingUser) {
    return res.status(404).json({ message: 'Assigned user does not exist' });
  }
};

export const createTask = (req: Request, res: Response) => {
  const { title, description, dueDate, category, assignedTo } = req.body;

  if (assignedTo) {
    validateToAssign(res, assignedTo);
  }

  const newTask: Task = {
    id: uuid(),
    title,
    description,
    dueDate,
    category,
    creationDate: new Date(),
    assignedTo: assignedTo || null,
    status: 'Pending',
  };
  tasks.push(newTask);
  return res.status(201).json(newTask);
};

export const getTaskById = (req: Request, res: Response) => {
  const taskId = req.params.id;
  const task = tasks.find((task) => task.id === taskId);

  if (!task) {
    return res.status(404).json({ message: 'Task not found' });
  }

  res.status(200).json(task);
};

export const updateTask = (req: Request, res: Response) => {
  const taskId = req.params.id;
  const taskIndex = tasks.findIndex((task) => task.id === taskId);

  if (taskIndex === -1) {
    return res.status(404).json({ message: 'Task not found' });
  }

  if (req.body.assignedTo) {
    validateToAssign(res, req.body.assignedTo);
  }

  tasks[taskIndex] = { ...tasks[taskIndex], ...req.body };

  res.status(200).json(tasks[taskIndex]);
};

export const deleteTask = (req: Request, res: Response) => {
  const taskId = req.params.id;
  const existingTaskIndex = tasks.findIndex((task) => task.id === taskId);

  if (existingTaskIndex === -1) {
    return res.status(404).json({ message: 'Task not found' });
  }

  tasks.splice(existingTaskIndex, 1);

  res.status(200).json({ message: 'Task deleted successfully' });
};

export const getAllTasks = (req: any, res: Response) => {
  const totalTasks = tasks.length;

  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  
  const tasksForPage = tasks.slice(startIndex, endIndex);

  const responseData = {
    totalTasks,
    totalPages: Math.ceil(totalTasks / limit),
    currentPage: page,
    tasks: tasksForPage,
  };

  res.status(200).json(responseData);
};
