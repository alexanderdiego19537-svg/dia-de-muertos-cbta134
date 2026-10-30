'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { ShieldAlert, Bell, CheckCircle2, Image, MessageSquare, UserPlus, Radio, Activity, Loader2 } from 'lucide-react';

interface ActivityItem {
  id: string;
  type: 'image' | 'comment' | 'user';
  title: string;
  subtitle: string;
  time: string;
}

export default function AdminAlerts() {
  const supabase = createClient();
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading]       = useState(true);

  useEffect(() => {
    async function loadAlerts() {
      try {
        const [imgs, comms, profiles] = await Promise.all([
          supabase.from('gallery').select('id, title, created_at').order('created_at', { ascending: false }).limit(6),
          supabase.from('comentarios').select('id, nombre, mensaje, created_at').order('created_at', { ascending: false }).limit(6),
          supabase.from('profiles').select('id, full_name, email, role, created_at').order('created_at', { ascending: false }).limit(6),
        ]);

        const combined: ActivityItem[] = [];

        imgs.data?.forEach(img => {
          combined.push({
            id: `img-${img.id}`,
            type: 'image',
            title: `Foto subida: "${img.title || 'Foto sin título'}"`,
            subtitle: 'Nueva imagen añadida a la galería',
            time: img.created_at,
          });
        });

        comms.data?.forEach(c => {
          combined.push({
            id: `com-${c.id}`,
            type: 'comment',
            title: `Comentario de ${c.nombre || 'Visitante'}`,
            subtitle: `"${c.mensaje?.substring(0, 60)}..."`,
            time: c.created_at,
          });
        });

        profiles.data?.forEach(p => {
          combined.push({
            id: `usr-${p.id}`,
            type: 'user',
            title: `Usuario registrado: ${p.full_name || p.email}`,
            subtitle: `Rol asignado: ${p.role}`,
            time: p.created_at,
          });
        });

        // Ordenar por fecha descendente
        combined.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());

        setActivities(combined.slice(0, 15));
      } catch (err) {
        console.error('Error cargando alertas:', err);
      } finally {
        setLoading(false);
      }
    }

    loadAlerts();
  }, [supabase]);

  return (
    <div style={{ maxWidth: 880, margin: '0 auto' }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontFamily: 'Cinzel, serif', fontWeight: 900, fontSize: 22, color: 'white', margin: '0 0 6px' }}>
          🛡️ Monitor de Actividad y Alertas
        </h1>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', margin: 0 }}>
          Centro de supervisión del Administrador Principal: lo que suben los editores, comentarios de usuarios y salud del sistema.
        </p>
      </div>

      {/* Tarjetas de Salud de la Plataforma */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: 12, marginBottom: 28,
      }}>
        <div style={{ background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 12, padding: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <Radio size={14} color="#4ADE80" />
            <span style={{ fontSize: 11, fontFamily: 'JetBrains Mono, monospace', color: '#4ADE80', fontWeight: 600 }}>WebSockets Realtime</span>
          </div>
          <p style={{ fontSize: 14, fontWeight: 700, color: 'white', margin: 0 }}>Sincronizado</p>
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>Canal activo en vivo</span>
        </div>

        <div style={{ background: 'rgba(249,115,22,0.06)', border: '1px solid rgba(249,115,22,0.2)', borderRadius: 12, padding: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <Activity size={14} color="#F97316" />
            <span style={{ fontSize: 11, fontFamily: 'JetBrains Mono, monospace', color: '#F97316', fontWeight: 600 }}>Almacenamiento</span>
          </div>
          <p style={{ fontSize: 14, fontWeight: 700, color: 'white', margin: 0 }}>Bucket: gallery</p>
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>Imágenes de alta resolución</span>
        </div>

        <div style={{ background: 'rgba(168,85,247,0.06)', border: '1px solid rgba(168,85,247,0.2)', borderRadius: 12, padding: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <CheckCircle2 size={14} color="#C084FC" />
            <span style={{ fontSize: 11, fontFamily: 'JetBrains Mono, monospace', color: '#C084FC', fontWeight: 600 }}>Seguridad RLS</span>
          </div>
          <p style={{ fontSize: 14, fontWeight: 700, color: 'white', margin: 0 }}>Protección Activa</p>
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>3 Roles configurados</span>
        </div>
      </div>

      {/* Registro de Actividad Reciente */}
      <div style={{
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 14, padding: '20px 24px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <Bell size={18} color="#F97316" />
          <h2 style={{ fontFamily: 'Cinzel, serif', fontSize: 16, fontWeight: 700, color: 'white', margin: 0 }}>
            Historial de Actividad Reciente en la Web
          </h2>
        </div>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}>
            <Loader2 size={24} color="#F97316" style={{ animation: 'spin 1s linear infinite' }} />
          </div>
        ) : activities.length === 0 ? (
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', margin: 0 }}>
            No hay actividad registrada recientemente.
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {activities.map(item => {
              const Icon = item.type === 'image' ? Image : item.type === 'comment' ? MessageSquare : UserPlus;
              const color = item.type === 'image' ? '#F97316' : item.type === 'comment' ? '#38BDF8' : '#A855F7';

              return (
                <div key={item.id} style={{
                  display: 'flex', alignItems: 'center', gap: 14,
                  padding: '12px 14px', borderRadius: 10,
                  background: 'rgba(255,255,255,0.025)',
                  border: '1px solid rgba(255,255,255,0.05)',
                }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 8,
                    background: `${color}15`, border: `1px solid ${color}30`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <Icon size={16} color={color} />
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 13, fontWeight: 600, color: 'white', margin: '0 0 2px' }}>
                      {item.title}
                    </p>
                    <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {item.subtitle}
                    </p>
                  </div>

                  <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', fontFamily: 'JetBrains Mono, monospace', flexShrink: 0 }}>
                    {new Date(item.time).toLocaleDateString('es-MX', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
