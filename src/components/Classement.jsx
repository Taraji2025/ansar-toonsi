const CATEGORIES = [
  { key: 'buts',           label: 'Top Buteurs',   icon: '⚽', color: '#e70013' },
  { key: 'passes',         label: 'Top Passeurs',  icon: '🎯', color: '#3b82f6' },
  { key: 'matchs',         label: 'Top Temps jeu', icon: '📊', color: '#22c55e' },
  { key: 'clean_sheets',   label: 'Clean Sheets',  icon: '🧤', color: '#f59e0b' },
  { key: 'cartons_jaunes', label: 'Cartons J.',    icon: '🟨', color: '#eab308' },
];

const POSTE_COLOR = {
  Gardien:   '#f59e0b',
  Défenseur: '#3b82f6',
  Milieu:    '#22c55e',
  Attaquant: '#e70013',
};

const MEDAILLE = ['🥇', '🥈', '🥉'];

export default function Classement({ joueurs }) {
  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 20px' }}>

      {/* En-tête */}
      <div style={{ marginBottom: 24, textAlign: 'center' }}>
        <div style={{ fontSize: 28, fontWeight: 900, color: '#fff', letterSpacing: -1 }}>
          🏆 Classements
        </div>
        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>
          Saison 2025-26 · Top 10 par catégorie
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 340px), 1fr))', gap: 20 }}>
        {CATEGORIES.map(cat => {
          const top = [...joueurs]
            .filter(j => j.stats[cat.key] > 0)
            .sort((a, b) => b.stats[cat.key] - a.stats[cat.key])
            .slice(0, 10);

          return (
            <div key={cat.key} style={{
              background: 'var(--bg2)',
              border: '1px solid var(--border)',
              borderRadius: 14,
              overflow: 'hidden',
            }}>
              {/* Header catégorie */}
              <div style={{
                padding: '14px 16px',
                borderBottom: '1px solid var(--border)',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                background: cat.color + '12',
              }}>
                <span style={{ fontSize: 22 }}>{cat.icon}</span>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 800, color: '#fff' }}>{cat.label}</div>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>
                    {top.length > 0 ? `${top.length} joueur${top.length > 1 ? 's' : ''}` : 'Aucune donnée'}
                  </div>
                </div>
              </div>

              {/* Lignes */}
              {top.length === 0 ? (
                <div style={{ padding: '24px 16px', textAlign: 'center', color: 'var(--text-muted)', fontSize: 12 }}>
                  Aucune statistique enregistrée
                </div>
              ) : (
                <div>
                  {top.map((j, i) => {
                    const initiales = j.nom.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
                    const pColor = POSTE_COLOR[j.poste] || '#fff';
                    const isTop3 = i < 3;

                    return (
                      <div key={j.id} style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                        padding: '10px 16px',
                        borderBottom: i < top.length - 1 ? '1px solid var(--border)' : 'none',
                        background: isTop3 ? cat.color + '08' : 'transparent',
                        transition: 'background 0.15s',
                      }}>
                        {/* Rang */}
                        <div style={{
                          width: 28,
                          textAlign: 'center',
                          fontSize: isTop3 ? 18 : 12,
                          fontWeight: 800,
                          color: isTop3 ? cat.color : 'var(--text-muted)',
                          flexShrink: 0,
                        }}>
                          {MEDAILLE[i] || i + 1}
                        </div>

                        {/* Avatar */}
                        <div style={{
                          width: 36,
                          height: 36,
                          borderRadius: '50%',
                          background: pColor + '20',
                          border: `2px solid ${pColor}`,
                          color: pColor,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 12,
                          fontWeight: 800,
                          flexShrink: 0,
                          overflow: 'hidden',
                        }}>
                          {j.photo
                            ? <img src={j.photo} alt={j.nom} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            : initiales
                          }
                        </div>

                        {/* Nom + club */}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{
                            fontSize: 13, fontWeight: 700, color: '#fff',
                            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                          }}>
                            {j.nom}
                          </div>
                          <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>
                            {j.club}
                          </div>
                        </div>

                        {/* Valeur */}
                        <div style={{
                          fontSize: 22,
                          fontWeight: 900,
                          color: isTop3 ? cat.color : 'var(--text-dim)',
                          flexShrink: 0,
                        }}>
                          {j.stats[cat.key]}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}

        {/* Card résumé niveaux */}
        <div style={{
          background: 'var(--bg2)',
          border: '1px solid var(--border)',
          borderRadius: 14,
          overflow: 'hidden',
        }}>
          <div style={{
            padding: '14px 16px',
            borderBottom: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            background: '#8b5cf612',
          }}>
            <span style={{ fontSize: 22 }}>📊</span>
            <div>
              <div style={{ fontSize: 14, fontWeight: 800, color: '#fff' }}>Répartition</div>
              <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>Par niveau et poste</div>
            </div>
          </div>

          <div style={{ padding: '16px' }}>
            {/* Par niveau */}
            <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>
              Par niveau
            </div>
            {['Senior', 'U23', 'U20', 'U19', 'U17', 'Réserve'].map(niv => {
              const count = joueurs.filter(j => j.niveau === niv).length;
              const pct = Math.round(count / joueurs.length * 100);
              const NCOL = { Senior:'#e70013', U23:'#8b5cf6', U20:'#3b82f6', U19:'#22c55e', U17:'#f59e0b', Réserve:'#6b7280' };
              return (
                <div key={niv} style={{ marginBottom: 8 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 4, color: 'var(--text-dim)' }}>
                    <span>{niv}</span>
                    <span style={{ color: NCOL[niv], fontWeight: 700 }}>{count}</span>
                  </div>
                  <div style={{ height: 5, background: 'var(--bg3)', borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${pct}%`, background: NCOL[niv], borderRadius: 3, transition: 'width 0.5s ease' }} />
                  </div>
                </div>
              );
            })}

            <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10, marginTop: 16 }}>
              Par poste
            </div>
            {['Gardien', 'Défenseur', 'Milieu', 'Attaquant'].map(p => {
              const count = joueurs.filter(j => j.poste === p).length;
              const pct = Math.round(count / joueurs.length * 100);
              return (
                <div key={p} style={{ marginBottom: 8 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 4, color: 'var(--text-dim)' }}>
                    <span>{p}</span>
                    <span style={{ color: POSTE_COLOR[p], fontWeight: 700 }}>{count}</span>
                  </div>
                  <div style={{ height: 5, background: 'var(--bg3)', borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${pct}%`, background: POSTE_COLOR[p], borderRadius: 3 }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
