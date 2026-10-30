'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, Clock, User, ShieldCheck, LogOut, ChevronDown } from 'lucide-react';
import CempasuchilLogo from './CempasuchilLogo';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';

interface HeaderProps {
  onMenuOpen: () => void;
  onEventOpen: () => void;
  onChatOpen: () => void;
}

export default function Header({ onMenuOpen, onEventOpen, onChatOpen }: HeaderProps) {
  const supabase = createClient();
  const [currentTime, setCurrentTime]   = useState('');
  const [scrolled, setScrolled]         = useState(false);
  
  // Usuario y perfil
  const [user, setUser]                 = useState<{ id: string; email?: string } | null>(null);
  const [profile, setProfile]           = useState<{ full_name: string; role: string } | null>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  useEffect(() => {
    async function loadUser() {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (authUser) {
        setUser({ id: authUser.id, email: authUser.email });
        const { data: prof } = await supabase
          .from('profiles')
          .select('full_name, role')
          .eq('id', authUser.id)
          .maybeSingle();

        if (prof) {
          setProfile(prof);
        } else {
          setProfile({
            full_name: authUser.email ? authUser.email.split('@')[0] : 'Usuario',
            role: 'user',
          });
        }
      } else {
        setUser(null);
        setProfile(null);
      }
    }
    loadUser();
  }, [supabase]);

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
    let lastScrolled = false;
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      if (isScrolled !== lastScrolled) {
        lastScrolled = isScrolled;
        setScrolled(isScrolled);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`relative z-50 flex items-center justify-between w-full px-4 sm:px-6 py-3.5 md:px-12 transition-all duration-300 ${scrolled ? 'bg-black/70 backdrop-blur-md border-b border-orange-900/30' : 'bg-black/40 backdrop-blur-md border-b border-white/5'}`}>
      {/* Left: Brand Logo + Menu + Local Time */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Logo en la esquina superior izquierda */}
        <Link
          href="/"
          className="flex items-center gap-2.5 group transition-transform active:scale-95"
          title="Ir al inicio — CBTA #134"
        >
          <CempasuchilLogo size={36} animated />
          <div className="flex flex-col">
            <span className="font-display text-xs font-bold tracking-[0.25em] text-orange-400 uppercase transition-colors group-hover:text-orange-300">
              CBT #134
            </span>
            <span className="font-mono text-[9px] tracking-wider text-white/40 uppercase hidden sm:block">
              Tetlanohcan
            </span>
          </div>
        </Link>

        {/* Separador vertical sutil */}
        <div className="h-6 w-px bg-white/10 hidden sm:block" />

        {/* Botón Menú */}
        <button
          onClick={onMenuOpen}
          className="flex items-center gap-2 px-3.5 py-1.5 border rounded-full border-white/10 hover:border-orange-500/50 bg-white/5 hover:bg-orange-500/10 transition-all duration-300 text-sm text-white/70 hover:text-white"
        >
          <Menu size={16} />
          <span className="hidden sm:block font-mono text-xs tracking-widest uppercase">Menú</span>
        </button>

        {/* Hora en Tlaxcala */}
        <div className="hidden xl:flex items-center gap-2 font-mono text-xs text-white/50 bg-white/5 px-3.5 py-1.5 rounded-full">
          <Clock size={12} className="text-orange-500" style={{ animation: 'pulse 2s infinite' }} />
          <span>/ Tlaxcala, MX — {currentTime || '10:00 AM'}</span>
        </div>
      </div>

      {/* Right: CTA buttons + User */}
      <div className="flex items-center gap-3">
        <button
          onClick={onChatOpen}
          className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 hover:border-orange-500/40 bg-white/5 hover:bg-orange-500/10 text-white/60 hover:text-white transition-all text-sm"
        >
          Info
          <div className="w-5 h-5 rounded-full border border-white/20 flex items-center justify-center">
            <span className="text-xs">→</span>
          </div>
        </button>

        {/* ── Botón de Usuario / Iniciar Sesión ── */}
        {user ? (
          <div className="relative">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-orange-500/35 bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 text-xs font-mono transition-all"
            >
              <User size={13} />
              <span className="max-w-[100px] truncate font-semibold">
                {profile?.full_name || user.email?.split('@')[0]}
              </span>
              <ChevronDown size={11} className="opacity-60" />
            </button>

            {/* Menú Desplegable de Usuario */}
            <AnimatePresence>
              {userMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-52 p-2 bg-black/95 border border-white/10 rounded-2xl backdrop-blur-xl z-50 shadow-2xl"
                >
                  <div className="px-3 py-2 border-b border-white/5 mb-1">
                    <p className="text-white text-xs font-semibold truncate">{profile?.full_name}</p>
                    <p className="text-white/40 text-[10px] font-mono truncate">{user.email}</p>
                    <span className="inline-block mt-1 px-2 py-0.5 rounded text-[9px] font-mono uppercase tracking-wider bg-orange-500/20 text-orange-400">
                      Rol: {profile?.role || 'user'}
                    </span>
                  </div>

                  {profile?.role === 'admin' && (
                    <Link
                      href="/admin"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 w-full px-3 py-2 text-xs text-white/90 hover:text-white hover:bg-orange-500/10 rounded-xl transition-all"
                    >
                      <ShieldCheck size={14} className="text-purple-400" />
                      <span>Panel Admin</span>
                    </Link>
                  )}

                  {(profile?.role === 'editor' || profile?.role === 'admin') && (
                    <Link
                      href="/editor"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 w-full px-3 py-2 text-xs text-white/90 hover:text-white hover:bg-orange-500/10 rounded-xl transition-all"
                    >
                      <span>✏️ Panel Editor</span>
                    </Link>
                  )}

                  <button
                    onClick={async () => {
                      setUserMenuOpen(false);
                      await supabase.auth.signOut();
                      window.location.reload();
                    }}
                    className="flex items-center gap-2 w-full px-3 py-2 text-xs text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
                  >
                    <LogOut size={13} />
                    <span>Cerrar Sesión</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <Link
            href="/login"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/15 bg-white/5 hover:border-orange-500/40 hover:bg-orange-500/10 text-white/80 hover:text-white transition-all text-xs font-mono"
          >
            <User size={13} className="text-orange-400" />
            <span className="hidden sm:inline">Entrar</span>
          </Link>
        )}

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
