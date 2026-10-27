'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import Image from 'next/image';

const activities = [
  { emoji: '👗', name: 'Pasarela de Catrines y Catrinas', desc: 'Un desfile lleno de color y elegancia donde estudiantes y comunidad honran a los difuntos con trajes de catrina y catrín.', time: '8:00 AM' },
  { emoji: '🕯️', name: 'Montaje de Ofrendas', desc: 'La ofrenda es el corazón del Día de Muertos. Fotos, cempasúchil, comida favorita y velas para guiar a las almas.', time: '8:30 AM' },
  { emoji: '🌺', name: 'Mercadito Cultural', desc: 'Artesanías, gastronomía regional y productos tradicionales que enriquecen la cultura local de Tetlanhocan.', time: '9:00 AM' },
  { emoji: '🌽', name: 'Ritual del Maíz', desc: 'Ceremonia que honra al maíz como sustento y símbolo de vida, conectando con las tradiciones agropecuarias de la región.', time: '9:30 AM' },
  { emoji: '💃', name: 'Baile de la Llorona', desc: 'Representación dancística de la leyenda más icónica del folklore mexicano, con música tradicional en vivo.', time: '10:00 AM' },
  { emoji: '🧙', name: 'Baile de la Bruja', desc: 'Danza llena de misterio y tradición que conecta con el lado místico de la celebración del Día de Muertos.', time: '10:30 AM' },
  { emoji: '🎭', name: 'Obra: El Charro Negro', desc: 'Obra teatral basada en la leyenda del Charro Negro, una de las historias más populares de la tradición oral mexicana.', time: '11:00 AM' },
  { emoji: '📜', name: 'Poesía', desc: 'Recitales poéticos que celebran la memoria de quienes ya no están, con versos de amor, nostalgia y esperanza.', time: '11:30 AM' },
];

export default function ActivitiesSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="el-evento" style={{ padding: '96px 0', position: 'relative', overflow: 'hidden', backgroundColor: '#0F0606' }}>
      <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '80%', height: 1, background: 'linear-gradient(to right, transparent, rgba(249,115,22,0.3), transparent)' }} />
      <div style={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '80%', height: 1, background: 'linear-gradient(to right, transparent, rgba(249,115,22,0.3), transparent)' }} />

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }} ref={ref}>
        {/* Header */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 32, marginBottom: 56 }}>
          <div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}}
              style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <div style={{ width: 48, height: 1, background: 'rgba(249,115,22,0.5)' }} />
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: '#F97316', letterSpacing: '0.3em', textTransform: 'uppercase' }}>Miércoles 28 de Octubre, 2026</span>
            </motion.div>
            <motion.h2 initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.1 }}
              style={{ fontFamily: 'Cinzel, serif', fontWeight: 700, color: 'white', lineHeight: 1.2, fontSize: 'clamp(28px, 4.5vw, 56px)', margin: 0 }}>
              Las <span style={{ background: 'linear-gradient(135deg, #F97316 0%, #EAB308 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Actividades</span><br />
              del Día de Muertos
            </motion.h2>
          </div>

          {/* Feature image */}
          <motion.div initial={{ opacity: 0, scale: 0.92 }} animate={isInView ? { opacity: 1, scale: 1 } : {}} transition={{ delay: 0.2 }}
            style={{ position: 'relative', width: '100%', maxWidth: 320, height: 200, borderRadius: '20px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)', alignSelf: 'flex-start' }}>
            <Image src="/images/catrina-roses.jpg" alt="Catrina — Actividades Día de Muertos CBTA 134 Tetlanhocan" fill sizes="320px" className="object-cover object-top" style={{ filter: 'brightness(0.78)' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,4,4,0.88) 0%, transparent 55%)' }} />
            <div style={{ position: 'absolute', bottom: 14, left: 14 }}>
              <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: '#F97316', marginBottom: 2 }}>📅 Día del evento</p>
              <p style={{ color: 'white', fontWeight: 600, fontSize: 13 }}>8:00 AM – 1:00 PM</p>
            </div>
          </motion.div>
        </div>

        {/* Activities grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
          {activities.map((act, i) => (
            <motion.div key={act.name}
              initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: i * 0.08 }}
              style={{ padding: '20px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.02)', cursor: 'default', transition: 'all 0.3s' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(249,115,22,0.28)'; (e.currentTarget as HTMLElement).style.background = 'rgba(249,115,22,0.04)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.05)'; (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.02)'; }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <span style={{ fontSize: 28 }}>{act.emoji}</span>
                <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: '#F97316', background: 'rgba(249,115,22,0.1)', padding: '3px 10px', borderRadius: 999 }}>{act.time}</span>
              </div>
              <h3 style={{ fontFamily: 'Cinzel, serif', fontWeight: 700, color: 'white', fontSize: 14, marginBottom: 8, lineHeight: 1.35 }}>{act.name}</h3>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', lineHeight: 1.65 }}>{act.desc}</p>
            </motion.div>
          ))}
        </div>

        <motion.p initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}} transition={{ delay: 0.9 }}
          style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: 'rgba(255,255,255,0.25)', textAlign: 'center', marginTop: 40, maxWidth: 500, margin: '40px auto 0' }}>
          Cada actividad tiene una duración aproximada de 30 minutos. Organizado por la parte académica del CBTA #134 — Alineado al Programa Aula-Escuela-Comunidad (PAEC).
        </motion.p>
      </div>
    </section>
  );
}
