import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import uk from './locales/uk.json'
import en from './locales/en.json'
import de from './locales/de.json'

i18n
  .use(initReactI18next)
  .init({
    resources: { uk: { translation: uk }, en: { translation: en }, de: { translation: de } },
    lng: 'uk',
    fallbackLng: 'en',
    interpolation: { escapeValue: false }
  })

export default i18n
