import { Component, type ErrorInfo, type ReactNode } from 'react';
import { COMPANY } from '../lib/company';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

/**
 * Catches unexpected render errors anywhere in the app and shows a branded
 * recovery screen instead of a blank page.
 */
export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Unhandled application error:', error, info.componentStack);
  }

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    return (
      <div className="min-h-screen bg-forest-900 flex items-center justify-center px-5 font-body">
        <div className="max-w-md text-center text-white">
          <img
            src="/logo.jpeg"
            alt="Mabunda Travel & Tours logo"
            className="w-16 h-16 rounded-full object-cover mx-auto mb-6 shadow-xl"
          />
          <h1 className="font-display text-3xl font-bold mb-3">Something went wrong</h1>
          <p className="text-white/70 mb-8 leading-relaxed">
            We hit an unexpected bump in the road. Please reload the page — or
            reach us directly and we will gladly help you plan your journey.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => window.location.reload()}
              className="bg-gold hover:bg-gold-dark text-forest-900 font-semibold px-6 py-3 rounded-full transition-colors"
            >
              Reload Page
            </button>
            <a
              href={COMPANY.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="border border-white/30 hover:border-gold hover:text-gold font-semibold px-6 py-3 rounded-full transition-colors"
            >
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </div>
    );
  }
}
