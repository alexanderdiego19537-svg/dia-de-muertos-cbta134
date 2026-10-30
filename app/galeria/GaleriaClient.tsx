'use client';

import { useState, useEffect } from 'react';
import DepthCarousel from '@/components/DepthCarousel';
import { motion } from 'framer-motion';
import { createClient } from '@/lib/supabase/client';

const defaultItems = [
  { image: '/images/catrina-candle.jpg',  alt: 'Catrina con vela encendida',      label: 'La llama que guía'       },
  { image: '/images/catrina-roses.jpg',   alt: 'Catrina con rosas naranjas',       label: 'Elegancia y misterio'    },
  { image: '/images/catrina-dress.jpg',   alt: 'Catrina con vestido tradicional',  label: 'La Catrina tradicional'  },
  { image: '/images/tradicion/almas-mascotas-ofrenda.jpg', alt: 'Almas y mascotas', label: 'Reencuentro Familiar' },
  { image: '/images/tradicion/altar-monumental.png', alt: 'Altar tradicional', label: 'Ofrenda Monumental' },
];

export default function GaleriaClient() {
  const [carouselItems, setCarouselItems] = useState(defaultItems);

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
          setCarouselItems(data.map(d => ({
            image: d.image_url,
            alt: d.title || 'Foto de Galería',
            label: d.title || 'Día de Muertos',
          })));
        }
      } catch (e) {
        console.error('Error fetching gallery items:', e);
      }
    }
    load();
  }, []);

  return (
    <section style={{
      backgroundColor: '#080208',
      minHeight: '100vh',
      padding: 'clamp(40px,6vw,80px) clamp(16px,5vw,40px)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* BG glow */}
      <div style={{
        position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)',
        width: '80%', height: '60%',
        background: 'radial-gradient(ellipse, rgba(249,115,22,0.06) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: 960, margin: '0 auto', position: 'relative' }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: 'clamp(32px,5vw,52px)' }}
        >
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '6px 18px', borderRadius: 999,
            border: '1px solid rgba(249,115,22,0.3)',
            background: 'rgba(249,115,22,0.07)',
            marginBottom: 18,
          }}>
            <span style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: 11, color: 'rgba(249,115,22,0.85)',
              letterSpacing: '0.2em', textTransform: 'uppercase',
            }}>
              🖼️ Galería · CBTA #134 · 2026
            </span>
          </div>

          <h1 style={{
            fontFamily: 'Cinzel, serif', fontWeight: 900,
            fontSize: 'clamp(28px,6vw,64px)',
            color: 'white', margin: '0 0 8px', lineHeight: 1.1,
          }}>
            ENTRE LA VIDA
          </h1>
          <h1 style={{
            fontFamily: 'Cinzel, serif', fontWeight: 900,
            fontSize: 'clamp(28px,6vw,64px)',
            background: 'linear-gradient(135deg, #F97316, #EAB308)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            margin: '0 0 16px', lineHeight: 1.1,
          }}>
            Y LA MUERTE
          </h1>
          <p style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: 'clamp(12px,2vw,14px)',
            color: 'rgba(255,255,255,0.4)',
            margin: 0,
          }}>
            Festival Cultural · Centro de Bachillerato Tecnológico Agropecuario No. 134
          </p>
        </motion.div>

        {/* DepthCarousel */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          style={{ height: 520 }}
        >
          <DepthCarousel
            items={carouselItems}
            depth={220}
            spread={90}
            tilt={22}
            tiltDirection="right"
            perspective={1400}
            visibleCards={4}
            falloff={0.2}
            blur={6}
            autoplay={false}
            loop
            cardWidth={300}
            cardHeight={380}
            radius={18}
            tint="#05060a"
            duration={700}
            autoplayDelay={3200}
            showControls
            showIndicators
          />
        </motion.div>

        {/* Footer note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: 11,
            color: 'rgba(255,255,255,0.25)',
            textAlign: 'center',
            marginTop: 32,
          }}
        >
          Haz clic o desliza en las tarjetas para recorrer la galería 3D · Fotos administradas desde Supabase
        </motion.p>
      </div>
    </section>
  );
}
