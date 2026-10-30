'use client';

import { useEffect, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';

let memoryCounted = false;

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'));
  return match ? decodeURIComponent(match[1]) : null;
}

function setCookie(name: string, value: string) {
  if (typeof document === 'undefined') return;
  const maxAge = 365 * 24 * 60 * 60; // 1 año (31,536,000 segundos)
  document.cookie = `${name}=${encodeURIComponent(value)}; max-age=${maxAge}; path=/; SameSite=Lax`;
}

export default function VisitorTracker() {
  const hasExecuted = useRef(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (hasExecuted.current || memoryCounted) return;
    hasExecuted.current = true;

    // 1. Capas de verificación: Memoria, Cookies (1 año), LocalStorage y SessionStorage
    const cookieCounted = getCookie('cbta134_visited');
    let localCounted = false;
    let sessionCounted = false;
    try {
      localCounted = !!localStorage.getItem('cbta134_visited');
      sessionCounted = !!sessionStorage.getItem('cbta134_visited');
    } catch {}

    if (memoryCounted || cookieCounted || localCounted || sessionCounted) {
      // Dispositivo ya contabilizado: bloqueo inmediato sin peticiones a la base de datos
      return;
    }

    // 2. Obtener o crear UUID persistente único del dispositivo
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    let deviceId = getCookie('cbta134_did');
    if (!deviceId || !uuidRegex.test(deviceId)) {
      try {
        const stored = localStorage.getItem('cbta134_did');
        if (stored && uuidRegex.test(stored)) {
          deviceId = stored;
        }
      } catch {}
    }

    if (!deviceId || !uuidRegex.test(deviceId)) {
      if (typeof crypto !== 'undefined' && crypto.randomUUID) {
        deviceId = crypto.randomUUID();
      } else {
        deviceId = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
          const r = (Math.random() * 16) | 0;
          const v = c === 'x' ? r : (r & 0x3) | 0x8;
          return v.toString(16);
        });
      }
    }

    // 3. Marcar inmediatamente en TODAS las capas de persistencia local
    memoryCounted = true;
    setCookie('cbta134_visited', '1');
    setCookie('cbta134_did', deviceId);
    try {
      localStorage.setItem('cbta134_visited', '1');
      localStorage.setItem('cbta134_did', deviceId);
      sessionStorage.setItem('cbta134_visited', '1');
    } catch {}

    // 4. Registrar de forma única en Supabase
    async function logVisit() {
      try {
        const supabase = createClient();
        const path = window.location.pathname || '/';

        // PostgreSQL rechaza con código 23505 si el id ya existe (PRIMARY KEY)
        const { error } = await supabase.from('visitas').insert({
          id: deviceId,
          pagina: path,
        });

        if (!error || error.code === '23505') {
          // Difundir actualización en vivo
          const channel = supabase.channel('cbta134_stats_sync');
          channel.subscribe(status => {
            if (status === 'SUBSCRIBED') {
              channel.send({
                type: 'broadcast',
                event: 'visit_logged',
                payload: { deviceId, path },
              });
            }
          });
        }
      } catch (err) {
        console.error('VisitorTracker log error:', err);
      }
    }

    logVisit();
  }, []);

  return null;
}
