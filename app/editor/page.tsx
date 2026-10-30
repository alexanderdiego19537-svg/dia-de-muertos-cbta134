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

  // Verificar si es editor o admin
  const { data: profile } = await supabase
    .from('profiles')
    .select('role, full_name')
    .eq('id', user.id)
    .single();

  if (!profile || (profile.role !== 'editor' && profile.role !== 'admin')) {
    redirect('/login?error=no-editor');
  }

  return <EditorDashboard user={user} profileName={profile?.full_name} />;
}
