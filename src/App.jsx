/**
 * App.jsx
 * ────────
 * Main app file. Sets up:
 * 1. React Router (URL navigation)
 * 2. All pages/routes
 * 3. Layout (Navbar + Footer around every page)
 * 4. Protected route (dashboard only for logged-in users)
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import Home from './pages/Home'
import Trucks from './pages/Trucks'
import { Login, Signup } from './pages/Auth'
import Book from './pages/Book'
import Dashboard from './pages/Dashboard'
import AddTruck from './pages/AddTruck'
import { Spinner } from './components/ui'

// ── Protected Route: redirects to /login if not authenticated ──
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Spinner size={32} />
      </div>
    )
  }

  return user ? children : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col">
        <Navbar />

        <main className="flex-1">
          <Routes>
            {/* ── Public routes ── */}
            <Route path="/"        element={<Home />} />
            <Route path="/trucks"  element={<Trucks />} />
            <Route path="/login"   element={<Login />} />
            <Route path="/signup"  element={<Signup />} />
            <Route path="/book/:id" element={<Book />} />

            {/* ── Protected routes (must be logged in) ── */}
            <Route path="/dashboard" element={
              <ProtectedRoute><Dashboard /></ProtectedRoute>
            } />
            <Route path="/trucks/new" element={
              <ProtectedRoute><AddTruck /></ProtectedRoute>
            } />

            {/* ── 404 fallback ── */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  )
}
