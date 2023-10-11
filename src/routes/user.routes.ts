import express from 'express';
import { userSignup, userSignin } from '../controllers/user.controller';
import { authValidation, validate } from '../middleware/validation.middleware';

const router = express.Router();

router.post('/signup', authValidation, validate, userSignup);
router.post('/signin', authValidation, validate, userSignin);

export default router;
