import React, { createContext, useContext } from 'react';

const DateContext = createContext(null);

export const DateProvider = ({ children }) => {
    const $date = (date) => {
        if (typeof date === 'string') {
            date = new Date(date);
        }

        if (!(date instanceof Date) || isNaN(date)) {
            throw new Error('Invalid date');
        }

        const year = date.getFullYear();
        const month = date.getMonth() + 1; // 月份從 0 開始，所以加 1
        const day = date.getDate();

        return `${year}/${month}/${day}`;
    };

    return (
        <DateContext.Provider value={$date}>
            {children}
        </DateContext.Provider>
    );
};

export const useDate = () => useContext(DateContext);