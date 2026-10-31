import Link from 'next/link';
import { Home, Compass, Calendar } from 'lucide-react';
import PetalRain from '@/components/PetalRain';

export default function NotFound() {
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
      {/* Lluvia suave de pétalos en el 404 */}
      <PetalRain count={16} />

      {/* Resplandor místico */}
      <div
        style={{
          position: 'absolute',
          top: '35%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 'clamp(280px, 60vw, 540px)',
          height: 'clamp(280px, 60vw, 540px)',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(124,58,237,0.18) 0%, rgba(249,115,22,0.12) 50%, transparent 70%)',
          filter: 'blur(90px)',
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
          padding: 'clamp(32px, 6vw, 48px)',
          textAlign: 'center',
          boxShadow: '0 20px 50px rgba(0,0,0,0.8), 0 0 30px rgba(124,58,237,0.15)',
          backdropFilter: 'blur(16px)',
        }}
      >
        <div
          style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: 'clamp(56px, 14vw, 84px)',
            fontWeight: 900,
            lineHeight: 1,
            color: '#F97316',
            textShadow: '0 0 35px rgba(249,115,22,0.6)',
            marginBottom: 8,
          }}
        >
          404
        </div>

        <div
          style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: 11,
            color: '#FBBF24',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            marginBottom: 12,
          }}
        >
          CBTA #134 · Sendero no encontrado
        </div>

        <h1
          style={{
            fontFamily: 'Cinzel, serif',
            fontSize: 'clamp(22px, 5vw, 28px)',
            fontWeight: 800,
            margin: '0 0 12px',
            color: 'white',
          }}
        >
          El sendero se ha desvanecido
        </h1>

        <p
          style={{
            fontSize: 14,
            lineHeight: 1.6,
            color: 'rgba(255,255,255,0.65)',
            margin: '0 0 28px',
          }}
        >
          La página que buscas no existe o ha sido reubicada. Sigue el rastro de flores de cempasúchil para regresar a la celebración.
        </p>

        <div
          style={{
            display: 'flex',
            gap: 12,
            justifyContent: 'center',
            flexWrap: 'wrap',
          }}
        >
          <Link
            href="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '12px 24px',
              borderRadius: 999,
              background: 'linear-gradient(135deg, #F97316 0%, #C2410C 100%)',
              color: 'white',
              textDecoration: 'none',
              fontWeight: 700,
              fontSize: 13,
              boxShadow: '0 4px 18px rgba(249,115,22,0.4)',
            }}
          >
            <Home size={15} />
            <span>Altar Principal (Inicio)</span>
          </Link>

          <Link
            href="/programa"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '12px 22px',
              borderRadius: 999,
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.15)',
              color: 'rgba(255,255,255,0.85)',
              textDecoration: 'none',
              fontWeight: 600,
              fontSize: 13,
            }}
          >
            <Calendar size={15} />
            <span>Ver Programa</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
