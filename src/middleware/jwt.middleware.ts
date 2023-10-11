import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const secretKey: string = process.env.SECRET_KEY || 'defaultSecretKey';


export const verifyToken = (req: any, res: Response, next: NextFunction) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  const tokenWithoutBearer = token.substring(7);


  jwt.verify(tokenWithoutBearer, secretKey, (err: Error | null, decoded: any) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid token' });
    }
    req.user = decoded;
    next();
  });
};
