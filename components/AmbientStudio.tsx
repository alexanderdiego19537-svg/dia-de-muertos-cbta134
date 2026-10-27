'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sliders, RefreshCw } from 'lucide-react';

interface AmbientStudioProps {
  ambientColor: string;
  setAmbientColor: (c: string) => void;
  glowSize: number;
  setGlowSize: (s: number) => void;
  glowIntensity: number;
  setGlowIntensity: (i: number) => void;
}

const colorOptions = [
  { label: 'Cempasúchil', hex: '#F97316', color: 'rgba(249,115,22,0.45)' },
  { label: 'Oro sagrado', hex: '#EAB308', color: 'rgba(234,179,8,0.45)' },
  { label: 'Morado místico', hex: '#7C3AED', color: 'rgba(124,58,237,0.45)' },
  { label: 'Rojo pasión', hex: '#DC2626', color: 'rgba(220,38,38,0.45)' },
  { label: 'Rosa catrina', hex: '#EC4899', color: 'rgba(236,72,153,0.4)' },
];

export default function AmbientStudio({ ambientColor, setAmbientColor, glowSize, setGlowSize, glowIntensity, setGlowIntensity }: AmbientStudioProps) {
  const [isOpen, setIsOpen] = useState(false);

  const reset = () => {
    setAmbientColor('rgba(249,115,22,0.45)');
    setGlowSize(80);
    setGlowIntensity(1);
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            transition={{ duration: 0.2 }}
            style={{
              padding: '20px',
              borderRadius: '16px',
              width: '250px',
              border: '1px solid rgba(255,255,255,0.08)',
              background: 'rgba(10,4,4,0.97)',
              backdropFilter: 'blur(20px)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: 'rgba(255,255,255,0.35)', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
                Ambiente
              </span>
              <button onClick={reset} style={{ color: 'rgba(255,255,255,0.25)', cursor: 'pointer', background: 'none', border: 'none' }}>
                <RefreshCw size={12} />
              </button>
            </div>

            <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: 'rgba(255,255,255,0.25)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.15em' }}>Color</p>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
              {colorOptions.map((opt) => (
                <button
                  key={opt.label}
                  title={opt.label}
                  onClick={() => setAmbientColor(opt.color)}
                  style={{
                    width: 28, height: 28, borderRadius: '50%',
                    backgroundColor: opt.hex,
                    border: ambientColor === opt.color ? '2px solid white' : '2px solid transparent',
                    transform: ambientColor === opt.color ? 'scale(1.15)' : 'scale(1)',
                    opacity: ambientColor === opt.color ? 1 : 0.55,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                />
              ))}
            </div>

            <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: 'rgba(255,255,255,0.25)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.15em' }}>
              Tamaño <span style={{ color: '#F97316' }}>{glowSize}%</span>
            </p>
            <input type="range" min={40} max={150} value={glowSize} onChange={(e) => setGlowSize(Number(e.target.value))}
              style={{ width: '100%', marginBottom: '12px', accentColor: '#F97316', height: '4px' }} />

            <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: 'rgba(255,255,255,0.25)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.15em' }}>
              Intensidad <span style={{ color: '#F97316' }}>{glowIntensity.toFixed(1)}x</span>
            </p>
            <input type="range" min={0.5} max={2.0} step={0.1} value={glowIntensity} onChange={(e) => setGlowIntensity(Number(e.target.value))}
              style={{ width: '100%', accentColor: '#F97316', height: '4px' }} />
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: 48, height: 48, borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          border: isOpen ? '1px solid #F97316' : '1px solid rgba(255,255,255,0.1)',
          background: isOpen ? '#F97316' : 'rgba(10,4,4,0.85)',
          color: isOpen ? 'white' : 'rgba(255,255,255,0.4)',
          cursor: 'pointer',
          transition: 'all 0.2s',
          boxShadow: isOpen ? '0 0 20px rgba(249,115,22,0.5)' : 'none',
          backdropFilter: 'blur(12px)',
        }}
      >
        <Sliders size={18} />
      </button>
    </div>
  );
}
