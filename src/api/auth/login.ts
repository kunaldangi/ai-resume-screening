import { Request, Response } from "express";

export async function login(req: Request, res: Response): Promise<any> {
    return res.status(200).json({
        status: 'success',
        message: 'Login successful',
    });
}