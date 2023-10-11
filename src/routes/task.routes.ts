import express from 'express';
import {
  getAllTasks,
  createTask,
  getTaskById,
  updateTask,
  deleteTask,
} from '../controllers/task.controller';
import { verifyToken } from '../middleware/jwt.middleware';
import {
  createTaskValidation,
  validate,
  updateTaskValidation,
} from '../middleware/task-validation.middleware';

const router = express.Router();

router.post('/task', verifyToken, createTaskValidation, validate, createTask);
router.get('/task/:id', verifyToken, getTaskById);
router.put(
  '/task/:id',
  verifyToken,
  updateTaskValidation,
  validate,
  updateTask
);
router.delete('/task/:id', verifyToken, deleteTask);
router.get('/tasks', verifyToken, getAllTasks);

export default router;
