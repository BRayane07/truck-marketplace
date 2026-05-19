/**
 * components/ErrorBoundary.jsx
 * Catches render errors and shows a recovery UI.
 */
import { Component } from 'react'
import { Link } from 'react-router-dom'
import { Button } from './ui'

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, info) {
    console.error('[ErrorBoundary]', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 px-4 text-center">
          <h1 className="font-display text-xl font-bold text-brand-charcoal">
            Une erreur est survenue
          </h1>
          <p className="text-brand-gray text-sm max-w-md">
            Rechargez la page ou retournez à l&apos;accueil.
          </p>
          <div className="flex gap-3 flex-wrap justify-center">
            <Button type="button" onClick={() => window.location.reload()}>
              Recharger
            </Button>
            <Link to="/">
              <Button variant="secondary" type="button">Accueil</Button>
            </Link>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
