'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, MessageSquare, Send, Eye, Sparkles, Loader2, CheckCircle2, User } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface Comentario {
  id: string;
  nombre: string;
  mensaje: string;
  created_at: string;
}

export default function CommunityInteractions() {
  const supabase = createClient();

  // ── Estados ──
  const [visitas, setVisitas] = useState<number>(0);
  const [likes, setLikes] = useState<number>(0);
  const [hasLiked, setHasLiked] = useState<boolean>(false);
  const [likeLoading, setLikeLoading] = useState<boolean>(false);

  // Comentarios
  const [comentarios, setComentarios] = useState<Comentario[]>([]);
  const [nombre, setNombre] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [enviadoOk, setEnviadoOk] = useState(false);

  // ── 1. Registrar Visita única por sesión de navegador ──
  useEffect(() => {
    async function recordVisit() {
      try {
        const hasSession = sessionStorage.getItem('cbta134_visit_logged');
        if (!hasSession) {
          await supabase.from('visitas').insert({ pagina: 'home' });
          sessionStorage.setItem('cbta134_visit_logged', 'true');
        }

        // Consultar visitas totales
        const { count } = await supabase.from('visitas').select('*', { count: 'exact', head: true });
        if (count !== null) setVisitas(count);
      } catch (err) {
        console.error('Error registrando visita:', err);
      }
    }

    recordVisit();
  }, [supabase]);

  // ── 2. Cargar Likes y estado del usuario ──
  useEffect(() => {
    async function loadLikes() {
      try {
        // Conteo total
        const { count } = await supabase.from('likes').select('*', { count: 'exact', head: true });
        if (count !== null) setLikes(count);

        // Identificador persistente en localStorage
        let sessionId = localStorage.getItem('cbta134_user_session');
        if (!sessionId) {
          sessionId = 'user_' + Math.random().toString(36).substring(2, 12);
          localStorage.setItem('cbta134_user_session', sessionId);
        }

        // Verificar si ya dio like
        const { data } = await supabase
          .from('likes')
          .select('id')
          .eq('session_id', sessionId)
          .eq('pagina', 'home')
          .maybeSingle();

        if (data) setHasLiked(true);
      } catch (err) {
        console.error('Error cargando likes:', err);
      }
    }

    loadLikes();
  }, [supabase]);

  // ── 3. Cargar Comentarios ──
  async function loadComentarios() {
    try {
      const { data, error } = await supabase
        .from('comentarios')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);

      if (!error && data) {
        setComentarios(data);
      }
    } catch (err) {
      console.error('Error cargando comentarios:', err);
    }
  }

  useEffect(() => {
    loadComentarios();
  }, [supabase]);

  // ── 4. Acción de Like / Quitar Like ──
  async function handleToggleLike() {
    if (likeLoading) return;
    setLikeLoading(true);

    try {
      const sessionId = localStorage.getItem('cbta134_user_session') || 'anon';

      if (hasLiked) {
        // Quitar like
        await supabase
          .from('likes')
          .delete()
          .eq('session_id', sessionId)
          .eq('pagina', 'home');

        setHasLiked(false);
        setLikes(prev => Math.max(0, prev - 1));
      } else {
        // Dar like
        await supabase
          .from('likes')
          .insert({ session_id: sessionId, pagina: 'home' });

        setHasLiked(true);
        setLikes(prev => prev + 1);
      }
    } catch (err) {
      console.error('Error al cambiar like:', err);
    } finally {
      setLikeLoading(false);
    }
  }

  // ── 5. Enviar Comentario ──
  async function handleSubmitComment(e: React.FormEvent) {
    e.preventDefault();
    if (!nombre.trim() || !mensaje.trim() || enviando) return;

    setEnviando(true);
    try {
      const { error } = await supabase.from('comentarios').insert({
        nombre: nombre.trim(),
        mensaje: mensaje.trim(),
        aprobado: true, // visible inmediatamente para mejor experiencia
      });

      if (!error) {
        setNombre('');
        setMensaje('');
        setEnviadoOk(true);
        loadComentarios();
        setTimeout(() => setEnviadoOk(false), 4000);
      } else {
        alert('No se pudo publicar tu mensaje. Intenta de nuevo.');
      }
    } catch (err) {
      console.error('Error publicando comentario:', err);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <section
      id="comunidad"
      style={{
        backgroundColor: '#0A0404',
        padding: '80px 24px',
        position: 'relative',
        overflow: 'hidden',
        borderTop: '1px solid rgba(249,115,22,0.12)',
        color: 'white',
      }}
    >
      {/* Glow suave */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)', width: '70%', height: '50%', borderRadius: '50%', filter: 'blur(160px)', background: 'radial-gradient(circle, rgba(249,115,22,0.06) 0%, transparent 70%)' }} />
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', position: 'relative', zIndex: 1 }}>

        {/* ── Barra superior: Visitas y Likes ── */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16,
          padding: '20px 28px',
          borderRadius: 20,
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.07)',
          marginBottom: 48,
          backdropFilter: 'blur(12px)',
        }}>
          {/* Contador de visitas */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 42, height: 42, borderRadius: 12,
              background: 'rgba(96,165,250,0.1)', border: '1px solid rgba(96,165,250,0.25)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Eye size={20} color="#60A5FA" />
            </div>
            <div>
              <span style={{
                fontFamily: 'JetBrains Mono, monospace', fontSize: 10,
                color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.15em',
                display: 'block',
              }}>
                Visitas a la página
              </span>
              <p style={{
                fontFamily: 'Cinzel, serif', fontWeight: 800, fontSize: 20, color: 'white', margin: '2px 0 0',
              }}>
                {visitas > 0 ? visitas.toLocaleString() : 'Cargando...'}
              </p>
            </div>
          </div>

          {/* Botón de Like interactivo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <motion.button
              whileTap={{ scale: 0.94 }}
              onClick={handleToggleLike}
              disabled={likeLoading}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '10px 22px', borderRadius: 999,
                background: hasLiked ? 'linear-gradient(135deg, #F87171, #DC2626)' : 'rgba(248,113,113,0.1)',
                border: hasLiked ? 'none' : '1px solid rgba(248,113,113,0.3)',
                color: 'white', cursor: 'pointer',
                fontFamily: 'Cinzel, serif', fontWeight: 700, fontSize: 14,
                boxShadow: hasLiked ? '0 4px 20px rgba(239,68,68,0.4)' : 'none',
                transition: 'all 0.25s',
              }}
            >
              <Heart
                size={18}
                fill={hasLiked ? 'white' : 'transparent'}
                color={hasLiked ? 'white' : '#F87171'}
              />
              <span>{hasLiked ? '¡Te gusta!' : 'Me gusta'}</span>
              <span style={{
                fontFamily: 'JetBrains Mono, monospace', fontSize: 12,
                background: 'rgba(0,0,0,0.25)', padding: '2px 8px', borderRadius: 999,
              }}>
                {likes}
              </span>
            </motion.button>
          </div>
        </div>

        {/* ── Encabezado de la sección de comentarios ── */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <MessageSquare size={16} color="#F97316" />
            <span style={{
              fontFamily: 'JetBrains Mono, monospace', fontSize: 11,
              color: '#F97316', letterSpacing: '0.2em', textTransform: 'uppercase',
            }}>
              Comunidad & Dedicatorias
            </span>
          </div>

          <h2 style={{
            fontFamily: 'Cinzel, serif', fontWeight: 800,
            fontSize: 'clamp(24px, 4vw, 38px)', color: 'white', margin: '0 0 10px',
          }}>
            Muro de Recuerdos y Experiencias
          </h2>
          <p style={{
            fontSize: 14, color: 'rgba(255,255,255,0.6)', maxWidth: 620, margin: '0 auto', lineHeight: 1.6,
          }}>
            Comparte tu experiencia en el festival, una dedicatoria a un ser querido o tus felicitaciones a los estudiantes y la comunidad del CBTA #134.
          </p>
        </div>

        {/* ── Formulario y Lista de comentarios en 2 columnas ── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(clamp(280px, 45%, 480px), 1fr))',
          gap: 32,
          alignItems: 'start',
        }}>

          {/* Formulario */}
          <div style={{
            padding: '28px',
            borderRadius: 20,
            border: '1px solid rgba(255,255,255,0.08)',
            background: 'rgba(255,255,255,0.02)',
            backdropFilter: 'blur(12px)',
          }}>
            <h3 style={{
              fontFamily: 'Cinzel, serif', fontWeight: 700, fontSize: 18, color: 'white', margin: '0 0 16px',
            }}>
              Escribe un mensaje en el muro
            </h3>

            <form onSubmit={handleSubmitComment} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{
                  fontFamily: 'JetBrains Mono, monospace', fontSize: 11,
                  color: 'rgba(255,255,255,0.5)', display: 'block', marginBottom: 6,
                  textTransform: 'uppercase', letterSpacing: '0.05em',
                }}>
                  Tu nombre o seudónimo
                </label>
                <input
                  type="text"
                  required
                  maxLength={50}
                  value={nombre}
                  onChange={e => setNombre(e.target.value)}
                  placeholder="Ej. Familia Hernández / Alumno de 3°A"
                  style={{
                    width: '100%', padding: '11px 14px',
                    borderRadius: 10,
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: 'white', fontSize: 14, outline: 'none',
                    boxSizing: 'border-box', fontFamily: 'Inter, sans-serif',
                  }}
                  onFocus={e => (e.target.style.borderColor = 'rgba(249,115,22,0.5)')}
                  onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
                />
              </div>

              <div>
                <label style={{
                  fontFamily: 'JetBrains Mono, monospace', fontSize: 11,
                  color: 'rgba(255,255,255,0.5)', display: 'block', marginBottom: 6,
                  textTransform: 'uppercase', letterSpacing: '0.05em',
                }}>
                  Mensaje o dedicatoria
                </label>
                <textarea
                  required
                  rows={4}
                  maxLength={300}
                  value={mensaje}
                  onChange={e => setMensaje(e.target.value)}
                  placeholder="Escribe tus palabras sobre el evento, las ofrendas o una dedicatoria especial..."
                  style={{
                    width: '100%', padding: '12px 14px',
                    borderRadius: 10,
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: 'white', fontSize: 14, outline: 'none',
                    boxSizing: 'border-box', fontFamily: 'Inter, sans-serif',
                    resize: 'none', lineHeight: 1.6,
                  }}
                  onFocus={e => (e.target.style.borderColor = 'rgba(249,115,22,0.5)')}
                  onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
                />
                <span style={{
                  fontFamily: 'JetBrains Mono, monospace', fontSize: 10,
                  color: 'rgba(255,255,255,0.3)', display: 'block', textAlign: 'right', marginTop: 4,
                }}>
                  {mensaje.length}/300 caracteres
                </span>
              </div>

              <button
                type="submit"
                disabled={enviando || !nombre.trim() || !mensaje.trim()}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  padding: '13px 20px', borderRadius: 10,
                  background: enviando ? 'rgba(249,115,22,0.4)' : 'linear-gradient(135deg, #F97316, #C2410C)',
                  border: 'none', color: 'white',
                  cursor: enviando ? 'not-allowed' : 'pointer',
                  fontFamily: 'Cinzel, serif', fontWeight: 700, fontSize: 14,
                  boxShadow: '0 4px 18px rgba(249,115,22,0.35)',
                  transition: 'all 0.2s',
                  marginTop: 4,
                }}
              >
                {enviando ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <Send size={15} />}
                {enviando ? 'Publicando...' : 'Publicar en el muro'}
              </button>

              {enviadoOk && (
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '10px 14px', borderRadius: 8,
                  background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)',
                  color: '#34D399', fontSize: 13,
                }}>
                  <CheckCircle2 size={16} />
                  <span>¡Tu mensaje se ha publicado correctamente en el muro!</span>
                </div>
              )}
            </form>
          </div>

          {/* Lista de mensajes publicados */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
              <span style={{
                fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: 'rgba(255,255,255,0.45)',
                textTransform: 'uppercase', letterSpacing: '0.1em',
              }}>
                Mensajes recientes ({comentarios.length})
              </span>
              <button
                onClick={loadComentarios}
                style={{
                  background: 'none', border: 'none', color: '#F97316',
                  cursor: 'pointer', fontFamily: 'JetBrains Mono, monospace', fontSize: 11,
                }}
              >
                ↻ Actualizar
              </button>
            </div>

            {comentarios.length === 0 ? (
              <div style={{
                padding: '36px 24px', borderRadius: 16,
                background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)',
                textAlign: 'center', color: 'rgba(255,255,255,0.35)',
              }}>
                <Sparkles size={24} style={{ color: 'rgba(249,115,22,0.4)', marginBottom: 8 }} />
                <p style={{ margin: 0, fontSize: 14 }}>Aún no hay mensajes en el muro.</p>
                <p style={{ margin: '4px 0 0', fontSize: 12, color: 'rgba(255,255,255,0.25)' }}>
                  ¡Sé el primero en escribir una dedicatoria!
                </p>
              </div>
            ) : (
              <div style={{
                display: 'flex', flexDirection: 'column', gap: 12,
                maxHeight: 460, overflowY: 'auto', paddingRight: 4,
              }}>
                {comentarios.map(c => {
                  const dateStr = new Date(c.created_at).toLocaleDateString('es-MX', {
                    day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
                  });

                  return (
                    <div
                      key={c.id}
                      style={{
                        padding: '16px 18px',
                        borderRadius: 14,
                        border: '1px solid rgba(255,255,255,0.07)',
                        background: 'rgba(255,255,255,0.025)',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div style={{
                            width: 26, height: 26, borderRadius: '50%',
                            background: 'rgba(249,115,22,0.12)', border: '1px solid rgba(249,115,22,0.25)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                          }}>
                            <User size={13} color="#F97316" />
                          </div>
                          <span style={{ fontWeight: 600, fontSize: 13, color: 'white' }}>
                            {c.nombre}
                          </span>
                        </div>
                        <span style={{
                          fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: 'rgba(255,255,255,0.3)',
                        }}>
                          {dateStr}
                        </span>
                      </div>
                      <p style={{
                        fontSize: 13, color: 'rgba(255,255,255,0.75)', lineHeight: 1.6, margin: 0,
                        textAlign: 'justify', textJustify: 'inter-word',
                      }}>
                        {c.mensaje}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>

      </div>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </section>
  );
}
