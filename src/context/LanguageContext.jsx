/**
 * context/LanguageContext.jsx
 * ────────────────────────────
 * Provides the current language (fr/ar) to every component.
 * Wrap the app with <LanguageProvider> and use useLang() anywhere.
 *
 * t('home.title') → looks up translations[lang]['home']['title']
 */

import { createContext, useContext, useState } from 'react'
import { translations } from '../i18n/translations'

const LanguageContext = createContext(null)

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState('fr') // default: French

  // t('home.title') → translations.fr.home.title
  const t = (key) => {
    const parts = key.split('.')
    let value = translations[lang]
    for (const part of parts) {
      value = value?.[part]
    }
    return value || key // fallback to key if not found
  }

  const isRTL = lang === 'ar'

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, isRTL }}>
      <div dir={isRTL ? 'rtl' : 'ltr'}>
        {children}
      </div>
    </LanguageContext.Provider>
  )
}

// Hook: const { t, lang, setLang } = useLang()
export function useLang() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLang must be used inside <LanguageProvider>')
  return ctx
}
