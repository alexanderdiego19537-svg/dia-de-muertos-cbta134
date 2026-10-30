'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Upload, Trash2, Loader2, Image as ImageIcon, CheckCircle, AlertCircle, Check, Tag, Filter } from 'lucide-react';
import Image from 'next/image';

export interface GalleryItem {
  id: string;
  title: string | null;
  image_url: string;
  category?: string;
  visible?: boolean;
  created_at: string;
}

export const CATEGORIAS_GALERIA = [
  { id: 'desfile',   label: 'Desfile de Catrines', icon: '🎭' },
  { id: 'ofrendas',  label: 'Concurso de Ofrendas', icon: '🕯️' },
  { id: 'catrinas',  label: 'Catrinas y Catrines', icon: '💀' },
  { id: 'evento',    label: 'Festival y Eventos', icon: '🎪' },
  { id: 'tradicion', label: 'Tradición y Altares', icon: '🏵️' },
  { id: 'general',   label: 'General', icon: '📷' },
] as const;

export default function AdminGallery() {
  const supabase = createClient();
  const fileRef  = useRef<HTMLInputElement>(null);

  const [images, setImages]                 = useState<GalleryItem[]>([]);
  const [uploadCategory, setUploadCategory] = useState<string>('desfile');
  const [filterCategory, setFilterCategory] = useState<string>('todas');
  const [uploading, setUploading]           = useState(false);
  const [deleting, setDeleting]             = useState<string | null>(null);
  const [savingId, setSavingId]             = useState<string | null>(null);
  const [toast, setToast]                   = useState<{ type: 'ok' | 'err'; msg: string } | null>(null);
  const [loading, setLoading]               = useState(true);

  function showToast(type: 'ok' | 'err', msg: string) {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3800);
  }

  async function loadImages() {
    setLoading(true);
    const { data, error } = await supabase
      .from('gallery')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setImages(data);
    }
    setLoading(false);
  }

  useEffect(() => {
    loadImages();
  }, []);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;

    setUploading(true);
    let successCount = 0;
    let lastError = '';

    for (const file of files) {
      if (!file.type.startsWith('image/')) {
        showToast('err', `${file.name} no es una imagen válida`);
        continue;
      }
      if (file.size > 15 * 1024 * 1024) {
        showToast('err', `${file.name} supera el límite de 15 MB`);
        continue;
      }

      const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const fileName = `${Date.now()}-${cleanName}`;

      // 1. Subir a Supabase Storage (bucket: 'gallery')
      const { error: storageError } = await supabase.storage
        .from('gallery')
        .upload(fileName, file, { cacheControl: '3600', upsert: false });

      if (storageError) {
        console.error('Storage upload error:', storageError);
        lastError = storageError.message;
        continue;
      }

      // 2. Obtener URL pública
      const { data: { publicUrl } } = supabase.storage
        .from('gallery')
        .getPublicUrl(fileName);

      // 3. Guardar registro en la tabla 'gallery' con categoría seleccionada
      const titleName = file.name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ');
      const { error: dbError } = await supabase
        .from('gallery')
        .insert({
          title: titleName,
          image_url: publicUrl,
          category: uploadCategory,
          visible: true,
        });

      if (dbError) {
        console.error('DB insert error:', dbError);
        lastError = dbError.message;
        continue;
      }

      successCount++;
    }

    setUploading(false);
    if (fileRef.current) fileRef.current.value = '';

    if (successCount > 0) {
      showToast('ok', `${successCount} foto${successCount > 1 ? 's' : ''} subida${successCount > 1 ? 's' : ''} a [${CATEGORIAS_GALERIA.find(c => c.id === uploadCategory)?.label || uploadCategory}] ✓`);
      loadImages();
    } else if (lastError) {
      showToast('err', `Error al subir: ${lastError}`);
    }
  }

  function updateLocalTitle(id: string, newTitle: string) {
    setImages(prev => prev.map(img => img.id === id ? { ...img, title: newTitle } : img));
  }

  async function handleSaveTitle(id: string, newTitle: string) {
    setSavingId(id);
    const cleanTitle = newTitle.trim() || 'Foto de galería';

    const { error } = await supabase
      .from('gallery')
      .update({ title: cleanTitle })
      .eq('id', id);

    setSavingId(null);
    if (!error) {
      showToast('ok', 'Título guardado ✓');
    } else {
      showToast('err', 'Error al guardar el título');
    }
  }

  async function handleUpdateCategory(id: string, newCategory: string) {
    setImages(prev => prev.map(img => img.id === id ? { ...img, category: newCategory } : img));

    const { error } = await supabase
      .from('gallery')
      .update({ category: newCategory })
      .eq('id', id);

    if (!error) {
      showToast('ok', 'Categoría actualizada ✓');
    } else {
      showToast('err', 'Error al actualizar categoría');
    }
  }

  async function handleDelete(img: GalleryItem) {
    const confirmDelete = window.confirm(
      `¿Deseas eliminar la foto "${img.title || 'Foto'}" permanentemente de la galería?`
    );
    if (!confirmDelete) return;

    setDeleting(img.id);

    try {
      // Extraer nombre del archivo del URL
      let fileName = '';
      try {
        const url = new URL(img.image_url);
        const pathParts = url.pathname.split('/');
        fileName = decodeURIComponent(pathParts[pathParts.length - 1]);
      } catch {
        const parts = img.image_url.split('/');
        fileName = parts[parts.length - 1];
      }

      // Borrar de Storage si se obtuvo nombre
      if (fileName) {
        await supabase.storage.from('gallery').remove([fileName]);
      }

      // Borrar de la tabla 'gallery'
      const { error } = await supabase.from('gallery').delete().eq('id', img.id);

      if (error) {
        showToast('err', `Error al borrar: ${error.message}`);
      } else {
        showToast('ok', 'Foto eliminada con éxito ✓');
        setImages(prev => prev.filter(i => i.id !== img.id));
      }
    } catch (err: unknown) {
      console.error(err);
      showToast('err', 'Error inesperado al eliminar');
    } finally {
      setDeleting(null);
    }
  }

  const filteredImages = useMemo(() => {
    if (filterCategory === 'todas') return images;
    return images.filter(img => (img.category || 'general') === filterCategory);
  }, [images, filterCategory]);

  return (
    <div style={{ maxWidth: 960, margin: '0 auto', padding: '0 8px' }}>
      {/* Encabezado */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontFamily: 'Cinzel, serif', fontWeight: 900, fontSize: 24, color: 'white', margin: '0 0 6px' }}>
          📸 Galería de Fotos del Festival
        </h1>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', margin: 0, lineHeight: 1.6 }}>
          Sube tus fotos seleccionando la categoría correspondiente (Desfile, Ofrendas, Catrinas o Festival). Aparecerán en la galería pública y podrás administrarlas o eliminarlas en cualquier momento.
        </p>
      </div>

      {/* Selector de categoría antes de subir */}
      <div style={{
        padding: '16px 20px',
        borderRadius: 14,
        background: 'rgba(249,115,22,0.06)',
        border: '1px solid rgba(249,115,22,0.2)',
        marginBottom: 16,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <Tag size={16} style={{ color: '#F97316' }} />
          <span style={{ fontSize: 13, fontWeight: 700, color: 'white' }}>
            1. Selecciona la categoría donde se guardarán las fotos:
          </span>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {CATEGORIAS_GALERIA.map(cat => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setUploadCategory(cat.id)}
              style={{
                padding: '8px 14px',
                borderRadius: 999,
                cursor: 'pointer',
                fontFamily: 'Inter, sans-serif',
                fontSize: 12,
                fontWeight: 600,
                transition: 'all 0.2s',
                border: uploadCategory === cat.id ? '1px solid #F97316' : '1px solid rgba(255,255,255,0.12)',
                background: uploadCategory === cat.id ? 'rgba(249,115,22,0.25)' : 'rgba(255,255,255,0.04)',
                color: uploadCategory === cat.id ? '#F97316' : 'rgba(255,255,255,0.7)',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
              {uploadCategory === cat.id && <span style={{ fontSize: 10, color: '#F97316' }}>●</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Zona de subida */}
      <div
        onClick={() => !uploading && fileRef.current?.click()}
        style={{
          border: '2px dashed rgba(249,115,22,0.4)',
          borderRadius: 16, padding: '32px 24px',
          textAlign: 'center', cursor: uploading ? 'not-allowed' : 'pointer',
          background: 'rgba(249,115,22,0.02)', marginBottom: 28,
          transition: 'all 0.2s',
        }}
        onMouseEnter={e => { if (!uploading) (e.currentTarget as HTMLDivElement).style.borderColor = '#F97316'; }}
        onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(249,115,22,0.4)'; }}
      >
        {uploading ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
            <Loader2 size={26} style={{ color: '#F97316', animation: 'spin 1s linear infinite' }} />
            <span style={{ color: '#F97316', fontSize: 14, fontFamily: 'JetBrains Mono, monospace', fontWeight: 600 }}>
              Subiendo imágenes a Supabase Storage...
            </span>
          </div>
        ) : (
          <>
            <div style={{
              width: 52, height: 52, borderRadius: '50%',
              background: 'rgba(249,115,22,0.15)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 12px',
            }}>
              <Upload size={24} style={{ color: '#F97316' }} />
            </div>
            <p style={{ fontSize: 15, color: 'white', margin: '0 0 6px', fontWeight: 700 }}>
              2. Haz clic aquí para seleccionar fotos desde tu dispositivo
            </p>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', margin: 0 }}>
              Se guardarán en la categoría <strong style={{ color: '#F97316' }}>{CATEGORIAS_GALERIA.find(c => c.id === uploadCategory)?.label}</strong> · JPG, PNG, WEBP (hasta 15 MB)
            </p>
          </>
        )}
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleUpload}
          style={{ display: 'none' }}
        />
      </div>

      {/* Barra de Filtros para ver fotos en el panel */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 12,
        marginBottom: 20,
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        paddingBottom: 14,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Filter size={15} style={{ color: 'rgba(255,255,255,0.4)' }} />
          <span style={{ fontSize: 12, fontFamily: 'JetBrains Mono, monospace', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            Fotos en Galería ({filteredImages.length} de {images.length})
          </span>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          <button
            type="button"
            onClick={() => setFilterCategory('todas')}
            style={{
              padding: '5px 12px', borderRadius: 999, fontSize: 11,
              fontFamily: 'JetBrains Mono, monospace', cursor: 'pointer',
              border: filterCategory === 'todas' ? '1px solid #F97316' : '1px solid rgba(255,255,255,0.1)',
              background: filterCategory === 'todas' ? 'rgba(249,115,22,0.2)' : 'rgba(255,255,255,0.03)',
              color: filterCategory === 'todas' ? '#F97316' : 'rgba(255,255,255,0.6)',
            }}
          >
            Todas ({images.length})
          </button>
          {CATEGORIAS_GALERIA.map(cat => {
            const count = images.filter(i => (i.category || 'general') === cat.id).length;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setFilterCategory(cat.id)}
                style={{
                  padding: '5px 12px', borderRadius: 999, fontSize: 11,
                  fontFamily: 'JetBrains Mono, monospace', cursor: 'pointer',
                  border: filterCategory === cat.id ? '1px solid #F97316' : '1px solid rgba(255,255,255,0.1)',
                  background: filterCategory === cat.id ? 'rgba(249,115,22,0.2)' : 'rgba(255,255,255,0.03)',
                  color: filterCategory === cat.id ? '#F97316' : 'rgba(255,255,255,0.6)',
                }}
              >
                {cat.icon} {cat.label} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid de fotos */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: 60 }}>
          <Loader2 size={28} style={{ color: '#F97316', animation: 'spin 1s linear infinite' }} />
        </div>
      ) : filteredImages.length === 0 ? (
        <div style={{
          textAlign: 'center', padding: 48,
          background: 'rgba(255,255,255,0.02)', borderRadius: 16,
          border: '1px dashed rgba(255,255,255,0.1)',
        }}>
          <ImageIcon size={36} style={{ color: 'rgba(255,255,255,0.2)', marginBottom: 12 }} />
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14, margin: '0 0 6px', fontWeight: 600 }}>
            {filterCategory === 'todas'
              ? 'Aún no hay fotos registradas en Supabase.'
              : `No hay fotos en la categoría seleccionada.`}
          </p>
          <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12, margin: 0 }}>
            Usa el recuadro superior para subir imágenes a esta categoría.
          </p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
          gap: 16,
        }}>
          {filteredImages.map(img => (
            <div
              key={img.id}
              style={{
                borderRadius: 14,
                overflow: 'hidden',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.08)',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
              }}
            >
              {/* Contenedor de la foto */}
              <div style={{
                position: 'relative', width: '100%', aspectRatio: '4/3',
                background: 'rgba(0,0,0,0.6)',
              }}>
                <Image
                  src={img.image_url}
                  alt={img.title || 'Foto de galería'}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, 300px"
                  unoptimized
                />

                {/* BOTÓN ELIMINAR VISIBLE Y ACCESIBLE */}
                <button
                  type="button"
                  onClick={() => handleDelete(img)}
                  disabled={deleting === img.id}
                  title="Eliminar foto"
                  style={{
                    position: 'absolute',
                    top: 10,
                    right: 10,
                    zIndex: 20,
                    width: 34,
                    height: 34,
                    borderRadius: '50%',
                    background: 'rgba(220, 38, 38, 0.92)',
                    border: '1px solid rgba(255,255,255,0.3)',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: deleting === img.id ? 'not-allowed' : 'pointer',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.1)')}
                  onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
                >
                  {deleting === img.id ? (
                    <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
                  ) : (
                    <Trash2 size={16} />
                  )}
                </button>

                {/* Badge categoría actual */}
                <div style={{
                  position: 'absolute', bottom: 8, left: 8,
                  padding: '3px 8px', borderRadius: 6,
                  background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)',
                  fontFamily: 'JetBrains Mono, monospace', fontSize: 10,
                  color: '#F97316', border: '1px solid rgba(249,115,22,0.3)',
                }}>
                  {CATEGORIAS_GALERIA.find(c => c.id === (img.category || 'general'))?.label || 'General'}
                </div>
              </div>

              {/* Selector de categoría para cambiarla */}
              <div style={{
                padding: '8px 12px',
                background: 'rgba(12, 5, 12, 0.85)',
                borderTop: '1px solid rgba(255,255,255,0.06)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 8,
              }}>
                <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', fontFamily: 'JetBrains Mono, monospace' }}>
                  Categoría:
                </span>
                <select
                  value={img.category || 'general'}
                  onChange={e => handleUpdateCategory(img.id, e.target.value)}
                  style={{
                    padding: '4px 8px',
                    borderRadius: 6,
                    background: 'rgba(255,255,255,0.08)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    color: 'white',
                    fontSize: 11,
                    fontFamily: 'Inter, sans-serif',
                    outline: 'none',
                    cursor: 'pointer',
                  }}
                >
                  {CATEGORIAS_GALERIA.map(c => (
                    <option key={c.id} value={c.id} style={{ background: '#181018', color: 'white' }}>
                      {c.icon} {c.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Campo para editar el título directamente */}
              <div style={{
                padding: '10px 12px',
                display: 'flex',
                gap: 6,
                alignItems: 'center',
                background: 'rgba(15, 6, 15, 0.95)',
                borderTop: '1px solid rgba(255,255,255,0.06)',
              }}>
                <input
                  type="text"
                  value={img.title || ''}
                  placeholder="Título de la foto..."
                  onChange={e => updateLocalTitle(img.id, e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      handleSaveTitle(img.id, img.title || '');
                    }
                  }}
                  style={{
                    flex: 1,
                    padding: '6px 10px',
                    borderRadius: 8,
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: 'white',
                    fontSize: 12,
                    outline: 'none',
                    fontFamily: 'Inter, sans-serif',
                    boxSizing: 'border-box',
                  }}
                  onFocus={e => (e.target.style.borderColor = '#F97316')}
                  onBlur={() => handleSaveTitle(img.id, img.title || '')}
                />

                <button
                  type="button"
                  onClick={() => handleSaveTitle(img.id, img.title || '')}
                  disabled={savingId === img.id}
                  title="Guardar título"
                  style={{
                    width: 28, height: 28, borderRadius: 6,
                    background: 'rgba(249,115,22,0.15)',
                    border: '1px solid rgba(249,115,22,0.35)',
                    color: '#F97316',
                    cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  {savingId === img.id ? (
                    <Loader2 size={12} style={{ animation: 'spin 1s linear infinite' }} />
                  ) : (
                    <Check size={13} />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Toast de notificación */}
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
          {toast.type === 'ok' ? (
            <CheckCircle size={16} style={{ color: '#34D399' }} />
          ) : (
            <AlertCircle size={16} style={{ color: '#F87171' }} />
          )}
          <span style={{ fontSize: 13, color: 'white', fontWeight: 500 }}>{toast.msg}</span>
        </div>
      )}

      <style>{`@keyframes spin { from { transform:rotate(0deg) } to { transform:rotate(360deg) } }`}</style>
    </div>
  );
}
