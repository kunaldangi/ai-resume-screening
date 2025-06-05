import { config } from 'dotenv'; config();
import { Request, Response } from 'express';
import OpenAI from 'openai';
import extract from 'extract-zip';
import pdfParse from 'pdf-parse';
import fs from 'fs/promises';
import path from 'path';
import { getAllResumeFiles } from '../../utils/files';

const openai = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: process.env.OPENROUTER_API_KEY,
    defaultHeaders: {
        "HTTP-Referer": "https://airesume.kunaldangi.me",
        "X-Title": "AI Resume Screening",
    },
});

export default async function multiResume(req: Request, res: Response): Promise<any> {
    try {
        const file = req.file;
        
        if (!file || !file.path) return res.status(400).json({ error: 'No file uploaded' });

        const filePath = path.join(__dirname, '../../../', file.path); // adjust as needed
        // console.log(file, filePath);

        const ext = path.extname(file.filename);
        // console.log('File extension:', ext);

        const fileNameWithoutExt = path.basename(file.filename, ext);
        // console.log('File name without extension:', fileNameWithoutExt);


        const uniqueFolder = path.join(__dirname, '../../../uploads', `${fileNameWithoutExt}_${Date.now()}`); // Create a unique folder for extraction
        await fs.mkdir(uniqueFolder, { recursive: true });

        try {
            await extract(filePath, { dir: uniqueFolder });
        } catch (error: any) {
            console.error('Error extracting file: ', error.message);
            return res.status(500).json({ error: 'Error extracting file' });
        }
        

        const resumeFiles = await getAllResumeFiles(uniqueFolder);
        console.log(resumeFiles);

        if (resumeFiles.length === 0) return res.status(400).json({ error: 'No PDF, DOC, or DOCX files found in the archive' });

        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        res.flushHeaders(); 

        for (let i = 0; i < resumeFiles.length; i++) {
            const dataBuffer = await fs.readFile(resumeFiles[i]);
            const pdfData = await pdfParse(dataBuffer);

            // console.log('Extracted Text:', pdfData.text, '\n\n\n');
            // res.write(`data: ${JSON.stringify({index: i, resume: resumeFiles[i]})}\n\n`);
            // console.log(`Response for ${resumeFile}:`, pdfData.text);

            // await fs.unlink(filePath); // WE MAY NEED TO DELETE IT!
    
            const completion  = await openai.chat.completions.create({
                model: "deepseek/deepseek-chat-v3-0324:free",
                messages: [{ role: "user", content: `Requirements: ${req.body.prompt} \n Resume: ${pdfData.text} \n 
                    All the criteria are restrictly to fullfill if any of criteria not fullfill not do shortlist the resume.
                    After reading the resume just reply with "Shortlisted" or "Not Shortlisted" and "Reason" for not "Shortlisted" and "Not Shortlisted" the resume.
                    Also write the candidate name if available in the resume.
                ` }],
            });
    
            let response = completion.choices[0].message.content;

            res.write(`data: ${JSON.stringify({index: i, response})}\n\n`);
        }

        // for await (const resumeFile of resumeFiles) {
    

            // res.write(`data: ${pdfData.text}\n\n`);



        // }


        // return res.status(200).json({
        //     status: 'success',
        //     data: 'response'
        // });

        res.end();
    } catch (error) {
        console.error('Error processing file:', error);
        return res.status(500).json({ error: 'Error processing file' });
    }

    /*
        All the criteria are restrictly to fullfill if any of criteria not fullfill not do shortlist the resume.
        After reading the resume just reply with "Shortlisted" or "Not Shortlisted" and "Reason" for not "Shortlisted" and "Not Shortlisted" the resume.
    */
}