'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Plus, Trash2, Save, Loader2, GripVertical, MapPin } from 'lucide-react';

interface Actividad {
  id?: string;
  orden: number;
  hora: string;
  titulo: string;
  descripcion: string;
  lugar?: string;
  visible?: boolean;
}

const EMPTY: Omit<Actividad, 'id'> = {
  orden: 0,
  hora: '09:00',
  titulo: '',
  descripcion: '',
  lugar: 'Auditorio de Aquiahuac',
  visible: true,
};

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
    if (!item.titulo.trim()) {
      alert('Por favor escribe un título para la actividad');
      return;
    }

    setSaving(item.id ?? 'new');
    const { id, ...rest } = item;
    rest.orden = items.indexOf(item);
    if (rest.visible === undefined) rest.visible = true;

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
    if (error) {
      alert('Error al guardar: ' + error.message);
    } else {
      alert('Actividad guardada en el programa ✓');
    }
  }

  async function handleDelete(item: Actividad) {
    if (!confirm('¿Deseas eliminar esta actividad del programa?')) return;
    if (!item.id) { setItems(prev => prev.filter(i => i !== item)); return; }
    setDeleting(item.id);
    await supabase.from('programa').delete().eq('id', item.id);
    setDeleting(null);
    setItems(prev => prev.filter(i => i.id !== item.id));
  }

  function addNew() {
    setItems(prev => [...prev, { ...EMPTY, orden: prev.length }]);
  }

  function update(index: number, field: keyof Actividad, value: string | number | boolean) {
    setItems(prev => prev.map((item, i) => i === index ? { ...item, [field]: value } : item));
  }

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
          📅 Programa de Actividades (Supabase)
        </h1>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', margin: 0 }}>
          Edita los horarios y actividades oficiales. Se actualizan en la sección Programa del sitio.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 20 }}>
        {items.map((item, i) => (
          <div key={item.id ?? i} style={{
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: 14, padding: 18,
            display: 'flex', gap: 12, alignItems: 'flex-start',
          }}>
            <GripVertical size={16} style={{ color: 'rgba(255,255,255,0.2)', marginTop: 10, flexShrink: 0 }} />

            <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '120px 1fr 1fr', gap: 10 }}>
              {/* Hora */}
              <div>
                <label style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', display: 'block', marginBottom: 4 }}>
                  HORA
                </label>
                <input
                  style={inputStyle}
                  value={item.hora}
                  placeholder="8:00 AM"
                  onChange={e => update(i, 'hora', e.target.value)}
                />
              </div>

              {/* Título */}
              <div>
                <label style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', display: 'block', marginBottom: 4 }}>
                  ACTIVIDAD
                </label>
                <input
                  style={inputStyle}
                  value={item.titulo}
                  placeholder="Ej. Montaje de ofrendas"
                  onChange={e => update(i, 'titulo', e.target.value)}
                />
              </div>

              {/* Lugar */}
              <div>
                <label style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', display: 'block', marginBottom: 4 }}>
                  LUGAR
                </label>
                <input
                  style={inputStyle}
                  value={item.lugar || ''}
                  placeholder="Auditorio de Aquiahuac"
                  onChange={e => update(i, 'lugar', e.target.value)}
                />
              </div>

              {/* Descripción */}
              <div style={{ gridColumn: '1 / -1' }}>
                <textarea
                  rows={2}
                  style={{ ...inputStyle, resize: 'vertical' }}
                  value={item.descripcion || ''}
                  placeholder="Detalles de los grupos, participaciones o descripción..."
                  onChange={e => update(i, 'descripcion', e.target.value)}
                />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flexShrink: 0, marginTop: 18 }}>
              {/* Guardar */}
              <button
                onClick={() => handleSave(item)}
                disabled={saving === (item.id ?? 'new')}
                title="Guardar en base de datos"
                style={{
                  display:'flex', alignItems:'center', justifyContent: 'center', width: 34, height: 34,
                  borderRadius: 8, border: 'none', background: 'rgba(249,115,22,0.15)', color: '#F97316',
                  cursor: 'pointer',
                }}
              >
                {saving === (item.id ?? 'new')
                  ? <Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} />
                  : <Save size={15} />
                }
              </button>

              {/* Eliminar */}
              <button
                onClick={() => handleDelete(item)}
                disabled={deleting === item.id}
                title="Eliminar actividad"
                style={{
                  display:'flex', alignItems:'center', justifyContent: 'center', width: 34, height: 34,
                  borderRadius: 8, border: 'none', background: 'rgba(220,38,38,0.1)', color: '#F87171',
                  cursor: 'pointer',
                }}
              >
                {deleting === item.id
                  ? <Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} />
                  : <Trash2 size={15} />
                }
              </button>
            </div>
          </div>
        ))}

        {items.length === 0 && (
          <div style={{ textAlign: 'center', padding: 32, color: 'rgba(255,255,255,0.3)', fontSize: 13 }}>
            No hay actividades en la base de datos de Supabase.
          </div>
        )}
      </div>

      <button
        onClick={addNew}
        style={{
          display:'flex', alignItems:'center', gap:8, padding:'11px 18px', borderRadius:10,
          background:'rgba(249,115,22,0.1)', border:'1px dashed rgba(249,115,22,0.3)',
          color:'#F97316', cursor:'pointer', fontFamily:'Inter, sans-serif', fontSize:13, fontWeight:600,
        }}
      >
        <Plus size={16}/> Agregar actividad al programa
      </button>

      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
