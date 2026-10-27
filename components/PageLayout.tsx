'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Home } from 'lucide-react';
import { useState, ReactNode } from 'react';
import dynamic from 'next/dynamic';
import Footer from './Footer';
import Header from './Header';

const NavMenu    = dynamic(() => import('./NavMenu'),    { ssr: false });
const EventModal = dynamic(() => import('./EventModal'), { ssr: false });
const InfoBot    = dynamic(() => import('./InfoBot'),    { ssr: false });

const PAGES = [
  { href: '/',              label: 'Inicio' },
  { href: '/quienes-somos',label: 'Nosotros' },
  { href: '/programa',     label: 'Programa' },
  { href: '/concurso',     label: 'Concurso' },
  { href: '/galeria',      label: 'Galería' },
  { href: '/ubicacion',    label: 'Ubicación' },
];

interface PageLayoutProps {
  children: ReactNode;
  prevPage?: { href: string; label: string };
  nextPage?: { href: string; label: string };
  showFooter?: boolean;
}

export default function PageLayout({ children, prevPage, nextPage, showFooter = false }: PageLayoutProps) {
  const pathname = usePathname();
  const [isMenuOpen,  setIsMenuOpen]  = useState(false);
  const [isEventOpen, setIsEventOpen] = useState(false);
  const [isChatOpen,  setIsChatOpen]  = useState(false);
  const [glowColor,   setGlowColor]   = useState('rgba(249,115,22,0.5)');

  return (
    <>
      <div style={{ minHeight: '100vh', backgroundColor: '#080208', display: 'flex', flexDirection: 'column' }}>

        {/* ── Header ── */}
        <Header
          onMenuOpen={() => setIsMenuOpen(true)}
          onEventOpen={() => setIsEventOpen(true)}
          onChatOpen={() => setIsChatOpen(true)}
        />

        {/* ── Page content ── */}
        <motion.main
          key={pathname}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
          style={{ flex: 1, display: 'flex', flexDirection: 'column' }}
        >
          {children}
        </motion.main>

        {/* ── Bottom prev/next nav ── */}
        <nav style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: 'clamp(14px,3vw,20px) clamp(16px,5vw,40px)',
          borderTop: '1px solid rgba(255,255,255,0.06)',
          backgroundColor: 'rgba(0,0,0,0.5)',
          backdropFilter: 'blur(16px)',
          flexWrap: 'wrap',
          gap: 12,
        }}>

          {/* Prev / Home */}
          {prevPage ? (
            <Link href={prevPage.href} style={{ textDecoration: 'none' }}>
              <motion.div whileHover={{ x: -3 }} style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '10px clamp(12px,3vw,20px)', borderRadius: 999,
                border: '1px solid rgba(255,255,255,0.12)',
                background: 'rgba(255,255,255,0.04)',
                cursor: 'pointer', color: 'rgba(255,255,255,0.7)',
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: 'clamp(11px,2vw,13px)',
              }}>
                <ChevronLeft size={15} color="#F97316" />
                {prevPage.label}
              </motion.div>
            </Link>
          ) : (
            <Link href="/" style={{ textDecoration: 'none' }}>
              <motion.div whileHover={{ scale: 1.04 }} style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '10px clamp(12px,3vw,20px)', borderRadius: 999,
                border: '1px solid rgba(249,115,22,0.2)',
                background: 'rgba(249,115,22,0.06)',
                cursor: 'pointer', color: 'rgba(249,115,22,0.8)',
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: 'clamp(11px,2vw,13px)',
              }}>
                <Home size={13} />
                Inicio
              </motion.div>
            </Link>
          )}

          {/* Dots */}
          <div style={{ display: 'flex', gap: 7, alignItems: 'center' }}>
            {PAGES.map((p) => (
              <Link key={p.href} href={p.href} title={p.label}>
                <motion.div
                  whileHover={{ scale: 1.3 }}
                  style={{
                    width: pathname === p.href ? 22 : 8,
                    height: 8, borderRadius: 4,
                    background: pathname === p.href ? '#F97316' : 'rgba(255,255,255,0.18)',
                    transition: 'all 0.3s',
                    cursor: 'pointer',
                  }}
                />
              </Link>
            ))}
          </div>

          {/* Next */}
          {nextPage ? (
            <Link href={nextPage.href} style={{ textDecoration: 'none' }}>
              <motion.div whileHover={{ x: 3 }} style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '10px clamp(12px,3vw,20px)', borderRadius: 999,
                border: 'none',
                background: 'linear-gradient(135deg, #F97316, #C2410C)',
                cursor: 'pointer', color: 'white',
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: 'clamp(11px,2vw,13px)',
                fontWeight: 600,
                boxShadow: '0 4px 16px rgba(249,115,22,0.35)',
              }}>
                {nextPage.label}
                <ChevronRight size={15} />
              </motion.div>
            </Link>
          ) : (
            <div style={{ width: 80 }} />
          )}
        </nav>

        {showFooter && <Footer />}
      </div>

      {/* Modals */}
      <NavMenu    isOpen={isMenuOpen}  onClose={() => setIsMenuOpen(false)}  ambientColor={glowColor} setAmbientColor={setGlowColor} />
      <EventModal isOpen={isEventOpen} onClose={() => setIsEventOpen(false)} />
      <InfoBot    isOpen={isChatOpen}  onClose={() => setIsChatOpen(false)}  />
    </>
  );
}
