'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { MessageSquare, Trash2, Check, X, Loader2, User } from 'lucide-react';

interface Comentario {
  id: string;
  nombre: string;
  mensaje: string;
  aprobado: boolean;
  created_at: string;
}

export default function AdminComentarios() {
  const supabase = createClient();
  const [items, setItems]       = useState<Comentario[]>([]);
  const [loading, setLoading]   = useState(true);
  const [actionId, setActionId] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    const { data } = await supabase
      .from('comentarios')
      .select('*')
      .order('created_at', { ascending: false });

    if (data) setItems(data);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function toggleAprobado(item: Comentario) {
    setActionId(item.id);
    const nuevoEstado = !item.aprobado;

    const { error } = await supabase
      .from('comentarios')
      .update({ aprobado: nuevoEstado })
      .eq('id', item.id);

    if (!error) {
      setItems(prev => prev.map(c => c.id === item.id ? { ...c, aprobado: nuevoEstado } : c));
    } else {
      alert('Error al actualizar: ' + error.message);
    }
    setActionId(null);
  }

  async function handleDelete(id: string) {
    if (!confirm('¿Seguro que deseas eliminar este comentario?')) return;
    setActionId(id);

    const { error } = await supabase
      .from('comentarios')
      .delete()
      .eq('id', id);

    if (!error) {
      setItems(prev => prev.filter(c => c.id !== id));
    } else {
      alert('Error al eliminar: ' + error.message);
    }
    setActionId(null);
  }

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}>
      <Loader2 size={24} style={{ color: '#F97316', animation: 'spin 1s linear infinite' }} />
      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  return (
    <div style={{ maxWidth: 850, margin: '0 auto' }}>
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontFamily: 'Cinzel, serif', fontWeight: 900, fontSize: 22, color: 'white', margin: '0 0 6px' }}>
            💬 Muro de Comentarios ({items.length})
          </h1>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', margin: 0 }}>
            Revisa, aprueba, oculta o elimina las dedicatorias enviadas por los visitantes.
          </p>
        </div>
        <button
          onClick={load}
          style={{
            padding: '8px 14px', borderRadius: 8,
            background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
            color: 'white', cursor: 'pointer', fontSize: 12, fontFamily: 'JetBrains Mono, monospace',
          }}
        >
          ↻ Actualizar
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {items.map(item => {
          const dateStr = new Date(item.created_at).toLocaleDateString('es-MX', {
            day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
          });

          return (
            <div
              key={item.id}
              style={{
                padding: '18px 20px',
                borderRadius: 14,
                background: 'rgba(255,255,255,0.02)',
                border: `1px solid ${item.aprobado ? 'rgba(255,255,255,0.07)' : 'rgba(248,113,113,0.3)'}`,
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
                gap: 14,
                alignItems: 'center',
              }}
            >
              <div style={{ flex: 1, minWidth: 260 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: '50%',
                    background: 'rgba(249,115,22,0.12)', border: '1px solid rgba(249,115,22,0.3)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <User size={14} color="#F97316" />
                  </div>
                  <strong style={{ fontSize: 14, color: 'white' }}>{item.nombre}</strong>
                  <span style={{
                    fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: 'rgba(255,255,255,0.35)',
                  }}>
                    {dateStr}
                  </span>
                  <span style={{
                    fontFamily: 'JetBrains Mono, monospace', fontSize: 10,
                    padding: '2px 8px', borderRadius: 999,
                    background: item.aprobado ? 'rgba(16,185,129,0.15)' : 'rgba(248,113,113,0.15)',
                    color: item.aprobado ? '#34D399' : '#F87171',
                    border: `1px solid ${item.aprobado ? 'rgba(16,185,129,0.3)' : 'rgba(248,113,113,0.3)'}`,
                  }}>
                    {item.aprobado ? 'Visible' : 'Oculto'}
                  </span>
                </div>
                <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.75)', margin: 0, lineHeight: 1.6 }}>
                  {item.mensaje}
                </p>
              </div>

              {/* Botones de acción */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <button
                  onClick={() => toggleAprobado(item)}
                  disabled={actionId === item.id}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    padding: '7px 12px', borderRadius: 8,
                    background: item.aprobado ? 'rgba(255,255,255,0.05)' : 'rgba(16,185,129,0.15)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: item.aprobado ? 'rgba(255,255,255,0.7)' : '#34D399',
                    cursor: 'pointer', fontSize: 12,
                  }}
                >
                  {item.aprobado ? <X size={14} /> : <Check size={14} />}
                  <span>{item.aprobado ? 'Ocultar' : 'Aprobar'}</span>
                </button>

                <button
                  onClick={() => handleDelete(item.id)}
                  disabled={actionId === item.id}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    padding: '7px 12px', borderRadius: 8,
                    background: 'rgba(220,38,38,0.1)', border: '1px solid rgba(220,38,38,0.2)',
                    color: '#F87171', cursor: 'pointer', fontSize: 12,
                  }}
                >
                  <Trash2 size={14} />
                  <span>Eliminar</span>
                </button>
              </div>
            </div>
          );
        })}

        {items.length === 0 && (
          <div style={{
            textAlign: 'center', padding: 48, borderRadius: 14,
            background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)',
            color: 'rgba(255,255,255,0.3)', fontSize: 14,
          }}>
            Aún no hay comentarios en la base de datos.
          </div>
        )}
      </div>
    </div>
  );
}
