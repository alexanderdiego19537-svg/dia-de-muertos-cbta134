'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles } from 'lucide-react';
import CempasuchilLogo from './CempasuchilLogo';
import Image from 'next/image';

interface NavMenuProps {
  isOpen: boolean;
  onClose: () => void;
  ambientColor: string;
  setAmbientColor: (color: string) => void;
}

const navItems = [
  { label: 'Inicio', tag: 'Hero' },
  { label: 'Quiénes Somos', tag: 'Nuestra Institución' },
  { label: 'El Evento', tag: 'Miércoles 28 de Octubre 2026' },
  { label: 'Tradiciones', tag: 'Calendario del Más Allá' },
  { label: 'Galería', tag: 'Fotografías' },
  { label: 'Ubicación', tag: 'Cómo llegar' },
];

const glowOptions = [
  { label: 'Cempasúchil', color: 'rgba(249, 115, 22, 0.5)' },
  { label: 'Morado Místico', color: 'rgba(124, 58, 237, 0.5)' },
  { label: 'Rojo Pasión', color: 'rgba(220, 38, 38, 0.5)' },
  { label: 'Oro Ancestral', color: 'rgba(234, 179, 8, 0.5)' },
];

export default function NavMenu({ isOpen, onClose, ambientColor, setAmbientColor }: NavMenuProps) {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      onClose();
    }
  };

  const sectionIds = ['inicio', 'quienes-somos', 'el-evento', 'tradiciones', 'galeria', 'ubicacion'];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/85 backdrop-blur-md z-50"
          />
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 180 }}
            className="fixed top-0 left-0 bottom-0 w-full max-w-md bg-black border-r z-50 p-8 md:p-12 flex flex-col justify-between overflow-y-auto"
            style={{ borderColor: 'rgba(249,115,22,0.15)' }}
          >
            {/* Header */}
            <div>
              <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-3">
                  <CempasuchilLogo size={40} animated />
                  <div>
                    <p className="font-display text-white font-bold tracking-wider text-sm">CBTA #134</p>
                    <p className="font-mono text-orange-400/60 text-xs">Tetlanhocan, Tlax.</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:border-orange-500/50 transition-all"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Ambient color picker */}
              <div className="mb-10 p-4 rounded-xl border border-white/5 bg-white/3">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles size={14} className="text-orange-400" style={{ animation: 'spin 6s linear infinite' }} />
                  <p className="font-mono text-xs text-white/40 tracking-[0.2em] uppercase">Ambiente de color</p>
                </div>
                <div className="flex gap-3">
                  {glowOptions.map((opt) => (
                    <button
                      key={opt.label}
                      title={opt.label}
                      onClick={() => setAmbientColor(opt.color)}
                      className={`w-8 h-8 rounded-full border-2 transition-all ${ambientColor === opt.color ? 'scale-110 border-white' : 'border-transparent opacity-60 hover:opacity-100'}`}
                      style={{ background: opt.color.replace('0.5', '1') }}
                    />
                  ))}
                </div>
              </div>

              {/* Navigation */}
              <nav className="flex flex-col gap-1">
                {navItems.map((item, index) => (
                  <motion.button
                    key={item.label}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.08 }}
                    onClick={() => scrollToSection(sectionIds[index])}
                    className="group flex flex-col items-start py-4 border-b border-white/5 hover:border-orange-500/20 transition-all text-left"
                  >
                    <span className="text-3xl md:text-4xl font-display font-bold text-white/80 group-hover:text-white group-hover:translate-x-2 transition-all duration-300">
                      {item.label}
                    </span>
                    <span className="font-mono text-xs text-orange-500/0 group-hover:text-orange-500/70 transition-all duration-300 mt-1">
                      // {item.tag}
                    </span>
                  </motion.button>
                ))}
              </nav>
            </div>

            {/* Footer */}
            <div className="mt-8 pt-6 border-t border-white/5">
              <Image src="/images/logo-cbta.png" alt="Logo CBTA 134" width={60} height={60} className="opacity-40 mb-4" />
              <p className="font-mono text-xs text-white/30">© 2026 CBT Agropecuario #134</p>
              <p className="font-mono text-xs text-white/20">Tetlanhocan, Tlaxcala, México</p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
