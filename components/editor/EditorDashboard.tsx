'use client';

import { useState, useEffect } from 'react';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { Images, Calendar, Megaphone, BarChart3, LogOut, ExternalLink, Eye, Heart, MessageSquare, Loader2 } from 'lucide-react';
import Link from 'next/link';

// Componentes reutilizados para edición de contenido
import AdminGallery from '@/components/admin/AdminGallery';
import AdminPrograma from '@/components/admin/AdminPrograma';
import AdminAnuncios from '@/components/admin/AdminAnuncios';

interface EditorDashboardProps {
  user: SupabaseUser;
  profileName?: string;
}

interface BasicStats {
  views: number;
  likes: number;
}

interface BasicComment {
  id: string;
  nombre: string;
  mensaje: string;
  created_at: string;
}

export default function EditorDashboard({ user, profileName }: EditorDashboardProps) {
  const router = useRouter();
  const supabase = createClient();

  const [tab, setTab] = useState<'gallery' | 'programa' | 'anuncios' | 'stats'>('gallery');
  const [stats, setStats] = useState<BasicStats>({ views: 0, likes: 0 });
  const [comentarios, setComentarios] = useState<BasicComment[]>([]);
  const [loadingStats, setLoadingStats] = useState(true);

  // Cargar estadísticas básicas (solo vistas, likes y comentarios)
  useEffect(() => {
    async function loadEditorStats() {
      try {
        const [vRes, lRes, cRes] = await Promise.all([
          supabase.from('visitas').select('*', { count: 'exact', head: true }),
          supabase.from('likes').select('*', { count: 'exact', head: true }),
          supabase.from('comentarios').select('id, nombre, mensaje, created_at').order('created_at', { ascending: false }).limit(30),
        ]);

        setStats({
          views: vRes.count ?? 0,
          likes: lRes.count ?? 0,
        });

        if (cRes.data) {
          setComentarios(cRes.data);
        }
      } catch (err) {
        console.error('Error cargando datos para editor:', err);
      } finally {
        setLoadingStats(false);
      }
    }

    loadEditorStats();
  }, [supabase]);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#080208',
      color: 'white',
      fontFamily: 'Inter, sans-serif',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Barra superior de navegación */}
      <header style={{
        backgroundColor: 'rgba(15, 6, 15, 0.95)',
        borderBottom: '1px solid rgba(249,115,22,0.15)',
        padding: '14px clamp(16px, 4vw, 36px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 12,
        position: 'sticky',
        top: 0,
        zIndex: 40,
        backdropFilter: 'blur(16px)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 38, height: 38, borderRadius: 10,
            background: 'rgba(249,115,22,0.15)',
            border: '1px solid rgba(249,115,22,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#F97316', fontWeight: 800, fontSize: 16,
          }}>
            ✏️
          </div>
          <div>
            <h1 style={{ fontFamily: 'Cinzel, serif', fontSize: 16, fontWeight: 700, margin: 0, color: 'white' }}>
              Panel de Editor
            </h1>
            <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', margin: 0 }}>
              Hola, {profileName || user.email?.split('@')[0]} · CBTA #134
            </p>
          </div>
        </div>

        {/* Botones de acción */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Link
            href="/"
            target="_blank"
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '8px 14px', borderRadius: 8,
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: 'rgba(255,255,255,0.8)',
              textDecoration: 'none', fontSize: 12,
            }}
          >
            <span>Ver Sitio Web</span>
            <ExternalLink size={13} />
          </Link>

          <button
            onClick={handleLogout}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '8px 14px', borderRadius: 8,
              background: 'rgba(220,38,38,0.12)',
              border: '1px solid rgba(220,38,38,0.25)',
              color: '#FCA5A5', cursor: 'pointer',
              fontSize: 12,
            }}
          >
            <LogOut size={13} />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </header>

      {/* Pestañas de navegación de contenido */}
      <div style={{
        backgroundColor: 'rgba(0,0,0,0.4)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        padding: '0 clamp(16px, 4vw, 36px)',
        display: 'flex',
        gap: 8,
        overflowX: 'auto',
      }}>
        {[
          { key: 'gallery',  label: 'Galería de Fotos', icon: Images },
          { key: 'programa', label: 'Programa Cultural', icon: Calendar },
          { key: 'anuncios', label: 'Anuncios y Avisos', icon: Megaphone },
          { key: 'stats',    label: 'Resumen de Interacción', icon: BarChart3 },
        ].map(item => {
          const Icon = item.icon;
          const active = tab === item.key;
          return (
            <button
              key={item.key}
              onClick={() => setTab(item.key as typeof tab)}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '14px 18px',
                border: 'none',
                borderBottom: active ? '2px solid #F97316' : '2px solid transparent',
                background: 'transparent',
                color: active ? '#F97316' : 'rgba(255,255,255,0.5)',
                cursor: 'pointer',
                fontFamily: 'Cinzel, serif',
                fontWeight: active ? 700 : 500,
                fontSize: 13,
                whiteSpace: 'nowrap',
                transition: 'all 0.2s',
              }}
            >
              <Icon size={16} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Contenido principal según la pestaña */}
      <main style={{ flex: 1, padding: 'clamp(20px, 4vw, 36px)' }}>
        {tab === 'gallery'  && <AdminGallery />}
        {tab === 'programa' && <AdminPrograma />}
        {tab === 'anuncios' && <AdminAnuncios />}

        {/* Pestaña de Resumen Básico (Vistas, Likes y Comentarios solo lectura) */}
        {tab === 'stats' && (
          <div style={{ maxWidth: 880, margin: '0 auto' }}>
            <div style={{ marginBottom: 24 }}>
              <h2 style={{ fontFamily: 'Cinzel, serif', fontSize: 20, fontWeight: 800, color: 'white', margin: '0 0 6px' }}>
                Resumen de Interacción del Público
              </h2>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', margin: 0 }}>
                Conteo total de visitas, me gustas y lectura de los mensajes dejados por la comunidad.
              </p>
            </div>

            {loadingStats ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}>
                <Loader2 size={24} color="#F97316" style={{ animation: 'spin 1s linear infinite' }} />
              </div>
            ) : (
              <>
                {/* Tarjetas simples: solo números */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                  gap: 16,
                  marginBottom: 32,
                }}>
                  {/* Visitas */}
                  <div style={{
                    background: 'rgba(255,255,255,0.025)',
                    border: '1px solid rgba(96,165,250,0.2)',
                    borderRadius: 16, padding: '24px',
                    display: 'flex', alignItems: 'center', gap: 16,
                  }}>
                    <div style={{
                      width: 50, height: 50, borderRadius: 14,
                      background: 'rgba(96,165,250,0.12)', border: '1px solid rgba(96,165,250,0.3)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <Eye size={24} color="#60A5FA" />
                    </div>
                    <div>
                      <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: 'JetBrains Mono, monospace' }}>
                        Visitas Registradas
                      </span>
                      <p style={{ fontFamily: 'Cinzel, serif', fontWeight: 800, fontSize: 32, color: 'white', margin: '2px 0 0' }}>
                        {stats.views.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* Likes */}
                  <div style={{
                    background: 'rgba(255,255,255,0.025)',
                    border: '1px solid rgba(248,113,113,0.2)',
                    borderRadius: 16, padding: '24px',
                    display: 'flex', alignItems: 'center', gap: 16,
                  }}>
                    <div style={{
                      width: 50, height: 50, borderRadius: 14,
                      background: 'rgba(248,113,113,0.12)', border: '1px solid rgba(248,113,113,0.3)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <Heart size={24} color="#F87171" />
                    </div>
                    <div>
                      <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: 'JetBrains Mono, monospace' }}>
                        Me Gusta Totales
                      </span>
                      <p style={{ fontFamily: 'Cinzel, serif', fontWeight: 800, fontSize: 32, color: 'white', margin: '2px 0 0' }}>
                        {stats.likes.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Comentarios: solo lo que dicen */}
                <div style={{
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 16, padding: '24px',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
                    <MessageSquare size={18} color="#34D399" />
                    <h3 style={{ fontFamily: 'Cinzel, serif', fontSize: 16, fontWeight: 700, margin: 0, color: 'white' }}>
                      Mensajes y Dedicatorias de la Comunidad ({comentarios.length})
                    </h3>
                  </div>

                  {comentarios.length === 0 ? (
                    <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', margin: 0 }}>
                      Aún no hay comentarios publicados en el libro de recuerdos.
                    </p>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                      {comentarios.map(c => (
                        <div key={c.id} style={{
                          padding: '14px 16px', borderRadius: 12,
                          background: 'rgba(255,255,255,0.03)',
                          border: '1px solid rgba(255,255,255,0.06)',
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                            <strong style={{ fontSize: 13, color: '#F97316' }}>{c.nombre || 'Visitante'}</strong>
                            <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', fontFamily: 'JetBrains Mono, monospace' }}>
                              {new Date(c.created_at).toLocaleDateString('es-MX', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)', margin: 0, lineHeight: 1.5 }}>
                            {c.mensaje}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        )}
      </main>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
