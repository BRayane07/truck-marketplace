/**
 * components/reviews/ReviewCard.jsx
 * ───────────────────────────────────
 * Displays a single customer review with rating stars and comment.
 */

import { User } from 'lucide-react'
import { StarRating } from '../ui'

export function ReviewCard({ review }) {
  const date = new Date(review.created_at).toLocaleDateString('fr-MA', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })

  return (
    <div className="card p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          {/* Avatar */}
          <div className="w-9 h-9 bg-brand-charcoal rounded-full flex items-center justify-center">
            <User size={16} className="text-white" />
          </div>
          <div>
            <p className="text-sm font-medium text-brand-charcoal">
              {review.profiles?.full_name || 'Client anonyme'}
            </p>
            <p className="text-xs text-brand-gray">{date}</p>
          </div>
        </div>
        <StarRating rating={review.rating} size={14} />
      </div>

      {review.comment && (
        <p className="text-sm text-brand-gray leading-relaxed">
          "{review.comment}"
        </p>
      )}
    </div>
  )
}

/**
 * components/reviews/ReviewForm.jsx
 * ────────────────────────────────────
 * Form to submit a review after a completed booking.
 */

import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'
import { useLang } from '../../context/LanguageContext'
import { Button, Textarea, Alert, StarRating } from '../ui'
import { notify } from '../../lib/notify'

export function ReviewForm({ truckId, bookingId, onSuccess }) {
  const { user } = useAuth()
  const { t } = useLang()
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!rating) { setError('Veuillez choisir une note.'); return }
    if (!user) { setError('Vous devez être connecté.'); return }

    setLoading(true)
    setError('')

    const { error: err } = await supabase.from('reviews').insert({
      booking_id: bookingId,
      reviewer_id: user.id,
      truck_id: truckId,
      rating,
      comment: comment.trim(),
    })

    setLoading(false)
    if (err) {
      setError(err.message)
      notify.error(err.message)
    } else {
      notify.success(t('toast.review_published'))
      onSuccess?.()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 card p-5">
      <h3 className="font-display font-semibold text-base">{t('reviews.write')}</h3>

      {/* Star picker */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-brand-charcoal">{t('reviews.rating')}</label>
        <StarRating rating={rating} interactive onRate={setRating} size={28} />
      </div>

      <Textarea
        label={t('reviews.comment')}
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Partagez votre expérience..."
      />

      <Alert message={error} />

      <Button type="submit" loading={loading} variant="primary">
        {t('reviews.submit')}
      </Button>
    </form>
  )
}
