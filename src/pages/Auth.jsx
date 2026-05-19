/**
 * pages/Auth.jsx
 * ───────────────
 * Two pages in one file: Login and Signup.
 * - Login: email + password → redirects to dashboard
 * - Signup: collects name, phone, email, password, role (customer/provider)
 */

import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Truck, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useLang } from '../context/LanguageContext'
import { Button, Input, Alert } from '../components/ui'
import { notify } from '../lib/notify'

// ─── Shared form wrapper ──────────────────────────────────
function AuthCard({ children, title, subtitle }) {
  return (
    <div className="min-h-screen bg-brand-gray-bg flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2.5 mb-8">
          <div className="w-10 h-10 bg-brand-orange rounded-xl flex items-center justify-center shadow-orange">
            <Truck size={22} className="text-white" />
          </div>
          <span className="font-display font-bold text-2xl tracking-widest text-brand-charcoal">
            HONDATI
          </span>
        </div>

        <div className="bg-white rounded-2xl shadow-card p-8">
          <h1 className="font-display text-2xl font-bold text-brand-charcoal mb-1">{title}</h1>
          <p className="text-sm text-brand-gray mb-6">{subtitle}</p>
          {children}
        </div>
      </div>
    </div>
  )
}

// ─── LOGIN PAGE ───────────────────────────────────────────
export function Login() {
  const { signIn } = useAuth()
  const { t } = useLang()
  const navigate = useNavigate()

  const [form, setForm] = useState({ email: '', password: '' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error: err } = await signIn(form)
    setLoading(false)

    if (err) {
      setError('Email ou mot de passe incorrect.')
      notify.error('Email ou mot de passe incorrect.')
    } else {
      notify.success(t('toast.login_success'))
      navigate('/dashboard')
    }
  }

  return (
    <AuthCard title={t('auth.login_title')} subtitle={t('auth.login_subtitle')}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          label={t('auth.email')}
          name="email"
          type="email"
          required
          placeholder="votre@email.com"
          value={form.email}
          onChange={handleChange}
        />

        {/* Password with show/hide toggle */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-brand-charcoal">{t('auth.password')}</label>
          <div className="relative">
            <input
              name="password"
              type={showPass ? 'text' : 'password'}
              required
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              className="input-field pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-gray hover:text-brand-charcoal"
            >
              {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <Alert message={error} />

        <Button type="submit" loading={loading} variant="primary" className="w-full mt-1">
          {t('auth.submit_login')}
        </Button>

        <p className="text-center text-sm text-brand-gray">
          {t('auth.no_account')}{' '}
          <Link to="/signup" className="text-brand-orange font-medium hover:underline">
            {t('nav.signup')}
          </Link>
        </p>
      </form>
    </AuthCard>
  )
}

// ─── SIGNUP PAGE ──────────────────────────────────────────
export function Signup() {
  const { signUp } = useAuth()
  const { t } = useLang()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    full_name: '',
    phone: '',
    email: '',
    password: '',
    role: 'customer', // 'customer' or 'provider'
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (form.password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères.')
      setLoading(false)
      return
    }

    const { error: err } = await signUp(form)
    setLoading(false)

    if (err) {
      setError(err.message)
      notify.error(err.message)
    } else {
      setSuccess('Compte créé ! Vérifiez votre email pour confirmer.')
      setTimeout(() => navigate('/dashboard'), 2000)
    }
  }

  return (
    <AuthCard title={t('auth.signup_title')} subtitle="Rejoignez HONDATI gratuitement">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">

        {/* ── Role selection ── */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { value: 'customer', label: t('auth.role_customer'), emoji: '📦' },
            { value: 'provider', label: t('auth.role_provider'), emoji: '🚛' },
          ].map((r) => (
            <button
              key={r.value}
              type="button"
              onClick={() => setForm({ ...form, role: r.value })}
              className={`p-3.5 rounded-xl border-2 text-center transition-all ${
                form.role === r.value
                  ? 'border-brand-orange bg-orange-50'
                  : 'border-brand-gray-border bg-white hover:bg-brand-gray-bg'
              }`}
            >
              <div className="text-2xl mb-1">{r.emoji}</div>
              <p className={`text-xs font-medium leading-tight ${
                form.role === r.value ? 'text-brand-orange' : 'text-brand-charcoal'
              }`}>
                {r.label}
              </p>
            </button>
          ))}
        </div>

        <Input
          label={t('auth.full_name')}
          name="full_name"
          required
          placeholder="Mohammed Alami"
          value={form.full_name}
          onChange={handleChange}
        />

        <Input
          label={t('auth.phone')}
          name="phone"
          type="tel"
          placeholder="+212 6XX XXX XXX"
          value={form.phone}
          onChange={handleChange}
        />

        <Input
          label={t('auth.email')}
          name="email"
          type="email"
          required
          placeholder="votre@email.com"
          value={form.email}
          onChange={handleChange}
        />

        <Input
          label={t('auth.password')}
          name="password"
          type="password"
          required
          placeholder="Min. 6 caractères"
          value={form.password}
          onChange={handleChange}
        />

        <Alert message={error} />
        <Alert message={success} type="success" />

        <Button type="submit" loading={loading} variant="primary" className="w-full mt-1">
          {t('auth.submit_signup')}
        </Button>

        <p className="text-center text-sm text-brand-gray">
          {t('auth.has_account')}{' '}
          <Link to="/login" className="text-brand-orange font-medium hover:underline">
            {t('nav.login')}
          </Link>
        </p>
      </form>
    </AuthCard>
  )
}
