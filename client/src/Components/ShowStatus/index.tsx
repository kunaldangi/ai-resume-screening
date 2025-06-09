import { useEffect, useState } from 'react';
import './style.css';

export function ShowStatus({ type, message, close }: { type?: string; message?: string; close?: () => void; }) {
    const [closing, setClosing] = useState(false);

    useEffect(() => {
        if (closing) { // if user clicked on close button
            const timer = setTimeout(() => close?.(), 300); // wait for 300ms for fade-out animation to complete before closing
            return () => clearTimeout(timer);
        }
    }, [closing, close]);

    return (
        <div className={`status ${closing ? 'fade-out' : 'fade-in'}`}>
            <div className="status__content">
                <div className="status__close">
                    <svg onClick={() => setClosing(true)} xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x-icon lucide-x" >
                        <path d="M18 6 6 18" />
                        <path d="m6 6 12 12" />
                    </svg>
                </div>
                <div className="status__message">
                    <div>
                        {type === 'success' && (
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="var(--primary-color)" viewBox="0 0 24 24">
                                <path d="M9 16.17l-3.88-3.88L4 13.41l5 5 10-10-1.41-1.41z" />
                            </svg>
                        )}
                        {type === 'warn' && (
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="var(--primary-color)" viewBox="0 0 24 24">
                                <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
                            </svg>
                        )}
                        {type === 'error' && (
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="var(--primary-color)" viewBox="0 0 24 24">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z" />
                            </svg>
                        )}
                        {type === 'info' && (
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="var(--primary-color)" viewBox="0 0 24 24">
                                <path d="M11 17h2v-6h-2v6zm0-8h2V7h-2v2zm1-7C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
                            </svg>
                        )}
                    </div>
                    {message}
                </div>
            </div>
        </div>
    );
}
