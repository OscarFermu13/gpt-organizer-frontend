import { translations } from './translations.jsx';

const LANG_STORAGE_KEY = 'preferredLanguage';

let currentLang = localStorage.getItem(LANG_STORAGE_KEY) || 'en';
let t = createTranslator(currentLang);

// Crea una función que accede a textos anidados como 'auth.login'
function createTranslator(lang) {
    return translations[lang];
}

// Cambia el idioma y actualiza la traducción actual
function setLanguage(lang) {
  if (!translations[lang]) {
    console.warn(`Unsupported language: ${lang}`);
    return;
  }

  currentLang = lang;
  localStorage.setItem(LANG_STORAGE_KEY, lang);
  t = createTranslator(lang);
}

// Devuelve el idioma actual
function getLanguage() {
  return currentLang;
}

// Devuelve la función t actualizada
function getTranslator() {
  return t;
}

export { setLanguage, getLanguage, getTranslator };
