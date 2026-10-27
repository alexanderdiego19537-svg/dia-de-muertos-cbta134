'use client';

import Image from 'next/image';
import CempasuchilLogo from './CempasuchilLogo';

const socials = [
  {
    label: 'Facebook',
    url: 'https://www.facebook.com/share/19iKSbt1Mf/',
    hoverColor: '#1877F2',
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    ),
  },
  {
    label: 'Instagram',
    url: 'https://www.instagram.com/cbta134oficial',
    hoverColor: '#E1306C',
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
      </svg>
    ),
  },
  {
    label: 'TikTok',
    url: 'https://www.tiktok.com/@134cbta',
    hoverColor: '#69C9D0',
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.2 8.2 0 004.79 1.54V6.76a4.85 4.85 0 01-1.02-.07z"/>
      </svg>
    ),
  },
];

export default function Footer() {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <footer style={{ padding: '56px 0 32px', borderTop: '1px solid rgba(249,115,22,0.1)', position: 'relative', overflow: 'hidden', backgroundColor: '#0A0404' }}>
      <div style={{ position: 'absolute', left: '50%', top: 0, transform: 'translateX(-50%)', width: '60%', height: 1, background: 'linear-gradient(to right, transparent, rgba(249,115,22,0.45), transparent)' }} />

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
        {/* Top row */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 28, alignItems: 'center', marginBottom: 36 }}>
          {/* Logo + name */}
          <div onClick={scrollToTop} style={{ display: 'flex', alignItems: 'center', gap: 16, cursor: 'pointer' }}>
            <CempasuchilLogo size={52} animated />
            <div>
              <p style={{ fontFamily: 'Cinzel, serif', fontWeight: 700, color: 'white', fontSize: 18, letterSpacing: '0.05em', margin: 0 }}>CBTA #134</p>
              <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: 'rgba(249,115,22,0.6)', letterSpacing: '0.1em', margin: '4px 0 0' }}>Día de Muertos — Tetlanhocan, Tlaxcala</p>
            </div>
          </div>

          {/* Official site link */}
          <a
            href="https://cbta134.edu.mx"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '8px 20px', borderRadius: 999,
              border: '1px solid rgba(249,115,22,0.3)',
              background: 'rgba(249,115,22,0.06)',
              color: '#F97316', textDecoration: 'none',
              fontFamily: 'JetBrains Mono, monospace', fontSize: 12,
              transition: 'all 0.2s',
              letterSpacing: '0.05em',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.background = 'rgba(249,115,22,0.14)';
              (e.currentTarget as HTMLElement).style.borderColor = 'rgba(249,115,22,0.6)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.background = 'rgba(249,115,22,0.06)';
              (e.currentTarget as HTMLElement).style.borderColor = 'rgba(249,115,22,0.3)';
            }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/>
              <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/>
            </svg>
            cbta134.edu.mx — Sitio oficial
          </a>

          {/* Social icons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: 'rgba(255,255,255,0.22)', marginRight: 4 }}>Síguenos</span>
            {socials.map(({ label, url, hoverColor, icon }) => (
              <a
                key={label}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                title={label}
                style={{
                  width: 42, height: 42, borderRadius: '50%',
                  border: '1px solid rgba(255,255,255,0.08)',
                  background: 'rgba(255,255,255,0.03)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'rgba(255,255,255,0.38)',
                  textDecoration: 'none',
                  transition: 'all 0.22s',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.color = hoverColor;
                  (e.currentTarget as HTMLElement).style.borderColor = hoverColor + '55';
                  (e.currentTarget as HTMLElement).style.background = hoverColor + '12';
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.38)';
                  (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.08)';
                  (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.03)';
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                }}
              >
                {icon}
              </a>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: 1, marginBottom: 28, background: 'linear-gradient(to right, transparent, rgba(249,115,22,0.15), transparent)' }} />

        {/* Bottom row */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <Image src="/images/logo-cbta.png" alt="Escudo institucional CBTA #134" width={32} height={32} style={{ opacity: 0.3 }} />
            <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: 'rgba(255,255,255,0.25)', margin: 0 }}>
              © 2026 Centro de Bachillerato Tecnológico Agropecuario #134
            </p>
          </div>

          <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', justifyContent: 'center' }}>
            {['Política de Privacidad', 'Términos de Uso', 'Aviso Legal'].map(link => (
              <button key={link}
                style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: 'rgba(255,255,255,0.18)', background: 'none', border: 'none', cursor: 'pointer', transition: 'color 0.2s', padding: 0 }}
                onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = '#F97316')}
                onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.18)')}>
                {link}
              </button>
            ))}
          </div>

          <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: 'rgba(255,255,255,0.12)', marginTop: 4, textAlign: 'center', lineHeight: 1.6 }}>
            Desarrollado con 💀 por Diego Alexander Zecua Zecua · Actividad PAEC 2026 · Tetlanhocan, Tlaxcala
          </p>
        </div>
      </div>
    </footer>
  );
}
