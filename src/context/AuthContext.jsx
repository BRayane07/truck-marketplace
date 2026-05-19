/**
 * context/AuthContext.jsx
 * ────────────────────────
 * Manages user login state for the whole app.
 */

import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [profileError, setProfileError] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchProfile = async (userId) => {
    setProfileError(null)
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) {
      setProfile(null)
      setProfileError(error.message)
      return { data: null, error }
    }

    setProfile(data)
    return { data, error: null }
  }

  useEffect(() => {
    let mounted = true

    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!mounted) return

      const sessionUser = session?.user ?? null
      setUser(sessionUser)

      if (sessionUser) {
        await fetchProfile(sessionUser.id)
      } else {
        setProfile(null)
        setProfileError(null)
      }

      if (mounted) setLoading(false)
    }

    init()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (!mounted) return

        const sessionUser = session?.user ?? null
        setUser(sessionUser)

        if (sessionUser) {
          await fetchProfile(sessionUser.id)
        } else {
          setProfile(null)
          setProfileError(null)
        }

        setLoading(false)
      }
    )

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  const signUp = async ({ email, password, full_name, phone, role }) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name, phone, role },
      },
    })
    return { data, error }
  }

  const signIn = async ({ email, password }) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { data, error }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setProfile(null)
    setProfileError(null)
  }

  const refetchProfile = () => {
    if (user?.id) return fetchProfile(user.id)
    return Promise.resolve({ data: null, error: null })
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        profileError,
        loading,
        signUp,
        signIn,
        signOut,
        refetchProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}
