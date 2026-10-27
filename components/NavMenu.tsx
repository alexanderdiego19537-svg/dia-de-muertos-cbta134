'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import CempasuchilLogo from './CempasuchilLogo';
import Image from 'next/image';

interface NavMenuProps {
  isOpen: boolean;
  onClose: () => void;
  ambientColor: string;
  setAmbientColor: (color: string) => void;
}

const navItems = [
  { label: 'Inicio',         tag: 'Página principal',              href: '/' },
  { label: 'Quiénes Somos',  tag: 'Nuestra Institución',           href: '/quienes-somos' },
  { label: 'Programa',       tag: 'Miércoles 28 de Octubre 2026',  href: '/programa' },
  { label: 'Concurso',       tag: 'Concurso de Ofrendas',          href: '/concurso' },
  { label: 'Galería',        tag: 'Fotografías',                   href: '/galeria' },
  { label: 'Ubicación',      tag: 'Cómo llegar',                   href: '/ubicacion' },
];

const glowOptions = [
  { label: 'Cempasúchil',   color: 'rgba(249,115,22,0.5)' },
  { label: 'Morado Místico', color: 'rgba(124,58,237,0.5)' },
  { label: 'Rojo Pasión',    color: 'rgba(220,38,38,0.5)' },
  { label: 'Oro Ancestral',  color: 'rgba(234,179,8,0.5)' },
];

export default function NavMenu({ isOpen, onClose, ambientColor, setAmbientColor }: NavMenuProps) {
  const router = useRouter();

  const navigate = (href: string) => {
    onClose();
    router.push(href);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: 'fixed', inset: 0,
              background: 'rgba(0,0,0,0.88)',
              backdropFilter: 'blur(12px)',
              zIndex: 50,
            }}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 26, stiffness: 190 }}
            style={{
              position: 'fixed', top: 0, left: 0, bottom: 0,
              width: '100%', maxWidth: 420,
              backgroundColor: '#050205',
              borderRight: '1px solid rgba(249,115,22,0.12)',
              zIndex: 51,
              display: 'flex', flexDirection: 'column',
              justifyContent: 'space-between',
              padding: 'clamp(24px,5vw,48px)',
              overflowY: 'auto',
            }}
          >
            {/* Top */}
            <div>
              {/* Header row */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <CempasuchilLogo size={38} animated />
                  <div>
                    <p style={{ fontFamily: 'Cinzel, serif', color: 'white', fontWeight: 700, fontSize: 13, margin: 0, letterSpacing: '0.1em' }}>CBTA #134</p>
                    <p style={{ fontFamily: 'JetBrains Mono, monospace', color: 'rgba(249,115,22,0.55)', fontSize: 11, margin: 0 }}>Tetlanhocan, Tlax.</p>
                  </div>
                </div>
                <button onClick={onClose} style={{
                  width: 38, height: 38, borderRadius: '50%',
                  border: '1px solid rgba(255,255,255,0.1)',
                  background: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'rgba(255,255,255,0.5)', cursor: 'pointer',
                }}>
                  <X size={17} />
                </button>
              </div>

              {/* Color ambiente */}
              <div style={{
                marginBottom: 32, padding: '14px 16px', borderRadius: 14,
                border: '1px solid rgba(255,255,255,0.06)',
                background: 'rgba(255,255,255,0.02)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                  <Sparkles size={13} color="#F97316" style={{ animation: 'spin 6s linear infinite' }} />
                  <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.2em', textTransform: 'uppercase', margin: 0 }}>
                    Ambiente de color
                  </p>
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                  {glowOptions.map((opt) => (
                    <button
                      key={opt.label}
                      title={opt.label}
                      onClick={() => setAmbientColor(opt.color)}
                      style={{
                        width: 30, height: 30, borderRadius: '50%', cursor: 'pointer',
                        background: opt.color.replace('0.5', '1'),
                        border: ambientColor === opt.color ? '2.5px solid white' : '2px solid transparent',
                        transform: ambientColor === opt.color ? 'scale(1.15)' : 'scale(1)',
                        transition: 'all 0.2s',
                        opacity: ambientColor === opt.color ? 1 : 0.55,
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Nav links */}
              <nav style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {navItems.map((item, i) => (
                  <motion.button
                    key={item.href}
                    initial={{ opacity: 0, x: -18 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.07 }}
                    onClick={() => navigate(item.href)}
                    style={{
                      background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left',
                      padding: '14px 0',
                      borderBottom: '1px solid rgba(255,255,255,0.05)',
                      display: 'flex', flexDirection: 'column', gap: 2,
                    }}
                  >
                    <span style={{
                      fontFamily: 'Cinzel, serif', fontWeight: 700,
                      fontSize: 'clamp(22px,5vw,34px)',
                      color: 'rgba(255,255,255,0.82)',
                      transition: 'color 0.2s',
                      lineHeight: 1.2,
                    }}>
                      {item.label}
                    </span>
                    <span style={{
                      fontFamily: 'JetBrains Mono, monospace',
                      fontSize: 10, color: 'rgba(249,115,22,0)',
                      transition: 'color 0.2s',
                    }}>
                      // {item.tag}
                    </span>
                  </motion.button>
                ))}
              </nav>
            </div>

            {/* Footer */}
            <div style={{ marginTop: 28, paddingTop: 20, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
              <Image src="/images/logo-cbta.png" alt="Logo CBTA 134" width={52} height={52} style={{ opacity: 0.35, marginBottom: 12 }} />
              <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: 'rgba(255,255,255,0.25)', margin: '0 0 4px' }}>© 2026 CBT Agropecuario #134</p>
              <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: 'rgba(255,255,255,0.15)', margin: 0 }}>Tetlanhocan, Tlaxcala, México</p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
