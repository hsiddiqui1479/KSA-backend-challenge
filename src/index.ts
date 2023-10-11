import dotenv from 'dotenv';
import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import taskRoutes from './routes/task.routes';
import userRoutes from './routes/user.routes';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

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
