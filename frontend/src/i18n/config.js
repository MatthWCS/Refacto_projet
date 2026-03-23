import i18n from "i18next"
import { initReactI18next } from "react-i18next"
import LanguageDetector from "i18next-browser-languagedetector"

import translationEn from "./locales/en/translation"
import translationFr from "./locales/fr/translation"

export const languages = ["en", "fr"]

i18n
    .use(initReactI18next)
    .use(LanguageDetector)
    .init({
        resources: {
            en: {
                translation: translationEn
            },
            fr: {
                translation: translationFr
            }
        },
        fallback: "en",
        debug: true
    })

document.documentElement.lang = i18n.language

export default i18n