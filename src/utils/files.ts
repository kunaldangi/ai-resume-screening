import fs from 'fs/promises';
import path from 'path';

export async function getAllResumeFiles(dir: string): Promise<string[]> {
    let results: string[] = [];
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            results = results.concat(await getAllResumeFiles(fullPath));
        } else {
            const ext = path.extname(entry.name).toLowerCase();
            if (['.pdf', '.doc', '.docx'].includes(ext)) {
                results.push(fullPath);
            }
        }
    }
    return results;
}