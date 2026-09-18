import { Component } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

/**
 * Catch uncaught render errors in the admin panel so a single broken component
 * doesn't take down the entire React tree (which shows a blank white screen).
 * The boundary shows a friendly fallback with a retry button.
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error("[AdminErrorBoundary]", error, info?.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-50 ring-8 ring-red-50/60">
            <AlertTriangle size={36} className="text-red-500" />
          </div>
          <h2 className="mt-5 text-xl font-bold text-slate-900">
            Something went wrong
          </h2>
          <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
            {this.state.error?.message ||
              "An unexpected error occurred while rendering this page."}
          </p>
          <button
            type="button"
            onClick={() => this.setState({ hasError: false, error: null })}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#4630d8] to-[#2e8ee8] px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition hover:opacity-90 active:scale-[0.98]"
          >
            <RefreshCw size={15} />
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
