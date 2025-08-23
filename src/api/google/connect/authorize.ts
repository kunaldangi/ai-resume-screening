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
}