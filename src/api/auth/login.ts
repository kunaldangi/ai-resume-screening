import { Request, Response } from "express";

export async function login(req: Request, res: Response): Promise<any> {
    console.log(req.body);
    return res.status(200).json({
        status: 'success',
        message: 'Login successful',
    });
}