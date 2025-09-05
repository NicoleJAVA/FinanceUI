// ThemeToggleVar.jsx
import { useState, useEffect } from 'react';

const ThemeToggleVar = () => {
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');

    useEffect(() => {
        const theme = localStorage.getItem('theme') || 'dark';
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }, []);

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    return (
        <button className='btn btn-secondary ms-5' onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
            切換主題（目前：{theme}）
        </button>
    );
};

export default ThemeToggleVar;