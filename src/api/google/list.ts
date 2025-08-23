import { Request, Response } from "express";
import { GoogleForm, Users } from "../../config/db";



export default async function listForms(req: Request, res: Response): Promise<any>{
    let user = await Users.findByPk(req?.session?.userId);
    if (!user || !user.dataValues?.googleAccessToken ){
        return res.status(401).json({
            status: false,
            message: "You have not connected your Google account yet. Please connect your Google account to access Google Forms Workflow.",
        })
    }

    let googleForms = await GoogleForm.findAll({ where: { userId: req?.session?.userId }});

    if(!googleForms || googleForms.length === 0){
        return res.status(404).json({
            status: false,
            message: "No Google Forms found!.",
        });
    }

    console.log("Google Forms found: ", googleForms);

    return res.json({ googleForms });
}