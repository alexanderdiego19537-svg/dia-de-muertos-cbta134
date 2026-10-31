'use client';

import { useEffect } from 'react';
import { logError } from '@/lib/logger';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    logError(error, { component: 'GlobalErrorRoot', action: 'root_crash' });
  }, [error]);

  return (
    <html lang="es">
      <body
        style={{
          margin: 0,
          padding: 0,
          backgroundColor: '#080208',
          color: 'white',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
        }}
      >
        <div
          style={{
            maxWidth: 480,
            padding: 32,
            textAlign: 'center',
            backgroundColor: '#160916',
            border: '1px solid rgba(249,115,22,0.3)',
            borderRadius: 16,
            margin: 16,
          }}
        >
          <div style={{ fontSize: 40, marginBottom: 16 }}>💀</div>
          <h2 style={{ margin: '0 0 12px', fontSize: 22, color: '#F97316' }}>
            Interrupción Global del Sistema
          </h2>
          <p style={{ margin: '0 0 24px', fontSize: 14, color: 'rgba(255,255,255,0.7)', lineHeight: 1.5 }}>
            Ocurrió un error inesperado en la carga principal del portal. Pulsa el botón para recargar la aplicación.
          </p>
          <button
            onClick={() => reset()}
            style={{
              padding: '10px 24px',
              borderRadius: 999,
              backgroundColor: '#F97316',
              color: 'white',
              border: 'none',
              fontWeight: 700,
              fontSize: 14,
              cursor: 'pointer',
            }}
          >
            Recargar Aplicación
          </button>
        </div>
      </body>
    </html>
  );
}
