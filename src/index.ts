import dotenv from 'dotenv';
import express, { Request, Response } from 'express';

import taskRoutes from './routes/task.routes';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Backend Challenge!');
});

app.use('/api', taskRoutes);

// Send 404 for invalid routes
app.use((req: Request, res: Response) => {
  res.status(404).json({ message: 'Route not found' });
});


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}/`);
});
