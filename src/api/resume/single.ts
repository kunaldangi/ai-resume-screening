import { config } from 'dotenv'; config();
import { Request, Response } from 'express';


import OpenAI from 'openai';
import pdfParse from 'pdf-parse';
import fs from 'fs/promises';
import path from 'path';

const openai = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: process.env.OPENROUTER_API_KEY,
    defaultHeaders: {
        "HTTP-Referer": "https://airesume.kunaldangi.me",
        "X-Title": "AI Resume Screening",
    },
});

export default async function singleResume(req: Request, res: Response): Promise<any> {    
    try {
        const file = req.file;

        if (!file || !file.path) return res.status(400).json({ error: 'No file uploaded' });

        const filePath = path.join(__dirname, '../../../', file.path); // adjust as needed
        const dataBuffer = await fs.readFile(filePath);
        const pdfData = await pdfParse(dataBuffer);

        console.log('Extracted Text:', pdfData.text);
        // await fs.unlink(filePath); // WE MAY NEED TO DELETE IT!

        const completion  = await openai.chat.completions.create({
            model: "deepseek/deepseek-chat-v3-0324:free",
            messages: [{ role: "user", content: `Requirements: ${req.body.prompt} \n Resume: ${pdfData.text} \n 
                All the criteria are restrictly to fullfill if any of criteria not fullfill not do shortlist the resume.
                After reading the resume just reply with "Shortlisted" or "Not Shortlisted" and "Reason" for not "Shortlisted" and "Not Shortlisted" the resume.
            ` }],
        });

        let response = completion.choices[0].message.content;

        return res.status(200).json({
            status: 'success',
            data: response
        });

    } catch (error) {
        console.error('Error processing file:', error);
        return res.status(500).json({ error: 'Error processing file' });
    }

    /*
        All the criteria are restrictly to fullfill if any of criteria not fullfill not do shortlist the resume.
        After reading the resume just reply with "Shortlisted" or "Not Shortlisted" and "Reason" for not "Shortlisted" and "Not Shortlisted" the resume.
    */
}