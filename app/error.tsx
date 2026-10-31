'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { RefreshCw, Home, AlertTriangle, ShieldAlert } from 'lucide-react';
import { logError } from '@/lib/logger';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Registrar el error para diagnóstico (Paso 7: Sentry / Logs)
    logError(error, { component: 'AppErrorBoundary', action: 'page_render' });
  }, [error]);

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#080208',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px 16px',
        position: 'relative',
        overflow: 'hidden',
        fontFamily: 'Inter, sans-serif',
      }}
    >
      {/* Resplandor místico de fondo */}
      <div
        style={{
          position: 'absolute',
          top: '30%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 'clamp(280px, 60vw, 500px)',
          height: 'clamp(280px, 60vw, 500px)',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(249,115,22,0.15) 0%, rgba(124,58,237,0.08) 50%, transparent 70%)',
          filter: 'blur(80px)',
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          maxWidth: 520,
          width: '100%',
          position: 'relative',
          zIndex: 1,
          backgroundColor: 'rgba(20, 10, 20, 0.85)',
          border: '1px solid rgba(249, 115, 22, 0.3)',
          borderRadius: 20,
          padding: 'clamp(28px, 6vw, 44px)',
          textAlign: 'center',
          boxShadow: '0 20px 50px rgba(0,0,0,0.8), 0 0 30px rgba(249,115,22,0.1)',
          backdropFilter: 'blur(16px)',
        }}
      >
        {/* Ícono de cempasúchil / alerta */}
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: '50%',
            backgroundColor: 'rgba(249, 115, 22, 0.15)',
            border: '1px solid rgba(249, 115, 22, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
            color: '#F97316',
          }}
        >
          <span style={{ fontSize: 32 }}>🕯️</span>
        </div>

        <div
          style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: 11,
            color: '#FBBF24',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            marginBottom: 8,
          }}
        >
          CBTA #134 · Sistema de Resiliencia
        </div>

        <h1
          style={{
            fontFamily: 'Cinzel, serif',
            fontSize: 'clamp(22px, 5vw, 30px)',
            fontWeight: 800,
            margin: '0 0 14px',
            color: 'white',
            lineHeight: 1.2,
          }}
        >
          Un tropiezo en el camino
        </h1>

        <p
          style={{
            fontSize: 14,
            lineHeight: 1.6,
            color: 'rgba(255,255,255,0.65)',
            margin: '0 0 24px',
          }}
        >
          Ocurrió una interrupción momentánea al cargar esta sección. No te preocupes, el camino hacia la tradición sigue alumbrado.
        </p>

        {error.digest && (
          <div
            style={{
              padding: '8px 12px',
              backgroundColor: 'rgba(0,0,0,0.5)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 8,
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: 11,
              color: 'rgba(255,255,255,0.4)',
              marginBottom: 24,
              wordBreak: 'break-all',
            }}
          >
            Código de diagnóstico: {error.digest}
          </div>
        )}

        {/* Botones de acción */}
        <div
          style={{
            display: 'flex',
            gap: 12,
            justifyContent: 'center',
            flexWrap: 'wrap',
          }}
        >
          <button
            onClick={() => reset()}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '12px 22px',
              borderRadius: 999,
              background: 'linear-gradient(135deg, #F97316 0%, #C2410C 100%)',
              color: 'white',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 700,
              fontSize: 13,
              boxShadow: '0 4px 18px rgba(249,115,22,0.4)',
              transition: 'transform 0.15s ease',
            }}
            onMouseDown={e => (e.currentTarget.style.transform = 'scale(0.97)')}
            onMouseUp={e => (e.currentTarget.style.transform = 'scale(1)')}
          >
            <RefreshCw size={15} />
            <span>Reintentar</span>
          </button>

          <Link
            href="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '12px 22px',
              borderRadius: 999,
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.15)',
              color: 'rgba(255,255,255,0.8)',
              textDecoration: 'none',
              fontWeight: 600,
              fontSize: 13,
            }}
          >
            <Home size={15} />
            <span>Volver al Inicio</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
