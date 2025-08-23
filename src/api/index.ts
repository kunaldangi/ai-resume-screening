import { Express } from 'express';

import resumeRouter from './resume';
import authRouter from './auth';
import usersRouter from './users';
import googleRouter from './google';

export default async function initializeRoutes(app: Express){
    app.use('/api/resume', resumeRouter);
    app.use('/api/auth', authRouter);
    app.use('/api/users', usersRouter);
    app.use('/api/google', googleRouter);
}