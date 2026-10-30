'use client';

import { motion, useInView, AnimatePresence } from 'framer-motion';
import { useRef, useState } from 'react';
import Image from 'next/image';
import { Calendar, BookOpen, Flame, Sparkles, Info, X, ZoomIn, Heart, Shield, Compass } from 'lucide-react';

interface TraditionsSectionProps {
  standalone?: boolean;
}

// ── CALENDARIO COMPLETO (27 OCTUBRE - 3 NOVIEMBRE) ──────────────────────────
const CALENDARIO = [
  {
    day: '27',
    month: 'OCT',
    emoji: '🐾',
    title: 'Mascotas que Fallecieron',
    subtitle: 'Compañeros de vida',
    desc: 'De acuerdo con la tradición popular reciente y colectivos rescatistas, este día se honra y se coloca una ofrenda especial para los animales de compañía (perros, gatos y otras mascotas) que ya partieron.',
    altar: '🐾 En la ofrenda: su comida favorita, premios, agua fresca y su juguete preferido.',
    source: 'Instituto Nacional de los Pueblos Indígenas (INPI)',
    isEvent: false,
    color: '#38BDF8',
  },
  {
    day: '28',
    month: 'OCT',
    emoji: '⚡',
    title: 'Muertos Trágicos o Violentos',
    subtitle: '★ Día de nuestro evento CBTA #134',
    desc: 'Está dedicado a las personas que fallecieron de forma trágica, repentina o por accidentes (atropelladas, asesinadas, etc.). También se suele encender una veladora y poner una flor blanca.',
    altar: '🕯️ En la ofrenda: veladora blanca, flor blanca de cempasúchil y agua bendita.',
    source: 'Tradición regional de Tlaxcala · INAH',
    isEvent: true,
    color: '#F97316',
  },
  {
    day: '29',
    month: 'OCT',
    emoji: '🌊',
    title: 'Ahogados',
    subtitle: 'Almas de las aguas',
    desc: 'Día reservado para quienes perdieron la vida ahogadas en ríos, lagos, mares o pozos. Se les recibe con agua y un camino de sal purificadora.',
    altar: '💧 En la ofrenda: vaso con agua pura, sal marina y vela para calentar su espíritu.',
    source: 'Tradición oral mexicana · CONACULTA',
    isEvent: false,
    color: '#06B6D4',
  },
  {
    day: '30',
    month: 'OCT',
    emoji: '🕊️',
    title: 'Ánimas Solas y Olvidadas',
    subtitle: 'Los que no tienen quien los recuerde',
    desc: 'Dedicado a aquellas almas que no tienen familiares que los recuerden, los "olvidados", o bien, a las almas del purgatorio. Muchos hogares colocan una vela extra en una esquina.',
    altar: '🍞 En la ofrenda: un pan de muerto sencillo, un vaso de agua y una vela en la entrada.',
    source: 'Secretaría de Cultura de México',
    isEvent: false,
    color: '#A855F7',
  },
  {
    day: '31',
    month: 'OCT',
    emoji: '🍬',
    title: 'Niños del Limbo',
    subtitle: 'Niños que no nacieron',
    desc: 'Se recibe a los niños que están en el limbo, aquellos que murieron sin ser bautizados o que no llegaron a nacer. El altar se viste de blanco y figuras dulces.',
    altar: '👶 En la ofrenda: flores blancas, figuritas de azúcar, leche o miel y velitas blancas.',
    source: 'INAH · Tradición nahua tlaxcalteca',
    isEvent: false,
    color: '#EC4899',
  },
  {
    day: '01',
    month: 'NOV',
    emoji: '👼',
    title: 'Todos los Santos / Muertos Chiquitos',
    subtitle: 'Llegada de los niños y bebés',
    desc: 'Está dedicado a los niños y bebés que fallecieron por causas naturales o enfermedades. Se cree que sus almas son las primeras en llegar a visitar los hogares llenos de alegría.',
    altar: '🍭 En la ofrenda: dulces típicos, juguetes, pan de muerto pequeño, chocolate y frutas.',
    source: 'Instituto Nacional de Antropología e Historia (INAH)',
    isEvent: false,
    color: '#EAB308',
  },
  {
    day: '02',
    month: 'NOV',
    emoji: '💀',
    title: 'Día de los Fieles Difuntos',
    subtitle: 'Llegada de los adultos',
    desc: 'Está dedicado a los adultos. Es el día central en que se recibe a las ánimas mayores y se realizan las concentraciones y visitas masivas en los panteones de todo el país.',
    altar: '🍽️ En la ofrenda: mole poblano/tlaxcalteca, tamales, pulque o tequila, tabaco y copal.',
    source: 'INAH · UNESCO Patrimonio Cultural 2008',
    isEvent: false,
    color: '#F97316',
  },
  {
    day: '03',
    month: 'NOV',
    emoji: '🔥',
    title: 'Cierre de la Celebración',
    subtitle: 'Despedida y levantamiento',
    desc: 'En muchas comunidades indígenas, este día se levanta la ofrenda y se despide a las ánimas, quemando un poco de copal como agradecimiento por su visita y acompañándolas a su retorno.',
    altar: '✨ Ritual: sahumar el camino con copal, repartir la ofrenda entre vecinos y compadres.',
    source: 'Práctica tradicional comunitaria del centro de México',
    isEvent: false,
    color: '#10B981',
  },
];

// ── ELEMENTOS ESENCIALES DEL ALTAR ──────────────────────────────────────────
const ELEMENTOS = [
  {
    nombre: 'Fotografía del ser querido',
    icono: '🖼️',
    significado: 'Se coloca en la parte más alta del altar. Indica quién es el invitado de honor que nos visitará durante la festividad.',
    categoria: 'Memoria y Homenaje',
  },
  {
    nombre: 'Flor de Cempasúchil (Zempoalxóchitl)',
    icono: '🌼',
    significado: 'Conocida como la "flor de 20 pétalos". Su color amarillo-anaranjado intenso y su aroma fuerte sirven para trazar y guiar el camino de las ánimas desde la entrada hasta la ofrenda.',
    categoria: 'Guía Espiritual',
  },
  {
    nombre: 'Velas y Veladoras',
    icono: '🕯️',
    significado: 'Su flama representa la luz, la fe y la esperanza. Sirven para alumbrar el camino de regreso a casa para que las almas no se pierdan.',
    categoria: 'Luz y Esperanza',
  },
  {
    nombre: 'Agua',
    icono: '💧',
    significado: 'Se coloca en un vaso para calmar la sed de las ánimas después de su largo recorrido y darles fuerza para su retorno. Simboliza la pureza del alma.',
    categoria: 'Sustento y Pureza',
  },
  {
    nombre: 'Sal',
    icono: '🧂',
    significado: 'Elemento fundamental de purificación para evitar que el cuerpo o el alma del difunto se corrompan durante su viaje de ida y vuelta.',
    categoria: 'Purificación',
  },
  {
    nombre: 'Copales e Incienso',
    icono: '💨',
    significado: 'Su humo aromático limpia el lugar de malos espíritus y eleva las oraciones al cielo, consagrando el espacio como sagrado.',
    categoria: 'Espiritualidad',
  },
  {
    nombre: 'Papel Picado',
    icono: '🎊',
    significado: 'Aporta color, arte y alegría. En la cosmovisión tradicional representa el elemento aire de la naturaleza.',
    categoria: 'Elemento Aire',
  },
  {
    nombre: 'Pan de Muerto',
    icono: '🍞',
    significado: 'Su forma circular representa el ciclo continuo de la vida y la muerte. Las cuatro tiras superiores simulan los huesos y la esfera del centro representa un cráneo.',
    categoria: 'Ciclo Vital',
  },
  {
    nombre: 'Comida y Bebida Favorita',
    icono: '🍲',
    significado: 'Se cocinan los platillos que más disfrutaba la persona en vida (mole, tamales, calabaza en tacha, chocolate, café o licor) para deleitar su esencia.',
    categoria: 'Banquete Sagrado',
  },
];

// ── DATOS CURIOSOS ──────────────────────────────────────────────────────────
const CURIOSIDADES = [
  {
    titulo: '¿Por qué se ponen perritos en las ofrendas?',
    icono: '🐕',
    badge: 'Mitología Mexica',
    cuerpo: 'En los altares tradicionales es común ver figuras de perritos (el Xoloitzcuintle). Según la cosmovisión mexica, este noble guardián era el encargado de guiar y ayudar a las almas a cruzar el caudaloso río Chiconauhuapan para llegar finalmente al Mictlán.',
    fuente: 'Arqueología Mexicana / INAH',
  },
  {
    titulo: 'No es el "Halloween mexicano"',
    icono: '🎃',
    badge: 'Distinción Cultural',
    cuerpo: 'Aunque coinciden en fechas por transiciones de temporada (Halloween deriva del Samhain celta), su filosofía es completamente opuesta: mientras Halloween gira en torno al miedo y a los monstruos, el Día de Muertos celebra el amor familiar, la memoria viva y la alegría del reencuentro.',
    fuente: 'UNESCO / Secretaría de Cultura',
  },
  {
    titulo: 'El origen de las Calaveritas Literarias',
    icono: '✍️',
    badge: 'Literatura Popular',
    cuerpo: 'Son una creación 100% mexicana nacida en el siglo XIX como versos satíricos y rimados donde se bromeaba con la muerte de gobernantes o personajes públicos, usando la ironía y el humor como crítica social respetuosa y festiva.',
    fuente: 'Hemeroteca Nacional de México / UNAM',
  },
];

// ── FOTOS DEL REPORTAJE TRADICIONAL ─────────────────────────────────────────
const FOTOS_TRADICION = [
  {
    src: '/images/tradicion/almas-mascotas-ofrenda.jpg',
    titulo: 'El Reencuentro de las Almas',
    descripcion: 'Representación artística de las ánimas de familiares, niños y fieles mascotas regresando con alegría a la ofrenda.',
    categoria: 'Cosmovisión',
  },
  {
    src: '/images/tradicion/altar-monumental.png',
    titulo: 'Altar Monumental de Muertos',
    descripcion: 'Ofrenda tradicional de múltiples niveles con arcos florales, cirios y frutos de temporada.',
    categoria: 'Altar Tradicional',
  },
  {
    src: '/images/tradicion/catrina-ofrenda.png',
    titulo: 'La Llama del Recuerdo',
    descripcion: 'Catrina ataviada con corona floral encendiendo las veladoras que alumbran el camino espiritual.',
    categoria: 'Catrinas',
  },
  {
    src: '/images/tradicion/ofrenda-tradicional.jpg',
    titulo: 'Ofrenda Ancestral Regional',
    descripcion: 'Niña con vestimenta tradicional y ofrenda monumental de flores de cempasúchil y frutos serranos.',
    categoria: 'Patrimonio Vivo',
  },
  {
    src: '/images/tradicion/calavera-velas.png',
    titulo: 'Calavera y Cempasúchil',
    descripcion: 'Símbolo icónico de la calavera decorada con flores y cirios de cera pura.',
    categoria: 'Símbolos',
  },
];

export default function TraditionsSection({ standalone = false }: TraditionsSectionProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const [fotoActiva, setFotoActiva] = useState<number | null>(null);

  return (
    <section
      id="tradicion"
      ref={ref}
      style={{
        backgroundColor: '#080208',
        padding: standalone ? 'clamp(32px, 5vw, 64px) clamp(16px, 4vw, 32px)' : '96px 20px',
        position: 'relative',
        overflow: 'hidden',
        color: 'white',
      }}
    >
      {/* ── Luces de fondo ambientales aisladas en GPU ── */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', transform: 'translate3d(0,0,0)', contain: 'strict' }}>
        <div style={{ position: 'absolute', top: '10%', right: '5%', width: 450, height: 450, borderRadius: '50%', filter: 'blur(140px)', background: 'radial-gradient(circle, rgba(249,115,22,0.12) 0%, transparent 70%)' }} />
        <div style={{ position: 'absolute', top: '45%', left: '5%', width: 400, height: 400, borderRadius: '50%', filter: 'blur(130px)', background: 'radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 70%)' }} />
        <div style={{ position: 'absolute', bottom: '10%', right: '15%', width: 380, height: 380, borderRadius: '50%', filter: 'blur(120px)', background: 'radial-gradient(circle, rgba(234,179,8,0.1) 0%, transparent 70%)' }} />
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1 }}>

        {/* ════════════════════════════════════════════════════════════════
            ENCABEZADO PRINCIPAL DE LA TRADICIÓN
        ════════════════════════════════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: 'clamp(36px, 6vw, 60px)' }}
        >
          {/* Badge UNESCO */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '7px 20px', borderRadius: 999,
            border: '1px solid rgba(249,115,22,0.35)',
            background: 'rgba(249,115,22,0.08)',
            marginBottom: 20,
            boxShadow: '0 0 20px rgba(249,115,22,0.15)',
          }}>
            <span style={{ fontSize: 15 }}>💀</span>
            <span style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: 'clamp(10px, 1.8vw, 12px)',
              color: '#F97316',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              fontWeight: 600,
            }}>
              Patrimonio Cultural Inmaterial de la Humanidad · UNESCO 2008
            </span>
          </div>

          <h1 style={{
            fontFamily: 'Cinzel, serif',
            fontWeight: 900,
            fontSize: 'clamp(28px, 5.5vw, 56px)',
            color: 'white',
            margin: '0 0 10px',
            lineHeight: 1.15,
            textShadow: '0 2px 20px rgba(0,0,0,0.8)',
          }}>
            El Día de Muertos en México
          </h1>
          <h2 style={{
            fontFamily: 'Cinzel, serif',
            fontWeight: 800,
            fontSize: 'clamp(20px, 3.8vw, 36px)',
            background: 'linear-gradient(135deg, #F97316 0%, #EAB308 50%, #F97316 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            margin: '0 0 24px',
            lineHeight: 1.2,
          }}>
            Tradición, Calendario Completo y Elementos de la Ofrenda
          </h2>

          <div style={{
            maxWidth: 880,
            margin: '0 auto',
            padding: '24px 28px',
            borderRadius: 20,
            border: '1px solid rgba(255,255,255,0.08)',
            background: 'rgba(255,255,255,0.025)',
            backdropFilter: 'blur(12px)',
            boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
          }}>
            <p style={{
              fontSize: 'clamp(14px, 1.8vw, 16px)',
              lineHeight: 1.85,
              color: 'rgba(255,255,255,0.82)',
              margin: 0,
              textAlign: 'justify',
              textJustify: 'inter-word',
            }}>
              El <strong style={{ color: '#F97316' }}>Día de Muertos</strong> es una de las festividades más emblemáticas de México. Más que un momento de luto, es una celebración llena de color, memoria y alegría que representa un reencuentro temporal entre los vivos y sus seres queridos fallecidos. En 2008, la <strong style={{ color: '#EAB308' }}>Organización de las Naciones Unidas para la Educación, la Ciencia y la Cultura (UNESCO)</strong> declaró esta festividad como <em>Patrimonio Cultural Inmaterial de la Humanidad</em>, reconociendo su profunda importancia social, comunitaria y espiritual.
            </p>
          </div>
        </motion.div>

        {/* ════════════════════════════════════════════════════════════════
            IMAGEN DESTACADA: EL REENCUENTRO DE LAS ALMAS
        ════════════════════════════════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.7, delay: 0.15 }}
          style={{
            position: 'relative',
            borderRadius: 24,
            overflow: 'hidden',
            border: '1px solid rgba(249,115,22,0.25)',
            marginBottom: 'clamp(48px, 7vw, 76px)',
            boxShadow: '0 20px 60px rgba(0,0,0,0.7), 0 0 40px rgba(249,115,22,0.15)',
          }}
        >
          <div style={{ position: 'relative', width: '100%', height: 'clamp(280px, 45vh, 520px)' }}>
            <Image
              src="/images/tradicion/almas-mascotas-ofrenda.jpg"
              alt="El Reencuentro de las Almas — Día de Muertos con familiares, niños y mascotas"
              fill
              style={{ objectFit: 'cover', objectPosition: 'center 40%' }}
              priority
              sizes="100vw"
            />
            {/* Gradientes oscuros */}
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(8,2,8,0.95) 0%, rgba(8,2,8,0.3) 50%, rgba(8,2,8,0.7) 100%)' }} />
          </div>

          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            padding: 'clamp(18px, 4vw, 32px)',
            display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16,
          }}>
            <div style={{ maxWidth: 640 }}>
              <span style={{
                fontFamily: 'JetBrains Mono, monospace', fontSize: 11,
                color: '#F97316', letterSpacing: '0.2em', textTransform: 'uppercase',
                display: 'block', marginBottom: 4,
              }}>
                Cosmovisión Ancestral
              </span>
              <h3 style={{
                fontFamily: 'Cinzel, serif', fontWeight: 800,
                fontSize: 'clamp(18px, 2.8vw, 28px)', color: 'white', margin: '0 0 6px',
              }}>
                El Amor que Trasciende la Muerte
              </h3>
              <p style={{
                fontSize: 'clamp(12px, 1.6vw, 14px)', color: 'rgba(255,255,255,0.75)', margin: 0, lineHeight: 1.6,
              }}>
                Abuelos, padres, hijos y fieles mascotas regresan guiados por la luz de las velas y el aroma del cempasúchil para compartir una noche más en familia.
              </p>
            </div>
            <button
              onClick={() => setFotoActiva(0)}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '10px 20px', borderRadius: 999,
                background: 'rgba(249,115,22,0.2)', border: '1px solid rgba(249,115,22,0.5)',
                color: 'white', cursor: 'pointer', fontFamily: 'JetBrains Mono, monospace', fontSize: 12,
                backdropFilter: 'blur(8px)',
              }}
            >
              <ZoomIn size={14} color="#F97316" /> Ver imagen completa
            </button>
          </div>
        </motion.div>

        {/* ════════════════════════════════════════════════════════════════
            SECCIÓN 1: 📅 EL CALENDARIO COMPLETO
        ════════════════════════════════════════════════════════════════ */}
        <div style={{ marginBottom: 'clamp(56px, 8vw, 84px)' }}>
          <div style={{ textAlign: 'center', marginBottom: 36 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 8 }}>
              <Calendar size={20} color="#F97316" />
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: '#F97316', letterSpacing: '0.25em', textTransform: 'uppercase' }}>
                Ciclo Ritual
              </span>
            </div>
            <h2 style={{
              fontFamily: 'Cinzel, serif', fontWeight: 800,
              fontSize: 'clamp(24px, 4vw, 42px)', color: 'white', margin: '0 0 12px',
            }}>
              El Calendario Completo: ¿Para quién es cada fecha?
            </h2>
            <p style={{
              fontSize: 14, color: 'rgba(255,255,255,0.6)', maxWidth: 700, margin: '0 auto', lineHeight: 1.7,
            }}>
              Aunque la celebración principal ocurre el 1 y 2 de noviembre, la tradición popular y las comunidades indígenas extienden el calendario desde el 27 de octubre para recibir a distintas ánimas según cómo fallecieron o su naturaleza:
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(clamp(260px, 45%, 520px), 1fr))',
            gap: 20,
          }}>
            {CALENDARIO.map((item, idx) => (
              <motion.div
                key={item.day}
                initial={{ opacity: 0, y: 24 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.45, delay: 0.1 + idx * 0.05 }}
                style={{
                  position: 'relative',
                  padding: '24px 26px',
                  borderRadius: 20,
                  border: item.isEvent ? '1px solid rgba(249,115,22,0.6)' : '1px solid rgba(255,255,255,0.08)',
                  background: item.isEvent
                    ? 'linear-gradient(135deg, rgba(249,115,22,0.12) 0%, rgba(15,5,15,0.95) 100%)'
                    : 'rgba(255,255,255,0.03)',
                  boxShadow: item.isEvent ? '0 0 35px rgba(249,115,22,0.15)' : 'none',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                {/* Header de la tarjeta */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 14 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{
                        padding: '6px 14px', borderRadius: 12,
                        background: `${item.color}20`, border: `1px solid ${item.color}50`,
                        textAlign: 'center',
                      }}>
                        <span style={{ fontFamily: 'Cinzel, serif', fontWeight: 900, fontSize: 24, color: item.color, display: 'block', lineHeight: 1 }}>
                          {item.day}
                        </span>
                        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: 'rgba(255,255,255,0.6)', letterSpacing: '0.15em' }}>
                          {item.month}
                        </span>
                      </div>
                      <div>
                        <span style={{ fontSize: 22 }}>{item.emoji}</span>
                        <h3 style={{
                          fontFamily: 'Cinzel, serif', fontWeight: 800,
                          fontSize: 'clamp(15px, 2vw, 18px)', color: 'white', margin: '2px 0 0', lineHeight: 1.2,
                        }}>
                          {item.title}
                        </h3>
                      </div>
                    </div>

                    {item.isEvent && (
                      <span style={{
                        padding: '4px 10px', borderRadius: 999,
                        background: 'linear-gradient(135deg, #F97316, #C2410C)',
                        fontSize: 10, fontWeight: 700, fontFamily: 'JetBrains Mono, monospace',
                        color: 'white', letterSpacing: '0.05em', whiteSpace: 'nowrap',
                      }}>
                        ★ CBTA #134
                      </span>
                    )}
                  </div>

                  <p style={{
                    fontSize: 14, color: 'rgba(255,255,255,0.78)', lineHeight: 1.75, margin: '0 0 14px',
                    textAlign: 'justify', textJustify: 'inter-word',
                  }}>
                    {item.desc}
                  </p>

                  <div style={{
                    padding: '10px 14px', borderRadius: 12,
                    background: 'rgba(0,0,0,0.35)', border: '1px solid rgba(255,255,255,0.06)',
                    marginBottom: 12,
                  }}>
                    <p style={{
                      fontSize: 12, color: 'rgba(255,255,255,0.7)', margin: 0, lineHeight: 1.6,
                      fontFamily: 'Inter, sans-serif',
                    }}>
                      {item.altar}
                    </p>
                  </div>
                </div>

                <div style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 10,
                }}>
                  <Info size={11} color="rgba(249,115,22,0.7)" style={{ flexShrink: 0 }} />
                  <span style={{
                    fontFamily: 'JetBrains Mono, monospace', fontSize: 10,
                    color: 'rgba(255,255,255,0.4)', lineHeight: 1.4,
                  }}>
                    Fuente: {item.source}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ════════════════════════════════════════════════════════════════
            SECCIÓN 2: 🏛️ ORIGEN HISTÓRICO: EL SINCRETISMO CULTURAL
        ════════════════════════════════════════════════════════════════ */}
        <div style={{ marginBottom: 'clamp(56px, 8vw, 84px)' }}>
          <div style={{ textAlign: 'center', marginBottom: 36 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 8 }}>
              <BookOpen size={20} color="#EAB308" />
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: '#EAB308', letterSpacing: '0.25em', textTransform: 'uppercase' }}>
                Historia y Raíces
              </span>
            </div>
            <h2 style={{
              fontFamily: 'Cinzel, serif', fontWeight: 800,
              fontSize: 'clamp(24px, 4vw, 42px)', color: 'white', margin: '0 0 12px',
            }}>
              Origen Histórico: El Sincretismo Cultural
            </h2>
            <p style={{
              fontSize: 14, color: 'rgba(255,255,255,0.6)', maxWidth: 720, margin: '0 auto', lineHeight: 1.7,
            }}>
              Contrario a la creencia popular de que es 100% prehispánico, el Día de Muertos es el resultado vivo de un profundo <strong>sincretismo religioso y cultural</strong> entre dos mundos:
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }}>
            {/* Raíces Mesoamericanas */}
            <div style={{
              padding: '28px', borderRadius: 24,
              border: '1px solid rgba(249,115,22,0.25)',
              background: 'linear-gradient(180deg, rgba(249,115,22,0.06) 0%, rgba(10,4,4,0.85) 100%)',
              boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                <span style={{ fontSize: 32 }}>🌽</span>
                <div>
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: '#F97316', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                    Parte I
                  </span>
                  <h3 style={{ fontFamily: 'Cinzel, serif', fontWeight: 800, fontSize: 20, color: 'white', margin: 0 }}>
                    Raíces Mesoamericanas
                  </h3>
                </div>
              </div>
              <p style={{
                fontSize: 14, color: 'rgba(255,255,255,0.78)', lineHeight: 1.85, margin: '0 0 16px',
                textAlign: 'justify', textJustify: 'inter-word',
              }}>
                Los pueblos originarios (como <strong style={{ color: '#F97316' }}>mexicas, mayas, nahuas y purépechas</strong>) veían la muerte no como un castigo ni un final absoluto, sino como el inicio de una trayectoria hacia el <em>Mictlán</em> (el inframundo de nueve niveles). Los rituales de culto a los ancestros se entrelazaban con los ciclos agrícolas sagrados del maíz y la cosecha, celebrando la continuidad de la vida.
              </p>
              <div style={{
                padding: '8px 14px', borderRadius: 10, background: 'rgba(249,115,22,0.1)',
                border: '1px solid rgba(249,115,22,0.2)', display: 'inline-block',
              }}>
                <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: '#F97316' }}>
                  Fuente: UNAM Global · Universidad Nacional Autónoma de México
                </span>
              </div>
            </div>

            {/* Fusión Española */}
            <div style={{
              padding: '28px', borderRadius: 24,
              border: '1px solid rgba(124,58,237,0.25)',
              background: 'linear-gradient(180deg, rgba(124,58,237,0.06) 0%, rgba(10,4,4,0.85) 100%)',
              boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                <span style={{ fontSize: 32 }}>⛪</span>
                <div>
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: '#A855F7', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                    Parte II
                  </span>
                  <h3 style={{ fontFamily: 'Cinzel, serif', fontWeight: 800, fontSize: 20, color: 'white', margin: 0 }}>
                    Imposición y Adaptación Hispánica
                  </h3>
                </div>
              </div>
              <p style={{
                fontSize: 14, color: 'rgba(255,255,255,0.78)', lineHeight: 1.85, margin: '0 0 16px',
                textAlign: 'justify', textJustify: 'inter-word',
              }}>
                Con la llegada de los españoles en el siglo XVI, la Iglesia Católica introdujo las festividades litúrgicas europeas del <em>Día de Todos los Santos</em> (1 de noviembre) y de los <em>Fieles Difuntos</em> (2 de noviembre). Las fechas y devociones europeas se adaptaron y fusionaron armoniosamente con la cosmovisión indígena, dando pie a los altares escalonados y a la tradición actual única en el mundo.
              </p>
              <div style={{
                padding: '8px 14px', borderRadius: 10, background: 'rgba(124,58,237,0.1)',
                border: '1px solid rgba(124,58,237,0.2)', display: 'inline-block',
              }}>
                <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: '#C084FC' }}>
                  Fuente: Instituto Nacional de Antropología e Historia (INAH)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ════════════════════════════════════════════════════════════════
            SECCIÓN 3: 🍊 ELEMENTOS ESENCIALES DE LA OFRENDA
        ════════════════════════════════════════════════════════════════ */}
        <div style={{ marginBottom: 'clamp(56px, 8vw, 84px)' }}>
          <div style={{ textAlign: 'center', marginBottom: 36 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 8 }}>
              <Flame size={20} color="#F97316" />
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: '#F97316', letterSpacing: '0.25em', textTransform: 'uppercase' }}>
                Simbología Sagrada
              </span>
            </div>
            <h2 style={{
              fontFamily: 'Cinzel, serif', fontWeight: 800,
              fontSize: 'clamp(24px, 4vw, 42px)', color: 'white', margin: '0 0 12px',
            }}>
              Elementos Esenciales de la Ofrenda y su Significado
            </h2>
            <p style={{
              fontSize: 14, color: 'rgba(255,255,255,0.6)', maxWidth: 740, margin: '0 auto', lineHeight: 1.7,
            }}>
              Un altar de muertos no es solo una decoración; es un auténtico <strong>portal simbólico</strong> entre dimensiones. Cada elemento cumple una función espiritual específica avalada por las tradiciones populares documentadas por el <strong>INPI</strong>:
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(clamp(260px, 30%, 360px), 1fr))',
            gap: 18,
          }}>
            {ELEMENTOS.map((elem, i) => (
              <div
                key={elem.nombre}
                style={{
                  padding: '22px 24px',
                  borderRadius: 20,
                  border: '1px solid rgba(255,255,255,0.07)',
                  background: 'rgba(255,255,255,0.025)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                    <span style={{ fontSize: 30 }}>{elem.icono}</span>
                    <span style={{
                      fontFamily: 'JetBrains Mono, monospace', fontSize: 10,
                      color: 'rgba(249,115,22,0.85)', background: 'rgba(249,115,22,0.1)',
                      padding: '3px 10px', borderRadius: 999, border: '1px solid rgba(249,115,22,0.2)',
                    }}>
                      {elem.categoria}
                    </span>
                  </div>
                  <h3 style={{
                    fontFamily: 'Cinzel, serif', fontWeight: 700,
                    fontSize: 16, color: 'white', margin: '0 0 8px', lineHeight: 1.3,
                  }}>
                    {elem.nombre}
                  </h3>
                  <p style={{
                    fontSize: 13, color: 'rgba(255,255,255,0.72)', lineHeight: 1.7, margin: 0,
                    textAlign: 'justify', textJustify: 'inter-word',
                  }}>
                    {elem.significado}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ════════════════════════════════════════════════════════════════
            GALERÍA DE FOTOS TESTIMONIALES (5 IMÁGENES APORTADAS)
        ════════════════════════════════════════════════════════════════ */}
        <div style={{ marginBottom: 'clamp(56px, 8vw, 84px)' }}>
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <span style={{
              fontFamily: 'JetBrains Mono, monospace', fontSize: 12,
              color: '#F97316', letterSpacing: '0.25em', textTransform: 'uppercase',
              display: 'block', marginBottom: 8,
            }}>
              Memoria Visual
            </span>
            <h2 style={{
              fontFamily: 'Cinzel, serif', fontWeight: 800,
              fontSize: 'clamp(24px, 4vw, 40px)', color: 'white', margin: 0,
            }}>
              Galería Fotográfica de la Tradición
            </h2>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 16,
          }}>
            {FOTOS_TRADICION.map((foto, idx) => (
              <div
                key={foto.src}
                onClick={() => setFotoActiva(idx)}
                style={{
                  position: 'relative',
                  aspectRatio: '4/3',
                  borderRadius: 18,
                  overflow: 'hidden',
                  cursor: 'pointer',
                  border: '1px solid rgba(255,255,255,0.1)',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
                }}
              >
                <Image
                  src={foto.src}
                  alt={foto.titulo}
                  fill
                  style={{ objectFit: 'cover', transition: 'transform 0.4s ease' }}
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div style={{
                  position: 'absolute', inset: 0,
                  background: 'linear-gradient(to top, rgba(8,2,8,0.92) 0%, transparent 60%)',
                  display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
                  padding: 16,
                }}>
                  <span style={{
                    fontFamily: 'JetBrains Mono, monospace', fontSize: 10,
                    color: '#F97316', letterSpacing: '0.15em', textTransform: 'uppercase',
                  }}>
                    {foto.categoria}
                  </span>
                  <p style={{
                    fontFamily: 'Cinzel, serif', fontWeight: 700,
                    fontSize: 15, color: 'white', margin: '2px 0 0',
                  }}>
                    {foto.titulo}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ════════════════════════════════════════════════════════════════
            SECCIÓN 4: 🧐 DATOS CURIOSOS RESPALDADOS
        ════════════════════════════════════════════════════════════════ */}
        <div style={{ marginBottom: 48 }}>
          <div style={{ textAlign: 'center', marginBottom: 36 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 8 }}>
              <Sparkles size={20} color="#EAB308" />
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: '#EAB308', letterSpacing: '0.25em', textTransform: 'uppercase' }}>
                Sabiduría Popular
              </span>
            </div>
            <h2 style={{
              fontFamily: 'Cinzel, serif', fontWeight: 800,
              fontSize: 'clamp(24px, 4vw, 42px)', color: 'white', margin: '0 0 12px',
            }}>
              Datos Curiosos Respaldados
            </h2>
            <p style={{
              fontSize: 14, color: 'rgba(255,255,255,0.6)', maxWidth: 650, margin: '0 auto', lineHeight: 1.7,
            }}>
              Detalles fascinantes avalados por historiadores, la UNAM y el Instituto Nacional de Antropología e Historia:
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
            {CURIOSIDADES.map((cur) => (
              <div
                key={cur.titulo}
                style={{
                  padding: '26px',
                  borderRadius: 22,
                  border: '1px solid rgba(249,115,22,0.2)',
                  background: 'rgba(255,255,255,0.025)',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                    <span style={{ fontSize: 32 }}>{cur.icono}</span>
                    <span style={{
                      fontFamily: 'JetBrains Mono, monospace', fontSize: 10,
                      color: '#EAB308', background: 'rgba(234,179,8,0.1)',
                      padding: '3px 10px', borderRadius: 999, border: '1px solid rgba(234,179,8,0.25)',
                    }}>
                      {cur.badge}
                    </span>
                  </div>
                  <h3 style={{
                    fontFamily: 'Cinzel, serif', fontWeight: 800,
                    fontSize: 17, color: 'white', margin: '0 0 10px', lineHeight: 1.3,
                  }}>
                    {cur.titulo}
                  </h3>
                  <p style={{
                    fontSize: 13.5, color: 'rgba(255,255,255,0.75)', lineHeight: 1.8, margin: 0,
                    textAlign: 'justify', textJustify: 'inter-word',
                  }}>
                    {cur.cuerpo}
                  </p>
                </div>

                <div style={{
                  marginTop: 18, paddingTop: 12, borderTop: '1px solid rgba(255,255,255,0.06)',
                  fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: 'rgba(249,115,22,0.75)',
                }}>
                  📖 Fuente: {cur.fuente}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* ── LIGHTBOX PARA AMPLIAR FOTOS ── */}
      <AnimatePresence>
        {fotoActiva !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setFotoActiva(null)}
            style={{
              position: 'fixed', inset: 0, zIndex: 120,
              background: 'rgba(0,0,0,0.95)', backdropFilter: 'blur(16px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: 20,
            }}
          >
            <motion.div
              initial={{ scale: 0.92 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.92 }}
              onClick={e => e.stopPropagation()}
              style={{
                position: 'relative',
                maxWidth: 960,
                width: '100%',
                maxHeight: '90vh',
                borderRadius: 20,
                overflow: 'hidden',
                background: '#0A0404',
                border: '1px solid rgba(249,115,22,0.3)',
              }}
            >
              <div style={{ position: 'relative', width: '100%', height: 'clamp(320px, 60vh, 560px)' }}>
                <Image
                  src={FOTOS_TRADICION[fotoActiva].src}
                  alt={FOTOS_TRADICION[fotoActiva].titulo}
                  fill
                  style={{ objectFit: 'contain' }}
                  priority
                />
              </div>

              <div style={{
                padding: '20px 24px',
                background: 'rgba(15,5,15,0.95)',
                borderTop: '1px solid rgba(255,255,255,0.1)',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12,
              }}>
                <div>
                  <h4 style={{ fontFamily: 'Cinzel, serif', fontWeight: 700, fontSize: 18, color: 'white', margin: '0 0 4px' }}>
                    {FOTOS_TRADICION[fotoActiva].titulo}
                  </h4>
                  <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)', margin: 0 }}>
                    {FOTOS_TRADICION[fotoActiva].descripcion}
                  </p>
                </div>
                <button
                  onClick={() => setFotoActiva(null)}
                  style={{
                    padding: '8px 16px', borderRadius: 999,
                    background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white',
                    cursor: 'pointer', fontFamily: 'JetBrains Mono, monospace', fontSize: 12,
                  }}
                >
                  Cerrar ✕
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
