/**
 * lib/storage.js
 * Truck photo uploads to Supabase Storage (bucket: truck-photos).
 */
import { supabase } from './supabase'

export const TRUCK_PHOTOS_BUCKET = 'truck-photos'
export const MAX_PHOTO_BYTES = 5 * 1024 * 1024
export const ALLOWED_PHOTO_TYPES = ['image/jpeg', 'image/png', 'image/webp']

export function validateTruckPhotoFile(file) {
  if (!file) return 'Aucun fichier sélectionné.'
  if (!ALLOWED_PHOTO_TYPES.includes(file.type)) {
    return 'Format non supporté (JPG, PNG ou WebP uniquement).'
  }
  if (file.size > MAX_PHOTO_BYTES) {
    return 'Image trop volumineuse (max 5 Mo).'
  }
  return null
}

export async function uploadTruckPhoto(userId, file) {
  const validationError = validateTruckPhotoFile(file)
  if (validationError) {
    throw new Error(validationError)
  }

  const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
  const path = `${userId}/${crypto.randomUUID()}.${ext}`

  const { error: uploadError } = await supabase.storage
    .from(TRUCK_PHOTOS_BUCKET)
    .upload(path, file, { cacheControl: '3600', upsert: false })

  if (uploadError) throw uploadError

  const { data } = supabase.storage.from(TRUCK_PHOTOS_BUCKET).getPublicUrl(path)
  return data.publicUrl
}

export async function uploadTruckPhotos(userId, files) {
  const urls = []
  for (const file of files) {
    urls.push(await uploadTruckPhoto(userId, file))
  }
  return urls
}
