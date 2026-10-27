'use client';

import { motion } from 'framer-motion';
import { Star, CheckCircle, Award, Users, Clock, Sparkles } from 'lucide-react';

interface ConcursoSectionProps {
  standalone?: boolean;
}

const bases = [
  { num: 1, text: 'Participan los grupos de 5to semestre.' },
  { num: 2, text: 'La participación es grupal junto con su tutor.' },
  { num: 3, text: 'Las ofrendas se colocarán el día 28 de octubre de 2026 en el lugar asignado dentro del Auditorio de Aquiahuac, en un horario de 8:00 a 10:00 am.' },
  { num: 4, text: 'A las 10:15 am iniciará el recorrido de autoridades y jurado calificador.' },
  { num: 5, text: 'La ofrenda se dedicará al personaje previamente otorgado al tutor de grupo.' },
  { num: 6, text: 'Todo el grupo deberá participar en la investigación y colocación de la ofrenda.' },
  { num: 7, text: 'Al finalizar el concurso deberán levantar y dejar limpio el lugar asignado.' },
];

const aspectos = [
  { num: 1, text: 'La ofrenda deberá ser tradicional de Tetlanohcan.' },
  { num: 2, text: 'Tres integrantes del grupo serán los encargados de realizar una breve descripción de los elementos que componen la ofrenda.' },
  { num: 3, text: 'Semblanza del personaje a la que va dirigida la ofrenda.' },
  { num: 4, text: 'Creatividad y originalidad en la selección y uso de los materiales.' },
  { num: 5, text: 'La explicación deberá realizarse en un máximo de 15 minutos.' },
  { num: 6, text: 'Finalizarán con una reflexión sobre los motivos de colocar ofrendas y conservar las tradiciones del día de muertos.' },
];

export default function ConcursoSection({ standalone = false }: ConcursoSectionProps) {
  return (
    <section style={{
      backgroundColor: '#080208',
      padding: 'clamp(32px,5vw,64px) clamp(16px,5vw,40px)',
      position: 'relative', overflow: 'hidden', flex: 1,
    }}>
      {/* BG glows */}
      <div style={{ position: 'absolute', top: '10%', left: '-10%', width: '50%', height: '50%', borderRadius: '50%', filter: 'blur(120px)', background: 'radial-gradient(circle, rgba(249,115,22,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '10%', right: '-10%', width: '50%', height: '50%', borderRadius: '50%', filter: 'blur(120px)', background: 'radial-gradient(circle, rgba(124,58,237,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div style={{ maxWidth: 960, margin: '0 auto', position: 'relative' }}>

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
            border: '1px solid rgba(234,179,8,0.35)',
            background: 'rgba(234,179,8,0.07)',
            marginBottom: 20,
          }}>
            <Award size={13} color="#EAB308" />
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 'clamp(10px,2vw,11px)', color: 'rgba(234,179,8,0.85)', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
              CBTA No. 134 · Convocatoria
            </span>
          </div>

          <h1 style={{ fontFamily: 'Cinzel, serif', fontWeight: 900, fontSize: 'clamp(28px,6vw,66px)', color: 'white', margin: '0 0 8px', lineHeight: 1.05 }}>
            CONCURSO DE
          </h1>
          <h1 style={{
            fontFamily: 'Cinzel, serif', fontWeight: 900,
            fontSize: 'clamp(28px,6vw,66px)',
            background: 'linear-gradient(135deg, #F97316, #EAB308)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            margin: '0 0 16px', lineHeight: 1.05,
          }}>
            OFRENDAS
          </h1>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 'clamp(13px,2vw,16px)', color: 'rgba(255,255,255,0.5)', fontStyle: 'italic', margin: '0 0 6px' }}>
            "Honrando nuestras raíces, celebramos la vida"
          </p>
          <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 'clamp(10px,1.8vw,12px)', color: 'rgba(255,255,255,0.3)', margin: 0 }}>
            Tradición que nos une, cultura que nos identifica
          </p>
        </motion.div>

        {/* Premio */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          style={{
            marginBottom: 'clamp(28px,4vw,44px)',
            padding: 'clamp(16px,3vw,24px)',
            borderRadius: 'clamp(14px,2vw,20px)',
            border: '1px solid rgba(234,179,8,0.35)',
            background: 'linear-gradient(135deg, rgba(234,179,8,0.08) 0%, rgba(249,115,22,0.06) 100%)',
            display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap',
            justifyContent: 'center', textAlign: 'center',
          }}
        >
          <div style={{ fontSize: 'clamp(28px,5vw,40px)' }}>🎁</div>
          <div>
            <p style={{ fontFamily: 'Cinzel, serif', fontWeight: 900, fontSize: 'clamp(16px,3vw,22px)', color: '#EAB308', margin: '0 0 4px' }}>
              PREMIO SORPRESA
            </p>
            <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 'clamp(10px,1.8vw,12px)', color: 'rgba(255,255,255,0.45)', margin: 0 }}>
              Se otorgará al primer lugar · ¡Participa y sé parte de esta gran tradición!
            </p>
          </div>
        </motion.div>

        {/* Dos columnas: Bases + Aspectos */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(clamp(260px,40vw,420px), 1fr))',
          gap: 'clamp(20px,3vw,32px)',
        }}>

          {/* BASES */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div style={{
              display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20,
              padding: '10px 16px', borderRadius: 999,
              background: 'rgba(249,115,22,0.1)',
              border: '1px solid rgba(249,115,22,0.3)',
              width: 'fit-content',
            }}>
              <Users size={15} color="#F97316" />
              <span style={{ fontFamily: 'Cinzel, serif', fontWeight: 700, fontSize: 'clamp(13px,2.5vw,16px)', color: '#F97316', letterSpacing: '0.1em' }}>
                BASES
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {bases.map((b) => (
                <div key={b.num} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <div style={{
                    width: 26, height: 26, borderRadius: '50%', flexShrink: 0,
                    background: 'rgba(249,115,22,0.15)',
                    border: '1px solid rgba(249,115,22,0.35)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: 11, color: '#F97316', fontWeight: 700,
                  }}>
                    {b.num}
                  </div>
                  <p style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: 'clamp(12px,2vw,14px)',
                    color: 'rgba(255,255,255,0.72)',
                    margin: 0, lineHeight: 1.6,
                  }}>
                    {b.text}
                  </p>
                </div>
              ))}
            </div>

            <p style={{
              marginTop: 20,
              fontFamily: 'Inter, sans-serif', fontStyle: 'italic',
              fontSize: 'clamp(12px,2vw,14px)',
              color: 'rgba(249,115,22,0.6)',
            }}>
              ¡Tu creatividad también honra nuestras tradiciones!
            </p>
          </motion.div>

          {/* ASPECTOS A EVALUAR */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div style={{
              display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20,
              padding: '10px 16px', borderRadius: 999,
              background: 'rgba(124,58,237,0.1)',
              border: '1px solid rgba(124,58,237,0.3)',
              width: 'fit-content',
            }}>
              <Star size={15} color="#7C3AED" />
              <span style={{ fontFamily: 'Cinzel, serif', fontWeight: 700, fontSize: 'clamp(13px,2.5vw,16px)', color: '#A78BFA', letterSpacing: '0.1em' }}>
                ASPECTOS A EVALUAR
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {aspectos.map((a) => (
                <div key={a.num} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <div style={{
                    width: 26, height: 26, borderRadius: '50%', flexShrink: 0,
                    background: 'rgba(124,58,237,0.15)',
                    border: '1px solid rgba(124,58,237,0.35)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: 11, color: '#A78BFA', fontWeight: 700,
                  }}>
                    {a.num}
                  </div>
                  <p style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: 'clamp(12px,2vw,14px)',
                    color: 'rgba(255,255,255,0.72)',
                    margin: 0, lineHeight: 1.6,
                  }}>
                    {a.text}
                  </p>
                </div>
              ))}
            </div>

            <p style={{
              marginTop: 20,
              fontFamily: 'Inter, sans-serif', fontStyle: 'italic',
              fontSize: 'clamp(12px,2vw,14px)',
              color: 'rgba(124,58,237,0.65)',
            }}>
              ¡Participa y sé parte de esta gran tradición!
            </p>
          </motion.div>
        </div>

        {/* Footer note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          style={{
            marginTop: 40,
            padding: 'clamp(14px,2vw,18px) clamp(16px,3vw,24px)',
            borderRadius: 14,
            border: '1px solid rgba(255,255,255,0.05)',
            background: 'rgba(255,255,255,0.02)',
            display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap',
          }}
        >
          <Clock size={13} color="#F97316" />
          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 'clamp(10px,1.8vw,11px)', color: 'rgba(255,255,255,0.35)' }}>
            Colocación de ofrendas: 8:00 – 10:00 am · Recorrido del jurado: 10:15 am · Auditorio de Aquiahuac, Tetlanohcan, Tlaxcala
          </span>
        </motion.div>

        {/* Source */}
        <p style={{
          marginTop: 16, textAlign: 'right',
          fontFamily: 'JetBrains Mono, monospace', fontSize: 10,
          color: 'rgba(255,255,255,0.18)',
        }}>
          Fuente: Convocatoria oficial CBTA No. 134 · Octubre 2026
        </p>
      </div>
    </section>
  );
}
