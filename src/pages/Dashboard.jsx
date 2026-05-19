/**
 * pages/Dashboard.jsx
 * ─────────────────────
 * Unified dashboard for both customers and providers.
 * - Customers see their booking history and status
 * - Providers see incoming booking requests + their truck listings
 */

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Truck, Package, Clock, CheckCircle, XCircle,
  Plus, MessageCircle, Star, User
} from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { useLang } from '../context/LanguageContext'
import { useBookings } from '../hooks'
import { Badge, Button, Spinner, EmptyState, Alert } from '../components/ui'
import { ReviewForm } from '../components/reviews'
import { PaymentInfo } from '../components/bookings/PaymentBadge'
import { notify } from '../lib/notify'

// ── Status badge config ──────────────────────────────────
const STATUS_CONFIG = {
  pending:   { label: 'En attente',  variant: 'gray',   icon: Clock },
  accepted:  { label: 'Acceptée',    variant: 'green',  icon: CheckCircle },
  rejected:  { label: 'Refusée',     variant: 'red',    icon: XCircle },
  completed: { label: 'Terminée',    variant: 'blue',   icon: CheckCircle },
  cancelled: { label: 'Annulée',     variant: 'red',    icon: XCircle },
}

// ── Booking status pill ──────────────────────────────────
function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.pending
  const Icon = cfg.icon
  return (
    <Badge variant={cfg.variant} className="gap-1">
      <Icon size={11} /> {cfg.label}
    </Badge>
  )
}

// ── Booking card for customers ───────────────────────────
function CustomerBookingCard({ booking, onStatusChange }) {
  const [showReview, setShowReview] = useState(false)

  const openWhatsApp = () => {
    const phone = booking.trucks?.whatsapp?.replace(/\D/g, '')
    if (phone) window.open(`https://wa.me/${phone}`, '_blank')
  }

  return (
    <div className="card p-5 flex flex-col gap-3">
      <div className="flex items-start justify-between">
        <div>
          <p className="font-display font-semibold text-base text-brand-charcoal">
            {booking.trucks?.title || 'Camionneur'}
          </p>
          <p className="text-xs text-brand-gray mt-0.5">
            {new Date(booking.created_at).toLocaleDateString('fr-MA')}
          </p>
        </div>
        <StatusBadge status={booking.status} />
      </div>

      <div className="text-sm text-brand-gray space-y-1">
        <p>📍 <span className="text-brand-charcoal">{booking.pickup_address}</span></p>
        <p>🏁 <span className="text-brand-charcoal">{booking.dropoff_address}</span></p>
        <p>📅 {new Date(booking.moving_date).toLocaleDateString('fr-MA', { dateStyle: 'long' })}</p>
        <PaymentInfo booking={booking} isProvider={false} />
      </div>

      <div className="flex gap-2 flex-wrap pt-1">
        {booking.trucks?.whatsapp && (
          <Button variant="whatsapp" size="sm" onClick={openWhatsApp}>
            <MessageCircle size={14} /> WhatsApp
          </Button>
        )}
        {booking.status === 'completed' && (
          <Button variant="secondary" size="sm" onClick={() => setShowReview(!showReview)}>
            <Star size={14} /> Laisser un avis
          </Button>
        )}
        {booking.status === 'pending' && (
          <Button
            variant="ghost"
            size="sm"
            className="text-red-500 hover:bg-red-50"
            onClick={() => onStatusChange(booking.id, 'cancelled')}
          >
            Annuler
          </Button>
        )}
      </div>

      {showReview && (
        <ReviewForm
          truckId={booking.truck_id}
          bookingId={booking.id}
          onSuccess={() => setShowReview(false)}
        />
      )}
    </div>
  )
}

// ── Booking card for providers ───────────────────────────
function ProviderBookingCard({ booking, onStatusChange, onMarkPaid }) {
  return (
    <div className="card p-5 flex flex-col gap-3">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-brand-charcoal rounded-full flex items-center justify-center">
            <User size={16} className="text-white" />
          </div>
          <div>
            <p className="font-medium text-sm text-brand-charcoal">
              {booking.profiles?.full_name || 'Client'}
            </p>
            <p className="text-xs text-brand-gray">{booking.profiles?.phone}</p>
          </div>
        </div>
        <StatusBadge status={booking.status} />
      </div>

      <div className="text-sm text-brand-gray space-y-1 bg-brand-gray-bg rounded-xl p-3">
        <p>📍 {booking.pickup_address}</p>
        <p>🏁 {booking.dropoff_address}</p>
        <p>📅 {new Date(booking.moving_date).toLocaleDateString('fr-MA', { dateStyle: 'long' })}</p>
        {booking.items_description && <p>📦 {booking.items_description}</p>}
        {booking.needs_helpers && <p>👷 Manutentionnaires requis</p>}
        <PaymentInfo
          booking={booking}
          isProvider
          onMarkPaid={
            booking.payment_method === 'wallet' && booking.payment_status === 'pending'
              ? () => onMarkPaid(booking.id)
              : undefined
          }
        />
      </div>

      {booking.status === 'pending' && (
        <div className="flex gap-2">
          <Button
            variant="primary"
            size="sm"
            className="flex-1"
            onClick={() => onStatusChange(booking.id, 'accepted')}
          >
            <CheckCircle size={14} /> Accepter
          </Button>
          <Button
            variant="secondary"
            size="sm"
            className="flex-1 text-red-500 border-red-200 hover:bg-red-50"
            onClick={() => onStatusChange(booking.id, 'rejected')}
          >
            <XCircle size={14} /> Refuser
          </Button>
        </div>
      )}

      {booking.status === 'accepted' && (
        <Button
          variant="secondary"
          size="sm"
          onClick={() => onStatusChange(booking.id, 'completed')}
        >
          Marquer comme terminé
        </Button>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────
// MAIN DASHBOARD
// ─────────────────────────────────────────────────────────
export default function Dashboard() {
  const { user, profile, profileError, loading: authLoading, refetchProfile } = useAuth()
  const { t } = useLang()
  const [myTrucks, setMyTrucks] = useState([])

  const isProvider = profile?.role === 'provider'
  const {
    bookings,
    loading,
    updateBookingStatus,
    updatePaymentStatus,
  } = useBookings(user?.id, profile?.role)

  // Fetch provider's trucks
  useEffect(() => {
    if (isProvider && user) {
      supabase
        .from('trucks')
        .select('*')
        .eq('owner_id', user.id)
        .then(({ data }) => setMyTrucks(data || []))
    }
  }, [isProvider, user])

  const handleStatusChange = async (bookingId, status) => {
    const { error } = await updateBookingStatus(bookingId, status)
    if (error) {
      notify.error(error.message)
    } else {
      notify.success(t('toast.booking_updated'))
    }
  }

  const handleMarkPaid = async (bookingId) => {
    const { error } = await updatePaymentStatus(bookingId, 'paid')
    if (error) {
      notify.error(error.message)
    } else {
      notify.success(t('toast.payment_marked_paid'))
    }
  }

  // Stats
  const stats = {
    total: bookings.length,
    pending: bookings.filter(b => b.status === 'pending').length,
    accepted: bookings.filter(b => b.status === 'accepted').length,
    completed: bookings.filter(b => b.status === 'completed').length,
  }

  if (authLoading) {
    return <div className="flex justify-center py-20"><Spinner size={32} /></div>
  }

  if (!user) {
    return null
  }

  if (!profile) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <Alert message={profileError || t('dashboard.profile_missing')} type="error" />
        <Button
          variant="primary"
          className="mt-4"
          onClick={() => refetchProfile().then(({ error }) => {
            if (error) notify.error(error.message)
            else notify.success(t('toast.profile_loaded'))
          })}
        >
          {t('general.retry')}
        </Button>
      </div>
    )
  }

  return (
    <div className="page-enter max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

      {/* ── Header ── */}
      <div className="flex items-start justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-brand-charcoal">
            Bonjour, {profile.full_name?.split(' ')[0]} 👋
          </h1>
          <p className="text-brand-gray text-sm mt-1">
            {isProvider ? 'Tableau de bord prestataire' : 'Tableau de bord client'}
          </p>
        </div>

        {isProvider && (
          <Link to="/trucks/new">
            <Button variant="primary">
              <Plus size={16} /> Ajouter un camion
            </Button>
          </Link>
        )}
      </div>

      {/* ── Stats cards ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total', value: stats.total, color: 'text-brand-charcoal' },
          { label: 'En attente', value: stats.pending, color: 'text-amber-500' },
          { label: 'Acceptées', value: stats.accepted, color: 'text-green-600' },
          { label: 'Terminées', value: stats.completed, color: 'text-blue-600' },
        ].map((s) => (
          <div key={s.label} className="bg-brand-gray-bg rounded-2xl p-4 text-center">
            <p className={`font-display text-3xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-brand-gray mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">

        {/* ── Bookings list ── */}
        <div className="lg:col-span-2">
          <h2 className="font-display font-semibold text-lg text-brand-charcoal mb-4">
            {isProvider ? 'Demandes reçues' : 'Mes réservations'}
          </h2>

          {loading ? (
            <div className="flex justify-center py-10"><Spinner /></div>
          ) : bookings.length === 0 ? (
            <EmptyState
              icon={Package}
              title="Aucune réservation"
              subtitle={isProvider
                ? 'Vous recevrez des demandes ici quand des clients réserveront.'
                : 'Vous n\'avez pas encore fait de réservation.'}
              action={
                !isProvider && (
                  <Link to="/trucks">
                    <Button variant="primary">Trouver un camionneur</Button>
                  </Link>
                )
              }
            />
          ) : (
            <div className="flex flex-col gap-4">
              {bookings.map((booking) =>
                isProvider ? (
                  <ProviderBookingCard
                    key={booking.id}
                    booking={booking}
                    onStatusChange={handleStatusChange}
                    onMarkPaid={handleMarkPaid}
                  />
                ) : (
                  <CustomerBookingCard
                    key={booking.id}
                    booking={booking}
                    onStatusChange={handleStatusChange}
                  />
                )
              )}
            </div>
          )}
        </div>

        {/* ── Sidebar ── */}
        <div className="flex flex-col gap-5">

          {/* Profile card */}
          <div className="card p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-brand-orange rounded-2xl flex items-center justify-center">
                <User size={22} className="text-white" />
              </div>
              <div>
                <p className="font-display font-semibold text-brand-charcoal">{profile.full_name}</p>
                <Badge variant={isProvider ? 'orange' : 'blue'}>
                  {isProvider ? '🚛 Prestataire' : '📦 Client'}
                </Badge>
              </div>
            </div>
            <div className="text-sm text-brand-gray space-y-1.5">
              <p>📱 {profile.phone || 'Non renseigné'}</p>
              <p>📍 {profile.city || 'Casablanca'}</p>
            </div>
          </div>

          {/* Provider trucks */}
          {isProvider && (
            <div className="card p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display font-semibold text-base">Mes camions</h3>
                <Link to="/trucks/new">
                  <Button variant="ghost" size="sm"><Plus size={14} /></Button>
                </Link>
              </div>

              {myTrucks.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-sm text-brand-gray mb-3">Aucun camion enregistré</p>
                  <Link to="/trucks/new">
                    <Button variant="primary" size="sm">
                      <Plus size={14} /> Ajouter
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {myTrucks.map((truck) => (
                    <div key={truck.id} className="flex items-center gap-3 p-3 bg-brand-gray-bg rounded-xl">
                      <div className="w-9 h-9 bg-brand-orange rounded-xl flex items-center justify-center flex-shrink-0">
                        <Truck size={16} className="text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-brand-charcoal truncate">{truck.title}</p>
                        <p className="text-xs text-brand-gray">{truck.truck_type}</p>
                      </div>
                      <Badge variant={truck.is_available ? 'green' : 'gray'}>
                        {truck.is_available ? '●' : '○'}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
