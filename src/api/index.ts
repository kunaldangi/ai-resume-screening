import { Express } from 'express';

import resumeRouter from './resume';
import authRouter from './auth';

export default async function initializeRoutes(app: Express){
    app.use('/api/resume', resumeRouter);
    app.use('/api/auth', authRouter);
}