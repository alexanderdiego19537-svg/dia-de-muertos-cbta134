'use client';

import { useEffect, useState } from 'react';

// Paleta naranja cempasúchil — colores directamente en el SVG fill
const COLORS = [
  '#F97316', '#EA6C00', '#FB923C',
  '#F97A1A', '#F17F05', '#FF8C00',
  '#E8650A', '#FFA040',
];

interface Petal {
  id: number;
  left: number;
  size: number;
  color: string;
  duration: number;
  delay: number;
  sway: number;
  rotate: number;
  rotateDelta: number;
  opacity: number;
}

function makePetals(count: number): Petal[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    left:        Math.random() * 100,
    size:        10 + Math.random() * 16,
    color:       COLORS[Math.floor(Math.random() * COLORS.length)],
    duration:    7 + Math.random() * 9,
    delay:       Math.random() * 14,
    sway:        50 + Math.random() * 90,
    rotate:      Math.random() * 360,
    rotateDelta: 160 + Math.random() * 360,
    opacity:     0.55 + Math.random() * 0.4,
  }));
}

// Genera un SVG con volumen y nervadura integrada en el vector (sin filtros CSS costosos)
function makePetalUrl(color: string) {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 34'><ellipse cx='10' cy='17' rx='8.5' ry='16' fill='${color}' opacity='0.95'/><ellipse cx='9' cy='15' rx='5' ry='12' fill='#FFD54F' opacity='0.35'/><path d='M10 2 Q10 17 10 32' stroke='#D97706' stroke-width='0.7' opacity='0.3'/></svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}

export default function PetalRain({ count = 24 }: { count?: number }) {
  const [petals, setPetals] = useState<Petal[]>([]);

  // Genera los pétalos adaptados al dispositivo para 60 FPS fijos
  useEffect(() => {
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const finalCount = isMobile ? Math.min(count, 14) : Math.min(count, 24);
    setPetals(makePetals(finalCount));
  }, [count]);

  if (petals.length === 0) return null;

  return (
    <>
      <div
        aria-hidden
        style={{
          position: 'fixed',
          inset: 0,
          pointerEvents: 'none',  /* ← nunca bloquea clics */
          zIndex: 9,              /* ← debajo de modales/header (z≥20) */
          overflow: 'hidden',
          contain: 'strict',      /* Aislamiento de capas del navegador */
        }}
      >
        {petals.map((p) => (
          <div
            key={p.id}
            style={{
              position: 'absolute',
              top: 0,
              left: `${p.left}%`,
              width:  p.size,
              height: p.size * 1.8,
              backgroundImage: makePetalUrl(p.color),
              backgroundSize: 'contain',
              backgroundRepeat: 'no-repeat',
              /* CSS custom props para la animación */
              ['--r0' as string]: `${p.rotate}deg`,
              ['--r1' as string]: `${p.rotate + p.rotateDelta * 0.35}deg`,
              ['--r2' as string]: `${p.rotate + p.rotateDelta * 0.65}deg`,
              ['--r3' as string]: `${p.rotate + p.rotateDelta}deg`,
              ['--sw' as string]: `${p.sway}px`,
              ['--op' as string]: p.opacity,
              animation: `petal-fall ${p.duration}s ease-in ${p.delay}s infinite`,
              willChange: 'transform, opacity',
              transform: 'translate3d(0,0,0)',
            }}
          />
        ))}
      </div>
    </>
  );
}
