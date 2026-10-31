'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Plus, Trash2, Save, Loader2, Megaphone, Eye, EyeOff, CheckCircle, AlertCircle, Sparkles } from 'lucide-react';

interface Anuncio {
  id?: string;
  titulo: string;
  contenido: string;
  activo: boolean;
  created_at?: string;
}

const EMPTY: Omit<Anuncio, 'id' | 'created_at'> = {
  titulo: '',
  contenido: '',
  activo: true,
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px 13px',
  background: 'rgba(255,255,255,0.06)',
  border: '1px solid rgba(255,255,255,0.12)',
  borderRadius: 9,
  color: 'white',
  fontSize: 13,
  outline: 'none',
  boxSizing: 'border-box',
  fontFamily: 'Inter, sans-serif',
};

export default function AdminAnuncios() {
  const supabase = createClient();
  const [items, setItems] = useState<Anuncio[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ type: 'ok' | 'err'; msg: string } | null>(null);

  function showToast(type: 'ok' | 'err', msg: string) {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3800);
  }

  async function loadItems() {
    setLoading(true);
    const { data, error } = await supabase
      .from('anuncios')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setItems(data);
    }
    setLoading(false);
  }

  useEffect(() => {
    loadItems();
  }, []);

  async function handleSave(item: Anuncio) {
    if (!item.titulo.trim()) {
      showToast('err', 'Por favor ingresa un título para el aviso');
      return;
    }

    setSavingId(item.id ?? 'new');
    const { id, created_at, ...rest } = item;
    let error;

    if (id) {
      ({ error } = await supabase.from('anuncios').update(rest).eq('id', id));
    } else {
      const { data: inserted, error: e } = await supabase.from('anuncios').insert(rest).select().single();
      error = e;
      if (inserted) {
        setItems(prev => prev.map(i => (i === item ? inserted : i)));
      }
    }

    setSavingId(null);
    if (error) {
      showToast('err', 'Error al guardar: ' + error.message);
    } else {
      showToast('ok', `Aviso «${item.titulo}» guardado y publicado ✓`);
    }
  }

  async function toggleActivo(item: Anuncio, index: number) {
    const newActivo = !item.activo;
    update(index, 'activo', newActivo);

    if (item.id) {
      const { error } = await supabase.from('anuncios').update({ activo: newActivo }).eq('id', item.id);
      if (error) {
        showToast('err', 'Error al actualizar estado');
      } else {
        showToast('ok', newActivo ? 'Aviso activado (visible en la web) ✓' : 'Aviso desactivado (oculto en la web) ✓');
      }
    }
  }

  async function handleDelete(item: Anuncio) {
    if (!confirm('¿Deseas eliminar este anuncio definitivamente?')) return;
    if (!item.id) {
      setItems(prev => prev.filter(i => i !== item));
      return;
    }

    const { error } = await supabase.from('anuncios').delete().eq('id', item.id);
    if (error) {
      showToast('err', 'Error al eliminar: ' + error.message);
    } else {
      setItems(prev => prev.filter(i => i.id !== item.id));
      showToast('ok', 'Anuncio eliminado');
    }
  }

  // Cargar anuncio de ejemplo
  async function handleLoadSample() {
    setLoading(true);
    const sample = {
      titulo: '🎉 ¡Bienvenidos al Festival Entre la Vida y la Muerte 2026!',
      contenido: 'La salida del desfile inicia puntualmente a las 8:30 AM desde el centro de Tetlanohcan con destino al Auditorio de Aquiahuac. ¡Te esperamos para celebrar juntos nuestras tradiciones!',
      activo: true,
    };

    const { data, error } = await supabase.from('anuncios').insert(sample).select().single();
    setLoading(false);

    if (error) {
      showToast('err', 'Error al cargar ejemplo: ' + error.message);
    } else if (data) {
      setItems(prev => [data, ...prev]);
      showToast('ok', 'Anuncio de bienvenida publicado y visible en el sitio ✓');
    }
  }

  function update(index: number, field: keyof Anuncio, value: string | boolean) {
    setItems(prev => prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)));
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}>
        <Loader2 size={24} style={{ color: '#F97316', animation: 'spin 1s linear infinite' }} />
        <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 860, margin: '0 auto' }}>
      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', top: 20, right: 20, zIndex: 9999,
          padding: '10px 18px', borderRadius: 10,
          background: toast.type === 'ok' ? 'rgba(16, 185, 129, 0.95)' : 'rgba(239, 68, 68, 0.95)',
          color: 'white', fontSize: 13, fontWeight: 600,
          boxShadow: '0 8px 30px rgba(0,0,0,0.6)',
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          {toast.type === 'ok' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
          <span>{toast.msg}</span>
        </div>
      )}

      {/* Cabecera */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: 12, marginBottom: 18, paddingBottom: 16,
        borderBottom: '1px solid rgba(255,255,255,0.08)',
      }}>
        <div>
          <h2 style={{ fontFamily: 'Cinzel, serif', fontWeight: 800, fontSize: 18, color: 'white', margin: 0 }}>
            📢 Avisos y Anuncios Oficiales
          </h2>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', margin: '4px 0 0' }}>
            Los anuncios activos se muestran en la barra superior de todo el sitio y en la página principal.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {items.length === 0 && (
            <button
              onClick={handleLoadSample}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '8px 14px', borderRadius: 8,
                background: 'rgba(251, 191, 36, 0.15)', border: '1px solid rgba(251, 191, 36, 0.35)',
                color: '#FBBF24', fontSize: 12, fontWeight: 700, cursor: 'pointer',
              }}
            >
              <Sparkles size={14} />
              <span>Publicar Aviso de Ejemplo</span>
            </button>
          )}

          <button
            onClick={() => setItems(prev => [{ ...EMPTY }, ...prev])}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '8px 14px', borderRadius: 8,
              background: 'linear-gradient(135deg, #F97316 0%, #EA580C 100%)',
              color: 'white', fontSize: 12, fontWeight: 700, cursor: 'pointer', border: 'none',
              boxShadow: '0 4px 15px rgba(249,115,22,0.3)',
            }}
          >
            <Plus size={15} />
            <span>Nuevo Anuncio</span>
          </button>
        </div>
      </div>

      {/* Explicación visual */}
      <div style={{
        marginBottom: 20, padding: '12px 16px', borderRadius: 12,
        background: 'rgba(249,115,22,0.06)', border: '1px solid rgba(249,115,22,0.25)',
        fontSize: 12, color: 'rgba(255,255,255,0.75)', lineHeight: 1.5,
      }}>
        📍 <strong>¿Dónde se ven los anuncios en la página web?</strong>
        <br />
        1. <strong>Barra de Avisos Superior:</strong> Aparece de forma destacada en la parte superior de todas las páginas del portal.
        <br />
        2. <strong>Tablón de Avisos:</strong> En la sección oficial de anuncios en la página principal y en el programa.
        <br />
        3. Puedes desactivar un aviso sin borrarlo usando el interruptor <strong>Activo / Inactivo</strong>.
      </div>

      {/* Lista de anuncios */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 20 }}>
        {items.map((item, i) => (
          <div
            key={item.id ?? i}
            style={{
              background: item.activo ? 'rgba(255,255,255,0.025)' : 'rgba(255,255,255,0.01)',
              border: item.activo ? '1px solid rgba(251,191,36,0.3)' : '1px dashed rgba(255,255,255,0.08)',
              opacity: item.activo ? 1 : 0.65,
              borderRadius: 14,
              padding: 18,
            }}
          >
            <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 10 }}>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', display: 'block', marginBottom: 4, fontFamily: 'JetBrains Mono, monospace' }}>
                  TÍTULO DEL ANUNCIO O AVISO
                </label>
                <input
                  style={{ ...inputStyle, fontWeight: 700 }}
                  value={item.titulo}
                  placeholder="Ej. Recordatorio importante sobre el desfile de catrinas"
                  onChange={e => update(i, 'titulo', e.target.value)}
                />
              </div>

              {/* Botón estado Activo / Inactivo */}
              <div>
                <label style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', display: 'block', marginBottom: 4, fontFamily: 'JetBrains Mono, monospace' }}>
                  ESTADO
                </label>
                <button
                  type="button"
                  onClick={() => toggleActivo(item, i)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    padding: '9px 12px', borderRadius: 8,
                    background: item.activo ? 'rgba(52,211,153,0.15)' : 'rgba(255,255,255,0.05)',
                    border: item.activo ? '1px solid rgba(52,211,153,0.4)' : '1px solid rgba(255,255,255,0.1)',
                    color: item.activo ? '#34D399' : 'rgba(255,255,255,0.4)',
                    fontSize: 12, fontWeight: 700, cursor: 'pointer',
                  }}
                >
                  {item.activo ? <Eye size={13} /> : <EyeOff size={13} />}
                  <span>{item.activo ? 'Activo (Visible)' : 'Inactivo (Oculto)'}</span>
                </button>
              </div>
            </div>

            {/* Contenido */}
            <div style={{ marginBottom: 12 }}>
              <label style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', display: 'block', marginBottom: 4, fontFamily: 'JetBrains Mono, monospace' }}>
                CONTENIDO DEL COMUNICADO
              </label>
              <textarea
                rows={3}
                style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.5 }}
                value={item.contenido || ''}
                placeholder="Escribe aquí los detalles del aviso, instrucciones para participantes, horarios o recomendaciones..."
                onChange={e => update(i, 'contenido', e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', alignItems: 'center' }}>
              <button
                onClick={() => handleSave(item)}
                disabled={savingId === (item.id ?? 'new')}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '8px 16px', borderRadius: 8,
                  border: 'none', background: 'linear-gradient(135deg, #F97316 0%, #EA580C 100%)',
                  color: 'white', cursor: 'pointer', fontSize: 12, fontWeight: 700,
                  boxShadow: '0 2px 10px rgba(249,115,22,0.3)',
                }}
              >
                {savingId === (item.id ?? 'new') ? (
                  <Loader2 size={13} style={{ animation: 'spin 1s linear infinite' }} />
                ) : (
                  <Save size={13} />
                )}
                <span>Guardar y Publicar</span>
              </button>

              <button
                onClick={() => handleDelete(item)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '8px 14px', borderRadius: 8,
                  border: '1px solid rgba(239,68,68,0.2)', background: 'rgba(239,68,68,0.08)',
                  color: '#F87171', cursor: 'pointer', fontSize: 12,
                }}
              >
                <Trash2 size={13} />
                <span>Eliminar</span>
              </button>
            </div>
          </div>
        ))}

        {items.length === 0 && (
          <div style={{
            textAlign: 'center', padding: '36px 20px',
            borderRadius: 14, border: '1px dashed rgba(251,191,36,0.25)',
            backgroundColor: 'rgba(255,255,255,0.02)',
          }}>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', margin: '0 0 12px' }}>
              No hay anuncios registrados en la base de datos.
            </p>
            <button
              onClick={handleLoadSample}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '9px 18px', borderRadius: 999,
                background: 'rgba(251, 191, 36, 0.15)', border: '1px solid rgba(251, 191, 36, 0.4)',
                color: '#FBBF24', cursor: 'pointer', fontWeight: 700, fontSize: 12,
              }}
            >
              <Sparkles size={14} />
              <span>Publicar Aviso de Bienvenida de Ejemplo</span>
            </button>
          </div>
        )}
      </div>

      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
