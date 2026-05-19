/**
 * components/layout/Navbar.jsx
 * ──────────────────────────────
 * Top navigation bar. Shows logo, links, language switcher, and auth buttons.
 * Collapses to a hamburger menu on mobile.
 */

import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Truck, Menu, X, LogOut, User } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useLang } from '../../context/LanguageContext'
import { Button } from '../ui'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { user, profile, signOut } = useAuth()
  const { t, lang, setLang } = useLang()
  const location = useLocation()
  const navigate = useNavigate()

  const isActive = (path) => location.pathname === path

  const navLinks = [
    { to: '/', label: t('nav.home') },
    { to: '/trucks', label: t('nav.trucks') },
  ]

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-brand-gray-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* ── Logo ── */}
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-brand-orange rounded-xl flex items-center justify-center shadow-orange">
              <Truck size={20} className="text-white" />
            </div>
            <span className="font-display font-bold text-xl tracking-widest text-brand-charcoal">
              HONDATI
            </span>
          </Link>

          {/* ── Desktop Links ── */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive(link.to)
                    ? 'bg-orange-50 text-brand-orange'
                    : 'text-brand-charcoal hover:bg-brand-gray-bg'
                }`}
              >
                {link.label}
              </Link>
            ))}
            {user && (
              <Link
                to="/dashboard"
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive('/dashboard')
                    ? 'bg-orange-50 text-brand-orange'
                    : 'text-brand-charcoal hover:bg-brand-gray-bg'
                }`}
              >
                {t('nav.dashboard')}
              </Link>
            )}
          </div>

          {/* ── Right Side ── */}
          <div className="hidden md:flex items-center gap-3">
            {/* Language switcher */}
            <button
              onClick={() => setLang(lang === 'fr' ? 'ar' : 'fr')}
              className="text-xs font-medium text-brand-gray hover:text-brand-charcoal border border-brand-gray-border rounded-lg px-3 py-1.5 transition-colors"
            >
              {lang === 'fr' ? 'عربية' : 'Français'}
            </button>

            {user ? (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-brand-gray-bg rounded-xl">
                  <div className="w-6 h-6 bg-brand-orange rounded-full flex items-center justify-center">
                    <User size={12} className="text-white" />
                  </div>
                  <span className="text-sm font-medium text-brand-charcoal">
                    {profile?.full_name?.split(' ')[0]}
                  </span>
                </div>
                <Button variant="ghost" size="sm" onClick={handleSignOut}>
                  <LogOut size={16} />
                </Button>
              </div>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="secondary" size="sm">{t('nav.login')}</Button>
                </Link>
                <Link to="/signup">
                  <Button variant="primary" size="sm">{t('nav.signup')}</Button>
                </Link>
              </>
            )}
          </div>

          {/* ── Mobile Menu Toggle ── */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-brand-gray-bg"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* ── Mobile Menu ── */}
      {menuOpen && (
        <div className="md:hidden border-t border-brand-gray-border bg-white px-4 py-3 flex flex-col gap-2">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMenuOpen(false)}
              className={`px-3 py-2.5 rounded-lg text-sm font-medium ${
                isActive(link.to)
                  ? 'bg-orange-50 text-brand-orange'
                  : 'text-brand-charcoal hover:bg-brand-gray-bg'
              }`}
            >
              {link.label}
            </Link>
          ))}
          {user && (
            <Link
              to="/dashboard"
              onClick={() => setMenuOpen(false)}
              className="px-3 py-2.5 rounded-lg text-sm font-medium text-brand-charcoal hover:bg-brand-gray-bg"
            >
              {t('nav.dashboard')}
            </Link>
          )}
          <div className="flex gap-2 pt-2 border-t border-brand-gray-border">
            <button
              onClick={() => { setLang(lang === 'fr' ? 'ar' : 'fr'); setMenuOpen(false) }}
              className="flex-1 text-sm text-center py-2 rounded-lg border border-brand-gray-border hover:bg-brand-gray-bg"
            >
              {lang === 'fr' ? 'عربية' : 'Français'}
            </button>
            {user ? (
              <Button variant="secondary" size="sm" className="flex-1" onClick={handleSignOut}>
                {t('nav.logout')}
              </Button>
            ) : (
              <>
                <Link to="/login" className="flex-1" onClick={() => setMenuOpen(false)}>
                  <Button variant="secondary" size="sm" className="w-full">{t('nav.login')}</Button>
                </Link>
                <Link to="/signup" className="flex-1" onClick={() => setMenuOpen(false)}>
                  <Button variant="primary" size="sm" className="w-full">{t('nav.signup')}</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
