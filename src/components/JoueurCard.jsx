const POSTE_COLOR = {
  Gardien:   '#f59e0b',
  Défenseur: '#3b82f6',
  Milieu:    '#22c55e',
  Attaquant: '#e70013',
};

export default function JoueurCard({ joueur, onClick }) {
  const color = POSTE_COLOR[joueur.poste] || '#fff';
  const initiales = joueur.nom.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div
      onClick={() => onClick(joueur)}
      style={{
        background: '#12121a',
        border: `1px solid #1e1e2e`,
        borderTop: `3px solid ${color}`,
        borderRadius: 12,
        padding: '16px',
        cursor: 'pointer',
        transition: 'transform 0.15s, border-color 0.15s',
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
      }}
      onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.borderColor = color; }}
      onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderTop = `3px solid ${color}`; e.currentTarget.style.borderColor = '#1e1e2e'; e.currentTarget.style.borderTopColor = color; }}
    >
      {/* Avatar + infos */}
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <div style={{
          width: 52, height: 52, borderRadius: '50%',
          background: color + '25',
          border: `2px solid ${color}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 18, fontWeight: 700, color, flexShrink: 0,
          overflow: 'hidden',
        }}>
          {joueur.photo
            ? <img src={joueur.photo} alt={joueur.nom} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            : initiales
          }
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#fff', lineHeight: 1.2, marginBottom: 3 }}>{joueur.nom}</div>
          <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 9, color, background: color + '20', padding: '2px 7px', borderRadius: 10, fontWeight: 700 }}>
              {joueur.poste}
            </span>
            {joueur.selection && (
              <span style={{ fontSize: 9, color: '#e70013', background: '#e7001320', padding: '2px 7px', borderRadius: 10, fontWeight: 700 }}>
                🇹🇳 Sélection
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Club */}
      <div style={{ fontSize: 11, color: '#888', display: 'flex', alignItems: 'center', gap: 4 }}>
        <span>🏟️</span>
        <span style={{ fontWeight: 600, color: '#bbb' }}>{joueur.club}</span>
        <span>· {joueur.pays_club}</span>
      </div>

      {/* Stats mini */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6 }}>
        {[
          { l: 'Matchs', v: joueur.stats.matchs },
          { l: 'Buts',   v: joueur.stats.buts },
          { l: 'Passes', v: joueur.stats.passes },
        ].map(s => (
          <div key={s.l} style={{ background: '#0a0a0f', borderRadius: 6, padding: '6px 4px', textAlign: 'center' }}>
            <div style={{ fontSize: 16, fontWeight: 700, color }}>{s.v}</div>
            <div style={{ fontSize: 9, color: '#666', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{s.l}</div>
          </div>
        ))}
      </div>

      <div style={{ fontSize: 10, color: '#555', textAlign: 'right' }}>
        {joueur.age} ans · Saison {joueur.saison}
      </div>
    </div>
  );
}
