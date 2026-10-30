'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Images, Film, Calendar, Megaphone, BarChart3, Eye, Heart, MessageSquare, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import AdminGallery from '@/components/admin/AdminGallery';
import AdminVideos from '@/components/admin/AdminVideos';
import AdminPrograma from '@/components/admin/AdminPrograma';
import AdminAnuncios from '@/components/admin/AdminAnuncios';

interface EditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'gallery' | 'videos' | 'programa' | 'anuncios' | 'stats';
  userEmail?: string;
  userName?: string;
}

export default function EditorModal({ isOpen, onClose, initialTab = 'gallery', userEmail, userName }: EditorModalProps) {
  const [tab, setTab] = useState<'gallery' | 'videos' | 'programa' | 'anuncios' | 'stats'>(initialTab);
  const supabase = createClient();

  const [stats, setStats] = useState<{ views: number; likes: number }>({ views: 0, likes: 0 });
  const [comentarios, setComentarios] = useState<any[]>([]);
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    if (initialTab) setTab(initialTab);
  }, [initialTab]);

  useEffect(() => {
    if (!isOpen) return;

    async function loadStats() {
      try {
        const [vRes, lRes, cRes] = await Promise.all([
          supabase.from('visitas').select('*', { count: 'exact', head: true }),
          supabase.from('likes').select('*', { count: 'exact', head: true }),
          supabase.from('comentarios').select('id, nombre, mensaje, created_at').order('created_at', { ascending: false }).limit(25),
        ]);

        setStats({
          views: vRes.count ?? 0,
          likes: lRes.count ?? 0,
        });

        if (cRes.data) setComentarios(cRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingStats(false);
      }
    }

    loadStats();
  }, [isOpen, supabase]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div style={{
        position: 'fixed', inset: 0, zIndex: 100,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '12px',
      }}>
        {/* Backdrop oscuro */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          style={{
            position: 'absolute', inset: 0,
            background: 'rgba(0,0,0,0.85)',
            backdropFilter: 'blur(10px)',
          }}
        />

        {/* Modal contenedor */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2 }}
          style={{
            position: 'relative', zIndex: 1,
            width: '100%', maxWidth: 1020, maxHeight: '92vh',
            backgroundColor: '#09030a',
            border: '1px solid rgba(249,115,22,0.3)',
            borderRadius: 20,
            boxShadow: '0 25px 80px rgba(0,0,0,0.95), 0 0 40px rgba(249,115,22,0.15)',
            display: 'flex', flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          {/* Header estático del modal */}
          <div style={{
            padding: '14px 20px',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            background: 'rgba(18, 8, 18, 0.95)',
            flexShrink: 0,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: 'rgba(249,115,22,0.15)', border: '1px solid rgba(249,115,22,0.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#F97316', fontSize: 16,
              }}>
                ✏️
              </div>
              <div>
                <h2 style={{ fontFamily: 'Cinzel, serif', fontSize: 16, fontWeight: 700, margin: 0, color: 'white' }}>
                  Herramientas de Edición
                </h2>
                <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', margin: 0 }}>
                  Editor: {userName || userEmail || 'Activo'} · CBTA #134
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              style={{
                width: 32, height: 32, borderRadius: '50%',
                background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
                color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', transition: 'background 0.2s',
              }}
            >
              <X size={16} />
            </button>
          </div>

          {/* Barra de Pestañas FIJA (Sticky) */}
          <div style={{
            display: 'flex', gap: 6, padding: '0 16px',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
            background: 'rgba(12, 5, 12, 0.98)',
            overflowX: 'auto',
            flexShrink: 0,
          }}>
            {[
              { id: 'gallery',  label: '📸 Fotos',    icon: Images,    color: '#F97316' },
              { id: 'videos',   label: '🎬 Videos',   icon: Film,      color: '#A855F7' },
              { id: 'programa', label: '📅 Programa', icon: Calendar,  color: '#34D399' },
              { id: 'anuncios', label: '📢 Anuncios', icon: Megaphone, color: '#FBBF24' },
              { id: 'stats',    label: '📊 Métricas', icon: BarChart3,  color: '#60A5FA' },
            ].map(item => {
              const Icon = item.icon;
              const active = tab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setTab(item.id as typeof tab)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    padding: '11px 14px',
                    border: 'none',
                    borderBottom: active ? `2px solid ${item.color}` : '2px solid transparent',
                    background: active ? 'rgba(255,255,255,0.04)' : 'transparent',
                    color: active ? 'white' : 'rgba(255,255,255,0.5)',
                    cursor: 'pointer',
                    fontFamily: 'Inter, sans-serif', fontWeight: active ? 700 : 500,
                    fontSize: 12.5, whiteSpace: 'nowrap',
                    transition: 'all 0.15s',
                  }}
                >
                  <Icon size={14} style={{ color: active ? item.color : 'rgba(255,255,255,0.4)' }} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Cuerpo del modal con scroll independiente y limpio */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '20px clamp(14px, 3vw, 24px)',
            background: 'linear-gradient(180deg, #09030a 0%, #0d040e 100%)',
          }}>
            {tab === 'gallery'  && <AdminGallery />}
            {tab === 'videos'   && <AdminVideos />}
            {tab === 'programa' && <AdminPrograma />}
            {tab === 'anuncios' && <AdminAnuncios />}

            {tab === 'stats' && (
              <div style={{ maxWidth: 760, margin: '0 auto' }}>
                <h3 style={{ fontFamily: 'Cinzel, serif', fontSize: 18, fontWeight: 700, color: 'white', margin: '0 0 16px' }}>
                  Resumen de Visitas y Me Gusta
                </h3>

                {loadingStats ? (
                  <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}>
                    <Loader2 size={24} color="#F97316" style={{ animation: 'spin 1s linear infinite' }} />
                  </div>
                ) : (
                  <>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16, marginBottom: 24 }}>
                      <div style={{
                        background: 'rgba(96,165,250,0.06)', border: '1px solid rgba(96,165,250,0.2)',
                        borderRadius: 14, padding: '18px', display: 'flex', alignItems: 'center', gap: 14,
                      }}>
                        <Eye size={28} color="#60A5FA" />
                        <div>
                          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', fontFamily: 'JetBrains Mono, monospace' }}>
                            Visitas Registradas
                          </span>
                          <p style={{ fontFamily: 'Cinzel, serif', fontWeight: 800, fontSize: 26, color: 'white', margin: '2px 0 0' }}>
                            {stats.views.toLocaleString()}
                          </p>
                        </div>
                      </div>

                      <div style={{
                        background: 'rgba(248,113,113,0.06)', border: '1px solid rgba(248,113,113,0.2)',
                        borderRadius: 14, padding: '18px', display: 'flex', alignItems: 'center', gap: 14,
                      }}>
                        <Heart size={28} color="#F87171" />
                        <div>
                          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', fontFamily: 'JetBrains Mono, monospace' }}>
                            Me Gusta Totales
                          </span>
                          <p style={{ fontFamily: 'Cinzel, serif', fontWeight: 800, fontSize: 26, color: 'white', margin: '2px 0 0' }}>
                            {stats.likes.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div style={{
                      background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)',
                      borderRadius: 14, padding: '18px',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                        <MessageSquare size={16} color="#34D399" />
                        <h4 style={{ fontFamily: 'Cinzel, serif', fontSize: 14, fontWeight: 700, margin: 0, color: 'white' }}>
                          Mensajes recientes de visitantes ({comentarios.length})
                        </h4>
                      </div>

                      {comentarios.length === 0 ? (
                        <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', margin: 0 }}>No hay comentarios aún.</p>
                      ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxHeight: 280, overflowY: 'auto' }}>
                          {comentarios.map(c => (
                            <div key={c.id} style={{
                              padding: '10px 14px', borderRadius: 8,
                              background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.05)',
                            }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                                <strong style={{ fontSize: 12, color: '#F97316' }}>{c.nombre}</strong>
                                <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', fontFamily: 'JetBrains Mono, monospace' }}>
                                  {new Date(c.created_at).toLocaleDateString('es-MX', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                                </span>
                              </div>
                              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.75)', margin: 0 }}>{c.mensaje}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
