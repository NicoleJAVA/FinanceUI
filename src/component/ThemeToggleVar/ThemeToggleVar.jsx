// ThemeToggleVar.jsx
import { useState, useEffect } from 'react';

const ThemeToggleVar = () => {
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    return (
        <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
            切換主題（目前：{theme}）
        </button>
    );
};

export default ThemeToggleVar;