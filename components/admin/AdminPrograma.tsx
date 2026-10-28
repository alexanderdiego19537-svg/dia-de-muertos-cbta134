'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Plus, Trash2, Save, Loader2, GripVertical } from 'lucide-react';

interface Actividad {
  id?: string;
  orden: number;
  hora: string;
  titulo: string;
  descripcion: string;
  emoji: string;
}

const EMPTY: Omit<Actividad, 'id'> = { orden: 0, hora: '09:00', titulo: '', descripcion: '', emoji: '🎭' };

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '9px 12px',
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: 8, color: 'white', fontSize: 13,
  outline: 'none', boxSizing: 'border-box',
  fontFamily: 'Inter, sans-serif',
};

export default function AdminPrograma() {
  const supabase = createClient();
  const [items, setItems]     = useState<Actividad[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from('programa')
        .select('*')
        .order('orden', { ascending: true });
      if (data) setItems(data);
      setLoading(false);
    }
    load();
  }, []);

  async function handleSave(item: Actividad) {
    setSaving(item.id ?? 'new');
    const { id, ...rest } = item;
    rest.orden = items.indexOf(item);

    let error;
    if (id) {
      ({ error } = await supabase.from('programa').update(rest).eq('id', id));
    } else {
      const { data: inserted, error: e } = await supabase.from('programa').insert(rest).select().single();
      error = e;
      if (inserted) {
        setItems(prev => prev.map(i => i === item ? inserted : i));
      }
    }
    setSaving(null);
    if (error) alert('Error al guardar: ' + error.message);
  }

  async function handleDelete(item: Actividad) {
    if (!item.id) { setItems(prev => prev.filter(i => i !== item)); return; }
    setDeleting(item.id);
    await supabase.from('programa').delete().eq('id', item.id);
    setDeleting(null);
    setItems(prev => prev.filter(i => i.id !== item.id));
  }

  function addNew() {
    setItems(prev => [...prev, { ...EMPTY, orden: prev.length }]);
  }

  function update(index: number, field: keyof Actividad, value: string | number) {
    setItems(prev => prev.map((item, i) => i === index ? { ...item, [field]: value } : item));
  }

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}>
      <Loader2 size={24} style={{ color: '#F97316', animation: 'spin 1s linear infinite' }} />
      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  return (
    <div style={{ maxWidth: 700, margin: '0 auto' }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontFamily: 'Cinzel, serif', fontWeight: 900, fontSize: 22, color: 'white', margin: '0 0 6px' }}>
          📅 Programa del Evento
        </h1>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', margin: 0 }}>
          Edita, agrega o elimina actividades. Se actualizan en la sección Programa del sitio.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 16 }}>
        {items.map((item, i) => (
          <div key={item.id ?? i} style={{
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: 12, padding: 16,
            display: 'flex', gap: 12, alignItems: 'flex-start',
          }}>
            <GripVertical size={16} style={{ color: 'rgba(255,255,255,0.2)', marginTop: 10, flexShrink: 0 }} />

            <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '60px 60px 1fr', gap: 8 }}>
              {/* Emoji */}
              <input
                style={{ ...inputStyle, textAlign: 'center', fontSize: 20, padding: '6px 4px' }}
                value={item.emoji} maxLength={2}
                onChange={e => update(i, 'emoji', e.target.value)}
                title="Emoji"
              />
              {/* Hora */}
              <input
                type="time" style={inputStyle} value={item.hora}
                onChange={e => update(i, 'hora', e.target.value)}
              />
              {/* Título */}
              <input
                style={inputStyle} value={item.titulo} placeholder="Nombre de la actividad"
                onChange={e => update(i, 'titulo', e.target.value)}
              />
              {/* Descripción (span completo) */}
              <textarea
                rows={2}
                style={{ ...inputStyle, gridColumn: '1 / -1', resize: 'vertical' }}
                value={item.descripcion}
                placeholder="Descripción breve (opcional)"
                onChange={e => update(i, 'descripcion', e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flexShrink: 0 }}>
              {/* Guardar */}
              <button
                onClick={() => handleSave(item)}
                disabled={saving === (item.id ?? 'new')}
                title="Guardar"
                style={{
                  width: 32, height: 32, borderRadius: 8, border: 'none',
                  background: 'rgba(249,115,22,0.15)', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                {saving === (item.id ?? 'new')
                  ? <Loader2 size={14} style={{ color: '#F97316', animation: 'spin 1s linear infinite' }} />
                  : <Save size={14} style={{ color: '#F97316' }} />}
              </button>
              {/* Eliminar */}
              <button
                onClick={() => handleDelete(item)}
                disabled={deleting === item.id}
                title="Eliminar"
                style={{
                  width: 32, height: 32, borderRadius: 8, border: 'none',
                  background: 'rgba(220,38,38,0.1)', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                {deleting === item.id
                  ? <Loader2 size={14} style={{ color: '#F87171', animation: 'spin 1s linear infinite' }} />
                  : <Trash2 size={14} style={{ color: '#F87171' }} />}
              </button>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={addNew}
        style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '11px 18px', borderRadius: 10,
          background: 'rgba(249,115,22,0.1)',
          border: '1px dashed rgba(249,115,22,0.3)',
          color: '#F97316', cursor: 'pointer',
          fontFamily: 'Inter, sans-serif', fontSize: 13, fontWeight: 600,
        }}
      >
        <Plus size={16} /> Agregar actividad
      </button>
      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
