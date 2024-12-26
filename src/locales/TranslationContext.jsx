// // TranslationContext.jsx todo dele
// import React, { createContext, useContext } from 'react';
// import { useTranslation } from 'react-i18next';

// // 創建 Context
// const TranslationContext = createContext();

// export const TranslationProvider = ({ children }) => {
//     const { t } = useTranslation(); // 確保 useTranslation 被正確使用

//     return (
//         <TranslationContext.Provider value={{ t }}>
//             {children}
//         </TranslationContext.Provider>
//     );
// };

// // 使用 Context
// export const useTranslationContext = () => useContext(TranslationContext);


// // import React, { createContext, useContext } from 'react'; todo dele
// // import { useTranslation } from 'react-i18next';

// // // 創建 Context
// // const TranslationContext = createContext();

// // // 定義 Provider
// // export const TranslationProvider = ({ children }) => {
// //     const { t } = useTranslation();

// //     // 在 React 的原型鏈上註冊 $t
// //     window.t = t;

// //     // if (typeof window !== 'undefined') {
// //     //     // 這是給瀏覽器環境下的 global 註冊 t
// //     //     window.$t = t;

// //     // }

// //     return (
// //         <TranslationContext.Provider value={{ t }}>
// //             {children}
// //         </TranslationContext.Provider>
// //     );
// // };

// // // 這部分是如果您需要在組件中直接使用 t() 來獲取翻譯
// // export const useTranslationContext = () => useContext(TranslationContext);
