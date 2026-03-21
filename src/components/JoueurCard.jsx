const POSTE_COLOR = {
  Gardien:   '#f59e0b',
  Défenseur: '#3b82f6',
  Milieu:    '#22c55e',
  Attaquant: '#e70013',
};

const POSTE_ICON = {
  Gardien:   '🧤',
  Défenseur: '🛡️',
  Milieu:    '⚙️',
  Attaquant: '⚡',
};

const NIVEAU_COLOR = {
  Senior:   '#e70013',
  U23:      '#8b5cf6',
  U20:      '#3b82f6',
  U19:      '#22c55e',
  U17:      '#f59e0b',
  Réserve:  '#6b7280',
};

const STATUT_LABEL = {
  confirmed:         { label: '✓ Confirmé',     color: '#22c55e' },
  reported_eligible: { label: '~ Éligible',      color: '#f59e0b' },
  a_confirmer:       { label: '? À confirmer',   color: '#6b7280' },
};

export default function JoueurCard({ joueur, onClick }) {
  const color    = POSTE_COLOR[joueur.poste]  || '#fff';
  const icon     = POSTE_ICON[joueur.poste]   || '⚽';
  const nColor   = NIVEAU_COLOR[joueur.niveau] || '#6b7280';
  const statut   = STATUT_LABEL[joueur.statut] || STATUT_LABEL.a_confirmer;
  const initiales = joueur.nom.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div
      className="at-card"
      style={{ '--card-color': color }}
      onClick={() => onClick(joueur)}
    >
      <div className="at-card-stripe" style={{ background: color }} />
      <div className="at-card-glow"   style={{ background: color }} />

      {/* Ligne 1 : Avatar + Nom + Badges */}
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', paddingTop: 4 }}>
        <div
          className="at-avatar"
          style={{ width: 52, height: 52, fontSize: 16, background: color + '20', borderColor: color, color }}
        >
          {joueur.photo
            ? <img src={joueur.photo} alt={joueur.nom} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            : initiales
          }
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontSize: 14, fontWeight: 700, color: '#fff', lineHeight: 1.2,
            marginBottom: 5, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>
            {joueur.nom}
          </div>
          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
            <span className="at-badge" style={{ color, background: color + '20' }}>
              {icon} {joueur.poste}
            </span>
            <span className="at-badge" style={{ color: nColor, background: nColor + '20' }}>
              {joueur.niveau}
            </span>
            {joueur.selection && (
              <span className="at-badge" style={{ color: '#e70013', background: '#e7001320' }}>
                🇹🇳
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Ligne 2 : Club */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 6, fontSize: 11,
        color: 'var(--text-muted)', borderTop: '1px solid var(--border)', paddingTop: 10,
      }}>
        <span style={{ fontSize: 13 }}>🏟️</span>
        <span style={{ fontWeight: 600, color: 'var(--text-dim)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {joueur.club}
        </span>
        <span style={{ color: 'var(--text-muted)', flexShrink: 0 }}>· {joueur.pays_club}</span>
      </div>

      {/* Ligne 3 : Stats */}
      <div style={{ display: 'flex', gap: 6 }}>
        {[
          { l: 'Matchs', v: joueur.stats.matchs },
          { l: 'Buts',   v: joueur.stats.buts   },
          { l: 'Passes', v: joueur.stats.passes  },
        ].map(s => (
          <div key={s.l} className="at-mini-stat">
            <div className="at-mini-stat-val" style={{ color }}>{s.v}</div>
            <div className="at-mini-stat-lbl">{s.l}</div>
          </div>
        ))}
      </div>

      {/* Ligne 4 : Âge + statut */}
      <div style={{
        fontSize: 10, color: 'var(--text-muted)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <span>{joueur.age ? `🎂 ${joueur.age} ans` : '🎂 —'}</span>
        <span style={{ color: statut.color, fontWeight: 600 }}>{statut.label}</span>
      </div>
    </div>
  );
}
