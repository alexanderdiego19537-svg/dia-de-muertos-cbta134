'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Plus, Trash2, Save, Loader2 } from 'lucide-react';

interface Anuncio {
  id?: string;
  titulo: string;
  cuerpo: string;
  tipo: 'info' | 'aviso' | 'urgente';
  activo: boolean;
  created_at?: string;
}

const EMPTY: Omit<Anuncio, 'id' | 'created_at'> = {
  titulo: '', cuerpo: '', tipo: 'info', activo: true,
};

const TIPO_COLOR: Record<string, string> = {
  info: '#60A5FA', aviso: '#FBBF24', urgente: '#F87171',
};

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '10px 13px',
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: 9, color: 'white', fontSize: 13,
  outline: 'none', boxSizing: 'border-box',
  fontFamily: 'Inter, sans-serif',
};

export default function AdminAnuncios() {
  const supabase = createClient();
  const [items, setItems]     = useState<Anuncio[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from('anuncios')
        .select('*')
        .order('created_at', { ascending: false });
      if (data) setItems(data);
      setLoading(false);
    }
    load();
  }, []);

  async function handleSave(item: Anuncio) {
    setSaving(item.id ?? 'new');
    const { id, created_at, ...rest } = item;
    let error;
    if (id) {
      ({ error } = await supabase.from('anuncios').update(rest).eq('id', id));
    } else {
      const { data: inserted, error: e } = await supabase.from('anuncios').insert(rest).select().single();
      error = e;
      if (inserted) setItems(prev => prev.map(i => i === item ? inserted : i));
    }
    setSaving(null);
    if (error) alert('Error: ' + error.message);
  }

  async function handleDelete(item: Anuncio) {
    if (!item.id) { setItems(prev => prev.filter(i => i !== item)); return; }
    await supabase.from('anuncios').delete().eq('id', item.id);
    setItems(prev => prev.filter(i => i.id !== item.id));
  }

  function update<K extends keyof Anuncio>(index: number, field: K, value: Anuncio[K]) {
    setItems(prev => prev.map((item, i) => i === index ? { ...item, [field]: value } : item));
  }

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}>
    <Loader2 size={24} style={{ color: '#F97316', animation: 'spin 1s linear infinite' }} />
    <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
  </div>;

  return (
    <div style={{ maxWidth: 700, margin: '0 auto' }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontFamily: 'Cinzel, serif', fontWeight: 900, fontSize: 22, color: 'white', margin: '0 0 6px' }}>
          📢 Anuncios
        </h1>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', margin: 0 }}>
          Los anuncios activos aparecen en la página principal del sitio.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 16 }}>
        {items.map((item, i) => (
          <div key={item.id ?? i} style={{
            background: 'rgba(255,255,255,0.02)',
            border: `1px solid ${item.activo ? TIPO_COLOR[item.tipo] + '30' : 'rgba(255,255,255,0.07)'}`,
            borderRadius: 12, padding: 16,
            opacity: item.activo ? 1 : 0.5,
          }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', gap: 10, marginBottom: 10, alignItems: 'center' }}>
              {/* Título */}
              <input style={inputStyle} value={item.titulo} placeholder="Título del anuncio"
                onChange={e => update(i, 'titulo', e.target.value)} />

              {/* Tipo */}
              <select
                value={item.tipo}
                onChange={e => update(i, 'tipo', e.target.value as Anuncio['tipo'])}
                style={{ ...inputStyle, width: 'auto', padding: '10px 10px', cursor: 'pointer' }}
              >
                <option value="info">ℹ️ Info</option>
                <option value="aviso">⚠️ Aviso</option>
                <option value="urgente">🔴 Urgente</option>
              </select>

              {/* Activo toggle */}
              <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', userSelect: 'none' }}>
                <div
                  onClick={() => update(i, 'activo', !item.activo)}
                  style={{
                    width: 36, height: 20, borderRadius: 999,
                    background: item.activo ? '#F97316' : 'rgba(255,255,255,0.1)',
                    position: 'relative', transition: 'background 0.2s', cursor: 'pointer',
                    flexShrink: 0,
                  }}
                >
                  <div style={{
                    width: 16, height: 16, borderRadius: '50%', background: 'white',
                    position: 'absolute', top: 2,
                    left: item.activo ? 18 : 2,
                    transition: 'left 0.2s',
                  }} />
                </div>
                <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>
                  {item.activo ? 'Activo' : 'Oculto'}
                </span>
              </label>
            </div>

            {/* Cuerpo */}
            <textarea
              rows={2}
              style={{ ...inputStyle, resize: 'vertical', marginBottom: 10 }}
              value={item.cuerpo}
              placeholder="Texto del anuncio..."
              onChange={e => update(i, 'cuerpo', e.target.value)}
            />

            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <button onClick={() => handleSave(item)} disabled={saving === (item.id ?? 'new')}
                style={{ display:'flex', alignItems:'center', gap:6, padding:'7px 14px', borderRadius:8, border:'none', background:'rgba(249,115,22,0.15)', color:'#F97316', cursor:'pointer', fontSize:12, fontFamily:'Inter, sans-serif' }}>
                {saving === (item.id ?? 'new') ? <Loader2 size={13} style={{ animation:'spin 1s linear infinite' }}/> : <Save size={13}/>}
                Guardar
              </button>
              <button onClick={() => handleDelete(item)}
                style={{ display:'flex', alignItems:'center', gap:6, padding:'7px 14px', borderRadius:8, border:'none', background:'rgba(220,38,38,0.1)', color:'#F87171', cursor:'pointer', fontSize:12, fontFamily:'Inter, sans-serif' }}>
                <Trash2 size={13}/> Eliminar
              </button>
            </div>
          </div>
        ))}

        {items.length === 0 && (
          <div style={{ textAlign: 'center', padding: 32, color: 'rgba(255,255,255,0.25)', fontSize: 14 }}>
            No hay anuncios. ¡Crea el primero!
          </div>
        )}
      </div>

      <button onClick={() => setItems(prev => [{ ...EMPTY }, ...prev])}
        style={{ display:'flex', alignItems:'center', gap:8, padding:'11px 18px', borderRadius:10, background:'rgba(249,115,22,0.1)', border:'1px dashed rgba(249,115,22,0.3)', color:'#F97316', cursor:'pointer', fontFamily:'Inter, sans-serif', fontSize:13, fontWeight:600 }}>
        <Plus size={16}/> Nuevo anuncio
      </button>

      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
