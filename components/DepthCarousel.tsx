'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';

export interface DepthCarouselItem {
  image: string;
  alt: string;
  label?: string;
}

interface DepthCarouselProps {
  items: DepthCarouselItem[];
  depth?: number;
  spread?: number;
  tilt?: number;
  tiltDirection?: 'left' | 'right';
  perspective?: number;
  visibleCards?: number;
  falloff?: number;
  blur?: number;
  autoplay?: boolean;
  loop?: boolean;
  cardWidth?: number;
  cardHeight?: number;
  radius?: number;
  tint?: string;
  duration?: number;
  autoplayDelay?: number;
  showControls?: boolean;
  showIndicators?: boolean;
}

export default function DepthCarousel({
  items,
  depth = 220,
  spread = 90,
  tilt = 22,
  tiltDirection = 'right',
  perspective = 1400,
  visibleCards = 4,
  falloff = 0.2,
  blur = 6,
  autoplay = false,
  loop = true,
  cardWidth = 300,
  cardHeight = 380,
  radius = 18,
  tint = '#05060a',
  duration = 700,
  autoplayDelay = 3200,
  showControls = true,
  showIndicators = true,
}: DepthCarouselProps) {
  const [active, setActive] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const total = items.length;

  const go = useCallback(
    (dir: 1 | -1) => {
      setActive(prev => {
        const next = prev + dir;
        if (loop) return ((next % total) + total) % total;
        return Math.max(0, Math.min(total - 1, next));
      });
    },
    [loop, total],
  );

  useEffect(() => {
    if (!autoplay) return;
    timerRef.current = setInterval(() => go(1), autoplayDelay);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [autoplay, autoplayDelay, go]);

  /* Cards to render: active + visibleCards - 1 behind */
  const visible = Math.min(visibleCards, total);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      {/* ── 3D Stage ── */}
      <div style={{ perspective: `${perspective}px`, perspectiveOrigin: '50% 50%', width: '100%', flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ position: 'relative', width: cardWidth, height: cardHeight, transformStyle: 'preserve-3d' }}>
          {items.map((item, i) => {
            /* Compute slot relative to active (0 = front, 1 = first behind, ...) */
            const slot = ((i - active) % total + total) % total;
            const isVisible = slot < visible;

            /* Z goes back as slot increases */
            const z = -slot * depth;
            /* X shifts to the right for each slot */
            const xSign = tiltDirection === 'right' ? 1 : -1;
            const x = slot * spread * xSign;
            /* Y rotation: tilt the stack */
            const rotY = tiltDirection === 'right' ? -tilt : tilt;

            const opacity = isVisible ? Math.max(0.1, 1 - slot * falloff) : 0;
            const blurPx = slot * (blur / (visible - 1 || 1));
            const scale = 1 - slot * 0.04;

            return (
              <div
                key={i}
                onClick={() => slot > 0 && setActive(i)}
                style={{
                  position: 'absolute',
                  inset: 0,
                  borderRadius: radius,
                  overflow: 'hidden',
                  cursor: slot > 0 ? 'pointer' : 'default',
                  opacity,
                  transform: `translateX(${x}px) translateZ(${z}px) rotateY(${slot === 0 ? 0 : rotY}deg) scale(${scale})`,
                  transition: `transform ${duration}ms cubic-bezier(0.22,1,0.36,1), opacity ${duration}ms ease, filter ${duration}ms ease`,
                  filter: blurPx > 0.5 ? `blur(${blurPx.toFixed(1)}px)` : 'none',
                  willChange: 'transform, opacity, filter',
                  zIndex: visible - slot,
                  boxShadow: slot === 0
                    ? '0 30px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(249,115,22,0.2)'
                    : '0 10px 40px rgba(0,0,0,0.5)',
                }}
              >
                {/* Image */}
                <Image
                  src={item.image}
                  alt={item.alt}
                  fill
                  sizes={`${cardWidth}px`}
                  style={{ objectFit: 'cover' }}
                  priority={slot === 0}
                />

                {/* Tint overlay */}
                <div style={{
                  position: 'absolute', inset: 0,
                  background: `linear-gradient(to top, ${tint}ee 0%, ${tint}55 40%, transparent 70%)`,
                }} />

                {/* Label on front card */}
                {slot === 0 && item.label && (
                  <div style={{
                    position: 'absolute', bottom: 16, left: 16, right: 16,
                    fontFamily: 'Cinzel, serif', fontWeight: 700,
                    fontSize: 14, color: 'white',
                    textShadow: '0 2px 8px rgba(0,0,0,0.8)',
                    textAlign: 'center',
                  }}>
                    {item.label}
                  </div>
                )}

                {/* Orange glow border on active */}
                {slot === 0 && (
                  <div style={{
                    position: 'absolute', inset: 0,
                    borderRadius: radius,
                    border: '1px solid rgba(249,115,22,0.4)',
                    pointerEvents: 'none',
                  }} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Controls ── */}
      {showControls && (
        <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
          <button
            onClick={() => go(-1)}
            disabled={!loop && active === 0}
            style={{
              width: 44, height: 44, borderRadius: '50%',
              border: '1px solid rgba(249,115,22,0.4)',
              background: 'rgba(249,115,22,0.08)',
              color: '#F97316', cursor: 'pointer',
              fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.2s',
              opacity: !loop && active === 0 ? 0.3 : 1,
            }}
          >
            ←
          </button>
          <button
            onClick={() => go(1)}
            disabled={!loop && active === total - 1}
            style={{
              width: 44, height: 44, borderRadius: '50%',
              border: '1px solid rgba(249,115,22,0.4)',
              background: 'rgba(249,115,22,0.08)',
              color: '#F97316', cursor: 'pointer',
              fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.2s',
              opacity: !loop && active === total - 1 ? 0.3 : 1,
            }}
          >
            →
          </button>
        </div>
      )}

      {/* ── Indicators ── */}
      {showIndicators && (
        <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
          {items.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              style={{
                width: i === active ? 24 : 8,
                height: 8,
                borderRadius: 999,
                border: 'none',
                background: i === active ? '#F97316' : 'rgba(255,255,255,0.2)',
                cursor: 'pointer',
                padding: 0,
                transition: 'all 0.3s ease',
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
