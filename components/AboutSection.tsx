'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import Image from 'next/image';
import { BookOpen, Users, Globe, Award } from 'lucide-react';

const stats = [
  { icon: Users, value: '500+', label: 'Estudiantes activos' },
  { icon: BookOpen, value: 'Tlaxcala', label: 'Corazón de México' },
  { icon: Globe, value: 'PAEC', label: 'Programa académico' },
  { icon: Award, value: '#134', label: 'CBT Agropecuario' },
];

interface AboutSectionProps { standalone?: boolean; }

export default function AboutSection({ standalone = false }: AboutSectionProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="quienes-somos" className="py-24 md:py-32 relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #0A0404 0%, #0F0606 50%, #0A0404 100%)' }}>
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', right: 0, top: '25%', width: 380, height: 380, borderRadius: '50%', filter: 'blur(120px)', background: 'radial-gradient(circle, rgba(124,58,237,0.18) 0%, transparent 70%)' }} />
        <div style={{ position: 'absolute', left: 0, bottom: '25%', width: 300, height: 300, borderRadius: '50%', filter: 'blur(100px)', background: 'radial-gradient(circle, rgba(249,115,22,0.14) 0%, transparent 70%)' }} />
      </div>

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }} ref={ref}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}}
          style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 48 }}>
          <div style={{ width: 48, height: 1, background: 'rgba(249,115,22,0.5)' }} />
          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: '#F97316', letterSpacing: '0.3em', textTransform: 'uppercase' }}>Nuestra Institución</span>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '64px', alignItems: 'center' }} className="grid grid-cols-1 lg:grid-cols-2">
          {/* Left */}
          <div>
            <motion.h2 initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.1 }}
              style={{ fontFamily: 'Cinzel, serif', fontWeight: 700, color: 'white', marginBottom: 20, lineHeight: 1.15, fontSize: 'clamp(28px, 4.5vw, 52px)' }}>
              Quiénes<br />
              <span style={{ background: 'linear-gradient(135deg, #F97316 0%, #EAB308 50%, #F97316 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Somos</span>
            </motion.h2>

            <motion.p initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.2 }}
              style={{ color: 'rgba(255,255,255,0.58)', lineHeight: 1.8, marginBottom: 16, fontSize: 15, textAlign: 'justify', textJustify: 'inter-word' }}>
              El <strong style={{ color: 'rgba(255,255,255,0.85)' }}>Centro de Bachillerato Tecnológico Agropecuario #134</strong> de San Francisco Tetlanhocan, Tlaxcala, es una institución educativa de nivel medio superior comprometida con la formación integral de sus estudiantes y la preservación de la cultura regional.
            </motion.p>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.3 }}
              style={{ color: 'rgba(255,255,255,0.42)', lineHeight: 1.8, marginBottom: 32, fontSize: 14, textAlign: 'justify', textJustify: 'inter-word' }}>
              Alineados al Programa Aula-Escuela-Comunidad <strong style={{ color: 'rgba(255,255,255,0.6)' }}>(PAEC)</strong>, promovemos actividades académicas y culturales que fortalecen la identidad de la comunidad, como esta celebración del Día de Muertos.
            </motion.p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              {stats.map((stat, i) => (
                <motion.div key={stat.label}
                  initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.3 + i * 0.1 }}
                  style={{ padding: '16px', borderRadius: '18px', border: '1px solid rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.02)', cursor: 'default', transition: 'border-color 0.3s' }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(249,115,22,0.2)')}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)')}>
                  <stat.icon size={18} style={{ color: '#F97316', marginBottom: 8 }} />
                  <p style={{ fontFamily: 'Cinzel, serif', fontSize: 20, fontWeight: 700, color: 'white', marginBottom: 4 }}>{stat.value}</p>
                  <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right: image */}
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={isInView ? { opacity: 1, scale: 1 } : {}} transition={{ delay: 0.2 }}>
            <div style={{ position: 'relative', height: 540, borderRadius: '28px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 0 60px rgba(249,115,22,0.08)' }}>
              <Image src="/images/catrina-dress.jpg" alt="Catrina tradicional — Día de Muertos en Tlaxcala" fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover object-top" style={{ filter: 'brightness(0.82)' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,4,4,0.75) 0%, transparent 60%)' }} />
              {/* CBT Logo card */}
              <div style={{ position: 'absolute', bottom: 20, left: 20, right: 20, padding: '14px 16px', borderRadius: '18px', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(16px)', background: 'rgba(10,4,4,0.82)', display: 'flex', alignItems: 'center', gap: 14 }}>
                <Image src="/images/logo-cbta.png" alt="Escudo institucional CBTA #134" width={52} height={52} style={{ flexShrink: 0, filter: 'drop-shadow(0 0 8px rgba(249,115,22,0.3))' }} />
                <div>
                  <p style={{ color: 'white', fontWeight: 600, fontSize: 13, marginBottom: 2 }}>CBTA #134 — Tetlanhocan</p>
                  <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>San Francisco Tetlanhocan, Tlaxcala</p>
                  <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: '#F97316', marginTop: 2 }}>Educación · Cultura · Tradición</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
