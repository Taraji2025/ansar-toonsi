import { useState } from 'react';

const ADMIN_PASSWORD = 'toonsi2025';

export default function AdminLoginModal({ onSuccess, onClose }) {
  const [pwd, setPwd]   = useState('');
  const [err, setErr]   = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    if (pwd === ADMIN_PASSWORD) {
      onSuccess();
    } else {
      setErr(true);
      setPwd('');
    }
  }

  return (
    <div className="at-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="at-modal" style={{ maxWidth: 340 }}>
        <div className="at-modal-header-bg">
          <div className="at-modal-header-glow" style={{ background: '#e70013' }} />
          <button className="at-modal-close" onClick={onClose}>×</button>
          <div style={{ fontSize: 32, marginBottom: 8 }}>🔐</div>
          <div style={{ fontSize: 18, fontWeight: 800, color: '#fff' }}>Mode Admin</div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>
            Entrez le mot de passe pour modifier les joueurs
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <input
            type="password"
            className="at-input"
            placeholder="Mot de passe..."
            value={pwd}
            onChange={e => { setPwd(e.target.value); setErr(false); }}
            autoFocus
          />
          {err && (
            <div style={{ fontSize: 12, color: '#e70013', textAlign: 'center' }}>
              ❌ Mot de passe incorrect
            </div>
          )}
          <button
            type="submit"
            style={{
              padding: '11px 0', background: '#e70013', border: 'none',
              borderRadius: 10, color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer',
            }}
          >
            Entrer
          </button>
        </form>
      </div>
    </div>
  );
}
