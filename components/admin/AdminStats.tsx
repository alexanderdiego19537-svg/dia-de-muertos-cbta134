'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Eye, Heart, Images, Megaphone, MessageSquare, Loader2, RefreshCw, Smartphone, Radio } from 'lucide-react';

interface Stats {
  total_views: number;
  total_likes: number;
  total_images: number;
  total_anuncios: number;
  total_comentarios: number;
}

interface VisitRecord {
  id: string;
  pagina: string;
  created_at: string;
}

function StatCard({ icon: Icon, label, value, color }: {
  icon: React.ElementType; label: string; value: number | string; color: string;
}) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.02)',
      border: '1px solid rgba(255,255,255,0.07)',
      borderRadius: 14, padding: '20px 22px',
      display: 'flex', alignItems: 'center', gap: 16,
      transition: 'border-color 0.2s',
    }}>
      <div style={{
        width: 44, height: 44, borderRadius: 12,
        background: `${color}15`,
        border: `1px solid ${color}30`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}>
        <Icon size={20} style={{ color }} />
      </div>
      <div>
        <p style={{ fontSize: 26, fontWeight: 800, color: 'white', margin: 0, fontFamily: 'Cinzel, serif' }}>
          {typeof value === 'number' ? value.toLocaleString() : value}
        </p>
        <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', margin: '2px 0 0' }}>{label}</p>
      </div>
    </div>
  );
}

export default function AdminStats() {
  const supabase = createClient();
  const [stats, setStats]                 = useState<Stats | null>(null);
  const [recentVisits, setRecentVisits]   = useState<VisitRecord[]>([]);
  const [loading, setLoading]             = useState(true);
  const [refreshing, setRefreshing]       = useState(false);
  const [realtimeConnected, setRealtimeConnected] = useState(false);

  const loadData = useCallback(async (isManual = false) => {
    if (isManual) setRefreshing(true);
    try {
      const [views, likes, images, anuncios, comentarios, visitsList] = await Promise.all([
        supabase.from('visitas').select('*', { count: 'exact', head: true }),
        supabase.from('likes').select('*', { count: 'exact', head: true }),
        supabase.from('gallery').select('*', { count: 'exact', head: true }),
        supabase.from('anuncios').select('*', { count: 'exact', head: true }).eq('activo', true),
        supabase.from('comentarios').select('*', { count: 'exact', head: true }),
        supabase.from('visitas').select('*').order('created_at', { ascending: false }).limit(10),
      ]);

      setStats({
        total_views:       views.count       ?? 0,
        total_likes:       likes.count       ?? 0,
        total_images:      images.count      ?? 0,
        total_anuncios:    anuncios.count    ?? 0,
        total_comentarios: comentarios.count ?? 0,
      });

      if (visitsList.data) {
        setRecentVisits(visitsList.data);
      }
    } catch (err) {
      console.error('Error loading stats:', err);
    } finally {
      setLoading(false);
      if (isManual) setTimeout(() => setRefreshing(false), 500);
    }
  }, [supabase]);

  // Sincronización en tiempo real + WebSockets
  useEffect(() => {
    loadData();

    const channel = supabase.channel('cbta134_stats_sync')
      .on('broadcast', { event: 'visit_logged' }, () => {
        loadData();
      })
      .on('broadcast', { event: 'like_toggled' }, () => {
        loadData();
      })
      .on('broadcast', { event: 'comment_added' }, () => {
        loadData();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'visitas' }, () => {
        loadData();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'likes' }, () => {
        loadData();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'comentarios' }, () => {
        loadData();
      })
      .subscribe(status => {
        if (status === 'SUBSCRIBED') {
          setRealtimeConnected(true);
        }
      });

    // Actualizar cuando la pestaña vuelve a tener foco
    const handleFocus = () => loadData();
    window.addEventListener('focus', handleFocus);

    // Polling ligero cada 10 segundos
    const interval = setInterval(() => loadData(), 10000);

    return () => {
      supabase.removeChannel(channel);
      window.removeEventListener('focus', handleFocus);
      clearInterval(interval);
    };
  }, [loadData, supabase]);

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}>
      <Loader2 size={24} style={{ color: '#F97316', animation: 'spin 1s linear infinite' }} />
      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  return (
    <div style={{ maxWidth: 880, margin: '0 auto' }}>
      {/* Encabezado con estado en vivo y botón de refrescar */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
        marginBottom: 24,
      }}>
        <div>
          <h1 style={{ fontFamily: 'Cinzel, serif', fontWeight: 900, fontSize: 22, color: 'white', margin: '0 0 6px' }}>
            📊 Métricas en Tiempo Real (100% Reales)
          </h1>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', margin: 0 }}>
            Visitas únicas reales por dispositivo físico. No se duplican al refrescar la página.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {/* Badge en vivo */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '6px 12px', borderRadius: 999,
            background: realtimeConnected ? 'rgba(34,197,94,0.1)' : 'rgba(234,179,8,0.1)',
            border: realtimeConnected ? '1px solid rgba(34,197,94,0.3)' : '1px solid rgba(234,179,8,0.3)',
            fontSize: 11,
            color: realtimeConnected ? '#4ADE80' : '#FBBF24',
            fontFamily: 'JetBrains Mono, monospace',
          }}>
            <Radio size={12} style={{ animation: realtimeConnected ? 'pulse 2s infinite' : 'none' }} />
            <span>{realtimeConnected ? 'En vivo' : 'Conectando...'}</span>
          </div>

          {/* Botón refrescar */}
          <button
            onClick={() => loadData(true)}
            disabled={refreshing}
            title="Refrescar datos de Supabase"
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '6px 14px', borderRadius: 8,
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.12)',
              color: 'white', cursor: 'pointer',
              fontSize: 12, fontFamily: 'Inter, sans-serif',
            }}
          >
            <RefreshCw size={13} style={{ animation: refreshing ? 'spin 1s linear infinite' : 'none' }} />
            <span>{refreshing ? 'Actualizando...' : 'Actualizar'}</span>
          </button>
        </div>
      </div>

      {/* Grid de tarjetas principales */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
        gap: 14,
        marginBottom: 28,
      }}>
        <StatCard icon={Eye}           label="Dispositivos únicos (Visitas)"  value={stats?.total_views ?? 0}       color="#60A5FA" />
        <StatCard icon={Heart}         label="Likes recibidos"               value={stats?.total_likes ?? 0}       color="#F87171" />
        <StatCard icon={Images}        label="Fotos en galería"              value={stats?.total_images ?? 0}      color="#F97316" />
        <StatCard icon={MessageSquare} label="Comentarios publicados"        value={stats?.total_comentarios ?? 0} color="#34D399" />
        <StatCard icon={Megaphone}     label="Anuncios activos"              value={stats?.total_anuncios ?? 0}    color="#FBBF24" />
      </div>

      {/* Tabla de registros de visitas únicas */}
      <div style={{
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 14,
        padding: '20px 24px',
        marginBottom: 24,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Smartphone size={18} color="#60A5FA" />
            <h2 style={{ fontFamily: 'Cinzel, serif', fontSize: 16, fontWeight: 700, color: 'white', margin: 0 }}>
              Registro de Dispositivos Físicos Únicos
            </h2>
          </div>
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', fontFamily: 'JetBrains Mono, monospace' }}>
            Últimos {recentVisits.length} dispositivos
          </span>
        </div>

        {recentVisits.length === 0 ? (
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', margin: 0 }}>
            Aún no hay visitas registradas.
          </p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', textAlign: 'left', color: 'rgba(255,255,255,0.4)' }}>
                  <th style={{ padding: '8px 12px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 500 }}>ID del Dispositivo</th>
                  <th style={{ padding: '8px 12px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 500 }}>Página</th>
                  <th style={{ padding: '8px 12px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 500 }}>Fecha / Hora</th>
                  <th style={{ padding: '8px 12px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 500, textAlign: 'right' }}>Estado</th>
                </tr>
              </thead>
              <tbody>
                {recentVisits.map((v) => (
                  <tr key={v.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <td style={{ padding: '10px 12px', fontFamily: 'JetBrains Mono, monospace', color: '#93C5FD' }}>
                      {v.id.substring(0, 16)}...
                    </td>
                    <td style={{ padding: '10px 12px', color: 'rgba(255,255,255,0.8)' }}>
                      {v.pagina || 'home'}
                    </td>
                    <td style={{ padding: '10px 12px', color: 'rgba(255,255,255,0.5)' }}>
                      {new Date(v.created_at).toLocaleString('es-MX', {
                        day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit', second: '2-digit'
                      })}
                    </td>
                    <td style={{ padding: '10px 12px', textAlign: 'right' }}>
                      <span style={{
                        padding: '3px 8px', borderRadius: 999,
                        background: 'rgba(34,197,94,0.1)',
                        border: '1px solid rgba(34,197,94,0.25)',
                        color: '#4ADE80', fontSize: 10,
                        fontFamily: 'JetBrains Mono, monospace',
                      }}>
                        Único ✓
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Nota explicativa de protección contra visitas falsas */}
      <div style={{
        background: 'rgba(249,115,22,0.06)',
        border: '1px solid rgba(249,115,22,0.15)',
        borderRadius: 12, padding: '16px 20px',
      }}>
        <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', margin: 0, lineHeight: 1.6 }}>
          🔒 <strong style={{ color: '#F97316' }}>Protección de Visitas Reales Activada:</strong> Cada dispositivo genera una clave UUID única en su almacenamiento local. Si un usuario refresca la página, navega entre secciones o cierra y abre el navegador, su visita ya está registrada y <strong>no se vuelve a sumar</strong>. La base de datos de PostgreSQL cuenta con clave primaria estricta que rechaza cualquier registro duplicado.
        </p>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
      `}</style>
    </div>
  );
}
