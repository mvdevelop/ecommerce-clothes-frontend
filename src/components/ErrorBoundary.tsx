import React from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error; reset: () => void }>;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({ error, errorInfo });
    // Log error to external service (for production)
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return <FallbackComponent error={this.state.error!} reset={this.handleReset} />;
      }

      return <DefaultErrorFallback error={this.state.error!} reset={this.handleReset} />;
    }

    return this.props.children;
  }
}

function DefaultErrorFallback({ error, reset }: { error: Error; reset: () => void }) {
  const [showDetails, setShowDetails] = React.useState(false);

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-900/20 flex items-center justify-center">
          <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-white mb-2">Oops! Something went wrong</h1>
        <p className="text-slate-400 mb-6">We apologize for the inconvenience. Please try again later.</p>

        <div className="space-y-3">
          <button
            onClick={reset}
            className="w-full py-3 bg-pink-600 hover:bg-pink-700 active:scale-95 transition-all rounded-full text-white font-medium"
          >
            Try Again
          </button>

          <button
            onClick={() => window.location.href = '/'}
            className="w-full py-2 text-slate-400 hover:text-white transition-colors"
          >
            Go to Home
          </button>
        </div>

        {showDetails && (
          <div className="mt-6 p-4 bg-slate-950 rounded-lg text-left">
            <h3 className="text-sm font-semibold text-slate-300 mb-2">Error Details</h3>
            <p className="text-xs text-slate-500 font-mono break-all">
              {error.message}
            </p>
          </div>
        )}

        <button
          onClick={() => setShowDetails(!showDetails)}
          className="mt-4 text-sm text-slate-500 hover:text-slate-300 transition-colors"
        >
          {showDetails ? 'Hide' : 'Show'} Debug Details
        </button>
      </div>
    </div>
  );
}

export default ErrorBoundary;