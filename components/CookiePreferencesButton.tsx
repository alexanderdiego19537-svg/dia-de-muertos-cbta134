'use client';

export default function CookiePreferencesButton() {
  return (
    <button
      onClick={() => {
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('cbta134:open_cookie_banner'));
        }
      }}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        padding: '10px 24px',
        borderRadius: 999,
        background: 'rgba(249,115,22,0.15)',
        border: '1px solid rgba(249,115,22,0.4)',
        color: '#F97316',
        fontFamily: 'Inter, sans-serif',
        fontSize: 13,
        fontWeight: 700,
        cursor: 'pointer',
        transition: 'all 0.2s',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.background = 'rgba(249,115,22,0.25)';
        e.currentTarget.style.borderColor = 'rgba(249,115,22,0.7)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = 'rgba(249,115,22,0.15)';
        e.currentTarget.style.borderColor = 'rgba(249,115,22,0.4)';
      }}
    >
      <span>🍪</span>
      <span>Abrir Gestor de Preferencias de Cookies</span>
    </button>
  );
}
