import express from 'express';
import { login, refreshToken } from '../controllers/authController';

export const authRouter = express.Router();

// Public endpoints for authentication
authRouter.post('/login', login);
authRouter.post('/refresh', refreshToken);
