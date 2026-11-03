'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Award, Users, Star, Clock, Sparkles, Flame,
  Play, ZoomIn, X, Film, Image as ImageIcon,
  ExternalLink, Layers
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

interface ConcursoSectionProps {
  standalone?: boolean;
}

interface OfrendaPhoto {
  id: string;
  type: 'photo';
  title: string;
  src: string;
  category: string;
  created_at?: string;
}

interface OfrendaVideo {
  id: string;
  type: 'video';
  title: string;
  src: string;
  poster: string | null;
  duracion: string;
  category: string;
  created_at?: string;
}

type OfrendaItem = OfrendaPhoto | OfrendaVideo;

// Ofrendas base tradicionales presentes en la página como respaldo
const baseOfrendas: OfrendaPhoto[] = [
  {
    id: 'base-1',
    type: 'photo',
    title: 'Ofrenda Monumental Tradicional',
    src: '/images/tradicion/altar-monumental.png',
    category: 'ofrendas',
  },
  {
    id: 'base-2',
    type: 'photo',
    title: 'Ofrenda para Almas y Mascotas',
    src: '/images/tradicion/almas-mascotas-ofrenda.jpg',
    category: 'ofrendas',
  },
  {
    id: 'base-3',
    type: 'photo',
    title: 'Ofrenda Tradicional de Cempasúchil',
    src: '/images/tradicion/catrina-ofrenda.png',
    category: 'ofrendas',
  },
  {
    id: 'base-4',
    type: 'photo',
    title: 'Altar Tradicional con Pan de Muerto',
    src: '/images/tradicion/ofrenda-tradicional.jpg',
    category: 'ofrendas',
  },
];

const bases = [
  { num: 1, text: 'Participan los grupos de 5to semestre.' },
  { num: 2, text: 'La participación es grupal junto con su tutor.' },
  { num: 3, text: 'Las ofrendas se colocarán el día 28 de octubre de 2026 en el lugar asignado dentro del Auditorio de Aquiahuac, en un horario de 8:00 a 10:00 am.' },
  { num: 4, text: 'A las 10:15 am iniciará el recorrido de autoridades y jurado calificador.' },
  { num: 5, text: 'La ofrenda se dedicará al personaje previamente otorgado al tutor de grupo.' },
  { num: 6, text: 'Todo el grupo deberá participar en la investigación y colocación de la ofrenda.' },
  { num: 7, text: 'Al finalizar el concurso deberán levantar y dejar limpio el lugar asignado.' },
];

const aspectos = [
  { num: 1, text: 'La ofrenda deberá ser tradicional de Tetlanohcan.' },
  { num: 2, text: 'Tres integrantes del grupo serán los encargados de realizar una breve descripción de los elementos que componen la ofrenda.' },
  { num: 3, text: 'Semblanza del personaje a la que va dirigida la ofrenda.' },
  { num: 4, text: 'Creatividad y originalidad en la selección y uso de los materiales.' },
  { num: 5, text: 'La explicación deberá realizarse en un máximo de 15 minutos.' },
  { num: 6, text: 'Finalizarán con una reflexión sobre los motivos de colocar ofrendas y conservar las tradiciones del día de muertos.' },
];

export default function ConcursoSection({ standalone = false }: ConcursoSectionProps) {
  const supabase = createClient();

  const [dbPhotos, setDbPhotos]           = useState<OfrendaPhoto[]>([]);
  const [dbVideos, setDbVideos]           = useState<OfrendaVideo[]>([]);
  const [loadingMedia, setLoadingMedia]   = useState(true);
  const [filterType, setFilterType]       = useState<'all' | 'photos' | 'videos'>('all');

  // Modales
  const [selectedPhoto, setSelectedPhoto] = useState<OfrendaPhoto | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<OfrendaVideo | null>(null);

  // ── Cargar fotos y videos de ofrendas desde Supabase ─────────────────
  async function loadOfrendas() {
    try {
      // 1. Fotos con categoría 'ofrendas'
      const { data: pData, error: pErr } = await supabase
        .from('gallery')
        .select('*')
        .eq('category', 'ofrendas')
        .neq('visible', false)
        .order('created_at', { ascending: false });

      if (!pErr && pData) {
        setDbPhotos(
          pData.map(p => ({
            id: p.id,
            type: 'photo',
            title: p.title || 'Ofrenda Concurso CBTA #134',
            src: p.image_url,
            category: p.category || 'ofrendas',
            created_at: p.created_at,
          }))
        );
      }

      // 2. Videos con categoría 'Ofrendas' (búsqueda flexible)
      const { data: vData, error: vErr } = await supabase
        .from('videos')
        .select('*')
        .ilike('categoria', '%ofrenda%')
        .neq('visible', false)
        .order('created_at', { ascending: false });

      if (!vErr && vData) {
        setDbVideos(
          vData.map(v => ({
            id: v.id,
            type: 'video',
            title: v.titulo || 'Video de Ofrenda',
            src: v.src,
            poster: v.poster || null,
            duracion: v.duracion || '0:30',
            category: v.categoria || 'Ofrendas',
            created_at: v.created_at,
          }))
        );
      }
    } catch (err) {
      console.error('Error cargando ofrendas del concurso:', err);
    } finally {
      setLoadingMedia(false);
    }
  }

  useEffect(() => {
    loadOfrendas();

    // Sincronización en tiempo real: cuando un editor/admin suba una ofrenda
    const channel = supabase
      .channel('concurso_ofrendas_sync')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'gallery' },
        () => loadOfrendas()
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'videos' },
        () => loadOfrendas()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Lista combinada de elementos (fotos dinámicas + videos + ofrendas base tradicionales)
  const allItems: OfrendaItem[] = useMemo(() => {
    // Si hay fotos en la base de datos, mostramos las dinámicas primero y luego las base
    const photosList = dbPhotos.length > 0 ? [...dbPhotos, ...baseOfrendas] : baseOfrendas;
    return [...dbVideos, ...photosList];
  }, [dbPhotos, dbVideos]);

  // Filtrado según pestaña seleccionada
  const filteredItems = useMemo(() => {
    if (filterType === 'photos') return allItems.filter(i => i.type === 'photo');
    if (filterType === 'videos') return allItems.filter(i => i.type === 'video');
    return allItems;
  }, [allItems, filterType]);

  const totalFotos  = allItems.filter(i => i.type === 'photo').length;
  const totalVideos = allItems.filter(i => i.type === 'video').length;

  return (
    <section style={{
      backgroundColor: '#080208',
      padding: 'clamp(32px,5vw,64px) clamp(16px,5vw,40px)',
      position: 'relative', overflow: 'hidden', flex: 1,
    }}>
      {/* BG glows aislados */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', transform: 'translate3d(0,0,0)', contain: 'strict' }}>
        <div style={{ position: 'absolute', top: '10%', left: '-10%', width: '50%', height: '50%', borderRadius: '50%', filter: 'blur(120px)', background: 'radial-gradient(circle, rgba(249,115,22,0.06) 0%, transparent 70%)' }} />
        <div style={{ position: 'absolute', bottom: '10%', right: '-10%', width: '50%', height: '50%', borderRadius: '50%', filter: 'blur(120px)', background: 'radial-gradient(circle, rgba(124,58,237,0.06) 0%, transparent 70%)' }} />
      </div>

      <div style={{ maxWidth: 1040, margin: '0 auto', position: 'relative' }}>

        {/* Encabezado */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: 'clamp(28px,4vw,44px)' }}
        >
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '6px 18px', borderRadius: 999,
            border: '1px solid rgba(234,179,8,0.35)',
            background: 'rgba(234,179,8,0.07)',
            marginBottom: 20,
          }}>
            <Award size={13} color="#EAB308" />
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 'clamp(10px,2vw,11px)', color: 'rgba(234,179,8,0.85)', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
              CBTA No. 134 · Convocatoria Oficial
            </span>
          </div>

          <h1 style={{ fontFamily: 'Cinzel, serif', fontWeight: 900, fontSize: 'clamp(28px,6vw,62px)', color: 'white', margin: '0 0 6px', lineHeight: 1.05 }}>
            CONCURSO DE
          </h1>
          <h1 style={{
            fontFamily: 'Cinzel, serif', fontWeight: 900,
            fontSize: 'clamp(28px,6vw,62px)',
            background: 'linear-gradient(135deg, #F97316, #EAB308)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            margin: '0 0 16px', lineHeight: 1.05,
          }}>
            OFRENDAS
          </h1>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 'clamp(13px,2vw,16px)', color: 'rgba(255,255,255,0.65)', fontStyle: 'italic', margin: '0 0 6px' }}>
            "Honrando nuestras raíces, celebramos la vida"
          </p>
          <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 'clamp(10px,1.8vw,12px)', color: 'rgba(255,255,255,0.4)', margin: 0 }}>
            Tradición que nos une, cultura que nos identifica · Tetlanohcan, Tlaxcala
          </p>
        </motion.div>

        {/* Premio Sorpresa */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          style={{
            marginBottom: 'clamp(28px,4vw,44px)',
            padding: 'clamp(16px,3vw,24px)',
            borderRadius: 'clamp(14px,2vw,20px)',
            border: '1px solid rgba(234,179,8,0.35)',
            background: 'linear-gradient(135deg, rgba(234,179,8,0.08) 0%, rgba(249,115,22,0.06) 100%)',
            display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap',
            justifyContent: 'center', textAlign: 'center',
          }}
        >
          <div style={{ fontSize: 'clamp(28px,5vw,40px)' }}>🎁</div>
          <div>
            <p style={{ fontFamily: 'Cinzel, serif', fontWeight: 900, fontSize: 'clamp(16px,3vw,22px)', color: '#EAB308', margin: '0 0 4px' }}>
              PREMIO SORPRESA
            </p>
            <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 'clamp(10px,1.8vw,12px)', color: 'rgba(255,255,255,0.45)', margin: 0 }}>
              Se otorgará al primer lugar · ¡Participa y sé parte de esta gran tradición!
            </p>
          </div>
        </motion.div>

        {/* ─────────────────────────────────────────────────────────────
            NUEVA SECCIÓN: EXHIBICIÓN DE OFRENDAS (FOTOS Y VIDEOS)
        ───────────────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          style={{
            marginBottom: 'clamp(36px,5vw,56px)',
            padding: 'clamp(20px,4vw,32px)',
            borderRadius: 22,
            border: '1px solid rgba(249,115,22,0.25)',
            background: 'linear-gradient(180deg, rgba(20,8,12,0.95) 0%, rgba(10,4,6,0.98) 100%)',
            boxShadow: '0 12px 40px rgba(0,0,0,0.6)',
          }}
        >
          {/* Cabecera del Escaparate */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 14,
            marginBottom: 20,
            paddingBottom: 16,
            borderBottom: '1px solid rgba(255,255,255,0.08)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: 'rgba(249,115,22,0.15)',
                border: '1px solid rgba(249,115,22,0.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Flame size={18} color="#F97316" />
              </div>
              <div>
                <h2 style={{
                  fontFamily: 'Cinzel, serif',
                  fontWeight: 900,
                  fontSize: 'clamp(18px,3vw,24px)',
                  color: 'white',
                  margin: 0,
                }}>
                  Ofrendas Participantes
                </h2>
                <p style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: 12,
                  color: 'rgba(255,255,255,0.45)',
                  margin: '2px 0 0',
                }}>
                  Exhibición de altares y tributos creados por los alumnos y maestros
                </p>
              </div>
            </div>

            {/* Pestañas de Filtro (Todas / Fotos / Videos) */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              background: 'rgba(255,255,255,0.04)',
              padding: 4,
              borderRadius: 12,
              border: '1px solid rgba(255,255,255,0.08)',
            }}>
              <button
                type="button"
                onClick={() => setFilterType('all')}
                style={{
                  padding: '6px 12px',
                  borderRadius: 8,
                  border: 'none',
                  cursor: 'pointer',
                  background: filterType === 'all' ? 'rgba(249,115,22,0.25)' : 'transparent',
                  color: filterType === 'all' ? '#F97316' : 'rgba(255,255,255,0.5)',
                  fontSize: 12,
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  transition: 'all 0.2s',
                }}
              >
                <Layers size={13} />
                <span>Todas ({allItems.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setFilterType('photos')}
                style={{
                  padding: '6px 12px',
                  borderRadius: 8,
                  border: 'none',
                  cursor: 'pointer',
                  background: filterType === 'photos' ? 'rgba(249,115,22,0.25)' : 'transparent',
                  color: filterType === 'photos' ? '#F97316' : 'rgba(255,255,255,0.5)',
                  fontSize: 12,
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  transition: 'all 0.2s',
                }}
              >
                <ImageIcon size={13} />
                <span>Fotos ({totalFotos})</span>
              </button>

              {totalVideos > 0 && (
                <button
                  type="button"
                  onClick={() => setFilterType('videos')}
                  style={{
                    padding: '6px 12px',
                    borderRadius: 8,
                    border: 'none',
                    cursor: 'pointer',
                    background: filterType === 'videos' ? 'rgba(249,115,22,0.25)' : 'transparent',
                    color: filterType === 'videos' ? '#F97316' : 'rgba(255,255,255,0.5)',
                    fontSize: 12,
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    transition: 'all 0.2s',
                  }}
                >
                  <Film size={13} />
                  <span>Videos ({totalVideos})</span>
                </button>
              )}
            </div>
          </div>

          {/* Cuadrícula de Ofrendas */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(clamp(240px, 30vw, 310px), 1fr))',
            gap: 16,
          }}>
            {filteredItems.map((item, idx) => {
              if (item.type === 'photo') {
                return (
                  <motion.div
                    key={`${item.id}-${idx}`}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.05 }}
                    onClick={() => setSelectedPhoto(item)}
                    style={{
                      position: 'relative',
                      height: 260,
                      borderRadius: 16,
                      overflow: 'hidden',
                      border: '1px solid rgba(255,255,255,0.08)',
                      cursor: 'pointer',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
                      backgroundColor: '#0A0406',
                    }}
                  >
                    <Image
                      src={item.src}
                      alt={item.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover"
                      style={{ filter: 'brightness(0.9)', transition: 'transform 0.6s ease' }}
                      unoptimized={item.src.startsWith('http')}
                    />

                    {/* Badge de Foto */}
                    <div style={{
                      position: 'absolute', top: 10, left: 10,
                      background: 'rgba(0,0,0,0.65)',
                      border: '1px solid rgba(255,255,255,0.15)',
                      borderRadius: 999,
                      padding: '4px 10px',
                      display: 'flex', alignItems: 'center', gap: 5,
                      backdropFilter: 'blur(8px)',
                    }}>
                      <ImageIcon size={11} color="#F97316" />
                      <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: 'white' }}>
                        Ofrenda
                      </span>
                    </div>

                    {/* Overlay de hover */}
                    <div
                      style={{
                        position: 'absolute', inset: 0,
                        background: 'rgba(0,0,0,0)',
                        transition: 'background 0.3s',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'rgba(10,4,4,0.45)')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'rgba(10,4,4,0)')}
                    >
                      <div
                        style={{
                          width: 40, height: 40, borderRadius: '50%',
                          background: 'rgba(249,115,22,0.9)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          opacity: 0, transition: 'opacity 0.3s',
                        }}
                        onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
                      >
                        <ZoomIn size={16} color="white" />
                      </div>
                    </div>

                    {/* Título en la parte inferior */}
                    <div style={{
                      position: 'absolute', bottom: 0, left: 0, right: 0,
                      padding: '14px 14px 12px',
                      background: 'linear-gradient(to top, rgba(8,2,8,0.95) 0%, rgba(8,2,8,0.7) 65%, transparent 100%)',
                    }}>
                      <p style={{
                        color: 'white',
                        fontSize: 13,
                        fontWeight: 700,
                        margin: 0,
                        lineHeight: 1.3,
                        textShadow: '0 1px 4px rgba(0,0,0,0.8)',
                      }}>
                        {item.title}
                      </p>
                      <p style={{
                        fontFamily: 'JetBrains Mono, monospace',
                        fontSize: 10,
                        color: '#FBBF24',
                        margin: '3px 0 0',
                      }}>
                        CBTA #134 · 5to Semestre
                      </p>
                    </div>
                  </motion.div>
                );
              }

              // Tarjeta de Video
              return (
                <motion.div
                  key={`${item.id}-${idx}`}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  onClick={() => setSelectedVideo(item)}
                  style={{
                    position: 'relative',
                    height: 260,
                    borderRadius: 16,
                    overflow: 'hidden',
                    border: '1px solid rgba(234,179,8,0.3)',
                    cursor: 'pointer',
                    boxShadow: '0 4px 25px rgba(234,179,8,0.15)',
                    backgroundColor: '#0A0406',
                  }}
                >
                  {/* Poster de fondo o video */}
                  {item.poster ? (
                    <Image
                      src={item.poster}
                      alt={item.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover"
                      style={{ filter: 'brightness(0.75)' }}
                      unoptimized={item.poster.startsWith('http')}
                    />
                  ) : (
                    <video
                      src={item.src}
                      muted
                      preload="metadata"
                      style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.75)' }}
                    />
                  )}

                  {/* Badge de Video con Duración */}
                  <div style={{
                    position: 'absolute', top: 10, left: 10,
                    background: 'rgba(234,179,8,0.9)',
                    borderRadius: 999,
                    padding: '4px 10px',
                    display: 'flex', alignItems: 'center', gap: 5,
                    boxShadow: '0 2px 10px rgba(0,0,0,0.5)',
                  }}>
                    <Film size={11} color="#080208" />
                    <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: '#080208', fontWeight: 800 }}>
                      Video · {item.duracion}
                    </span>
                  </div>

                  {/* Botón Central de Play */}
                  <div style={{
                    position: 'absolute', inset: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <div style={{
                      width: 52, height: 52, borderRadius: '50%',
                      background: 'linear-gradient(135deg, #F97316, #EAB308)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      boxShadow: '0 0 25px rgba(249,115,22,0.6)',
                      transition: 'transform 0.2s',
                    }}>
                      <Play size={22} color="white" style={{ marginLeft: 3 }} />
                    </div>
                  </div>

                  {/* Título en la parte inferior */}
                  <div style={{
                    position: 'absolute', bottom: 0, left: 0, right: 0,
                    padding: '14px 14px 12px',
                    background: 'linear-gradient(to top, rgba(8,2,8,0.95) 0%, rgba(8,2,8,0.7) 65%, transparent 100%)',
                  }}>
                    <p style={{
                      color: 'white',
                      fontSize: 13,
                      fontWeight: 700,
                      margin: 0,
                      lineHeight: 1.3,
                    }}>
                      {item.title}
                    </p>
                    <p style={{
                      fontFamily: 'JetBrains Mono, monospace',
                      fontSize: 10,
                      color: '#EAB308',
                      margin: '3px 0 0',
                    }}>
                      Video de Ofrenda · Reproducir
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Aviso para editores */}
          <div style={{
            marginTop: 20,
            padding: '10px 14px',
            borderRadius: 12,
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.06)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 10,
            fontSize: 11,
            color: 'rgba(255,255,255,0.45)',
          }}>
            <span>
              💡 ¿Tienes fotos o videos de tu ofrenda? Los editores autorizados pueden agregarlos desde el panel.
            </span>
            <Link
              href="/editor"
              style={{
                color: '#F97316',
                textDecoration: 'none',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: 4,
              }}
            >
              <span>Subir en Panel de Editor</span>
              <ExternalLink size={12} />
            </Link>
          </div>
        </motion.div>

        {/* Dos columnas: Bases + Aspectos a Evaluar */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(clamp(260px,40vw,420px), 1fr))',
          gap: 'clamp(20px,3vw,32px)',
        }}>

          {/* BASES */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div style={{
              display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20,
              padding: '10px 16px', borderRadius: 999,
              background: 'rgba(249,115,22,0.1)',
              border: '1px solid rgba(249,115,22,0.3)',
              width: 'fit-content',
            }}>
              <Users size={15} color="#F97316" />
              <span style={{ fontFamily: 'Cinzel, serif', fontWeight: 700, fontSize: 'clamp(13px,2.5vw,16px)', color: '#F97316', letterSpacing: '0.1em' }}>
                BASES DEL CONCURSO
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {bases.map((b) => (
                <div key={b.num} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <div style={{
                    width: 26, height: 26, borderRadius: '50%', flexShrink: 0,
                    background: 'rgba(249,115,22,0.15)',
                    border: '1px solid rgba(249,115,22,0.35)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: 11, color: '#F97316', fontWeight: 700,
                  }}>
                    {b.num}
                  </div>
                  <p style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: 'clamp(12px,2vw,14px)',
                    color: 'rgba(255,255,255,0.72)',
                    margin: 0, lineHeight: 1.6,
                  }}>
                    {b.text}
                  </p>
                </div>
              ))}
            </div>

            <p style={{
              marginTop: 20,
              fontFamily: 'Inter, sans-serif', fontStyle: 'italic',
              fontSize: 'clamp(12px,2vw,14px)',
              color: 'rgba(249,115,22,0.6)',
            }}>
              ¡Tu creatividad también honra nuestras tradiciones!
            </p>
          </motion.div>

          {/* ASPECTOS A EVALUAR */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div style={{
              display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20,
              padding: '10px 16px', borderRadius: 999,
              background: 'rgba(124,58,237,0.1)',
              border: '1px solid rgba(124,58,237,0.3)',
              width: 'fit-content',
            }}>
              <Star size={15} color="#7C3AED" />
              <span style={{ fontFamily: 'Cinzel, serif', fontWeight: 700, fontSize: 'clamp(13px,2.5vw,16px)', color: '#A78BFA', letterSpacing: '0.1em' }}>
                ASPECTOS A EVALUAR
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {aspectos.map((a) => (
                <div key={a.num} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <div style={{
                    width: 26, height: 26, borderRadius: '50%', flexShrink: 0,
                    background: 'rgba(124,58,237,0.15)',
                    border: '1px solid rgba(124,58,237,0.35)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: 11, color: '#A78BFA', fontWeight: 700,
                  }}>
                    {a.num}
                  </div>
                  <p style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: 'clamp(12px,2vw,14px)',
                    color: 'rgba(255,255,255,0.72)',
                    margin: 0, lineHeight: 1.6,
                  }}>
                    {a.text}
                  </p>
                </div>
              ))}
            </div>

            <p style={{
              marginTop: 20,
              fontFamily: 'Inter, sans-serif', fontStyle: 'italic',
              fontSize: 'clamp(12px,2vw,14px)',
              color: 'rgba(124,58,237,0.65)',
            }}>
              ¡Participa y sé parte de esta gran tradición!
            </p>
          </motion.div>
        </div>

        {/* Nota al pie de fecha y horario */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          style={{
            marginTop: 40,
            padding: 'clamp(14px,2vw,18px) clamp(16px,3vw,24px)',
            borderRadius: 14,
            border: '1px solid rgba(255,255,255,0.05)',
            background: 'rgba(255,255,255,0.02)',
            display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap',
          }}
        >
          <Clock size={13} color="#F97316" />
          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 'clamp(10px,1.8vw,11px)', color: 'rgba(255,255,255,0.35)' }}>
            Colocación de ofrendas: 8:00 – 10:00 am · Recorrido del jurado: 10:15 am · Auditorio de Aquiahuac, Tetlanohcan, Tlaxcala
          </span>
        </motion.div>

        {/* Fuente oficial */}
        <p style={{
          marginTop: 16, textAlign: 'right',
          fontFamily: 'JetBrains Mono, monospace', fontSize: 10,
          color: 'rgba(255,255,255,0.18)',
        }}>
          Fuente: Convocatoria oficial CBTA No. 134 · Octubre 2026
        </p>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          MODAL: LIGHTBOX DE FOTO EN PANTALLA COMPLETA
      ───────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {selectedPhoto && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedPhoto(null)}
              style={{
                position: 'fixed', inset: 0,
                background: 'rgba(0,0,0,0.95)',
                zIndex: 120,
                backdropFilter: 'blur(16px)',
              }}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              style={{
                position: 'fixed', inset: 0,
                zIndex: 120,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: '24px 16px',
                pointerEvents: 'none',
              }}
            >
              <div style={{ position: 'relative', width: '100%', maxWidth: 880, pointerEvents: 'all' }}>
                <button
                  onClick={() => setSelectedPhoto(null)}
                  style={{
                    position: 'absolute', top: -16, right: -16,
                    zIndex: 10, width: 36, height: 36,
                    borderRadius: '50%', background: '#F97316',
                    border: 'none',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: '0 4px 14px rgba(0,0,0,0.5)',
                  }}
                >
                  <X size={18} color="white" />
                </button>

                <div style={{
                  position: 'relative',
                  width: '100%',
                  height: '70vh',
                  borderRadius: 20,
                  overflow: 'hidden',
                  border: '1px solid rgba(255,255,255,0.15)',
                  backgroundColor: '#0A0406',
                }}>
                  <Image
                    src={selectedPhoto.src}
                    alt={selectedPhoto.title}
                    fill
                    className="object-contain"
                    unoptimized={selectedPhoto.src.startsWith('http')}
                  />
                </div>

                <div style={{ textAlign: 'center', marginTop: 12 }}>
                  <p style={{
                    color: 'white',
                    fontSize: 15,
                    fontWeight: 700,
                    margin: 0,
                  }}>
                    {selectedPhoto.title}
                  </p>
                  <p style={{
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: 11,
                    color: '#F97316',
                    marginTop: 3,
                  }}>
                    Concurso de Ofrendas · CBTA #134
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ─────────────────────────────────────────────────────────────
          MODAL: REPRODUCTOR DE VIDEO DE OFRENDA
      ───────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {selectedVideo && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedVideo(null)}
              style={{
                position: 'fixed', inset: 0,
                background: 'rgba(0,0,0,0.96)',
                zIndex: 120,
                backdropFilter: 'blur(16px)',
              }}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              style={{
                position: 'fixed', inset: 0,
                zIndex: 120,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: '24px 16px',
                pointerEvents: 'none',
              }}
            >
              <div style={{ position: 'relative', width: '100%', maxWidth: 800, pointerEvents: 'all' }}>
                <button
                  onClick={() => setSelectedVideo(null)}
                  style={{
                    position: 'absolute', top: -16, right: -16,
                    zIndex: 10, width: 36, height: 36,
                    borderRadius: '50%', background: '#EAB308',
                    border: 'none',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: '0 4px 14px rgba(0,0,0,0.5)',
                  }}
                >
                  <X size={18} color="#080208" />
                </button>

                <div style={{
                  position: 'relative',
                  width: '100%',
                  borderRadius: 20,
                  overflow: 'hidden',
                  border: '1px solid rgba(234,179,8,0.4)',
                  backgroundColor: '#000000',
                  boxShadow: '0 20px 60px rgba(0,0,0,0.9), 0 0 40px rgba(234,179,8,0.2)',
                }}>
                  <video
                    src={selectedVideo.src}
                    controls
                    autoPlay
                    playsInline
                    style={{ width: '100%', maxHeight: '72vh', display: 'block', backgroundColor: '#000' }}
                  />
                </div>

                <div style={{ textAlign: 'center', marginTop: 14 }}>
                  <p style={{
                    color: 'white',
                    fontSize: 16,
                    fontWeight: 700,
                    margin: 0,
                  }}>
                    {selectedVideo.title}
                  </p>
                  <p style={{
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: 11,
                    color: '#EAB308',
                    marginTop: 4,
                  }}>
                    Video de Ofrenda · Duración: {selectedVideo.duracion} · CBTA #134
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </section>
  );
}
