'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Eye, Heart, Images, Megaphone, MessageSquare, Loader2 } from 'lucide-react';

interface Stats {
  total_views: number;
  total_likes: number;
  total_images: number;
  total_anuncios: number;
  total_comentarios: number;
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
          {value.toLocaleString()}
        </p>
        <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', margin: '2px 0 0' }}>{label}</p>
      </div>
    </div>
  );
}

export default function AdminStats() {
  const supabase = createClient();
  const [stats, setStats]     = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [views, likes, images, anuncios, comentarios] = await Promise.all([
          supabase.from('visitas').select('*', { count: 'exact', head: true }),
          supabase.from('likes').select('*', { count: 'exact', head: true }),
          supabase.from('gallery').select('*', { count: 'exact', head: true }),
          supabase.from('anuncios').select('*', { count: 'exact', head: true }).eq('activo', true),
          supabase.from('comentarios').select('*', { count: 'exact', head: true }),
        ]);

        setStats({
          total_views:       views.count       ?? 0,
          total_likes:       likes.count       ?? 0,
          total_images:      images.count      ?? 0,
          total_anuncios:    anuncios.count    ?? 0,
          total_comentarios: comentarios.count ?? 0,
        });
      } catch (err) {
        console.error('Error loading stats:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}>
      <Loader2 size={24} style={{ color: '#F97316', animation: 'spin 1s linear infinite' }} />
      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontFamily: 'Cinzel, serif', fontWeight: 900, fontSize: 22, color: 'white', margin: '0 0 6px' }}>
          📊 Estadísticas en Vivo (Supabase)
        </h1>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', margin: 0 }}>
          Métricas y conteos en tiempo real extraídos de tu base de datos de producción.
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
        gap: 14,
        marginBottom: 28,
      }}>
        <StatCard icon={Eye}           label="Visitas registradas"  value={stats?.total_views ?? 0}       color="#60A5FA" />
        <StatCard icon={Heart}         label="Likes recibidos"      value={stats?.total_likes ?? 0}       color="#F87171" />
        <StatCard icon={Images}        label="Fotos en galería"     value={stats?.total_images ?? 0}      color="#F97316" />
        <StatCard icon={MessageSquare} label="Comentarios"          value={stats?.total_comentarios ?? 0} color="#34D399" />
        <StatCard icon={Megaphone}     label="Anuncios activos"     value={stats?.total_anuncios ?? 0}    color="#FBBF24" />
      </div>

      <div style={{
        background: 'rgba(249,115,22,0.06)',
        border: '1px solid rgba(249,115,22,0.12)',
        borderRadius: 12, padding: '16px 20px',
      }}>
        <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', margin: 0, lineHeight: 1.6 }}>
          💡 Las métricas se actualizan de forma continua según la interacción de los visitantes con la plataforma.
        </p>
      </div>
    </div>
  );
}
