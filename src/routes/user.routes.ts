import express from 'express';
import { userSignup, userSignin } from '../controllers/user.controller';
import { authValidation, validate } from '../middleware/validation.middleware';

const router = express.Router();

/**
 * @swagger
 * /api/auth/signup:
 *   post:
 *     summary: User signup.
 *     description: Create a new user account with the specified username and password.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: The username of the user.
 *               password:
 *                 type: string
 *                 description: The password of the user.
 *     responses:
 *       201:
 *         description: Sends back user info and JWT token.
 *       400:
 *         description: Validation failed
 *       409:
 *         description: User with the same username already exists.
 *       500:
 *         description: Internal server error.
 */
router.post('/signup', authValidation, validate, userSignup);

/**
 * @swagger
 * /api/auth/signin:
 *   post:
 *     summary: User signin.
 *     description: Signin to account with username and password.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: The username of the user.
 *               password:
 *                 type: string
 *                 description: The password of the user.
 *     responses:
 *       200:
 *         description: Sends back JWT token.
 *       400:
 *         description: Validation failed
 *       401:
 *         description: Authentication failed.
 *       500:
 *         description: Internal server error.
 */
router.post('/signin', authValidation, validate, userSignin);

export default router;
