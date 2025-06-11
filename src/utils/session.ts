import { NextFunction, Request, Response } from "express";

import jwt from "jsonwebtoken";

export async function parseSession(req: Request, res: Response, next: NextFunction) {
    console.log('Parsing session for request:', req.path);
    if(req.path == '/' || req.path.startsWith('/api/resume')){
        let session = req.cookies.session;
        if(!session) return res.redirect('/login');
    
        try {
            session = jwt.verify(session, `${process.env.JWT_SESSION_SECRET}`);
        } catch (err) {
            console.error('Invalid session token:', err);
            return res.redirect('/login');
        }

        req.session = session;
        next();
    }
    else {
        console.log('Skipping session check for login/register');
        next();
    }
}