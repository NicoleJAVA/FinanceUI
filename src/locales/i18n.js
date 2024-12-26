import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import enJson from './en.json';  // 導入英文 JSON
import zhJson from './zh.json';  // 導入中文 JSON
i18n
    .use(initReactI18next)
    .init({
        resources: {
            en: {
                translation: enJson,  // 使用英文 JSON
            },
            zh: {
                translation: zhJson,  // 使用中文 JSON
            },
        },
        lng: "zh",
        fallbackLng: "zh",
        interpolation: {
            escapeValue: false
        }
    });

export default i18n;
