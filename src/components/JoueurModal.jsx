import { STATS_LABELS } from '../data/joueurs';

const POSTE_COLOR = {
  Gardien:   '#f59e0b',
  Défenseur: '#3b82f6',
  Milieu:    '#22c55e',
  Attaquant: '#e70013',
};

export default function JoueurModal({ joueur, onClose, onEdit, isAdmin }) {
  const color = POSTE_COLOR[joueur.poste] || '#fff';
  const initiales = joueur.nom.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div style={{
        background: '#12121a', border: `1px solid #1e1e2e`,
        borderTop: `4px solid ${color}`,
        borderRadius: 16, width: '100%', maxWidth: 480,
        maxHeight: '90vh', overflowY: 'auto',
      }}>
        {/* Header */}
        <div style={{ padding: '20px 20px 16px', borderBottom: '1px solid #1e1e2e' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
              <div style={{
                width: 72, height: 72, borderRadius: '50%',
                background: color + '25', border: `3px solid ${color}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 24, fontWeight: 700, color, flexShrink: 0, overflow: 'hidden',
              }}>
                {joueur.photo
                  ? <img src={joueur.photo} alt={joueur.nom} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : initiales
                }
              </div>
              <div>
                <div style={{ fontSize: 20, fontWeight: 700, color: '#fff', marginBottom: 6 }}>{joueur.nom}</div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 10, color, background: color + '20', padding: '3px 10px', borderRadius: 12, fontWeight: 700 }}>{joueur.poste}</span>
                  {joueur.selection && <span style={{ fontSize: 10, color: '#e70013', background: '#e7001320', padding: '3px 10px', borderRadius: 12, fontWeight: 700 }}>🇹🇳 {joueur.matchs_selection} sél.</span>}
                </div>
              </div>
            </div>
            <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer', fontSize: 22 }}>×</button>
          </div>

          <div style={{ marginTop: 14, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <div style={{ fontSize: 12, color: '#888' }}>🏟️ <span style={{ color: '#ccc', fontWeight: 600 }}>{joueur.club}</span> · {joueur.pays_club}</div>
            <div style={{ fontSize: 12, color: '#888' }}>🎂 <span style={{ color: '#ccc' }}>{joueur.age} ans</span></div>
            <div style={{ fontSize: 12, color: '#888' }}>📅 Saison <span style={{ color: '#ccc' }}>{joueur.saison}</span></div>
          </div>
        </div>

        {/* Stats */}
        <div style={{ padding: '16px 20px' }}>
          <div style={{ fontSize: 11, color: '#555', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>Statistiques</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
            {Object.entries(STATS_LABELS).map(([key, meta]) => {
              const val = joueur.stats[key];
              if (val === undefined) return null;
              if (key === 'clean_sheets' && joueur.poste !== 'Gardien') return null;
              return (
                <div key={key} style={{
                  background: '#0a0a0f', borderRadius: 10, padding: '14px 10px',
                  textAlign: 'center', border: '1px solid #1a1a28',
                }}>
                  <div style={{ fontSize: 10, marginBottom: 4 }}>{meta.icon}</div>
                  <div style={{ fontSize: 24, fontWeight: 700, color }}>{val}</div>
                  <div style={{ fontSize: 9, color: '#555', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: 2 }}>{meta.label}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Actions admin */}
        {isAdmin && (
          <div style={{ padding: '0 20px 20px', display: 'flex', gap: 8 }}>
            <button onClick={() => onEdit(joueur)} style={{
              flex: 1, padding: '9px 0', background: color, border: 'none',
              borderRadius: 8, color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer',
            }}>✏️ Modifier</button>
          </div>
        )}
      </div>
    </div>
  );
}
