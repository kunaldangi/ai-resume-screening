import { useState } from 'react';
import './style.css';

type ResumeResponse = {
	status: boolean;
	message: string;
};

function App() {
	const [fileType, setFileType] = useState<string>('pdf');
	const [prompt, setPrompt] = useState<string>('You are reviewing a resume for a Full Stack Developer internship or entry-level role. Evaluate the candidate based on these key areas:Technical Skills:Basic knowledge of front-end technologies like HTML, CSS, JavaScript, and frameworks such as React, Angular, or Vue.js.Understanding of back-end technologies such as Node.js, Python (Django/Flask), or Java (Spring Boot).Familiarity with databases, both SQL (MySQL, PostgreSQL) and NoSQL (MongoDB).Awareness of APIs (REST or GraphQL).Exposure to version control systems like Git.Any experience or coursework related to cloud platforms (AWS, Azure, GCP) or containerization (Docker) is a plus but not mandatory.Projects and Practical Experience:Look for academic projects, internships, or personal projects that showcase coding skills and full stack understanding.Participation in coding competitions, hackathons, or open-source contributions.Based on this, assess if the candidate shows strong fundamentals and enthusiasm to grow as a Full Stack Developer, and if their skills and projects align with an entry-level role in the industry.');
	const [response, setResponse] = useState<ResumeResponse[]>([]);

	const [isLoading, setIsLoading] = useState<boolean>(false);

	async function handleSubmit() {
		setIsLoading(true);

		const formData = new FormData();
		const fileInput = document.getElementById('resume-upload') as HTMLInputElement;
		if (fileInput.files && fileInput.files.length > 0) formData.append('resume', fileInput.files[0]);
		formData.append('prompt', prompt);

		try {
			const response = await fetch(`/api/resume/${fileType == 'pdf' ? 'single' : 'multi'}`, {
				method: 'POST',
				body: formData,
			});
			if (fileType === 'pdf') {
				const data = await response.json();
				console.log(data);
				if (data.status) {
					setResponse([{
						status: true,
						message: data.data
					}]);
				}
			}
			else {
				const reader = response.body?.getReader();
				if (!reader) throw new Error('Failed to get reader from response body');

				setResponse([]);
				const decoder = new TextDecoder();
				let buffer = '';

				while (true) {
					const { done, value } = await reader.read();
					if (done) break;

					buffer += decoder.decode(value, { stream: true });

					// Process complete SSE messages
					let parts = buffer.split('\n\n');

					// Keep last part in buffer (may be incomplete)
					buffer = parts.pop() ?? '';

					for (const part of parts) {
						const lines = part.split('\n');
						for (const line of lines) {
							if (line.startsWith('data:')) {
								const json = line.slice(5).trim();
								try {
									const data = JSON.parse(json);
									console.log('Received SSE message:', data);
									setResponse(prev => [...prev, {
										status: true,
										message: data.response
									}]);
								} catch (e) {
									console.warn('Failed to parse SSE JSON:', json);
								}
							}
						}
					}
				}
			}


			setIsLoading(false);
		} catch (error) {
			console.error('Error:', error);
			setIsLoading(false);
		}
	}

	return (<>
		<div className="home__header">
			<div className="home__header--title">AI Resume Screening</div>
			<div className='home__header--desc'>Upload resumes and provide a prompt to let the AI shortlist them</div>
		</div>

		<div className="home__content">
			<div className="home__title">Upload Resumes</div>

			<label className="home__fileType" htmlFor="file-type">File Type:</label>
			<select className='home__fileType--select' id="file-type" value={fileType} onChange={(e) => setFileType(e.target.value)}>
				<option value="pdf">PDF/DOC/DOCX</option>
				<option value="rar">ZIP/RAR</option>
			</select>

			{fileType == 'rar' && <p className="home__note">Note: For ZIP/RAR files, please ensure they contain only resumes.</p>}

			<label className='home__resume' htmlFor="resume-upload">Choose resume files {fileType == 'pdf' ? <>(PDF/DOC/DOCX)</> : <>(ZIP/RAR)</>}:</label>
			<input className='home__resume--fileInpt' type="file" id="resume-upload" name="resumes" accept={fileType == 'pdf' ? ".pdf,.doc,.docx" : ".rar,.zip"} />

			<label className='home__prompt' htmlFor="prompt">Screening Prompt / Job Requirements:</label>
			<textarea className='home__prompt--inpt' id="prompt" placeholder="Enter requirements or a job description..." value={prompt} onChange={(e) => setPrompt(e.target.value)}></textarea>

			<button className='home__sumbit' onClick={handleSubmit} disabled={isLoading} >Submit to AI</button>

			<div className="home__results" id="results">
				{
					response.map((res, index) => {
						return (
							<div key={index} className="home__result--card">
								<div className={`home__result--status ${res.message.includes('Not Shortlisted') ? 'home__result--not-shortlisted' : 'home__result--shortlisted'}`}>
									{res.message.includes('Not Shortlisted') ? '❌ Not Shortlisted' : '✅ Shortlisted'}
								</div>
								<div className="home__reason">
									Reason: {res.message}
								</div>
							</div>
						)
					})
				}
			</div>
		</div>
	</>)
}

export default App;
