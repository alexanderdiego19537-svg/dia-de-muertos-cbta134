'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Megaphone, Calendar, Bell, CheckCircle2, AlertCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface Anuncio {
  id: string;
  titulo: string;
  contenido: string;
  activo: boolean;
  created_at?: string;
}

export default function AnunciosSection() {
  const [anuncios, setAnuncios] = useState<Anuncio[]>([]);
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

        if (!error && data) {
          setAnuncios(data);
        }
      } catch (err) {
        console.error('Error fetching anuncios:', err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  return (
    <section
      id="anuncios"
      style={{
        padding: '64px 20px',
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: '#0A040A',
        color: 'white',
      }}
    >
      {/* Luz ambiental */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', transform: 'translate3d(0,0,0)', contain: 'strict' }}>
        <div style={{
          position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)',
          width: '60%', height: '50%', borderRadius: '50%', filter: 'blur(140px)',
          background: 'radial-gradient(circle, rgba(251,191,36,0.06) 0%, transparent 70%)',
        }} />
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        {/* Cabecera */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '6px 18px', borderRadius: 999,
            background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.3)',
            fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: '#FBBF24',
            marginBottom: 14,
          }}>
            <Megaphone size={14} />
            <span>Tablón de Comunicación Oficial</span>
          </div>

          <h2 style={{
            fontFamily: 'Cinzel, serif',
            fontSize: 'clamp(24px, 4vw, 40px)',
            fontWeight: 800,
            margin: '0 0 10px',
            color: 'white',
          }}>
            Avisos y Anuncios del Festival
          </h2>

          <p style={{
            fontSize: 14,
            color: 'rgba(255,255,255,0.55)',
            maxWidth: 600,
            margin: '0 auto',
            lineHeight: 1.6,
          }}>
            Comunicados, cambios de último momento y novedades publicadas por el comité organizador del CBTA #134.
          </p>
        </div>

        {/* Lista de anuncios */}
        {anuncios.length > 0 ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: 18,
          }}>
            {anuncios.map((anuncio, idx) => (
              <motion.article
                key={anuncio.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.08 }}
                style={{
                  backgroundColor: 'rgba(20, 10, 20, 0.75)',
                  border: '1px solid rgba(251, 191, 36, 0.25)',
                  borderRadius: 16,
                  padding: 22,
                  boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginBottom: 12 }}>
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', gap: 6,
                      fontSize: 10, fontFamily: 'JetBrains Mono, monospace',
                      padding: '3px 8px', borderRadius: 6,
                      backgroundColor: 'rgba(249,115,22,0.15)', color: '#F97316',
                      fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em',
                    }}>
                      <Bell size={11} />
                      Oficial
                    </span>

                    {anuncio.created_at && (
                      <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', fontFamily: 'JetBrains Mono, monospace' }}>
                        {new Date(anuncio.created_at).toLocaleDateString('es-MX', { day: 'numeric', month: 'short' })}
                      </span>
                    )}
                  </div>

                  <h3 style={{
                    fontFamily: 'Cinzel, serif',
                    fontSize: 17,
                    fontWeight: 700,
                    color: 'white',
                    margin: '0 0 10px',
                    lineHeight: 1.3,
                  }}>
                    {anuncio.titulo}
                  </h3>

                  <p style={{
                    fontSize: 13.5,
                    color: 'rgba(255,255,255,0.75)',
                    lineHeight: 1.6,
                    margin: 0,
                    whiteSpace: 'pre-line',
                  }}>
                    {anuncio.contenido}
                  </p>
                </div>

                <div style={{
                  marginTop: 18,
                  paddingTop: 12,
                  borderTop: '1px solid rgba(255,255,255,0.06)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: 11,
                  color: 'rgba(255,255,255,0.4)',
                  fontFamily: 'JetBrains Mono, monospace',
                }}>
                  <span>CBTA #134 · San Francisco Tetlanohcan</span>
                  <CheckCircle2 size={13} color="#34D399" />
                </div>
              </motion.article>
            ))}
          </div>
        ) : (
          <div style={{
            maxWidth: 620,
            margin: '0 auto',
            padding: '32px 24px',
            borderRadius: 16,
            border: '1px dashed rgba(249,115,22,0.25)',
            backgroundColor: 'rgba(255,255,255,0.02)',
            textAlign: 'center',
          }}>
            <div style={{
              width: 44, height: 44, borderRadius: '50%',
              backgroundColor: 'rgba(251,191,36,0.1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 12px', color: '#FBBF24', fontSize: 20,
            }}>
              📢
            </div>
            <h4 style={{ fontFamily: 'Cinzel, serif', fontSize: 16, color: 'white', margin: '0 0 6px', fontWeight: 700 }}>
              Sin avisos urgentes pendientes
            </h4>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', margin: 0, lineHeight: 1.5 }}>
              Las actividades del Festival Entre la Vida y la Muerte 2026 se mantienen conforme al programa oficial establecido.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
