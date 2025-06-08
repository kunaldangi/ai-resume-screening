import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { Users } from "../../config/db";

export async function login(req: Request, res: Response): Promise<any> {
    const { email, password } = req.body;

    if (!email || !password) return res.status(400).json({ status: 'error', message: 'Email and password are required' });

    let user = await Users.findOne({ where: { email: email }});
    if(!user) return res.status(400).json({ status: 'error', message: 'User not found' });

    if(!await bcrypt.compare(password, user.dataValues.password)) return res.status(400).json({ status: 'error', message: 'Invalid password' });

    const token = jwt.sign(JSON.stringify({ userId: user.dataValues.id, username: user.dataValues.username, email: user.dataValues.email }), process.env.JWT_SESSION_SECRET as string);

    res.cookie('token', token, { sameSite: 'strict', maxAge: 24 * 60 * 60 * 1000 * 7 });

    return res.status(200).json({
        status: 'success',
        message: 'Login successful',
    });
}