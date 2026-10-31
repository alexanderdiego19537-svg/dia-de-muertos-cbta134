import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Refrescar sesión — IMPORTANTE: no agregar lógica entre aquí y el return
  const { data: { user } } = await supabase.auth.getUser();

  // Proteger rutas /admin/* y /editor/*
  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin');
  const isEditorRoute = request.nextUrl.pathname.startsWith('/editor');
  const isAdminLoginPage = request.nextUrl.pathname === '/admin/login';
  const isGeneralLoginPage = request.nextUrl.pathname === '/login';

  // Si intenta entrar a /admin (no login) y no está autenticado → redirigir a /admin/login
  if (isAdminRoute && !isAdminLoginPage && !user) {
    const url = request.nextUrl.clone();
    url.pathname = '/admin/login';
    return NextResponse.redirect(url);
  }

  // Si intenta entrar a /editor y no está autenticado → redirigir a /login con returnTo
  if (isEditorRoute && !user) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('returnTo', '/editor');
    return NextResponse.redirect(url);
  }

  // Si ya está logueado y va a login de admin → redirigir al panel
  if (isAdminLoginPage && user) {
    const url = request.nextUrl.clone();
    url.pathname = '/admin';
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
