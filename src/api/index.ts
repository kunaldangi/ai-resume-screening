import { Express } from 'express';

import resumeRouter from './resume';

export default async function initializeRoutes(app: Express){
    app.use('/api/resume', resumeRouter);
}