/**
 * components/ui/index.jsx
 * ─────────────────────────
 * Reusable UI building blocks used everywhere in the app.
 * Each component accepts className prop for easy customization.
 */

import { Loader2, Star } from 'lucide-react'

// ─── Button ───────────────────────────────────────────────
export function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  className = '',
  ...props
}) {
  const base = 'inline-flex items-center justify-center gap-2 font-medium rounded-xl transition-all duration-150 active:scale-95 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed'

  const variants = {
    primary: 'bg-brand-orange text-white hover:bg-brand-orange-dark shadow-orange focus:ring-2 focus:ring-brand-orange focus:ring-offset-2',
    secondary: 'bg-white text-brand-charcoal border border-brand-gray-border hover:bg-brand-gray-bg',
    ghost: 'text-brand-charcoal hover:bg-brand-gray-bg',
    danger: 'bg-red-500 text-white hover:bg-red-600',
    whatsapp: 'bg-[#25D366] text-white hover:bg-[#1ebe5d]',
  }

  const sizes = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-7 py-3.5 text-base',
  }

  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading && <Loader2 size={16} className="animate-spin" />}
      {children}
    </button>
  )
}

// ─── Input ────────────────────────────────────────────────
export function Input({ label, error, className = '', ...props }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-sm font-medium text-brand-charcoal">
          {label}
        </label>
      )}
      <input
        className={`input-field ${error ? 'border-red-400 focus:ring-red-400' : ''} ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}

// ─── Textarea ─────────────────────────────────────────────
export function Textarea({ label, error, className = '', ...props }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-sm font-medium text-brand-charcoal">
          {label}
        </label>
      )}
      <textarea
        rows={3}
        className={`input-field resize-none ${error ? 'border-red-400' : ''} ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}

// ─── Select ───────────────────────────────────────────────
export function Select({ label, options = [], className = '', ...props }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-sm font-medium text-brand-charcoal">
          {label}
        </label>
      )}
      <select className={`input-field ${className}`} {...props}>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  )
}

// ─── Badge ────────────────────────────────────────────────
export function Badge({ children, variant = 'gray', className = '' }) {
  const variants = {
    orange: 'bg-orange-50 text-brand-orange',
    green: 'bg-green-50 text-green-700',
    gray: 'bg-brand-gray-bg text-brand-gray',
    blue: 'bg-blue-50 text-blue-700',
    red: 'bg-red-50 text-red-600',
  }

  return (
    <span className={`badge ${variants[variant]} ${className}`}>
      {children}
    </span>
  )
}

// ─── Star Rating ──────────────────────────────────────────
export function StarRating({ rating = 0, max = 5, size = 16, interactive = false, onRate }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: max }, (_, i) => (
        <Star
          key={i}
          size={size}
          onClick={() => interactive && onRate?.(i + 1)}
          className={`
            ${i < Math.round(rating) ? 'fill-amber-400 text-amber-400' : 'text-brand-gray-border'}
            ${interactive ? 'cursor-pointer hover:text-amber-400 transition-colors' : ''}
          `}
        />
      ))}
    </div>
  )
}

// ─── Spinner ──────────────────────────────────────────────
export function Spinner({ size = 24, className = '' }) {
  return (
    <Loader2
      size={size}
      className={`animate-spin text-brand-orange ${className}`}
    />
  )
}

// ─── Empty State ──────────────────────────────────────────
export function EmptyState({ icon: Icon, title, subtitle, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      {Icon && (
        <div className="w-14 h-14 bg-brand-gray-bg rounded-2xl flex items-center justify-center mb-4">
          <Icon size={28} className="text-brand-gray" />
        </div>
      )}
      <h3 className="font-display font-semibold text-lg text-brand-charcoal mb-1">{title}</h3>
      {subtitle && <p className="text-sm text-brand-gray mb-6 max-w-xs">{subtitle}</p>}
      {action}
    </div>
  )
}

// ─── Card ─────────────────────────────────────────────────
export function Card({ children, className = '', ...props }) {
  return (
    <div className={`card ${className}`} {...props}>
      {children}
    </div>
  )
}

// ─── Alert ────────────────────────────────────────────────
export function Alert({ message, type = 'error' }) {
  if (!message) return null
  const styles = {
    error: 'bg-red-50 border-red-200 text-red-700',
    success: 'bg-green-50 border-green-200 text-green-700',
    info: 'bg-blue-50 border-blue-200 text-blue-700',
  }
  return (
    <div className={`rounded-xl border px-4 py-3 text-sm ${styles[type]}`}>
      {message}
    </div>
  )
}
