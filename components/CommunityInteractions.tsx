'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, MessageSquare, Send, Eye, Sparkles, Loader2, CheckCircle2, User, Lock, Edit2, Trash2, Check, X, ArrowRight } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';

interface Comentario {
  id: string;
  nombre: string;
  mensaje: string;
  user_id?: string;
  created_at: string;
}

export default function CommunityInteractions() {
  const supabase = createClient();

  // ── Estados de Interacción ──
  const [visitas, setVisitas] = useState<number>(0);
  const [likes, setLikes] = useState<number>(0);
  const [hasLiked, setHasLiked] = useState<boolean>(false);
  const [likeLoading, setLikeLoading] = useState<boolean>(false);

  // ── Estados de Usuario Autenticado ──
  const [currentUser, setCurrentUser]       = useState<{ id: string; email?: string } | null>(null);
  const [currentProfile, setCurrentProfile] = useState<{ full_name: string; role: string } | null>(null);
  const [authLoading, setAuthLoading]       = useState(true);

  // ── Comentarios ──
  const [comentarios, setComentarios] = useState<Comentario[]>([]);
  const [mensaje, setMensaje]         = useState('');
  const [enviando, setEnviando]       = useState(false);
  const [enviadoOk, setEnviadoOk]     = useState(false);

  // Edición de comentario propio
  const [editingId, setEditingId]     = useState<string | null>(null);
  const [editingText, setEditingText] = useState('');
  const [savingEdit, setSavingEdit]   = useState(false);

  // ── 1. Cargar estadísticas reales (visitas y likes) ──
  async function fetchCounts() {
    try {
      const [vRes, lRes] = await Promise.all([
        supabase.from('visitas').select('*', { count: 'exact', head: true }),
        supabase.from('likes').select('*', { count: 'exact', head: true }),
      ]);
      if (vRes.count !== null) setVisitas(vRes.count);
      if (lRes.count !== null) setLikes(lRes.count);
    } catch (err) {
      console.error('Error cargando estadísticas:', err);
    }
  }

  // ── 2. Cargar sesión y perfil del usuario ──
  async function loadUserSession() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setCurrentUser({ id: user.id, email: user.email });
        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name, role')
          .eq('id', user.id)
          .maybeSingle();

        if (profile) {
          setCurrentProfile(profile);
        } else {
          setCurrentProfile({
            full_name: user.email ? user.email.split('@')[0] : 'Visitante',
            role: 'user',
          });
        }
      } else {
        setCurrentUser(null);
        setCurrentProfile(null);
      }
    } catch (err) {
      console.error('Error cargando usuario:', err);
    } finally {
      setAuthLoading(false);
    }
  }

  // ── 3. Cargar estado de Like del usuario actual ──
  async function checkUserLike() {
    try {
      const sessionId = localStorage.getItem('cbta134_device_id') || localStorage.getItem('cbta134_user_session');
      if (!sessionId) return;

      const { data } = await supabase
        .from('likes')
        .select('id')
        .eq('session_id', sessionId)
        .eq('pagina', 'home')
        .maybeSingle();

      if (data) setHasLiked(true);
    } catch (err) {
      console.error('Error verificando like:', err);
    }
  }

  // ── 4. Cargar Comentarios ──
  async function loadComentarios() {
    try {
      const { data, error } = await supabase
        .from('comentarios')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(30);

      if (!error && data) {
        setComentarios(data);
      }
    } catch (err) {
      console.error('Error cargando comentarios:', err);
    }
  }

  // ── 5. Sincronización en Tiempo Real (WebSockets + Polling de Respaldo) ──
  useEffect(() => {
    fetchCounts();
    loadUserSession();
    checkUserLike();
    loadComentarios();

    // Suscripción Realtime multicanal
    const channel = supabase.channel('cbta134_stats_sync')
      .on('broadcast', { event: 'visit_logged' }, () => fetchCounts())
      .on('broadcast', { event: 'like_toggled' }, () => fetchCounts())
      .on('broadcast', { event: 'comment_added' }, () => {
        fetchCounts();
        loadComentarios();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'visitas' }, () => fetchCounts())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'likes' }, () => fetchCounts())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'comentarios' }, () => {
        fetchCounts();
        loadComentarios();
      })
      .subscribe();

    const handleFocus = () => {
      fetchCounts();
      loadComentarios();
      loadUserSession();
    };
    window.addEventListener('focus', handleFocus);

    const interval = setInterval(fetchCounts, 10000);

    return () => {
      supabase.removeChannel(channel);
      window.removeEventListener('focus', handleFocus);
      clearInterval(interval);
    };
  }, []);

  // ── 6. Acción de Like / Quitar Like con Difusión en Vivo ──
  async function handleToggleLike() {
    if (likeLoading) return;
    setLikeLoading(true);

    try {
      let sessionId = localStorage.getItem('cbta134_device_id') || localStorage.getItem('cbta134_user_session');
      if (!sessionId) {
        sessionId = 'user_' + Math.random().toString(36).substring(2, 12);
        localStorage.setItem('cbta134_device_id', sessionId);
      }

      if (hasLiked) {
        await supabase
          .from('likes')
          .delete()
          .eq('session_id', sessionId)
          .eq('pagina', 'home');

        setHasLiked(false);
        setLikes(prev => Math.max(0, prev - 1));
      } else {
        await supabase
          .from('likes')
          .insert({ session_id: sessionId, pagina: 'home' });

        setHasLiked(true);
        setLikes(prev => prev + 1);
      }

      const channel = supabase.channel('cbta134_stats_sync');
      channel.subscribe(status => {
        if (status === 'SUBSCRIBED') {
          channel.send({
            type: 'broadcast',
            event: 'like_toggled',
            payload: {},
          });
        }
      });
    } catch (err) {
      console.error('Error al cambiar like:', err);
    } finally {
      setLikeLoading(false);
    }
  }

  // ── 7. Enviar Comentario (Autenticado con Nombre Automático) ──
  async function handleSubmitComment(e: React.FormEvent) {
    e.preventDefault();
    if (!currentUser || !mensaje.trim() || enviando) return;

    setEnviando(true);
    try {
      const authorName = currentProfile?.full_name || currentUser.email?.split('@')[0] || 'Visitante';

      const { error } = await supabase.from('comentarios').insert({
        nombre: authorName,
        mensaje: mensaje.trim(),
        user_id: currentUser.id,
        aprobado: true,
      });

      if (!error) {
        setMensaje('');
        setEnviadoOk(true);
        loadComentarios();
        setTimeout(() => setEnviadoOk(false), 4000);

        // Difusión en tiempo real
        const channel = supabase.channel('cbta134_stats_sync');
        channel.subscribe(status => {
          if (status === 'SUBSCRIBED') {
            channel.send({
              type: 'broadcast',
              event: 'comment_added',
              payload: {},
            });
          }
        });
      } else {
        alert('No se pudo publicar tu mensaje. Verifica tu conexión e intenta de nuevo.');
      }
    } catch (err) {
      console.error('Error publicando comentario:', err);
    } finally {
      setEnviando(false);
    }
  }

  // ── 8. Editar Comentario Propio ──
  async function handleSaveEdit(id: string) {
    if (!editingText.trim() || savingEdit) return;
    setSavingEdit(true);

    try {
      const { error } = await supabase
        .from('comentarios')
        .update({ mensaje: editingText.trim() })
        .eq('id', id);

      if (!error) {
        setComentarios(prev => prev.map(c => c.id === id ? { ...c, mensaje: editingText.trim() } : c));
        setEditingId(null);
        setEditingText('');

        const channel = supabase.channel('cbta134_stats_sync');
        channel.subscribe(status => {
          if (status === 'SUBSCRIBED') {
            channel.send({ type: 'broadcast', event: 'comment_added', payload: {} });
          }
        });
      } else {
        alert('No se pudo actualizar el comentario.');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSavingEdit(false);
    }
  }

  // ── 9. Eliminar Comentario Propio o Admin ──
  async function handleDeleteComment(id: string) {
    if (!confirm('¿Seguro que deseas eliminar este comentario?')) return;

    try {
      const { error } = await supabase
        .from('comentarios')
        .delete()
        .eq('id', id);

      if (!error) {
        setComentarios(prev => prev.filter(c => c.id !== id));
        const channel = supabase.channel('cbta134_stats_sync');
        channel.subscribe(status => {
          if (status === 'SUBSCRIBED') {
            channel.send({ type: 'broadcast', event: 'comment_added', payload: {} });
          }
        });
      } else {
        alert('No se pudo eliminar el comentario.');
      }
    } catch (err) {
      console.error(err);
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
        <div style={{
          position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)',
          width: '70%', height: '50%', borderRadius: '50%', filter: 'blur(160px)',
          background: 'radial-gradient(circle, rgba(249,115,22,0.06) 0%, transparent 70%)',
        }} />
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

          {/* Columna Izquierda: Formulario o Invitación a Iniciar Sesión */}
          <div>
            {authLoading ? (
              <div style={{ padding: 40, textAlign: 'center' }}>
                <Loader2 size={24} color="#F97316" style={{ animation: 'spin 1s linear infinite' }} />
              </div>
            ) : !currentUser ? (
              /* Usuario NO autenticado: Tarjeta de Invitación */
              <div style={{
                padding: '32px 28px',
                borderRadius: 20,
                border: '1px solid rgba(249,115,22,0.25)',
                background: 'rgba(249,115,22,0.03)',
                backdropFilter: 'blur(12px)',
                textAlign: 'center',
              }}>
                <div style={{
                  width: 52, height: 52, borderRadius: '50%',
                  background: 'rgba(249,115,22,0.12)', border: '1px solid rgba(249,115,22,0.3)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 16px',
                }}>
                  <Lock size={22} color="#F97316" />
                </div>

                <h3 style={{
                  fontFamily: 'Cinzel, serif', fontWeight: 700, fontSize: 18, color: 'white', margin: '0 0 10px',
                }}>
                  ¿Deseas escribir en el muro?
                </h3>

                <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)', lineHeight: 1.6, margin: '0 0 22px' }}>
                  Inicia sesión o regístrate en segundos. Tu nombre se colocará de forma automática (tu correo nunca será público) y podrás editar o borrar tu mensaje cuando gustes.
                </p>

                <Link
                  href="/login?returnTo=/#comunidad"
                  style={{
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                    width: '100%', maxWidth: 280,
                    padding: '13px 22px', borderRadius: 12,
                    background: 'linear-gradient(135deg, #F97316, #C2410C)',
                    color: 'white', textDecoration: 'none',
                    fontFamily: 'Cinzel, serif', fontWeight: 700, fontSize: 14,
                    boxShadow: '0 4px 20px rgba(249,115,22,0.35)',
                    transition: 'transform 0.2s',
                    boxSizing: 'border-box',
                  }}
                >
                  <User size={16} />
                  <span>Iniciar Sesión / Registrarme</span>
                  <ArrowRight size={15} />
                </Link>
              </div>
            ) : (
              /* Usuario SÍ autenticado: Formulario Directo */
              <div style={{
                padding: '28px',
                borderRadius: 20,
                border: '1px solid rgba(255,255,255,0.08)',
                background: 'rgba(255,255,255,0.02)',
                backdropFilter: 'blur(12px)',
              }}>
                {/* Banner de Autor */}
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '10px 14px', borderRadius: 10,
                  background: 'rgba(249,115,22,0.08)', border: '1px solid rgba(249,115,22,0.2)',
                  marginBottom: 18,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{
                      width: 24, height: 24, borderRadius: '50%',
                      background: 'rgba(249,115,22,0.2)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <User size={13} color="#F97316" />
                    </div>
                    <span style={{ fontSize: 13, color: 'white' }}>
                      Comentando como: <strong style={{ color: '#F97316' }}>{currentProfile?.full_name || currentUser.email?.split('@')[0]}</strong>
                    </span>
                  </div>
                  <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', fontFamily: 'JetBrains Mono, monospace' }}>
                    Privacidad protegida ✓
                  </span>
                </div>

                <h3 style={{
                  fontFamily: 'Cinzel, serif', fontWeight: 700, fontSize: 18, color: 'white', margin: '0 0 16px',
                }}>
                  Escribe tu mensaje o dedicatoria
                </h3>

                <form onSubmit={handleSubmitComment} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div>
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
                    disabled={enviando || !mensaje.trim()}
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
            )}
          </div>

          {/* Columna Derecha: Lista de mensajes publicados con opción de Editar/Eliminar */}
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
                  const isAuthor = currentUser && c.user_id === currentUser.id;
                  const isAdmin  = currentProfile?.role === 'admin';
                  const isEditing = editingId === c.id;

                  const dateStr = new Date(c.created_at).toLocaleDateString('es-MX', {
                    day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
                  });

                  return (
                    <div
                      key={c.id}
                      style={{
                        padding: '16px 18px',
                        borderRadius: 14,
                        border: isAuthor ? '1px solid rgba(249,115,22,0.3)' : '1px solid rgba(255,255,255,0.07)',
                        background: isAuthor ? 'rgba(249,115,22,0.03)' : 'rgba(255,255,255,0.025)',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div style={{
                            width: 26, height: 26, borderRadius: '50%',
                            background: isAuthor ? 'rgba(249,115,22,0.2)' : 'rgba(255,255,255,0.1)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                          }}>
                            <User size={13} color={isAuthor ? '#F97316' : 'white'} />
                          </div>
                          <div>
                            <span style={{ fontWeight: 600, fontSize: 13, color: isAuthor ? '#F97316' : 'white' }}>
                              {c.nombre || 'Visitante'}
                            </span>
                            {isAuthor && (
                              <span style={{ fontSize: 10, color: '#F97316', marginLeft: 6, fontFamily: 'JetBrains Mono, monospace' }}>
                                (Tú)
                              </span>
                            )}
                          </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{
                            fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: 'rgba(255,255,255,0.3)',
                          }}>
                            {dateStr}
                          </span>

                          {/* Botón Editar (Solo para el autor) */}
                          {isAuthor && !isEditing && (
                            <button
                              onClick={() => {
                                setEditingId(c.id);
                                setEditingText(c.mensaje);
                              }}
                              title="Editar mi comentario"
                              style={{
                                background: 'none', border: 'none', color: 'rgba(255,255,255,0.45)',
                                cursor: 'pointer', padding: 2, display: 'flex', alignItems: 'center',
                              }}
                              onMouseEnter={e => (e.currentTarget.style.color = '#F97316')}
                              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.45)')}
                            >
                              <Edit2 size={13} />
                            </button>
                          )}

                          {/* Botón Eliminar (Para el autor o el Admin) */}
                          {(isAuthor || isAdmin) && !isEditing && (
                            <button
                              onClick={() => handleDeleteComment(c.id)}
                              title={isAdmin && !isAuthor ? 'Moderar/Eliminar comentario (Admin)' : 'Eliminar mi comentario'}
                              style={{
                                background: 'none', border: 'none', color: 'rgba(255,255,255,0.45)',
                                cursor: 'pointer', padding: 2, display: 'flex', alignItems: 'center',
                              }}
                              onMouseEnter={e => (e.currentTarget.style.color = '#F87171')}
                              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.45)')}
                            >
                              <Trash2 size={13} />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Modo edición o vista de mensaje */}
                      {isEditing ? (
                        <div style={{ marginTop: 8 }}>
                          <textarea
                            value={editingText}
                            onChange={e => setEditingText(e.target.value)}
                            rows={3}
                            style={{
                              width: '100%', padding: '8px 10px', borderRadius: 8,
                              background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(249,115,22,0.4)',
                              color: 'white', fontSize: 13, outline: 'none',
                              boxSizing: 'border-box', fontFamily: 'Inter, sans-serif',
                            }}
                          />
                          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 6 }}>
                            <button
                              onClick={() => setEditingId(null)}
                              style={{
                                padding: '4px 10px', borderRadius: 6,
                                background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                                color: 'rgba(255,255,255,0.6)', cursor: 'pointer', fontSize: 11,
                              }}
                            >
                              Cancelar
                            </button>
                            <button
                              onClick={() => handleSaveEdit(c.id)}
                              disabled={savingEdit}
                              style={{
                                padding: '4px 12px', borderRadius: 6,
                                background: '#F97316', border: 'none',
                                color: 'white', cursor: 'pointer', fontSize: 11, fontWeight: 600,
                                display: 'flex', alignItems: 'center', gap: 4,
                              }}
                            >
                              {savingEdit ? <Loader2 size={11} style={{ animation: 'spin 1s linear infinite' }} /> : <Check size={12} />}
                              Guardar
                            </button>
                          </div>
                        </div>
                      ) : (
                        <p style={{
                          fontSize: 13, color: 'rgba(255,255,255,0.85)', lineHeight: 1.6, margin: 0,
                          textAlign: 'justify', textJustify: 'inter-word',
                        }}>
                          {c.mensaje}
                        </p>
                      )}
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
