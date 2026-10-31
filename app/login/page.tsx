'use client';

import { useState, useEffect, Suspense } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Skull, Lock, Mail, User, ShieldCheck, ArrowRight,
  Loader2, AlertCircle, CheckCircle2, Home, Eye, EyeOff, Info,
  KeyRound, RefreshCw, HelpCircle, ArrowLeft
} from 'lucide-react';
import Link from 'next/link';
import { validateEmail } from '@/lib/emailValidator';

const EDITOR_PIN = 'CBTA134_EDITOR_2026';

type AuthMode = 'login' | 'register' | 'forgot' | 'verify-otp';

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = searchParams.get('returnTo') || '/';

  const supabase = createClient();

  const [mode, setMode]               = useState<AuthMode>('login');
  const [roleIntent, setRoleIntent]   = useState<'user' | 'editor'>('user');

  // Campos del formulario
  const [fullName, setFullName]             = useState('');
  const [email, setEmail]                   = useState('');
  const [password, setPassword]             = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [editorKey, setEditorKey]           = useState('');
  const [otpToken, setOtpToken]             = useState('');

  // Visibilidad de contraseñas
  const [showPassword, setShowPassword]               = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showEditorKey, setShowEditorKey]             = useState(false);

  // Estados de carga y respuesta
  const [loading, setLoading]         = useState(false);
  const [resending, setResending]     = useState(false);
  const [error, setError]             = useState('');
  const [success, setSuccess]         = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);

  // Redirigir si ya tiene sesión activa
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

  // Manejo del contador de reenvío de OTP
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setTimeout(() => setResendCooldown(prev => prev - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  // ─────────────────────────────────────────────────────────────
  // 1. INICIAR SESIÓN
  // ─────────────────────────────────────────────────────────────
  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validación de correo
    const emailCheck = validateEmail(email);
    if (!emailCheck.valid) {
      setError(emailCheck.error || 'Correo inválido');
      return;
    }

    if (!password) {
      setError('Por favor ingresa tu contraseña.');
      return;
    }

    setLoading(true);
    try {
      const { data, error: authErr } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

      if (authErr) {
        if (authErr.message.includes('Invalid login credentials')) {
          setError(
            'Correo o contraseña incorrectos. Si aún no tienes cuenta en esta página, haz clic en "Crear Cuenta" arriba para registrarte.'
          );
        } else if (authErr.message.includes('Email not confirmed')) {
          setError(
            'Tu cuenta aún no ha sido confirmada por correo. Por favor ingresa el código de 6 dígitos que te enviamos.'
          );
          setMode('verify-otp');
        } else {
          setError(authErr.message);
        }
        setLoading(false);
        return;
      }

      if (data.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', data.user.id)
          .maybeSingle();

        // Si intentó ingresar como editor
        if (roleIntent === 'editor') {
          if (editorKey.trim() !== EDITOR_PIN) {
            setError('Clave de editor incorrecta. Si eres visitante normal, selecciona la opción "Visitante".');
            setLoading(false);
            return;
          }

          if (profile?.role !== 'admin') {
            await supabase.from('profiles').upsert({
              id: data.user.id,
              email: data.user.email,
              role: 'editor',
            });
          }
          router.push('/editor');
          return;
        }

        if (profile?.role === 'admin') {
          router.push('/admin');
        } else if (profile?.role === 'editor') {
          router.push('/editor');
        } else {
          router.push(returnTo || '/');
        }
      }
    } catch (err: unknown) {
      console.error(err);
      setError('Ocurrió un error al conectar con el servidor. Verifica tu conexión a internet.');
    } finally {
      setLoading(false);
    }
  }

  // ─────────────────────────────────────────────────────────────
  // 2. REGISTRARSE (NUEVA CUENTA)
  // ─────────────────────────────────────────────────────────────
  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validación de nombre
    if (!fullName.trim() || fullName.trim().length < 3) {
      setError('Por favor escribe tu nombre y apellido completo (mínimo 3 letras).');
      return;
    }

    // Validación estricta de correo real
    const emailCheck = validateEmail(email);
    if (!emailCheck.valid) {
      setError(emailCheck.error || 'Correo inválido');
      return;
    }

    // Validación de contraseñas
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden. Por favor asegúrate de escribir la misma contraseña en ambos campos.');
      return;
    }

    // Validación de PIN de Editor
    if (roleIntent === 'editor' && editorKey.trim() !== EDITOR_PIN) {
      setError('La clave secreta de editor es incorrecta. Si eres visitante o alumno regular, selecciona "Visitante".');
      return;
    }

    setLoading(true);
    const initialRole = roleIntent === 'editor' ? 'editor' : 'user';

    try {
      const origin = typeof window !== 'undefined' ? window.location.origin : '';
      const { data, error: signUpErr } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: {
          data: {
            full_name: fullName.trim(),
            role: initialRole,
          },
          emailRedirectTo: `${origin}/auth/callback?next=${encodeURIComponent(returnTo)}`,
        },
      });

      if (signUpErr) {
        if (signUpErr.message.includes('already registered')) {
          setError('Este correo electrónico ya tiene una cuenta registrada. Haz clic en "Iniciar Sesión" arriba.');
        } else if (signUpErr.message.includes('Database error')) {
          setError('Error interno en la base de datos al registrar. Por favor intenta más tarde.');
        } else {
          setError(signUpErr.message);
        }
        setLoading(false);
        return;
      }

      // Si el correo ya estaba registrado previamente en Supabase (identities vacío)
      if (data.user && data.user.identities && data.user.identities.length === 0) {
        setError(
          `El correo ${email.trim()} YA está registrado en el sistema. Por favor pasa a la pestaña "Iniciar Sesión" arriba e ingresa tu contraseña.`
        );
        setMode('login');
        setLoading(false);
        return;
      }

      if (data.user) {
        // Opción A: Guardar y activar perfil inmediatamente
        try {
          await supabase.from('profiles').upsert({
            id: data.user.id,
            email: data.user.email || email.trim().toLowerCase(),
            full_name: fullName.trim(),
            role: initialRole,
          });
        } catch (e) {
          console.error('Error guardando perfil:', e);
        }

        // Si la sesión no vino activa automáticamente, iniciamos sesión con las credenciales ingresadas
        if (!data.session) {
          try {
            await supabase.auth.signInWithPassword({
              email: email.trim().toLowerCase(),
              password,
            });
          } catch (e) {
            console.error('Error iniciando sesión tras registro:', e);
          }
        }

        setSuccess(`¡Bienvenido, ${fullName.trim()}! Tu cuenta ha sido creada exitosamente. Ingresando...`);
        setTimeout(() => {
          if (initialRole === 'editor') {
            router.push('/editor');
          } else {
            router.push(returnTo || '/');
          }
        }, 900);
      }
    } catch (err: unknown) {
      console.error(err);
      setError('Ocurrió un error inesperado al procesar el registro.');
    } finally {
      setLoading(false);
    }
  }

  // ─────────────────────────────────────────────────────────────
  // 3. VERIFICAR CÓDIGO OTP (6 DÍGITOS)
  // ─────────────────────────────────────────────────────────────
  async function handleVerifyOtp(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSuccess('');

    const token = otpToken.trim();
    if (!token || token.length < 6) {
      setError('Por favor ingresa el código completo de 6 dígitos que llegó a tu correo.');
      return;
    }

    setLoading(true);
    try {
      const { data, error: verifyErr } = await supabase.auth.verifyOtp({
        email: email.trim().toLowerCase(),
        token,
        type: 'signup',
      });

      if (verifyErr) {
        setError('El código ingresado es incorrecto o ya expiró. Verifica tu correo o solicita uno nuevo.');
        setLoading(false);
        return;
      }

      if (data.session) {
        // AHORA SÍ: El correo fue verificado con éxito por el usuario real. Guardar perfil oficial.
        try {
          const userObj = data.user || data.session.user;
          const userMetaName = userObj.user_metadata?.full_name;
          const userMetaRole = userObj.user_metadata?.role;
          await supabase.from('profiles').upsert({
            id: userObj.id,
            email: userObj.email || email.trim().toLowerCase(),
            full_name: fullName.trim() || userMetaName || 'Usuario',
            role: roleIntent === 'editor' ? 'editor' : (userMetaRole || 'user'),
          });
        } catch (e) {
          console.error('Error saving profile after verification:', e);
        }

        setSuccess('¡Correo verificado con éxito! Ingresando...');
        setTimeout(() => {
          if (roleIntent === 'editor') {
            router.push('/editor');
          } else {
            router.push(returnTo || '/');
          }
        }, 800);
      }
    } catch (err: unknown) {
      console.error(err);
      setError('Error al validar el código. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  }

  // Reenviar código OTP
  async function handleResendCode() {
    if (resendCooldown > 0 || resending) return;
    setResending(true);
    setError('');
    setSuccess('');

    try {
      const { error: resendErr } = await supabase.auth.resend({
        type: 'signup',
        email: email.trim().toLowerCase(),
      });

      if (resendErr) {
        setError('No se pudo reenviar el código: ' + resendErr.message);
      } else {
        setSuccess('Nuevo código enviado. Revisa tu bandeja de entrada o spam.');
        setResendCooldown(60);
      }
    } catch {
      setError('Error al reenviar. Espera un momento antes de volver a intentar.');
    } finally {
      setResending(false);
    }
  }

  // ─────────────────────────────────────────────────────────────
  // 4. RECUPERAR CONTRASEÑA
  // ─────────────────────────────────────────────────────────────
  async function handleForgotPassword(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSuccess('');

    const emailCheck = validateEmail(email);
    if (!emailCheck.valid) {
      setError(emailCheck.error || 'Ingresa un correo válido.');
      return;
    }

    setLoading(true);
    try {
      const origin = typeof window !== 'undefined' ? window.location.origin : '';
      const { error: resetErr } = await supabase.auth.resetPasswordForEmail(
        email.trim().toLowerCase(),
        {
          redirectTo: `${origin}/login?mode=login`,
        }
      );

      if (resetErr) {
        setError(resetErr.message);
      } else {
        setSuccess(
          `Si el correo ${email} está registrado, recibirás un enlace seguro para restablecer tu contraseña. Revisa también tu carpeta de spam.`
        );
      }
    } catch {
      setError('Ocurrió un error al enviar el enlace de recuperación.');
    } finally {
      setLoading(false);
    }
  }

  // ─────────────────────────────────────────────────────────────
  // Indicador visual de seguridad de contraseña
  // ─────────────────────────────────────────────────────────────
  function getPasswordStrength(p: string): { label: string; color: string; width: string } {
    if (!p) return { label: '', color: '', width: '0%' };
    if (p.length < 6) return { label: 'Muy corta (mín. 6)', color: '#EF4444', width: '25%' };
    const hasNum = /\d/.test(p);
    const hasUpper = /[A-Z]/.test(p);
    const hasSymbol = /[^A-Za-z0-9]/.test(p);
    const score = [hasNum, hasUpper, hasSymbol].filter(Boolean).length;

    if (score === 0) return { label: 'Básica', color: '#F59E0B', width: '50%' };
    if (score === 1 || score === 2) return { label: 'Buena', color: '#10B981', width: '75%' };
    return { label: 'Muy Segura', color: '#059669', width: '100%' };
  }

  const strength = getPasswordStrength(password);

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#080208',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px 16px',
        position: 'relative',
        overflow: 'hidden',
        fontFamily: 'Inter, sans-serif',
      }}
    >
      {/* Resplandor ambiental de fondo */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          pointerEvents: 'none',
          background: 'radial-gradient(ellipse at 50% 25%, rgba(249,115,22,0.12) 0%, transparent 68%)',
        }}
      />

      {/* Botón flotante para regresar al Altar Principal */}
      <div style={{ position: 'fixed', top: 20, left: 20, zIndex: 50 }}>
        <Link
          href="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '8px 16px',
            borderRadius: 999,
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.12)',
            color: 'rgba(255,255,255,0.85)',
            textDecoration: 'none',
            fontSize: 12,
            fontFamily: 'JetBrains Mono, monospace',
            backdropFilter: 'blur(10px)',
          }}
        >
          <Home size={14} color="#F97316" />
          <span>⌂ Inicio</span>
        </Link>
      </div>

      <div
        style={{
          width: '100%',
          maxWidth: 460,
          backgroundColor: 'rgba(15, 6, 15, 0.96)',
          border: '1px solid rgba(249,115,22,0.25)',
          borderRadius: 24,
          padding: 'clamp(24px, 5vw, 36px)',
          backdropFilter: 'blur(24px)',
          position: 'relative',
          zIndex: 1,
          boxShadow: '0 24px 70px rgba(0,0,0,0.85), 0 0 35px rgba(249,115,22,0.1)',
        }}
      >
        {/* Cabecera */}
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <div
            style={{
              width: 58,
              height: 58,
              borderRadius: '50%',
              background: 'rgba(249,115,22,0.12)',
              border: '1px solid rgba(249,115,22,0.35)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 12px',
              boxShadow: '0 0 20px rgba(249,115,22,0.2)',
            }}
          >
            {mode === 'forgot' ? (
              <KeyRound size={26} color="#F97316" />
            ) : mode === 'verify-otp' ? (
              <Mail size={26} color="#F97316" />
            ) : (
              <Skull size={28} color="#F97316" />
            )}
          </div>

          <h1
            style={{
              fontFamily: 'Cinzel, serif',
              fontWeight: 900,
              fontSize: 22,
              color: 'white',
              margin: '0 0 4px',
            }}
          >
            {mode === 'login' && 'Iniciar Sesión'}
            {mode === 'register' && 'Crear Cuenta'}
            {mode === 'forgot' && 'Recuperar Contraseña'}
            {mode === 'verify-otp' && 'Verificar tu Correo'}
          </h1>

          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', margin: 0 }}>
            CBTA #134 · Día de Muertos 2026
          </p>
        </div>

        {/* Pestañas: Iniciar Sesión vs Crear Cuenta (Solo visible en modos normales) */}
        {(mode === 'login' || mode === 'register') && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 6,
              background: 'rgba(255,255,255,0.04)',
              padding: 4,
              borderRadius: 12,
              marginBottom: 18,
              border: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setError('');
                setSuccess('');
              }}
              style={{
                padding: '10px 14px',
                borderRadius: 9,
                border: 'none',
                cursor: 'pointer',
                background: mode === 'login' ? 'rgba(249,115,22,0.25)' : 'transparent',
                color: mode === 'login' ? 'white' : 'rgba(255,255,255,0.45)',
                fontFamily: 'Cinzel, serif',
                fontWeight: 700,
                fontSize: 12,
                transition: 'all 0.2s',
              }}
            >
              Iniciar Sesión
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('register');
                setError('');
                setSuccess('');
              }}
              style={{
                padding: '10px 14px',
                borderRadius: 9,
                border: 'none',
                cursor: 'pointer',
                background: mode === 'register' ? 'rgba(249,115,22,0.25)' : 'transparent',
                color: mode === 'register' ? 'white' : 'rgba(255,255,255,0.45)',
                fontFamily: 'Cinzel, serif',
                fontWeight: 700,
                fontSize: 12,
                transition: 'all 0.2s',
              }}
            >
              Crear Cuenta
            </button>
          </div>
        )}

        {/* Selector de Rol: Visitante vs Editor (Solo en login y registro) */}
        {(mode === 'login' || mode === 'register') && (
          <div style={{ marginBottom: 18 }}>
            <label
              style={{
                fontSize: 10,
                fontFamily: 'JetBrains Mono, monospace',
                color: 'rgba(255,255,255,0.45)',
                display: 'block',
                marginBottom: 8,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
              }}
            >
              Tipo de acceso:
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              <button
                type="button"
                onClick={() => {
                  setRoleIntent('user');
                  setError('');
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '9px 12px',
                  borderRadius: 10,
                  border: roleIntent === 'user' ? '1px solid #F97316' : '1px solid rgba(255,255,255,0.08)',
                  background: roleIntent === 'user' ? 'rgba(249,115,22,0.12)' : 'rgba(255,255,255,0.02)',
                  color: roleIntent === 'user' ? 'white' : 'rgba(255,255,255,0.5)',
                  cursor: 'pointer',
                  textAlign: 'left',
                  fontSize: 12,
                }}
              >
                <User size={15} color={roleIntent === 'user' ? '#F97316' : 'currentColor'} />
                <div>
                  <span style={{ fontWeight: 600, display: 'block', fontSize: 12 }}>Visitante</span>
                  <span style={{ fontSize: 10, opacity: 0.6 }}>Comentar y participar</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setRoleIntent('editor');
                  setError('');
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '9px 12px',
                  borderRadius: 10,
                  border: roleIntent === 'editor' ? '1px solid #F97316' : '1px solid rgba(255,255,255,0.08)',
                  background: roleIntent === 'editor' ? 'rgba(249,115,22,0.12)' : 'rgba(255,255,255,0.02)',
                  color: roleIntent === 'editor' ? 'white' : 'rgba(255,255,255,0.5)',
                  cursor: 'pointer',
                  textAlign: 'left',
                  fontSize: 12,
                }}
              >
                <ShieldCheck size={15} color={roleIntent === 'editor' ? '#F97316' : 'currentColor'} />
                <div>
                  <span style={{ fontWeight: 600, display: 'block', fontSize: 12 }}>Editor</span>
                  <span style={{ fontSize: 10, opacity: 0.6 }}>Subir fotos y videos</span>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* Mensajes de Alerta y Éxito */}
        {error && (
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 8,
              padding: '10px 12px',
              borderRadius: 10,
              background: 'rgba(220,38,38,0.14)',
              border: '1px solid rgba(220,38,38,0.35)',
              color: '#FCA5A5',
              fontSize: 12,
              marginBottom: 16,
              lineHeight: 1.4,
            }}
          >
            <AlertCircle size={16} style={{ flexShrink: 0, marginTop: 1 }} />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '10px 12px',
              borderRadius: 10,
              background: 'rgba(34,197,94,0.14)',
              border: '1px solid rgba(34,197,94,0.35)',
              color: '#86EFAC',
              fontSize: 12,
              marginBottom: 16,
              lineHeight: 1.4,
            }}
          >
            <CheckCircle2 size={16} style={{ flexShrink: 0 }} />
            <span>{success}</span>
          </div>
        )}

        {/* ─────────────────────────────────────────────────────────────
            FORMULARIO: INICIAR SESIÓN Y REGISTRO
        ───────────────────────────────────────────────────────────── */}
        {(mode === 'login' || mode === 'register') && (
          <form
            onSubmit={mode === 'login' ? handleLogin : handleRegister}
            style={{ display: 'flex', flexDirection: 'column', gap: 14 }}
          >
            {/* Nombre completo (solo en Registro) */}
            {mode === 'register' && (
              <div>
                <label style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', display: 'block', marginBottom: 5 }}>
                  Tu Nombre Completo (como saldrá en tus comentarios):
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    placeholder="Ej. Alexander Diego"
                    style={{
                      width: '100%',
                      padding: '10px 14px 10px 38px',
                      borderRadius: 10,
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.12)',
                      color: 'white',
                      fontSize: 13,
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                    onFocus={e => (e.target.style.borderColor = '#F97316')}
                    onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.12)')}
                  />
                  <User
                    size={15}
                    color="rgba(255,255,255,0.35)"
                    style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }}
                  />
                </div>
              </div>
            )}

            {/* Correo Electrónico */}
            <div>
              <label style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', display: 'block', marginBottom: 5 }}>
                Correo Electrónico Real:
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="ejemplo@gmail.com"
                  style={{
                    width: '100%',
                    padding: '10px 14px 10px 38px',
                    borderRadius: 10,
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    color: 'white',
                    fontSize: 13,
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                  onFocus={e => (e.target.style.borderColor = '#F97316')}
                  onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.12)')}
                />
                <Mail
                  size={15}
                  color="rgba(255,255,255,0.35)"
                  style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }}
                />
              </div>
              {mode === 'register' && (
                <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', marginTop: 4, display: 'block' }}>
                  Asegúrate de que sea tu correo real. No se admiten correos falsos ni temporales.
                </span>
              )}
            </div>

            {/* Contraseña */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
                <label style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)' }}>
                  {mode === 'register' ? 'Crea una contraseña para esta página:' : 'Contraseña:'}
                </label>
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={() => {
                      setMode('forgot');
                      setError('');
                      setSuccess('');
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#F97316',
                      cursor: 'pointer',
                      fontSize: 11,
                      padding: 0,
                    }}
                  >
                    ¿Olvidaste tu contraseña?
                  </button>
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
                    width: '100%',
                    padding: '10px 38px 10px 38px',
                    borderRadius: 10,
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    color: 'white',
                    fontSize: 13,
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                  onFocus={e => (e.target.style.borderColor = '#F97316')}
                  onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.12)')}
                />
                <Lock
                  size={15}
                  color="rgba(255,255,255,0.35)"
                  style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: 10,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'rgba(255,255,255,0.4)',
                    padding: 4,
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>

              {/* Indicador de seguridad de contraseña (Solo en registro) */}
              {mode === 'register' && password && (
                <div style={{ marginTop: 6 }}>
                  <div
                    style={{
                      height: 4,
                      width: '100%',
                      backgroundColor: 'rgba(255,255,255,0.1)',
                      borderRadius: 2,
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        height: '100%',
                        width: strength.width,
                        backgroundColor: strength.color,
                        transition: 'all 0.3s ease',
                      }}
                    />
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontSize: 10,
                      marginTop: 3,
                      color: strength.color,
                    }}
                  >
                    <span>Seguridad: {strength.label}</span>
                    <span>Mínimo 6 caracteres</span>
                  </div>
                </div>
              )}
            </div>

            {/* Confirmar Contraseña (Solo en registro) */}
            {mode === 'register' && (
              <div>
                <label style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', display: 'block', marginBottom: 5 }}>
                  Confirma tu contraseña:
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    placeholder="Repite la contraseña"
                    minLength={6}
                    style={{
                      width: '100%',
                      padding: '10px 38px 10px 38px',
                      borderRadius: 10,
                      background: 'rgba(255,255,255,0.05)',
                      border:
                        confirmPassword && confirmPassword !== password
                          ? '1px solid #EF4444'
                          : '1px solid rgba(255,255,255,0.12)',
                      color: 'white',
                      fontSize: 13,
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                    onFocus={e => (e.target.style.borderColor = '#F97316')}
                    onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.12)')}
                  />
                  <Lock
                    size={15}
                    color="rgba(255,255,255,0.35)"
                    style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={{
                      position: 'absolute',
                      right: 10,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: 'rgba(255,255,255,0.4)',
                      padding: 4,
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    {showConfirmPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                {confirmPassword && confirmPassword !== password && (
                  <span style={{ fontSize: 10, color: '#F87171', marginTop: 3, display: 'block' }}>
                    Las contraseñas aún no coinciden.
                  </span>
                )}
              </div>
            )}

            {/* Clave Secreta de Editor (Solo si seleccionó Editor) */}
            {roleIntent === 'editor' && (
              <div
                style={{
                  background: 'rgba(249,115,22,0.08)',
                  border: '1px solid rgba(249,115,22,0.25)',
                  borderRadius: 12,
                  padding: '12px 14px',
                }}
              >
                <label style={{ fontSize: 11, color: '#F97316', fontWeight: 600, display: 'block', marginBottom: 5 }}>
                  🔑 Clave Secreta para Editores CBTA #134:
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showEditorKey ? 'text' : 'password'}
                    required
                    value={editorKey}
                    onChange={e => setEditorKey(e.target.value)}
                    placeholder="Clave de autorización..."
                    style={{
                      width: '100%',
                      padding: '9px 38px 9px 12px',
                      borderRadius: 8,
                      background: 'rgba(0,0,0,0.5)',
                      border: '1px solid rgba(249,115,22,0.3)',
                      color: 'white',
                      fontSize: 13,
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowEditorKey(!showEditorKey)}
                    style={{
                      position: 'absolute',
                      right: 10,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: 'rgba(255,255,255,0.4)',
                      padding: 4,
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    {showEditorKey ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
                <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', display: 'block', marginTop: 4 }}>
                  Proporcionada por los profesores encargados para poder editar el programa y fotos.
                </span>
              </div>
            )}

            {/* Botón Principal de Envío */}
            <button
              type="submit"
              disabled={loading}
              style={{
                marginTop: 6,
                padding: '12px',
                borderRadius: 12,
                background: 'linear-gradient(135deg, #F97316, #C2410C)',
                border: 'none',
                color: 'white',
                cursor: 'pointer',
                fontFamily: 'Cinzel, serif',
                fontWeight: 700,
                fontSize: 14,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                boxShadow: '0 4px 20px rgba(249,115,22,0.35)',
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? (
                <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
              ) : (
                <>
                  <span>{mode === 'login' ? 'Iniciar Sesión con mi Cuenta' : 'Completar Registro'}</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>
        )}

        {/* ─────────────────────────────────────────────────────────────
            FORMULARIO: VERIFICAR CÓDIGO OTP (6 DÍGITOS)
        ───────────────────────────────────────────────────────────── */}
        {mode === 'verify-otp' && (
          <form onSubmit={handleVerifyOtp} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div
              style={{
                padding: 14,
                borderRadius: 12,
                backgroundColor: 'rgba(249,115,22,0.06)',
                border: '1px solid rgba(249,115,22,0.2)',
                fontSize: 12.5,
                color: 'rgba(255,255,255,0.8)',
                lineHeight: 1.5,
              }}
            >
              Ingresa el código de 6 dígitos que enviamos a: <br />
              <strong style={{ color: '#FBBF24' }}>{email}</strong>
            </div>

            <div>
              <label style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', display: 'block', marginBottom: 6 }}>
                Código de Verificación (6 dígitos):
              </label>
              <input
                type="text"
                required
                maxLength={8}
                value={otpToken}
                onChange={e => setOtpToken(e.target.value)}
                placeholder="123456"
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: 10,
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(249,115,22,0.4)',
                  color: 'white',
                  fontSize: 22,
                  fontFamily: 'JetBrains Mono, monospace',
                  textAlign: 'center',
                  letterSpacing: '0.3em',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                padding: '12px',
                borderRadius: 12,
                background: 'linear-gradient(135deg, #F97316, #C2410C)',
                border: 'none',
                color: 'white',
                cursor: 'pointer',
                fontFamily: 'Cinzel, serif',
                fontWeight: 700,
                fontSize: 14,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
              }}
            >
              {loading ? (
                <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
              ) : (
                <span>Confirmar y Activar Cuenta</span>
              )}
            </button>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12 }}>
              <button
                type="button"
                onClick={handleResendCode}
                disabled={resendCooldown > 0 || resending}
                style={{
                  background: 'none',
                  border: 'none',
                  color: resendCooldown > 0 ? 'rgba(255,255,255,0.4)' : '#F97316',
                  cursor: resendCooldown > 0 ? 'default' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  padding: 0,
                }}
              >
                <RefreshCw size={13} />
                <span>{resendCooldown > 0 ? `Reenviar en ${resendCooldown}s` : 'Reenviar código'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setMode('register');
                  setError('');
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'rgba(255,255,255,0.5)',
                  cursor: 'pointer',
                  padding: 0,
                }}
              >
                Cambiar correo
              </button>

              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setError('');
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#F97316',
                  cursor: 'pointer',
                  padding: 0,
                }}
              >
                Iniciar Sesión
              </button>
            </div>
          </form>
        )}

        {/* ─────────────────────────────────────────────────────────────
            FORMULARIO: RECUPERAR CONTRASEÑA
        ───────────────────────────────────────────────────────────── */}
        {mode === 'forgot' && (
          <form onSubmit={handleForgotPassword} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <p style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.7)', margin: 0, lineHeight: 1.5 }}>
              Ingresa el correo con el que te registraste. Te enviaremos un enlace seguro para que puedas definir una nueva contraseña.
            </p>

            <div>
              <label style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', display: 'block', marginBottom: 5 }}>
                Tu Correo Electrónico:
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="ejemplo@gmail.com"
                  style={{
                    width: '100%',
                    padding: '10px 14px 10px 38px',
                    borderRadius: 10,
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    color: 'white',
                    fontSize: 13,
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
                <Mail
                  size={15}
                  color="rgba(255,255,255,0.35)"
                  style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                padding: '12px',
                borderRadius: 12,
                background: 'linear-gradient(135deg, #F97316, #C2410C)',
                border: 'none',
                color: 'white',
                cursor: 'pointer',
                fontFamily: 'Cinzel, serif',
                fontWeight: 700,
                fontSize: 13,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
              }}
            >
              {loading ? (
                <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
              ) : (
                <span>Enviar Enlace de Recuperación</span>
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                setMode('login');
                setError('');
                setSuccess('');
              }}
              style={{
                background: 'none',
                border: 'none',
                color: 'rgba(255,255,255,0.6)',
                cursor: 'pointer',
                fontSize: 12,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
                marginTop: 6,
              }}
            >
              <ArrowLeft size={14} />
              <span>Volver a Iniciar Sesión</span>
            </button>
          </form>
        )}

        {/* Pie alternador entre login y registro */}
        {(mode === 'login' || mode === 'register') && (
          <div
            style={{
              textAlign: 'center',
              marginTop: 18,
              borderTop: '1px solid rgba(255,255,255,0.06)',
              paddingTop: 14,
            }}
          >
            {mode === 'login' ? (
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', margin: 0 }}>
                ¿Primera vez en el portal?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('register');
                    setError('');
                    setSuccess('');
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#F97316',
                    cursor: 'pointer',
                    fontWeight: 600,
                    fontSize: 12,
                  }}
                >
                  Crea tu cuenta aquí
                </button>
              </p>
            ) : (
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', margin: 0 }}>
                ¿Ya te habías registrado?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setError('');
                    setSuccess('');
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#F97316',
                    cursor: 'pointer',
                    fontWeight: 600,
                    fontSize: 12,
                  }}
                >
                  Inicia sesión aquí
                </button>
              </p>
            )}
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div
          style={{
            minHeight: '100vh',
            backgroundColor: '#080208',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Loader2 size={28} color="#F97316" style={{ animation: 'spin 1s linear infinite' }} />
        </div>
      }
    >
      <LoginFormContent />
    </Suspense>
  );
}
