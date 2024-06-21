import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import ru from './locales/ru.js';
import en from './locales/en.js';

i18next 
  .use(initReactI18next)
  .use(LanguageDetector)
  .init({
    resources: {
      ru,
      en,
    },
    fallbackLng: 'ru',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18next;