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

/**
 * @swagger
 * /api/task:
 *   post:
 *     summary: Create a new task.
 *     description: Create a new task with the specified details.
 *     tags:
 *       - Tasks
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: The title of the task.
 *               description:
 *                 type: string
 *                 description: The description of the task.
 *               dueDate:
 *                 type: string
 *                 format: date
 *                 description: The due date of the task.
 *               category:
 *                 type: string
 *                 description: The category of the task.
 *               assignedTo:
 *                 type: string
 *                 description: The user to whom the task is assigned (optional).
 *     responses:
 *       201:
 *         description: The task was successfully created.
 *       400:
 *         description: Bad request. Invalid input data.
 *       401:
 *         description: Unauthorized. JWT token is missing or invalid.
 *       404:
 *         description: Assigned user does not exist.
 *       500:
 *         description: Internal server error.
 */
router.post('/task', verifyToken, createTaskValidation, validate, createTask);

/**
 * @swagger
 * /api/task/{id}:
 *   get:
 *     summary: Retrieve a task by its ID.
 *     description: Retrieve a task by its unique identifier.
 *     tags:
 *       - Tasks
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier of the task.
 *     responses:
 *       200:
 *         description: Task retrieved successfully.
 *       401:
 *         description: Unauthorized. JWT token is missing or invalid.
 *       404:
 *         description: Task not found.
 *       500:
 *         description: Internal server error.
 */
router.get('/task/:id', verifyToken, getTaskById);

/**
 * @swagger
 * /api/task/{id}:
 *   put:
 *     summary: Update a specific task by its ID.
 *     description: Update the details of a specific task by its unique identifier.
 *     tags:
 *       - Tasks
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier of the task to update.
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: The title of the task.
 *               description:
 *                 type: string
 *                 description: The description of the task.
 *               dueDate:
 *                 type: string
 *                 format: date
 *                 description: The due date of the task.
 *               category:
 *                 type: string
 *                 description: The category of the task.
 *               assignedTo:
 *                 type: string
 *                 description: The user to whom the task is assigned (optional).
 *     responses:
 *       200:
 *         description: Task updated successfully.
 *       400:
 *         description: Bad request. Invalid input data.
 *       401:
 *         description: Unauthorized. JWT token is missing or invalid.
 *       404:
 *         description: Task not found.
 *       500:
 *         description: Internal server error.
 */
router.put(
  '/task/:id',
  verifyToken,
  updateTaskValidation,
  validate,
  updateTask
);

/**
 * @swagger
 * /api/task/{id}:
 *   delete:
 *     summary: Delete a task by its ID.
 *     description: Delete a task by its unique identifier.
 *     tags:
 *       - Tasks
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier of the task to delete.
 *     responses:
 *       200:
 *         description: Task deleted successfully.
 *       401:
 *         description: Unauthorized. JWT token is missing or invalid.
 *       404:
 *         description: Task not found.
 *       500:
 *         description: Internal server error.
 */
router.delete('/task/:id', verifyToken, deleteTask);

/**
 * @swagger
 * /api/tasks:
 *   get:
 *     summary: Retrieve all tasks with pagination and filtering.
 *     description: Retrieve all tasks with optional pagination and filtering options.
 *     tags:
 *       - Tasks
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: assignedTo
 *         schema:
 *           type: string
 *         description: Filter tasks by the username of the assigned user (optional).
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter tasks by category (optional).
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: The page number for pagination (optional).
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: The maximum number of tasks per page (optional).
 *     responses:
 *       200:
 *         description: Tasks array and metadata.
 *       401:
 *         description: Unauthorized. JWT token is missing or invalid.
 *       500:
 *         description: Internal server error.
 */
router.get('/tasks', verifyToken, getAllTasks);

export default router;
