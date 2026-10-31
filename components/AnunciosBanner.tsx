'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Megaphone, X, ChevronRight, Bell } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';

interface Anuncio {
  id: string;
  titulo: string;
  contenido: string;
  activo: boolean;
  created_at?: string;
}

export default function AnunciosBanner() {
  const [anuncios, setAnuncios] = useState<Anuncio[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [closedIds, setClosedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    async function load() {
      try {
        const { data, error } = await supabase
          .from('anuncios')
          .select('*')
          .eq('activo', true)
          .order('created_at', { ascending: false });

        if (!error && data && data.length > 0) {
          setAnuncios(data);
        }
      } catch (err) {
        console.error('Error fetching anuncios:', err);
      } finally {
        setLoading(false);
      }
    }

    load();

    // Cargar anuncios descartados en esta sesión
    try {
      const stored = sessionStorage.getItem('cbta134_closed_anuncios');
      if (stored) setClosedIds(JSON.parse(stored));
    } catch {}
  }, []);

  // Filtrar los que no hayan sido cerrados en esta sesión
  const visibleAnuncios = anuncios.filter(a => !closedIds.includes(a.id));

  if (loading || visibleAnuncios.length === 0) return null;

  const current = visibleAnuncios[currentIndex % visibleAnuncios.length];

  const handleClose = () => {
    const updated = [...closedIds, current.id];
    setClosedIds(updated);
    try {
      sessionStorage.setItem('cbta134_closed_anuncios', JSON.stringify(updated));
    } catch {}
  };

  return (
    <aside
      role="region"
      aria-label="Avisos y Anuncios Oficiales del Festival"
      style={{
        position: 'relative',
        zIndex: 49,
        background: 'linear-gradient(90deg, #1C0A00 0%, #2A1100 50%, #1A0700 100%)',
        borderBottom: '1px solid rgba(249, 115, 22, 0.35)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.6), 0 0 15px rgba(249,115,22,0.15)',
        color: 'white',
        padding: '8px clamp(12px, 3vw, 24px)',
        paddingTop: '62px', // Espacio suficiente debajo del Header fijo
      }}
    >
      <div
        style={{
          maxWidth: 1280,
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
          flexWrap: 'wrap',
        }}
      >
        {/* Lado izquierdo: Icono + Título + Mensaje */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 260 }}>
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: '50%',
              backgroundColor: 'rgba(249, 115, 22, 0.2)',
              border: '1px solid rgba(249, 115, 22, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#F97316',
              flexShrink: 0,
            }}
          >
            <Megaphone size={14} style={{ animation: 'pulse 2s infinite' }} />
          </div>

          <div style={{ fontSize: 12.5, lineHeight: 1.4, fontFamily: 'Inter, sans-serif' }}>
            <span
              style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: 10,
                textTransform: 'uppercase',
                color: '#FBBF24',
                fontWeight: 700,
                letterSpacing: '0.1em',
                marginRight: 8,
                padding: '2px 6px',
                borderRadius: 4,
                backgroundColor: 'rgba(251, 191, 36, 0.15)',
                border: '1px solid rgba(251, 191, 36, 0.3)',
              }}
            >
              Aviso Oficial
            </span>
            <strong style={{ color: 'white', marginRight: 6 }}>{current.titulo}:</strong>
            <span style={{ color: 'rgba(255,255,255,0.85)' }}>{current.contenido}</span>
          </div>
        </div>

        {/* Lado derecho: Indicador si hay más de 1 + Botón Cerrar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          {visibleAnuncios.length > 1 && (
            <button
              onClick={() => setCurrentIndex(prev => prev + 1)}
              title="Siguiente aviso"
              style={{
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: 999,
                color: 'white',
                padding: '3px 8px',
                fontSize: 11,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                fontFamily: 'JetBrains Mono, monospace',
              }}
            >
              <span>{((currentIndex % visibleAnuncios.length) + 1)}/{visibleAnuncios.length}</span>
              <ChevronRight size={12} />
            </button>
          )}

          <button
            onClick={handleClose}
            title="Cerrar aviso temporalmente"
            style={{
              background: 'none',
              border: 'none',
              color: 'rgba(255,255,255,0.5)',
              cursor: 'pointer',
              padding: 4,
              display: 'flex',
              alignItems: 'center',
              borderRadius: 4,
              transition: 'color 0.2s',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = 'white')}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.5)')}
          >
            <X size={15} />
          </button>
        </div>
      </div>
    </aside>
  );
}
