import { useContext, useEffect, useState } from 'react';
import './style.css';

import { SectionContext } from '..';

export type User = {
    email: string;
    iat: number;
    userId: number;
    username: string;
}

export default function Nav() {
    const { sectionPage, setSectionPage } = useContext(SectionContext);
    console.log(sectionPage);

    const [user, setUser] = useState<User | null>(null);

    async function getUserInfo() {
        let response = await fetch('/api/users/info');
        let data = await response.json();

        if (data.status === 'success') {
            setUser(data.data);
        } else {
            console.error('Failed to fetch user info:', data.message);
        }
    }

    useEffect(() => {
        getUserInfo();
    }, []);

    return (<>
        <div className="home__nav">
            <div className="nav__title" onClick={() => setSectionPage('home')}>HOME</div>
            <div className="nav__items">
                <div className="nav__item" onClick={() => setSectionPage('google_form')}>
                    <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="26" height="26" viewBox="0 0 30 30">
                        <path d="M24.707,7.793l-5.5-5.5C19.019,2.105,18.765,2,18.5,2H7C5.895,2,5,2.895,5,4v22c0,1.105,0.895,2,2,2h16c1.105,0,2-0.895,2-2 V8.5C25,8.235,24.895,7.981,24.707,7.793z M10,15c-0.552,0-1-0.448-1-1c0-0.552,0.448-1,1-1s1,0.448,1,1C11,14.552,10.552,15,10,15z M10,19c-0.552,0-1-0.448-1-1c0-0.552,0.448-1,1-1s1,0.448,1,1C11,18.552,10.552,19,10,19z M10,23c-0.552,0-1-0.448-1-1 c0-0.552,0.448-1,1-1s1,0.448,1,1C11,22.552,10.552,23,10,23z M20,23h-6c-0.552,0-1-0.448-1-1s0.448-1,1-1h6c0.552,0,1,0.448,1,1 S20.552,23,20,23z M20,19h-6c-0.552,0-1-0.448-1-1s0.448-1,1-1h6c0.552,0,1,0.448,1,1S20.552,19,20,19z M20,15h-6 c-0.552,0-1-0.448-1-1s0.448-1,1-1h6c0.552,0,1,0.448,1,1S20.552,15,20,15z M19,9c-0.552,0-1-0.448-1-1V3.904L23.096,9H19z"></path>
                    </svg>
                    Google Form
                </div>
                <div className="nav__item" onClick={() => setSectionPage('scan_resume')}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-file-scan-icon lucide-file-scan"><path d="M20 10V7l-5-5H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h4" /><path d="M14 2v4a2 2 0 0 0 2 2h4" /><path d="M16 14a2 2 0 0 0-2 2" /><path d="M20 14a2 2 0 0 1 2 2" /><path d="M20 22a2 2 0 0 0 2-2" /><path d="M16 22a2 2 0 0 1-2-2" /></svg>
                    Scan Resume
                </div>
            </div>
            <div className="nav__user">
                <div>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user-icon lucide-user"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="5" /></svg>
                    {user ? user.username : 'Guest'}
                </div>
            </div>
        </div>
    </>)
}