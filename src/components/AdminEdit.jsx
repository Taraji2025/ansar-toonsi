import { useState } from 'react';

const R = '#e70013';
const POSTE_COLOR = {
  Gardien: '#f59e0b', Défenseur: '#3b82f6', Milieu: '#22c55e', Attaquant: '#e70013',
};

function Stepper({ value, onChange, min = 0, max = 20 }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
      <button
        onClick={() => onChange(Math.max(min, value - 1))}
        style={{ width: 32, height: 32, background: '#0d0d1a', border: '1px solid #1e1e30', borderRadius: '8px 0 0 8px', color: '#888', fontSize: 16, cursor: 'pointer' }}
      >−</button>
      <div style={{ width: 40, height: 32, background: '#07070f', border: '1px solid #1e1e30', borderTop: '1px solid #1e1e30', borderBottom: '1px solid #1e1e30', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, fontWeight: 800, color: '#fff' }}>
        {value}
      </div>
      <button
        onClick={() => onChange(Math.min(max, value + 1))}
        style={{ width: 32, height: 32, background: '#0d0d1a', border: '1px solid #1e1e30', borderRadius: '0 8px 8px 0', color: '#888', fontSize: 16, cursor: 'pointer' }}
      >+</button>
    </div>
  );
}

function ToggleBtn({ active, color = '#888', onClick, children, style = {} }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '8px 14px', borderRadius: 10, cursor: 'pointer', fontWeight: 700,
        fontSize: 12, fontFamily: 'inherit',
        background: active ? color + '22' : '#07070f',
        border: `1px solid ${active ? color : '#1e1e30'}`,
        color: active ? color : '#444',
        transition: 'all 0.15s',
        ...style,
      }}
    >{children}</button>
  );
}

function Label({ children }) {
  return (
    <div style={{ fontSize: 9, color: '#444', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8, fontWeight: 700 }}>
      {children}
    </div>
  );
}

function Row({ label, children }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <Label>{label}</Label>
      {children}
    </div>
  );
}

export default function AdminEdit({ joueur, onClose, onSave }) {
  const dm = joueur.dernier_match || {};
  const stats = joueur.stats || {};
  const color = POSTE_COLOR[joueur.poste] || R;

  const [tab, setTab] = useState('match');

  // ── Dernier match state ──
  const [joue, setJoue]           = useState(dm.joue ?? null);
  const [titulaire, setTitulaire] = useState(dm.titulaire ?? true);
  const [minutes, setMinutes]     = useState(dm.minutes ?? 90);
  const [buts, setButs]           = useState(dm.buts ?? 0);
  const [passes, setPasses]       = useState(dm.passes_decisives ?? 0);
  const [cJaune, setCJaune]       = useState(dm.carton_jaune ?? false);
  const [cRouge, setCRouge]       = useState(dm.carton_rouge ?? false);
  const [blesse, setBlesse]       = useState(dm.blesse ?? false);
  const [note, setNote]           = useState(dm.note ?? '');

  // ── Photo state ──
  const [url, setUrl]       = useState(joueur.photo || '');
  const [preview, setPreview] = useState(joueur.photo || '');
  const [imgOk, setImgOk]   = useState(!!joueur.photo);

  // ── Stats saison state ──
  const [sMatchs, setSMatchs]     = useState(stats.matchs ?? 0);
  const [sButs, setSButs]         = useState(stats.buts ?? 0);
  const [sPasses, setSPasses]     = useState(stats.passes ?? 0);
  const [sCJ, setSCJ]             = useState(stats.cartons_jaunes ?? 0);
  const [sCR, setSCR]             = useState(stats.cartons_rouges ?? 0);

  function handleSave() {
    const updated = {
      ...joueur,
      photo: imgOk ? url : joueur.photo,
      dernier_match: {
        joue,
        titulaire: joue ? titulaire : null,
        minutes:   joue ? minutes : null,
        buts:      joue ? buts : 0,
        passes_decisives: joue ? passes : 0,
        carton_jaune: joue ? cJaune : false,
        carton_rouge: joue ? cRouge : false,
        blesse,
        note: joue && note !== '' ? +note : null,
      },
      stats: {
        matchs: sMatchs,
        buts: sButs,
        passes: sPasses,
        cartons_jaunes: sCJ,
        cartons_rouges: sCR,
      },
    };
    onSave(updated);
  }

  const TABS = [
    { key: 'match', label: '⚽ Match' },
    { key: 'photo', label: '📷 Photo' },
    { key: 'saison', label: '📊 Saison' },
  ];

  const inputStyle = {
    background: '#07070f', border: '1px solid #1e1e30',
    borderRadius: 10, color: '#f0f0f0', fontSize: 13,
    padding: '9px 12px', outline: 'none',
    fontFamily: 'inherit', width: '100%', boxSizing: 'border-box',
  };

  return (
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.94)', zIndex: 400, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div style={{
        background: '#0f0f1e', border: '1px solid #1a1a2e',
        borderTop: `3px solid ${color}`,
        borderRadius: 20, width: '100%', maxWidth: 460,
        maxHeight: '92vh', overflowY: 'auto',
        boxShadow: '0 24px 64px rgba(0,0,0,0.9)',
      }}>

        {/* Header */}
        <div style={{ padding: '20px 22px 16px', borderBottom: '1px solid #14142a', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 800, color: '#fff' }}>✏️ {joueur.nom}</div>
            <div style={{ fontSize: 10, color: '#333', marginTop: 3 }}>{joueur.club} · {joueur.poste}</div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#333', cursor: 'pointer', fontSize: 24 }}>×</button>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 4, padding: '12px 22px', borderBottom: '1px solid #14142a' }}>
          {TABS.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)} style={{
              flex: 1, padding: '8px 0', borderRadius: 10, cursor: 'pointer',
              fontFamily: 'inherit', fontSize: 11, fontWeight: 700,
              background: tab === t.key ? color + '22' : 'transparent',
              border: `1px solid ${tab === t.key ? color : '#1e1e30'}`,
              color: tab === t.key ? color : '#444',
              transition: 'all 0.15s',
            }}>{t.label}</button>
          ))}
        </div>

        <div style={{ padding: '20px 22px' }}>

          {/* ══ TAB MATCH ══ */}
          {tab === 'match' && (
            <>
              <Row label="A joué dans le dernier match ?">
                <div style={{ display: 'flex', gap: 6 }}>
                  <ToggleBtn active={joue === true}  color="#22c55e" onClick={() => setJoue(true)}>✓ Oui</ToggleBtn>
                  <ToggleBtn active={joue === false} color="#e70013" onClick={() => setJoue(false)}>✗ Non</ToggleBtn>
                  <ToggleBtn active={joue === null}  color="#555"    onClick={() => setJoue(null)}>? Inconnu</ToggleBtn>
                </div>
              </Row>

              {joue === true && (
                <>
                  <Row label="Statut">
                    <div style={{ display: 'flex', gap: 6 }}>
                      <ToggleBtn active={titulaire === true}  color="#3b82f6" onClick={() => setTitulaire(true)}>▶ Titulaire</ToggleBtn>
                      <ToggleBtn active={titulaire === false} color="#f59e0b" onClick={() => setTitulaire(false)}>⬆ Remplaçant</ToggleBtn>
                    </div>
                  </Row>

                  <Row label="Minutes jouées">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <input
                        type="number" min="1" max="120"
                        value={minutes}
                        onChange={e => setMinutes(+e.target.value)}
                        style={{ ...inputStyle, width: 90 }}
                      />
                      <span style={{ fontSize: 11, color: '#444' }}>minutes</span>
                    </div>
                  </Row>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 18 }}>
                    <div>
                      <Label>Buts</Label>
                      <Stepper value={buts} onChange={setButs} max={10} />
                    </div>
                    <div>
                      <Label>Passes décisives</Label>
                      <Stepper value={passes} onChange={setPasses} max={10} />
                    </div>
                  </div>

                  <Row label="Cartons">
                    <div style={{ display: 'flex', gap: 6 }}>
                      <ToggleBtn active={cJaune} color="#f59e0b" onClick={() => setCJaune(v => !v)}>🟨 Jaune</ToggleBtn>
                      <ToggleBtn active={cRouge} color="#e70013" onClick={() => setCRouge(v => !v)}>🟥 Rouge</ToggleBtn>
                    </div>
                  </Row>

                  <Row label="Note (sur 10)">
                    <input
                      type="number" min="1" max="10" step="0.1"
                      value={note}
                      onChange={e => setNote(e.target.value)}
                      placeholder="ex: 7.5"
                      style={{ ...inputStyle, width: 100 }}
                    />
                  </Row>
                </>
              )}

              <Row label="Statut physique">
                <ToggleBtn active={blesse} color="#e70013" onClick={() => setBlesse(v => !v)}>
                  🏥 Blessé / Absent prochains matchs
                </ToggleBtn>
              </Row>
            </>
          )}

          {/* ══ TAB PHOTO ══ */}
          {tab === 'photo' && (
            <>
              {/* Preview */}
              <div style={{
                width: '100%', height: 170, borderRadius: 14, marginBottom: 14,
                background: '#07070f', border: '1px solid #1a1a2e',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                overflow: 'hidden', position: 'relative',
              }}>
                {preview ? (
                  <img
                    src={preview}
                    alt={joueur.nom}
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                    onLoad={() => setImgOk(true)}
                    onError={() => setImgOk(false)}
                  />
                ) : (
                  <div style={{ fontSize: 11, color: '#333', textAlign: 'center' }}>
                    <div style={{ fontSize: 36, marginBottom: 6 }}>🖼️</div>
                    Aperçu
                  </div>
                )}
                {preview && !imgOk && (
                  <div style={{ position: 'absolute', inset: 0, background: '#07070f', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ fontSize: 11, color: R, textAlign: 'center' }}>
                      <div style={{ fontSize: 28, marginBottom: 6 }}>⚠️</div>
                      Image inaccessible
                    </div>
                  </div>
                )}
              </div>

              <Row label="URL de la photo">
                <div style={{ display: 'flex', gap: 8 }}>
                  <input
                    value={url}
                    onChange={e => setUrl(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && setPreview(url)}
                    placeholder="https://..."
                    style={inputStyle}
                  />
                  <button
                    onClick={() => { setPreview(url); setImgOk(false); }}
                    style={{ padding: '9px 12px', background: '#1a1a2e', border: '1px solid #2a2a40', borderRadius: 10, color: '#888', fontSize: 12, cursor: 'pointer', whiteSpace: 'nowrap', fontFamily: 'inherit' }}
                  >Tester</button>
                </div>
              </Row>

              {joueur.photo && (
                <button
                  onClick={() => { setUrl(''); setPreview(''); setImgOk(false); }}
                  style={{ fontSize: 11, color: R, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                >
                  🗑️ Supprimer la photo actuelle
                </button>
              )}
            </>
          )}

          {/* ══ TAB SAISON ══ */}
          {tab === 'saison' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {[
                { label: 'Matchs joués',    val: sMatchs, set: setSMatchs },
                { label: 'Buts',            val: sButs,   set: setSButs },
                { label: 'Passes décisives',val: sPasses, set: setSPasses },
                { label: 'Cartons jaunes',  val: sCJ,     set: setSCJ },
                { label: 'Cartons rouges',  val: sCR,     set: setSCR },
              ].map(({ label, val, set }) => (
                <div key={label}>
                  <Label>{label}</Label>
                  <Stepper value={val} onChange={set} max={99} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div style={{ padding: '0 22px 22px', display: 'flex', gap: 8 }}>
          <button onClick={onClose} style={{
            flex: 1, padding: '12px', background: 'transparent',
            border: '1px solid #1e1e30', borderRadius: 12,
            color: '#444', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit',
          }}>Annuler</button>
          <button onClick={handleSave} style={{
            flex: 2, padding: '12px',
            background: `linear-gradient(135deg, ${color}, ${color}bb)`,
            border: 'none', borderRadius: 12, color: '#fff',
            fontSize: 13, fontWeight: 800, cursor: 'pointer',
            boxShadow: `0 4px 20px ${color}50`, fontFamily: 'inherit',
          }}>Enregistrer</button>
        </div>
      </div>
    </div>
  );
}
