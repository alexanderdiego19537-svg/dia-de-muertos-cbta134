'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Users, Shield, Edit3, UserCheck, Search, Loader2, Check, AlertCircle } from 'lucide-react';

interface Profile {
  id: string;
  email: string;
  full_name: string;
  role: 'user' | 'editor' | 'admin';
  created_at: string;
}

export default function AdminUsers() {
  const supabase = createClient();
  const [profiles, setProfiles]   = useState<Profile[]>([]);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [toast, setToast]         = useState<{ type: 'ok' | 'err'; msg: string } | null>(null);

  const loadProfiles = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        setProfiles(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    loadProfiles();
  }, [loadProfiles]);

  function showToast(type: 'ok' | 'err', msg: string) {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3500);
  }

  async function handleRoleChange(profileId: string, newRole: 'user' | 'editor' | 'admin') {
    setUpdatingId(profileId);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', profileId);

      if (!error) {
        setProfiles(prev => prev.map(p => p.id === profileId ? { ...p, role: newRole } : p));
        showToast('ok', `Rol actualizado a "${newRole}" con éxito`);
      } else {
        showToast('err', `Error al cambiar rol: ${error.message}`);
      }
    } catch (err) {
      console.error(err);
      showToast('err', 'Ocurrió un error');
    } finally {
      setUpdatingId(null);
    }
  }

  const filtered = profiles.filter(p =>
    (p.full_name || '').toLowerCase().includes(search.toLowerCase()) ||
    (p.email || '').toLowerCase().includes(search.toLowerCase())
  );

  const totalUsers   = profiles.filter(p => p.role === 'user').length;
  const totalEditors = profiles.filter(p => p.role === 'editor').length;
  const totalAdmins  = profiles.filter(p => p.role === 'admin').length;

  return (
    <div style={{ maxWidth: 880, margin: '0 auto' }}>
      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', top: 20, right: 20, zIndex: 9999,
          padding: '12px 18px', borderRadius: 10,
          background: toast.type === 'ok' ? 'rgba(34,197,94,0.95)' : 'rgba(220,38,38,0.95)',
          color: 'white', display: 'flex', alignItems: 'center', gap: 8,
          boxShadow: '0 8px 30px rgba(0,0,0,0.5)', fontSize: 13,
        }}>
          {toast.type === 'ok' ? <Check size={16} /> : <AlertCircle size={16} />}
          <span>{toast.msg}</span>
        </div>
      )}

      {/* Encabezado */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontFamily: 'Cinzel, serif', fontWeight: 900, fontSize: 22, color: 'white', margin: '0 0 6px' }}>
          👥 Gestión de Usuarios y Roles
        </h1>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', margin: 0 }}>
          Controla quién tiene acceso de Visitante, quién puede editar fotos y programa, y quién es Administrador.
        </p>
      </div>

      {/* Tarjetas de conteo por rol */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: 12, marginBottom: 24,
      }}>
        <div style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: 16 }}>
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', fontFamily: 'JetBrains Mono, monospace' }}>Visitantes</span>
          <p style={{ fontSize: 26, fontWeight: 800, color: '#60A5FA', margin: '4px 0 0', fontFamily: 'Cinzel, serif' }}>{totalUsers}</p>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: 16 }}>
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', fontFamily: 'JetBrains Mono, monospace' }}>Editores</span>
          <p style={{ fontSize: 26, fontWeight: 800, color: '#F97316', margin: '4px 0 0', fontFamily: 'Cinzel, serif' }}>{totalEditors}</p>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: 16 }}>
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', fontFamily: 'JetBrains Mono, monospace' }}>Admins</span>
          <p style={{ fontSize: 26, fontWeight: 800, color: '#A855F7', margin: '4px 0 0', fontFamily: 'Cinzel, serif' }}>{totalAdmins}</p>
        </div>
      </div>

      {/* Barra de búsqueda */}
      <div style={{ position: 'relative', marginBottom: 20 }}>
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Buscar por nombre o correo..."
          style={{
            width: '100%', padding: '10px 14px 10px 38px',
            borderRadius: 10, background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.1)',
            color: 'white', fontSize: 13, outline: 'none',
            boxSizing: 'border-box',
          }}
        />
        <Search size={16} color="rgba(255,255,255,0.3)" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
      </div>

      {/* Lista / Tabla de usuarios */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}>
          <Loader2 size={24} color="#F97316" style={{ animation: 'spin 1s linear infinite' }} />
        </div>
      ) : filtered.length === 0 ? (
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', textAlign: 'center', padding: 30 }}>
          No se encontraron usuarios registrados.
        </p>
      ) : (
        <div style={{
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 14, overflow: 'hidden',
        }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', textAlign: 'left', color: 'rgba(255,255,255,0.45)' }}>
                  <th style={{ padding: '12px 16px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 500 }}>Usuario</th>
                  <th style={{ padding: '12px 16px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 500 }}>Correo</th>
                  <th style={{ padding: '12px 16px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 500 }}>Rol Actual</th>
                  <th style={{ padding: '12px 16px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 500, textAlign: 'right' }}>Cambiar Rol</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(p => {
                  const isUpdating = updatingId === p.id;
                  const roleColor = p.role === 'admin' ? '#A855F7' : p.role === 'editor' ? '#F97316' : '#60A5FA';
                  const roleLabel = p.role === 'admin' ? 'Administrador' : p.role === 'editor' ? 'Editor' : 'Visitante';

                  return (
                    <tr key={p.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                      <td style={{ padding: '14px 16px' }}>
                        <strong style={{ color: 'white', display: 'block' }}>{p.full_name || 'Sin nombre'}</strong>
                        <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', fontFamily: 'JetBrains Mono, monospace' }}>
                          ID: {p.id.substring(0, 8)}...
                        </span>
                      </td>
                      <td style={{ padding: '14px 16px', color: 'rgba(255,255,255,0.7)' }}>
                        {p.email}
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <span style={{
                          padding: '4px 10px', borderRadius: 999,
                          background: `${roleColor}18`,
                          border: `1px solid ${roleColor}40`,
                          color: roleColor, fontSize: 11,
                          fontWeight: 600,
                          fontFamily: 'JetBrains Mono, monospace',
                        }}>
                          {roleLabel}
                        </span>
                      </td>
                      <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                        {isUpdating ? (
                          <Loader2 size={16} color="#F97316" style={{ animation: 'spin 1s linear infinite', marginLeft: 'auto' }} />
                        ) : (
                          <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                            {p.role !== 'editor' && (
                              <button
                                onClick={() => handleRoleChange(p.id, 'editor')}
                                title="Asignar rol de Editor (puede subir fotos y programa)"
                                style={{
                                  padding: '5px 10px', borderRadius: 6,
                                  background: 'rgba(249,115,22,0.12)', border: '1px solid rgba(249,115,22,0.3)',
                                  color: '#F97316', cursor: 'pointer', fontSize: 11,
                                }}
                              >
                                Hacer Editor
                              </button>
                            )}

                            {p.role !== 'user' && (
                              <button
                                onClick={() => handleRoleChange(p.id, 'user')}
                                title="Degradar a Visitante normal"
                                style={{
                                  padding: '5px 10px', borderRadius: 6,
                                  background: 'rgba(96,165,250,0.12)', border: '1px solid rgba(96,165,250,0.3)',
                                  color: '#93C5FD', cursor: 'pointer', fontSize: 11,
                                }}
                              >
                                Hacer Visitante
                              </button>
                            )}

                            {p.role !== 'admin' && (
                              <button
                                onClick={() => handleRoleChange(p.id, 'admin')}
                                title="Hacer Administrador con acceso completo"
                                style={{
                                  padding: '5px 10px', borderRadius: 6,
                                  background: 'rgba(168,85,247,0.12)', border: '1px solid rgba(168,85,247,0.3)',
                                  color: '#C084FC', cursor: 'pointer', fontSize: 11,
                                }}
                              >
                                Hacer Admin
                              </button>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
