import { Request, Response } from 'express';
import { uuid } from 'uuidv4';
import Task from '../models/task.model';
import { tasks, users } from '../data-storage';

const findUserByUsername = (res: Response, username: string) =>
  users.find((user) => user.username === username);

export const createTask = (req: Request, res: Response) => {
  try {
    const { title, description, dueDate, category, assignedTo } = req.body;

    if (assignedTo) {
      const existingUser = findUserByUsername(res, assignedTo);
      if (!existingUser) {
        return res
          .status(404)
          .json({ message: 'Assigned user does not exist' });
      }
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
  } catch (error: any) {
    console.error('Error in createTask:', error);
    res.status(500).json({ message: error.message });
  }
};

export const getTaskById = (req: Request, res: Response) => {
  try {
    const taskId = req.params.id;
    const task = tasks.find((task) => task.id === taskId);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.status(200).json(task);
  } catch (error: any) {
    console.error('Error in getTaskById:', error);
    res.status(500).json({ message: error.message });
  }
};

export const updateTask = (req: Request, res: Response) => {
  try {
    const taskId = req.params.id;
    const taskIndex = tasks.findIndex((task) => task.id === taskId);

    if (taskIndex === -1) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (req.body.assignedTo) {
      const existingUser = findUserByUsername(res, req.body.assignedTo);
      if (!existingUser) {
        return res
          .status(404)
          .json({ message: 'Assigned user does not exist' });
      }
    }

    tasks[taskIndex] = { ...tasks[taskIndex], ...req.body };

    res.status(200).json(tasks[taskIndex]);
  } catch (error: any) {
    console.error('Error in updateTask:', error);
    res.status(500).json({ message: error.message });
  }
};

export const deleteTask = (req: Request, res: Response) => {
  try {
    const taskId = req.params.id;
    const existingTaskIndex = tasks.findIndex((task) => task.id === taskId);

    if (existingTaskIndex === -1) {
      return res.status(404).json({ message: 'Task not found' });
    }

    tasks.splice(existingTaskIndex, 1);

    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error: any) {
    console.error('Error in deleteTask:', error);
    res.status(500).json({ message: error.message });
  }
};

export const getAllTasks = (req: any, res: Response) => {
  try {
    const { assignedTo, category } = req.query;

    let filteredTasks = tasks;

    if (assignedTo) {
      filteredTasks = filteredTasks.filter(
        (task) => task.assignedTo === assignedTo
      );
    }

    if (category) {
      filteredTasks = filteredTasks.filter(
        (task) => task.category === category
      );
    }

    const totalTasks = filteredTasks.length;

    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    const tasksForPage = filteredTasks.slice(startIndex, endIndex);

    const responseData = {
      totalTasks,
      totalPages: Math.ceil(totalTasks / limit),
      currentPage: page,
      tasks: tasksForPage,
    };

    res.status(200).json(responseData);
  } catch (error: any) {
    console.error('Error in deleteTask:', error);
    res.status(500).json({ message: error.message });
  }
};
