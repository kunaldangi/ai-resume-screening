import { config } from 'dotenv'; config();
import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';

import initializeDatabase from './config/db';
import initializeRoutes from './api/index';

const app = express();
initializeDatabase();

app.use(bodyParser.json());

initializeRoutes(app);

app.use(express.static('public'));
app.use((req, res, next) => {
    console.log(`Request Path: ${req.path}`);
    res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

app.listen(process.env.PORT, () => {
    console.log(`Server running on http://localhost:${process.env.PORT}`);
});