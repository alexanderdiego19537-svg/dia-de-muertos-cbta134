'use client';

import { useRef, useState, useCallback, useMemo } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { Calendar, MapPin, ChevronDown } from 'lucide-react';
import Image from 'next/image';
import Header from './Header';
import NavMenu from './NavMenu';
import AmbientStudio from './AmbientStudio';
import SoundToggle from './SoundToggle';
import EventModal from './EventModal';
import InfoBot from './InfoBot';
import Aurora from './Aurora';

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMenuOpen, setIsMenuOpen]   = useState(false);
  const [isEventOpen, setIsEventOpen] = useState(false);
  const [isChatOpen, setIsChatOpen]   = useState(false);

  // ── Ambient glow state (connected to AmbientStudio) ──────────────
  const [glowColor, setGlowColor]         = useState('rgba(249,115,22,0.5)');
  const [glowSize, setGlowSize]           = useState(80);
  const [glowIntensity, setGlowIntensity] = useState(1);

  // ── Mouse tracking (throttled via spring) ────────────────────────
  const rawX = useMotionValue(0.5);
  const rawY = useMotionValue(0.5);
  const mx = useSpring(rawX, { stiffness: 35, damping: 20, mass: 0.8 });
  const my = useSpring(rawY, { stiffness: 35, damping: 20, mass: 0.8 });

  // 3-D tilt for the catrina
  const rotateY = useTransform(mx, [0, 1], [-12, 12]);
  const rotateX = useTransform(my, [0, 1], [7, -7]);
  // Subtle face-following shift
  const shiftX = useTransform(mx, [0, 1], [-20, 20]);
  const shiftY = useTransform(my, [0, 1], [-12, 12]);
  // Title parallax
  const titlePX = useTransform(mx, [0, 1], [10, -10]);

  // Throttle mouse updates to ~30 fps
  const lastMouse = useRef(0);
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const now = performance.now();
    if (now - lastMouse.current < 33) return; // ~30 fps
    lastMouse.current = now;
    if (!containerRef.current) return;
    const r = containerRef.current.getBoundingClientRect();
    rawX.set(Math.max(0, Math.min(1, (e.clientX - r.left) / r.width)));
    rawY.set(Math.max(0, Math.min(1, (e.clientY - r.top) / r.height)));
  }, [rawX, rawY]);

  const scrollDown = () =>
    document.getElementById('quienes-somos')?.scrollIntoView({ behavior: 'smooth' });

  // Derivar colorStops del glowColor para pasarle a Aurora
  const auroraColors = useMemo(() => {
    // glowColor es "rgba(R,G,B,A)" → extraemos hex
    const m = glowColor.match(/[\d.]+/g);
    if (!m || m.length < 3) return ['#F97316', '#7C3AED', '#C2410C'];
    const r = Math.round(parseFloat(m[0])).toString(16).padStart(2,'0');
    const g = Math.round(parseFloat(m[1])).toString(16).padStart(2,'0');
    const b = Math.round(parseFloat(m[2])).toString(16).padStart(2,'0');
    const hex = `#${r}${g}${b}`;
    // Segunda variante más oscura, tercera complementaria
    return [hex, '#7C3AED', '#C2410C'];
  }, [glowColor]);

  return (
    <>
      {/* ═══════════════════════════════════════════
          HERO SECTION
      ═══════════════════════════════════════════ */}
      <section
        ref={containerRef}
        id="inicio"
        onMouseMove={handleMouseMove}
        style={{
          position: 'relative',
          height: '100dvh',
          minHeight: 600,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#080208',
          userSelect: 'none',
        }}
      >

        {/* ── LAYER 0 · Aurora WebGL — fluida, conectada al AmbientStudio ── */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
          {/* Aurora principal WebGL */}
          <Aurora
            colorStops={auroraColors}
            speed={1.4}
            amplitude={glowIntensity * 0.9}
            blend={Math.min(glowIntensity * 0.55, 0.95)}
            opacity={Math.min(0.5 + (glowIntensity - 0.5) * 0.3, 0.92)}
          />

          {/* Grid overlay encima de la aurora */}
          <div className="grid-bg" style={{ position: 'absolute', inset: 0, opacity: 0.25, mixBlendMode: 'overlay' }} />

          {/* Vignette oscura arriba/abajo para que el texto sea legible */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to bottom, rgba(8,2,8,0.75) 0%, transparent 28%, transparent 65%, rgba(8,2,8,0.97) 100%)',
          }} />
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to right, rgba(8,2,8,0.5) 0%, transparent 22%, transparent 78%, rgba(8,2,8,0.5) 100%)',
          }} />
        </div>

        {/* ══════════════════════════════════════════════════════════
            TÍTULO — Desktop: dividido DÍA / DE / MUERTOS con catrina
                     Mobile: stack vertical centrado arriba de catrina
        ══════════════════════════════════════════════════════════ */}

        {/* ── DESKTOP LAYER 1a · DÍA + DE — BEHIND catrina (z=5) ── */}
        <motion.div
          className="hidden sm:block"
          style={{
            position: 'absolute',
            top: '11%', left: 0, right: 0,
            zIndex: 5,
            pointerEvents: 'none',
            x: titlePX,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative' }}>
              {/* Center line divider */}
              <div style={{
                position: 'absolute', left: '50%', top: 0, bottom: 0, width: 1,
                background: 'linear-gradient(to bottom, transparent, rgba(249,115,22,0.15), transparent)',
              }} />

              {/* LEFT — DÍA (detrás de catrina) */}
              <div>
                <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, letterSpacing: '0.25em', color: 'rgba(249,115,22,0.5)', marginBottom: 4, textTransform: 'uppercase' }}>2026</div>
                <h1 style={{
                  fontFamily: 'Cinzel, serif', fontWeight: 900, margin: 0,
                  lineHeight: 0.92, letterSpacing: '-0.02em',
                  fontSize: 'clamp(80px, 15vw, 210px)',
                  color: 'white',
                  textShadow: '0 0 60px rgba(249,115,22,0.25), 0 2px 0 rgba(0,0,0,0.5)',
                }}>DÍA</h1>
              </div>

              {/* RIGHT — DE (detrás de catrina) */}
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, letterSpacing: '0.2em', color: 'rgba(249,115,22,0.5)', marginBottom: 4, textTransform: 'uppercase' }}>CBTA #134</div>
                <h1 style={{
                  fontFamily: 'Cinzel, serif', fontWeight: 900, margin: 0,
                  lineHeight: 1, letterSpacing: '-0.01em',
                  fontSize: 'clamp(38px, 7vw, 100px)',
                  color: 'white',
                  textShadow: '0 0 40px rgba(249,115,22,0.2), 0 2px 0 rgba(0,0,0,0.6)',
                }}>DE</h1>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── DESKTOP LAYER 1b · MUERTOS — ENCIMA de catrina (z=15) ── */}
        <motion.div
          className="hidden sm:block"
          style={{
            position: 'absolute',
            top: '11%', left: 0, right: 0,
            zIndex: 15,
            pointerEvents: 'none',
            x: titlePX,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 32px' }}>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              {/* Spacer para alinear con "DE" */}
              <div style={{ textAlign: 'right' }}>
                {/* Espacio equivalente al label + "DE" */}
                <div style={{ visibility: 'hidden', fontFamily: 'JetBrains Mono, monospace', fontSize: 11 }}>CBTA #134</div>
                <div style={{ visibility: 'hidden', fontSize: 'clamp(38px, 7vw, 100px)', lineHeight: 1 }}>DE</div>
                <h1 style={{
                  fontFamily: 'Cinzel, serif', fontWeight: 900, margin: 0,
                  lineHeight: 0.92, letterSpacing: '-0.02em',
                  fontSize: 'clamp(50px, 9.5vw, 136px)',
                  color: 'white',
                  textShadow: '0 0 80px rgba(249,115,22,0.6), 0 0 30px rgba(249,115,22,0.4), 0 2px 0 rgba(0,0,0,0.8)',
                  filter: 'drop-shadow(0 0 20px rgba(249,115,22,0.5))',
                }}>MUERTOS</h1>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── MOBILE LAYER · Título centrado arriba (z=15) ── */}
        <motion.div
          className="sm:hidden"
          style={{
            position: 'absolute',
            top: '8%',
            left: 0, right: 0,
            zIndex: 15,
            pointerEvents: 'none',
            textAlign: 'center',
            padding: '0 12px',
          }}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2 }}
        >
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, letterSpacing: '0.25em', color: 'rgba(249,115,22,0.6)', marginBottom: 6, textTransform: 'uppercase' }}>
            CBTA #134 · 2026
          </div>
          <h1 style={{
            fontFamily: 'Cinzel, serif', fontWeight: 900, margin: 0,
            lineHeight: 0.88, letterSpacing: '-0.02em',
            fontSize: 'clamp(56px, 18vw, 110px)',
            color: 'white',
            textShadow: '0 0 40px rgba(249,115,22,0.4), 0 2px 0 rgba(0,0,0,0.6)',
          }}>DÍA</h1>
          <h2 style={{
            fontFamily: 'Cinzel, serif', fontWeight: 700, margin: '2px 0',
            lineHeight: 1, letterSpacing: '0.05em',
            fontSize: 'clamp(22px, 7vw, 44px)',
            color: 'rgba(255,255,255,0.75)',
            textShadow: '0 0 20px rgba(249,115,22,0.3)',
          }}>DE</h2>
          <h1 style={{
            fontFamily: 'Cinzel, serif', fontWeight: 900, margin: 0,
            lineHeight: 0.92, letterSpacing: '-0.02em',
            fontSize: 'clamp(42px, 13vw, 86px)',
            color: 'white',
            textShadow: '0 0 60px rgba(249,115,22,0.6), 0 0 20px rgba(249,115,22,0.4), 0 2px 0 rgba(0,0,0,0.8)',
            filter: 'drop-shadow(0 0 14px rgba(249,115,22,0.5))',
          }}>MUERTOS</h1>
        </motion.div>

        {/* ── LAYER 2 · Catrina — centered, large, 3D tilt ── */}
        {/* Desktop: pegada al fondo | Mobile: centrada verticalmente en el espacio disponible */}
        <div style={{
          position: 'absolute',
          // Desktop: flex-end (pegada abajo) | Mobile: centrada entre el título y el bottom bar
          top: 0, bottom: 0, left: 0, right: 0,
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'center',
          zIndex: 10, pointerEvents: 'none',
        }}>
          <motion.div
            style={{ rotateY, rotateX, perspective: 1000, transformStyle: 'preserve-3d' }}
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1.3, ease: 'easeOut', delay: 0.4 }}
          >
            <motion.div style={{ x: shiftX, y: shiftY }}>
              {/* Glow halo */}
              <div style={{
                position: 'absolute', bottom: '5%', left: '50%',
                transform: 'translateX(-50%)',
                width: '80%', height: '55%',
                borderRadius: '50%', filter: 'blur(55px)',
                background: `radial-gradient(ellipse, ${glowColor.replace('0.5','0.3')} 0%, rgba(124,58,237,0.15) 50%, transparent 80%)`,
                zIndex: 0,
              }} />

              {/* Catrina image — mix-blend-mode:screen removes black BG */}
              {/* Mobile: ancho y alto más controlados para que esté cerca del título */}
              <div style={{
                position: 'relative',
                width: 'clamp(180px, 62vw, 560px)',
                // Mobile: altura más pequeña para que no se aleje del título
                height: 'clamp(300px, 52vh, 850px)',
                zIndex: 1,
              }}>
                <Image
                  src="/images/catrina-candle.jpg"
                  alt="Catrina con vela — Día de Muertos CBTA #134 Tetlanhocan"
                  fill
                  sizes="(max-width: 640px) 70vw, (max-width: 1200px) 38vw, 560px"
                  className="object-contain object-bottom"
                  priority
                  loading="eager"
                  style={{
                    mixBlendMode: 'screen',
                    filter: 'drop-shadow(0 0 50px rgba(249,115,22,0.55)) drop-shadow(0 0 120px rgba(234,179,8,0.3)) brightness(1.1) contrast(1.08)',
                  }}
                />
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* ── LAYER 3 · Header ── */}
        <div style={{ position: 'relative', zIndex: 30 }}>
          <Header
            onMenuOpen={() => setIsMenuOpen(true)}
            onEventOpen={() => setIsEventOpen(true)}
            onChatOpen={() => setIsChatOpen(true)}
          />
        </div>

        {/* ── LAYER 4 · Bottom info blocks ── */}
        {/* Desktop: grid 3 columnas | Mobile: stack vertical */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          zIndex: 20,
          maxWidth: 1280, margin: '0 auto', width: '100%',
          padding: '0 16px 16px',
        }}>
          {/* Desktop layout */}
          <div className="hidden sm:grid" style={{
            gridTemplateColumns: '1fr auto 1fr',
            gap: 0,
            alignItems: 'end',
            padding: '0 16px',
          }}>
            {/* Left info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.7 }}
            >
              {/* Event badge */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14, width: 'fit-content', padding: '5px 12px', borderRadius: 999, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(10px)' }}>
                <span style={{ fontSize: 14 }}>💀</span>
                <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: 'rgba(255,255,255,0.65)', letterSpacing: '0.1em' }}>Evento Cultural 2026</span>
                <span style={{ fontSize: 12 }}>⭐</span>
              </div>

              <div style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
                  <span style={{ fontFamily: 'Cinzel, serif', fontWeight: 800, color: 'white', lineHeight: 1, textTransform: 'uppercase', fontSize: 'clamp(22px, 3vw, 46px)', textShadow: '0 2px 12px rgba(0,0,0,0.9)' }}>Celebra</span>
                  <span style={{ fontFamily: 'Cinzel, serif', fontWeight: 800, color: '#F97316', lineHeight: 1, fontSize: 'clamp(22px, 3vw, 46px)', filter: 'drop-shadow(0 0 8px rgba(249,115,22,0.7))' }}>›</span>
                </div>
                <div style={{ fontFamily: 'Cinzel, serif', fontWeight: 800, color: 'white', lineHeight: 1, textTransform: 'uppercase', fontSize: 'clamp(22px, 3vw, 46px)', textShadow: '0 2px 12px rgba(0,0,0,0.9)' }}>la Tradición</div>
                <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, letterSpacing: '0.2em', color: 'rgba(249,115,22,0.6)', marginTop: 6 }}>(Desplázate para explorar)</p>
              </div>

              <div style={{ display: 'flex', gap: 10 }}>
                <button onClick={() => setIsEventOpen(true)} style={{
                  padding: '10px 20px', borderRadius: 999, fontFamily: 'Cinzel, serif', fontWeight: 700, fontSize: 13,
                  color: 'white', border: 'none', cursor: 'pointer',
                  background: 'linear-gradient(135deg, #F97316, #C2410C)',
                  boxShadow: '0 4px 20px rgba(249,115,22,0.45)',
                }}>Ver Programa</button>
                <button onClick={() => setIsChatOpen(true)} style={{
                  padding: '10px 16px', borderRadius: 999, fontFamily: 'JetBrains Mono, monospace', fontSize: 12,
                  color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.15)',
                  background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)', cursor: 'pointer',
                }}>Más Info →</button>
              </div>
            </motion.div>

            {/* Center scroll arrow */}
            <motion.button
              onClick={scrollDown}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4 }}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                color: 'rgba(255,255,255,0.35)', padding: '0 40px 8px',
              }}
            >
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase' }}>scroll</span>
              <motion.div animate={{ y: [0, 5, 0] }} transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}>
                <ChevronDown size={18} style={{ color: '#F97316' }} />
              </motion.div>
            </motion.button>

            {/* Right info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1, duration: 0.7 }}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 12 }}
            >
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', lineHeight: 1.7, maxWidth: 300, textAlign: 'right', fontWeight: 300, textShadow: '0 2px 8px rgba(0,0,0,0.8)', margin: 0 }}>
                El CBTA #134 de Tetlanhocan te invita a una experiencia cultural única, honrando nuestras raíces y tradiciones.
              </p>

              <div style={{ padding: '16px 18px', borderRadius: 18, border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(14px)', display: 'flex', flexDirection: 'column', gap: 10, minWidth: 260 }}>
                {[
                  { icon: Calendar, color: '#F97316', bg: 'rgba(249,115,22,0.14)', title: 'Mié. 28 de Octubre, 2026', sub: '8:00 AM — 1:00 PM' },
                  { icon: MapPin, color: '#A78BFA', bg: 'rgba(167,139,250,0.14)', title: 'Auditorio de Aquiahuac', sub: 'San Fco. Tetlanhocan, Tlax.' },
                ].map(({ icon: Icon, color, bg, title, sub }) => (
                  <div key={title} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 32, height: 32, borderRadius: '50%', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Icon size={14} style={{ color }} />
                    </div>
                    <div>
                      <p style={{ color: 'white', fontSize: 13, fontWeight: 600, margin: 0, textShadow: '0 2px 6px rgba(0,0,0,0.7)' }}>{title}</p>
                      <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: 'rgba(255,255,255,0.4)', margin: '2px 0 0' }}>{sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* ── MOBILE bottom bar ── */}
          <motion.div
            className="sm:hidden"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.7 }}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 10,
              padding: '0 4px 8px',
            }}
          >
            {/* Fecha y lugar compactos */}
            <div style={{
              padding: '10px 14px',
              borderRadius: 14,
              border: '1px solid rgba(255,255,255,0.08)',
              background: 'rgba(0,0,0,0.6)',
              backdropFilter: 'blur(14px)',
              display: 'flex',
              gap: 14,
              width: '100%',
              justifyContent: 'center',
            }}>
              {[
                { icon: Calendar, color: '#F97316', bg: 'rgba(249,115,22,0.14)', title: 'Mié. 28 Oct. 2026', sub: '8:00 AM — 1:00 PM' },
                { icon: MapPin, color: '#A78BFA', bg: 'rgba(167,139,250,0.14)', title: 'Auditorio Aquiahuac', sub: 'Tetlanhocan, Tlax.' },
              ].map(({ icon: Icon, color, bg, title, sub }) => (
                <div key={title} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon size={12} style={{ color }} />
                  </div>
                  <div>
                    <p style={{ color: 'white', fontSize: 11, fontWeight: 600, margin: 0 }}>{title}</p>
                    <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 9, color: 'rgba(255,255,255,0.4)', margin: '1px 0 0' }}>{sub}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Botones */}
            <div style={{ display: 'flex', gap: 8, width: '100%' }}>
              <button onClick={() => setIsEventOpen(true)} style={{
                flex: 1, padding: '11px 0', borderRadius: 999,
                fontFamily: 'Cinzel, serif', fontWeight: 700, fontSize: 13,
                color: 'white', border: 'none', cursor: 'pointer',
                background: 'linear-gradient(135deg, #F97316, #C2410C)',
                boxShadow: '0 4px 20px rgba(249,115,22,0.45)',
              }}>Ver Programa</button>
              <button onClick={() => setIsChatOpen(true)} style={{
                flex: 1, padding: '11px 0', borderRadius: 999,
                fontFamily: 'JetBrains Mono, monospace', fontSize: 12,
                color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.15)',
                background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)', cursor: 'pointer',
              }}>Más Info →</button>
            </div>

            {/* Scroll indicator */}
            <motion.button
              onClick={scrollDown}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
                color: 'rgba(255,255,255,0.35)', padding: 0,
              }}
            >
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 8, letterSpacing: '0.2em', textTransform: 'uppercase' }}>scroll</span>
              <motion.div animate={{ y: [0, 4, 0] }} transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}>
                <ChevronDown size={16} style={{ color: '#F97316' }} />
              </motion.div>
            </motion.button>
          </motion.div>
        </div>

        {/* ── Floating widgets ── */}
        <AmbientStudio
          ambientColor={glowColor}
          setAmbientColor={setGlowColor}
          glowSize={glowSize}
          setGlowSize={setGlowSize}
          glowIntensity={glowIntensity}
          setGlowIntensity={setGlowIntensity}
        />
        <SoundToggle />
      </section>

      {/* Modals */}
      <NavMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} ambientColor={glowColor} setAmbientColor={setGlowColor} />
      <EventModal isOpen={isEventOpen} onClose={() => setIsEventOpen(false)} />
      <InfoBot isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </>
  );
}
