'use client';

import { useEffect, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function VisitorTracker() {
  const hasExecuted = useRef(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (hasExecuted.current) return;
    hasExecuted.current = true;

    // 1. Verificar si este dispositivo ya fue registrado previamente
    const alreadyCounted = localStorage.getItem('cbta134_device_visit_counted');
    if (alreadyCounted) {
      // Este dispositivo YA está contado. No hace ninguna petición a la base de datos.
      return;
    }

    // 2. Obtener o generar el UUID único persistente de este dispositivo
    let deviceId = localStorage.getItem('cbta134_device_id');
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    
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
      localStorage.setItem('cbta134_device_id', deviceId);
    }

    // 3. Marcar inmediatamente de forma local para bloquear cualquier reintento o recarga
    localStorage.setItem('cbta134_device_visit_counted', 'true');

    // 4. Registrar de forma asíncrona en Supabase
    async function logVisit() {
      try {
        const supabase = createClient();
        const path = window.location.pathname || '/';

        // Insertamos usando el deviceId como id (PRIMARY KEY).
        // Si el id ya existía, PostgreSQL rechaza el duplicado con código 23505 y no se cuenta dos veces.
        const { error } = await supabase.from('visitas').insert({
          id: deviceId,
          pagina: path,
        });

        if (!error || error.code === '23505') {
          // Difundir en tiempo real para que todos los navegadores y el panel admin se actualicen al instante
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
