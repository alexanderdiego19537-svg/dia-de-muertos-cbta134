'use client';

import { useState, useEffect, useMemo } from 'react';
import DepthCarousel from '@/components/DepthCarousel';
import { motion, AnimatePresence } from 'framer-motion';
import { createClient } from '@/lib/supabase/client';
import Image from 'next/image';
import { X, ZoomIn, Calendar, Tag, Camera } from 'lucide-react';
import Link from 'next/link';

interface PhotoItem {
  id: string;
  image: string;
  alt: string;
  label: string;
  category: string;
  isCustom?: boolean;
}

const CATEGORIAS_TAB = [
  { id: 'todas',     label: 'Todas las Fotos', icon: '✨' },
  { id: 'desfile',   label: 'Desfile de Catrines', icon: '🎭' },
  { id: 'ofrendas',  label: 'Concurso de Ofrendas', icon: '🕯️' },
  { id: 'catrinas',  label: 'Catrinas y Catrines', icon: '💀' },
  { id: 'evento',    label: 'Festival y Eventos', icon: '🎪' },
  { id: 'tradicion', label: 'Tradición y Altares', icon: '🏵️' },
  { id: 'general',   label: 'General', icon: '📷' },
] as const;

const defaultPhotos: PhotoItem[] = [
  { id: 'def-1', image: '/images/catrina-candle.jpg',  alt: 'Catrina con vela encendida', label: 'La llama que guía', category: 'catrinas' },
  { id: 'def-2', image: '/images/catrina-roses.jpg',   alt: 'Catrina con rosas naranjas', label: 'Elegancia y misterio', category: 'catrinas' },
  { id: 'def-3', image: '/images/catrina-dress.jpg',   alt: 'Catrina con vestido tradicional', label: 'Traje de Gala Catrina', category: 'desfile' },
  { id: 'def-4', image: '/images/tradicion/almas-mascotas-ofrenda.jpg', alt: 'Almas y mascotas', label: 'Reencuentro Familiar', category: 'ofrendas' },
  { id: 'def-5', image: '/images/tradicion/altar-monumental.png', alt: 'Altar tradicional', label: 'Ofrenda Monumental', category: 'ofrendas' },
];

export default function GaleriaClient() {
  const [allPhotos, setAllPhotos]           = useState<PhotoItem[]>(defaultPhotos);
  const [activeCategory, setActiveCategory] = useState<string>('todas');
  const [selectedPhoto, setSelectedPhoto]   = useState<PhotoItem | null>(null);

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
          const dynamicPhotos: PhotoItem[] = data.map(d => ({
            id: d.id,
            image: d.image_url,
            alt: d.title || 'Foto de Galería CBTA #134',
            label: d.title || 'Día de Muertos 2026',
            category: d.category || 'general',
            isCustom: true,
          }));

          // Combinar fotos dinámicas primero + fotos base
          setAllPhotos([...dynamicPhotos, ...defaultPhotos]);
        }
      } catch (e) {
        console.error('Error fetching gallery items:', e);
      }
    }
    load();
  }, []);

  // Items para el carrusel superior (primeras 8 fotos)
  const carouselItems = useMemo(() => {
    return allPhotos.slice(0, 8).map(p => ({
      image: p.image,
      alt: p.alt,
      label: p.label,
    }));
  }, [allPhotos]);

  // Fotos filtradas para el grid completo
  const filteredPhotos = useMemo(() => {
    if (activeCategory === 'todas') return allPhotos;
    return allPhotos.filter(p => p.category === activeCategory);
  }, [allPhotos, activeCategory]);

  return (
    <section style={{
      backgroundColor: '#080208',
      minHeight: '100vh',
      padding: 'clamp(36px,5vw,72px) clamp(16px,4vw,36px)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Luz tenue de fondo */}
      <div style={{
        position: 'absolute', top: '15%', left: '50%', transform: 'translateX(-50%)',
        width: '85%', height: '55%',
        background: 'radial-gradient(ellipse, rgba(249,115,22,0.08) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        {/* Encabezado */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: 'clamp(28px,4vw,44px)' }}
        >
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '6px 18px', borderRadius: 999,
            border: '1px solid rgba(249,115,22,0.3)',
            background: 'rgba(249,115,22,0.07)',
            marginBottom: 16,
          }}>
            <span style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: 11, color: 'rgba(249,115,22,0.9)',
              letterSpacing: '0.2em', textTransform: 'uppercase',
            }}>
              🖼️ Galería Oficial · CBTA #134 · 2026
            </span>
          </div>

          <h1 style={{
            fontFamily: 'Cinzel, serif', fontWeight: 900,
            fontSize: 'clamp(28px,5.5vw,56px)',
            color: 'white', margin: '0 0 6px', lineHeight: 1.1,
          }}>
            ENTRE LA VIDA
          </h1>
          <h1 style={{
            fontFamily: 'Cinzel, serif', fontWeight: 900,
            fontSize: 'clamp(28px,5.5vw,56px)',
            background: 'linear-gradient(135deg, #F97316, #EAB308)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            margin: '0 0 14px', lineHeight: 1.1,
          }}>
            Y LA MUERTE
          </h1>
          <p style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: 'clamp(13px,1.8vw,15px)',
            color: 'rgba(255,255,255,0.6)',
            maxWidth: 620, margin: '0 auto',
            lineHeight: 1.6,
          }}>
            Archivo fotográfico completo del festival cultural, concurso de ofrendas, desfile de catrinas y tradiciones del CBTA #134.
          </p>
        </motion.div>

        {/* ── Carrusel 3D destacado ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          style={{ height: 500, marginBottom: 48 }}
        >
          <DepthCarousel
            items={carouselItems}
            depth={220}
            spread={90}
            tilt={20}
            tiltDirection="right"
            perspective={1400}
            visibleCards={4}
            falloff={0.2}
            blur={6}
            autoplay={false}
            loop
            cardWidth={290}
            cardHeight={370}
            radius={18}
            tint="#05060a"
            duration={700}
            autoplayDelay={3200}
            showControls
            showIndicators
          />
        </motion.div>

        {/* ── SECCIÓN COMPLETA DE FOTOS CON FILTROS ── */}
        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.08)',
          paddingTop: 40,
          marginTop: 10,
        }}>
          {/* Barra de Filtros */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 16,
            marginBottom: 36,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Camera size={16} style={{ color: '#F97316' }} />
              <span style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: 12,
                letterSpacing: '0.15em',
                color: 'rgba(255,255,255,0.7)',
                textTransform: 'uppercase',
              }}>
                Explorar por categorías ({filteredPhotos.length} fotos)
              </span>
            </div>

            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: 8,
              maxWidth: 900,
            }}>
              {CATEGORIAS_TAB.map(cat => {
                const isActive = activeCategory === cat.id;
                const count = cat.id === 'todas'
                  ? allPhotos.length
                  : allPhotos.filter(p => p.category === cat.id).length;

                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    style={{
                      padding: '8px 16px',
                      borderRadius: 999,
                      cursor: 'pointer',
                      fontFamily: 'Inter, sans-serif',
                      fontSize: 12,
                      fontWeight: 600,
                      transition: 'all 0.2s',
                      border: isActive ? '1px solid #F97316' : '1px solid rgba(255,255,255,0.1)',
                      background: isActive ? 'rgba(249,115,22,0.2)' : 'rgba(255,255,255,0.03)',
                      color: isActive ? '#F97316' : 'rgba(255,255,255,0.65)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                    }}
                  >
                    <span>{cat.icon}</span>
                    <span>{cat.label}</span>
                    <span style={{
                      fontFamily: 'JetBrains Mono, monospace',
                      fontSize: 10,
                      opacity: 0.6,
                    }}>
                      ({count})
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Grid de fotos filtradas */}
          {filteredPhotos.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: 56,
              background: 'rgba(255,255,255,0.02)',
              borderRadius: 18,
              border: '1px dashed rgba(255,255,255,0.1)',
            }}>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 15, margin: '0 0 6px' }}>
                Aún no hay fotos en esta categoría.
              </p>
              <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12, margin: 0 }}>
                Las fotos subidas por los editores aparecerán aquí automáticamente.
              </p>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(clamp(200px, 24vw, 280px), 1fr))',
              gap: 16,
            }}>
              {filteredPhotos.map((photo, i) => (
                <motion.div
                  key={`${photo.id}-${i}`}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.04 }}
                  onClick={() => setSelectedPhoto(photo)}
                  style={{
                    position: 'relative',
                    aspectRatio: '4/3',
                    borderRadius: 16,
                    overflow: 'hidden',
                    cursor: 'pointer',
                    border: '1px solid rgba(255,255,255,0.08)',
                    background: 'rgba(255,255,255,0.02)',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
                    transition: 'transform 0.3s, border-color 0.3s',
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.borderColor = 'rgba(249,115,22,0.4)';
                    (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.08)';
                    (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                  }}
                >
                  <Image
                    src={photo.image}
                    alt={photo.alt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 300px"
                    unoptimized={photo.image.startsWith('http')}
                  />

                  {/* Overlay oscurecido inferior con título */}
                  <div style={{
                    position: 'absolute', bottom: 0, left: 0, right: 0,
                    padding: '12px 14px',
                    background: 'linear-gradient(to top, rgba(8,2,8,0.92) 0%, rgba(8,2,8,0.6) 60%, transparent 100%)',
                  }}>
                    <p style={{
                      color: 'white',
                      fontSize: 12.5,
                      fontWeight: 600,
                      margin: '0 0 2px',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}>
                      {photo.label}
                    </p>
                    <p style={{
                      fontFamily: 'JetBrains Mono, monospace',
                      fontSize: 10,
                      color: 'rgba(249,115,22,0.85)',
                      margin: 0,
                    }}>
                      {CATEGORIAS_TAB.find(c => c.id === photo.category)?.label || 'General'}
                    </p>
                  </div>

                  {/* Zoom badge al hover */}
                  <div style={{
                    position: 'absolute', top: 10, right: 10,
                    width: 30, height: 30, borderRadius: '50%',
                    background: 'rgba(0,0,0,0.65)',
                    backdropFilter: 'blur(6px)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    border: '1px solid rgba(255,255,255,0.15)',
                    color: 'white',
                  }}>
                    <ZoomIn size={14} />
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* ── MODAL LIGHTBOX PARA FOTO AMPLIADA ── */}
        <AnimatePresence>
          {selectedPhoto && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedPhoto(null)}
              style={{
                position: 'fixed',
                inset: 0,
                zIndex: 100,
                background: 'rgba(0,0,0,0.92)',
                backdropFilter: 'blur(16px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '20px',
              }}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={e => e.stopPropagation()}
                style={{
                  position: 'relative',
                  maxWidth: 960,
                  width: '100%',
                  maxHeight: '90vh',
                  borderRadius: 20,
                  overflow: 'hidden',
                  background: '#0d040d',
                  border: '1px solid rgba(249,115,22,0.3)',
                  boxShadow: '0 20px 60px rgba(0,0,0,0.8)',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                {/* Botón de cerrar */}
                <button
                  onClick={() => setSelectedPhoto(null)}
                  style={{
                    position: 'absolute',
                    top: 14,
                    right: 14,
                    zIndex: 20,
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    background: 'rgba(0,0,0,0.7)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                  }}
                >
                  <X size={18} />
                </button>

                {/* Imagen ampliada */}
                <div style={{
                  position: 'relative',
                  width: '100%',
                  height: '65vh',
                  background: '#050205',
                }}>
                  <Image
                    src={selectedPhoto.image}
                    alt={selectedPhoto.alt}
                    fill
                    className="object-contain"
                    unoptimized={selectedPhoto.image.startsWith('http')}
                  />
                </div>

                {/* Pie de la foto */}
                <div style={{
                  padding: '16px 20px',
                  background: 'rgba(15,6,15,0.95)',
                  borderTop: '1px solid rgba(255,255,255,0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: 10,
                }}>
                  <div>
                    <h3 style={{
                      fontFamily: 'Cinzel, serif',
                      fontSize: 16,
                      color: 'white',
                      margin: '0 0 4px',
                      fontWeight: 700,
                    }}>
                      {selectedPhoto.label}
                    </h3>
                    <p style={{
                      fontFamily: 'JetBrains Mono, monospace',
                      fontSize: 11,
                      color: 'rgba(255,255,255,0.5)',
                      margin: 0,
                    }}>
                      CBTA #134 · Festival Entre la Vida y la Muerte
                    </p>
                  </div>

                  <span style={{
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: 11,
                    color: '#F97316',
                    background: 'rgba(249,115,22,0.12)',
                    padding: '4px 12px',
                    borderRadius: 999,
                    border: '1px solid rgba(249,115,22,0.3)',
                  }}>
                    {CATEGORIAS_TAB.find(c => c.id === selectedPhoto.category)?.label || 'General'}
                  </span>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
