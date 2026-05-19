/**
 * components/trucks/TruckCard.jsx
 * ────────────────────────────────
 * Displays a single truck listing with:
 * - Owner info and photo placeholder
 * - Truck specs (type, capacity, price)
 * - Verification badges
 * - Star rating
 * - WhatsApp contact button
 * - Book now button
 */

import { Link } from 'react-router-dom'
import { Truck, MapPin, CheckCircle, MessageCircle, Star } from 'lucide-react'
import { Badge, Button, StarRating } from '../ui'
import { useLang } from '../../context/LanguageContext'

// Opens WhatsApp chat with the provider
function openWhatsApp(phone, truckTitle) {
  const message = encodeURIComponent(
    `Bonjour, j'ai vu votre annonce "${truckTitle}" sur HONDATI. Je suis intéressé(e) par vos services.`
  )
  const cleanPhone = phone?.replace(/\D/g, '') // remove non-digits
  window.open(`https://wa.me/${cleanPhone}?text=${message}`, '_blank')
}

export default function TruckCard({ truck }) {
  const { t } = useLang()

  // Calculate average rating from reviews
  const avgRating = truck.reviews?.length
    ? truck.reviews.reduce((sum, r) => sum + r.rating, 0) / truck.reviews.length
    : 0

  return (
    <div className="card p-5 flex flex-col gap-4">

      {/* ── Header: Owner + Status ── */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          {truck.photos?.[0] ? (
            <img
              src={truck.photos[0]}
              alt=""
              className="w-12 h-12 rounded-2xl object-cover shadow-orange flex-shrink-0"
            />
          ) : (
            <div className="w-12 h-12 bg-brand-orange rounded-2xl flex items-center justify-center shadow-orange flex-shrink-0">
              <Truck size={22} className="text-white" />
            </div>
          )}
          <div>
            <h3 className="font-display font-semibold text-base text-brand-charcoal leading-tight">
              {truck.title}
            </h3>
            <p className="text-xs text-brand-gray mt-0.5 flex items-center gap-1">
              <MapPin size={11} />
              {truck.city || t('general.casablanca')}
            </p>
          </div>
        </div>

        {/* Availability badge */}
        <Badge variant={truck.is_available ? 'green' : 'gray'}>
          {truck.is_available ? t('trucks.available') : t('trucks.unavailable')}
        </Badge>
      </div>

      {/* ── Specs Row ── */}
      <div className="flex items-center gap-2 flex-wrap">
        <Badge variant="gray">
          {truck.truck_type}
        </Badge>
        {truck.capacity_tons && (
          <Badge variant="gray">
            {truck.capacity_tons} {t('trucks.tons')}
          </Badge>
        )}
        {truck.license_verified && (
          <Badge variant="orange">
            <CheckCircle size={11} />
            {t('trucks.verified')}
          </Badge>
        )}
      </div>

      {/* ── Description ── */}
      {truck.description && (
        <p className="text-sm text-brand-gray leading-relaxed line-clamp-2">
          {truck.description}
        </p>
      )}

      {/* ── Pricing ── */}
      <div className="bg-brand-gray-bg rounded-xl px-4 py-3 flex items-center justify-between">
        <div>
          {truck.price_per_km && (
            <p className="text-sm font-semibold text-brand-charcoal">
              {truck.price_per_km} MAD
              <span className="text-xs font-normal text-brand-gray ml-1">/{t('trucks.per_km')}</span>
            </p>
          )}
          {truck.price_flat && (
            <p className="text-xs text-brand-gray">
              {t('trucks.flat_rate')}: {truck.price_flat} MAD
            </p>
          )}
        </div>

        {/* Rating */}
        <div className="flex flex-col items-end gap-0.5">
          <StarRating rating={avgRating} size={14} />
          <p className="text-xs text-brand-gray">
            {truck.reviews?.length || 0} {t('trucks.reviews')}
          </p>
        </div>
      </div>

      {/* ── Actions ── */}
      <div className="flex gap-2 pt-1">
        {/* WhatsApp button */}
        {truck.whatsapp && (
          <Button
            variant="whatsapp"
            size="sm"
            className="flex-1"
            onClick={() => openWhatsApp(truck.whatsapp, truck.title)}
          >
            <MessageCircle size={15} />
            {t('trucks.contact_whatsapp')}
          </Button>
        )}

        {/* Book now */}
        <Link to={`/book/${truck.id}`} className="flex-1">
          <Button variant="primary" size="sm" className="w-full">
            {t('trucks.book_now')}
          </Button>
        </Link>
      </div>
    </div>
  )
}
