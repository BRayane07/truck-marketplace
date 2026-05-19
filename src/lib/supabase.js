/**
 * lib/supabase.js
 * ───────────────
 * This file creates ONE Supabase connection used by the entire app.
 */

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  const msg =
    'Supabase env variables missing. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env'
  if (import.meta.env.DEV) {
    throw new Error(msg)
  }
  console.warn(`⚠️  ${msg}`)
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseKey || 'placeholder-key'
)
