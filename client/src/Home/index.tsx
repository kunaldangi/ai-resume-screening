import { createContext, useState } from 'react';
import './style.css';

import Nav from './Nav';
import ScanResume from './ScanResume';
import GoogleForm from './GoogleForm';

export const SectionContext = createContext<{ sectionPage: string; setSectionPage: React.Dispatch<React.SetStateAction<string>>;}>({
	sectionPage: 'home',
	setSectionPage: () => {},
});

function App() {
	const [sectionPage, setSectionPage] = useState<string>('home');

	return (<>
		<SectionContext.Provider value={{ sectionPage, setSectionPage }}>

			{/* Main Home Component */}
			<div className="home">
				<Nav />

				<div className="home__aside">
					<div className="home__nav--toggle">
						{/* <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="red" stroke="var(--primary-color)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-align-justify-icon lucide-align-justify"><path d="M3 12h18"/><path d="M3 18h18"/><path d="M3 6h18"/></svg> */}
						<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--primary-color)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x-icon lucide-x"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
					</div>


					<div className="home__body">
						{ 
							sectionPage === 'scan_resume' ? <ScanResume /> : null 
						}
						{ 
							sectionPage === 'home' ?
							<div className="home__header">
								<div className="home__header--title">AI Resume Screening</div>
								<div className='home__header--desc'>Upload resumes and provide a prompt to let the AI shortlist them</div>
							</div> : null 
						}
						{
							sectionPage === 'google_form' ? <GoogleForm /> : null
						}
					</div>
				</div>
			</div>

		</SectionContext.Provider>
	</>)
}

export default App;
