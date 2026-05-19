/**
 * pages/Home.jsx
 * ───────────────
 * Landing page with:
 * - Hero section with CTA buttons
 * - Stats (providers, cities, bookings)
 * - How it works (3 steps)
 * - Featured trucks preview
 */

import { Link } from 'react-router-dom'
import { Truck, Search, CreditCard, ArrowRight, Shield, Star } from 'lucide-react'
import { useLang } from '../context/LanguageContext'
import { Button } from '../components/ui'
import { useTrucks } from '../hooks'
import TruckCard from '../components/trucks/TruckCard'

// ── Stats data ──
const STATS = [
  { value: '120+', key: 'stats_providers' },
  { value: '5',    key: 'stats_cities' },
  { value: '800+', key: 'stats_bookings' },
]

// ── Steps data ──
const STEPS = [
  { icon: Search,     key: 'step1', color: 'bg-orange-50 text-brand-orange' },
  { icon: Truck,      key: 'step2', color: 'bg-blue-50 text-blue-600' },
  { icon: CreditCard, key: 'step3', color: 'bg-green-50 text-green-600' },
]

export default function Home() {
  const { t } = useLang()
  const { trucks, loading } = useTrucks({ available: true })
  const featuredTrucks = trucks.slice(0, 3)

  return (
    <div className="page-enter">

      {/* ══════════════════════════════════════
          HERO SECTION
      ══════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-brand-charcoal text-white">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-10 w-40 h-40 border-2 border-white rounded-full" />
          <div className="absolute bottom-10 right-10 w-64 h-64 border-2 border-white rounded-full" />
          <div className="absolute top-1/2 left-1/2 w-96 h-96 border border-white rounded-full -translate-x-1/2 -translate-y-1/2" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="max-w-2xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5 mb-6">
              <div className="w-2 h-2 bg-brand-orange rounded-full animate-pulse" />
              <span className="text-sm text-white/80">Casablanca & Maroc</span>
            </div>

            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              {t('home.hero_title')}
              <span className="text-brand-orange">.</span>
            </h1>

            <p className="text-lg text-white/70 leading-relaxed mb-8 max-w-lg">
              {t('home.hero_subtitle')}
            </p>

            <div className="flex flex-wrap gap-3">
              <Link to="/trucks">
                <Button variant="primary" size="lg">
                  {t('home.hero_cta')}
                  <ArrowRight size={18} />
                </Button>
              </Link>
              <Link to="/signup">
                <button className="px-7 py-3.5 text-base font-medium text-white border border-white/30 rounded-xl hover:bg-white/10 transition-all">
                  {t('home.hero_cta2')}
                </button>
              </Link>
            </div>

            {/* Trust signals */}
            <div className="flex items-center gap-4 mt-8">
              <div className="flex items-center gap-1.5">
                <Shield size={16} className="text-brand-orange" />
                <span className="text-sm text-white/60">Prestataires vérifiés</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Star size={16} className="text-amber-400" />
                <span className="text-sm text-white/60">Avis clients réels</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          STATS
      ══════════════════════════════════════ */}
      <section className="bg-brand-orange">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-3 gap-4">
            {STATS.map((stat) => (
              <div key={stat.key} className="text-center">
                <p className="font-display text-3xl font-bold text-white">{stat.value}</p>
                <p className="text-sm text-white/75 mt-1">{t(`home.${stat.key}`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          HOW IT WORKS
      ══════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl font-bold text-brand-charcoal mb-3">
            {t('home.how_title')}
          </h2>
          <div className="w-12 h-1 bg-brand-orange rounded-full mx-auto" />
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {STEPS.map((step, i) => {
            const Icon = step.icon
            return (
              <div key={step.key} className="card p-6 text-center relative">
                {/* Step number */}
                <div className="absolute top-4 right-4 w-7 h-7 bg-brand-gray-bg rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-brand-gray">{i + 1}</span>
                </div>

                <div className={`w-14 h-14 ${step.color} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                  <Icon size={26} />
                </div>
                <h3 className="font-display font-semibold text-base text-brand-charcoal mb-2">
                  {t(`home.${step.key}_title`)}
                </h3>
                <p className="text-sm text-brand-gray leading-relaxed">
                  {t(`home.${step.key}_desc`)}
                </p>
              </div>
            )
          })}
        </div>
      </section>

      {/* ══════════════════════════════════════
          FEATURED TRUCKS
      ══════════════════════════════════════ */}
      {featuredTrucks.length > 0 && (
        <section className="bg-brand-gray-bg py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-display text-2xl font-bold text-brand-charcoal">
                Camionneurs disponibles
              </h2>
              <Link to="/trucks" className="flex items-center gap-1 text-sm font-medium text-brand-orange hover:underline">
                {t('general.see_all')} <ArrowRight size={14} />
              </Link>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {featuredTrucks.map((truck) => (
                <TruckCard key={truck.id} truck={truck} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════
          CTA BANNER
      ══════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-brand-charcoal rounded-3xl p-8 md:p-12 text-center text-white">
          <h2 className="font-display text-2xl md:text-3xl font-bold mb-3">
            Vous avez un camion ?
          </h2>
          <p className="text-white/70 mb-6 max-w-md mx-auto">
            Rejoignez notre réseau de camionneurs vérifiés et commencez à gagner dès aujourd'hui.
          </p>
          <Link to="/signup">
            <Button variant="primary" size="lg">
              Rejoindre HONDATI
              <ArrowRight size={18} />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
