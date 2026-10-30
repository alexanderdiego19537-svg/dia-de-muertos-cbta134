'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { MapPin, Navigation, Clock } from 'lucide-react';

interface LocationSectionProps { standalone?: boolean; }

export default function LocationSection({ standalone = false }: LocationSectionProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="ubicacion" style={{ padding: '96px 0', position: 'relative', overflow: 'hidden', backgroundColor: '#0A0404' }}>
      <div style={{ position: 'absolute', bottom: 0, right: 0, width: 380, height: 380, borderRadius: '50%', filter: 'blur(130px)', background: 'radial-gradient(circle, rgba(124,58,237,0.15) 0%, transparent 70%)', pointerEvents: 'none', transform: 'translate3d(0,0,0)' }} />

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }} ref={ref}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}}
          style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <div style={{ width: 48, height: 1, background: 'rgba(249,115,22,0.5)' }} />
          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: '#F97316', letterSpacing: '0.3em', textTransform: 'uppercase' }}>Cómo llegar</span>
        </motion.div>

        <motion.h2 initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.1 }}
          style={{ fontFamily: 'Cinzel, serif', fontWeight: 700, color: 'white', marginBottom: 44, lineHeight: 1.2, fontSize: 'clamp(28px, 4.5vw, 52px)' }}>
          Nuestra <span style={{ background: 'linear-gradient(135deg, #F97316 0%, #EAB308 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Ubicación</span>
        </motion.h2>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 24, alignItems: 'start' }} className="grid grid-cols-1 lg:grid-cols-3">
          {/* Info cards */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={isInView ? { opacity: 1, x: 0 } : {}} transition={{ delay: 0.2 }}
            style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {[
              { icon: MapPin, color: '#F97316', bg: 'rgba(249,115,22,0.12)', borderColor: 'rgba(249,115,22,0.2)', title: 'Dirección', desc: 'C. Josefa Ortiz de Domínguez\nSan Francisco Tetlanhocan\n90840 Tlaxcala, México' },
              { icon: Navigation, color: '#7C3AED', bg: 'rgba(124,58,237,0.12)', borderColor: 'rgba(124,58,237,0.2)', title: 'Sede del Evento', desc: 'Auditorio de Aquiahuac\nSan Francisco Tetlanhocan, Tlax.' },
              { icon: Clock, color: '#EAB308', bg: 'rgba(234,179,8,0.12)', borderColor: 'rgba(234,179,8,0.2)', title: 'Horario', desc: 'Miércoles 28 Oct, 2026\n8:00 AM — 1:00 PM' },
            ].map((item) => (
              <div key={item.title} style={{ padding: '14px 16px', borderRadius: '16px', border: `1px solid ${item.borderColor}`, background: item.bg }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                  <item.icon size={16} style={{ color: item.color, flexShrink: 0, marginTop: 2 }} />
                  <div>
                    <p style={{ color: 'white', fontWeight: 600, fontSize: 13, marginBottom: 4 }}>{item.title}</p>
                    <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: 'rgba(255,255,255,0.45)', lineHeight: 1.7, whiteSpace: 'pre-line' }}>{item.desc}</p>
                  </div>
                </div>
              </div>
            ))}

            {/* Coordinates */}
            <div style={{ padding: '10px 14px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.02)' }}>
              <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: 'rgba(255,255,255,0.3)', lineHeight: 1.7 }}>
                LAT: 19.2616° N<br />LNG: 98.1400° W
              </p>
            </div>

            <a href="https://maps.app.goo.gl/WAyyvojhk242yDY89" target="_blank" rel="noopener noreferrer"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '12px', borderRadius: '16px', fontWeight: 600, fontSize: 13, color: 'white', textDecoration: 'none', background: 'linear-gradient(135deg, #F97316, #C2410C)', boxShadow: '0 4px 20px rgba(249,115,22,0.3)', transition: 'opacity 0.2s' }}>
              <Navigation size={15} />
              Abrir en Google Maps
            </a>
          </motion.div>

          {/* Map */}
          <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={isInView ? { opacity: 1, scale: 1 } : {}} transition={{ delay: 0.3 }}
            style={{ position: 'relative', height: 460, borderRadius: '24px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 0 40px rgba(249,115,22,0.06)', gridColumn: 'span 2' }}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3763.06!2d-98.1425!3d19.2616!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85cfdd8ebaaaaaab%3A0x27dafbca82bfb2a0!2sCentro%20De%20Bachillerato%20Tecnol%C3%B3gico%20Agropecuario%20N%C3%BAm.%20134!5e0!3m2!1ses!2smx!4v1698360000000!5m2!1ses!2smx"
              width="100%"
              height="100%"
              style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) brightness(0.82) contrast(0.88) saturate(0.8)' }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Mapa CBTA Agropecuario #134 — San Francisco Tetlanhocan, Tlaxcala"
            />
            {/* Map label overlay */}
            <div style={{ position: 'absolute', top: 14, left: 14, padding: '8px 14px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(14px)', background: 'rgba(10,4,4,0.88)', display: 'flex', alignItems: 'center', gap: 8 }}>
              <MapPin size={13} style={{ color: '#F97316' }} />
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: 'rgba(255,255,255,0.7)' }}>CBTA #134 — Tetlanhocan, Tlax.</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
