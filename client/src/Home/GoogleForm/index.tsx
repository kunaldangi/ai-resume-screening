import { useEffect } from 'react';
import './style.css';

export default function GoogleForm() {

    async function getGoogleForms() {
        // const response = await fetch('')
    }

    useEffect(() => {
        getGoogleForms();
    }, []);

    return (<>
        Under Development!
    </>)
}