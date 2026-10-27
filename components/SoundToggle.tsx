'use client';

import { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

export default function SoundToggle() {
  const [isOn, setIsOn] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscillatorsRef = useRef<OscillatorNode[]>([]);

  const startSynth = () => {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new AudioCtx();
    audioCtxRef.current = ctx;

    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.012, ctx.currentTime);
    masterGain.connect(ctx.destination);

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(480, ctx.currentTime);
    filter.connect(masterGain);

    // G-minor pentatonic drone — evoca misterio y solemnidad
    const frequencies = [98.0, 130.81, 174.61, 261.63];
    const oscs: OscillatorNode[] = [];

    frequencies.forEach((freq) => {
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      const lfo = ctx.createOscillator();
      lfo.frequency.setValueAtTime(0.08 + Math.random() * 0.12, ctx.currentTime);
      const lfoGain = ctx.createGain();
      lfoGain.gain.setValueAtTime(2 + Math.random() * 3, ctx.currentTime);
      lfo.connect(lfoGain);
      lfoGain.connect(osc.frequency);

      osc.connect(filter);
      lfo.start();
      osc.start();
      oscs.push(osc);
    });

    oscillatorsRef.current = oscs;
  };

  const stopSynth = () => {
    oscillatorsRef.current.forEach((osc) => {
      try { osc.stop(); } catch { /* already stopped */ }
    });
    oscillatorsRef.current = [];
    if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
      audioCtxRef.current.close();
    }
    audioCtxRef.current = null;
  };

  useEffect(() => () => { stopSynth(); }, []);

  const toggle = () => {
    if (isOn) { stopSynth(); setIsOn(false); }
    else { startSynth(); setIsOn(true); }
  };

  return (
    <button
      onClick={toggle}
      title={isOn ? 'Silenciar ambiente' : 'Activar sonido ambiente'}
      className="fixed bottom-6 left-6 z-40 flex items-center gap-2 px-4 py-2.5 rounded-full border transition-all"
      style={{
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: '11px',
        background: isOn ? 'rgba(249,115,22,0.08)' : 'rgba(10,4,4,0.85)',
        borderColor: isOn ? '#F97316' : 'rgba(255,255,255,0.1)',
        color: isOn ? '#F97316' : 'rgba(255,255,255,0.4)',
        backdropFilter: 'blur(12px)',
      }}
    >
      {isOn ? (
        <>
          <Volume2 size={13} style={{ animation: 'bounce 1s infinite' }} />
          <span>AMBIENTE: ON</span>
          <span style={{ display: 'flex', alignItems: 'flex-end', gap: '2px', height: '14px' }}>
            {[8, 12, 6].map((h, i) => (
              <span key={i} style={{ width: 2, height: h, background: '#F97316', borderRadius: 1, display: 'block', animation: 'pulse 1s infinite', animationDelay: `${i * 150}ms` }} />
            ))}
          </span>
        </>
      ) : (
        <>
          <VolumeX size={13} />
          <span>SONIDO</span>
        </>
      )}
    </button>
  );
}
