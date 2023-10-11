import express from 'express';
import {
  getAllTasks,
  createTask,
  getTaskById,
  updateTask,
  deleteTask,
} from '../controllers/task.controller';
import { verifyToken } from '../middleware/jwt.middleware';

const router = express.Router();

router.post('/task', verifyToken, createTask);
router.get('/tasks/:id', getTaskById);
router.put('/tasks/:id', updateTask);
router.delete('/tasks/:id', deleteTask);
router.get('/tasks', getAllTasks);

export default router;
