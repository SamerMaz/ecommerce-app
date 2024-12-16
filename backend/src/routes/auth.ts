import { errorHandler } from './../error-handler';
import { Router } from 'express';
import { login, logout, me, refreshToken, signup } from '../controllers/auth';
import authMiddleware from '../middlewares/auth';

const authRoutes: Router = Router();

authRoutes.post('/signup', errorHandler(signup));
authRoutes.post('/login', errorHandler(login));
authRoutes.post('/refresh-token', errorHandler(refreshToken));
authRoutes.post('/logout', errorHandler(logout));
authRoutes.get('/me', [authMiddleware], errorHandler(me));

export default authRoutes;
