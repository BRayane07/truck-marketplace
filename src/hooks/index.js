/**
 * hooks/useTrucks.js
 * ─────────────────────
 * Custom React hook to fetch truck listings from Supabase.
 * Returns: { trucks, loading, error, refetch }
 *
 * Usage: const { trucks, loading } = useTrucks({ city: 'Casablanca' })
 */

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'

export function useTrucks(filters = {}) {
  const [trucks, setTrucks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchTrucks = useCallback(async () => {
    setLoading(true)
    setError(null)

    let query = supabase
      .from('trucks')
      .select(`
        *,
        profiles (full_name, phone),
        reviews (rating)
      `)
      .order('created_at', { ascending: false })

    // Apply optional filters
    if (filters.city) query = query.eq('city', filters.city)
    if (filters.available) query = query.eq('is_available', true)
    if (filters.truck_type) query = query.eq('truck_type', filters.truck_type)

    const { data, error: err } = await query

    setLoading(false)
    if (err) {
      setError(err.message)
    } else {
      setTrucks(data || [])
    }
  }, [filters.city, filters.available, filters.truck_type])

  useEffect(() => { fetchTrucks() }, [fetchTrucks])

  return { trucks, loading, error, refetch: fetchTrucks }
}

/**
 * hooks/useBookings.js
 * ─────────────────────
 * Fetches bookings for the logged-in user.
 * Providers see bookings for their trucks.
 * Customers see their own bookings.
 */

export function useBookings(userId, role) {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchBookings = useCallback(async () => {
    if (!userId) return
    setLoading(true)

    let query = supabase
      .from('bookings')
      .select(`
        *,
        trucks (title, truck_type, whatsapp),
        profiles!bookings_customer_id_fkey (full_name, phone)
      `)
      .order('created_at', { ascending: false })

    if (role === 'customer') {
      query = query.eq('customer_id', userId)
    }
    // Provider filtering is handled by RLS (Row Level Security)

    const { data, error: err } = await query
    setLoading(false)
    if (err) { setError(err.message) } else { setBookings(data || []) }
  }, [userId, role])

  useEffect(() => { fetchBookings() }, [fetchBookings])

  const updateBookingStatus = async (bookingId, status) => {
    const previous = bookings
    setBookings((list) =>
      list.map((b) => (b.id === bookingId ? { ...b, status } : b))
    )

    const { error: err } = await supabase
      .from('bookings')
      .update({ status })
      .eq('id', bookingId)

    if (err) {
      setBookings(previous)
      return { error: err }
    }

    return { error: null }
  }

  const updatePaymentStatus = async (bookingId, payment_status) => {
    const previous = bookings
    setBookings((list) =>
      list.map((b) => (b.id === bookingId ? { ...b, payment_status } : b))
    )

    const { error: err } = await supabase
      .from('bookings')
      .update({ payment_status })
      .eq('id', bookingId)

    if (err) {
      setBookings(previous)
      return { error: err }
    }

    return { error: null }
  }

  return {
    bookings,
    loading,
    error,
    refetch: fetchBookings,
    updateBookingStatus,
    updatePaymentStatus,
  }
}
