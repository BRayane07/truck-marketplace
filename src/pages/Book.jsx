/**
 * pages/Book.jsx
 * ───────────────
 * Customer form to request a truck/moving service.
 * Fetches the specific truck from Supabase, shows its info,
 * and lets the customer fill out moving details.
 */

import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, Truck, CheckCircle } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { useLang } from '../context/LanguageContext'
import { Button, Input, Textarea, Select, Alert, Spinner, Badge } from '../components/ui'
import { notify } from '../lib/notify'

export default function Book() {
  const { id } = useParams() // truck ID from URL: /book/:id
  const { user } = useAuth()
  const { t } = useLang()
  const navigate = useNavigate()

  const [truck, setTruck] = useState(null)
  const [loadingTruck, setLoadingTruck] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [successWallet, setSuccessWallet] = useState(false)
  const [loadError, setLoadError] = useState('')

  // Form state
  const [form, setForm] = useState({
    pickup_address: '',
    dropoff_address: '',
    moving_date: '',
    items_description: '',
    floors: '0',
    needs_helpers: false,
    payment_method: 'cash',
    notes: '',
  })

  // ── Fetch truck info ──
  useEffect(() => {
    async function loadTruck() {
      setLoadingTruck(true)
      setLoadError('')
      const { data, error: err } = await supabase
        .from('trucks')
        .select('*, profiles(full_name, phone)')
        .eq('id', id)
        .single()

      setLoadingTruck(false)
      if (err) {
        setLoadError(err.message)
        setTruck(null)
        return
      }
      setTruck(data)
    }
    if (id) loadTruck()
  }, [id])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!user) { navigate('/login'); return }
    setLoading(true)
    setError('')

    const isWallet = form.payment_method === 'wallet'

    const { error: err } = await supabase.from('bookings').insert({
      customer_id: user.id,
      truck_id: id,
      pickup_address: form.pickup_address,
      dropoff_address: form.dropoff_address,
      moving_date: form.moving_date,
      items_description: form.items_description,
      floors: parseInt(form.floors) || 0,
      needs_helpers: form.needs_helpers,
      payment_method: form.payment_method,
      payment_status: isWallet ? 'pending' : 'unpaid',
      notes: form.notes,
      status: 'pending',
    })

    setLoading(false)
    if (err) {
      setError(err.message)
      notify.error(err.message)
    } else {
      setSuccessWallet(isWallet)
      setSuccess(true)
      notify.success(t('toast.booking_sent'))
    }
  }

  if (loadingTruck) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Spinner size={36} />
      </div>
    )
  }

  if (!truck) {
    return (
      <div className="text-center py-20 px-4">
        <Alert message={loadError || 'Camionneur introuvable.'} />
        <Link to="/trucks" className="text-brand-orange text-sm font-medium mt-4 inline-block">
          ← Voir tous les camionneurs
        </Link>
      </div>
    )
  }

  // ── Success screen ──
  if (success) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center page-enter">
        <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle size={32} className="text-green-600" />
        </div>
        <h2 className="font-display text-2xl font-bold text-brand-charcoal mb-2">
          Demande envoyée !
        </h2>
        <p className="text-brand-gray mb-6">
          {successWallet ? t('booking.wallet_success_note') : t('booking.success')}
        </p>
        <div className="flex gap-3 justify-center">
          <Link to="/dashboard">
            <Button variant="primary">Voir mes réservations</Button>
          </Link>
          <Link to="/trucks">
            <Button variant="secondary">Retour</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="page-enter max-w-2xl mx-auto px-4 sm:px-6 py-10">

      {/* ── Back button ── */}
      <Link to="/trucks" className="inline-flex items-center gap-1.5 text-sm text-brand-gray hover:text-brand-charcoal mb-6">
        <ArrowLeft size={16} />
        {t('general.back')}
      </Link>

      <h1 className="font-display text-2xl font-bold text-brand-charcoal mb-2">
        {t('booking.title')}
      </h1>

      {/* ── Truck info card ── */}
      <div className="bg-brand-charcoal rounded-2xl p-4 mb-6 flex items-center gap-3">
        <div className="w-10 h-10 bg-brand-orange rounded-xl flex items-center justify-center flex-shrink-0">
          <Truck size={20} className="text-white" />
        </div>
        <div>
          <p className="text-white font-medium text-sm">{truck.title}</p>
          <p className="text-white/50 text-xs">{truck.truck_type} · {truck.city}</p>
        </div>
      </div>

      {/* ── Booking Form ── */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">

        <Input
          label={t('booking.pickup')}
          name="pickup_address"
          required
          placeholder="Ex: 12 Rue Hassan II, Casablanca"
          value={form.pickup_address}
          onChange={handleChange}
        />

        <Input
          label={t('booking.dropoff')}
          name="dropoff_address"
          required
          placeholder="Ex: Hay Hassani, Casablanca"
          value={form.dropoff_address}
          onChange={handleChange}
        />

        <Input
          label={t('booking.date')}
          name="moving_date"
          type="date"
          required
          min={new Date().toISOString().split('T')[0]}
          value={form.moving_date}
          onChange={handleChange}
        />

        <Textarea
          label={t('booking.items')}
          name="items_description"
          placeholder="Ex: Canapé, réfrigérateur, 10 cartons..."
          value={form.items_description}
          onChange={handleChange}
        />

        <Select
          label={t('booking.floors')}
          name="floors"
          value={form.floors}
          onChange={handleChange}
          options={[
            { value: '0', label: 'Rez-de-chaussée' },
            { value: '1', label: '1er étage' },
            { value: '2', label: '2ème étage' },
            { value: '3', label: '3ème étage' },
            { value: '4', label: '4ème étage et +' },
          ]}
        />

        {/* Helpers checkbox */}
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            name="needs_helpers"
            checked={form.needs_helpers}
            onChange={handleChange}
            className="w-5 h-5 rounded accent-brand-orange"
          />
          <span className="text-sm font-medium text-brand-charcoal">
            {t('booking.helpers')}
          </span>
        </label>

        {/* Payment method */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-brand-charcoal">
            {t('booking.payment')}
          </label>
          <div className="grid grid-cols-2 gap-3">
            {[
              { value: 'cash', label: t('booking.cash'), emoji: '💵' },
              { value: 'wallet', label: t('booking.wallet'), emoji: '💳', soon: true },
            ].map((pm) => (
              <button
                key={pm.value}
                type="button"
                onClick={() => setForm({ ...form, payment_method: pm.value })}
                className={`p-3 rounded-xl border-2 text-sm font-medium transition-all flex flex-col items-start gap-1 ${
                  form.payment_method === pm.value
                    ? 'border-brand-orange bg-orange-50 text-brand-orange'
                    : 'border-brand-gray-border bg-white text-brand-charcoal hover:bg-brand-gray-bg'
                }`}
              >
                <span className="flex items-center gap-2">
                  <span>{pm.emoji}</span> {pm.label}
                </span>
                {pm.soon && (
                  <Badge variant="orange" className="text-[10px]">
                    {t('booking.wallet_soon')}
                  </Badge>
                )}
              </button>
            ))}
          </div>
        </div>

        <Textarea
          label={`${t('booking.notes')} (optionnel)`}
          name="notes"
          placeholder="Informations supplémentaires pour le camionneur..."
          value={form.notes}
          onChange={handleChange}
        />

        <Alert message={error} />

        {!user && (
          <Alert
            message="Vous devez être connecté pour faire une réservation."
            type="info"
          />
        )}

        <Button
          type="submit"
          loading={loading}
          variant="primary"
          size="lg"
          className="w-full"
          disabled={!user}
        >
          {t('booking.submit')}
        </Button>
      </form>
    </div>
  )
}
