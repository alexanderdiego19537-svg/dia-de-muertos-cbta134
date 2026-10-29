import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    // Durante el build estático las env vars de Supabase pueden no estar
    // disponibles. Retornamos un cliente vacío para que Next.js pueda
    // pre-renderizar la página sin lanzar un error.
    return createBrowserClient('https://placeholder.supabase.co', 'placeholder-key');
  }

  return createBrowserClient(url, key);
}
