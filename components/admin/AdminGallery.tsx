'use client';

import { useState, useEffect, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Upload, Trash2, Loader2, Image as ImageIcon, CheckCircle, AlertCircle } from 'lucide-react';
import Image from 'next/image';

interface GalleryImage {
  id: string;
  name: string;
  url: string;
  created_at: string;
}

export default function AdminGallery() {
  const supabase = createClient();
  const fileRef  = useRef<HTMLInputElement>(null);

  const [images, setImages]       = useState<GalleryImage[]>([]);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting]   = useState<string | null>(null);
  const [toast, setToast]         = useState<{ type: 'ok' | 'err'; msg: string } | null>(null);
  const [loading, setLoading]     = useState(true);

  function showToast(type: 'ok' | 'err', msg: string) {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3500);
  }

  async function loadImages() {
    setLoading(true);
    const { data, error } = await supabase
      .from('gallery_images')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) setImages(data);
    setLoading(false);
  }

  useEffect(() => { loadImages(); }, []);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;

    setUploading(true);
    let successCount = 0;

    for (const file of files) {
      // Validar tipo y tamaño
      if (!file.type.startsWith('image/')) { showToast('err', `${file.name} no es una imagen`); continue; }
      if (file.size > 10 * 1024 * 1024) { showToast('err', `${file.name} supera 10 MB`); continue; }

      const ext      = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

      // Subir a Supabase Storage
      const { error: storageError } = await supabase.storage
        .from('gallery')
        .upload(fileName, file, { cacheControl: '3600', upsert: false });

      if (storageError) { showToast('err', `Error subiendo ${file.name}`); continue; }

      // Obtener URL pública
      const { data: { publicUrl } } = supabase.storage.from('gallery').getPublicUrl(fileName);

      // Guardar en BD
      const { error: dbError } = await supabase
        .from('gallery_images')
        .insert({ name: file.name, url: publicUrl });

      if (dbError) { showToast('err', `Error guardando ${file.name}`); continue; }

      successCount++;
    }

    setUploading(false);
    if (fileRef.current) fileRef.current.value = '';

    if (successCount > 0) {
      showToast('ok', `${successCount} foto${successCount > 1 ? 's' : ''} subida${successCount > 1 ? 's' : ''} correctamente ✓`);
      loadImages();
    }
  }

  async function handleDelete(img: GalleryImage) {
    setDeleting(img.id);

    // Extraer nombre del archivo de la URL
    const parts   = img.url.split('/');
    const fileName = parts[parts.length - 1];

    // Borrar de Storage
    await supabase.storage.from('gallery').remove([fileName]);

    // Borrar de BD
    const { error } = await supabase.from('gallery_images').delete().eq('id', img.id);

    setDeleting(null);
    if (error) { showToast('err', 'Error al eliminar'); return; }
    showToast('ok', 'Foto eliminada');
    setImages(prev => prev.filter(i => i.id !== img.id));
  }

  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontFamily: 'Cinzel, serif', fontWeight: 900, fontSize: 22, color: 'white', margin: '0 0 6px' }}>
          📸 Galería de Fotos
        </h1>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', margin: 0 }}>
          Las fotos que subas aparecen automáticamente en la sección Galería del sitio.
        </p>
      </div>

      {/* Upload zone */}
      <div
        onClick={() => !uploading && fileRef.current?.click()}
        style={{
          border: '2px dashed rgba(249,115,22,0.3)',
          borderRadius: 14, padding: '32px 24px',
          textAlign: 'center', cursor: uploading ? 'not-allowed' : 'pointer',
          background: 'rgba(249,115,22,0.03)', marginBottom: 24,
          transition: 'all 0.2s',
        }}
        onMouseEnter={e => { if (!uploading) (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(249,115,22,0.6)'; }}
        onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(249,115,22,0.3)'; }}
      >
        {uploading ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
            <Loader2 size={22} style={{ color: '#F97316', animation: 'spin 1s linear infinite' }} />
            <span style={{ color: '#F97316', fontSize: 14 }}>Subiendo fotos...</span>
          </div>
        ) : (
          <>
            <Upload size={28} style={{ color: 'rgba(249,115,22,0.5)', marginBottom: 10 }} />
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', margin: '0 0 4px', fontWeight: 600 }}>
              Haz clic para subir fotos
            </p>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', margin: 0 }}>
              JPG, PNG, WEBP · Máx 10 MB por foto · Puedes seleccionar varias a la vez
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

      {/* Grid de imágenes */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: 40 }}>
          <Loader2 size={24} style={{ color: '#F97316', animation: 'spin 1s linear infinite' }} />
        </div>
      ) : images.length === 0 ? (
        <div style={{
          textAlign: 'center', padding: 40,
          background: 'rgba(255,255,255,0.02)', borderRadius: 12,
          border: '1px solid rgba(255,255,255,0.05)',
        }}>
          <ImageIcon size={32} style={{ color: 'rgba(255,255,255,0.1)', marginBottom: 10 }} />
          <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 14 }}>
            Aún no hay fotos. ¡Sube la primera!
          </p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
          gap: 12,
        }}>
          {images.map(img => (
            <div key={img.id} style={{
              position: 'relative', borderRadius: 10, overflow: 'hidden',
              aspectRatio: '1', background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.07)',
            }}>
              <Image
                src={img.url}
                alt={img.name}
                fill
                className="object-cover"
                sizes="200px"
              />
              {/* Overlay con botón eliminar */}
              <div style={{
                position: 'absolute', inset: 0,
                background: 'rgba(0,0,0,0)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'background 0.2s',
              }}
                onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.background = 'rgba(0,0,0,0.55)'}
                onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.background = 'rgba(0,0,0,0)'}
              >
                <button
                  onClick={() => handleDelete(img)}
                  disabled={deleting === img.id}
                  style={{
                    width: 36, height: 36, borderRadius: '50%',
                    background: 'rgba(220,38,38,0.85)',
                    border: 'none', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    opacity: 0, transition: 'opacity 0.2s',
                  }}
                  onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.opacity = '1'}
                  onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.opacity = '0'}
                >
                  {deleting === img.id
                    ? <Loader2 size={16} color="white" style={{ animation: 'spin 1s linear infinite' }} />
                    : <Trash2 size={16} color="white" />
                  }
                </button>
              </div>
              {/* Nombre del archivo */}
              <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0,
                background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
                padding: '16px 8px 6px',
              }}>
                <p style={{
                  fontSize: 10, color: 'rgba(255,255,255,0.6)', margin: 0,
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}>{img.name}</p>
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
          background: toast.type === 'ok' ? 'rgba(16,185,129,0.15)' : 'rgba(220,38,38,0.15)',
          border: `1px solid ${toast.type === 'ok' ? 'rgba(16,185,129,0.3)' : 'rgba(220,38,38,0.3)'}`,
          backdropFilter: 'blur(12px)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
        }}>
          {toast.type === 'ok'
            ? <CheckCircle size={16} style={{ color: '#34D399' }} />
            : <AlertCircle size={16} style={{ color: '#F87171' }} />}
          <span style={{ fontSize: 13, color: 'white' }}>{toast.msg}</span>
        </div>
      )}

      <style>{`@keyframes spin { from { transform:rotate(0deg) } to { transform:rotate(360deg) } }`}</style>
    </div>
  );
}
