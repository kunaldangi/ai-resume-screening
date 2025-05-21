import { useState } from 'react';
import './App.css';

function App() {
	const [prompt, setPrompt] = useState<string>('You are reviewing a resume for a Full Stack Developer internship or entry-level role. Evaluate the candidate based on these key areas:Technical Skills:Basic knowledge of front-end technologies like HTML, CSS, JavaScript, and frameworks such as React, Angular, or Vue.js.Understanding of back-end technologies such as Node.js, Python (Django/Flask), or Java (Spring Boot).Familiarity with databases, both SQL (MySQL, PostgreSQL) and NoSQL (MongoDB).Awareness of APIs (REST or GraphQL).Exposure to version control systems like Git.Any experience or coursework related to cloud platforms (AWS, Azure, GCP) or containerization (Docker) is a plus but not mandatory.Projects and Practical Experience:Look for academic projects, internships, or personal projects that showcase coding skills and full stack understanding.Participation in coding competitions, hackathons, or open-source contributions.Based on this, assess if the candidate shows strong fundamentals and enthusiasm to grow as a Full Stack Developer, and if their skills and projects align with an entry-level role in the industry.');
	const [response, setResponse] = useState<{status: boolean, message: string}>({
		status: false,
		message: '',
	});

	const [isLoading, setIsLoading] = useState<boolean>(false);

	async function handleSubmit(){
		setIsLoading(true);

		const formData = new FormData();
		const fileInput = document.getElementById('resume-upload') as HTMLInputElement;
		if (fileInput.files && fileInput.files.length > 0) {
			formData.append('resume', fileInput.files[0]);
		}
		formData.append('prompt', prompt);

		try {
			const response = await fetch('/api/resume/single', {
				method: 'POST',
				body: formData,
			});
			const data = await response.json();
			console.log(data);
			if(data.status){
				setResponse({
					status: true,
					message: data.data
				});
			}
			setIsLoading(false);
		} catch (error) {
			console.error('Error:', error);
			setIsLoading(false);
		}
	}

	return (<>
		<header>
			<h1>AI Resume Screening</h1>
			<p>Upload resumes and provide a prompt to let the AI shortlist them</p>
		</header>

		<div className="container">
			<h2>Upload Resumes</h2>
			<label htmlFor="resume-upload">Choose resume files (PDF/DOCX):</label>
			<input type="file" id="resume-upload" name="resumes" multiple accept=".pdf,.doc,.docx" />

			<label htmlFor="prompt">Screening Prompt / Job Requirements:</label>
			<textarea id="prompt" placeholder="Enter requirements or a job description..." value={prompt} onChange={(e) => setPrompt(e.target.value)}></textarea>

			<button onClick={handleSubmit} disabled={isLoading} >Submit to AI</button>

			{
				response.status && <div className="results" id="results">
					<div className="result-card">
						<div className={`status ${response.message.includes('Not Shortlisted') ? 'not-shortlisted' : 'shortlisted'}`}>
							{response.message.includes('Not Shortlisted') ? '❌ Not Shortlisted' : '✅ Shortlisted'}
						</div>
						<div className="reason">
							Reason: {response.message}
						</div>
					</div>
				</div>
			}
		</div>
	</>)
}

export default App;
