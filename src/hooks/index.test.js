import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useTrucks } from './index'

const mockOrder = vi.fn()
const mockEq = vi.fn()
const mockSelect = vi.fn()

vi.mock('../lib/supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: mockSelect.mockReturnValue({
        order: mockOrder.mockResolvedValue({ data: [], error: null }),
        eq: mockEq,
      }),
    })),
  },
}))

describe('useTrucks', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockSelect.mockReturnValue({
      order: mockOrder.mockResolvedValue({ data: [], error: null }),
      eq: mockEq,
    })
    mockEq.mockReturnValue({
      order: mockOrder.mockResolvedValue({ data: [], error: null }),
    })
  })

  it('starts loading then returns trucks', async () => {
    const trucks = [{ id: '1', title: 'Camion 3T' }]
    mockOrder.mockResolvedValueOnce({ data: trucks, error: null })

    const { result } = renderHook(() => useTrucks())

    expect(result.current.loading).toBe(true)

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.trucks).toEqual(trucks)
    expect(result.current.error).toBeNull()
  })

  it('sets error message on failure', async () => {
    mockOrder.mockResolvedValueOnce({
      data: null,
      error: { message: 'DB error' },
    })

    const { result } = renderHook(() => useTrucks())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.error).toBe('DB error')
    expect(result.current.trucks).toEqual([])
  })
})
