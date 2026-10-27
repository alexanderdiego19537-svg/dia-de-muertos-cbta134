'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, MapPin, Globe, X, Clock } from 'lucide-react';
import CempasuchilLogo from './CempasuchilLogo';

interface HeaderProps {
  onMenuOpen: () => void;
  onEventOpen: () => void;
  onChatOpen: () => void;
}

export default function Header({ onMenuOpen, onEventOpen, onChatOpen }: HeaderProps) {
  const [showLocation, setShowLocation] = useState(false);
  const [currentTime, setCurrentTime] = useState('');
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const time = new Intl.DateTimeFormat('es-MX', {
        timeZone: 'America/Mexico_City',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      }).format(new Date());
      setCurrentTime(time);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`relative z-50 flex items-center justify-between w-full px-6 py-4 md:px-12 transition-all duration-300 ${scrolled ? 'bg-black/70 backdrop-blur-md border-b border-orange-900/30' : 'bg-black/40 backdrop-blur-md border-b border-white/5'}`}>
      {/* Left: Menu + Time */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuOpen}
          className="flex items-center gap-2 px-4 py-2 border rounded-full border-white/10 hover:border-orange-500/50 bg-white/5 hover:bg-orange-500/10 transition-all duration-300 text-sm text-white/70 hover:text-white"
        >
          <Menu size={16} />
          <span className="hidden sm:block font-mono text-xs tracking-widest uppercase">Menú</span>
        </button>
        <div className="hidden lg:flex items-center gap-2 font-mono text-xs text-white/50 bg-white/5 px-4 py-2 rounded-full">
          <Clock size={12} className="text-orange-500" style={{ animation: 'pulse 2s infinite' }} />
          <span>/ Tlaxcala, MX — {currentTime || '10:00 AM'}</span>
        </div>
      </div>

      {/* Center: Logo */}
      <div
        className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 cursor-pointer"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        <CempasuchilLogo size={44} animated />
        <span className="font-display text-xs tracking-[0.3em] text-orange-400/80 uppercase hidden sm:block">CBT #134</span>
      </div>

      {/* Right: Location + CTA buttons */}
      <div className="flex items-center gap-3">
        {/* Location tooltip */}
        <div className="relative">
          <button
            className="w-10 h-10 rounded-full bg-white/5 border border-white/10 hover:border-orange-500/50 hover:bg-orange-500/10 transition-all flex items-center justify-center text-white/50 hover:text-orange-400"
            onClick={() => setShowLocation(!showLocation)}
            onMouseEnter={() => setShowLocation(true)}
            onMouseLeave={() => setShowLocation(false)}
          >
            <MapPin size={16} />
          </button>
          <AnimatePresence>
            {showLocation && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 mt-3 w-72 p-5 bg-black/95 border border-white/10 rounded-2xl backdrop-blur-xl z-50"
                onMouseEnter={() => setShowLocation(true)}
                onMouseLeave={() => setShowLocation(false)}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-full bg-orange-500/20 border border-orange-500/30 flex items-center justify-center">
                    <Globe size={14} className="text-orange-400" />
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">CBT Agropecuario #134</p>
                    <p className="text-white/50 text-xs font-mono">San Francisco Tetlanhocan</p>
                  </div>
                </div>
                <p className="text-white/60 text-xs font-mono mb-3">C. Josefa Ortiz de Domínguez,<br />90840 Tetlanhocan, Tlax.</p>
                <div className="flex items-center gap-2 text-orange-400 text-xs font-mono border-t border-white/5 pt-3">
                  <span>LAT: 19.2616° N</span>
                  <span className="text-white/20">|</span>
                  <span>LNG: 98.1400° W</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <button
          onClick={onChatOpen}
          className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 hover:border-orange-500/40 bg-white/5 hover:bg-orange-500/10 text-white/60 hover:text-white transition-all text-sm"
        >
          Info
          <div className="w-5 h-5 rounded-full border border-white/20 flex items-center justify-center">
            <span className="text-xs">→</span>
          </div>
        </button>

        <button
          onClick={onEventOpen}
          className="px-5 py-2 rounded-full font-semibold text-sm text-white transition-all active:scale-95 hover:opacity-90 shadow-lg"
          style={{ background: 'linear-gradient(135deg, #F97316, #C2410C)', boxShadow: '0 4px 20px rgba(249,115,22,0.3)' }}
        >
          Ver Evento
        </button>
      </div>
    </header>
  );
}
