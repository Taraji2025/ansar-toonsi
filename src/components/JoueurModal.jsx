import { STATS_LABELS } from '../data/joueurs';
import StatRadar from './StatRadar';

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
  Senior:  '#e70013',
  U23:     '#8b5cf6',
  U20:     '#3b82f6',
  U19:     '#22c55e',
  U17:     '#f59e0b',
  Réserve: '#6b7280',
};

const STATUT_INFO = {
  confirmed:         { label: 'Éligibilité confirmée',     color: '#22c55e', icon: '✓' },
  reported_eligible: { label: 'Éligibilité rapportée',     color: '#f59e0b', icon: '~' },
  a_confirmer:       { label: 'À confirmer',               color: '#6b7280', icon: '?' },
};

const FLAG_BY_PAYS = {
  'France': '🇫🇷', 'Allemagne': '🇩🇪', 'Espagne': '🇪🇸',
  'Italie': '🇮🇹', 'Angleterre': '🏴󠁧󠁢󠁥󠁮󠁧󠁿', 'Portugal': '🇵🇹',
  'Grèce': '🇬🇷', 'Belgique': '🇧🇪', 'Pays-Bas': '🇳🇱',
  'Turquie': '🇹🇷', 'Tunisie': '🇹🇳', 'Maroc': '🇲🇦',
  'Qatar': '🇶🇦', 'Arabie Saoudite': '🇸🇦', 'Suisse': '🇨🇭',
  'Autriche': '🇦🇹', 'Suède': '🇸🇪', 'Ukraine': '🇺🇦',
  'Slovénie': '🇸🇮', 'Écosse': '🏴󠁧󠁢󠁳󠁣󠁴󠁿', 'Russie': '🇷🇺',
  'Danemark': '🇩🇰', 'Pologne': '🇵🇱', 'Lituanie': '🇱🇹',
  'Géorgie': '🇬🇪', 'Pays-Bas': '🇳🇱',
};

export default function JoueurModal({ joueur, onClose, onEdit, isAdmin }) {
  const color     = POSTE_COLOR[joueur.poste] || '#fff';
  const posteIcon = POSTE_ICON[joueur.poste]  || '⚽';
  const nColor    = NIVEAU_COLOR[joueur.niveau] || '#6b7280';
  const statut    = STATUT_INFO[joueur.statut]  || STATUT_INFO.a_confirmer;
  const flagClub  = FLAG_BY_PAYS[joueur.pays_club] || '🌍';
  const initiales = joueur.nom.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div className="at-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="at-modal">

        {/* ── HEADER ── */}
        <div className="at-modal-header-bg">
          <div className="at-modal-header-glow" style={{ background: color }} />
          <button className="at-modal-close" onClick={onClose}>×</button>

          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <div className="at-modal-avatar" style={{ background: color + '20', borderColor: color, color }}>
              {joueur.photo
                ? <img src={joueur.photo} alt={joueur.nom} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : initiales
              }
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 20, fontWeight: 800, color: '#fff', marginBottom: 8, lineHeight: 1.1 }}>
                {joueur.nom}
              </div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                <span style={{
                  fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 12,
                  color, background: color + '20', border: `1px solid ${color}40`,
                }}>
                  {posteIcon} {joueur.poste}
                </span>
                <span style={{
                  fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 12,
                  color: nColor, background: nColor + '20', border: `1px solid ${nColor}40`,
                }}>
                  {joueur.niveau}
                </span>
                {joueur.selection && (
                  <span style={{
                    fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 12,
                    color: '#e70013', background: '#e7001320', border: '1px solid #e7001340',
                  }}>
                    🇹🇳 Sélection
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Infos rapides */}
          <div style={{ marginTop: 16, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
            <div className="at-info-row" style={{ border: 'none', padding: '4px 0' }}>
              <span>{flagClub}</span>
              <span><strong>{joueur.club}</strong> · {joueur.pays_club}</span>
            </div>
            <div className="at-info-row" style={{ border: 'none', padding: '4px 0' }}>
              <span>🎂</span>
              <span>{joueur.age ? <strong>{joueur.age} ans</strong> : '—'}</span>
            </div>
            <div className="at-info-row" style={{ border: 'none', padding: '4px 0' }}>
              <span style={{ color: statut.color }}>{statut.icon}</span>
              <span style={{ color: statut.color, fontWeight: 600 }}>{statut.label}</span>
            </div>
            <div className="at-info-row" style={{ border: 'none', padding: '4px 0' }}>
              <span>📅</span>
              <span>Saison <strong>{joueur.saison}</strong></span>
            </div>
          </div>
        </div>

        {/* ── STATS ── */}
        <div style={{ padding: '20px' }}>
          <div style={{
            fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase',
            letterSpacing: '0.1em', fontWeight: 700, marginBottom: 14,
          }}>
            Statistiques saison
          </div>

          {/* Chips chiffres */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 20 }}>
            {Object.entries(STATS_LABELS).map(([key, meta]) => {
              const val = joueur.stats[key];
              if (val === undefined) return null;
              if (key === 'clean_sheets' && joueur.poste !== 'Gardien') return null;
              return (
                <div key={key} className="at-modal-stat">
                  <div className="at-modal-stat-icon">{meta.icon}</div>
                  <div className="at-modal-stat-val" style={{ color }}>{val}</div>
                  <div className="at-modal-stat-lbl">{meta.label}</div>
                </div>
              );
            })}
          </div>

          {/* Radar */}
          {(() => {
            const hasStats = Object.values(joueur.stats).some(v => v > 0);
            if (!hasStats) return (
              <div style={{ textAlign: 'center', padding: '16px 0', color: 'var(--text-muted)', fontSize: 12 }}>
                Aucune statistique enregistrée pour cette saison
              </div>
            );

            // Définir les axes selon le poste
            const AXES_BY_POSTE = {
              Gardien:   [
                { key: 'matchs',         label: 'Matchs',   max: 40 },
                { key: 'clean_sheets',   label: 'CS',       max: 20 },
                { key: 'passes',         label: 'Passes',   max: 5  },
                { key: 'cartons_jaunes', label: 'CJ',       max: 10 },
                { key: 'buts',           label: 'Buts',     max: 2  },
              ],
              Défenseur: [
                { key: 'matchs',         label: 'Matchs',   max: 40 },
                { key: 'buts',           label: 'Buts',     max: 10 },
                { key: 'passes',         label: 'Passes',   max: 10 },
                { key: 'cartons_jaunes', label: 'CJ',       max: 10 },
                { key: 'cartons_rouges', label: 'CR',       max: 3  },
              ],
              Milieu:    [
                { key: 'matchs',         label: 'Matchs',   max: 40 },
                { key: 'buts',           label: 'Buts',     max: 15 },
                { key: 'passes',         label: 'Passes',   max: 15 },
                { key: 'cartons_jaunes', label: 'CJ',       max: 10 },
                { key: 'cartons_rouges', label: 'CR',       max: 3  },
              ],
              Attaquant: [
                { key: 'matchs',         label: 'Matchs',   max: 40 },
                { key: 'buts',           label: 'Buts',     max: 30 },
                { key: 'passes',         label: 'Passes',   max: 15 },
                { key: 'cartons_jaunes', label: 'CJ',       max: 10 },
                { key: 'cartons_rouges', label: 'CR',       max: 3  },
              ],
            };
            const axes = AXES_BY_POSTE[joueur.poste] || AXES_BY_POSTE.Milieu;

            return (
              <div>
                <div style={{
                  fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase',
                  letterSpacing: '0.1em', fontWeight: 700, marginBottom: 12,
                }}>
                  Profil statistique
                </div>
                <StatRadar axes={axes} data={joueur.stats} color={color} />

                {/* Barres horizontales */}
                <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {[
                    { key: 'matchs', label: 'Matchs joués',  icon: '📊', max: 40 },
                    { key: 'buts',   label: 'Buts',          icon: '⚽', max: joueur.poste === 'Attaquant' ? 30 : 15 },
                    { key: 'passes', label: 'Passes déc.',   icon: '🎯', max: 15 },
                  ].map(({ key, label, icon, max }) => {
                    const val = joueur.stats[key] ?? 0;
                    const pct = Math.min(val / max * 100, 100);
                    return (
                      <div key={key}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 4, color: 'var(--text-dim)' }}>
                          <span>{icon} {label}</span>
                          <span style={{ color, fontWeight: 700 }}>{val}</span>
                        </div>
                        <div style={{ height: 6, background: 'var(--bg3)', borderRadius: 4, overflow: 'hidden' }}>
                          <div style={{
                            height: '100%', width: `${pct}%`,
                            background: `linear-gradient(90deg, ${color}80, ${color})`,
                            borderRadius: 4,
                            transition: 'width 0.6s cubic-bezier(.4,0,.2,1)',
                          }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })()}
        </div>

        {isAdmin && (
          <div style={{ padding: '0 20px 20px' }}>
            <button
              onClick={() => onEdit(joueur)}
              style={{
                width: '100%', padding: '11px 0', background: color,
                border: 'none', borderRadius: 10, color: '#fff',
                fontSize: 14, fontWeight: 700, cursor: 'pointer',
              }}
            >
              ✏️ Modifier
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
