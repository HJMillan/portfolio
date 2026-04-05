import { Component } from 'react';
import type { ReactNode, ErrorInfo } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  readonly children: ReactNode;
  readonly fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    if (import.meta.env.DEV) {
      // ✅ H-08: Solo en desarrollo — evita exponer component stack traces en producción
      console.error('[ErrorBoundary]', error, errorInfo);
    }
    // En producción: no se expone información de arquitectura interna.
    // Para observabilidad en prod, integrar un servicio como Sentry aquí.
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div className="flex flex-col items-center justify-center min-h-[300px] gap-4 p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-error/10 flex items-center justify-center">
            <AlertTriangle size={28} className="text-error" />
          </div>
          <div className="space-y-2">
            <h2 className="text-lg font-semibold text-text-primary">
              Algo salió mal
            </h2>
            {/* ✅ H-2: Mensaje genérico — nunca exponer error.message al usuario */}
            <p className="text-sm text-text-muted max-w-md">
              Ocurrió un error inesperado. Por favor, recargá la página.
            </p>
          </div>
          <button
            onClick={this.handleRetry}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md bg-accent text-bg hover:bg-accent-hover transition-colors cursor-pointer"
          >
            <RefreshCw size={14} />
            Reintentar
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
