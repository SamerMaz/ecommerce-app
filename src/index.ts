import express, { Express } from 'express';
import { config } from './config/env';
import rootRouter from './routes';
import { errorMiddleware } from './middlewares/error';

const app: Express = express();
const { PORT } = config;

app.use(express.json());

app.use('/api', rootRouter);

app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log('App is Working');
});
