'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, MapPin, Music, Sparkles, CheckCircle } from 'lucide-react';
import Image from 'next/image';

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const activities = [
  { time: '8:00 AM', name: 'Desfile — Pasarela de Catrines y Catrinas', emoji: '👗', duration: '~30 min' },
  { time: '8:30 AM', name: 'Montaje de Ofrendas', emoji: '🕯️', duration: '~30 min' },
  { time: '9:00 AM', name: 'Mercadito Cultural', emoji: '🌺', duration: '~30 min' },
  { time: '9:30 AM', name: 'Ritual del Maíz', emoji: '🌽', duration: '~30 min' },
  { time: '10:00 AM', name: 'Baile de la Llorona', emoji: '💃', duration: '~30 min' },
  { time: '10:30 AM', name: 'Baile de la Bruja', emoji: '🧙', duration: '~30 min' },
  { time: '11:00 AM', name: 'Obra: El Charro Negro', emoji: '🎭', duration: '~30 min' },
  { time: '11:30 AM', name: 'Poesía', emoji: '📜', duration: '~30 min' },
  { time: '12:30 PM', name: 'Cierre del Evento', emoji: '🎉', duration: '~30 min' },
];

export default function EventModal({ isOpen, onClose }: EventModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose} className="fixed inset-0 z-50" style={{ background: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(12px)' }} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ pointerEvents: 'none' }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              style={{
                width: '100%', maxWidth: '620px', maxHeight: '90vh',
                overflowY: 'auto', borderRadius: '28px',
                border: '1px solid rgba(255,255,255,0.08)',
                background: '#0D0505', pointerEvents: 'all',
              }}
            >
              {/* Header image */}
              <div className="relative overflow-hidden" style={{ height: '160px', borderRadius: '28px 28px 0 0' }}>
                <Image src="/images/catrina-roses.jpg" alt="Evento Día de Muertos" fill className="object-cover object-top" style={{ opacity: 0.55 }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 20%, #0D0505 100%)' }} />
                <button onClick={onClose} className="absolute top-4 right-4 flex items-center justify-center"
                  style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.7)', cursor: 'pointer' }}>
                  <X size={16} />
                </button>
                <div className="absolute bottom-4 left-6 flex items-center gap-2">
                  <Sparkles size={12} style={{ color: '#F97316' }} />
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: '#F97316', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
                    Programa Oficial
                  </span>
                </div>
              </div>

              <div style={{ padding: '24px 28px 28px' }}>
                <h2 style={{ fontFamily: 'Cinzel, serif', fontSize: '26px', fontWeight: 700, color: 'white', marginBottom: '4px' }}>
                  Día de Muertos 2026
                </h2>
                <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginBottom: '20px' }}>
                  Miércoles 28 de Octubre — CBTA #134, Tetlanhocan, Tlaxcala
                </p>

                {/* Info pills */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {[
                    { icon: Clock, color: '#F97316', title: '8:00 AM – 1:00 PM', sub: 'Horario del evento' },
                    { icon: MapPin, color: '#7C3AED', title: 'Auditorio Aquiahuac', sub: 'San Francisco Tetlanhocan' },
                  ].map(({ icon: Icon, color, title, sub }) => (
                    <div key={title} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.05)' }}>
                      <Icon size={16} style={{ color, flexShrink: 0 }} />
                      <div>
                        <p style={{ color: 'white', fontSize: '13px', fontWeight: 600 }}>{title}</p>
                        <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: 'rgba(255,255,255,0.35)' }}>{sub}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Activities */}
                <div className="flex items-center gap-2 mb-4">
                  <Music size={12} style={{ color: 'rgba(249,115,22,0.6)' }} />
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
                    Programa de actividades
                  </span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {activities.map((act, i) => (
                    <motion.div key={act.name}
                      initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
                      className="flex items-center gap-3 p-3 rounded-xl group cursor-default transition-all"
                      style={{ border: '1px solid rgba(255,255,255,0.04)', background: 'rgba(255,255,255,0.02)' }}
                      onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(249,115,22,0.2)')}
                      onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.04)')}
                    >
                      <span style={{ fontSize: '20px' }}>{act.emoji}</span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ color: 'white', fontSize: '13px', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{act.name}</p>
                        <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: 'rgba(255,255,255,0.3)' }}>{act.duration}</p>
                      </div>
                      <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: '#F97316', flexShrink: 0 }}>{act.time}</span>
                    </motion.div>
                  ))}
                </div>

                {/* Note */}
                <div className="flex items-start gap-3 p-4 rounded-xl mt-5"
                  style={{ background: 'rgba(249,115,22,0.06)', border: '1px solid rgba(249,115,22,0.15)' }}>
                  <CheckCircle size={15} style={{ color: '#F97316', flexShrink: 0, marginTop: 1 }} />
                  <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.55)', lineHeight: 1.6 }}>
                    Actividad académica alineada al Programa Aula‑Escuela‑Comunidad <strong style={{ color: 'rgba(255,255,255,0.75)' }}>(PAEC)</strong> para la conservación de la cultura y tradiciones de la región de Tlaxcala.
                  </p>
                </div>

                <button onClick={onClose}
                  className="w-full mt-5 py-3 rounded-full font-semibold text-white transition-all hover:opacity-90 active:scale-95"
                  style={{ fontFamily: 'Cinzel, serif', fontSize: '14px', letterSpacing: '0.05em', background: 'linear-gradient(135deg, #F97316, #C2410C)', boxShadow: '0 4px 20px rgba(249,115,22,0.3)' }}>
                  ¡Nos vemos allá! 🌺
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
