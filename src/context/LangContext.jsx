import { createContext, useContext } from 'react';
import { TRANSLATIONS } from '../i18n';

const LangContext = createContext({ t: TRANSLATIONS.he, lang: "he" });
export { LangContext };
export function useLang() { return useContext(LangContext); }
