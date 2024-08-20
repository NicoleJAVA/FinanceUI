import React from 'react';
import { useTheme } from '../../context/ThemeContext';

const ThemeToggle = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <div className="form-check form-switch d-flex flex-column align-items-center">
            <input
                className="form-check-input"
                type="checkbox"
                id="themeToggle"
                checked={theme === 'dark'}
                onChange={toggleTheme}
            />

        </div>
    );
};

export default ThemeToggle;