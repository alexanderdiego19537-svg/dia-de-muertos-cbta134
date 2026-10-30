'use client';

import { useState, useEffect, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Upload, Trash2, Loader2, Image as ImageIcon, CheckCircle, AlertCircle } from 'lucide-react';
import Image from 'next/image';

interface GalleryItem {
  id: string;
  title: string | null;
  image_url: string;
  category?: string;
  visible?: boolean;
  created_at: string;
}

export default function AdminGallery() {
  const supabase = createClient();
  const fileRef  = useRef<HTMLInputElement>(null);

  const [images, setImages]       = useState<GalleryItem[]>([]);
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
      .from('gallery')
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
      if (!file.type.startsWith('image/')) {
        showToast('err', `${file.name} no es una imagen válida`);
        continue;
      }
      if (file.size > 15 * 1024 * 1024) {
        showToast('err', `${file.name} supera 15 MB`);
        continue;
      }

      const ext = file.name.split('.').pop() || 'jpg';
      const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const fileName = `${Date.now()}-${cleanName}`;

      // 1. Subir a Supabase Storage (bucket: 'gallery')
      const { error: storageError } = await supabase.storage
        .from('gallery')
        .upload(fileName, file, { cacheControl: '3600', upsert: false });

      if (storageError) {
        console.error('Storage upload error:', storageError);
        showToast('err', `Error al subir ${file.name}: ${storageError.message}`);
        continue;
      }

      // 2. Obtener URL pública
      const { data: { publicUrl } } = supabase.storage
        .from('gallery')
        .getPublicUrl(fileName);

      // 3. Guardar registro en la tabla 'gallery'
      const { error: dbError } = await supabase
        .from('gallery')
        .insert({
          title: file.name.replace(/\.[^/.]+$/, ''),
          image_url: publicUrl,
          category: 'general',
          visible: true,
        });

      if (dbError) {
        console.error('DB insert error:', dbError);
        showToast('err', `Error al registrar ${file.name}`);
        continue;
      }

      successCount++;
    }

    setUploading(false);
    if (fileRef.current) fileRef.current.value = '';

    if (successCount > 0) {
      showToast('ok', `${successCount} foto${successCount > 1 ? 's' : ''} subida${successCount > 1 ? 's' : ''} con éxito ✓`);
      loadImages();
    }
  }

  async function handleDelete(img: GalleryItem) {
    if (!confirm('¿Seguro que deseas eliminar esta imagen?')) return;
    setDeleting(img.id);

    try {
      // Extraer nombre del archivo del URL
      const parts = img.image_url.split('/');
      const fileName = parts[parts.length - 1];

      // Borrar de Storage
      await supabase.storage.from('gallery').remove([fileName]);

      // Borrar de la tabla 'gallery'
      const { error } = await supabase.from('gallery').delete().eq('id', img.id);

      if (error) {
        showToast('err', 'Error al eliminar de la base de datos');
      } else {
        showToast('ok', 'Foto eliminada');
        setImages(prev => prev.filter(i => i.id !== img.id));
      }
    } catch (err) {
      console.error(err);
      showToast('err', 'Ocurrió un error inesperado al eliminar');
    } finally {
      setDeleting(null);
    }
  }

  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontFamily: 'Cinzel, serif', fontWeight: 900, fontSize: 22, color: 'white', margin: '0 0 6px' }}>
          📸 Galería de Fotos (Supabase)
        </h1>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', margin: 0 }}>
          Las fotos que subas aquí se almacenan en Supabase Storage y se reflejan en tiempo real en la página pública.
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
            <span style={{ color: '#F97316', fontSize: 14, fontFamily: 'JetBrains Mono, monospace' }}>
              Subiendo a Supabase Storage...
            </span>
          </div>
        ) : (
          <>
            <Upload size={28} style={{ color: 'rgba(249,115,22,0.6)', marginBottom: 10 }} />
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)', margin: '0 0 4px', fontWeight: 600 }}>
              Haz clic para seleccionar y subir fotos
            </p>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', margin: 0 }}>
              JPG, PNG, WEBP · Hasta 15 MB por foto · Múltiples fotos simultáneas
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

      {/* Grid de fotos subidas */}
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
          <ImageIcon size={32} style={{ color: 'rgba(255,255,255,0.2)', marginBottom: 10 }} />
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, margin: 0 }}>
            Aún no hay fotos en Supabase. ¡Sube la primera para que aparezca en el sitio web!
          </p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
          gap: 14,
        }}>
          {images.map(img => (
            <div key={img.id} style={{
              position: 'relative', borderRadius: 12, overflow: 'hidden',
              aspectRatio: '1', background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)',
            }}>
              <Image
                src={img.image_url}
                alt={img.title || 'Foto de galería'}
                fill
                className="object-cover"
                sizes="220px"
              />

              {/* Botón eliminar al hacer hover */}
              <div style={{
                position: 'absolute', inset: 0,
                background: 'rgba(0,0,0,0)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'background 0.2s',
              }}
                onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.background = 'rgba(0,0,0,0.6)'}
                onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.background = 'rgba(0,0,0,0)'}
              >
                <button
                  onClick={() => handleDelete(img)}
                  disabled={deleting === img.id}
                  title="Eliminar foto"
                  style={{
                    width: 38, height: 38, borderRadius: '50%',
                    background: 'rgba(220,38,38,0.9)',
                    border: 'none', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    opacity: 0, transition: 'opacity 0.2s, transform 0.2s',
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLButtonElement).style.opacity = '1';
                    (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.1)';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLButtonElement).style.opacity = '0';
                    (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)';
                  }}
                >
                  {deleting === img.id
                    ? <Loader2 size={16} color="white" style={{ animation: 'spin 1s linear infinite' }} />
                    : <Trash2 size={16} color="white" />
                  }
                </button>
              </div>

              {/* Título de la imagen */}
              <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0,
                background: 'linear-gradient(transparent, rgba(0,0,0,0.85))',
                padding: '16px 10px 8px',
              }}>
                <p style={{
                  fontSize: 11, color: 'white', margin: 0,
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  fontFamily: 'Inter, sans-serif',
                }}>
                  {img.title || 'Foto'}
                </p>
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
          background: toast.type === 'ok' ? 'rgba(16,185,129,0.2)' : 'rgba(220,38,38,0.2)',
          border: `1px solid ${toast.type === 'ok' ? 'rgba(16,185,129,0.4)' : 'rgba(220,38,38,0.4)'}`,
          backdropFilter: 'blur(16px)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
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
