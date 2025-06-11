import { Request, Response } from "express";

export default function info(req: Request, res: Response) {
    res.status(200).json({
        status: 'success',
        data: req.session
    });
}