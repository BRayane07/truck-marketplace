import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { LanguageProvider, useLang } from './LanguageContext'

function Probe() {
  const { t, lang, setLang, isRTL } = useLang()
  return (
    <div>
      <span data-testid="title">{t('home.hero_title')}</span>
      <span data-testid="lang">{lang}</span>
      <span data-testid="rtl">{isRTL ? 'yes' : 'no'}</span>
      <button type="button" onClick={() => setLang('ar')}>
        Switch
      </button>
    </div>
  )
}

describe('LanguageContext', () => {
  it('returns French translation by default', () => {
    render(
      <LanguageProvider>
        <Probe />
      </LanguageProvider>
    )
    expect(screen.getByTestId('title')).toHaveTextContent('Déménagez en toute sérénité')
    expect(screen.getByTestId('lang')).toHaveTextContent('fr')
    expect(screen.getByTestId('rtl')).toHaveTextContent('no')
  })

  it('falls back to key when missing', () => {
    function MissingKey() {
      const { t } = useLang()
      return <span>{t('nonexistent.key')}</span>
    }
    render(
      <LanguageProvider>
        <MissingKey />
      </LanguageProvider>
    )
    expect(screen.getByText('nonexistent.key')).toBeInTheDocument()
  })
})
