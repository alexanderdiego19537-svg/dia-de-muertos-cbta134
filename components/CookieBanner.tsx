'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Cookie, ChevronDown, ChevronUp, Check, X, Settings } from 'lucide-react';
import Link from 'next/link';

export type ConsentType = 'accepted' | 'essential';

const COOKIE_NAME = 'cbta134_cookie_consent';

export function getCookieConsent(): ConsentType | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp('(?:^|; )' + COOKIE_NAME + '=([^;]*)'));
  if (match) return decodeURIComponent(match[1]) as ConsentType;
  try {
    const local = localStorage.getItem(COOKIE_NAME);
    if (local === 'accepted' || local === 'essential') return local;
  } catch {}
  return null;
}

export function saveCookieConsent(type: ConsentType) {
  if (typeof document === 'undefined') return;
  const maxAge = 365 * 24 * 60 * 60; // 1 año
  document.cookie = `${COOKIE_NAME}=${encodeURIComponent(type)}; max-age=${maxAge}; path=/; SameSite=Lax`;
  try {
    localStorage.setItem(COOKIE_NAME, type);
    localStorage.setItem(`${COOKIE_NAME}_timestamp`, new Date().toISOString());
  } catch {}

  // Disparar evento para que otros componentes (ej. VisitorTracker) reaccionen
  window.dispatchEvent(new CustomEvent('cbta134:consent_updated', { detail: type }));
}

export default function CookieBanner() {
  const [isOpen, setIsOpen] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const existing = getCookieConsent();
    if (!existing) {
      // Pequeño retardo de 600ms para entrada suave tras render inicial
      const timer = setTimeout(() => setIsOpen(true), 600);
      return () => clearTimeout(timer);
    }
  }, []);

  // Escuchar evento global para reabrir el panel desde el Footer o Privacidad
  useEffect(() => {
    const handleReopen = () => {
      setShowDetails(true);
      setIsOpen(true);
    };
    window.addEventListener('cbta134:open_cookie_banner', handleReopen);
    return () => window.removeEventListener('cbta134:open_cookie_banner', handleReopen);
  }, []);

  if (!mounted || !isOpen) return null;

  const handleAcceptAll = () => {
    saveCookieConsent('accepted');
    setIsOpen(false);
  };

  const handleAcceptEssential = () => {
    saveCookieConsent('essential');
    setIsOpen(false);
  };

  return (
    <AnimatePresence>
      <motion.aside
        role="dialog"
        aria-live="polite"
        aria-label="Consentimiento de cookies y privacidad legal"
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 80, opacity: 0 }}
        transition={{ type: 'spring', damping: 26, stiffness: 220 }}
        style={{
          position: 'fixed',
          bottom: 20,
          left: 20,
          right: 20,
          maxWidth: 620,
          margin: '0 auto',
          zIndex: 90,
          pointerEvents: 'auto',
        }}
      >
        <div
          style={{
            backgroundColor: 'rgba(14, 6, 14, 0.96)',
            border: '1px solid rgba(249, 115, 22, 0.4)',
            borderRadius: 20,
            padding: '20px clamp(16px, 3vw, 24px)',
            boxShadow: '0 20px 60px rgba(0,0,0,0.9), 0 0 35px rgba(249,115,22,0.18)',
            backdropFilter: 'blur(22px)',
            color: 'white',
            fontFamily: 'Inter, sans-serif',
          }}
        >
          {/* Cabecera */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  backgroundColor: 'rgba(249,115,22,0.15)',
                  border: '1px solid rgba(249,115,22,0.35)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 18,
                  flexShrink: 0,
                }}
              >
                🍪
              </div>
              <div>
                <h3
                  style={{
                    fontFamily: 'Cinzel, serif',
                    fontSize: 15,
                    fontWeight: 700,
                    margin: 0,
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                  }}
                >
                  Consentimiento y Privacidad Legal
                  <span
                    style={{
                      fontFamily: 'JetBrains Mono, monospace',
                      fontSize: 9,
                      padding: '2px 6px',
                      borderRadius: 4,
                      backgroundColor: 'rgba(52,211,153,0.15)',
                      color: '#34D399',
                      border: '1px solid rgba(52,211,153,0.3)',
                      fontWeight: 600,
                    }}
                  >
                    LFPDPPP
                  </span>
                </h3>
                <p style={{ margin: 0, fontSize: 11, color: 'rgba(255,255,255,0.45)', fontFamily: 'JetBrains Mono, monospace' }}>
                  CBTA #134 · San Francisco Tetlanohcan
                </p>
              </div>
            </div>

            <button
              onClick={handleAcceptEssential}
              title="Cerrar y aceptar solo esenciales"
              style={{
                background: 'none',
                border: 'none',
                color: 'rgba(255,255,255,0.35)',
                cursor: 'pointer',
                padding: 4,
                display: 'flex',
                alignItems: 'center',
                borderRadius: 6,
              }}
            >
              <X size={16} />
            </button>
          </div>

          {/* Texto explicativo */}
          <p
            style={{
              fontSize: 12.5,
              lineHeight: 1.6,
              color: 'rgba(255,255,255,0.8)',
              margin: '0 0 14px',
              textAlign: 'justify',
            }}
          >
            Utilizamos cookies técnicas necesarias para el funcionamiento del portal y analítica anónima para medir la asistencia al Festival Cultural, conforme a la <strong>Ley Federal de Protección de Datos Personales (México)</strong>. No utilizamos datos para publicidad comercial ni los transferimos a terceros. Puedes leer nuestro{' '}
            <Link
              href="/privacidad"
              style={{ color: '#F97316', textDecoration: 'underline', fontWeight: 600 }}
              onClick={() => setIsOpen(false)}
            >
              Aviso de Privacidad
            </Link>{' '}
            y{' '}
            <Link
              href="/terminos"
              style={{ color: '#F97316', textDecoration: 'underline', fontWeight: 600 }}
              onClick={() => setIsOpen(false)}
            >
              Términos de Uso
            </Link>.
          </p>

          {/* Desplegable de configuración detallada */}
          <AnimatePresence>
            {showDetails && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                style={{
                  marginBottom: 16,
                  padding: 12,
                  borderRadius: 12,
                  backgroundColor: 'rgba(0,0,0,0.4)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 10,
                  fontSize: 11.5,
                }}
              >
                {/* Categoría 1: Esenciales */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 }}>
                  <div>
                    <strong style={{ color: 'white', display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Shield size={13} color="#34D399" />
                      Cookies Técnicas y de Seguridad
                    </strong>
                    <p style={{ margin: '2px 0 0', color: 'rgba(255,255,255,0.5)', lineHeight: 1.4 }}>
                      Requeridas para la navegación segura, sesión de editores/autores y prevención de ataques. No pueden desactivarse.
                    </p>
                  </div>
                  <span style={{ fontSize: 10, fontFamily: 'JetBrains Mono, monospace', color: '#34D399', fontWeight: 700, whiteSpace: 'nowrap' }}>
                    Siempre activas
                  </span>
                </div>

                {/* Categoría 2: Analítica escolar */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10, paddingTop: 8, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                  <div>
                    <strong style={{ color: 'white', display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Cookie size={13} color="#F97316" />
                      Analítica y Contador de Visitas Anónimo
                    </strong>
                    <p style={{ margin: '2px 0 0', color: 'rgba(255,255,255,0.5)', lineHeight: 1.4 }}>
                      Mide el número de personas que acceden al programa del festival de forma disociada sin rastreo de actividad externa.
                    </p>
                  </div>
                  <span style={{ fontSize: 10, fontFamily: 'JetBrains Mono, monospace', color: '#F97316', fontWeight: 700, whiteSpace: 'nowrap' }}>
                    Opcionales
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Botones de acción */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 10,
            }}
          >
            <button
              onClick={() => setShowDetails(!showDetails)}
              style={{
                background: 'none',
                border: 'none',
                color: 'rgba(255,255,255,0.6)',
                cursor: 'pointer',
                fontSize: 11.5,
                fontFamily: 'Inter, sans-serif',
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                padding: '4px 0',
                transition: 'color 0.2s',
              }}
              onMouseEnter={e => (e.currentTarget.style.color = 'white')}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.6)')}
            >
              <Settings size={12} />
              <span>{showDetails ? 'Ocultar detalles' : 'Configurar opciones'}</span>
              {showDetails ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <button
                onClick={handleAcceptEssential}
                style={{
                  padding: '8px 16px',
                  borderRadius: 999,
                  border: '1px solid rgba(255,255,255,0.18)',
                  background: 'rgba(255,255,255,0.05)',
                  color: 'rgba(255,255,255,0.85)',
                  cursor: 'pointer',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: 12,
                  fontWeight: 600,
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.35)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.18)';
                }}
              >
                Solo esenciales
              </button>

              <button
                onClick={handleAcceptAll}
                style={{
                  padding: '8px 20px',
                  borderRadius: 999,
                  border: '1px solid rgba(249,115,22,0.6)',
                  background: 'linear-gradient(135deg, #F97316 0%, #EA580C 100%)',
                  color: 'white',
                  cursor: 'pointer',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: 12,
                  fontWeight: 700,
                  boxShadow: '0 4px 15px rgba(249,115,22,0.35)',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(249,115,22,0.55)';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.boxShadow = '0 4px 15px rgba(249,115,22,0.35)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <Check size={14} />
                <span>Aceptar todas</span>
              </button>
            </div>
          </div>
        </div>
      </motion.aside>
    </AnimatePresence>
  );
}
