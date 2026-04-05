import { Link } from 'react-router-dom';
import { Home, AlertCircle } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center">
      <div className="relative">
        <span className="text-8xl font-bold font-mono text-accent/20">404</span>
        <AlertCircle
          size={40}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-accent"
        />
      </div>
      <div className="space-y-2">
        <h1 className="text-xl font-semibold text-text-primary">
          Ruta no encontrada
        </h1>
        <p className="text-sm text-text-muted">
          La página que buscás no existe o fue movida.
        </p>
      </div>
      <Link
        to="/"
        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md bg-accent text-bg hover:bg-accent-hover transition-colors"
      >
        <Home size={14} />
        Volver al inicio
      </Link>
    </div>
  );
}
