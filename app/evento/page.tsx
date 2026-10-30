'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { Play, Zap, Clock, Film } from 'lucide-react';

// Importaciones dinámicas para evitar errores SSR
const NavMenu = dynamic(() => import('@/components/NavMenu'), { ssr: false });

// =====================================================================
// DATOS DEL EVENTO — Cronología oficial
// =====================================================================
const TIMELINE = [
  {
    time: '8:00 AM',
    icon: '🎓',
    title: 'Reunión de alumnos',
    desc: 'Reunión de alumnos de tercer semestre en el centro del plantel CBTA #134.',
  },
  {
    time: '8:00 – 10:00',
    icon: '🕯️',
    title: 'Montaje de ofrendas y mercado',
    desc: 'Montaje de ofrendas y del mercado tradicional por parte de los grupos participantes.',
  },
  {
    time: '8:30',
    icon: '🚶',
    title: 'Salida del contingente',
    desc: 'Salida del desfile desde el centro de Tetlanohcan hacia el barrio de Aquiahuac: grupos 3"A" Agropecuario, SPP, Ofimática, Contabilidad y Programación.',
  },
  {
    time: '9:30',
    icon: '🏛️',
    title: 'Llegada al Auditorio de Aquiahuac',
    desc: 'Llegada del contingente al Auditorio de Aquiahuac. Incorporación al evento.',
  },
  {
    time: '10:00 – 12:00',
    icon: '⭐',
    title: 'Evaluación de ofrendas',
    desc: 'Evaluación oficial de ofrendas por el jurado calificador del concurso.',
  },
  {
    time: '10:00',
    icon: '🎭',
    title: 'Inicio del Festival',
    desc: 'Inicio del "Festival Entre la Vida y la Muerte". Presentaciones culturales, danzas y actuaciones.',
  },
  {
    time: '12:00',
    icon: '🎉',
    title: 'Cierre — Primera Parte',
    desc: 'Cierre de la primera parte del festival.',
  },
  {
    time: '12:00 – 12:20',
    icon: '💻',
    title: '5"A" Programación — Cierre 2ª parte',
    desc: 'Participación especial del grupo 5"A" de Programación y cierre de la segunda parte del festival.',
  },
  {
    time: '12:30 – 13:30',
    icon: '🧹',
    title: 'Levantamiento de ofrendas',
    desc: 'Se levantan las ofrendas y se deja limpio el lugar. Fin del evento.',
  },
];

// =====================================================================
// DATOS DE FOTOS — Agrega tus fotos reales aquí
// Pon tus imágenes en /public/images/evento/  (foto1.jpg, foto2.jpg, etc.)
// =====================================================================
const FOTOS: { src: string; caption: string; categoria: string }[] = [
  // ⬇ DESCOMENTA Y EDITA CUANDO TENGAS TUS FOTOS ⬇
  // { src: '/images/evento/foto1.jpg',  caption: 'Desfile de Catrines y Catrinas', categoria: 'Desfile' },
  // { src: '/images/evento/foto2.jpg',  caption: 'Ofrenda del grupo 3"A"',          categoria: 'Ofrendas' },
  // { src: '/images/evento/foto3.jpg',  caption: 'Mercado Tradicional',             categoria: 'Mercado'  },
  // { src: '/images/evento/foto4.jpg',  caption: 'Festival — actuación',            categoria: 'Festival' },

  // Placeholders visuales mientras no tengas las fotos reales
  { src: '/images/catrina-roses.jpg',  caption: 'Festival Entre la Vida y la Muerte',  categoria: 'Festival'  },
  { src: '/images/catrina-dress.jpg',  caption: 'Desfile de Catrines y Catrinas',       categoria: 'Desfile'   },
  { src: '/images/catrina-candle.jpg', caption: 'Ofrenda tradicional',                  categoria: 'Ofrendas'  },
  { src: '/images/catrina-roses.jpg',  caption: 'Mercado cultural tradicional',         categoria: 'Mercado'   },
  { src: '/images/catrina-dress.jpg',  caption: 'Presentación artística',               categoria: 'Festival'  },
  { src: '/images/catrina-candle.jpg', caption: 'Concurso de ofrendas',                 categoria: 'Ofrendas'  },
];

// =====================================================================
// VIDEOS CORTOS / CÁPSULAS — Clips optimizados (15 a 30s)
// =====================================================================
export interface VideoClip {
  src: string;
  poster: string;
  titulo: string;
  duracion: string;
  categoria: string;
}

const VIDEOS: VideoClip[] = [
  // ⬇ Agrega aquí tus clips cortos (15-30 segundos). Formato MP4 o enlace optimizado. ⬇
  // { src: '/videos/desfile-clip.mp4', poster: '/images/catrina-roses.jpg', titulo: 'Desfile de Catrinas', duracion: '0:25', categoria: 'Desfile' },
  // { src: '/videos/ofrendas-clip.mp4', poster: '/images/catrina-candle.jpg', titulo: 'Concurso de Ofrendas', duracion: '0:30', categoria: 'Ofrendas' },
];

const CATEGORIAS = ['Todas', 'Desfile', 'Ofrendas', 'Mercado', 'Festival'];

// =====================================================================
// COMPONENTE PRINCIPAL
// =====================================================================
export default function EventoPage() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [ambientColor, setAmbientColor] = useState('rgba(249,115,22,0.45)');
  const [categoriaActiva, setCategoriaActiva] = useState('Todas');
  const [fotoAmpliada, setFotoAmpliada] = useState<number | null>(null);
  const [playingVideo, setPlayingVideo] = useState<number | null>(null);

  const fotosFiltradas = categoriaActiva === 'Todas'
    ? FOTOS
    : FOTOS.filter(f => f.categoria === categoriaActiva);

  // Cerrar lightbox con Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setFotoAmpliada(null);
      if (e.key === 'ArrowRight' && fotoAmpliada !== null) setFotoAmpliada(i => i !== null ? Math.min(i + 1, fotosFiltradas.length - 1) : null);
      if (e.key === 'ArrowLeft'  && fotoAmpliada !== null) setFotoAmpliada(i => i !== null ? Math.max(i - 1, 0) : null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [fotoAmpliada, fotosFiltradas.length]);

  return (
    <>
      {/* ── BG global ── */}
      <div style={{ minHeight: '100vh', backgroundColor: '#080208', color: 'white', fontFamily: 'Inter, sans-serif' }}>

        {/* ── HEADER ── */}
        <header style={{
          position: 'sticky', top: 0, zIndex: 30,
          background: 'rgba(8,2,8,0.88)',
          backdropFilter: 'blur(18px)',
          borderBottom: '1px solid rgba(249,115,22,0.12)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: 'clamp(12px,2vw,20px) clamp(16px,5vw,48px)',
        }}>
          {/* Botón menú */}
          <button
            onClick={() => setIsMenuOpen(true)}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '8px 16px', borderRadius: 999,
              border: '1px solid rgba(255,255,255,0.1)',
              background: 'rgba(255,255,255,0.04)',
              color: 'rgba(255,255,255,0.7)', cursor: 'pointer', fontSize: 13,
              fontFamily: 'JetBrains Mono, monospace',
            }}
          >
            <span style={{ fontSize: 16 }}>☰</span> Menú
          </button>

          {/* Centro — título */}
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontFamily: 'Cinzel, serif', fontWeight: 700, fontSize: 'clamp(13px,2.5vw,18px)', color: 'white', margin: 0, letterSpacing: '0.08em' }}>
              🎭 FESTIVAL ENTRE LA VIDA Y LA MUERTE
            </p>
            <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: 'rgba(249,115,22,0.6)', margin: 0 }}>
              CBTA #134 — Miércoles 28 de octubre, 2026
            </p>
          </div>

          {/* Botón volver */}
          <button
            onClick={() => router.push('/')}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '8px 20px', borderRadius: 999,
              background: 'linear-gradient(135deg, #F97316, #C2410C)',
              border: 'none', color: 'white', cursor: 'pointer',
              fontSize: 13, fontWeight: 600, fontFamily: 'Inter, sans-serif',
              boxShadow: '0 4px 16px rgba(249,115,22,0.3)',
            }}
          >
            ← Inicio
          </button>
        </header>

        {/* ── HERO BANNER ── */}
        <div style={{ position: 'relative', height: 'clamp(260px,40vh,480px)', overflow: 'hidden' }}>
          <Image
            src="/images/catrina-roses.jpg"
            alt="Festival Entre la Vida y la Muerte"
            fill
            style={{ objectFit: 'cover', objectPosition: 'center top', opacity: 0.4 }}
            priority
          />
          {/* Gradient overlay */}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(8,2,8,0.2) 0%, rgba(8,2,8,0.5) 60%, #080208 100%)' }} />
          {/* Glow naranja */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'radial-gradient(ellipse at 50% 60%, rgba(249,115,22,0.18) 0%, transparent 65%)',
          }} />

          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            padding: 'clamp(20px,5vw,48px)',
            textAlign: 'center',
          }}>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: 'rgba(249,115,22,0.7)', letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: 8 }}
            >
              Reporte del Evento
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              style={{
                fontFamily: 'Cinzel, serif', fontWeight: 900,
                fontSize: 'clamp(28px,6vw,72px)',
                lineHeight: 1.05,
                background: 'linear-gradient(135deg, #F97316, #EAB308, #F97316)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                margin: '0 0 12px',
              }}
            >
              Festival Entre la Vida<br />y la Muerte
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              style={{ fontFamily: 'Inter, sans-serif', fontSize: 'clamp(14px,2vw,18px)', color: 'rgba(255,255,255,0.6)', margin: 0 }}
            >
              Auditorio de Aquiahuac, San Francisco Tetlanohcan, Tlaxcala
            </motion.p>
          </div>
        </div>

        {/* ── CONTENIDO PRINCIPAL ── */}
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: 'clamp(24px,5vw,60px) clamp(16px,5vw,48px)' }}>

          {/* ── STATS / BADGES ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            style={{
              display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
              gap: 16, marginBottom: 64,
            }}
          >
            {[
              { icon: '📅', label: 'Fecha', value: '28 oct. 2026' },
              { icon: '⏰', label: 'Horario', value: '8:00 – 13:30' },
              { icon: '📍', label: 'Lugar', value: 'Aud. Aquiahuac' },
              { icon: '🏫', label: 'Institución', value: 'CBTA #134' },
              { icon: '👨‍🎓', label: 'Alumnos', value: '3er Semestre' },
              { icon: '🏆', label: 'Concurso', value: 'Ofrendas' },
            ].map((s) => (
              <div key={s.label} style={{
                padding: '18px 20px', borderRadius: 16,
                border: '1px solid rgba(249,115,22,0.15)',
                background: 'rgba(249,115,22,0.05)',
                textAlign: 'center',
              }}>
                <div style={{ fontSize: 26, marginBottom: 6 }}>{s.icon}</div>
                <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 4 }}>{s.label}</div>
                <div style={{ fontFamily: 'Cinzel, serif', fontSize: 13, fontWeight: 700, color: 'rgba(249,115,22,0.9)' }}>{s.value}</div>
              </div>
            ))}
          </motion.div>

          {/* ── SECCIÓN: Descripción general ── */}
          <motion.section
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            style={{ marginBottom: 72 }}
          >
            <SectionTitle icon="📜" title="Sobre el Evento" />
            <div style={{
              padding: 'clamp(20px,4vw,36px)',
              borderRadius: 20,
              border: '1px solid rgba(255,255,255,0.07)',
              background: 'rgba(255,255,255,0.02)',
              lineHeight: 1.8,
              fontSize: 'clamp(14px,1.8vw,17px)',
              color: 'rgba(255,255,255,0.75)',
              textAlign: 'justify',
              textJustify: 'inter-word',
            }}>
              <p style={{ margin: '0 0 16px' }}>
                El <strong style={{ color: '#F97316' }}>Festival Entre la Vida y la Muerte</strong> es una celebración cultural organizada por el <strong style={{ color: '#EAB308' }}>Centro de Bachillerato Tecnológico Agropecuario No. 134</strong> de San Francisco Tetlanohcan, Tlaxcala, como parte del Programa Aula-Escuela-Comunidad (PAEC).
              </p>
              <p style={{ margin: '0 0 16px' }}>
                El evento se realizó el miércoles <strong style={{ color: 'white' }}>28 de octubre de 2026</strong> en el <strong style={{ color: 'white' }}>Auditorio de Aquiahuac</strong>, barrio de San Francisco Tetlanohcan. Los alumnos de <strong style={{ color: '#F97316' }}>tercer semestre</strong> participaron con desfile, montaje de ofrendas, mercado tradicional y presentaciones artísticas.
              </p>
              <p style={{ margin: 0 }}>
                El acto culminante fue el Concurso de Ofrendas, evaluado por un jurado oficial, donde los grupos de quinto semestre compitieron en la creación de altares tradicionales, con un premio sorpresa al primer lugar.
              </p>
            </div>
          </motion.section>

          {/* ── SECCIÓN: Cronología del evento ── */}
          <motion.section
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            style={{ marginBottom: 72 }}
          >
            <SectionTitle icon="🕐" title="Cronología del Día" />
            <div style={{ position: 'relative' }}>
              {/* Línea vertical */}
              <div style={{
                position: 'absolute', left: 'clamp(24px,5vw,40px)', top: 0, bottom: 0,
                width: 2,
                background: 'linear-gradient(to bottom, #F97316, rgba(249,115,22,0.1))',
              }} />

              <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                {TIMELINE.map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.45 + i * 0.06 }}
                    style={{
                      display: 'flex', gap: 'clamp(16px,4vw,32px)',
                      paddingLeft: 'clamp(52px,9vw,80px)',
                      paddingBottom: 28,
                      position: 'relative',
                    }}
                  >
                    {/* Dot */}
                    <div style={{
                      position: 'absolute',
                      left: 'clamp(14px,3.5vw,30px)',
                      top: 6,
                      width: 22, height: 22,
                      borderRadius: '50%',
                      background: '#080208',
                      border: '2px solid #F97316',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 11,
                      zIndex: 1,
                    }}>
                      {item.icon}
                    </div>

                    <div style={{
                      flex: 1,
                      padding: '16px 20px',
                      borderRadius: 14,
                      border: '1px solid rgba(249,115,22,0.12)',
                      background: 'rgba(249,115,22,0.04)',
                    }}>
                      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px 16px', marginBottom: 6 }}>
                        <span style={{
                          fontFamily: 'JetBrains Mono, monospace',
                          fontSize: 12, fontWeight: 700,
                          color: '#F97316',
                          background: 'rgba(249,115,22,0.1)',
                          padding: '2px 10px', borderRadius: 999,
                          border: '1px solid rgba(249,115,22,0.2)',
                          whiteSpace: 'nowrap',
                        }}>
                          {item.time}
                        </span>
                        <span style={{ fontFamily: 'Cinzel, serif', fontSize: 'clamp(13px,1.8vw,16px)', fontWeight: 700, color: 'white' }}>
                          {item.title}
                        </span>
                      </div>
                      <p style={{ margin: 0, fontSize: 'clamp(13px,1.5vw,15px)', color: 'rgba(255,255,255,0.6)', lineHeight: 1.6 }}>
                        {item.desc}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.section>

          {/* ── SECCIÓN: Galería de Fotos ── */}
          <motion.section
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            style={{ marginBottom: 72 }}
          >
            <SectionTitle icon="📸" title="Galería Fotográfica" />

            {/* Filtros por categoría */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 28 }}>
              {CATEGORIAS.map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategoriaActiva(cat)}
                  style={{
                    padding: '7px 18px', borderRadius: 999, cursor: 'pointer',
                    fontFamily: 'JetBrains Mono, monospace', fontSize: 12,
                    border: categoriaActiva === cat ? '1px solid #F97316' : '1px solid rgba(255,255,255,0.12)',
                    background: categoriaActiva === cat ? 'rgba(249,115,22,0.15)' : 'rgba(255,255,255,0.03)',
                    color: categoriaActiva === cat ? '#F97316' : 'rgba(255,255,255,0.55)',
                    transition: 'all 0.2s',
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Instrucción para agregar fotos */}
            <div style={{
              marginBottom: 20, padding: '12px 18px', borderRadius: 12,
              border: '1px dashed rgba(249,115,22,0.3)',
              background: 'rgba(249,115,22,0.05)',
              fontFamily: 'JetBrains Mono, monospace', fontSize: 12,
              color: 'rgba(249,115,22,0.7)',
            }}>
              💡 Para agregar tus fotos: copia los archivos a <code style={{ background: 'rgba(0,0,0,0.3)', padding: '1px 6px', borderRadius: 4 }}>/public/images/evento/</code> y edita el arreglo <code style={{ background: 'rgba(0,0,0,0.3)', padding: '1px 6px', borderRadius: 4 }}>FOTOS</code> en este archivo.
            </div>

            {/* Grid de fotos */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(clamp(200px,28vw,320px), 1fr))',
              gap: 'clamp(8px,2vw,16px)',
            }}>
              {fotosFiltradas.map((foto, i) => (
                <motion.div
                  key={`${foto.src}-${i}`}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => setFotoAmpliada(i)}
                  style={{
                    position: 'relative',
                    aspectRatio: '4/3',
                    borderRadius: 14,
                    overflow: 'hidden',
                    cursor: 'pointer',
                    border: '1px solid rgba(249,115,22,0.1)',
                  }}
                >
                  <Image
                    src={foto.src}
                    alt={foto.caption}
                    fill
                    style={{ objectFit: 'cover', transition: 'transform 0.4s ease' }}
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  {/* Hover overlay */}
                  <div style={{
                    position: 'absolute', inset: 0,
                    background: 'linear-gradient(to top, rgba(8,2,8,0.85) 0%, transparent 50%)',
                    display: 'flex', alignItems: 'flex-end', padding: 14,
                    opacity: 0, transition: 'opacity 0.3s',
                  }}
                    onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
                    onMouseLeave={e => (e.currentTarget.style.opacity = '0')}
                  >
                    <div>
                      <span style={{
                        fontFamily: 'JetBrains Mono, monospace', fontSize: 10,
                        color: '#F97316', letterSpacing: '0.15em',
                        textTransform: 'uppercase', display: 'block', marginBottom: 2,
                      }}>{foto.categoria}</span>
                      <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 13, color: 'white', fontWeight: 500 }}>{foto.caption}</span>
                    </div>
                  </div>
                  {/* Badge categoría */}
                  <div style={{
                    position: 'absolute', top: 10, left: 10,
                    padding: '3px 10px', borderRadius: 999,
                    background: 'rgba(8,2,8,0.75)', backdropFilter: 'blur(8px)',
                    fontFamily: 'JetBrains Mono, monospace', fontSize: 10,
                    color: 'rgba(249,115,22,0.8)',
                    border: '1px solid rgba(249,115,22,0.2)',
                  }}>
                    {foto.categoria}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* ── SECCIÓN: Videos Cortos / Cápsulas ── */}
          <motion.section
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
            style={{ marginBottom: 72 }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 20 }}>
              <SectionTitle icon="🎬" title="Cápsulas y Videos Cortos" />
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                padding: '4px 12px', borderRadius: 999,
                background: 'rgba(249,115,22,0.1)', border: '1px solid rgba(249,115,22,0.25)',
                fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: '#F97316',
              }}>
                <Zap size={12} />
                <span>Carga Ligera · 0 KB Iniciales</span>
              </div>
            </div>

            {VIDEOS.length === 0 ? (
              <div style={{
                padding: '36px 24px', borderRadius: 20, textAlign: 'center',
                border: '1px solid rgba(249,115,22,0.2)',
                background: 'rgba(249,115,22,0.02)',
                maxWidth: 680, margin: '0 auto',
              }}>
                <div style={{
                  width: 52, height: 52, borderRadius: '50%',
                  background: 'rgba(249,115,22,0.12)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 12px', fontSize: 24,
                }}>
                  🎬
                </div>
                <h3 style={{ fontFamily: 'Cinzel, serif', fontSize: 18, color: 'white', margin: '0 0 6px', fontWeight: 700 }}>
                  Cápsulas y Momentos en Video
                </h3>
                <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', margin: '0 0 14px', lineHeight: 1.6, maxWidth: 480, marginLeft: 'auto', marginRight: 'auto' }}>
                  Las cápsulas cortas (15 a 30 seg) del desfile de catrinas y concurso de ofrendas se publicarán en este espacio con reproducción bajo demanda sin consumir memoria ni datos previos.
                </p>
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  padding: '5px 14px', borderRadius: 999,
                  background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                  fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: 'rgba(255,255,255,0.5)',
                }}>
                  <Clock size={12} style={{ color: '#F97316' }} />
                  <span>Clips de 15 a 30 segundos · Formato optimizado</span>
                </div>
              </div>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: 20,
              }}>
                {VIDEOS.map((video, i) => (
                  <div
                    key={i}
                    style={{
                      borderRadius: 18,
                      overflow: 'hidden',
                      border: '1px solid rgba(255,255,255,0.1)',
                      background: 'rgba(255,255,255,0.025)',
                      boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
                    }}
                  >
                    <div style={{ position: 'relative', width: '100%', height: 240, background: '#000' }}>
                      {playingVideo === i ? (
                        <video
                          src={video.src}
                          controls
                          autoPlay
                          playsInline
                          preload="auto"
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      ) : (
                        <div
                          onClick={() => setPlayingVideo(i)}
                          style={{ position: 'relative', width: '100%', height: '100%', cursor: 'pointer' }}
                        >
                          <Image
                            src={video.poster}
                            alt={video.titulo}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 320px"
                          />
                          <div style={{
                            position: 'absolute', inset: 0,
                            background: 'rgba(0,0,0,0.45)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            transition: 'background 0.2s',
                          }}>
                            <div style={{
                              width: 52, height: 52, borderRadius: '50%',
                              background: 'linear-gradient(135deg, #F97316, #C2410C)',
                              boxShadow: '0 0 20px rgba(249,115,22,0.6)',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              color: 'white',
                            }}>
                              <Play size={22} fill="white" style={{ marginLeft: 3 }} />
                            </div>
                          </div>
                          <div style={{
                            position: 'absolute', bottom: 10, right: 10,
                            padding: '3px 8px', borderRadius: 6,
                            background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(6px)',
                            fontFamily: 'JetBrains Mono, monospace', fontSize: 11,
                            color: 'white', border: '1px solid rgba(255,255,255,0.15)',
                          }}>
                            {video.duracion}
                          </div>
                          <div style={{
                            position: 'absolute', top: 10, left: 10,
                            padding: '3px 8px', borderRadius: 6,
                            background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(6px)',
                            fontFamily: 'JetBrains Mono, monospace', fontSize: 10,
                            color: '#F97316', border: '1px solid rgba(249,115,22,0.3)',
                          }}>
                            {video.categoria}
                          </div>
                        </div>
                      )}
                    </div>
                    <div style={{ padding: '14px 16px' }}>
                      <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 14, fontWeight: 700, color: 'white', margin: '0 0 4px' }}>
                        {video.titulo}
                      </p>
                      <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: 'rgba(255,255,255,0.45)' }}>
                        Clip corto · Reproducción bajo demanda
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.section>

          {/* ── PIE DE PÁGINA ── */}
          <div style={{
            paddingTop: 40, borderTop: '1px solid rgba(255,255,255,0.06)',
            textAlign: 'center',
          }}>
            <p style={{ fontFamily: 'Cinzel, serif', fontSize: 14, color: 'rgba(249,115,22,0.6)', marginBottom: 6 }}>
              Centro de Bachillerato Tecnológico Agropecuario No. 134
            </p>
            <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: 'rgba(255,255,255,0.25)', margin: 0 }}>
              San Francisco Tetlanohcan, Tlaxcala • Festival Entre la Vida y la Muerte • 2026
            </p>
          </div>
        </div>
      </div>

      {/* ── LIGHTBOX ── */}
      <AnimatePresence>
        {fotoAmpliada !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setFotoAmpliada(null)}
            style={{
              position: 'fixed', inset: 0, zIndex: 100,
              background: 'rgba(0,0,0,0.95)', backdropFilter: 'blur(16px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: 24,
            }}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={e => e.stopPropagation()}
              style={{ position: 'relative', maxWidth: 900, width: '100%', maxHeight: '85vh', borderRadius: 16, overflow: 'hidden' }}
            >
              <Image
                src={fotosFiltradas[fotoAmpliada].src}
                alt={fotosFiltradas[fotoAmpliada].caption}
                width={900} height={600}
                style={{ width: '100%', height: 'auto', display: 'block', borderRadius: 16 }}
              />
              <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0,
                padding: '20px 24px',
                background: 'linear-gradient(to top, rgba(0,0,0,0.9), transparent)',
              }}>
                <p style={{ margin: 0, fontFamily: 'Cinzel, serif', fontSize: 16, fontWeight: 600, color: 'white' }}>
                  {fotosFiltradas[fotoAmpliada].caption}
                </p>
                <p style={{ margin: '4px 0 0', fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: 'rgba(249,115,22,0.7)' }}>
                  {fotoAmpliada + 1} / {fotosFiltradas.length} — ESC para cerrar
                </p>
              </div>
              {/* Botones navegar */}
              {fotoAmpliada > 0 && (
                <button onClick={() => setFotoAmpliada(fotoAmpliada - 1)} style={{
                  position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
                  width: 40, height: 40, borderRadius: '50%',
                  background: 'rgba(0,0,0,0.7)', border: '1px solid rgba(255,255,255,0.2)',
                  color: 'white', cursor: 'pointer', fontSize: 18,
                }}>‹</button>
              )}
              {fotoAmpliada < fotosFiltradas.length - 1 && (
                <button onClick={() => setFotoAmpliada(fotoAmpliada + 1)} style={{
                  position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                  width: 40, height: 40, borderRadius: '50%',
                  background: 'rgba(0,0,0,0.7)', border: '1px solid rgba(255,255,255,0.2)',
                  color: 'white', cursor: 'pointer', fontSize: 18,
                }}>›</button>
              )}
              <button onClick={() => setFotoAmpliada(null)} style={{
                position: 'absolute', top: 12, right: 12,
                width: 36, height: 36, borderRadius: '50%',
                background: 'rgba(0,0,0,0.7)', border: '1px solid rgba(255,255,255,0.2)',
                color: 'white', cursor: 'pointer', fontSize: 16,
              }}>✕</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Nav menu drawer */}
      <NavMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        ambientColor={ambientColor}
        setAmbientColor={setAmbientColor}
      />
    </>
  );
}

// ── Sub-componente: título de sección ──
function SectionTitle({ icon, title }: { icon: string; title: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
      <span style={{ fontSize: 24 }}>{icon}</span>
      <h2 style={{
        fontFamily: 'Cinzel, serif',
        fontSize: 'clamp(20px,3.5vw,32px)',
        fontWeight: 800, color: 'white', margin: 0,
      }}>
        {title}
      </h2>
      <div style={{ flex: 1, height: 1, background: 'linear-gradient(to right, rgba(249,115,22,0.4), transparent)' }} />
    </div>
  );
}
