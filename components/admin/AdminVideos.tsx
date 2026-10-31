'use client';

import { useState, useEffect, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Film, Upload, Trash2, Loader2, Play, CheckCircle, AlertCircle, Link as LinkIcon, Clock, Tag } from 'lucide-react';
import Image from 'next/image';

export interface VideoItem {
  id: string;
  titulo: string;
  src: string;
  poster: string | null;
  duracion: string;
  categoria: string;
  visible?: boolean;
  created_at: string;
}

const CATEGORIAS_VIDEO = [
  { id: 'Desfile',   label: '🎭 Desfile de Catrinas' },
  { id: 'Ofrendas',  label: '🕯️ Concurso de Ofrendas' },
  { id: 'Festival',  label: '🎪 Festival Cultural' },
  { id: 'Tradicion', label: '🏵️ Tradición y Comunidad' },
  { id: 'General',   label: '🎬 General' },
];

export default function AdminVideos() {
  const supabase = createClient();
  const fileRef = useRef<HTMLInputElement>(null);
  const posterRef = useRef<HTMLInputElement>(null);

  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ type: 'ok' | 'err'; msg: string } | null>(null);

  // Formulario para nuevo video
  const [titulo, setTitulo] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [posterUrl, setPosterUrl] = useState('');
  const [duracion, setDuracion] = useState('0:30');
  const [categoria, setCategoria] = useState('Festival');
  const [showAddForm, setShowAddForm] = useState(false);

  function showToast(type: 'ok' | 'err', msg: string) {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3800);
  }

  async function loadVideos() {
    setLoading(true);
    const { data, error } = await supabase
      .from('videos')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setVideos(data);
    }
    setLoading(false);
  }

  useEffect(() => {
    loadVideos();
  }, []);

  // Subir archivo de video directamente a Supabase Storage (hasta 50 MB)
  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Aceptar cualquier formato de video común (MP4, MOV de iPhone, WEBM, M4V)
    if (!file.type.startsWith('video/') && !file.name.match(/\.(mp4|mov|webm|m4v|avi|mkv)$/i)) {
      showToast('err', 'Por favor selecciona un archivo de video válido (MP4, MOV, WEBM).');
      return;
    }

    const sizeMB = (file.size / (1024 * 1024)).toFixed(1);

    // Límite de carga directa: 50 MB (máximo admitido por el almacenamiento de Supabase)
    if (file.size > 50 * 1024 * 1024) {
      showToast('err', `Tu video pesa ${sizeMB} MB y supera los 50 MB del servidor. Reenvíatelo por WhatsApp para comprimirlo a ~4 MB sin perder calidad.`);
      return;
    }

    setUploading(true);

    // Calcular duración automática si es posible
    try {
      const tempVideo = document.createElement('video');
      tempVideo.preload = 'metadata';
      tempVideo.onloadedmetadata = () => {
        window.URL.revokeObjectURL(tempVideo.src);
        const sec = Math.round(tempVideo.duration);
        const m = Math.floor(sec / 60);
        const s = sec % 60;
        setDuracion(`${m}:${s < 10 ? '0' : ''}${s}`);
      };
      tempVideo.src = URL.createObjectURL(file);
    } catch {}

    const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const fileName = `video-${Date.now()}-${cleanName}`;

    const { error: storageError } = await supabase.storage
      .from('gallery')
      .upload(fileName, file, { cacheControl: '3600', upsert: false });

    if (storageError) {
      showToast('err', `Error al subir video (${sizeMB} MB): ${storageError.message}`);
      setUploading(false);
      return;
    }

    const { data: { publicUrl } } = supabase.storage.from('gallery').getPublicUrl(fileName);
    setVideoUrl(publicUrl);
    if (!titulo) {
      setTitulo(file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '));
    }
    setUploading(false);
    showToast('ok', `Video cargado con éxito (${sizeMB} MB) ✓`);
  }

  // Subir imagen de portada para el video
  async function handlePosterUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const fileName = `poster-${Date.now()}-${cleanName}`;

    const { error: storageError } = await supabase.storage
      .from('gallery')
      .upload(fileName, file, { cacheControl: '3600', upsert: false });

    if (storageError) {
      showToast('err', 'Error al subir la imagen de portada');
      setUploading(false);
      return;
    }

    const { data: { publicUrl } } = supabase.storage.from('gallery').getPublicUrl(fileName);
    setPosterUrl(publicUrl);
    setUploading(false);
    showToast('ok', 'Portada cargada ✓');
  }

  // Guardar nuevo clip de video
  async function handleSaveVideo(e: React.FormEvent) {
    e.preventDefault();
    if (!titulo.trim()) {
      showToast('err', 'Ingresa un título para el video');
      return;
    }
    if (!videoUrl.trim()) {
      showToast('err', 'Ingresa la URL o sube un archivo de video');
      return;
    }

    setUploading(true);
    const { error } = await supabase.from('videos').insert({
      titulo: titulo.trim(),
      src: videoUrl.trim(),
      poster: posterUrl.trim() || '/images/catrina-roses.jpg',
      duracion: duracion.trim() || '0:30',
      categoria: categoria,
      visible: true,
    });

    setUploading(false);
    if (error) {
      showToast('err', `Error al guardar: ${error.message}`);
    } else {
      showToast('ok', 'Video agregado correctamente a la sección del evento ✓');
      setTitulo('');
      setVideoUrl('');
      setPosterUrl('');
      setDuracion('0:30');
      setShowAddForm(false);
      loadVideos();
    }
  }

  // Eliminar video
  async function handleDeleteVideo(video: VideoItem) {
    if (!confirm(`¿Deseas eliminar el video "${video.titulo}"?`)) return;

    setDeletingId(video.id);

    // Intentar borrar archivo de storage si era subido
    try {
      if (video.src.includes('/storage/v1/object/public/gallery/')) {
        const parts = video.src.split('/');
        const fileName = parts[parts.length - 1];
        await supabase.storage.from('gallery').remove([fileName]);
      }
    } catch {}

    const { error } = await supabase.from('videos').delete().eq('id', video.id);
    setDeletingId(null);

    if (error) {
      showToast('err', `Error al eliminar: ${error.message}`);
    } else {
      showToast('ok', 'Video eliminado con éxito ✓');
      setVideos(prev => prev.filter(v => v.id !== video.id));
    }
  }

  return (
    <div style={{ maxWidth: 860, margin: '0 auto' }}>
      {/* Encabezado */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 20 }}>
        <div>
          <h1 style={{ fontFamily: 'Cinzel, serif', fontWeight: 900, fontSize: 22, color: 'white', margin: '0 0 4px' }}>
            🎬 Gestión de Videos Cortos (Evento)
          </h1>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', margin: 0 }}>
            Agrega clips breves (15 a 30s) para que aparezcan en la sección del festival cultural.
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          style={{
            padding: '8px 16px', borderRadius: 999,
            background: showAddForm ? 'rgba(255,255,255,0.1)' : 'linear-gradient(135deg, #F97316, #C2410C)',
            border: 'none', color: 'white', cursor: 'pointer',
            fontFamily: 'Inter, sans-serif', fontSize: 13, fontWeight: 600,
            display: 'flex', alignItems: 'center', gap: 6,
          }}
        >
          <span>{showAddForm ? '✕ Cancelar' : '+ Agregar Nuevo Video'}</span>
        </button>
      </div>

      {/* Formulario para agregar video */}
      {showAddForm && (
        <form
          onSubmit={handleSaveVideo}
          style={{
            padding: '22px', borderRadius: 16,
            background: 'rgba(249,115,22,0.05)',
            border: '1px solid rgba(249,115,22,0.25)',
            marginBottom: 28,
            display: 'flex', flexDirection: 'column', gap: 14,
          }}
        >
          <h3 style={{ fontFamily: 'Cinzel, serif', fontSize: 16, color: 'white', margin: 0, fontWeight: 700 }}>
            Nuevo Clip de Video
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 12 }}>
            <div>
              <label style={{ display: 'block', fontSize: 11, fontFamily: 'JetBrains Mono, monospace', color: 'rgba(255,255,255,0.5)', marginBottom: 4 }}>
                Título del Video:
              </label>
              <input
                type="text"
                value={titulo}
                onChange={e => setTitulo(e.target.value)}
                placeholder="Ej. Desfile de Catrinas y Catrines"
                required
                style={{
                  width: '100%', padding: '9px 12px', borderRadius: 8,
                  background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)',
                  color: 'white', fontSize: 13, outline: 'none',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 11, fontFamily: 'JetBrains Mono, monospace', color: 'rgba(255,255,255,0.5)', marginBottom: 4 }}>
                Categoría:
              </label>
              <select
                value={categoria}
                onChange={e => setCategoria(e.target.value)}
                style={{
                  width: '100%', padding: '9px 12px', borderRadius: 8,
                  background: '#140814', border: '1px solid rgba(255,255,255,0.15)',
                  color: 'white', fontSize: 13, outline: 'none', cursor: 'pointer',
                }}
              >
                {CATEGORIAS_VIDEO.map(c => (
                  <option key={c.id} value={c.id}>{c.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 11, fontFamily: 'JetBrains Mono, monospace', color: 'rgba(255,255,255,0.5)', marginBottom: 4 }}>
              Archivo de Video (Sube un archivo o pega un enlace):
            </label>
            <div style={{ display: 'flex', gap: 8 }}>
              <input
                type="text"
                value={videoUrl}
                onChange={e => setVideoUrl(e.target.value)}
                placeholder="https://... o /videos/archivo.mp4"
                style={{
                  flex: 1, padding: '9px 12px', borderRadius: 8,
                  background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)',
                  color: 'white', fontSize: 13, outline: 'none',
                }}
              />
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                style={{
                  padding: '8px 14px', borderRadius: 8,
                  background: 'rgba(249,115,22,0.15)', border: '1px solid rgba(249,115,22,0.3)',
                  color: '#F97316', cursor: 'pointer', fontSize: 12, fontWeight: 600,
                  display: 'flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap',
                }}
              >
                <Upload size={14} />
                <span>{uploading ? 'Subiendo video...' : 'Subir Video'}</span>
              </button>
              <input
                ref={fileRef}
                type="file"
                accept="video/mp4,video/quicktime,video/webm,video/x-m4v,video/*"
                onChange={handleFileUpload}
                style={{ display: 'none' }}
              />
            </div>
            <div style={{
              marginTop: 6, padding: '6px 10px', borderRadius: 8,
              background: 'rgba(249,115,22,0.05)', border: '1px dashed rgba(249,115,22,0.25)',
              fontSize: 11, color: 'rgba(255,255,255,0.65)', lineHeight: 1.5,
            }}>
              💡 <strong>Límite: hasta 50 MB</strong> (MP4, MOV de iPhone, WEBM). Si tu celular grabó en 4K y supera los 50 MB, reenvíatelo por WhatsApp para comprimirlo a ~4 MB en alta definición al instante.
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
            <div>
              <label style={{ display: 'block', fontSize: 11, fontFamily: 'JetBrains Mono, monospace', color: 'rgba(255,255,255,0.5)', marginBottom: 4 }}>
                Imagen de Portada (Poster):
              </label>
              <div style={{ display: 'flex', gap: 8 }}>
                <input
                  type="text"
                  value={posterUrl}
                  onChange={e => setPosterUrl(e.target.value)}
                  placeholder="/images/catrina-roses.jpg"
                  style={{
                    flex: 1, padding: '9px 12px', borderRadius: 8,
                    background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)',
                    color: 'white', fontSize: 13, outline: 'none',
                  }}
                />
                <button
                  type="button"
                  onClick={() => posterRef.current?.click()}
                  disabled={uploading}
                  style={{
                    padding: '8px 12px', borderRadius: 8,
                    background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)',
                    color: 'white', cursor: 'pointer', fontSize: 12,
                  }}
                >
                  Subir
                </button>
                <input
                  ref={posterRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePosterUpload}
                  style={{ display: 'none' }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 11, fontFamily: 'JetBrains Mono, monospace', color: 'rgba(255,255,255,0.5)', marginBottom: 4 }}>
                Duración del Clip:
              </label>
              <input
                type="text"
                value={duracion}
                onChange={e => setDuracion(e.target.value)}
                placeholder="0:25"
                style={{
                  width: '100%', padding: '9px 12px', borderRadius: 8,
                  background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)',
                  color: 'white', fontSize: 13, outline: 'none',
                }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 8 }}>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              style={{
                padding: '9px 16px', borderRadius: 8,
                background: 'transparent', border: '1px solid rgba(255,255,255,0.1)',
                color: 'rgba(255,255,255,0.6)', cursor: 'pointer', fontSize: 13,
              }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={uploading}
              style={{
                padding: '9px 20px', borderRadius: 8,
                background: 'linear-gradient(135deg, #F97316, #C2410C)',
                border: 'none', color: 'white', cursor: 'pointer', fontSize: 13, fontWeight: 700,
                display: 'flex', alignItems: 'center', gap: 6,
              }}
            >
              {uploading ? <Loader2 size={14} className="animate-spin" /> : null}
              <span>Guardar Video</span>
            </button>
          </div>
        </form>
      )}

      {/* Lista de videos agregados */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: 40 }}>
          <Loader2 size={26} color="#F97316" style={{ animation: 'spin 1s linear infinite' }} />
        </div>
      ) : videos.length === 0 ? (
        <div style={{
          padding: '40px 20px', textAlign: 'center', borderRadius: 16,
          background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(255,255,255,0.1)',
        }}>
          <Film size={34} style={{ color: 'rgba(255,255,255,0.2)', marginBottom: 10 }} />
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14, margin: '0 0 6px', fontWeight: 600 }}>
            Aún no has agregado videos al festival.
          </p>
          <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12, margin: '0 0 16px' }}>
            Presiona el botón superior para subir clips cortos de 15 a 30 segundos.
          </p>
          <button
            onClick={() => setShowAddForm(true)}
            style={{
              padding: '8px 18px', borderRadius: 999,
              background: 'rgba(249,115,22,0.15)', border: '1px solid rgba(249,115,22,0.35)',
              color: '#F97316', cursor: 'pointer', fontSize: 12, fontWeight: 600,
            }}
          >
            + Agregar Primer Video
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
          {videos.map(video => (
            <div
              key={video.id}
              style={{
                borderRadius: 14, overflow: 'hidden',
                background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
                display: 'flex', flexDirection: 'column', position: 'relative',
              }}
            >
              <div style={{ position: 'relative', width: '100%', height: 160, background: '#000' }}>
                {video.poster ? (
                  <Image src={video.poster} alt={video.titulo} fill className="object-cover" />
                ) : (
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.2)' }}>
                    <Film size={32} />
                  </div>
                )}

                {/* Botón de borrar permanente */}
                <button
                  type="button"
                  onClick={() => handleDeleteVideo(video)}
                  disabled={deletingId === video.id}
                  title="Eliminar video"
                  style={{
                    position: 'absolute', top: 8, right: 8, zIndex: 10,
                    width: 32, height: 32, borderRadius: '50%',
                    background: 'rgba(220, 38, 38, 0.92)', border: 'none',
                    color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.5)',
                  }}
                >
                  {deletingId === video.id ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <Trash2 size={14} />
                  )}
                </button>

                {/* Badges */}
                <div style={{
                  position: 'absolute', bottom: 8, left: 8,
                  padding: '2px 8px', borderRadius: 4,
                  background: 'rgba(0,0,0,0.8)', fontSize: 10,
                  fontFamily: 'JetBrains Mono, monospace', color: '#F97316',
                }}>
                  {video.categoria}
                </div>

                <div style={{
                  position: 'absolute', bottom: 8, right: 8,
                  padding: '2px 8px', borderRadius: 4,
                  background: 'rgba(0,0,0,0.8)', fontSize: 10,
                  fontFamily: 'JetBrains Mono, monospace', color: 'white',
                }}>
                  {video.duracion}
                </div>
              </div>

              <div style={{ padding: '12px 14px' }}>
                <p style={{ fontSize: 13, fontWeight: 700, color: 'white', margin: '0 0 4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {video.titulo}
                </p>
                <p style={{ fontSize: 11, fontFamily: 'JetBrains Mono, monospace', color: 'rgba(255,255,255,0.4)', margin: 0, wordBreak: 'break-all' }}>
                  {video.src.substring(0, 45)}...
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', bottom: 24, right: 24, zIndex: 999,
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '12px 18px', borderRadius: 12,
          background: toast.type === 'ok' ? 'rgba(16,185,129,0.25)' : 'rgba(220,38,38,0.25)',
          border: `1px solid ${toast.type === 'ok' ? 'rgba(16,185,129,0.5)' : 'rgba(220,38,38,0.5)'}`,
          backdropFilter: 'blur(16px)',
          boxShadow: '0 8px 30px rgba(0,0,0,0.6)',
        }}>
          {toast.type === 'ok' ? <CheckCircle size={16} color="#34D399" /> : <AlertCircle size={16} color="#F87171" />}
          <span style={{ fontSize: 13, color: 'white', fontWeight: 500 }}>{toast.msg}</span>
        </div>
      )}
    </div>
  );
}
