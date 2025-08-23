import { NextFunction, Request, Response } from "express";

import jwt from "jsonwebtoken";

export async function parseSession(req: Request, res: Response, next: NextFunction): Promise<any> {
    let session = req.cookies.session;

    console.log('Path: ', req.path);

    if(req.path == '/') {
        if(!session) return res.redirect('/login');
        
        try {
            session = jwt.verify(session, `${process.env.JWT_SESSION_SECRET}`);
        } catch (err) {
            return res.redirect('/login');
        }
        
        req.session = session;
        next();
    }
    else if(req.path.startsWith('/api/resume') || req.path.startsWith('/api/users') || req.path.startsWith('/api/google')) {
        if(!session) return res.status(401).json({status: 'error', message: 'Unauthorized access!'});

        try {
            session = jwt.verify(session, `${process.env.JWT_SESSION_SECRET}`);
        } catch (error) {
            return res.status(401).json({status: 'error', message: 'Invalid session token!'});
        }
        
        req.session = session;
        next();
    }
    else {
        console.log('Skipping session check for login/register');
        next();
    }
}