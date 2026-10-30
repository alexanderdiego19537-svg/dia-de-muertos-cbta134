'use client';

import DepthCarousel from '@/components/DepthCarousel';
import { motion } from 'framer-motion';

const items = [
  { image: '/images/catrina-candle.jpg',  alt: 'Catrina con vela encendida',      label: 'La llama que guía'       },
  { image: '/images/catrina-roses.jpg',   alt: 'Catrina con rosas naranjas',       label: 'Elegancia y misterio'    },
  { image: '/images/catrina-dress.jpg',   alt: 'Catrina con vestido tradicional',  label: 'La Catrina tradicional'  },
  { image: '/images/catrina-candle.jpg',  alt: 'Catrina con vela — vista 2',       label: 'Luz entre sombras'       },
  { image: '/images/catrina-roses.jpg',   alt: 'Catrina floral — vista 2',         label: 'Flores del Más Allá'     },
];

export default function GaleriaClient() {
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
            items={items}
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
            color: 'rgba(255,255,255,0.2)',
            textAlign: 'center',
            marginTop: 32,
          }}
        >
          Próximamente se añadirán fotografías del evento del 28 de octubre · Haz clic en las tarjetas traseras para navegar
        </motion.p>
      </div>
    </section>
  );
}
