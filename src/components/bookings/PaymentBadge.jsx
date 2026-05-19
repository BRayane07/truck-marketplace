/**
 * Payment method / status display for booking cards.
 */
import { Badge } from '../ui'

const PAYMENT_STATUS_LABELS = {
  unpaid: { label: 'Non payé', variant: 'gray' },
  pending: { label: 'Paiement en ligne — à venir', variant: 'orange' },
  paid: { label: 'Payé', variant: 'green' },
  failed: { label: 'Échec paiement', variant: 'red' },
}

export function PaymentInfo({ booking, isProvider, onMarkPaid }) {
  const isWallet = booking.payment_method === 'wallet'
  const status = booking.payment_status || (isWallet ? 'pending' : 'unpaid')
  const cfg = PAYMENT_STATUS_LABELS[status] || PAYMENT_STATUS_LABELS.unpaid

  return (
    <div className="flex flex-wrap items-center gap-2 text-sm">
      <span className="text-brand-gray">
        💵 {booking.payment_method === 'cash' ? 'Espèces' : 'Paiement en ligne'}
      </span>
      {isWallet && (
        <Badge variant={cfg.variant}>{cfg.label}</Badge>
      )}
      {isProvider && isWallet && status === 'pending' && onMarkPaid && (
        <button
          type="button"
          onClick={onMarkPaid}
          className="text-xs text-brand-orange font-medium hover:underline"
        >
          Marquer comme payé
        </button>
      )}
    </div>
  )
}
