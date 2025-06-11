import { useEffect, useState } from 'react';
import './style.css';

type User = {
    email: string;
    iat: number;
    userId: number;
    username: string;
}

export default function Nav() {
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
            <div className="nav__title">HOME</div>
            <div className="nav__items">
                <div className="nav__item">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-boxes-icon lucide-boxes"><path d="M2.97 12.92A2 2 0 0 0 2 14.63v3.24a2 2 0 0 0 .97 1.71l3 1.8a2 2 0 0 0 2.06 0L12 19v-5.5l-5-3-4.03 2.42Z" /><path d="m7 16.5-4.74-2.85" /><path d="m7 16.5 5-3" /><path d="M7 16.5v5.17" /><path d="M12 13.5V19l3.97 2.38a2 2 0 0 0 2.06 0l3-1.8a2 2 0 0 0 .97-1.71v-3.24a2 2 0 0 0-.97-1.71L17 10.5l-5 3Z" /><path d="m17 16.5-5-3" /><path d="m17 16.5 4.74-2.85" /><path d="M17 16.5v5.17" /><path d="M7.97 4.42A2 2 0 0 0 7 6.13v4.37l5 3 5-3V6.13a2 2 0 0 0-.97-1.71l-3-1.8a2 2 0 0 0-2.06 0l-3 1.8Z" /><path d="M12 8 7.26 5.15" /><path d="m12 8 4.74-2.85" /><path d="M12 13.5V8" /></svg>
                    Collections
                </div>
                <div className="nav__item">
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