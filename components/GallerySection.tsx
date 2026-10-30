'use client';

import { motion, useInView, AnimatePresence } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { X, ZoomIn } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';

const defaultPhotos = [
  { src: '/images/catrina-candle.jpg', alt: 'Catrina con vela encendida — Día de Muertos', label: 'La llama que guía' },
  { src: '/images/catrina-roses.jpg', alt: 'Catrina con rosas naranjas — tradición mexicana', label: 'Elegancia y misterio' },
  { src: '/images/catrina-dress.jpg', alt: 'Catrina con vestido tradicional y flores — CBTA 134', label: 'La Catrina tradicional' },
];

interface GallerySectionProps { standalone?: boolean; showViewAll?: boolean; }

export default function GallerySection({ standalone = false, showViewAll = false }: GallerySectionProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [photos, setPhotos] = useState(defaultPhotos);
  const [selected, setSelected] = useState<typeof defaultPhotos[0] | null>(null);

  useEffect(() => {
    const supabase = createClient();
    async function load() {
      try {
        const { data, error } = await supabase
          .from('gallery')
          .select('*')
          .eq('visible', true)
          .order('created_at', { ascending: false });

        if (!error && data && data.length > 0) {
          setPhotos(data.map(d => ({
            src: d.image_url,
            alt: d.title || 'Foto de la Galería',
            label: d.title || 'Galería CBTA #134',
          })));
        }
      } catch (e) {
        console.error('Error fetching gallery photos:', e);
      }
    }
    load();
  }, []);

  return (
    <section id="galeria" style={{ padding: '96px 0', position: 'relative', overflow: 'hidden', backgroundColor: '#0F0606' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }} ref={ref}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}}
          style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <div style={{ width: 48, height: 1, background: 'rgba(249,115,22,0.5)' }} />
          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: '#F97316', letterSpacing: '0.3em', textTransform: 'uppercase' }}>Imágenes</span>
        </motion.div>

        <motion.h2 initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.1 }}
          style={{ fontFamily: 'Cinzel, serif', fontWeight: 700, color: 'white', marginBottom: 44, lineHeight: 1.2, fontSize: 'clamp(28px, 4.5vw, 52px)' }}>
          Galería<br />
          <span style={{ background: 'linear-gradient(135deg, #F97316 0%, #EAB308 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Día de Muertos</span>
        </motion.h2>

        {/* Photo grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
          {photos.map((photo, i) => (
            <motion.div key={`${photo.src}-${i}`}
              initial={{ opacity: 0, scale: 0.95 }} animate={isInView ? { opacity: 1, scale: 1 } : {}} transition={{ delay: i * 0.1 }}
              onClick={() => setSelected(photo)}
              style={{ position: 'relative', height: 340, borderRadius: '20px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)', cursor: 'pointer', boxShadow: '0 4px 30px rgba(0,0,0,0.5)' }}
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover"
                style={{ filter: 'brightness(0.85)', transition: 'transform 0.7s ease' }}
                unoptimized={photo.src.startsWith('http')}
              />
              {/* Hover overlay */}
              <div style={{ position: 'absolute', inset: 0, background: 'rgba(10,4,4,0)', transition: 'background 0.3s', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(10,4,4,0.45)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'rgba(10,4,4,0)')}>
                <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(249,115,22,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: 'opacity 0.3s' }}
                  onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
                  className="hover-zoom-btn">
                  <ZoomIn size={18} style={{ color: 'white' }} />
                </div>
              </div>
              {/* Label */}
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '14px 16px', background: 'linear-gradient(to top, rgba(10,4,4,0.88) 0%, transparent 100%)' }}>
                <p style={{ color: 'white', fontSize: 13, fontWeight: 600, margin: 0 }}>{photo.label}</p>
                <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: 'rgba(255,255,255,0.4)', marginTop: 2, margin: '2px 0 0' }}>CBTA #134 — Tetlanhocan, Tlax.</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selected && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelected(null)}
              style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.96)', zIndex: 120, backdropFilter: 'blur(16px)' }} />
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
              style={{ position: 'fixed', inset: 0, zIndex: 120, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, pointerEvents: 'none' }}>
              <div style={{ position: 'relative', width: '100%', maxWidth: 800, pointerEvents: 'all' }}>
                <button onClick={() => setSelected(null)}
                  style={{ position: 'absolute', top: -16, right: -16, zIndex: 10, width: 36, height: 36, borderRadius: '50%', background: '#F97316', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                  <X size={16} style={{ color: 'white' }} />
                </button>
                <div style={{ position: 'relative', width: '100%', height: '70vh', borderRadius: '20px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <Image src={selected.src} alt={selected.alt} fill className="object-contain" unoptimized={selected.src.startsWith('http')} />
                </div>
                <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: 'rgba(255,255,255,0.4)', textAlign: 'center', marginTop: 12 }}>{selected.alt}</p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Botón Ver Galería 3D */}
      {showViewAll && (
        <div style={{ textAlign: 'center', marginTop: 40, paddingBottom: 16 }}>
          <Link href="/galeria" style={{ textDecoration: 'none', display: 'inline-block' }}>
            <div style={{
              padding: 'clamp(11px,2vw,14px) clamp(24px,4vw,40px)',
              borderRadius: 999,
              background: 'linear-gradient(135deg, #F97316, #C2410C)',
              color: 'white', border: 'none', cursor: 'pointer',
              fontFamily: 'Cinzel, serif', fontWeight: 700,
              fontSize: 'clamp(13px,2vw,15px)',
              boxShadow: '0 4px 24px rgba(249,115,22,0.45)',
              display: 'flex', alignItems: 'center', gap: 8,
            }}>
              Ver Galería 3D en Profundidad →
            </div>
          </Link>
        </div>
      )}
    </section>
  );
}
