'use client';

import { useEffect, useState } from 'react';

const COLORS = [
  '#F97316', '#EAB308', '#FB923C',
  '#FDE047', '#FDBA74', '#FCD34D',
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
    opacity:     0.3 + Math.random() * 0.45,
  }));
}

// SVG inline de pétalo — se embebe como background-image
const PETAL = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 18 32'><ellipse cx='9' cy='16' rx='7.5' ry='15.5' fill='white'/></svg>`;
const PETAL_URL = `url("data:image/svg+xml,${encodeURIComponent(PETAL)}")`;

export default function PetalRain({ count = 38 }: { count?: number }) {
  const [petals, setPetals] = useState<Petal[]>([]);

  // Genera los petales solo en el cliente (evita hydration mismatch)
  useEffect(() => {
    setPetals(makePetals(count));
  }, [count]);

  if (petals.length === 0) return null;

  return (
    <>
      <style>{`
        @keyframes petal-fall {
          0%   { transform: translateY(-70px) translateX(0px)           rotate(var(--r0)); opacity: 0; }
          6%   { opacity: var(--op); }
          40%  { transform: translateY(40vh)  translateX(var(--sw))     rotate(var(--r1)); }
          60%  { transform: translateY(62vh)  translateX(calc(var(--sw) * -.4)) rotate(var(--r2)); }
          88%  { opacity: var(--op); }
          100% { transform: translateY(108vh) translateX(calc(var(--sw) * .7)) rotate(var(--r3)); opacity: 0; }
        }
      `}</style>

      <div
        aria-hidden
        style={{
          position: 'fixed',
          inset: 0,
          pointerEvents: 'none',  /* ← nunca bloquea clics */
          zIndex: 9,              /* ← debajo de modales/header (z≥20) */
          overflow: 'hidden',
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
              backgroundImage: PETAL_URL,
              backgroundSize: 'contain',
              backgroundRepeat: 'no-repeat',
              // Color via filtro (el SVG es blanco, el filtro lo colorea)
              filter: `drop-shadow(0 0 3px ${p.color}) sepia(1) saturate(4) hue-rotate(${
                p.color === '#EAB308' || p.color === '#FDE047' || p.color === '#FCD34D'
                  ? '10deg'
                  : '340deg'
              })`,
              /* CSS custom props para la animación */
              ['--r0' as string]: `${p.rotate}deg`,
              ['--r1' as string]: `${p.rotate + p.rotateDelta * 0.35}deg`,
              ['--r2' as string]: `${p.rotate + p.rotateDelta * 0.65}deg`,
              ['--r3' as string]: `${p.rotate + p.rotateDelta}deg`,
              ['--sw' as string]: `${p.sway}px`,
              ['--op' as string]: p.opacity,
              animation: `petal-fall ${p.duration}s ease-in ${p.delay}s infinite`,
              willChange: 'transform, opacity',
            }}
          />
        ))}
      </div>
    </>
  );
}
