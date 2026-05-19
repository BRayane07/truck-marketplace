/**
 * main.jsx
 * ─────────
 * Entry point of the app. Wraps everything with:
 * - ErrorBoundary: catches render errors
 * - AuthProvider: manages user login state
 * - LanguageProvider: manages FR/AR translations
 */

import React from 'react'
import ReactDOM from 'react-dom/client'
import { Toaster } from 'sonner'
import App from './App'
import { ErrorBoundary } from './components/ErrorBoundary'
import { AuthProvider } from './context/AuthContext'
import { LanguageProvider } from './context/LanguageContext'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <AuthProvider>
        <LanguageProvider>
          <App />
          <Toaster position="top-center" richColors closeButton />
        </LanguageProvider>
      </AuthProvider>
    </ErrorBoundary>
  </React.StrictMode>
)
