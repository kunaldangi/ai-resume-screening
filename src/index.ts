import { config } from 'dotenv'; config();
import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';

import initializeDatabase from './config/db';
import initializeRoutes from './api/index';

const app = express();
initializeDatabase();

app.use(cookieParser());
app.use(bodyParser.json());

initializeRoutes(app);

app.use((req, res, next) => {
    console.log(req.path == '/', req.path.startsWith('/api/resume'))
    if(req.path == '/' || req.path.startsWith('/api/resume')){
        let session = req.cookies.session;
        if(!session) return res.redirect('/login');
    
        try {
            session = jwt.verify(session, `${process.env.JWT_SESSION_SECRET}`);
        } catch (err) {
            console.error('Invalid session token:', err);
            return res.redirect('/login');
        }
    
        console.log('Session: ', session);
        next();
    }
    else {
        console.log('Skipping session check for login/register');
        next();
    }
}, express.static('public'));

app.use((req, res, next) => {
    res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

app.listen(process.env.PORT, () => {
    console.log(`Server running on http://localhost:${process.env.PORT}`);
});