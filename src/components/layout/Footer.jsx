/**
 * components/layout/Footer.jsx
 * Simple footer with brand info and links.
 */

import { Truck } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-brand-charcoal text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">

          {/* Brand */}
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-brand-orange rounded-xl flex items-center justify-center">
              <Truck size={20} className="text-white" />
            </div>
            <div>
              <p className="font-display font-bold text-lg tracking-widest">HONDATI</p>
              <p className="text-xs text-brand-gray-light">Transport & Déménagement — Maroc</p>
            </div>
          </div>

          {/* Links */}
          <div className="flex items-center gap-6 text-sm text-brand-gray-light">
            <Link to="/" className="hover:text-white transition-colors">Accueil</Link>
            <Link to="/trucks" className="hover:text-white transition-colors">Camionneurs</Link>
            <Link to="/signup" className="hover:text-white transition-colors">S'inscrire</Link>
          </div>

          {/* Copyright */}
          <p className="text-xs text-brand-gray">
            © {new Date().getFullYear()} HONDATI · Casablanca, Maroc
          </p>
        </div>
      </div>
    </footer>
  )
}
