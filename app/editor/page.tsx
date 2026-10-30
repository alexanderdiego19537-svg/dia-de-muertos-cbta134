import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import EditorDashboard from '@/components/editor/EditorDashboard';

export const instant = false;

export default async function EditorPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login?returnTo=/editor');
  }

  // 1. Verificar rol en la tabla profiles
  let { data: profile } = await supabase
    .from('profiles')
    .select('role, full_name')
    .eq('id', user.id)
    .maybeSingle();

  // 2. Respaldo: verificar también metadata del usuario
  const metaRole = user.user_metadata?.role;
  const userRole = profile?.role || metaRole;
  const displayName = profile?.full_name || user.user_metadata?.full_name || user.email?.split('@')[0];

  // Si en metadata es editor pero en profiles aún no estaba guardado, actualizarlo
  if (userRole === 'editor' || userRole === 'admin') {
    if (!profile || profile.role !== userRole) {
      await supabase.from('profiles').upsert({
        id: user.id,
        email: user.email,
        full_name: displayName,
        role: userRole,
      });
    }
  } else {
    redirect('/login?error=no-editor');
  }

  return <EditorDashboard user={user} profileName={displayName} />;
}
