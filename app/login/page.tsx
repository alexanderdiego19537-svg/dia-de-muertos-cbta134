'use client';

import { useState, useEffect, Suspense } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Skull, Lock, Mail, User, ShieldCheck, ArrowRight,
  Loader2, AlertCircle, CheckCircle2, Home, Eye, EyeOff, Info
} from 'lucide-react';
import Link from 'next/link';

const EDITOR_PIN = 'CBTA134_EDITOR_2026';

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = searchParams.get('returnTo') || '/';

  const supabase = createClient();

  const [mode, setMode]               = useState<'login' | 'register'>('login');
  const [roleIntent, setRoleIntent]   = useState<'user' | 'editor'>('user');
  
  // Campos del formulario
  const [fullName, setFullName]       = useState('');
  const [email, setEmail]             = useState('');
  const [password, setPassword]       = useState('');
  const [editorKey, setEditorKey]     = useState('');
  
  // Visibilidad de contraseñas
  const [showPassword, setShowPassword]   = useState(false);
  const [showEditorKey, setShowEditorKey] = useState(false);

  // Estados de carga y respuesta
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState('');
  const [success, setSuccess]         = useState('');

  // Si ya tiene sesión activa, redirigir automáticamente
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
      if (mode === 'login') {
        // ── 1. INICIAR SESIÓN ──
        const { data, error: authErr } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

        if (authErr) {
          if (authErr.message.includes('Invalid login credentials')) {
            setError('Correo o contraseña incorrectos. Verifica que tus datos estén bien escritos.');
          } else if (authErr.message.includes('Email not confirmed')) {
            setError('Tu cuenta aún no ha sido confirmada por correo.');
          } else {
            setError(authErr.message);
          }
          setLoading(false);
          return;
        }

        if (data.user) {
          // Obtener rol del perfil
          const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', data.user.id)
            .maybeSingle();

          // Si seleccionó que quería entrar a editar e ingresó la clave
          if (roleIntent === 'editor') {
            if (editorKey.trim() !== EDITOR_PIN) {
              setError('Contraseña de editor incorrecta. Si eres visitante normal, selecciona "Visitante".');
              setLoading(false);
              return;
            }
            // Promover a editor si no es admin
            if (profile?.role !== 'admin') {
              await supabase.from('profiles').upsert({
                id: data.user.id,
                email: data.user.email,
                role: 'editor',
              });
            }
            // Ir directamente a la página principal con las herramientas de editor activas
            router.push('/');
            return;
          }

          if (profile?.role === 'admin') {
            router.push('/admin');
          } else {
            router.push(returnTo || '/');
          }
        }
      } else {
        // ── 2. REGISTRARSE (NUEVA CUENTA) ──
        if (!fullName.trim()) {
          setError('Por favor escribe tu nombre completo para identificar tus comentarios.');
          setLoading(false);
          return;
        }

        if (password.length < 6) {
          setError('La contraseña debe tener al menos 6 caracteres.');
          setLoading(false);
          return;
        }

        // Si quiere registrarse como editor, verificar clave
        if (roleIntent === 'editor' && editorKey.trim() !== EDITOR_PIN) {
          setError('La contraseña de editor es incorrecta. Si eres visitante, elige "Visitante".');
          setLoading(false);
          return;
        }

        const initialRole = roleIntent === 'editor' ? 'editor' : 'user';

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
          if (signUpErr.message.includes('already registered')) {
            setError('Este correo ya tiene una cuenta registrada. Haz clic en "Iniciar Sesión" arriba.');
          } else if (signUpErr.message.includes('Database error')) {
            setError('Hubo un detalle en la base de datos de Supabase. Aplica el script SQL de permisos para activar el registro.');
          } else {
            setError(signUpErr.message);
          }
          setLoading(false);
          return;
        }

        // Si se creó y tiene sesión o usuario
        if (data.user) {
          // Asegurar perfil directamente desde el cliente como respaldo
          try {
            await supabase.from('profiles').upsert({
              id: data.user.id,
              email: data.user.email,
              full_name: fullName.trim(),
              role: initialRole,
            });
          } catch {
            // No bloquear
          }

          if (data.session) {
            setSuccess('¡Cuenta creada con éxito! Entrando a la página...');
            setTimeout(() => {
              router.push(returnTo || '/');
            }, 800);
          } else {
            setSuccess('¡Registro completado! Ahora inicia sesión con tu correo y contraseña.');
            setMode('login');
          }
        }
      }
    } catch (err: any) {
      console.error(err);
      setError('Ocurrió un error inesperado al conectar con el servidor.');
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
        background: 'radial-gradient(ellipse at 50% 25%, rgba(249,115,22,0.14) 0%, transparent 68%)',
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
        width: '100%', maxWidth: 450,
        backgroundColor: 'rgba(15, 6, 15, 0.96)',
        border: '1px solid rgba(249,115,22,0.25)',
        borderRadius: 24,
        padding: 'clamp(24px, 5vw, 36px)',
        backdropFilter: 'blur(24px)',
        position: 'relative',
        zIndex: 1,
        boxShadow: '0 24px 70px rgba(0,0,0,0.85), 0 0 35px rgba(249,115,22,0.1)',
      }}>
        {/* Cabecera */}
        <div style={{ textAlign: 'center', marginBottom: 22 }}>
          <div style={{
            width: 58, height: 58, borderRadius: '50%',
            background: 'rgba(249,115,22,0.12)',
            border: '1px solid rgba(249,115,22,0.35)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 12px',
            boxShadow: '0 0 20px rgba(249,115,22,0.2)',
          }}>
            <Skull size={28} color="#F97316" />
          </div>
          <h1 style={{
            fontFamily: 'Cinzel, serif', fontWeight: 900,
            fontSize: 22, color: 'white', margin: '0 0 4px',
          }}>
            {mode === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta'}
          </h1>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', margin: 0 }}>
            CBTA #134 · Día de Muertos 2026
          </p>
        </div>

        {/* Pestañas: Iniciar Sesión vs Registrarse */}
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6,
          background: 'rgba(255,255,255,0.04)',
          padding: 4, borderRadius: 12,
          marginBottom: 18,
          border: '1px solid rgba(255,255,255,0.08)',
        }}>
          <button
            type="button"
            onClick={() => { setMode('login'); setError(''); setSuccess(''); }}
            style={{
              padding: '10px 14px', borderRadius: 9,
              border: 'none', cursor: 'pointer',
              background: mode === 'login' ? 'rgba(249,115,22,0.25)' : 'transparent',
              color: mode === 'login' ? 'white' : 'rgba(255,255,255,0.45)',
              fontFamily: 'Cinzel, serif', fontWeight: 700, fontSize: 12,
              transition: 'all 0.2s',
            }}
          >
            Ya tengo cuenta
          </button>
          <button
            type="button"
            onClick={() => { setMode('register'); setError(''); setSuccess(''); }}
            style={{
              padding: '10px 14px', borderRadius: 9,
              border: 'none', cursor: 'pointer',
              background: mode === 'register' ? 'rgba(249,115,22,0.25)' : 'transparent',
              color: mode === 'register' ? 'white' : 'rgba(255,255,255,0.45)',
              fontFamily: 'Cinzel, serif', fontWeight: 700, fontSize: 12,
              transition: 'all 0.2s',
            }}
          >
            Registrarme
          </button>
        </div>

        {/* Selector de Rol: Visitante vs Editor */}
        <div style={{ marginBottom: 18 }}>
          <label style={{ fontSize: 10, fontFamily: 'JetBrains Mono, monospace', color: 'rgba(255,255,255,0.45)', display: 'block', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            Tipo de acceso:
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <button
              type="button"
              onClick={() => { setRoleIntent('user'); setError(''); }}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '9px 12px', borderRadius: 10,
                border: roleIntent === 'user' ? '1px solid #F97316' : '1px solid rgba(255,255,255,0.08)',
                background: roleIntent === 'user' ? 'rgba(249,115,22,0.12)' : 'rgba(255,255,255,0.02)',
                color: roleIntent === 'user' ? 'white' : 'rgba(255,255,255,0.5)',
                cursor: 'pointer', textAlign: 'left',
                fontSize: 12,
              }}
            >
              <User size={15} color={roleIntent === 'user' ? '#F97316' : 'currentColor'} />
              <div>
                <span style={{ fontWeight: 600, display: 'block', fontSize: 12 }}>Visitante</span>
                <span style={{ fontSize: 10, opacity: 0.6 }}>Comentar y ver</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => { setRoleIntent('editor'); setError(''); }}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '9px 12px', borderRadius: 10,
                border: roleIntent === 'editor' ? '1px solid #F97316' : '1px solid rgba(255,255,255,0.08)',
                background: roleIntent === 'editor' ? 'rgba(249,115,22,0.12)' : 'rgba(255,255,255,0.02)',
                color: roleIntent === 'editor' ? 'white' : 'rgba(255,255,255,0.5)',
                cursor: 'pointer', textAlign: 'left',
                fontSize: 12,
              }}
            >
              <ShieldCheck size={15} color={roleIntent === 'editor' ? '#F97316' : 'currentColor'} />
              <div>
                <span style={{ fontWeight: 600, display: 'block', fontSize: 12 }}>Editor</span>
                <span style={{ fontSize: 10, opacity: 0.6 }}>Subir fotos y info</span>
              </div>
            </button>
          </div>
        </div>

        {/* Mensaje de error o éxito */}
        {error && (
          <div style={{
            display: 'flex', alignItems: 'flex-start', gap: 8,
            padding: '10px 12px', borderRadius: 10,
            background: 'rgba(220,38,38,0.14)', border: '1px solid rgba(220,38,38,0.3)',
            color: '#FCA5A5', fontSize: 12, marginBottom: 16, lineHeight: 1.4,
          }}>
            <AlertCircle size={16} style={{ flexShrink: 0, marginTop: 1 }} />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '10px 12px', borderRadius: 10,
            background: 'rgba(34,197,94,0.14)', border: '1px solid rgba(34,197,94,0.3)',
            color: '#86EFAC', fontSize: 12, marginBottom: 16,
          }}>
            <CheckCircle2 size={16} style={{ flexShrink: 0 }} />
            <span>{success}</span>
          </div>
        )}

        {/* Formulario */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Nombre completo (solo en Registro) */}
          {mode === 'register' && (
            <div>
              <label style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', display: 'block', marginBottom: 5 }}>
                Tu Nombre Completo (así saldrá en tus comentarios):
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  placeholder="Ej. Alexander García"
                  style={{
                    width: '100%', padding: '10px 14px 10px 38px',
                    borderRadius: 10, background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    color: 'white', fontSize: 13, outline: 'none',
                    boxSizing: 'border-box',
                  }}
                  onFocus={e => (e.target.style.borderColor = '#F97316')}
                  onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.12)')}
                />
                <User size={15} color="rgba(255,255,255,0.35)" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
              </div>
            </div>
          )}

          {/* Correo Electrónico */}
          <div>
            <label style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', display: 'block', marginBottom: 5 }}>
              Correo Electrónico:
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="tu_correo@gmail.com"
                style={{
                  width: '100%', padding: '10px 14px 10px 38px',
                  borderRadius: 10, background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  color: 'white', fontSize: 13, outline: 'none',
                  boxSizing: 'border-box',
                }}
                onFocus={e => (e.target.style.borderColor = '#F97316')}
                onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.12)')}
              />
              <Mail size={15} color="rgba(255,255,255,0.35)" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>

          {/* Campo Contraseña con explicación amigable y botón mostrar/ocultar */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
              <label style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)' }}>
                {mode === 'register' ? 'Crea una contraseña para esta web:' : 'Tu contraseña:'}
              </label>
              {mode === 'register' && (
                <span style={{ fontSize: 10, color: 'rgba(249,115,22,0.8)', fontFamily: 'JetBrains Mono, monospace' }}>
                  Mínimo 6 letras o números
                </span>
              )}
            </div>

            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                minLength={6}
                style={{
                  width: '100%', padding: '10px 38px 10px 38px',
                  borderRadius: 10, background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  color: 'white', fontSize: 13, outline: 'none',
                  boxSizing: 'border-box',
                }}
                onFocus={e => (e.target.style.borderColor = '#F97316')}
                onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.12)')}
              />
              <Lock size={15} color="rgba(255,255,255,0.35)" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
              
              {/* Botón ver/ocultar contraseña */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: 'rgba(255,255,255,0.4)', padding: 4, display: 'flex', alignItems: 'center',
                }}
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>

            {/* Aclaración amigable para que no crean que es la contraseña de Google */}
            {mode === 'register' && (
              <p style={{
                fontSize: 10, color: 'rgba(255,255,255,0.45)', margin: '5px 0 0', lineHeight: 1.4,
                display: 'flex', alignItems: 'center', gap: 4,
              }}>
                <Info size={11} color="#F97316" style={{ flexShrink: 0 }} />
                <span>Inventa una contraseña para esta página. <strong>NO</strong> es la clave de tu correo de Google ni de tus redes.</span>
              </p>
            )}
          </div>

          {/* Clave de Editor (solo si seleccionó Editor) */}
          {roleIntent === 'editor' && (
            <div style={{
              background: 'rgba(249,115,22,0.08)',
              border: '1px solid rgba(249,115,22,0.25)',
              borderRadius: 12, padding: '12px 14px',
            }}>
              <label style={{ fontSize: 11, color: '#F97316', fontWeight: 600, display: 'block', marginBottom: 5 }}>
                🔑 Contraseña de Acceso para Editores:
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showEditorKey ? 'text' : 'password'}
                  required
                  value={editorKey}
                  onChange={e => setEditorKey(e.target.value)}
                  placeholder="Ingresa la clave de editor..."
                  style={{
                    width: '100%', padding: '9px 38px 9px 12px',
                    borderRadius: 8, background: 'rgba(0,0,0,0.5)',
                    border: '1px solid rgba(249,115,22,0.3)',
                    color: 'white', fontSize: 13, outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowEditorKey(!showEditorKey)}
                  style={{
                    position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: 'rgba(255,255,255,0.4)', padding: 4, display: 'flex', alignItems: 'center',
                  }}
                >
                  {showEditorKey ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
              <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', display: 'block', marginTop: 4 }}>
                Requerida para que puedas subir fotos a la galería y modificar el programa.
              </span>
            </div>
          )}

          {/* Botón Principal */}
          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: 6,
              padding: '12px', borderRadius: 12,
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

        {/* Alternar entre login y registro */}
        <div style={{ textAlign: 'center', marginTop: 18, borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 14 }}>
          {mode === 'login' ? (
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', margin: 0 }}>
              ¿Primera vez aquí?{' '}
              <button
                type="button"
                onClick={() => { setMode('register'); setError(''); setSuccess(''); }}
                style={{ background: 'none', border: 'none', color: '#F97316', cursor: 'pointer', fontWeight: 600, fontSize: 12 }}
              >
                Crea tu cuenta aquí
              </button>
            </p>
          ) : (
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', margin: 0 }}>
              ¿Ya te habías registrado?{' '}
              <button
                type="button"
                onClick={() => { setMode('login'); setError(''); setSuccess(''); }}
                style={{ background: 'none', border: 'none', color: '#F97316', cursor: 'pointer', fontWeight: 600, fontSize: 12 }}
              >
                Inicia sesión aquí
              </button>
            </p>
          )}
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
