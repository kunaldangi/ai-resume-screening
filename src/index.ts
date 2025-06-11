import { config } from 'dotenv'; config();
import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';


import initializeDatabase from './config/db';
import initializeRoutes from './api/index';
import { parseSession } from './utils/session';

const app = express();
initializeDatabase();

app.use(cookieParser());
app.use(bodyParser.json());

app.use(parseSession);

initializeRoutes(app);

app.use(express.static('public'));

app.use((req, res, next) => {
    res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

app.listen(process.env.PORT, () => {
    console.log(`Server running on http://localhost:${process.env.PORT}`);
});