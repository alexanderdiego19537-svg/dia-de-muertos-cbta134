'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Edit3, Images, Calendar, Megaphone, BarChart3, ShieldCheck } from 'lucide-react';
import EditorModal from './EditorModal';

export default function EditorBar() {
  const supabase = createClient();
  const [isEditor, setIsEditor]     = useState(false);
  const [profile, setProfile]       = useState<{ full_name: string; email?: string } | null>(null);
  const [modalOpen, setModalOpen]   = useState(false);
  const [activeTab, setActiveTab]   = useState<'gallery' | 'programa' | 'anuncios' | 'stats'>('gallery');

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

    // Re-verificar si cambia el estado de auth
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
      {/* Barra flotante inferior de edición en la misma página */}
      <div style={{
        position: 'fixed',
        bottom: 24,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 45,
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '8px 14px',
        borderRadius: 999,
        background: 'rgba(15, 5, 15, 0.95)',
        border: '1px solid rgba(249,115,22,0.4)',
        boxShadow: '0 10px 40px rgba(0,0,0,0.8), 0 0 25px rgba(249,115,22,0.2)',
        backdropFilter: 'blur(20px)',
        maxWidth: '92vw',
        overflowX: 'auto',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, paddingRight: 6, borderRight: '1px solid rgba(255,255,255,0.1)' }}>
          <span style={{
            fontSize: 10, fontFamily: 'JetBrains Mono, monospace',
            color: '#F97316', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em',
            whiteSpace: 'nowrap',
          }}>
            ✏️ Editor
          </span>
        </div>

        <button
          onClick={() => { setActiveTab('gallery'); setModalOpen(true); }}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '7px 12px', borderRadius: 999,
            background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
            color: 'white', cursor: 'pointer', fontSize: 12, fontFamily: 'Inter, sans-serif',
            whiteSpace: 'nowrap',
          }}
        >
          <Images size={13} color="#F97316" />
          <span>Subir Fotos</span>
        </button>

        <button
          onClick={() => { setActiveTab('programa'); setModalOpen(true); }}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '7px 12px', borderRadius: 999,
            background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
            color: 'white', cursor: 'pointer', fontSize: 12, fontFamily: 'Inter, sans-serif',
            whiteSpace: 'nowrap',
          }}
        >
          <Calendar size={13} color="#34D399" />
          <span>Programa</span>
        </button>

        <button
          onClick={() => { setActiveTab('anuncios'); setModalOpen(true); }}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '7px 12px', borderRadius: 999,
            background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
            color: 'white', cursor: 'pointer', fontSize: 12, fontFamily: 'Inter, sans-serif',
            whiteSpace: 'nowrap',
          }}
        >
          <Megaphone size={13} color="#FBBF24" />
          <span>Anuncios</span>
        </button>

        <button
          onClick={() => { setActiveTab('stats'); setModalOpen(true); }}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '7px 12px', borderRadius: 999,
            background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
            color: 'white', cursor: 'pointer', fontSize: 12, fontFamily: 'Inter, sans-serif',
            whiteSpace: 'nowrap',
          }}
        >
          <BarChart3 size={13} color="#60A5FA" />
          <span>Vistas/Likes</span>
        </button>
      </div>

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
