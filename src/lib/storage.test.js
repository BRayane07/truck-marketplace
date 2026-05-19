import { describe, it, expect } from 'vitest'
import {
  validateTruckPhotoFile,
  MAX_PHOTO_BYTES,
  ALLOWED_PHOTO_TYPES,
} from './storage'

describe('validateTruckPhotoFile', () => {
  it('rejects missing file', () => {
    expect(validateTruckPhotoFile(null)).toMatch(/Aucun fichier/)
  })

  it('rejects unsupported type', () => {
    const file = { type: 'application/pdf', size: 1000 }
    expect(validateTruckPhotoFile(file)).toMatch(/Format non supporté/)
  })

  it('rejects oversized file', () => {
    const file = {
      type: ALLOWED_PHOTO_TYPES[0],
      size: MAX_PHOTO_BYTES + 1,
    }
    expect(validateTruckPhotoFile(file)).toMatch(/5 Mo/)
  })

  it('returns null for valid file', () => {
    const file = {
      type: 'image/jpeg',
      size: 1024,
    }
    expect(validateTruckPhotoFile(file)).toBeNull()
  })
})
