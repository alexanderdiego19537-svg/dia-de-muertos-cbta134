'use client';

import { useState, useEffect, Suspense } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter, useSearchParams } from 'next/navigation';
import { Skull, Lock, Mail, User, ShieldCheck, ArrowRight, Loader2, Sparkles, AlertCircle, CheckCircle2, Home } from 'lucide-react';
import Link from 'next/link';

const EDITOR_PIN = 'CBTA134_EDITOR_2026';

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = searchParams.get('returnTo') || '/';

  const supabase = createClient();

  const [mode, setMode]               = useState<'login' | 'register'>('login');
  const [roleIntent, setRoleIntent]   = useState<'user' | 'editor'>('user');
  
  // Campos
  const [fullName, setFullName]       = useState('');
  const [email, setEmail]             = useState('');
  const [password, setPassword]       = useState('');
  const [editorKey, setEditorKey]     = useState('');
  
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState('');
  const [success, setSuccess]         = useState('');

  // Si ya tiene sesión, redirigir según su rol
  useEffect(() => {
    async function checkSession() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .maybeSingle();

        if (profile?.role === 'admin') {
          router.push('/admin');
        } else if (profile?.role === 'editor') {
          router.push('/editor');
        } else {
          router.push(returnTo);
        }
      }
    }
    checkSession();
  }, [router, returnTo, supabase]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      // 1. Si quiere entrar como editor, validar clave de editor
      if (roleIntent === 'editor' && editorKey.trim() !== EDITOR_PIN) {
        setError('La contraseña de editor es incorrecta. Si no eres editor, ingresa como Visitante.');
        setLoading(false);
        return;
      }

      if (mode === 'login') {
        // ── INICIAR SESIÓN ──
        const { data, error: authErr } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

        if (authErr) {
          setError(
            authErr.message.includes('Invalid login credentials')
              ? 'Correo o contraseña incorrectos.'
              : authErr.message
          );
          setLoading(false);
          return;
        }

        if (data.user) {
          // Obtener perfil
          const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', data.user.id)
            .maybeSingle();

          // Si seleccionó modo editor y puso la clave correcta, actualizar su rol a editor
          if (roleIntent === 'editor' && editorKey.trim() === EDITOR_PIN) {
            if (profile?.role !== 'admin') {
              await supabase
                .from('profiles')
                .update({ role: 'editor' })
                .eq('id', data.user.id);
            }
            router.push('/editor');
            return;
          }

          if (profile?.role === 'admin') {
            router.push('/admin');
          } else if (profile?.role === 'editor') {
            router.push('/editor');
          } else {
            router.push(returnTo);
          }
        }
      } else {
        // ── REGISTRO DE CUENTA NUEVA ──
        if (!fullName.trim()) {
          setError('Por favor escribe tu nombre completo.');
          setLoading(false);
          return;
        }

        const initialRole = roleIntent === 'editor' && editorKey.trim() === EDITOR_PIN ? 'editor' : 'user';

        const { data, error: signUpErr } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            data: {
              full_name: fullName.trim(),
              role: initialRole,
            },
          },
        });

        if (signUpErr) {
          setError(signUpErr.message);
          setLoading(false);
          return;
        }

        // Si se auto-inició sesión
        if (data.session) {
          setSuccess('¡Cuenta creada con éxito! Redirigiendo...');
          setTimeout(() => {
            if (initialRole === 'editor') {
              router.push('/editor');
            } else {
              router.push(returnTo);
            }
          }, 1200);
        } else {
          setSuccess('Cuenta creada. Ya puedes iniciar sesión con tu correo y contraseña.');
          setMode('login');
        }
      }
    } catch (err) {
      console.error(err);
      setError('Ocurrió un error inesperado. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#080208',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px 16px',
      position: 'relative',
      overflow: 'hidden',
      fontFamily: 'Inter, sans-serif',
    }}>
      {/* Glow de fondo */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse at 50% 30%, rgba(249,115,22,0.12) 0%, transparent 70%)',
      }} />

      {/* Botón flotante para regresar al inicio */}
      <div style={{ position: 'fixed', top: 20, left: 20, zIndex: 50 }}>
        <Link href="/" style={{
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '8px 16px', borderRadius: 999,
          background: 'rgba(255,255,255,0.06)',
          border: '1px solid rgba(255,255,255,0.12)',
          color: 'rgba(255,255,255,0.85)',
          textDecoration: 'none', fontSize: 12,
          fontFamily: 'JetBrains Mono, monospace',
          backdropFilter: 'blur(10px)',
        }}>
          <Home size={14} color="#F97316" />
          <span>⌂ Inicio</span>
        </Link>
      </div>

      <div style={{
        width: '100%', maxWidth: 440,
        backgroundColor: 'rgba(15, 6, 15, 0.95)',
        border: '1px solid rgba(249,115,22,0.22)',
        borderRadius: 24,
        padding: 'clamp(24px, 5vw, 40px)',
        backdropFilter: 'blur(20px)',
        position: 'relative',
        zIndex: 1,
        boxShadow: '0 20px 60px rgba(0,0,0,0.8), 0 0 30px rgba(249,115,22,0.08)',
      }}>
        {/* Cabecera del formulario */}
        <div style={{ textAlign: 'center', marginBottom: 26 }}>
          <div style={{
            width: 58, height: 58, borderRadius: '50%',
            background: 'rgba(249,115,22,0.12)',
            border: '1px solid rgba(249,115,22,0.35)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 14px',
            boxShadow: '0 0 20px rgba(249,115,22,0.2)',
          }}>
            <Skull size={28} color="#F97316" />
          </div>
          <h1 style={{
            fontFamily: 'Cinzel, serif', fontWeight: 900,
            fontSize: 22, color: 'white', margin: '0 0 6px',
          }}>
            {mode === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta'}
          </h1>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', margin: 0, lineHeight: 1.4 }}>
            CBTA #134 · Día de Muertos 2026
          </p>
        </div>

        {/* Pestañas: Iniciar Sesión vs Crear Cuenta */}
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6,
          background: 'rgba(255,255,255,0.04)',
          padding: 4, borderRadius: 12,
          marginBottom: 20,
          border: '1px solid rgba(255,255,255,0.06)',
        }}>
          <button
            type="button"
            onClick={() => { setMode('login'); setError(''); }}
            style={{
              padding: '9px 14px', borderRadius: 9,
              border: 'none', cursor: 'pointer',
              background: mode === 'login' ? 'rgba(249,115,22,0.25)' : 'transparent',
              color: mode === 'login' ? 'white' : 'rgba(255,255,255,0.45)',
              fontFamily: 'Cinzel, serif', fontWeight: 700, fontSize: 12,
              transition: 'all 0.2s',
            }}
          >
            Iniciar Sesión
          </button>
          <button
            type="button"
            onClick={() => { setMode('register'); setError(''); }}
            style={{
              padding: '9px 14px', borderRadius: 9,
              border: 'none', cursor: 'pointer',
              background: mode === 'register' ? 'rgba(249,115,22,0.25)' : 'transparent',
              color: mode === 'register' ? 'white' : 'rgba(255,255,255,0.45)',
              fontFamily: 'Cinzel, serif', fontWeight: 700, fontSize: 12,
              transition: 'all 0.2s',
            }}
          >
            Registrarse
          </button>
        </div>

        {/* Selector de tipo de acceso: Visitante vs Editor */}
        <div style={{ marginBottom: 20 }}>
          <label style={{ fontSize: 11, fontFamily: 'JetBrains Mono, monospace', color: 'rgba(255,255,255,0.45)', display: 'block', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            ¿Cómo deseas ingresar?
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <button
              type="button"
              onClick={() => { setRoleIntent('user'); setError(''); }}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '10px 12px', borderRadius: 10,
                border: roleIntent === 'user' ? '1px solid #F97316' : '1px solid rgba(255,255,255,0.08)',
                background: roleIntent === 'user' ? 'rgba(249,115,22,0.12)' : 'rgba(255,255,255,0.02)',
                color: roleIntent === 'user' ? 'white' : 'rgba(255,255,255,0.5)',
                cursor: 'pointer', textAlign: 'left',
                fontSize: 12, fontFamily: 'Inter, sans-serif',
              }}
            >
              <User size={15} color={roleIntent === 'user' ? '#F97316' : 'currentColor'} />
              <div>
                <span style={{ fontWeight: 600, display: 'block' }}>Visitante</span>
                <span style={{ fontSize: 10, opacity: 0.6 }}>Comentar y ver</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => { setRoleIntent('editor'); setError(''); }}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '10px 12px', borderRadius: 10,
                border: roleIntent === 'editor' ? '1px solid #F97316' : '1px solid rgba(255,255,255,0.08)',
                background: roleIntent === 'editor' ? 'rgba(249,115,22,0.12)' : 'rgba(255,255,255,0.02)',
                color: roleIntent === 'editor' ? 'white' : 'rgba(255,255,255,0.5)',
                cursor: 'pointer', textAlign: 'left',
                fontSize: 12, fontFamily: 'Inter, sans-serif',
              }}
            >
              <ShieldCheck size={15} color={roleIntent === 'editor' ? '#F97316' : 'currentColor'} />
              <div>
                <span style={{ fontWeight: 600, display: 'block' }}>Editor</span>
                <span style={{ fontSize: 10, opacity: 0.6 }}>Subir contenido</span>
              </div>
            </button>
          </div>
        </div>

        {/* Mensajes de error o éxito */}
        {error && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '10px 14px', borderRadius: 10,
            background: 'rgba(220,38,38,0.12)', border: '1px solid rgba(220,38,38,0.3)',
            color: '#FCA5A5', fontSize: 12, marginBottom: 16,
          }}>
            <AlertCircle size={15} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '10px 14px', borderRadius: 10,
            background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.3)',
            color: '#86EFAC', fontSize: 12, marginBottom: 16,
          }}>
            <CheckCircle2 size={15} style={{ flexShrink: 0 }} />
            <span>{success}</span>
          </div>
        )}

        {/* Formulario */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Nombre completo (solo en registro) */}
          {mode === 'register' && (
            <div>
              <label style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', display: 'block', marginBottom: 6 }}>
                Tu Nombre Completo (se mostrará en tus comentarios):
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  placeholder="Ej: Alexander García"
                  style={{
                    width: '100%', padding: '11px 14px 11px 40px',
                    borderRadius: 10, background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    color: 'white', fontSize: 13, outline: 'none',
                    boxSizing: 'border-box',
                  }}
                  onFocus={e => (e.target.style.borderColor = '#F97316')}
                  onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.12)')}
                />
                <User size={15} color="rgba(255,255,255,0.35)" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
              </div>
            </div>
          )}

          {/* Correo electrónico */}
          <div>
            <label style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', display: 'block', marginBottom: 6 }}>
              Correo Electrónico:
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="tu_correo@ejemplo.com"
                style={{
                  width: '100%', padding: '11px 14px 11px 40px',
                  borderRadius: 10, background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  color: 'white', fontSize: 13, outline: 'none',
                  boxSizing: 'border-box',
                }}
                onFocus={e => (e.target.style.borderColor = '#F97316')}
                onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.12)')}
              />
              <Mail size={15} color="rgba(255,255,255,0.35)" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>

          {/* Contraseña de la cuenta */}
          <div>
            <label style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', display: 'block', marginBottom: 6 }}>
              Contraseña:
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                minLength={6}
                style={{
                  width: '100%', padding: '11px 14px 11px 40px',
                  borderRadius: 10, background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  color: 'white', fontSize: 13, outline: 'none',
                  boxSizing: 'border-box',
                }}
                onFocus={e => (e.target.style.borderColor = '#F97316')}
                onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.12)')}
              />
              <Lock size={15} color="rgba(255,255,255,0.35)" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>

          {/* Clave de Editor (solo si seleccionó modo editor) */}
          {roleIntent === 'editor' && (
            <div style={{
              background: 'rgba(249,115,22,0.08)',
              border: '1px solid rgba(249,115,22,0.25)',
              borderRadius: 12, padding: '12px 14px',
            }}>
              <label style={{ fontSize: 12, color: '#F97316', fontWeight: 600, display: 'block', marginBottom: 6 }}>
                🔑 Contraseña de Acceso para Editores:
              </label>
              <input
                type="password"
                required
                value={editorKey}
                onChange={e => setEditorKey(e.target.value)}
                placeholder="Ingresa la clave de editor..."
                style={{
                  width: '100%', padding: '10px 12px',
                  borderRadius: 8, background: 'rgba(0,0,0,0.4)',
                  border: '1px solid rgba(249,115,22,0.3)',
                  color: 'white', fontSize: 13, outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
              <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', display: 'block', marginTop: 4 }}>
                Requerida para acceder al panel de subida de fotos y eventos.
              </span>
            </div>
          )}

          {/* Botón de envío */}
          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: 10,
              padding: '13px', borderRadius: 12,
              background: 'linear-gradient(135deg, #F97316, #C2410C)',
              border: 'none', color: 'white', cursor: 'pointer',
              fontFamily: 'Cinzel, serif', fontWeight: 700, fontSize: 14,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              boxShadow: '0 4px 20px rgba(249,115,22,0.35)',
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? (
              <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
            ) : (
              <>
                <span>{mode === 'login' ? 'Entrar a mi Cuenta' : 'Registrarme'}</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        {/* Volver a la página principal */}
        <div style={{ textAlign: 'center', marginTop: 22, borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 16 }}>
          <Link href="/" style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', textDecoration: 'none' }}>
            ← Volver a la página principal sin iniciar sesión
          </Link>
        </div>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', backgroundColor: '#080208', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Loader2 size={28} color="#F97316" style={{ animation: 'spin 1s linear infinite' }} />
      </div>
    }>
      <LoginFormContent />
    </Suspense>
  );
}
