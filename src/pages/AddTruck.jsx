/**
 * pages/AddTruck.jsx
 * ───────────────────
 * Form for providers to add their truck listing.
 */

import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, X } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { useLang } from '../context/LanguageContext'
import { Button, Input, Textarea, Select, Alert } from '../components/ui'
import { uploadTruckPhotos, validateTruckPhotoFile } from '../lib/storage'
import { notify } from '../lib/notify'

const TRUCK_TYPES = [
  { value: 'pickup', label: 'Pickup' },
  { value: '3t', label: 'Camion 3 Tonnes' },
  { value: '5t', label: 'Camion 5 Tonnes' },
  { value: '10t', label: 'Camion 10 Tonnes' },
  { value: 'utilitaire', label: 'Utilitaire' },
]

const CITIES = [
  { value: 'Casablanca', label: 'Casablanca' },
  { value: 'Rabat', label: 'Rabat' },
  { value: 'Marrakech', label: 'Marrakech' },
  { value: 'Fès', label: 'Fès' },
  { value: 'Tanger', label: 'Tanger' },
  { value: 'Agadir', label: 'Agadir' },
]

const MAX_PHOTOS = 5

export default function AddTruck() {
  const { user, profile } = useAuth()
  const { t } = useLang()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    title: '',
    truck_type: 'pickup',
    capacity_tons: '',
    description: '',
    price_per_km: '',
    price_flat: '',
    pricing_type: 'both',
    city: 'Casablanca',
    whatsapp: profile?.phone || '',
    is_available: true,
  })

  const [photoFiles, setPhotoFiles] = useState([])
  const [photoPreviews, setPhotoPreviews] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value })
  }

  const handlePhotoSelect = (e) => {
    const files = Array.from(e.target.files || [])
    if (photoFiles.length + files.length > MAX_PHOTOS) {
      notify.error(`Maximum ${MAX_PHOTOS} photos.`)
      return
    }

    for (const file of files) {
      const err = validateTruckPhotoFile(file)
      if (err) {
        notify.error(err)
        return
      }
    }

    setPhotoFiles((prev) => [...prev, ...files])
    setPhotoPreviews((prev) => [
      ...prev,
      ...files.map((f) => URL.createObjectURL(f)),
    ])
    e.target.value = ''
  }

  const removePhoto = (index) => {
    setPhotoFiles((prev) => prev.filter((_, i) => i !== index))
    setPhotoPreviews((prev) => {
      URL.revokeObjectURL(prev[index])
      return prev.filter((_, i) => i !== index)
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!user) {
      navigate('/login')
      return
    }

    setLoading(true)
    setError('')

    try {
      let photoUrls = []
      if (photoFiles.length > 0) {
        photoUrls = await uploadTruckPhotos(user.id, photoFiles)
      }

      const { error: err } = await supabase.from('trucks').insert({
        owner_id: user.id,
        title: form.title,
        truck_type: form.truck_type,
        capacity_tons: parseFloat(form.capacity_tons) || null,
        description: form.description,
        price_per_km: parseFloat(form.price_per_km) || null,
        price_flat: parseFloat(form.price_flat) || null,
        pricing_type: form.pricing_type,
        city: form.city,
        whatsapp: form.whatsapp,
        is_available: form.is_available,
        photos: photoUrls.length > 0 ? photoUrls : null,
      })

      if (err) {
        setError(err.message)
        notify.error(err.message)
      } else {
        notify.success(t('toast.truck_published'))
        navigate('/dashboard')
      }
    } catch (uploadErr) {
      const msg = uploadErr.message || 'Erreur lors du téléversement des photos.'
      setError(msg)
      notify.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-enter max-w-2xl mx-auto px-4 sm:px-6 py-10">

      <Link to="/dashboard" className="inline-flex items-center gap-1.5 text-sm text-brand-gray hover:text-brand-charcoal mb-6">
        <ArrowLeft size={16} /> Retour au tableau de bord
      </Link>

      <h1 className="font-display text-2xl font-bold text-brand-charcoal mb-1">
        Ajouter mon camion
      </h1>
      <p className="text-brand-gray text-sm mb-8">
        Remplissez les informations ci-dessous pour créer votre annonce.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">

        <Input
          label="Titre de l'annonce"
          name="title"
          required
          placeholder="Ex: Camion 3T disponible à Casablanca"
          value={form.title}
          onChange={handleChange}
        />

        {/* Photos */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-brand-charcoal">
            Photos du camion (max {MAX_PHOTOS})
          </label>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            onChange={handlePhotoSelect}
            className="text-sm text-brand-gray file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-brand-orange file:text-white file:cursor-pointer"
          />
          {photoPreviews.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {photoPreviews.map((src, i) => (
                <div key={src} className="relative w-20 h-20 rounded-xl overflow-hidden border border-brand-gray-border">
                  <img src={src} alt="" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removePhoto(i)}
                    className="absolute top-1 right-1 w-6 h-6 bg-black/60 rounded-full flex items-center justify-center text-white"
                    aria-label="Supprimer la photo"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <Select
            label="Type de camion"
            name="truck_type"
            value={form.truck_type}
            onChange={handleChange}
            options={TRUCK_TYPES}
          />
          <Input
            label="Capacité (tonnes)"
            name="capacity_tons"
            type="number"
            min="0"
            step="0.5"
            placeholder="Ex: 3"
            value={form.capacity_tons}
            onChange={handleChange}
          />
        </div>

        <Textarea
          label="Description"
          name="description"
          placeholder="Décrivez votre camion, vos services, votre expérience..."
          value={form.description}
          onChange={handleChange}
        />

        <div className="bg-brand-gray-bg rounded-2xl p-5 flex flex-col gap-4">
          <p className="font-medium text-sm text-brand-charcoal">Tarification</p>

          <Select
            label="Type de tarif"
            name="pricing_type"
            value={form.pricing_type}
            onChange={handleChange}
            options={[
              { value: 'per_km', label: 'Par kilomètre uniquement' },
              { value: 'flat', label: 'Forfait uniquement' },
              { value: 'both', label: 'Les deux options' },
            ]}
          />

          <div className="grid sm:grid-cols-2 gap-4">
            {(form.pricing_type === 'per_km' || form.pricing_type === 'both') && (
              <Input
                label="Prix par km (MAD)"
                name="price_per_km"
                type="number"
                min="0"
                step="0.5"
                placeholder="Ex: 5"
                value={form.price_per_km}
                onChange={handleChange}
              />
            )}
            {(form.pricing_type === 'flat' || form.pricing_type === 'both') && (
              <Input
                label="Forfait (MAD)"
                name="price_flat"
                type="number"
                min="0"
                step="10"
                placeholder="Ex: 300"
                value={form.price_flat}
                onChange={handleChange}
              />
            )}
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <Select
            label="Ville"
            name="city"
            value={form.city}
            onChange={handleChange}
            options={CITIES}
          />
          <Input
            label="Numéro WhatsApp"
            name="whatsapp"
            type="tel"
            placeholder="+212 6XX XXX XXX"
            value={form.whatsapp}
            onChange={handleChange}
          />
        </div>

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            name="is_available"
            checked={form.is_available}
            onChange={handleChange}
            className="w-5 h-5 rounded accent-brand-orange"
          />
          <span className="text-sm font-medium text-brand-charcoal">
            Disponible immédiatement
          </span>
        </label>

        <Alert message={error} />

        <Button type="submit" loading={loading} variant="primary" size="lg" className="w-full">
          Publier mon annonce
        </Button>
      </form>
    </div>
  )
}
