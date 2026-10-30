'use client';

import { useRef, useState, useCallback, useMemo, useEffect } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import Link from 'next/link';
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

  // ── Detectar móvil con JS — esto cambia los estilos inline directamente ──
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // ── Ambient glow state ──────────────────────────────────────────────────
  const [glowColor, setGlowColor]         = useState('rgba(249,115,22,0.5)');
  const [glowSize, setGlowSize]           = useState(80);
  const [glowIntensity, setGlowIntensity] = useState(1);

  // ── Mouse tracking (throttled via spring) ──────────────────────────────
  const rawX = useMotionValue(0.5);
  const rawY = useMotionValue(0.5);
  const mx = useSpring(rawX, { stiffness: 35, damping: 20, mass: 0.8 });
  const my = useSpring(rawY, { stiffness: 35, damping: 20, mass: 0.8 });

  const rotateY = useTransform(mx, [0, 1], [-12, 12]);
  const rotateX = useTransform(my, [0, 1], [7, -7]);
  const shiftX  = useTransform(mx, [0, 1], [-20, 20]);
  const shiftY  = useTransform(my, [0, 1], [-12, 12]);
  const titlePX = useTransform(mx, [0, 1], [10, -10]);

  const lastMouse = useRef(0);
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const now = performance.now();
    if (now - lastMouse.current < 33) return;
    lastMouse.current = now;
    if (!containerRef.current) return;
    const r = containerRef.current.getBoundingClientRect();
    rawX.set(Math.max(0, Math.min(1, (e.clientX - r.left) / r.width)));
    rawY.set(Math.max(0, Math.min(1, (e.clientY - r.top) / r.height)));
  }, [rawX, rawY]);

  const scrollDown = () =>
    document.getElementById('quienes-somos')?.scrollIntoView({ behavior: 'smooth' });

  const auroraColors = useMemo(() => {
    const m = glowColor.match(/[\d.]+/g);
    if (!m || m.length < 3) return ['#F97316', '#7C3AED', '#C2410C'];
    const r = Math.round(parseFloat(m[0])).toString(16).padStart(2, '0');
    const g = Math.round(parseFloat(m[1])).toString(16).padStart(2, '0');
    const b = Math.round(parseFloat(m[2])).toString(16).padStart(2, '0');
    return [`#${r}${g}${b}`, '#7C3AED', '#C2410C'];
  }, [glowColor]);

  return (
    <>
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
        {/* ── LAYER 0 · Aurora + overlays ── */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
          <Aurora
            colorStops={auroraColors}
            speed={1.4}
            amplitude={glowIntensity * 0.9}
            blend={Math.min(glowIntensity * 0.55, 0.95)}
            opacity={Math.min(0.5 + (glowIntensity - 0.5) * 0.3, 0.92)}
          />
          <div className="grid-bg" style={{ position: 'absolute', inset: 0, opacity: 0.25, mixBlendMode: 'overlay' }} />
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to bottom, rgba(8,2,8,0.75) 0%, transparent 28%, transparent 65%, rgba(8,2,8,0.97) 100%)',
          }} />
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to right, rgba(8,2,8,0.5) 0%, transparent 22%, transparent 78%, rgba(8,2,8,0.5) 100%)',
          }} />
        </div>

        {/* ══════════════════════════════════════
            TÍTULO DESKTOP (sm+)
        ══════════════════════════════════════ */}
        {!isMobile && (
          <>
            {/* ENTRE LA VIDA — izquierda, detrás de catrina z=5 */}
            <motion.div
              style={{ position: 'absolute', top: 'clamp(84px, 11vh, 120px)', left: 0, right: 0, zIndex: 5, pointerEvents: 'none', x: titlePX }}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.2 }}
            >
              <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 32px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative' }}>
                  <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: 1, background: 'linear-gradient(to bottom, transparent, rgba(249,115,22,0.15), transparent)' }} />
                  <div>
                    <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, letterSpacing: '0.25em', color: 'rgba(249,115,22,0.5)', marginBottom: 4, textTransform: 'uppercase' }}>2026</div>
                    <h1 style={{ fontFamily: 'Cinzel, serif', fontWeight: 900, margin: 0, lineHeight: 0.92, letterSpacing: '-0.02em', fontSize: 'clamp(38px, 7.5vw, 108px)', color: 'white', textAlign: 'left', textShadow: '0 0 60px rgba(249,115,22,0.25), 0 2px 0 rgba(0,0,0,0.5)' }}>ENTRE LA<br />VIDA</h1>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, letterSpacing: '0.2em', color: 'rgba(249,115,22,0.5)', marginBottom: 4, textTransform: 'uppercase' }}>CBTA #134</div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Y LA MUERTE — encima de catrina z=15 */}
            <motion.div
              style={{ position: 'absolute', top: 'clamp(84px, 11vh, 120px)', left: 0, right: 0, zIndex: 15, pointerEvents: 'none', x: titlePX }}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.5 }}
            >
              <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 32px' }}>
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ visibility: 'hidden', fontFamily: 'JetBrains Mono, monospace', fontSize: 11 }}>CBTA #134</div>
                    <div style={{ visibility: 'hidden', fontSize: 'clamp(20px, 3.8vw, 52px)', lineHeight: 1.05 }}>ENTRE LA VIDA</div>
                    <h1 style={{ fontFamily: 'Cinzel, serif', fontWeight: 900, margin: 0, lineHeight: 0.92, letterSpacing: '-0.02em', fontSize: 'clamp(36px, 7vw, 100px)', color: 'white', textAlign: 'right', textShadow: '0 0 80px rgba(249,115,22,0.6), 0 0 30px rgba(249,115,22,0.4), 0 2px 0 rgba(0,0,0,0.8)', filter: 'drop-shadow(0 0 20px rgba(249,115,22,0.5))' }}>Y LA MUERTE</h1>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}

        {/* ══════════════════════════════════════
            TÍTULO MÓVIL
            — posición absoluta con holgura para
              evitar que el header lo tape
        ══════════════════════════════════════ */}
        {isMobile && (
          <motion.div
            style={{
              position: 'absolute',
              top: 'clamp(82px, 11vh, 96px)',
              left: 0, right: 0,
              zIndex: 15,
              pointerEvents: 'none',
              textAlign: 'center',
              padding: '0 12px',
            }}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, letterSpacing: '0.25em', color: 'rgba(249,115,22,0.6)', marginBottom: 6, textTransform: 'uppercase' }}>
              CBTA #134 · 2026
            </div>
            <h1 style={{ fontFamily: 'Cinzel, serif', fontWeight: 900, margin: 0, lineHeight: 1.0, letterSpacing: '-0.02em', fontSize: 'clamp(32px, 10vw, 62px)', color: 'white', textAlign: 'center', textShadow: '0 0 40px rgba(249,115,22,0.4), 0 2px 0 rgba(0,0,0,0.6)' }}>
              ENTRE LA VIDA
            </h1>
            <h1 style={{ fontFamily: 'Cinzel, serif', fontWeight: 900, margin: '4px 0 0', lineHeight: 0.92, letterSpacing: '-0.02em', fontSize: 'clamp(28px, 9vw, 55px)', color: 'white', textAlign: 'center', textShadow: '0 0 60px rgba(249,115,22,0.6), 0 0 20px rgba(249,115,22,0.4), 0 2px 0 rgba(0,0,0,0.8)', filter: 'drop-shadow(0 0 14px rgba(249,115,22,0.5))' }}>
              Y LA MUERTE
            </h1>
          </motion.div>
        )}

        {/* ══════════════════════════════════════
            CATRINA — desktop pegada al fondo,
            móvil centrada entre título y botones
        ══════════════════════════════════════ */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 10, pointerEvents: 'none',
          display: 'flex',
          alignItems: isMobile ? 'center' : 'flex-end',
          justifyContent: 'center',
          paddingTop:    isMobile ? '180px' : '0',
          paddingBottom: isMobile ? '110px' : '0',
        }}>
          <motion.div
            style={{ rotateY, rotateX, perspective: 1000, transformStyle: 'preserve-3d' }}
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1.3, ease: 'easeOut', delay: 0.4 }}
          >
            <motion.div style={{ x: isMobile ? 0 : shiftX, y: isMobile ? 0 : shiftY }}>
              <div style={{ position: 'absolute', bottom: '5%', left: '50%', transform: 'translateX(-50%)', width: '80%', height: '55%', borderRadius: '50%', filter: 'blur(55px)', background: `radial-gradient(ellipse, ${glowColor.replace('0.5', '0.3')} 0%, rgba(124,58,237,0.15) 50%, transparent 80%)`, zIndex: 0 }} />
              <div style={{ position: 'relative', zIndex: 1, width: isMobile ? 'clamp(180px, 68vw, 300px)' : 'clamp(200px, 38vw, 560px)', height: isMobile ? 'clamp(220px, 38vh, 340px)' : 'clamp(340px, 75vh, 850px)' }}>
                <Image
                  src="/images/catrina-candle.jpg"
                  alt="Catrina con vela — Día de Muertos CBTA #134 Tetlanhocan"
                  fill
                  sizes="(max-width: 640px) 68vw, (max-width: 1200px) 38vw, 560px"
                  className="object-contain object-bottom"
                  priority
                  loading="eager"
                  style={{ mixBlendMode: 'screen', filter: 'drop-shadow(0 0 50px rgba(249,115,22,0.55)) drop-shadow(0 0 120px rgba(234,179,8,0.3)) brightness(1.1) contrast(1.08)' }}
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

        {/* ══════════════════════════════════════
            BOTTOM INFO
        ══════════════════════════════════════ */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 20, maxWidth: 1280, margin: '0 auto', width: '100%', padding: '0 16px 16px' }}>

          {/* ── Desktop ── */}
          {!isMobile && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: 0, alignItems: 'end', padding: '0 16px' }}>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9, duration: 0.7 }}>
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
                  <Link href="/programa" style={{ padding: '10px 20px', borderRadius: 999, fontFamily: 'Cinzel, serif', fontWeight: 700, fontSize: 13, color: 'white', border: 'none', cursor: 'pointer', background: 'linear-gradient(135deg, #F97316, #C2410C)', boxShadow: '0 4px 20px rgba(249,115,22,0.45)', textDecoration: 'none', display: 'inline-block' }}>Ver Programa</Link>
                  <button onClick={() => setIsChatOpen(true)} style={{ padding: '10px 16px', borderRadius: 999, fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)', cursor: 'pointer' }}>Más Info →</button>
                </div>
              </motion.div>

              <motion.button onClick={scrollDown} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4 }} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, color: 'rgba(255,255,255,0.35)', padding: '0 40px 8px' }}>
                <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase' }}>scroll</span>
                <motion.div animate={{ y: [0, 5, 0] }} transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}>
                  <ChevronDown size={18} style={{ color: '#F97316' }} />
                </motion.div>
              </motion.button>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.1, duration: 0.7 }} style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 12 }}>
                <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', lineHeight: 1.7, maxWidth: 300, textAlign: 'right', fontWeight: 300, textShadow: '0 2px 8px rgba(0,0,0,0.8)', margin: 0 }}>
                  El CBTA #134 de Tetlanhocan te invita a una experiencia cultural única, honrando nuestras raíces y tradiciones.
                </p>
              </motion.div>
            </div>
          )}

          {/* ── Móvil bottom bar — solo botones ── */}
          {isMobile && (
            <motion.div
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              style={{ display: 'flex', gap: 8, width: '100%', padding: '0 4px 4px' }}
            >
              <Link href="/programa" style={{ flex: 1, padding: '13px 0', borderRadius: 999, fontFamily: 'Cinzel, serif', fontWeight: 700, fontSize: 14, color: 'white', border: 'none', cursor: 'pointer', background: 'linear-gradient(135deg, #F97316, #C2410C)', boxShadow: '0 4px 20px rgba(249,115,22,0.45)', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Ver Programa</Link>
              <button onClick={() => setIsChatOpen(true)} style={{ flex: 1, padding: '13px 0', borderRadius: 999, fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)', cursor: 'pointer' }}>Más Info →</button>
            </motion.div>
          )}
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
