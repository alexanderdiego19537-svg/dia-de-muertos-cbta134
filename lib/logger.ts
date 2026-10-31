/**
 * Utilidad de Monitoreo y Diagnóstico de Errores (Paso 7: Seguridad e Infraestructura)
 * Preparado para Sentry, Vercel Analytics y registro local estructurado.
 */

interface ErrorContext {
  component?: string;
  action?: string;
  userId?: string;
  extra?: Record<string, unknown>;
}

export function logError(error: unknown, context?: ErrorContext) {
  const timestamp = new Date().toISOString();
  const errorMessage = error instanceof Error ? error.message : String(error);
  const errorStack = error instanceof Error ? error.stack : undefined;

  const payload = {
    timestamp,
    message: errorMessage,
    stack: errorStack,
    component: context?.component || 'Unknown',
    action: context?.action || 'general',
    userId: context?.userId,
    extra: context?.extra,
  };

  // 1. Registro en consola estructurado
  if (process.env.NODE_ENV !== 'production') {
    console.error('[DIAGNOSTIC ERROR]', payload);
  } else {
    console.error(`[ERR] ${timestamp} | ${payload.component} | ${payload.message}`);
  }

  // 2. Envío a Sentry si existe la variable NEXT_PUBLIC_SENTRY_DSN configurada
  if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_SENTRY_DSN) {
    try {
      // Disparo de telemetría a Sentry
      fetch(process.env.NEXT_PUBLIC_SENTRY_DSN, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        mode: 'no-cors',
      }).catch(() => {});
    } catch {
      // Ignorar fallos de red en telemetría para proteger la experiencia del usuario
    }
  }
}
