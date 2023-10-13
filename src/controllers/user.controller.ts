import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { uuid } from 'uuidv4';
import User from '../models/user.model';
import { users } from '../data-storage';

const secretKey: string = process.env.SECRET_KEY || 'defaultSecretKey';

const findUserByUsername = (username: string) => {
  return users.find((user) => user.username === username);
};

export const userSignup = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    const existingUser = findUserByUsername(username);

    if (existingUser) {
      return res
        .status(409)
        .json({ message: 'User with the same username already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser: User = {
      id: uuid(),
      username,
      password: hashedPassword,
    };

    users.push(newUser);

    const token = jwt.sign({ username, id: newUser.id }, secretKey, {
      expiresIn: '1h',
    });

    const userResp = {
      id: newUser.id,
      username: newUser.username,
      token,
    };

    res.status(201).json(userResp);
  } catch (error: any) {
    console.error('Error in userSignup:', error);
    res.status(500).json({ message: error.message });
  }
};

export const userSignin = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    const user = findUserByUsername(username);

    if (!user) {
      return res.status(401).json({ message: 'Authentication failed' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: 'Authentication failed' });
    }

    const token = jwt.sign({ username, id: user.id }, secretKey, {
      expiresIn: '1h',
    });

    res.status(200).json({ token });
  } catch (error: any) {
    console.error('Error in userSignup:', error);
    res.status(500).json({ message: error.message });
  }
};
