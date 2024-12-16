import express, { Express } from 'express';
import { config } from './config/env';
import rootRouter from './routes';
import { errorMiddleware } from './middlewares/error';
import { deleteExpiredTokens } from './utils/cleanup';
import cookieParser from 'cookie-parser';
import cors from 'cors';

const app: Express = express();
const { PORT } = config;

app.use(express.json());
app.use(cookieParser());
app.use(cors());

app.use('/api', rootRouter);

app.use(errorMiddleware);

setInterval(
  () => {
    deleteExpiredTokens().catch((err) => console.log('Failes to clean expired tokens', err));
  },
  24 * 60 * 60 * 1000
); // every 24 hours

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
