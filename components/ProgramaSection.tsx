'use client';

import { motion } from 'framer-motion';
import { Clock, Users, MapPin, Star, Music, Flag, CheckCircle } from 'lucide-react';

interface ProgramaSectionProps {
  standalone?: boolean;
}

const schedule = [
  {
    time: '8:00',
    duration: null,
    title: 'Reunión de alumnos',
    detail: 'Reunión de alumnos de tercer semestre en el centro',
    icon: Users,
    color: '#F97316',
    highlight: false,
  },
  {
    time: '8:00',
    duration: '10:00',
    title: 'Montaje',
    detail: 'Montaje de ofrendas\nMontaje del mercado tradicional',
    icon: Star,
    color: '#EAB308',
    highlight: false,
  },
  {
    time: '8:30',
    duration: null,
    title: 'Desfile — Salida del contingente',
    detail: 'Salida del centro de Tetlanohcan hacia el barrio de Aquiahuac:\n· 3 "A" Agropecuario\n· 3 "A" SPP\n· 3 "A" Ofimática\n· 3 "A" Contabilidad\n· 3 "A" Programación',
    icon: Flag,
    color: '#7C3AED',
    highlight: false,
  },
  {
    time: '9:30',
    duration: null,
    title: 'Llegada al Auditorio',
    detail: 'Llegada del contingente del desfile al Auditorio de Aquiahuac — se incorporan al evento',
    icon: MapPin,
    color: '#EC4899',
    highlight: false,
  },
  {
    time: '10:00',
    duration: '12:00',
    title: 'Evaluación de ofrendas',
    detail: 'Evaluación de ofrendas',
    icon: CheckCircle,
    color: '#F97316',
    highlight: false,
  },
  {
    time: '10:00',
    duration: null,
    title: '🎭 INICIO DEL FESTIVAL',
    detail: 'Inicio del Festival Entre la Vida y la Muerte',
    icon: Music,
    color: '#EAB308',
    highlight: true,
  },
  {
    time: '12:00',
    duration: null,
    title: 'Cierre — Primera parte',
    detail: 'Cierre del festival primera parte',
    icon: Clock,
    color: '#F97316',
    highlight: false,
  },
  {
    time: '12:00',
    duration: '12:20',
    title: 'Participación 5 "A" Programación',
    detail: 'Participación del 5 "A" Programación y cierre de la segunda parte del festival',
    icon: Star,
    color: '#7C3AED',
    highlight: false,
  },
  {
    time: '12:30',
    duration: '13:30',
    title: 'Cierre final',
    detail: 'Se levantan las ofrendas y se deja limpio el lugar',
    icon: Flag,
    color: 'rgba(255,255,255,0.35)',
    highlight: false,
  },
];

export default function ProgramaSection({ standalone = false }: ProgramaSectionProps) {
  return (
    <section style={{
      backgroundColor: '#080208',
      padding: 'clamp(32px,5vw,64px) clamp(16px,5vw,40px)',
      position: 'relative',
      overflow: 'hidden',
      flex: 1,
    }}>
      {/* BG glow */}
      <div style={{
        position: 'absolute', top: '15%', left: '50%', transform: 'translateX(-50%)',
        width: '90%', height: '60%',
        background: 'radial-gradient(ellipse, rgba(124,58,237,0.07) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: 860, margin: '0 auto', position: 'relative' }}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: 'clamp(32px,5vw,52px)' }}
        >
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '6px 18px', borderRadius: 999,
            border: '1px solid rgba(249,115,22,0.3)',
            background: 'rgba(249,115,22,0.07)',
            marginBottom: 20,
          }}>
            <Clock size={13} color="#F97316" />
            <span style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: 'clamp(10px,2vw,11px)',
              color: 'rgba(249,115,22,0.85)',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
            }}>
              Miércoles 28 de Octubre · 8:00 AM – 1:30 PM
            </span>
          </div>

          <h1 style={{
            fontFamily: 'Cinzel, serif', fontWeight: 900,
            fontSize: 'clamp(26px,6vw,62px)',
            color: 'white', margin: '0 0 6px', lineHeight: 1.1,
          }}>
            FESTIVAL ENTRE LA VIDA
          </h1>
          <h1 style={{
            fontFamily: 'Cinzel, serif', fontWeight: 900,
            fontSize: 'clamp(26px,6vw,62px)',
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
            fontSize: 'clamp(12px,2vw,14px)',
            color: 'rgba(255,255,255,0.45)',
            margin: 0, letterSpacing: '0.04em',
          }}>
            Centro de Bachillerato Tecnológico Agropecuario No. 134 · Auditorio de Aquiahuac
          </p>
        </motion.div>

        {/* Timeline */}
        <div style={{ position: 'relative' }}>
          {/* Vertical line */}
          <div style={{
            position: 'absolute',
            left: 'clamp(70px,16%,110px)',
            top: 0, bottom: 0, width: 1,
            background: 'linear-gradient(to bottom, transparent, rgba(249,115,22,0.25) 8%, rgba(249,115,22,0.25) 92%, transparent)',
          }} />

          {schedule.map((item, i) => {
            const Icon = item.icon;
            const timeStr = item.duration ? `${item.time}–${item.duration}` : item.time;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.45, delay: i * 0.06 }}
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'clamp(70px,16%,110px) 20px 1fr',
                  gap: '0 clamp(10px,2vw,20px)',
                  marginBottom: 'clamp(14px,2vw,22px)',
                  alignItems: 'flex-start',
                }}
              >
                {/* Time */}
                <div style={{ textAlign: 'right', paddingTop: 14 }}>
                  <span style={{
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: 'clamp(10px,1.8vw,12px)',
                    color: item.highlight ? '#F97316' : 'rgba(255,255,255,0.4)',
                    fontWeight: item.highlight ? 700 : 400,
                    whiteSpace: 'nowrap',
                  }}>
                    {timeStr}
                  </span>
                </div>

                {/* Dot */}
                <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 16 }}>
                  <div style={{
                    width: item.highlight ? 14 : 9,
                    height: item.highlight ? 14 : 9,
                    borderRadius: '50%',
                    background: item.color,
                    boxShadow: item.highlight ? `0 0 14px ${item.color}, 0 0 28px ${item.color}55` : 'none',
                    flexShrink: 0,
                  }} />
                </div>

                {/* Card */}
                <div style={{
                  padding: 'clamp(12px,2.5vw,18px)',
                  borderRadius: 'clamp(10px,2vw,16px)',
                  border: item.highlight
                    ? '1px solid rgba(249,115,22,0.45)'
                    : '1px solid rgba(255,255,255,0.06)',
                  background: item.highlight
                    ? 'rgba(249,115,22,0.08)'
                    : 'rgba(255,255,255,0.025)',
                }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                    <div style={{
                      width: 30, height: 30, borderRadius: 8, flexShrink: 0,
                      background: `${item.color}1A`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <Icon size={14} color={item.color} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{
                        margin: '0 0 4px',
                        fontFamily: 'Cinzel, serif',
                        fontSize: 'clamp(12px,2.2vw,14px)',
                        color: item.highlight ? '#EAB308' : 'rgba(255,255,255,0.9)',
                        fontWeight: 700,
                        lineHeight: 1.3,
                      }}>
                        {item.title}
                      </p>
                      {item.detail.split('\n').map((line, li) => (
                        <p key={li} style={{
                          margin: li === 0 ? 0 : '3px 0 0',
                          fontFamily: li === 0 ? 'Inter, sans-serif' : 'JetBrains Mono, monospace',
                          fontSize: li === 0 ? 'clamp(12px,2vw,13px)' : 'clamp(10px,1.8vw,11px)',
                          color: li === 0 ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.38)',
                          lineHeight: 1.6,
                        }}>
                          {line}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Footer note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          style={{
            marginTop: 28,
            padding: 'clamp(12px,2vw,16px) clamp(16px,3vw,20px)',
            borderRadius: 12,
            border: '1px solid rgba(255,255,255,0.05)',
            background: 'rgba(255,255,255,0.02)',
            display: 'flex', alignItems: 'center', gap: 10,
            flexWrap: 'wrap',
          }}
        >
          <MapPin size={13} color="#7C3AED" />
          <span style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: 'clamp(10px,1.8vw,11px)',
            color: 'rgba(255,255,255,0.35)',
          }}>
            Auditorio de Aquiahuac, San Francisco Tetlanhocan, Tlaxcala · Entrada libre
          </span>
        </motion.div>
      </div>
    </section>
  );
}
