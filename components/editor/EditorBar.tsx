'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Edit3, Images, Calendar, Megaphone, BarChart3, Film, ChevronRight, ChevronLeft, X } from 'lucide-react';
import EditorModal from './EditorModal';

export default function EditorBar() {
  const supabase = createClient();
  const [isEditor, setIsEditor]     = useState(false);
  const [profile, setProfile]       = useState<{ full_name: string; email?: string } | null>(null);
  const [modalOpen, setModalOpen]   = useState(false);
  const [activeTab, setActiveTab]   = useState<'gallery' | 'videos' | 'programa' | 'anuncios' | 'stats'>('gallery');
  const [isExpanded, setIsExpanded] = useState(true);

  useEffect(() => {
    async function checkRole() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setIsEditor(false);
        return;
      }

      const { data: prof } = await supabase
        .from('profiles')
        .select('role, full_name')
        .eq('id', user.id)
        .maybeSingle();

      if (prof?.role === 'editor' || prof?.role === 'admin') {
        setIsEditor(true);
        setProfile({ full_name: prof.full_name, email: user.email });
      } else {
        setIsEditor(false);
      }
    }

    checkRole();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      checkRole();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  if (!isEditor) return null;

  return (
    <>
      {/* 
        MENÚ VERTICAL EN EL COSTADO DERECHO (encima del menú de ambiente)
        No estorba las funciones ni los botones inferiores de la página
      */}
      <aside
        style={{
          position: 'fixed',
          right: 20,
          bottom: 96, // Justo arriba del botón de AmbientStudio (bottom: 24)
          zIndex: 48,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          pointerEvents: 'auto',
          touchAction: 'auto',
        }}
      >
        {isExpanded ? (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 6,
              padding: '12px 10px',
              borderRadius: 18,
              background: 'rgba(15, 6, 15, 0.94)',
              border: '1px solid rgba(249,115,22,0.35)',
              boxShadow: '0 12px 40px rgba(0,0,0,0.85), 0 0 25px rgba(249,115,22,0.18)',
              backdropFilter: 'blur(20px)',
              minWidth: 150,
            }}
          >
            {/* Cabecera del dock vertical */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingBottom: 8,
              borderBottom: '1px solid rgba(255,255,255,0.08)',
              marginBottom: 4,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 13 }}>✏️</span>
                <span style={{
                  fontSize: 11, fontFamily: 'JetBrains Mono, monospace',
                  fontWeight: 700, color: '#F97316', textTransform: 'uppercase', letterSpacing: '0.1em',
                }}>
                  Editor
                </span>
              </div>
              <button
                onClick={() => setIsExpanded(false)}
                title="Minimizar panel"
                style={{
                  background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)',
                  cursor: 'pointer', padding: 2, display: 'flex', alignItems: 'center',
                }}
              >
                <X size={14} />
              </button>
            </div>

            {/* Botones verticales de acceso rápido */}
            <button
              onClick={() => { setActiveTab('gallery'); setModalOpen(true); }}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '8px 10px', borderRadius: 10,
                background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
                color: 'white', cursor: 'pointer', fontSize: 12, fontFamily: 'Inter, sans-serif',
                textAlign: 'left', transition: 'all 0.2s',
              }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(249,115,22,0.5)')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)')}
            >
              <Images size={14} style={{ color: '#F97316', flexShrink: 0 }} />
              <span>Fotos</span>
            </button>

            <button
              onClick={() => { setActiveTab('videos'); setModalOpen(true); }}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '8px 10px', borderRadius: 10,
                background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
                color: 'white', cursor: 'pointer', fontSize: 12, fontFamily: 'Inter, sans-serif',
                textAlign: 'left', transition: 'all 0.2s',
              }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(249,115,22,0.5)')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)')}
            >
              <Film size={14} style={{ color: '#A855F7', flexShrink: 0 }} />
              <span>Videos</span>
            </button>

            <button
              onClick={() => { setActiveTab('programa'); setModalOpen(true); }}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '8px 10px', borderRadius: 10,
                background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
                color: 'white', cursor: 'pointer', fontSize: 12, fontFamily: 'Inter, sans-serif',
                textAlign: 'left', transition: 'all 0.2s',
              }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(249,115,22,0.5)')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)')}
            >
              <Calendar size={14} style={{ color: '#34D399', flexShrink: 0 }} />
              <span>Programa</span>
            </button>

            <button
              onClick={() => { setActiveTab('anuncios'); setModalOpen(true); }}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '8px 10px', borderRadius: 10,
                background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
                color: 'white', cursor: 'pointer', fontSize: 12, fontFamily: 'Inter, sans-serif',
                textAlign: 'left', transition: 'all 0.2s',
              }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(249,115,22,0.5)')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)')}
            >
              <Megaphone size={14} style={{ color: '#FBBF24', flexShrink: 0 }} />
              <span>Anuncios</span>
            </button>

            <button
              onClick={() => { setActiveTab('stats'); setModalOpen(true); }}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '8px 10px', borderRadius: 10,
                background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
                color: 'white', cursor: 'pointer', fontSize: 12, fontFamily: 'Inter, sans-serif',
                textAlign: 'left', transition: 'all 0.2s',
              }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(249,115,22,0.5)')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)')}
            >
              <BarChart3 size={14} style={{ color: '#60A5FA', flexShrink: 0 }} />
              <span>Métricas</span>
            </button>
          </div>
        ) : (
          /* Botón flotante vertical minimizado */
          <button
            onClick={() => setIsExpanded(true)}
            title="Abrir herramientas de editor"
            style={{
              padding: '10px 14px',
              borderRadius: 999,
              background: 'rgba(15, 6, 15, 0.95)',
              border: '1px solid rgba(249,115,22,0.4)',
              color: '#F97316',
              boxShadow: '0 8px 30px rgba(0,0,0,0.8), 0 0 15px rgba(249,115,22,0.2)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: 11,
              fontWeight: 700,
            }}
          >
            <span>✏️</span>
            <span>EDITOR</span>
            <ChevronLeft size={14} />
          </button>
        )}
      </aside>

      {/* Modal interactivo para editar sin salir de la página */}
      <EditorModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        initialTab={activeTab}
        userName={profile?.full_name}
        userEmail={profile?.email}
      />
    </>
  );
}
