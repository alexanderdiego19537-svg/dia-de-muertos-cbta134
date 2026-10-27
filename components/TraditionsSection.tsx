'use client';

/**
 * SECCIÓN: Calendario del Más Allá — Fechas y Tradiciones del Día de Muertos
 *
 * FUENTES DE INFORMACIÓN (toda la información es verídica y basada en tradición documentada):
 *
 * 1. Instituto Nacional de Antropología e Historia (INAH) — "El Día de Muertos en México"
 *    https://www.inah.gob.mx/boletines/dia-de-muertos
 *
 * 2. Secretaría de Cultura de México — "Día de Muertos: patrimonio cultural inmaterial"
 *    https://www.gob.mx/cultura/articulos/dia-de-muertos-patrimonio-cultural-inmaterial-de-la-humanidad
 *
 * 3. UNESCO — "Inscripción de la festividad indígena del Día de Muertos" (2008)
 *    https://ich.unesco.org/es/RL/la-festividad-indigena-dedicada-a-los-muertos-00054
 *
 * 4. CONACULTA — "Las ofrendas del Día de Muertos: significado y elementos"
 *
 * 5. Tradición oral y práctica regional documentada de Tlaxcala, México.
 *    Municipio de San Francisco Tetlanhocan, Tlax.
 *
 * Las fechas del 28-31 de oct y 1-2 de nov son parte del ciclo ritual ampliamente
 * documentado por antropólogos mexicanos (Alfonso Caso, Johanna Broda, etc.).
 */

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Star, Info } from 'lucide-react';

const dates = [
  {
    day: '28',
    month: 'OCT',
    emoji: '⚡',
    title: 'Almas de los Accidentes',
    subtitle: '★ Evento CBTA #134',
    isEvent: true,
    desc: 'En muchas comunidades de México, especialmente en el centro del país, este día se recuerda a quienes murieron de forma accidental, repentina o violenta. Su ofrenda se coloca en una esquina de la casa.',
    curious: 'Algunas tradiciones tlaxcaltecas ubican este día como el inicio del ciclo de regreso de las ánimas, previo a la llegada oficial de los difuntos el 1 y 2 de noviembre.',
    altar: null,
    source: 'Tradición oral regional de Tlaxcala · INAH',
  },
  {
    day: '29',
    month: 'OCT',
    emoji: '🐾',
    title: 'Ánimas Solas y Mascotas',
    subtitle: 'Almas sin familia',
    isEvent: false,
    desc: 'Día dedicado a las "ánimas solas": personas sin familia que las recuerde. Muchos hogares añaden un espacio extra en su ofrenda para ellas. En varias regiones también se honra a las mascotas fallecidas.',
    curious: 'En Oaxaca y Tlaxcala es tradición incluir a los animales de compañía en el altar con su comida favorita, un juguete y agua fresca.',
    altar: '🐾 Altar para mascotas: foto, comida favorita, juguete y cuenco de agua.',
    source: 'Secretaría de Cultura de México · Tradición oral de Tlaxcala',
  },
  {
    day: '30',
    month: 'OCT',
    emoji: '🍬',
    title: 'Angelitos del Limbo',
    subtitle: 'Niños sin bautizar',
    isEvent: false,
    desc: 'Se honra a los niños que murieron sin ser bautizados. Su altar es sencillo y lleva juguetes pequeños, dulces y agua, ya que se cree que aún no conocen el mundo adulto.',
    curious: 'En Tlaxcala es tradición que las madres elaboren figuritas de pan en forma de animalitos para acompañar a estas almas inocentes en su camino.',
    altar: '👶 Altar: juguetes, dulces, agua, flor blanca, vela pequeña.',
    source: 'INAH · Tradición oral tlaxcalteca documentada',
  },
  {
    day: '31',
    month: 'OCT',
    emoji: '👻',
    title: 'La Víspera — El Portal',
    subtitle: 'Noche de apertura',
    isEvent: false,
    desc: 'A la medianoche, según la tradición mesoamericana, se abre el portal entre el mundo de los vivos y los muertos. Se coloca el altar para niños difuntos (angelitos). Esta fecha convive con Halloween en la cultura popular contemporánea.',
    curious: 'El concepto de "portal entre mundos" tiene raíces en la cosmovisión nahua del Mictlán (inframundo), documentado en el Códice Borgia y el Florentino.',
    altar: '👼 Altar infantil: foto, juguete favorito, dulces, leche o agua, flor blanca, velita.',
    source: 'Códice Florentino (Fray Sahagún) · UNESCO 2008 · INAH',
  },
  {
    day: '01',
    month: 'NOV',
    emoji: '👼',
    title: 'Día de Todos los Santos',
    subtitle: 'Los angelitos regresan',
    isEvent: false,
    desc: 'Las almas de los niños difuntos (angelitos) regresan este día. El altar lleva flores blancas y cempasúchil, pan de muerto, agua, sal, juguetes y comida dulce. También es festividad católica.',
    curious: 'La sal en el altar representa la pureza y la incorruptibilidad del alma. Es uno de los cuatro elementos básicos de toda ofrenda junto con el agua, la vela y la flor.',
    altar: '🌼 Altar niños: cempasúchil, pan de muerto, agua, sal, juguetes, dulces, foto del niño.',
    source: 'Secretaría de Cultura · CONACULTA · Tradición católica-sincrética mesoamericana',
  },
  {
    day: '02',
    month: 'NOV',
    emoji: '💀',
    title: 'Día de Muertos',
    subtitle: 'Los adultos regresan',
    isEvent: false,
    desc: 'Las almas adultas regresan este día. La ofrenda incluye la foto del difunto, flor de cempasúchil, su comida y bebida favorita, velas, copal (incienso), pan de muerto, sal y agua.',
    curious: 'El aroma del cempasúchil (Tagetes erecta) es tan penetrante que, según la tradición, las almas lo siguen desde el cementerio hasta el altar. Por eso se hace un camino de pétalos desde la puerta.',
    altar: '🕯️ Altar adultos: cempasúchil, foto, comida favorita, bebida, velas, copal, pan, sal, agua.',
    source: 'INAH · UNESCO 2008 "Inscripción Día de Muertos como Patrimonio Inmaterial"',
  },
];

export default function TraditionsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="tradiciones" className="py-24 md:py-32 relative overflow-hidden" style={{ backgroundColor: '#0A0404' }}>
      {/* Background decoration */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', left: '50%', top: 0, width: 1, height: '100%', transform: 'translateX(-50%)', background: 'linear-gradient(to bottom, transparent, rgba(249,115,22,0.1), transparent)', opacity: 0.5 }} />
        <div style={{ position: 'absolute', top: '30%', left: 0, width: 320, height: 320, borderRadius: '50%', filter: 'blur(130px)', background: 'radial-gradient(circle, rgba(124,58,237,0.2) 0%, transparent 70%)' }} />
        <div style={{ position: 'absolute', bottom: '20%', right: 0, width: 280, height: 280, borderRadius: '50%', filter: 'blur(110px)', background: 'radial-gradient(circle, rgba(249,115,22,0.18) 0%, transparent 70%)' }} />
      </div>

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }} ref={ref}>
        {/* Section header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}}
          style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <div style={{ width: 48, height: 1, background: 'rgba(249,115,22,0.5)' }} />
          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: '#F97316', letterSpacing: '0.3em', textTransform: 'uppercase' }}>// Tradiciones y significados</span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.1 }}
          style={{ fontFamily: 'Cinzel, serif', fontWeight: 700, color: 'white', marginBottom: 12, lineHeight: 1.15, fontSize: 'clamp(30px, 5vw, 58px)' }}>
          Calendario del<br />
          <span style={{ background: 'linear-gradient(135deg, #F97316 0%, #EAB308 50%, #F97316 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Más Allá</span>
        </motion.h2>

        <motion.p initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}} transition={{ delay: 0.2 }}
          style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 13, color: 'rgba(255,255,255,0.38)', marginBottom: 48, maxWidth: 580, lineHeight: 1.7 }}>
          Cada día de esta semana sagrada tiene un significado profundo en la tradición mexicana.
          Descubre cuándo y cómo honrar a cada alma.
        </motion.p>

        {/* Cards grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
          {dates.map((date, i) => (
            <motion.div
              key={`${date.day}-${date.month}`}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1, type: 'spring', damping: 20 }}
              style={{
                position: 'relative', padding: '24px', borderRadius: '24px', overflow: 'hidden', cursor: 'default',
                border: date.isEvent ? '1px solid rgba(249,115,22,0.5)' : '1px solid rgba(255,255,255,0.05)',
                background: date.isEvent
                  ? 'linear-gradient(135deg, rgba(249,115,22,0.07) 0%, rgba(10,4,4,0.95) 100%)'
                  : 'rgba(255,255,255,0.02)',
                boxShadow: date.isEvent ? '0 0 40px rgba(249,115,22,0.1), inset 0 0 30px rgba(249,115,22,0.03)' : 'none',
                transition: 'border-color 0.3s, box-shadow 0.3s',
              }}
              onMouseEnter={e => {
                if (!date.isEvent) {
                  (e.currentTarget as HTMLElement).style.borderColor = 'rgba(249,115,22,0.28)';
                  (e.currentTarget as HTMLElement).style.boxShadow = '0 0 20px rgba(249,115,22,0.06)';
                }
              }}
              onMouseLeave={e => {
                if (!date.isEvent) {
                  (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.05)';
                  (e.currentTarget as HTMLElement).style.boxShadow = 'none';
                }
              }}
            >
              {/* Inner radial glow on hover */}
              {date.isEvent && (
                <div style={{ position: 'absolute', inset: 0, borderRadius: '24px', background: 'radial-gradient(circle at 50% 0%, rgba(249,115,22,0.07) 0%, transparent 70%)', pointerEvents: 'none' }} />
              )}

              {/* Event badge */}
              {date.isEvent && (
                <div style={{ position: 'absolute', top: 16, right: 16, display: 'flex', alignItems: 'center', gap: 5, padding: '4px 10px', borderRadius: 999, background: 'linear-gradient(135deg, #F97316, #C2410C)', boxShadow: '0 0 14px rgba(249,115,22,0.5)' }}>
                  <Star size={9} style={{ fill: 'white', color: 'white' }} />
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, fontWeight: 700, color: 'white', letterSpacing: '0.05em' }}>EVENTO CBTA</span>
                </div>
              )}

              {/* Date number */}
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, marginBottom: 12 }}>
                <span style={{
                  fontFamily: 'Cinzel, serif', fontWeight: 900, lineHeight: 1, fontSize: 'clamp(52px, 7vw, 76px)',
                  background: date.isEvent
                    ? 'linear-gradient(135deg, #F97316 0%, #EAB308 100%)'
                    : 'linear-gradient(135deg, rgba(249,115,22,0.45) 0%, rgba(234,179,8,0.3) 100%)',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                }}>
                  {date.day}
                </span>
                <div style={{ paddingBottom: 10 }}>
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, fontWeight: 700, letterSpacing: '0.25em', color: 'rgba(249,115,22,0.55)', display: 'block', textTransform: 'uppercase' }}>{date.month}</span>
                  <span style={{ fontSize: 22 }}>{date.emoji}</span>
                </div>
              </div>

              {/* Title */}
              <h3 style={{ fontFamily: 'Cinzel, serif', fontWeight: 700, color: 'white', marginBottom: 4, fontSize: 16, lineHeight: 1.3 }}>
                {date.title}
              </h3>
              <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: 'rgba(249,115,22,0.55)', marginBottom: 12 }}>{date.subtitle}</p>

              {/* Description */}
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', lineHeight: 1.65, marginBottom: 12 }}>
                {date.desc}
              </p>

              {/* Altar tip */}
              {date.altar && (
                <div style={{ padding: '10px 12px', borderRadius: 12, border: '1px solid rgba(249,115,22,0.12)', background: 'rgba(249,115,22,0.04)', marginBottom: 12 }}>
                  <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: 'rgba(255,255,255,0.55)', lineHeight: 1.6 }}>{date.altar}</p>
                </div>
              )}

              {/* Curious fact */}
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 12, marginBottom: 10 }}>
                <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: 'rgba(255,255,255,0.28)', lineHeight: 1.6 }}>
                  <span style={{ color: 'rgba(249,115,22,0.45)' }}>💡 Dato: </span>{date.curious}
                </p>
              </div>

              {/* Source */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 5 }}>
                <Info size={10} style={{ color: 'rgba(255,255,255,0.18)', flexShrink: 0, marginTop: 2 }} />
                <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: 'rgba(255,255,255,0.18)', lineHeight: 1.5 }}>
                  Fuente: {date.source}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom cempasúchil note */}
        <motion.div
          initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}} transition={{ delay: 0.9 }}
          style={{ marginTop: 48, padding: '24px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.02)', textAlign: 'center' }}>
          <p style={{ fontSize: 28, marginBottom: 10 }}>🌼</p>
          <p style={{ fontFamily: 'Cinzel, serif', color: 'white', fontWeight: 600, fontSize: 16, marginBottom: 8 }}>El camino de cempasúchil</p>
          <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: 'rgba(255,255,255,0.35)', maxWidth: 560, margin: '0 auto', lineHeight: 1.8 }}>
            El intenso aroma de la flor de cempasúchil (<em>Tagetes erecta</em>) guía a las almas desde el cementerio hasta el altar familiar. 
            Por eso se coloca un camino de pétalos desde la puerta de la casa hasta la ofrenda.<br />
            <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: 10, display: 'block', marginTop: 8 }}>
              Fuente: INAH · UNESCO Patrimonio Inmaterial 2008 · Secretaría de Cultura de México
            </span>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
