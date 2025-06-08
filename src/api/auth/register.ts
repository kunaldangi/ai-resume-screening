import { config } from "dotenv"; config();
import { Request, Response } from "express";

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { Users } from "../../config/db";

export async function register(req: Request, res: Response): Promise<any> {
    const { username, password, email } = req.body;

    if (!username || !password || !email) return res.status(400).json({ status: 'error', message: 'Username, password, and email are required'});

    if(username.length < 3 || username.length > 32) return res.status(400).json({ status: 'error', message: 'Username must be between 3 and 32 characters' });
    if(password.length < 8) return res.status(400).json({ status: 'error', message: 'Password must be at least 8 characters long' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    try {
        const newUser = Users.build({username: username, email: email, password: hashedPassword});
        await newUser.save();

        const token = jwt.sign({ userId: newUser.dataValues.id, username: newUser.dataValues.username, email: newUser.dataValues.email }, process.env.JWT_SESSION_SECRET as string);

        res.cookie('session', token, { sameSite: 'strict', maxAge: 24 * 60 * 60 * 1000 * 7 });
        
        return res.status(200).json({
            status: 'success',
            message: 'User registered successfully',
        });

    } catch (error: any) {
        if (error.name == 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ status: 'error', message: 'Email already exists' });
        }
        else {
            console.error('Error registering user:', error);
            return res.status(500).json({ status: 'error', message: 'Internal server error' });
        }
    }
}