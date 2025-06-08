import { config } from "dotenv"; config();
import { Request, Response } from "express";
import crypto from "crypto";

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { Users } from "../../../config/db";

export async function googleAuthorize(req: Request, res: Response): Promise<any> {
    let code = req.query.code || null;
    if (!code) return res.status(400).json({ status: 'error', message: 'Authorization code is missing' });

    let tokenResponse = await fetch(`https://oauth2.googleapis.com/token`, { // change the code get the access token
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
            'code': code as string,
            'client_id': `${process.env.GOOGLE_CLIENT_ID}`,
            'client_secret': `${process.env.GOOGLE_CLIENT_SECRET}`,
            'redirect_uri': 'http://localhost:8080/api/auth/google/authorize',
            'grant_type': 'authorization_code'
        })
    });
    const tokenData = await tokenResponse.json();
    if (!tokenData.access_token) return res.status(400).json({ status: 'error', message: 'Token exchange failed', error: tokenData });

    // Use access token to get user info
    const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${tokenData.access_token}`,
        },
    });

    const userInfo = await userInfoResponse.json();
    if (!userInfo || !userInfo.email || !userInfo.name) return res.status(400).json({ status: 'error', message: 'User info retrieval failed' });


    const user = await Users.findOne({ where: { email: userInfo.email } });

    /* 
        Google User Info Example:
        User Info: {
            id: '106346163967360246316',
            email: 'something@gmail.com',
            verified_email: true,
            name: 'Something',
            given_name: 'Something',
            picture: 'https://lh3.googleusercontent.com/a/Aasdoytsfh35PdsHnzYPyApjVqIshZ6j5do-hJYOfeccCl7UqQLN5LiA=s96-c'
        }
    */

    if (!user) { // register new user
        const randomPassword = crypto.randomBytes(8).toString('hex');

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(randomPassword, salt);

        const newUser = Users.build({username: userInfo.name, email: userInfo.email, password: hashedPassword});
        await newUser.save();

        const token = jwt.sign({ userId: newUser.dataValues.id, username: newUser.dataValues.username, email: newUser.dataValues.email }, process.env.JWT_SESSION_SECRET as string);

        res.cookie('session', token, { sameSite: 'strict', maxAge: 24 * 60 * 60 * 1000 * 7 });
        
        res.redirect('/');
    }

    else { // login user
        const token = jwt.sign({ userId: user.dataValues.id, username: user.dataValues.username, email: user.dataValues.email }, process.env.JWT_SESSION_SECRET as string);
        
        res.cookie('session', token, { sameSite: 'strict', maxAge: 24 * 60 * 60 * 1000 * 7 });
    
        res.redirect('/');
    }
}