'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Save, Loader2, CheckCircle } from 'lucide-react';

interface EventContent {
  id?: string;
  titulo: string;
  descripcion: string;
  fecha: string;
  hora_inicio: string;
  hora_fin: string;
  lugar: string;
  lugar_detalle: string;
  anio: number;
}

const DEFAULT: EventContent = {
  titulo: 'Día de Muertos 2026',
  descripcion: 'Celebración cultural del Día de Muertos en el CBTA #134 de Tetlanhocan, Tlaxcala.',
  fecha: '2026-10-28',
  hora_inicio: '08:00',
  hora_fin: '13:00',
  lugar: 'Auditorio de Aquiahuac',
  lugar_detalle: 'San Fco. Tetlanhocan, Tlax.',
  anio: 2026,
};

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>
        {label}
      </label>
      {children}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '11px 14px',
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: 10, color: 'white', fontSize: 14,
  outline: 'none', boxSizing: 'border-box',
  fontFamily: 'Inter, sans-serif',
};

export default function AdminContent() {
  const supabase = createClient();
  const [data, setData]       = useState<EventContent>(DEFAULT);
  const [saving, setSaving]   = useState(false);
  const [saved, setSaved]     = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data: rows } = await supabase
        .from('event_content')
        .select('*')
        .limit(1)
        .single();
      if (rows) setData(rows);
      setLoading(false);
    }
    load();
  }, []);

  async function handleSave() {
    setSaving(true);
    const { id, ...rest } = data;

    let error;
    if (id) {
      ({ error } = await supabase.from('event_content').update(rest).eq('id', id));
    } else {
      const { data: inserted, error: e } = await supabase.from('event_content').insert(rest).select().single();
      error = e;
      if (inserted) setData(inserted);
    }

    setSaving(false);
    if (!error) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    }
  }

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}>
      <Loader2 size={24} style={{ color: '#F97316', animation: 'spin 1s linear infinite' }} />
      <style>{`@keyframes spin { from{transform:rotate(0deg)}to{transform:rotate(360deg)} }`}</style>
    </div>
  );

  return (
    <div style={{ maxWidth: 680, margin: '0 auto' }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontFamily: 'Cinzel, serif', fontWeight: 900, fontSize: 22, color: 'white', margin: '0 0 6px' }}>
          ✏️ Editar Contenido del Evento
        </h1>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', margin: 0 }}>
          Los cambios se reflejan en la página principal automáticamente.
        </p>
      </div>

      <div style={{
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: 14, padding: 24,
        display: 'flex', flexDirection: 'column', gap: 18,
      }}>
        <Field label="Título del evento">
          <input style={inputStyle} value={data.titulo}
            onChange={e => setData(p => ({ ...p, titulo: e.target.value }))} />
        </Field>

        <Field label="Descripción">
          <textarea
            rows={3}
            style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6 }}
            value={data.descripcion}
            onChange={e => setData(p => ({ ...p, descripcion: e.target.value }))}
          />
        </Field>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <Field label="Fecha">
            <input type="date" style={inputStyle} value={data.fecha}
              onChange={e => setData(p => ({ ...p, fecha: e.target.value }))} />
          </Field>
          <Field label="Año">
            <input type="number" style={inputStyle} value={data.anio}
              onChange={e => setData(p => ({ ...p, anio: Number(e.target.value) }))} />
          </Field>
          <Field label="Hora inicio">
            <input type="time" style={inputStyle} value={data.hora_inicio}
              onChange={e => setData(p => ({ ...p, hora_inicio: e.target.value }))} />
          </Field>
          <Field label="Hora fin">
            <input type="time" style={inputStyle} value={data.hora_fin}
              onChange={e => setData(p => ({ ...p, hora_fin: e.target.value }))} />
          </Field>
        </div>

        <Field label="Lugar">
          <input style={inputStyle} value={data.lugar}
            onChange={e => setData(p => ({ ...p, lugar: e.target.value }))} />
        </Field>

        <Field label="Detalle del lugar (ciudad, estado)">
          <input style={inputStyle} value={data.lugar_detalle}
            onChange={e => setData(p => ({ ...p, lugar_detalle: e.target.value }))} />
        </Field>

        <button
          onClick={handleSave}
          disabled={saving}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            padding: '13px 0', borderRadius: 10,
            background: saved
              ? 'rgba(16,185,129,0.15)'
              : 'linear-gradient(135deg, #F97316, #C2410C)',
            border: saved ? '1px solid rgba(16,185,129,0.3)' : 'none',
            color: saved ? '#34D399' : 'white',
            fontFamily: 'Cinzel, serif', fontWeight: 700, fontSize: 14,
            cursor: saving ? 'not-allowed' : 'pointer',
            transition: 'all 0.3s',
          }}
        >
          {saving
            ? <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Guardando...</>
            : saved
            ? <><CheckCircle size={16} /> ¡Guardado!</>
            : <><Save size={16} /> Guardar cambios</>}
        </button>
      </div>
      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
