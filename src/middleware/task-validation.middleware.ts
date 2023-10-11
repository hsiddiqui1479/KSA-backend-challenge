import { body, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

export const createTaskValidation = [
  body('title').notEmpty().withMessage('title is required'),

  body('description').notEmpty().withMessage('description is required'),

  body('dueDate')
    .notEmpty()
    .withMessage('dueDate is required')
    .isDate()
    .withMessage('dueDate should be a valid date')
    .custom((value, { req }) => {
      const currentDate = new Date();
      const dueDate = new Date(value);

      if (dueDate <= currentDate) {
        throw new Error('Due date must be in the future');
      }
      return true;
    }),

  body('category').notEmpty().withMessage('category is required'),
];

export const updateTaskValidation = [
  body('dueDate')
    .optional()
    .isDate()
    .withMessage('dueDate should be a valid date')
    .custom((value, { req }) => {
      const currentDate = new Date();
      const dueDate = new Date(value);

      if (dueDate <= currentDate) {
        throw new Error('Due date must be in the future');
      }
      return true;
    }),

  body('status')
    .optional()
    .isIn(['Pending', 'Completed'])
    .withMessage('Status should be either "Pending" or "Completed"'),
];

export const validate = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};
