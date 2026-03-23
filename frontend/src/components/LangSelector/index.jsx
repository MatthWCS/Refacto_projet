import { useTranslation } from "react-i18next"
import { languages } from "../../i18n/config.js"

export const LangSelector = () => {

    const { i18n } = useTranslation()

    const { language, changeLanguage } = i18n

    return (
        <select
            onChange={(e) => changeLanguage(e.target.value)}
            value={language}
        >
            {languages.map(lang => (
                <option
                    key={lang}
                    value={lang}
                >
                    {lang}
                </option>
            ))}
        </select>
    )
}