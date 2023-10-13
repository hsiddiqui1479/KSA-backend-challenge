import dotenv from 'dotenv';
import cors from 'cors';
import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import swaggerUi from 'swagger-ui-express';
import morgan from 'morgan';
import fs from 'fs';

import taskRoutes from './routes/task.routes';
import userRoutes from './routes/user.routes';
import swaggerSpec from './swagger-config';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

const accessLogStream = fs.createWriteStream(__dirname + '/access.log', {
  flags: 'a',
});
app.use(morgan('combined', { stream: accessLogStream }));

app.use(cors());

app.use(bodyParser.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/', (req, res) => {
  res.send('Backend Challenge!');
});

app.use('/api', taskRoutes);
app.use('/api/auth', userRoutes);

// Send 404 for invalid routes
app.use((req: Request, res: Response) => {
  res.status(404).json({ message: 'Route not found' });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}/`);
});
