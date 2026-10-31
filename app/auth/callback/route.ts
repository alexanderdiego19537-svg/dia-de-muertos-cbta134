import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code  = searchParams.get('code');
  const next  = searchParams.get('next') ?? '/';

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error && data.user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .maybeSingle();

      if (profile?.role === 'admin') {
        return NextResponse.redirect(`${origin}/admin`);
      } else if (profile?.role === 'editor') {
        return NextResponse.redirect(`${origin}/editor`);
      }
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Error — redirigir a login con mensaje
  return NextResponse.redirect(`${origin}/login?error=auth`);
}
