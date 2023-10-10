import { Request, Response } from 'express';

export const createTask = (req: Request, res: Response) => {
  res.send('createTask success');
};

export const getTaskById = (req: Request, res: Response) => {
  res.send('getTaskById Success');
};

export const updateTask = (req: Request, res: Response) => {
  res.send('updateTask Success');
};

export const deleteTask = (req: Request, res: Response) => {
  res.send('deleteTask Success');
};

export const getAllTasks = (req: Request, res: Response) => {
  res.send('getAllTasks success');
};