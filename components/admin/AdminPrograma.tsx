'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Plus, Trash2, Save, Loader2, GripVertical, MapPin, Eye, EyeOff, Copy, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';

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
  hora: '10:00 AM',
  titulo: '',
  descripcion: '',
  lugar: 'Auditorio de Aquiahuac',
  visible: true,
};

const DEFAULT_OFICIAL: Omit<Actividad, 'id'>[] = [
  {
    orden: 0,
    hora: '8:00 AM',
    titulo: 'Reunión de alumnos',
    descripcion: 'Reunión de alumnos de tercer semestre en el centro del plantel CBTA #134.',
    lugar: 'Centro de San Francisco Tetlanohcan',
    visible: true,
  },
  {
    orden: 1,
    hora: '8:00 – 10:00 AM',
    titulo: 'Montaje de ofrendas y mercado tradicional',
    descripcion: 'Montaje de ofrendas y del mercado tradicional por parte de los grupos participantes.',
    lugar: 'Auditorio de Aquiahuac',
    visible: true,
  },
  {
    orden: 2,
    hora: '8:30 AM',
    titulo: 'Salida del contingente del desfile',
    descripcion: 'Salida del desfile desde el centro de Tetlanohcan hacia Aquiahuac: 3"A" Agropecuario, SPP, Ofimática, Contabilidad y Programación.',
    lugar: 'Centro de Tetlanohcan hacia Aquiahuac',
    visible: true,
  },
  {
    orden: 3,
    hora: '9:30 AM',
    titulo: 'Llegada al Auditorio de Aquiahuac',
    descripcion: 'Llegada del contingente del desfile al Auditorio de Aquiahuac. Incorporación de los grupos al evento.',
    lugar: 'Auditorio de Aquiahuac',
    visible: true,
  },
  {
    orden: 4,
    hora: '10:00 – 12:00 PM',
    titulo: 'Evaluación oficial de ofrendas',
    descripcion: 'Evaluación de ofrendas por el jurado calificador del concurso.',
    lugar: 'Auditorio de Aquiahuac',
    visible: true,
  },
  {
    orden: 5,
    hora: '10:00 AM',
    titulo: '🎭 INICIO DEL FESTIVAL «Entre la Vida y la Muerte»',
    descripcion: 'Inicio oficial del Festival Cultural Entre la Vida y la Muerte. Presentaciones culturales, danzas tradicionales y pasarela de Catrines y Catrinas.',
    lugar: 'Escenario Principal — Auditorio de Aquiahuac',
    visible: true,
  },
  {
    orden: 6,
    hora: '12:00 PM',
    titulo: 'Cierre — Primera Parte del Festival',
    descripcion: 'Cierre de la primera parte del festival cultural y reconocimientos.',
    lugar: 'Auditorio de Aquiahuac',
    visible: true,
  },
  {
    orden: 7,
    hora: '12:00 – 12:20 PM',
    titulo: 'Participación especial 5° "A" Programación',
    descripcion: 'Participación del grupo 5° "A" de Programación y cierre de la segunda parte del festival.',
    lugar: 'Escenario Principal',
    visible: true,
  },
  {
    orden: 8,
    hora: '12:30 – 1:30 PM',
    titulo: 'Levantamiento de ofrendas y clausura',
    descripcion: 'Se levantan las ofrendas y se deja limpio el lugar. Fin oficial del evento.',
    lugar: 'Auditorio de Aquiahuac',
    visible: true,
  },
];

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '9px 12px',
  background: 'rgba(255,255,255,0.06)',
  border: '1px solid rgba(255,255,255,0.12)',
  borderRadius: 8,
  color: 'white',
  fontSize: 13,
  outline: 'none',
  boxSizing: 'border-box',
  fontFamily: 'Inter, sans-serif',
};

export default function AdminPrograma() {
  const supabase = createClient();
  const [items, setItems] = useState<Actividad[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ type: 'ok' | 'err'; msg: string } | null>(null);

  function showToast(type: 'ok' | 'err', msg: string) {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3800);
  }

  async function loadItems() {
    setLoading(true);
    const { data, error } = await supabase
      .from('programa')
      .select('*')
      .order('orden', { ascending: true });

    if (!error && data) {
      setItems(data);
    }
    setLoading(false);
  }

  useEffect(() => {
    loadItems();
  }, []);

  // Cargar el programa oficial con 1 clic si no hay datos
  async function handleLoadDefaultOfficial() {
    if (items.length > 0 && !confirm('Ya tienes actividades en la base de datos. ¿Deseas agregar las 9 actividades oficiales estándar?')) {
      return;
    }

    setLoading(true);
    const { error } = await supabase.from('programa').insert(DEFAULT_OFICIAL);

    if (error) {
      showToast('err', 'Error al cargar programa: ' + error.message);
    } else {
      showToast('ok', 'Programa oficial de 9 actividades cargado exitosamente ✓');
      await loadItems();
    }
    setLoading(false);
  }

  // Guardar actividad (nueva o existente)
  async function handleSave(item: Actividad) {
    if (!item.titulo.trim()) {
      showToast('err', 'Por favor escribe un título para la actividad');
      return;
    }

    setSavingId(item.id ?? 'new');
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
        setItems(prev => prev.map(i => (i === item ? inserted : i)));
      }
    }

    setSavingId(null);
    if (error) {
      showToast('err', 'Error al guardar: ' + error.message);
    } else {
      showToast('ok', `«${item.titulo}» guardado correctamente ✓`);
    }
  }

  // Alternar visibilidad sin borrar ("sin borrar si no quiero")
  async function toggleVisibility(item: Actividad, index: number) {
    const newVis = item.visible === false ? true : false;
    update(index, 'visible', newVis);

    if (item.id) {
      setSavingId(item.id);
      const { error } = await supabase.from('programa').update({ visible: newVis }).eq('id', item.id);
      setSavingId(null);
      if (error) {
        showToast('err', 'Error al actualizar visibilidad');
      } else {
        showToast('ok', newVis ? 'Actividad visible en la página web ✓' : 'Actividad oculta (no se mostrará a los visitantes) ✓');
      }
    }
  }

  // Duplicar actividad para crear una variante sin borrar la original
  function handleDuplicate(item: Actividad) {
    const duplicated: Actividad = {
      ...item,
      id: undefined, // nuevo elemento sin ID
      titulo: `${item.titulo} (Copia)`,
      orden: items.length,
      visible: true,
    };
    setItems(prev => [...prev, duplicated]);
    showToast('ok', 'Copia creada. Recuerda presionar el botón Guardar 💾');
  }

  // Eliminar actividad
  async function handleDelete(item: Actividad) {
    if (!confirm(`¿Eliminar definitivamente «${item.titulo || 'esta actividad'}» del programa? (Si solo quieres ocultarla temporalmente, usa el botón del ojito 👁️).`)) {
      return;
    }

    if (!item.id) {
      setItems(prev => prev.filter(i => i !== item));
      return;
    }

    setDeletingId(item.id);
    const { error } = await supabase.from('programa').delete().eq('id', item.id);
    setDeletingId(null);

    if (error) {
      showToast('err', 'Error al eliminar: ' + error.message);
    } else {
      setItems(prev => prev.filter(i => i.id !== item.id));
      showToast('ok', 'Actividad eliminada del programa');
    }
  }

  function addNew() {
    setItems(prev => [...prev, { ...EMPTY, orden: prev.length }]);
  }

  function update(index: number, field: keyof Actividad, value: string | number | boolean) {
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
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      {/* Toast de confirmación */}
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

      {/* Cabecera de la herramienta */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: 12, marginBottom: 20, paddingBottom: 16,
        borderBottom: '1px solid rgba(255,255,255,0.08)',
      }}>
        <div>
          <h2 style={{ fontFamily: 'Cinzel, serif', fontWeight: 800, fontSize: 18, color: 'white', margin: 0 }}>
            📅 Programa de Actividades y Festivales
          </h2>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', margin: '4px 0 0' }}>
            Puedes editar títulos, agregar más información, ocultar actividades sin borrarlas (👁️) o duplicarlas (📋).
          </p>
        </div>

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {items.length === 0 && (
            <button
              onClick={handleLoadDefaultOfficial}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '8px 14px', borderRadius: 8,
                background: 'rgba(52, 211, 153, 0.15)', border: '1px solid rgba(52, 211, 153, 0.35)',
                color: '#34D399', fontSize: 12, fontWeight: 700, cursor: 'pointer',
              }}
            >
              <RefreshCw size={14} />
              <span>Cargar Programa Oficial (9 actividades)</span>
            </button>
          )}

          <button
            onClick={addNew}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '8px 14px', borderRadius: 8,
              background: 'linear-gradient(135deg, #F97316 0%, #EA580C 100%)',
              color: 'white', fontSize: 12, fontWeight: 700, cursor: 'pointer', border: 'none',
              boxShadow: '0 4px 15px rgba(249,115,22,0.3)',
            }}
          >
            <Plus size={15} />
            <span>Nueva Actividad</span>
          </button>
        </div>
      </div>

      {/* Lista de actividades */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 24 }}>
        {items.map((item, i) => {
          const isVisible = item.visible !== false;
          return (
            <div
              key={item.id ?? i}
              style={{
                background: isVisible ? 'rgba(255,255,255,0.025)' : 'rgba(255,255,255,0.01)',
                border: isVisible ? '1px solid rgba(255,255,255,0.1)' : '1px dashed rgba(255,255,255,0.06)',
                opacity: isVisible ? 1 : 0.65,
                borderRadius: 14,
                padding: '16px 18px',
                display: 'flex',
                gap: 12,
                alignItems: 'flex-start',
                transition: 'all 0.2s',
              }}
            >
              <GripVertical size={16} style={{ color: 'rgba(255,255,255,0.2)', marginTop: 8, flexShrink: 0 }} />

              <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 10 }}>
                {/* Hora */}
                <div>
                  <label style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', display: 'block', marginBottom: 4, fontFamily: 'JetBrains Mono, monospace' }}>
                    HORA
                  </label>
                  <input
                    style={inputStyle}
                    value={item.hora}
                    placeholder="10:00 AM"
                    onChange={e => update(i, 'hora', e.target.value)}
                  />
                </div>

                {/* Título de la actividad */}
                <div style={{ gridColumn: 'span 2' }}>
                  <label style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', display: 'block', marginBottom: 4, fontFamily: 'JetBrains Mono, monospace' }}>
                    TÍTULO DEL PROGRAMA O ACTIVIDAD
                  </label>
                  <input
                    style={{ ...inputStyle, fontWeight: 600, color: item.titulo.includes('FESTIVAL') ? '#F97316' : 'white' }}
                    value={item.titulo}
                    placeholder="Ej. 🎭 INICIO DEL FESTIVAL «Entre la Vida y la Muerte»"
                    onChange={e => update(i, 'titulo', e.target.value)}
                  />
                </div>

                {/* Lugar */}
                <div>
                  <label style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', display: 'block', marginBottom: 4, fontFamily: 'JetBrains Mono, monospace' }}>
                    LUGAR
                  </label>
                  <input
                    style={inputStyle}
                    value={item.lugar || ''}
                    placeholder="Auditorio de Aquiahuac"
                    onChange={e => update(i, 'lugar', e.target.value)}
                  />
                </div>

                {/* Descripción / Información adicional */}
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', display: 'block', marginBottom: 4, fontFamily: 'JetBrains Mono, monospace' }}>
                    DESCRIPCIÓN Y DETALLES DEL EVENTO
                  </label>
                  <textarea
                    rows={2}
                    style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.5 }}
                    value={item.descripcion || ''}
                    placeholder="Detalles de participaciones, grupos estudiantiles, presentaciones culturales o invitados..."
                    onChange={e => update(i, 'descripcion', e.target.value)}
                  />
                </div>

                {/* Estado visible/oculto */}
                <div style={{ gridColumn: '1 / -1', display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: isVisible ? '#34D399' : 'rgba(255,255,255,0.4)' }}>
                  {isVisible ? <CheckCircle size={12} /> : <AlertCircle size={12} />}
                  <span>{isVisible ? 'Visible en el programa público de la web' : 'Oculto (guardado como borrador, no se muestra a los visitantes)'}</span>
                </div>
              </div>

              {/* Botones de acción vertical */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flexShrink: 0 }}>
                {/* Guardar */}
                <button
                  onClick={() => handleSave(item)}
                  disabled={savingId === (item.id ?? 'new')}
                  title="Guardar cambios en la base de datos"
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', width: 34, height: 34,
                    borderRadius: 8, border: '1px solid rgba(249,115,22,0.3)', background: 'rgba(249,115,22,0.15)',
                    color: '#F97316', cursor: 'pointer',
                  }}
                >
                  {savingId === (item.id ?? 'new') ? (
                    <Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} />
                  ) : (
                    <Save size={15} />
                  )}
                </button>

                {/* Ocultar / Mostrar (Sin borrar) */}
                <button
                  onClick={() => toggleVisibility(item, i)}
                  title={isVisible ? 'Ocultar sin borrar de la base de datos' : 'Hacer visible en la página web'}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', width: 34, height: 34,
                    borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)',
                    background: isVisible ? 'rgba(52,211,153,0.1)' : 'rgba(255,255,255,0.05)',
                    color: isVisible ? '#34D399' : 'rgba(255,255,255,0.4)',
                    cursor: 'pointer',
                  }}
                >
                  {isVisible ? <Eye size={15} /> : <EyeOff size={15} />}
                </button>

                {/* Duplicar actividad */}
                <button
                  onClick={() => handleDuplicate(item)}
                  title="Duplicar para crear otro programa alternativo sin perder el actual"
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', width: 34, height: 34,
                    borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)',
                    color: 'rgba(255,255,255,0.6)', cursor: 'pointer',
                  }}
                >
                  <Copy size={14} />
                </button>

                {/* Eliminar permanentemente */}
                <button
                  onClick={() => handleDelete(item)}
                  disabled={deletingId === item.id}
                  title="Eliminar permanentemente"
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', width: 34, height: 34,
                    borderRadius: 8, border: '1px solid rgba(239,68,68,0.2)', background: 'rgba(239,68,68,0.08)',
                    color: '#F87171', cursor: 'pointer',
                  }}
                >
                  {deletingId === item.id ? (
                    <Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} />
                  ) : (
                    <Trash2 size={15} />
                  )}
                </button>
              </div>
            </div>
          );
        })}

        {items.length === 0 && (
          <div style={{
            textAlign: 'center', padding: '40px 20px',
            borderRadius: 14, border: '1px dashed rgba(249,115,22,0.3)',
            backgroundColor: 'rgba(249,115,22,0.02)',
          }}>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', margin: '0 0 12px' }}>
              No hay actividades registradas en la base de datos de Supabase.
            </p>
            <button
              onClick={handleLoadDefaultOfficial}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '10px 20px', borderRadius: 999,
                background: 'linear-gradient(135deg, #F97316 0%, #EA580C 100%)',
                color: 'white', border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: 13,
              }}
            >
              <RefreshCw size={15} />
              <span>Cargar las 9 Actividades Oficiales del Festival</span>
            </button>
          </div>
        )}
      </div>

      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
