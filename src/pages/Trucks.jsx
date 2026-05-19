/**
 * pages/Trucks.jsx
 * ─────────────────
 * Lists all available truck providers.
 * Includes search and filter by truck type.
 */

import { useState } from 'react'
import { Search, SlidersHorizontal } from 'lucide-react'
import { useLang } from '../context/LanguageContext'
import { useTrucks } from '../hooks'
import TruckCard from '../components/trucks/TruckCard'
import { Spinner, EmptyState } from '../components/ui'

const TRUCK_TYPES = ['Tous', 'Pickup', '3T', '5T', '10T', 'Utilitaire']

export default function Trucks() {
  const { t } = useLang()
  const [search, setSearch] = useState('')
  const [selectedType, setSelectedType] = useState('Tous')

  const { trucks, loading, error } = useTrucks({ available: false })

  // Filter locally by search text and truck type
  const filtered = trucks.filter((truck) => {
    const matchesSearch =
      truck.title.toLowerCase().includes(search.toLowerCase()) ||
      truck.description?.toLowerCase().includes(search.toLowerCase()) ||
      truck.city?.toLowerCase().includes(search.toLowerCase())

    const matchesType =
      selectedType === 'Tous' ||
      truck.truck_type?.toLowerCase() === selectedType.toLowerCase()

    return matchesSearch && matchesType
  })

  return (
    <div className="page-enter max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

      {/* ── Header ── */}
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-brand-charcoal mb-2">
          {t('trucks.title')}
        </h1>
        <p className="text-brand-gray">{t('trucks.subtitle')}</p>
      </div>

      {/* ── Search + Filters ── */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        {/* Search box */}
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-gray" />
          <input
            type="text"
            placeholder="Rechercher par ville, nom..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-10"
          />
        </div>

        {/* Type filter pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <SlidersHorizontal size={16} className="text-brand-gray flex-shrink-0" />
          {TRUCK_TYPES.map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-3.5 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all flex-shrink-0 ${
                selectedType === type
                  ? 'bg-brand-orange text-white shadow-orange'
                  : 'bg-white border border-brand-gray-border text-brand-charcoal hover:bg-brand-gray-bg'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* ── Results count ── */}
      {!loading && (
        <p className="text-sm text-brand-gray mb-5">
          {filtered.length} prestataire{filtered.length !== 1 ? 's' : ''} trouvé{filtered.length !== 1 ? 's' : ''}
        </p>
      )}

      {/* ── Loading state ── */}
      {loading && (
        <div className="flex justify-center py-20">
          <Spinner size={32} />
        </div>
      )}

      {/* ── Error state ── */}
      {error && (
        <div className="text-center py-10 text-red-500 text-sm">{error}</div>
      )}

      {/* ── Empty state ── */}
      {!loading && !error && filtered.length === 0 && (
        <EmptyState
          icon={Search}
          title="Aucun résultat"
          subtitle="Essayez d'autres filtres ou revenez plus tard."
        />
      )}

      {/* ── Truck grid ── */}
      {!loading && !error && filtered.length > 0 && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((truck) => (
            <TruckCard key={truck.id} truck={truck} />
          ))}
        </div>
      )}
    </div>
  )
}
