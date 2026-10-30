'use client';

import { useState } from 'react';
import type { User } from '@supabase/supabase-js';
import {
  LayoutDashboard, Images, FileText, Calendar,
  Megaphone, BarChart2, LogOut, Skull, Menu, X, MessageSquare
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import AdminGallery from './AdminGallery';
import AdminContent from './AdminContent';
import AdminPrograma from './AdminPrograma';
import AdminAnuncios from './AdminAnuncios';
import AdminStats from './AdminStats';
import AdminComentarios from './AdminComentarios';

interface Props { user: User }

const TABS = [
  { id: 'dashboard',   label: 'Inicio',       icon: LayoutDashboard },
  { id: 'gallery',     label: 'Galería',      icon: Images },
  { id: 'comentarios', label: 'Comentarios',  icon: MessageSquare },
  { id: 'programa',    label: 'Programa',     icon: Calendar },
  { id: 'anuncios',    label: 'Anuncios',     icon: Megaphone },
  { id: 'stats',       label: 'Estadísticas', icon: BarChart2 },
];

export default function AdminDashboard({ user }: Props) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push('/admin/login');
    router.refresh();
  }

  const sidebar = (
    <div style={{
      width: 220, height: '100%', flexShrink: 0,
      background: 'rgba(10,4,10,0.98)',
      borderRight: '1px solid rgba(249,115,22,0.1)',
      display: 'flex', flexDirection: 'column',
      padding: '24px 0',
      backdropFilter: 'blur(20px)',
    }}>
      {/* Logo */}
      <div style={{ padding: '0 20px 24px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 36, height: 36, borderRadius: '50%',
            background: 'rgba(249,115,22,0.15)',
            border: '1px solid rgba(249,115,22,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Skull size={18} style={{ color: '#F97316' }} />
          </div>
          <div>
            <p style={{ fontFamily: 'Cinzel, serif', fontWeight: 900, fontSize: 12, color: 'white', margin: 0 }}>Admin Panel</p>
            <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', margin: 0 }}>CBTA #134</p>
          </div>
        </div>
        <p style={{
          fontSize: 11, color: 'rgba(249,115,22,0.6)', marginTop: 12, margin: '12px 0 0',
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>{user.email}</p>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '16px 10px', display: 'flex', flexDirection: 'column', gap: 4 }}>
        {TABS.map(({ id, label, icon: Icon }) => {
          const active = activeTab === id;
          return (
            <button
              key={id}
              onClick={() => { setActiveTab(id); setSidebarOpen(false); }}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '10px 12px', borderRadius: 10, width: '100%',
                background: active ? 'rgba(249,115,22,0.12)' : 'transparent',
                border: active ? '1px solid rgba(249,115,22,0.2)' : '1px solid transparent',
                color: active ? '#F97316' : 'rgba(255,255,255,0.45)',
                cursor: 'pointer', fontFamily: 'Inter, sans-serif',
                fontSize: 13, fontWeight: active ? 600 : 400,
                textAlign: 'left', transition: 'all 0.15s',
              }}
            >
              <Icon size={16} />
              {label}
            </button>
          );
        })}
      </nav>

      {/* Logout */}
      <div style={{ padding: '16px 10px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <button
          onClick={handleLogout}
          style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '10px 12px', borderRadius: 10, width: '100%',
            background: 'transparent', border: '1px solid transparent',
            color: 'rgba(255,255,255,0.3)', cursor: 'pointer',
            fontFamily: 'Inter, sans-serif', fontSize: 13,
            textAlign: 'left', transition: 'all 0.15s',
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = '#F87171'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.3)'; }}
        >
          <LogOut size={16} />
          Cerrar sesión
        </button>
      </div>
    </div>
  );

  return (
    <div style={{
      display: 'flex', height: '100vh',
      backgroundColor: '#0A040A', color: 'white',
      fontFamily: 'Inter, sans-serif', overflow: 'hidden',
    }}>
      {/* Sidebar desktop */}
      <div className="hidden md:flex" style={{ height: '100vh' }}>
        {sidebar}
      </div>

      {/* Sidebar móvil overlay */}
      {sidebarOpen && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 100,
          display: 'flex',
        }}>
          <div onClick={() => setSidebarOpen(false)} style={{
            position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)',
          }} />
          <div style={{ position: 'relative', zIndex: 1, height: '100%' }}>
            {sidebar}
          </div>
        </div>
      )}

      {/* Main content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Top bar móvil */}
        <div className="md:hidden" style={{
          display: 'flex', alignItems: 'center', gap: 12,
          padding: '12px 16px',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
          background: 'rgba(10,4,10,0.98)',
        }}>
          <button
            onClick={() => setSidebarOpen(true)}
            style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', padding: 4 }}
          >
            <Menu size={20} />
          </button>
          <span style={{ fontFamily: 'Cinzel, serif', fontWeight: 900, fontSize: 14, color: 'white' }}>
            {TABS.find(t => t.id === activeTab)?.label ?? 'Admin'}
          </span>
        </div>

        {/* Contenido del tab */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
          {activeTab === 'dashboard'   && <DashboardHome user={user} setActiveTab={setActiveTab} />}
          {activeTab === 'gallery'     && <AdminGallery />}
          {activeTab === 'comentarios' && <AdminComentarios />}
          {activeTab === 'programa'    && <AdminPrograma />}
          {activeTab === 'anuncios'    && <AdminAnuncios />}
          {activeTab === 'stats'       && <AdminStats />}
        </div>
      </div>
    </div>
  );
}

/* ── Pantalla de inicio del panel ── */
function DashboardHome({ user, setActiveTab }: { user: User; setActiveTab: (t: string) => void }) {
  const acciones = [
    { icon: Images,        title: 'Subir fotos',        desc: 'Agrega fotos del evento a la galería', tab: 'gallery',     color: '#F97316' },
    { icon: MessageSquare, title: 'Moderar comentarios',desc: 'Revisa o elimina mensajes del muro',   tab: 'comentarios', color: '#38BDF8' },
    { icon: Calendar,      title: 'Editar programa',    desc: 'Actualiza las actividades del evento',  tab: 'programa',    color: '#34D399' },
    { icon: Megaphone,     title: 'Publicar anuncio',   desc: 'Agrega un aviso o noticia',            tab: 'anuncios',    color: '#FBBF24' },
    { icon: BarChart2,     title: 'Ver estadísticas',   desc: 'Visitas, likes y métricas en vivo',    tab: 'stats',       color: '#60A5FA' },
  ];

  return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      {/* Bienvenida */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontFamily: 'Cinzel, serif', fontWeight: 900, fontSize: 26, color: 'white', margin: '0 0 6px' }}>
          ¡Bienvenido, Admin! 💀
        </h1>
        <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', margin: 0 }}>
          {user.email} · CBTA #134 Tetlanhocan
        </p>
      </div>

      {/* Guía rápida */}
      <div style={{
        background: 'rgba(249,115,22,0.06)',
        border: '1px solid rgba(249,115,22,0.15)',
        borderRadius: 14, padding: '20px 24px', marginBottom: 28,
      }}>
        <h2 style={{ fontFamily: 'Cinzel, serif', fontSize: 14, color: '#F97316', margin: '0 0 12px', letterSpacing: '0.05em' }}>
          📖 ¿Cómo usar este panel?
        </h2>
        <ul style={{ margin: 0, paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 6 }}>
          {[
            '📸 Galería → Sube fotos del evento. Se muestran automáticamente en la sección Galería del sitio.',
            '✏️ Contenido → Edita el título, descripción, fecha y lugar del evento.',
            '📅 Programa → Agrega, edita o elimina actividades del programa del día.',
            '📢 Anuncios → Publica avisos que aparecen en la página principal.',
            '📊 Estadísticas → Mira cuántas visitas y likes tiene la página.',
          ].map(item => (
            <li key={item} style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', lineHeight: 1.6 }}>{item}</li>
          ))}
        </ul>
        <p style={{ fontSize: 12, color: 'rgba(249,115,22,0.5)', marginTop: 12, margin: '12px 0 0', fontStyle: 'italic' }}>
          💡 Todos los cambios se reflejan en la página en tiempo real automáticamente.
        </p>
      </div>

      {/* Acciones rápidas */}
      <h2 style={{ fontFamily: 'Cinzel, serif', fontSize: 14, color: 'rgba(255,255,255,0.5)', margin: '0 0 14px', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
        Acciones rápidas
      </h2>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: 12,
      }}>
        {acciones.map(({ icon: Icon, title, desc, tab, color }) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: 12, padding: '18px 16px',
              textAlign: 'left', cursor: 'pointer',
              transition: 'all 0.15s', color: 'white',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = `${color}40`;
              (e.currentTarget as HTMLButtonElement).style.background = `${color}08`;
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.07)';
              (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.03)';
            }}
          >
            <Icon size={20} style={{ color, marginBottom: 10 }} />
            <p style={{ fontWeight: 600, fontSize: 13, margin: '0 0 4px', color: 'white' }}>{title}</p>
            <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', margin: 0, lineHeight: 1.4 }}>{desc}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
